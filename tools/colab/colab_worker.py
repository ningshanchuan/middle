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
args, _ = ap.parse_known_args()
ROOT = Path('/content/gc-audio'); ROOT.mkdir(exist_ok=True)
REPOS = ['gc-audio-science', 'gc-audio-humanities', 'gc-audio-lang-math']
SRC = ROOT / '_tts'
TOOLS = SRC / 'tools/moss/tools'
sh = lambda cmd, **k: subprocess.run(cmd, shell=True, check=True, **k)

SAY_PATCH = r'''# ---------------------------------------------------------------- COLAB PATCH say v2 (content PC)
# Spoken scripts for Chinese clips. The page text (`send`) is not read as it is: digits, units, symbols, formulas, dates
# are written out as they are spoken ("say", LLM-written and LLM-checked on the content PC, published as
# readaloud/say/zh.json = {"lessons": {lesson: {sha1(send)[:12]: say}}}).
#  - spoken(clip): the say of the clip when there is one, else send
#  - speech_len (pace checks): counted on the say, without spaces and silent symbols
#  - wanted(): a zh clip whose send needs a script (digits, Latin letters, symbols) waits until its say is published
#  - index(): when a lesson's say entries change, its stored status is invalidated so the lesson is worked again
#    (v1 changed the index fingerprint itself, which broke the transcript check: "transcript not available yet")
import hashlib as _hl
_SAY_URL = "https://shanchuan.org/middle/readaloud/say/zh.json"
_SAY = {"t": 0.0, "flat": {}, "ver": {}}
_NEED = re.compile(r"[0-9A-Za-zÀ-ɏ]|[^一-鿿　-〿＀-￯“”‘’—…·\s]")
_SILENT = re.compile(r"[\s·•/|()\[\]{}<>_*#~—–\-…‘’'\"]")


def _say_load(force=False):
    if force or time.time() - _SAY["t"] > 600:
        _SAY["t"] = time.time()
        b = fetch(_SAY_URL)
        if b:
            try:
                d = json.loads(b.decode("utf-8"))
                _SAY["flat"] = {h: s for m in d["lessons"].values() for h, s in m.items()}
                _SAY["ver"] = {lid: hashlib.sha1(json.dumps(m, sort_keys=True, ensure_ascii=False).encode("utf-8")).hexdigest()[:8]
                               for lid, m in d["lessons"].items()}
            except Exception as e:                       # noqa: BLE001
                log(f"say: bad {_SAY_URL}: {e}")
    return _SAY


def say_of(send):
    return _say_load()["flat"].get(_hl.sha1(send.encode("utf-8")).hexdigest()[:12])


def spoken(clip):
    if clip["lang"] == "zh":
        s = say_of(clip["send"])
        if s:
            return s
    return clip["send"]


_orig_speech_len = speech_len


def speech_len(text, lang):
    if lang == "zh":
        s = say_of(text)
        if s:
            s = _SILENT.sub("", s)
            return len(s) - 0.6 * sum(1 for ch in s if ch.isascii() and ch.isalpha())
    return _orig_speech_len(text, lang)


_orig_wanted = Worker.wanted


def _wanted(self, c):
    return _orig_wanted(self, c) and (c["lang"] != "zh" or not _NEED.search(c["send"]) or say_of(c["send"]) is not None)


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
    if SAY_MARK + ' v2' not in w:
        if SAY_MARK in w:                                # drop an older say patch (it sits just before the main guard)
            a = w.index(SAY_MARK); b = w.index('\nif __name__ == "__main__":', a)
            w = w[:a] + w[b + 1:]
        w = w.replace('\nif __name__ == "__main__":', '\n' + SAY_PATCH + '\n\nif __name__ == "__main__":', 1)
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
    # --- config: the TTS PC's MOSS config with Colab paths ---
    cfg = json.loads((TOOLS / 'tts_config_moss.json').read_text(encoding='utf-8'))
    is8 = args.model == '8b'
    cfg.update(root=str(ROOT), ffmpeg='ffmpeg', git='git', record_langs=args.langs.split(','),
               voice_tag='serena moss8b' if is8 else 'serena moss15')
    cfg['moss'].update(model='OpenMOSS-Team/MOSS-TTS-v1.5' if is8 else 'OpenMOSS-Team/MOSS-TTS-Local-Transformer-v1.5',
                       codec='' if is8 else 'OpenMOSS-Team/MOSS-Audio-Tokenizer-v2', refs=str(SRC / 'tools/moss/refs'),
                       moods=str(TOOLS / 'moods.proposed.json'), batch=16)
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
    proc = subprocess.Popen([sys.executable, str(TOOLS / 'tts_worker.py'), 'run', '--loop', '--config', str(cfgp)]
                            + ([] if tok else ['--no-push']),
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
