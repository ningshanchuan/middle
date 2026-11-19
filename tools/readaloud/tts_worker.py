#!/usr/bin/env python3
"""Genius Classroom read-aloud worker - runs on the TTS PC (Windows, Python 3.10+, ffmpeg, git, an NVIDIA GPU).

DRAFT: written on the content PC, which has no Python - so it has not been run yet. Start with the self-test in HANDOFF.md.

It downloads the lesson transcripts the site publishes (https://shanchuan.org/middle/readaloud/), records every clip with
Qwen3-TTS (voice Serena) ONE AT A TIME, saves MP3s into the audio repos (one folder per lesson), writes each lesson's
manifest.js + status, pushes, waits for GitHub Pages and checks the live files byte for byte.

  python tts_worker.py init                 write tts_config.json (edit it), check git / ffmpeg / repos
  python tts_worker.py test-voice           record two test sentences (en + zh) -> <root>/_test/*.wav, print their pace
  python tts_worker.py migrate              one-time: copy the site's current MP3s into the lesson folders (no TTS)
  python tts_worker.py run                  record lesson by lesson, push + verify each finished lesson, then exit
  python tts_worker.py run --loop           ... and keep going: check for new or changed lessons every poll_minutes
  python tts_worker.py status               print each repo's lesson labels (also in <repo>/status/STATUS.md)
Options: --lesson biology/cell-theory (only that lesson)  --fake (no model: a quiet tone of the right length, for testing)
         --no-push (commit locally only)  --config path
"""
import argparse, datetime, hashlib, json, multiprocessing as mp, os, random, re, shutil, subprocess, sys, tempfile, time
import urllib.error, urllib.request, wave
from pathlib import Path

HERE = Path(__file__).resolve().parent
DEFAULT_CONFIG = {
    "root": "D:/gc-audio",                       # the audio repos are cloned here: <root>/<repo name>/
    "transcripts": "https://shanchuan.org/middle/readaloud/",
    "old_audio": "https://shanchuan.org/middle/audio/",   # migrate: where the current MP3s are (<lang>/<key>.mp3)
    "model": "Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice",     # check the name of the model you installed
    "device": "cuda:0",
    "speaker": "Serena",                         # the user chose serena for BOTH languages; no style instructions; normal speed
    "kbps": 48, "sample_rate": 24000,            # MP3, mono, 24 kHz, 48 kbps ("good enough, leaning good")
    "max_tries": 4,                              # then the clip is labelled failed and the worker moves on
    "timeout_short_s": 75,                       # a text under 40 characters that takes longer is stuck
    "timeout_per_char_s": {"en": 0.6, "zh": 2.0},   # longer texts: 180 s + this per character
    "cooldown_after_crash_s": 120,               # after a hang / CUDA error: wait, then reload the model
    "push_every": 100,                           # also push in the middle of a big lesson (e.g. _shared) every N new clips
    "poll_minutes": 30,
    "retry_failed_after_hours": 12,
    "hold": [],                                  # clips never to send, e.g. "en:39ecd1af" (hung the old server)
    "ffmpeg": "ffmpeg", "git": "git",
}
LANG_NAME = {"en": "English", "zh": "Chinese"}
PACE = {"en": (7.0, 22.0), "zh": (2.8, 9.0)}     # characters per second of a normal recording (outside = garbled/cut)
UA = {"User-Agent": "gc-readaloud-worker/1", "Cache-Control": "no-cache"}


def now():
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def log(*a):
    print(f"[{now()}]", *a, flush=True)


# ------------------------------------------------------------------------------------------------------------------
# Qwen3-TTS: ADAPT THESE TWO FUNCTIONS to the package you installed (read its README). They run in a child process, so
# a CUDA error or a hang only kills the child; the parent waits, reloads the model and goes on.
#  - speaker Serena, language English/Chinese, NO instruct / style text, normal speed
#  - cap the generation length if the package allows it (e.g. max_new_tokens), so a text can never generate forever
#    (on the old server the single word "mitochondria." never stopped and then the GPU crashed)
# ------------------------------------------------------------------------------------------------------------------
def load_model(cfg):
    import torch
    from qwen_tts import Qwen3TTSModel           # ADAPT: import of the installed package
    return Qwen3TTSModel.from_pretrained(cfg["model"], device_map=cfg["device"], dtype=torch.bfloat16)


