# The TTS PC's own worker (gc-audio-science tools/moss/tools/tts_worker.py) running in Google Colab as a stand-in.
# It records lessons exactly as the TTS PC does (ledger, manifest.js, timing.js, status) and commits per lesson, but does
# NOT push (--no-push): the content PC downloads git bundles of the new commits and pushes them (one writer at a time).
#   --model 8b|4b   (8b = OpenMOSS-Team/MOSS-TTS-v1.5, voice_tag "serena moss8b"; 4b = the TTS PC's model, "serena moss15")
#   --start         clone + patch + start the worker in the background (log: /content/gc-audio/worker.log)
#   --bundle        write git bundles of the commits not yet on GitHub to /content/bundles and offer them for download
#   --status        tail of the log and the commit counts
import argparse, json, os, re, shutil, subprocess, sys, time
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument('--model', default='8b', choices=['8b', '4b'])
ap.add_argument('--start', action='store_true'); ap.add_argument('--bundle', action='store_true'); ap.add_argument('--status', action='store_true')
ap.add_argument('--bundle-loop', action='store_true', help='bundle + download new lesson commits every minute (blocks the cell)')
ap.add_argument('--push', action='store_true', help='push each lesson straight to GitHub with GH_TOKEN from Colab Secrets')
ap.add_argument('--restart', action='store_true', help='stop the running worker, then --start')
ap.add_argument('--langs', default='zh')
ap.add_argument('--sglang', type=int, default=0, help='serve the 8B with SGLang-Omni (/content/sgl venv), this many requests in flight')
ap.add_argument('--streams', type=int, default=2, help='with --sglang: batches in flight at once (the server limit is --sglang)')
ap.add_argument('--queue', action='store_true', help='one lesson at a time: tools/colab/lesson_queue.txt first, then catalog order')
ap.add_argument('--yuwen', action='store_true', help='record the yuwen lessons and styled originals (moods.proposed.json, approved)')
args, _ = ap.parse_known_args()
ROOT = Path('/content/gc-audio'); ROOT.mkdir(exist_ok=True)
REPOS = ['gc-audio-science', 'gc-audio-humanities', 'gc-audio-lang-math']
SRC = ROOT / '_tts'
TOOLS = SRC / 'tools/moss/tools'
sh = lambda cmd, **k: subprocess.run(cmd, shell=True, check=True, **k)

SAY_PATCH = r'''# ---------------------------------------------------------------- COLAB PATCH say v3 (content PC)
# Spoken scripts. The page text (`send`) is not read as it is: digits, units, symbols, formulas, dates are written out
# as they are spoken ("say", LLM-written and LLM-checked on the content PC), published per language as
# readaloud/say/<lang>.json = {"lessons": {lesson: {sha1(send)[:12]: say}}}  (zh and en).
#  - spoken(clip): the say of the clip when there is one, else send
#  - speech_len (pace and length checks): counted on the say; zh without spaces and silent symbols
#  - wanted(): a clip whose send needs a script (zh: digits, Latin letters, symbols; en: digits, symbols, Han) waits until
#    its say is published
#  - index(): when a lesson's say entries change, its stored status is invalidated so the lesson is worked again
#    (v1 changed the index fingerprint itself, which broke the transcript check: "transcript not available yet")
import hashlib as _hl
_SAY_URL = "https://shanchuan.org/middle/readaloud/say/{}.json"
_SAY = {"t": 0.0, "flat": {}, "ver": {}}
_NEED = {"zh": re.compile("[0-9A-Za-z\u00c0-\u024f]|[^\u4e00-\u9fff\u3000-\u303f\uff00-\uffef\u201c\u201d\u2018\u2019\u2014\u2026\u00b7\\s]"),
         "en": re.compile("\\d|[/+=\u00d7\u00f7%\u00b0\u2103\u00b2\u00b3\u2070-\u2079\u207a\u207b\u00bd\u00bc\u00be\u2153|\u2220_<>\u2248\u2264\u2265~^*#@&$\u20ac\u00a3\u00a5\u2192\u2190\u2194\u2206\u0394\u03b1\u03b2\u03b3\u03b8\u03bc\u03c0\u00b7\u2022]|[\u4e00-\u9fff]")}
_SILENT = re.compile("[\\s\u00b7\u2022/|()\\[\\]{}<>_*#~\u2014\u2013\\-\u2026\u2018\u2019'\"]")


def _say_load(force=False):
    if force or time.time() - _SAY["t"] > 600:
        _SAY["t"] = time.time()
        flat, ver = {}, {}
        for lang in ("zh", "en"):
            b = fetch(_SAY_URL.format(lang))
            if not b:
                continue
            try:
                d = json.loads(b.decode("utf-8"))
                for lid, m in d["lessons"].items():
                    for h, sv in m.items():
                        flat[(lang, h)] = sv
                    ver[lid] = (ver.get(lid, "") + hashlib.sha1(json.dumps(m, sort_keys=True, ensure_ascii=False).encode("utf-8")).hexdigest()[:8])
            except Exception as e:                       # noqa: BLE001
                log(f"say: bad {_SAY_URL.format(lang)}: {e}")
        if flat:
            _SAY["flat"], _SAY["ver"] = flat, ver
    return _SAY


def say_of(send, lang="zh"):
    return _say_load()["flat"].get((lang, _hl.sha1(send.encode("utf-8")).hexdigest()[:12]))


def spoken(clip):
    s = say_of(clip["send"], clip["lang"])
    return s if s else clip["send"]


_orig_speech_len = speech_len


def speech_len(text, lang):
    s = say_of(text, lang)
    if s and lang == "zh":
        s = _SILENT.sub("", s)
        return len(s) - 0.6 * sum(1 for ch in s if ch.isascii() and ch.isalpha())
    if s:
        return _orig_speech_len(s, lang)
    return _orig_speech_len(text, lang)


_orig_wanted = Worker.wanted


def _wanted(self, c):
    need = _NEED.get(c["lang"])
    return _orig_wanted(self, c) and (need is None or not need.search(c["send"]) or say_of(c["send"], c["lang"]) is not None)


Worker.wanted = _wanted
_orig_index = Worker.index


_SEEN = Path("/content/gc-audio/say_seen.json")


def _index(self):
    entries = _orig_index(self)
    ver = _say_load(force=True)["ver"]
    try:
        seen = json.loads(_SEEN.read_text(encoding="utf-8"))
    except Exception:                                    # noqa: BLE001
        seen = {}
    n = 0
    for e in entries:
        lid = e.get("id")
        if lid in ver and seen.get(lid) != ver[lid]:
            st = self.repos[e["repo"]].lessons.get(lid)
            if st:
                st["fingerprint"] = ""                   # work the lesson again: its new say clips become wanted
            seen[lid] = ver[lid]; n += 1
    if n:
        _SEEN.write_text(json.dumps(seen), encoding="utf-8")
        log(f"say: {n} lesson(s) with new spoken scripts will be worked again")
    return entries


Worker.index = _index
'''