def synthesize(model, cfg, text, lang):
    """Return (samples, sample_rate); samples = 1-D float array in [-1, 1] or int16."""
    wavs, sr = model.generate_custom_voice(       # ADAPT: call + arguments of the installed package
        text=text, language=LANG_NAME[lang], speaker=cfg["speaker"])
    return wavs[0], sr


def synth_child(conn, cfg):
    import numpy as np
    try:
        model = load_model(cfg)
    except Exception as e:                       # noqa: BLE001
        conn.send(("dead", f"model load failed: {e!r}"))
        return
    conn.send(("ready", None))
    while True:
        msg = conn.recv()
        if msg is None:
            return
        text, lang = msg
        try:
            a, sr = synthesize(model, cfg, text, lang)
            a = np.asarray(a).reshape(-1)
            if a.dtype != np.int16:
                a = (np.clip(a.astype("float32"), -1.0, 1.0) * 32767.0).astype("<i2")
            conn.send(("ok", (a.astype("<i2").tobytes(), int(sr))))
        except Exception as e:                   # noqa: BLE001
            conn.send(("err", repr(e)))
            if "CUDA" in repr(e) or "cuda" in repr(e):
                return                           # GPU context is broken: let the parent restart us


class Hang(Exception):
    pass


class ModelLoadError(Exception):
    """the model cannot be loaded at all: stop the worker (do not label thousands of clips 'failed')"""


class Synth:
    """Serial queue: one request at a time, model kept in a child process."""

    def __init__(self, cfg, fake=False):
        self.cfg, self.fake, self.proc, self.conn = cfg, fake, None, None

    def _start(self):
        parent, child = mp.Pipe()
        self.proc = mp.Process(target=synth_child, args=(child, self.cfg), daemon=True)
        self.proc.start()
        self.conn = parent
        log("loading the model ...")
        if not parent.poll(900):
            self.stop()
            raise ModelLoadError("model did not load in 15 min")
        kind, info = parent.recv()
        if kind != "ready":
            self.stop()
            raise ModelLoadError(info)
        log("model ready")

    def stop(self):
        if self.proc is not None:
            try:
                self.conn.send(None)
            except Exception:                    # noqa: BLE001
                pass
            self.proc.join(5)
            if self.proc.is_alive():
                self.proc.kill()
                self.proc.join(5)
        self.proc = self.conn = None

    def say(self, text, lang, timeout):
        """-> (pcm int16 little-endian bytes, sample rate)"""
        if self.fake:
            return fake_pcm(text, lang), 24000
        if self.proc is None or not self.proc.is_alive():
            self._start()
        self.conn.send((text, lang))
        if not self.conn.poll(timeout):
            self.stop()                          # kill the stuck child; a fresh one is started for the next clip
            raise Hang(f"no audio after {timeout:.0f} s")
        kind, data = self.conn.recv()
        if kind == "ok":
            return data
        if not self.proc.is_alive():
            self.stop()
        raise RuntimeError(data)


def fake_pcm(text, lang):
    import math
    sec = max(0.6, len(text) / (14.0 if lang == "en" else 4.5))
    n = int(24000 * sec)
    return b"".join(int(800 * math.sin(i * 0.05)).to_bytes(2, "little", signed=True) for i in range(n))


# ------------------------------------------------------------------------------------------------------------------
# helpers: config, download, mp3, git
# ------------------------------------------------------------------------------------------------------------------
def load_config(path):
    cfg = dict(DEFAULT_CONFIG)
    if path.exists():
        cfg.update(json.loads(path.read_text(encoding="utf-8")))
    return cfg


def fetch(url, tries=5):
    sep = "&" if "?" in url else "?"
    for a in range(1, tries + 1):
        try:
            req = urllib.request.Request(f"{url}{sep}v={random.randint(0, 10**9)}", headers=UA)
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            if a == tries:
                raise
        except Exception:                        # noqa: BLE001
            if a == tries:
                raise
        time.sleep(5 * a)