def prepare():
    if not (TOOLS / 'tts_worker.py').exists():
        sh(f'git clone -q --depth 1 --filter=blob:none --sparse https://github.com/gladcolor/gc-audio-science.git {SRC} '
           f'&& cd {SRC} && git sparse-checkout set tools/moss')
    for r in REPOS:
        if not (ROOT / r / '.git').exists():
            print('cloning', r, flush=True)
            sh(f'git clone -q --depth 1 https://github.com/gladcolor/{r}.git {ROOT / r}')
        sh(f'cd {ROOT / r} && git config user.name "gc-audio Colab worker" && git config user.email "colab-worker@users.noreply.github.com"')
    # --- Linux patches to the TTS PC's code (it was written for Windows) ---
    w = (TOOLS / 'tts_worker.py').read_text(encoding='utf-8')
    if 'COLAB PATCH' not in w:
        # (single_instance already falls back to fcntl on Linux)
        w = w.replace('.with_name("ffprobe.exe")', '.with_name("ffprobe" if os.name != "nt" else "ffprobe.exe")  # COLAB PATCH')
        (TOOLS / 'tts_worker.py').write_text(w, encoding='utf-8')
    SAY_MARK = '# ---------------------------------------------------------------- COLAB PATCH say'
    if SAY_MARK + ' v3' not in w:
        if SAY_MARK in w:                                # drop an older say patch (it sits just before the main guard)
            a = w.index(SAY_MARK); b = w.index('\nif __name__ == "__main__":', a)
            w = w[:a] + w[b + 1:]
        w = w.replace('\nif __name__ == "__main__":', '\n' + SAY_PATCH + '\n\nif __name__ == "__main__":', 1)
        (TOOLS / 'tts_worker.py').write_text(w, encoding='utf-8')
    # on-demand texts are part of the scope too: a lesson recorded without them is redone when record_demand is on
    if 'COLAB PATCH demand' not in w:
        o1 = '            repo.lessons[lid]["record_langs"] = self.record_langs'
        o2 = '        return self.is_moss and st.get("record_langs") != self.record_langs'
        assert o1 in w and o2 in w, 'tts_worker.py changed: demand patch needs updating'
        NL = chr(10)
        w = w.replace(o1, o1 + NL + '            repo.lessons[lid]["record_demand"] = bool(self.cfg.get("record_demand"))  # COLAB PATCH demand', 1)
        # a lesson already recorded in MORE languages than now asked (zh+en, now zh only) is not "changed": no idle pass
        w = w.replace(o2, '        return self.is_moss and (not set(self.record_langs) <= set(st.get("record_langs") or ())  # COLAB PATCH demand' + NL
                          + '                                 or (bool(self.cfg.get("record_demand")) and not st.get("record_demand")))', 1)
        (TOOLS / 'tts_worker.py').write_text(w, encoding='utf-8')
    # a pass with --limit (the queue driver) does not wait at its end for GitHub Pages to confirm the pushes: the GPU sat
    # idle for minutes after every pass; lessons whose live check is still open are verified in a later pass anyway
    if 'COLAB PATCH nowait' not in w:
        o3 = '            self.check_pending(wait=True)                 # end of the pass: wait for the remaining live checks'
        assert o3 in w, 'tts_worker.py changed: nowait patch needs updating'
        w = w.replace(o3, '            self.check_pending(wait=not self.args.limit)  # COLAB PATCH nowait', 1)
        (TOOLS / 'tts_worker.py').write_text(w, encoding='utf-8')
    m = (TOOLS / 'moss_engine.py').read_text(encoding='utf-8')
    if 'COLAB PATCH v3' not in m:
        m = m.split('\n\n# ---------------------------------------------------------------- COLAB PATCH')[0]   # drop an older patch
        m += '''

# ---------------------------------------------------------------- COLAB PATCH v3 (content PC): Hugging Face ids, the 8B,
# bigger batches on the A100 (40 GB): a batch that runs out of GPU memory is split in two and generated again;
# with MOSS_SGLANG=1 the 8B is served by SGLang-Omni (localhost:8000) and a batch is sent as concurrent requests
import os as _os
_MOSS8B = _os.environ.get("MOSS_8B") == "1"
_Moss = Moss
class Moss(_Moss):
    def __init__(self, *, model=MODEL, codec=CODEC, refs=REFS, ffmpeg=None):
        import torch
        from transformers import AutoModel, AutoProcessor
        self.torch = torch
        torch.backends.cuda.enable_cudnn_sdp(False)
        extra = {} if (_MOSS8B or not codec) else {"codec_path": str(codec)}   # the 8B processor loads its own codec
        self.proc = AutoProcessor.from_pretrained(str(model), trust_remote_code=True, **extra)
        self.proc.audio_tokenizer = self.proc.audio_tokenizer.to("cuda")
        self.model = AutoModel.from_pretrained(str(model), trust_remote_code=True, attn_implementation="sdpa",
                                               dtype=torch.bfloat16).to("cuda").eval()
        self.sr = int(self.proc.model_config.sampling_rate)
        files = {"poem": "serena_zh_poem.mp3", "explain": "serena_zh_explain.mp3", "en": "serena_en_explain.mp3"}
        self.refs = {k: self._encode(Path(refs) / f, ffmpeg or "ffmpeg") for k, f in files.items()}

    def _encode(self, path, ffmpeg):
        r = subprocess.run([ffmpeg, "-v", "error", "-i", str(path), "-ac", "1", "-ar", "24000", "-f", "f32le", "pipe:1"],
                           capture_output=True, check=True)
        wav = self.torch.from_numpy(np.frombuffer(r.stdout, dtype="<f4").copy())
        if _MOSS8B:
            wav = wav[None, :]                                   # the 8B codec wants [channels, samples]
        return self.proc.encode_audios_from_wav([wav], 24000)[0]

    def generate(self, items, ffmpeg):
        torch = self.torch
        try:
            out = self._generate(items, ffmpeg)
        except torch.cuda.OutOfMemoryError:
            torch.cuda.empty_cache()
            if len(items) == 1:
                return [None]
            h = len(items) // 2
            _os.makedirs("/content/gc-audio", exist_ok=True)
            open("/content/gc-audio/gpu_oom.txt", "a").write(f"{time.strftime('%H:%M:%S')} OOM at {len(items)} clips, split\\n")
            return self.generate(items[:h], ffmpeg) + self.generate(items[h:], ffmpeg)
        peak = torch.cuda.max_memory_allocated() / 2**30
        open("/content/gc-audio/gpu_peak.txt", "w").write(f"peak {peak:.1f} GB (batch {len(items)})\\n")
        return out

    def _generate(self, items, ffmpeg):
        torch = self.torch
        convs = [[self.proc.build_user_message(text=it["text"], language="Chinese" if it["lang"] == "zh" else "English",
                                               reference=[self.refs[REF_KIND.get(it["kind"], it["kind"])]],
                                               **({"tokens": it["tokens"]} if it.get("tokens") else {}))] for it in items]
        batch = self.proc(convs, mode="generation")
        secs = [it["tokens"] / 12.5 + 5 if it.get("tokens") else
                2 * expected_seconds(it["text"], it["lang"], it["kind"], it.get("pace")) + 10 for it in items]
        gen = dict(GEN, max_new_tokens=min(GEN["max_new_tokens"], int(max(secs) * 12.5) + 25))
        if _MOSS8B:
            gen.pop("do_sample", None)                           # the 8B generate() samples whenever temperature > 0
        with torch.no_grad():
            out = self.model.generate(input_ids=batch["input_ids"].to("cuda"),
                                      attention_mask=batch["attention_mask"].to("cuda"), **gen)
        pcms = []
        for msg in self.proc.decode(out):
            if msg is None:
                pcms.append(None); continue
            a = msg.audio_codes_list[0].float()
            if a.dim() == 2:
                a = a.mean(dim=0)                                # 4B: 48 kHz stereo -> mono
            wav = a.cpu().numpy()
            r = subprocess.run([ffmpeg, "-v", "error", "-f", "f32le", "-ar", str(self.sr), "-ac", "1", "-i", "pipe:0",
                                "-ar", "24000", "-f", "s16le", "pipe:1"], input=wav.astype("<f4").tobytes(), capture_output=True)
            pcms.append(r.stdout if r.returncode == 0 and r.stdout else None)
        return pcms


if _os.environ.get("MOSS_SGLANG") == "1":
    import io as _io, json as _json, urllib.request as _ur, wave as _wave
    from concurrent.futures import ThreadPoolExecutor as _TPE

    class Moss:                                          # noqa: F811  (same interface, served by SGLang-Omni)
        URL = "http://127.0.0.1:8000/v1/audio/speech"

        def __init__(self, *, model=MODEL, codec=CODEC, refs=REFS, ffmpeg=None):
            ff = ffmpeg or "ffmpeg"
            texts = _json.loads((Path(refs) / "refs.json").read_text(encoding="utf-8"))
            self.refs, d = {}, Path("/content/sgl_refs")
            d.mkdir(exist_ok=True)
            for k, f in {"poem": "serena_zh_poem", "explain": "serena_zh_explain", "en": "serena_en_explain"}.items():
                w = d / f"{f}.wav"
                if not w.exists():
                    subprocess.run([ff, "-v", "error", "-y", "-i", str(Path(refs) / f"{f}.mp3"), "-ac", "1", "-ar", "24000", str(w)], check=True)
                self.refs[k] = (str(w), texts[f]["text"])   # reference audio + its transcript (pace as on the HF path)

        def _one(self, it, ffmpeg):
            ref, rtext = self.refs[REF_KIND.get(it["kind"], it["kind"])]
            sec = it["tokens"] / 12.5 + 5 if it.get("tokens") else 2 * expected_seconds(it["text"], it["lang"], it["kind"], it.get("pace")) + 10
            body = dict(model="OpenMOSS-Team/MOSS-TTS-v1.5", voice="default", input=it["text"], ref_audio=ref, ref_text=rtext,
                        language="Chinese" if it["lang"] == "zh" else "English",
                        audio_temperature=GEN["audio_temperature"], audio_top_p=GEN["audio_top_p"], audio_top_k=GEN["audio_top_k"],
                        audio_repetition_penalty=GEN.get("audio_repetition_penalty", 1.0),
                        max_new_tokens=min(GEN["max_new_tokens"], int(sec * 12.5) + 25))
            if it.get("tokens"):
                body["token_count"] = int(it["tokens"])
            try:
                req = _ur.Request(self.URL, data=_json.dumps(body).encode("utf-8"), headers={"Content-Type": "application/json"})
                raw = _ur.urlopen(req, timeout=900).read()
                with _wave.open(_io.BytesIO(raw)) as w:
                    sr, ch, pcm = w.getframerate(), w.getnchannels(), w.readframes(w.getnframes())
                r = subprocess.run([ffmpeg, "-v", "error", "-f", "s16le", "-ar", str(sr), "-ac", str(ch), "-i", "pipe:0",
                                    "-ac", "1", "-ar", "24000", "-f", "s16le", "pipe:1"], input=pcm, capture_output=True)
                return r.stdout if r.returncode == 0 and r.stdout else None
            except Exception as e:                       # noqa: BLE001
                with open("/content/gc-audio/sgl_errors.txt", "a") as f:
                    f.write(time.strftime("%H:%M:%S") + " " + str(e)[:200] + chr(10))
                return None

        def generate(self, items, ffmpeg):
            with _TPE(max(1, len(items))) as ex:
                return list(ex.map(lambda it: self._one(it, ffmpeg), items))
'''
        (TOOLS / 'moss_engine.py').write_text(m, encoding='utf-8')
    # pace check (2026-11-22): with a window of +-0.5 chars/s, 42 % of all 8B takes were rejected for pace alone (1,162 of
    # 1,233 rejects) and re-synthesised up to 5 times - GPU time spent twice, while the user had found many "fast" clips
    # fine by ear. Now +-0.8, and only from 25 characters (the pauses dominate a short clip). Too long, stray end and F0
    # are unchanged; the TTS PC's ASR check still reviews every lesson.
    m = (TOOLS / 'moss_engine.py').read_text(encoding='utf-8')
    if 'COLAB PATCH pace' not in m:
        p1 = '    return (pace - 0.5, pace + 0.5)'
        p2 = '    if win and sl >= 15 and not (win[0] <= pace <= win[1]):'
        assert p1 in m and p2 in m, 'moss_engine.py changed: pace patch needs updating'
        m = m.replace(p1, '    return (pace - 0.8, pace + 0.8)  # COLAB PATCH pace', 1)
        m = m.replace(p2, '    if win and sl >= 25 and not (win[0] <= pace <= win[1]):  # COLAB PATCH pace', 1)
        (TOOLS / 'moss_engine.py').write_text(m, encoding='utf-8')
    # --- config: the TTS PC's MOSS config with Colab paths ---
    cfg = json.loads((TOOLS / 'tts_config_moss.json').read_text(encoding='utf-8'))
    is8 = args.model == '8b'
    cfg.update(root=str(ROOT), ffmpeg='ffmpeg', git='git', record_langs=args.langs.split(','),
               voice_tag='serena moss8b' if is8 else 'serena moss15')
    cfg['moss'].update(model='OpenMOSS-Team/MOSS-TTS-v1.5' if is8 else 'OpenMOSS-Team/MOSS-TTS-Local-Transformer-v1.5',
                       codec='' if is8 else 'OpenMOSS-Team/MOSS-Audio-Tokenizer-v2', refs=str(SRC / 'tools/moss/refs'),
                       moods=str(TOOLS / 'moods.proposed.json'), batch=16)
    if args.queue:                                       # one lesson at a time, to the end: on-demand texts too
        cfg['record_demand'] = True
    if args.yuwen:                                       # the user approved the TTS PC's mood list (#3, 2026-11-21): yuwen + styled originals
        cfg.update(record_styled=True, hold_lessons=[])
    cfg['batch_audio_s'] = 300                           # A100 40 GB (the TTS PC: 8 clips / 180 s for its 20 GB card)
    if args.sglang:                                      # SGLang-Omni: a batch = concurrent requests to the server
        k = max(1, args.streams); cfg['models'] = k                 # k client processes, each sends its own batch
        cfg['moss']['batch'] = max(1, args.sglang // k); cfg['batch_audio_s'] = 40 * cfg['moss']['batch']
    p = ROOT / 'tts_config_colab.json'; p.write_text(json.dumps(cfg, ensure_ascii=False, indent=1), encoding='utf-8')
    return p

def token():
    """GitHub token from Colab's Secrets panel (name GH_TOKEN, notebook access on), or None. Never printed."""
    try:
        from google.colab import userdata
        return userdata.get('GH_TOKEN') or None
    except Exception:                                    # noqa: BLE001  (no secret, or no access granted)
        return None

QUEUE_DRIVER = r'''
# One lesson at a time (the user, 2026-11-21): the lessons listed in tools/colab/lesson_queue.txt (site repo) first, in
# order, each run to the end (recorded, pushed, live-checked) before the next; the list is read again before every
# lesson, so lessons can be added without a restart. With nothing queued left: the next lesson in catalog order.
import json, os, subprocess, sys, time, urllib.request
TOOLS, CFG, ROOT = sys.argv[1], sys.argv[2], sys.argv[3]
EXTRA = sys.argv[4:]
Q = 'https://api.github.com/repos/ningshanchuan/middle/contents/tools/colab/lesson_queue.txt'
IX = 'https://shanchuan.org/middle/readaloud/index.json'
RQ = 'https://api.github.com/repos/ningshanchuan/middle/contents/tools/colab/rerecord_queue.txt'
WS = 'https://api.github.com/repos/ningshanchuan/middle/contents/tools/colab/worker_settings.json'
DONE = os.path.join(ROOT, 'queue_done.json')
def log(m):
    print(time.strftime('%H:%M:%S ') + 'queue: ' + m, flush=True)
def fetch(url, raw=False):
    rq = urllib.request.Request(url + ('' if raw else ('&' if '?' in url else '?') + 'v=%d' % time.time()),
                                headers={'Accept': 'application/vnd.github.raw'} if raw else {})
    return urllib.request.urlopen(rq, timeout=60).read().decode('utf-8')
done = json.load(open(DONE)) if os.path.exists(DONE) else {}
child, restart_child = None, False                       # the continuous (--loop) worker process
while True:
    try:
        queue = [l.split('#')[0].strip() for l in fetch(Q, raw=True).splitlines()]
        queue = [l for l in queue if l]
    except Exception as ex:                              # noqa: BLE001
        log('cannot read the lesson queue (%r)' % ex); queue = []
    try:
        # transcript fingerprint + a hash of THIS lesson's spoken scripts (the file's "updated" stamp changes at every
        # publish round, which made every queued lesson run again each time - idle GPU time; 2026-11-22)
        import hashlib
        says = [json.loads(fetch(IX.replace('index.json', 'say/%s.json' % lg))).get('lessons', {}) for lg in ('zh', 'en')]
        def sv(lid):
            return hashlib.sha1(json.dumps([s.get(lid, {}) for s in says], sort_keys=True, ensure_ascii=False).encode('utf-8')).hexdigest()[:10]
        fp = {l['id']: l['fingerprint'] + '|' + sv(l['id']) for l in json.loads(fetch(IX))['lessons']}
    except Exception as ex:                              # noqa: BLE001
        log('cannot read readaloud/index.json (%r) - next try in 2 min' % ex); time.sleep(120); continue
    # re-records (tools/colab/rerecord_queue.txt, lines "zh:key  # lesson", reviewed on the content PC): new lines go to
    # the worker's rerecord.txt (it drops those clips and redoes the lessons) and the lesson is queued again here
    try:
        applied = set(json.load(open(os.path.join(ROOT, 'rerecord_applied.json')))) if os.path.exists(os.path.join(ROOT, 'rerecord_applied.json')) else set()
        new = []
        for l in fetch(RQ, raw=True).splitlines():
            entry = l.split('#')[0].strip()
            if entry and ':' in entry and entry not in applied:
                new.append(entry); applied.add(entry)
                les = l.split('#', 1)[1].strip() if '#' in l else ''
                if les:
                    done.pop(les, None)              # a queued lesson runs again; any other lesson is picked up by the
                                                     # next catalog pass (its dropped clips make it need work)
        if new:
            with open(os.path.join(ROOT, 'rerecord.txt'), 'a', encoding='utf-8') as f:
                f.write(chr(10).join(new) + chr(10))
            json.dump(sorted(applied), open(os.path.join(ROOT, 'rerecord_applied.json'), 'w'))
            json.dump(done, open(DONE, 'w'))
            log('re-record: %d new clips passed to the worker' % len(new))
    except Exception as ex:                              # noqa: BLE001
        log('cannot read the re-record queue (%r)' % ex)
    # settings that can change without a restart (tools/colab/worker_settings.json): {"record_langs": ["zh"]} ...
    try:
        ws = json.loads(fetch(WS, raw=True))
        c = json.load(open(CFG, encoding='utf-8'))
        if ws.get('record_langs') and sorted(ws['record_langs']) != sorted(c.get('record_langs') or []):
            c['record_langs'] = sorted(ws['record_langs']); json.dump(c, open(CFG, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
            done.clear(); restart_child = True; log('settings: record_langs = %s' % ','.join(c['record_langs']))
    except Exception as ex:                              # noqa: BLE001
        log('cannot read worker settings (%r)' % ex)
    # keep the audio repos' history small (the user: old versions are not needed; TTS PC agreed, #11): between lessons,
    # when a repo passes 300 commits, its current files become one commit (same tree) and replace the history
    idle = child is None or child.poll() is not None     # never squash while a worker may be pushing
    for rd in (sorted(d for d in os.listdir(ROOT) if d.startswith('gc-audio-') and os.path.isdir(os.path.join(ROOT, d, '.git'))) if idle else []):
        g = ['git', '-C', os.path.join(ROOT, rd)]
        try:
            n = int(subprocess.run(g + ['rev-list', '--count', 'HEAD'], capture_output=True, text=True).stdout.strip() or 0)
            if n <= 300:
                continue
            tree = subprocess.run(g + ['rev-parse', 'HEAD^{tree}'], capture_output=True, text=True).stdout.strip()
            subprocess.run(g + ['checkout', '-q', '--orphan', 'squash'], check=True)
            subprocess.run(g + ['commit', '-q', '-m', 'Serena recordings (history squashed %s; older versions are not kept)' % time.strftime('%Y-%m-%d')], check=True)
            if subprocess.run(g + ['rev-parse', 'HEAD^{tree}'], capture_output=True, text=True).stdout.strip() != tree:
                subprocess.run(g + ['checkout', '-q', '-f', 'main']); subprocess.run(g + ['branch', '-D', '-q', 'squash'])
                log('%s: squash skipped (tree changed)' % rd); continue
            subprocess.run(g + ['branch', '-D', '-q', 'main'], check=True); subprocess.run(g + ['branch', '-m', 'main'], check=True)
            r = subprocess.run(g + ['push', '-q', '-f', 'origin', 'main'], capture_output=True, text=True)
            subprocess.run(g + ['reflog', 'expire', '--expire=now', '--all']); subprocess.run(g + ['gc', '-q', '--prune=now'])
            log('%s: history squashed (%d commits -> 1)%s' % (rd, n, '' if r.returncode == 0 else ' - PUSH FAILED ' + r.stderr[-200:]))
        except Exception as ex:                          # noqa: BLE001
            log('%s: squash error %r' % (rd, ex))
    nxt = next((l for l in queue if l in fp and done.get(l) != fp[l]), None)
    base = [sys.executable, os.path.join(TOOLS, 'tts_worker.py'), 'run', '--config', CFG] + EXTRA
    if nxt:                                              # a queued lesson: stop the continuous worker, run the lesson alone
        if child is not None and child.poll() is None:
            child.terminate(); child.wait(); child = None
        log('lesson ' + nxt); t0 = time.time(); r = subprocess.run(base + ['--lesson', nxt], cwd=TOOLS)
        if r.returncode == 0:
            done[nxt] = fp[nxt]; json.dump(done, open(DONE, 'w'))
            log('lesson %s finished (%.0f min)' % (nxt, (time.time() - t0) / 60))
        else:
            log('worker exit %s - next try in 1 min' % r.returncode); time.sleep(60)
        continue
    # CONTINUOUS (the user, 2026-11-22: "GPU 前后配置 pool，不要浪费最宝贵的 GPU 资源"): the worker runs in --loop and keeps
    # the GPU fed (its pool of waiting clips; pushes and live checks on other threads). This driver only works on the CPU
    # side every 2 minutes: re-records go into rerecord.txt (the worker takes them at its next pass) and a changed
    # setting restarts the worker client (the SGLang server with the model stays up).
    if restart_child and child is not None and child.poll() is None:
        child.terminate(); child.wait(); child = None; log('worker client restarted for new settings')
    restart_child = False
    if child is None or child.poll() is not None:
        if child is not None:
            log('continuous worker exited (%s) - starting it again' % child.returncode)
        child = subprocess.Popen(base + ['--loop'], cwd=TOOLS); log('continuous worker started (--loop)')
    time.sleep(120)
'''

if args.restart:
    pidf = ROOT / 'worker.pid'
    if pidf.exists():
        try:
            os.killpg(int(pidf.read_text()), 15); print('old worker stopped', flush=True); time.sleep(5)
        except OSError:
            pass
    sp = ROOT / 'sgl.pid'
    if sp.exists():
        try:
            os.killpg(int(sp.read_text()), 15); print('old SGLang server stopped', flush=True); time.sleep(15)
        except OSError:
            pass
        sp.unlink()
    args.start = True

if args.start:
    cfgp = prepare()
    tok = token() if args.push else None
    if args.push and not tok:
        raise SystemExit('no GH_TOKEN in Colab Secrets (or notebook access is off): add it, or run without --push')
    for r in REPOS:                                      # push straight to GitHub with the token (TTS PC style)
        url = f'https://x-access-token:{tok}@github.com/gladcolor/{r}.git' if tok else f'https://github.com/gladcolor/{r}.git'
        subprocess.run(['git', '-C', str(ROOT / r), 'remote', 'set-url', 'origin', url], check=True)
    env = dict(os.environ, MOSS_8B='1' if args.model == '8b' else '0', PYTHONUNBUFFERED='1')
    if args.sglang:
        import urllib.request as ur
        V = Path('/content/sgl'); yp = Path('/content/sgl_moss_worker.yaml')
        n = args.sglang
        yp.write_text(f"""config_cls: MossTTSSingleProcessPipelineConfig
model_path: OpenMOSS-Team/MOSS-TTS-v1.5

stages:
  preprocessing:
    factory:
      device: cpu
      compute_dtype: bfloat16
      max_concurrency: {n}

  tts_engine:
    engine:
      max_running_requests: {n}
      mem_fraction_static: 0.75
      cuda_graph_max_bs: {n}

  vocoder:
    factory:
      dtype: bfloat16
      max_batch_size: {n}
      max_batch_wait_ms: 5
""")
        srv = subprocess.Popen([str(V / 'bin/sgl-omni'), 'serve', '--model-path', 'OpenMOSS-Team/MOSS-TTS-v1.5', '--config', str(yp),
                                '--port', '8000'], stdout=open('/content/sgl_server.log', 'w'), stderr=subprocess.STDOUT,
                               start_new_session=True, env=dict(os.environ, PATH=f"{V}/bin:" + os.environ['PATH']))
        (ROOT / 'sgl.pid').write_text(str(srv.pid))
        t0, up = time.time(), False
        while time.time() - t0 < 1500 and srv.poll() is None and not up:
            time.sleep(10)
            try:
                up = ur.urlopen('http://127.0.0.1:8000/health', timeout=5).status == 200
            except Exception:                            # noqa: BLE001
                pass
        if not up:
            tail = Path('/content/sgl_server.log').read_text(errors='replace').splitlines()[-25:]
            raise SystemExit('SGLang server did not start:' + chr(10) + chr(10).join(tail))
        print(f'SGLang server up in {time.time() - t0:.0f}s ({n} in flight)', flush=True)
        env['MOSS_SGLANG'] = '1'
    log = open(ROOT / 'worker.out', 'a')
    if args.queue:                                       # one lesson at a time (lesson_queue.txt, then catalog order)
        drv = ROOT / 'queue_driver.py'; drv.write_text(QUEUE_DRIVER, encoding='utf-8')
        (ROOT / 'queue_done.json').unlink(missing_ok=True)   # settings may have changed: every queued lesson is looked at again
        cmd = [sys.executable, str(drv), str(TOOLS), str(cfgp), str(ROOT)] + ([] if tok else ['--no-push'])
    else:
        cmd = [sys.executable, str(TOOLS / 'tts_worker.py'), 'run', '--loop', '--config', str(cfgp)] + ([] if tok else ['--no-push'])
    proc = subprocess.Popen(cmd,
                            cwd=str(TOOLS), env=env, stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
    (ROOT / 'worker.pid').write_text(str(proc.pid))
    print(f'worker started (pid {proc.pid}, model {args.model}); log: {ROOT}/worker.log and worker.out', flush=True)

if args.status:
    for f in ('worker.log', 'worker.out'):
        p = ROOT / f
        if p.exists():
            print(f'--- {f} (last 25 lines)'); print('\n'.join(p.read_text(errors='replace').splitlines()[-25:]))
    for r in REPOS:
        if (ROOT / r / '.git').exists():
            n = subprocess.run(f'cd {ROOT / r} && git rev-list --count origin/main..HEAD', shell=True, capture_output=True, text=True).stdout.strip()
            lp = ROOT / r / 'status' / 'ledger.tsv'
            rows = lp.read_text(encoding='utf-8').splitlines()[1:] if lp.exists() else []
            by = {}
            for row in rows:
                p = row.split('\t')
                if len(p) >= 4 and p[3] == 'serena moss8b':
                    by[p[0]] = by.get(p[0], 0) + 1
            les = {row.split('\t')[2] for row in rows if len(row.split('\t')) > 3 and row.split('\t')[3] == 'serena moss8b'}
            print(f'{r}: {n} local commits not on GitHub yet; 8B clips in the ledger: {by} in {len(les)} lessons')

def bundle_once(download=True):
    """bundles of the commits not yet on GitHub (one per repo); returns the files made"""
    out = Path('/content/bundles'); out.mkdir(exist_ok=True)
    stamp = time.strftime('%Y%m%d-%H%M%S'); made = []
    for r in REPOS:
        d = ROOT / r
        if not (d / '.git').exists():
            continue
        subprocess.run(f'cd {d} && git fetch -q origin main', shell=True)
        n = subprocess.run(f'cd {d} && git rev-list --count origin/main..HEAD', shell=True, capture_output=True, text=True).stdout.strip()
        if n and n != '0':
            b = out / f'{r}-{stamp}.bundle'
            sh(f'cd {d} && git bundle create -q {b} origin/main..HEAD')
            made.append(b)
            print(f'{time.strftime("%H:%M:%S")} {b.name}: {n} commits, {b.stat().st_size / 2**20:.1f} MB', flush=True)
    if made and download:
        from google.colab import files
        for b in made:
            files.download(str(b))
    return made

if args.bundle_loop:
    # "录完一课，推送一课" (the user): every minute, new lesson commits -> a bundle the browser downloads at once; the
    # content PC pushes it. A bundle already offered is not offered again: the next one starts where GitHub is after the
    # content PC's push (git fetch); until then, unpushed commits are re-offered at most every 10 minutes.
    last = {}; seen_log = 0
    def echo_log():
        """print the worker log's new key lines (lessons finished, errors) so they can be read outside the notebook"""
        global seen_log
        p = ROOT / 'worker.log'
        if not p.exists():
            return
        lines = p.read_text(errors='replace').splitlines()
        new, seen_log = lines[seen_log:], len(lines)
        keys = re.compile(r'finished|commit|error|Error|Traceback|failed|OOM|dead|lesson|pass|left|missing', re.I)
        for ln in [l for l in new if keys.search(l)][-12:]:
            print('  log:', ln[:200], flush=True)
    while True:
        echo_log()
        heads = {r: subprocess.run(f'cd {ROOT / r} && git rev-parse HEAD', shell=True, capture_output=True, text=True).stdout.strip()
                 for r in REPOS if (ROOT / r / '.git').exists()}
        if heads != last.get('heads') or time.time() - last.get('t', 0) > 600:
            if bundle_once():
                last = dict(heads=heads, t=time.time())
        if (ROOT / 'worker.pid').exists():
            try:
                os.kill(int((ROOT / 'worker.pid').read_text()), 0)
            except OSError:
                print('worker process ended; final bundle above, loop stops', flush=True); bundle_once(); break
        time.sleep(60)

if args.bundle:
    out = Path('/content/bundles'); out.mkdir(exist_ok=True)
    stamp = time.strftime('%Y%m%d-%H%M%S'); made = []
    for r in REPOS:
        d = ROOT / r
        if not (d / '.git').exists():
            continue
        subprocess.run(f'cd {d} && git fetch -q origin main', shell=True)   # commits the content PC already pushed drop out
        n = subprocess.run(f'cd {d} && git rev-list --count origin/main..HEAD', shell=True, capture_output=True, text=True).stdout.strip()
        if n and n != '0':
            b = out / f'{r}-{stamp}.bundle'
            sh(f'cd {d} && git bundle create {b} origin/main..HEAD')
            made.append((b, n))
            print(f'{b.name}: {n} commits, {b.stat().st_size / 2**20:.1f} MB', flush=True)
    if not made:
        print('nothing new to bundle')
    else:
        from google.colab import files
        for b, _ in made:
            files.download(str(b))