def fp12(b):
    return hashlib.sha1(b).hexdigest()[:12]


def to_mp3(cfg, pcm, sr, dst):
    dst.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as td:
        wav = Path(td) / "a.wav"
        with wave.open(str(wav), "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(pcm)
        part = dst.with_suffix(".part.mp3")
        subprocess.run([cfg["ffmpeg"], "-y", "-hide_banner", "-loglevel", "error", "-i", str(wav), "-ac", "1",
                        "-ar", str(cfg["sample_rate"]), "-c:a", "libmp3lame", "-b:a", f"{cfg['kbps']}k", str(part)],
                       check=True)
        b = part.read_bytes()
        if len(b) < 400 or not (b[:3] == b"ID3" or (b[0] == 0xFF and (b[1] & 0xE0) == 0xE0)):
            raise RuntimeError("ffmpeg produced no MP3")
        os.replace(part, dst)


def git(cfg, repo, *args, check=True):
    r = subprocess.run([cfg["git"], "-C", str(repo), *args], capture_output=True, text=True, encoding="utf-8")
    if check and r.returncode:
        raise RuntimeError(f"git {' '.join(args)}: {r.stderr.strip() or r.stdout.strip()}")
    return r


def push(cfg, repo, message, no_push):
    git(cfg, repo, "add", "-A")
    if not git(cfg, repo, "status", "--porcelain").stdout.strip():
        return False
    git(cfg, repo, "commit", "-q", "-m", message)
    if no_push:
        return True
    for a in range(1, 6):
        if git(cfg, repo, "push", "-q", "origin", "HEAD:main", check=False).returncode == 0:
            return True
        git(cfg, repo, "pull", "-q", "--rebase", "origin", "main", check=False)
        time.sleep(10 * a)
    raise RuntimeError(f"push failed: {repo}")


# ------------------------------------------------------------------------------------------------------------------
# one audio repo: <root>/<name>/<subject>/<topic>/<lang>/<key>.mp3 + manifest.js, status/
# ------------------------------------------------------------------------------------------------------------------
LEDGER_HEAD = "lang\tkey\tlesson\tvoice\tkbps\tdate\tsource\n"


class Repo:
    def __init__(self, name, path, url):
        self.name, self.path, self.url = name, Path(path), url
        self.status = self.path / "status"
        if not (self.path / ".git").exists():
            raise SystemExit(f"{self.path} is not a git clone - clone https://github.com/gladcolor/{name}.git there first")
        self.status.mkdir(exist_ok=True)
        (self.path / ".nojekyll").touch()        # GitHub Pages must not run Jekyll (it would hide the _shared folder)
        self.ledger = {}                         # (lesson, lang, key) -> row dict: clips recorded in serena
        lp = self.status / "ledger.tsv"
        if lp.exists():
            for line in lp.read_text(encoding="utf-8").splitlines()[1:]:
                p = line.split("\t")
                if len(p) >= 7:
                    self.ledger[(p[2], p[0], p[1])] = dict(zip(LEDGER_HEAD.strip().split("\t"), p))
        self.failed = {}                         # (lesson, lang, key) -> (tries, error, date)
        fp = self.status / "failed.tsv"
        if fp.exists():
            for line in fp.read_text(encoding="utf-8").splitlines()[1:]:
                p = line.split("\t")
                if len(p) >= 6:
                    self.failed[(p[2], p[0], p[1])] = (p[3], p[4], p[5])
        sp = self.status / "lessons.json"
        self.lessons = json.loads(sp.read_text(encoding="utf-8")) if sp.exists() else {}

    def add_ledger(self, lesson, lang, key, kbps, source):
        row = {"lang": lang, "key": key, "lesson": lesson, "voice": "serena", "kbps": str(kbps), "date": now(), "source": source}
        self.ledger[(lesson, lang, key)] = row
        self.failed.pop((lesson, lang, key), None)

    def save(self):
        rows = sorted(self.ledger.values(), key=lambda r: (r["lesson"], r["lang"], r["key"]))
        (self.status / "ledger.tsv").write_text(LEDGER_HEAD + "".join(
            "\t".join(r[c] for c in LEDGER_HEAD.strip().split("\t")) + "\n" for r in rows), encoding="utf-8", newline="\n")
        (self.status / "failed.tsv").write_text("lang\tkey\tlesson\ttries\terror\tdate\n" + "".join(
            f"{k[1]}\t{k[2]}\t{k[0]}\t{v[0]}\t{v[1]}\t{v[2]}\n" for k, v in sorted(self.failed.items())),
            encoding="utf-8", newline="\n")
        (self.status / "lessons.json").write_text(json.dumps(self.lessons, ensure_ascii=False, indent=1, sort_keys=True) + "\n",
                                                  encoding="utf-8", newline="\n")
        lines = ["# Read-aloud status: " + self.name, "", f"Updated {now()}. Labels: finished / in progress / no audio / "
                 "failed / old voice / out of date. Clips: done = serena, old = older voice, missing = browser voice.", "",
                 "| lesson | label | done | old | missing | failed | held | updated | live check |",
                 "|---|---|---|---|---|---|---|---|---|"]
        for lid in sorted(self.lessons):
            s = self.lessons[lid]; c = s.get("counts", {})
            lines.append(f"| {lid} | {s.get('label', '')} | {c.get('done', 0)} | {c.get('old', 0)} | {c.get('missing', 0)} | "
                         f"{c.get('failed', 0)} | {c.get('held', 0)} | {s.get('updated', '')} | {s.get('verified', '')} |")
        (self.status / "STATUS.md").write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")


def label_of(c, out_of_date=False):
    if out_of_date:
        return "out of date"
    if c["total"] and c["done"] == c["total"]:
        return "finished"
    if c["failed"]:
        return "failed"
    if c["missing"] and not c["done"]:
        return "no audio"
    if c["done"]:
        return "in progress"
    return "old voice"


# ------------------------------------------------------------------------------------------------------------------
# the work
# ------------------------------------------------------------------------------------------------------------------
class Worker:
    def __init__(self, cfg, args):
        self.cfg, self.args = cfg, args
        self.synth = Synth(cfg, fake=args.fake)
        self.root = Path(cfg["root"])
        self.repos = {}
        self.hold = set(cfg.get("hold", []))
        self.new_since_push = 0
        self.sidx = None
        self.migrated_serena = {"en": set(), "zh": set()}

    def index(self):
        b = fetch(self.cfg["transcripts"] + "index.json")
        if b is None:
            raise SystemExit("cannot download readaloud/index.json")
        ix = json.loads(b.decode("utf-8"))
        for name, url in ix["repos"].items():
            if name not in self.repos and (self.root / name).exists():
                self.repos[name] = Repo(name, self.root / name, url)
        entries = list(ix["lessons"]) + [dict(ix["shared"], en="shared clips", zh="shared clips", url="")]
        missing = sorted({e["repo"] for e in entries} - set(self.repos))
        if missing:
            raise SystemExit("clone these repos into " + str(self.root) + ": " + ", ".join(missing))
        return entries

    def serena_file(self, lang, key):
        """a serena recording of this clip anywhere (any lesson, any repo) -> (path, kbps), or None"""
        if self.sidx is None:                              # (lang, key) -> [(path, kbps)], built once, kept up to date by add()
            self.sidx = {}
            for r in self.repos.values():
                for (lesson, lg, k), row in r.ledger.items():
                    self.sidx.setdefault((lg, k), []).append((r.path / lesson / lg / f"{k}.mp3", int(row.get("kbps") or 0)))
        for p, kb in self.sidx.get((lang, key), []):
            if p.exists():
                return p, kb
        return None

    def add(self, repo, lesson, lang, key, kbps, source):
        repo.add_ledger(lesson, lang, key, kbps, source)
        if self.sidx is not None:
            self.sidx.setdefault((lang, key), []).append((repo.path / lesson / lang / f"{key}.mp3", int(kbps)))

    def record(self, clip):
        lang, send = clip["lang"], clip["send"]
        short = len(send) < 40
        timeout = self.cfg["timeout_short_s"] if short else 180 + self.cfg["timeout_per_char_s"][lang] * len(send)
        err = ""
        for a in range(1, self.cfg["max_tries"] + 1):
            text = send
            if a >= 2 and lang == "en" and short:    # same words written a little differently (a stuck model often recovers)
                cap = send[:1].upper() + send[1:]
                text = [send, cap, send.rstrip(". "), cap.rstrip(". ") + "!", cap][min(a - 1, 4)]
            try:
                pcm, sr = self.synth.say(text, lang, timeout)
            except ModelLoadError:
                raise
            except Hang as e:
                err = str(e); log(f"  HANG {lang}:{clip['key']} try {a}: {err}; cooling down")
                time.sleep(self.cfg["cooldown_after_crash_s"]); continue
            except Exception as e:                    # noqa: BLE001
                err = str(e)[:200]; log(f"  ERR {lang}:{clip['key']} try {a}: {err}")
                if self.synth.proc is None:
                    time.sleep(self.cfg["cooldown_after_crash_s"])
                continue
            sec = len(pcm) / 2 / sr
            cps = len(send) / max(sec, 0.1)
            lo, hi = PACE[lang]
            if len(send) >= 8 and not (lo <= cps <= hi) and a < self.cfg["max_tries"] and not self.args.fake:
                err = f"odd length {sec:.1f}s for {len(send)} chars"; log(f"  {err} -> again"); continue
            return pcm, sr, sec
        raise RuntimeError(err or "failed")

    def do_lesson(self, e, mode):
        lid, repo = e["id"], self.repos[e["repo"]]
        st = repo.lessons.get(lid, {})
        b = fetch(self.cfg["transcripts"] + lid + ".json")
        if b is None or fp12(b) != e["fingerprint"]:
            log(f"{lid}: transcript not available yet (Pages still deploying?) - later"); return
        tr = json.loads(b.decode("utf-8"))
        want = {(c["lang"], c["key"]): c for c in tr["clips"]}
        ldir = repo.path / lid
        changed = 0
        for lang in ("en", "zh"):                         # orphans: clips of old versions of edited texts
            d = ldir / lang
            if d.exists():
                for f in d.glob("*.mp3"):
                    if (lang, f.stem) not in want:
                        f.unlink(); changed += 1
                        repo.ledger.pop((lid, lang, f.stem), None)
        recorded = 0
        for (lang, key), c in want.items():
            dst = ldir / lang / f"{key}.mp3"
            if (lid, lang, key) in repo.ledger and dst.exists():
                continue
            found = self.serena_file(lang, key)            # same text recorded for another lesson: copy it
            if found and found[0] != dst:
                dst.parent.mkdir(parents=True, exist_ok=True); shutil.copyfile(found[0], dst)
                self.add(repo, lid, lang, key, found[1], "copy"); changed += 1; continue
            if mode == "migrate":
                if not dst.exists():
                    old = fetch(f"{self.cfg['old_audio']}{lang}/{key}.mp3")
                    if old:
                        dst.parent.mkdir(parents=True, exist_ok=True); dst.write_bytes(old); changed += 1
                if dst.exists() and key in self.migrated_serena[lang]:
                    self.add(repo, lid, lang, key, 32, "migrate"); changed += 1
                continue
            if f"{lang}:{key}" in self.hold:
                continue
            fl = repo.failed.get((lid, lang, key))
            if fl and not self.args.retry_failed:
                age = datetime.datetime.now() - datetime.datetime.strptime(fl[2], "%Y-%m-%d %H:%M:%S")
                if age.total_seconds() < 3600 * self.cfg["retry_failed_after_hours"]:
                    continue
            try:
                pcm, sr, sec = self.record(c)
                to_mp3(self.cfg, pcm, sr, dst)
                self.add(repo, lid, lang, key, self.cfg["kbps"], "tts"); changed += 1; recorded += 1
                log(f"  OK {lid} {lang}:{key} {len(c['send'])} chars {sec:.1f}s")
            except ModelLoadError:
                repo.save(); raise
            except Exception as ex:                       # noqa: BLE001
                tries = int((repo.failed.get((lid, lang, key)) or ("0",))[0]) + self.cfg["max_tries"]
                repo.failed[(lid, lang, key)] = (str(tries), str(ex)[:150].replace("\t", " "), now())
                log(f"  FAILED {lid} {lang}:{key}: {ex}")
            self.new_since_push += 1
            if self.new_since_push >= self.cfg["push_every"]:
                self.finish(repo, lid, e, want, f"{lid}: {recorded} clips so far"); self.new_since_push = 0
        if changed or st.get("fingerprint") != e["fingerprint"]:
            self.finish(repo, lid, e, want, f"{lid}: read-aloud ({mode})")
        elif st.get("label") == "finished" and not st.get("verified") and not self.args.no_push:
            self.verify(repo, lid, want)                  # pushed earlier but the live check never passed

    def finish(self, repo, lid, e, want, message):
        ldir = repo.path / lid
        keys = {"en": [], "zh": []}
        for (lang, key) in want:
            if (ldir / lang / f"{key}.mp3").exists():
                keys[lang].append(key)
        ldir.mkdir(parents=True, exist_ok=True)
        man = {"lesson": lid, "voice": "serena", "en": " ".join(sorted(keys["en"])), "zh": " ".join(sorted(keys["zh"]))}
        (ldir / "manifest.js").write_text("/* read-aloud clips of this lesson - written by tts_worker.py */\nLabAudioManifest("
                                          + json.dumps(man, ensure_ascii=False) + ");\n", encoding="utf-8", newline="\n")
        c = {"total": len(want), "done": 0, "old": 0, "missing": 0, "failed": 0, "held": 0}
        for (lang, key) in want:
            f = ldir / lang / f"{key}.mp3"
            if (lid, lang, key) in repo.ledger and f.exists(): c["done"] += 1
            elif (lid, lang, key) in repo.failed: c["failed"] += 1
            elif f"{lang}:{key}" in self.hold: c["held"] += 1
            elif f.exists(): c["old"] += 1
            else: c["missing"] += 1
        lab = label_of(c)
        repo.lessons[lid] = {"fingerprint": e["fingerprint"], "label": lab, "counts": c, "updated": now(),
                             "title": {"en": e.get("en", ""), "zh": e.get("zh", "")}, "page": e.get("url", ""),
                             "verified": ""}
        repo.save()
        pushed = push(self.cfg, repo.path, f"{message} - {lab} ({c['done']}/{c['total']} serena)", self.args.no_push)
        log(f"{lid}: {lab}  done {c['done']}/{c['total']}  old {c['old']}  missing {c['missing']}  failed {c['failed']}"
            + ("  (pushed)" if pushed and not self.args.no_push else ""))
        if lab == "finished" and pushed and not self.args.no_push:
            self.verify(repo, lid, want)

    def verify(self, repo, lid, want):
        """wait for GitHub Pages, then compare every live MP3 + the manifest with the local files"""
        t0 = time.time()
        while time.time() - t0 < 25 * 60:
            bad = 0
            m = fetch(f"{repo.url}{lid}/manifest.js")
            if m != (repo.path / lid / "manifest.js").read_bytes():
                bad = 1
            else:
                for (lang, key) in want:
                    f = repo.path / lid / lang / f"{key}.mp3"
                    if f.exists() and fetch(f"{repo.url}{lid}/{lang}/{key}.mp3") != f.read_bytes():
                        bad += 1; break
            if not bad:
                s = repo.lessons[lid]; s["verified"] = now(); repo.save(); push(self.cfg, repo.path, f"{lid}: live check ok", False)
                t = s["title"]
                log(f"VERIFIED {t.get('zh', '')} / {t.get('en', '')}  {s['page']}  ({s['counts']['done']} clips, live files match)")
                with open(self.root / "published.log", "a", encoding="utf-8") as fh:
                    fh.write(f"{now()}\t{lid}\t{s['page']}\t{s['counts']['done']}\n")
                return True
            time.sleep(30)
        log(f"NOT VERIFIED {lid}: live files still differ after 25 min (Pages slow?) - check again later")
        return False

    def needs_work(self, e):
        st = self.repos[e["repo"]].lessons.get(e["id"])
        return (not st or st.get("fingerprint") != e["fingerprint"] or st.get("label") != "finished"
                or not st.get("verified"))

    def run(self, mode):
        while True:
            entries = self.index()
            if mode == "migrate":
                self.migrated_serena = {l: set((fetch(f"{self.cfg['transcripts']}_migrate/serena_{l}.txt") or b"")
                                               .decode("utf-8").split()) for l in ("en", "zh")}
            for e in entries:
                if self.args.lesson and e["id"] != self.args.lesson:
                    continue
                if mode == "migrate" or self.needs_work(e):
                    self.do_lesson(e, mode)
            if not self.args.loop or mode == "migrate":
                break
            log(f"all lessons checked - next check in {self.cfg['poll_minutes']} min")
            time.sleep(60 * self.cfg["poll_minutes"])
        self.synth.stop()


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("command", choices=["init", "test-voice", "migrate", "run", "status"])
    ap.add_argument("--config", default=str(HERE / "tts_config.json"))
    ap.add_argument("--lesson", default="")
    ap.add_argument("--loop", action="store_true")
    ap.add_argument("--fake", action="store_true")
    ap.add_argument("--no-push", action="store_true")
    ap.add_argument("--retry-failed", action="store_true")
    args = ap.parse_args()
    cpath = Path(args.config)
    cfg = load_config(cpath)
    if args.command == "init":
        if not cpath.exists():
            cpath.write_text(json.dumps(DEFAULT_CONFIG, indent=2) + "\n", encoding="utf-8")
            print(f"wrote {cpath} - edit root / model / device, then run init again")
        for tool in (cfg["git"], cfg["ffmpeg"]):
            print(f"{tool}: {'ok' if shutil.which(tool) else 'NOT FOUND'}")
        ix = json.loads(fetch(cfg["transcripts"] + "index.json").decode("utf-8"))
        for name in ix["repos"]:
            p = Path(cfg["root"]) / name
            print(f"{name}: {'cloned at ' + str(p) if (p / '.git').exists() else 'MISSING - git clone https://github.com/gladcolor/' + name + '.git ' + str(p)}")
        print(f"transcripts: {len(ix['lessons'])} lessons + {ix['shared']['clips']} shared clips (generated {ix['generated']})")
        return
    if args.command == "test-voice":
        s = Synth(cfg, fake=args.fake)
        out = Path(cfg["root"]) / "_test"; out.mkdir(parents=True, exist_ok=True)
        for lang, text in (("en", "Diffusion moves molecules from high to low concentration, and it needs no energy."),
                           ("zh", "长安是唐朝的都城，丝绸之路从这里出发。")):
            t0 = time.time(); pcm, sr = s.say(text, lang, 300); sec = len(pcm) / 2 / sr
            with wave.open(str(out / f"test_{lang}.wav"), "wb") as w:
                w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(pcm)
            lo, hi = PACE[lang]; cps = len(text) / sec
            print(f"{lang}: {sec:.1f}s audio at {sr} Hz in {time.time() - t0:.1f}s, {cps:.1f} chars/s "
                  f"({'normal' if lo <= cps <= hi else 'ODD'}) -> {out / f'test_{lang}.wav'}")
        s.stop(); return
    w = Worker(cfg, args)
    if args.command == "status":
        w.index()
        for r in w.repos.values():
            labels = {}
            for s in r.lessons.values():
                labels[s["label"]] = labels.get(s["label"], 0) + 1
            print(f"{r.name}: " + ", ".join(f"{k} {v}" for k, v in sorted(labels.items())) + f"  -> {r.path / 'status' / 'STATUS.md'}")
        return
    w.run(args.command)


if __name__ == "__main__":
    mp.freeze_support()
    main()
