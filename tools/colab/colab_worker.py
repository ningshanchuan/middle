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
ap.add_argument('--langs', default='zh')
args, _ = ap.parse_known_args()
ROOT = Path('/content/gc-audio'); ROOT.mkdir(exist_ok=True)
REPOS = ['gc-audio-science', 'gc-audio-humanities', 'gc-audio-lang-math']
SRC = ROOT / '_tts'
TOOLS = SRC / 'tools/moss/tools'
sh = lambda cmd, **k: subprocess.run(cmd, shell=True, check=True, **k)

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
    m = (TOOLS / 'moss_engine.py').read_text(encoding='utf-8')
    if 'COLAB PATCH' not in m:
        m += '''

# ---------------------------------------------------------------- COLAB PATCH (content PC): Hugging Face ids and the 8B
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
'''
        (TOOLS / 'moss_engine.py').write_text(m, encoding='utf-8')
    # --- config: the TTS PC's MOSS config with Colab paths ---
    cfg = json.loads((TOOLS / 'tts_config_moss.json').read_text(encoding='utf-8'))
    is8 = args.model == '8b'
    cfg.update(root=str(ROOT), ffmpeg='ffmpeg', git='git', record_langs=args.langs.split(','),
               voice_tag='serena moss8b' if is8 else 'serena moss15')
    cfg['moss'].update(model='OpenMOSS-Team/MOSS-TTS-v1.5' if is8 else 'OpenMOSS-Team/MOSS-TTS-Local-Transformer-v1.5',
                       codec='' if is8 else 'OpenMOSS-Team/MOSS-Audio-Tokenizer-v2', refs=str(SRC / 'tools/moss/refs'),
                       moods=str(TOOLS / 'moods.proposed.json'))
    p = ROOT / 'tts_config_colab.json'; p.write_text(json.dumps(cfg, ensure_ascii=False, indent=1), encoding='utf-8')
    return p

if args.start:
    cfgp = prepare()
    env = dict(os.environ, MOSS_8B='1' if args.model == '8b' else '0', PYTHONUNBUFFERED='1')
    log = open(ROOT / 'worker.out', 'a')
    proc = subprocess.Popen([sys.executable, str(TOOLS / 'tts_worker.py'), 'run', '--loop', '--no-push', '--config', str(cfgp)],
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
            print(f'{r}: {n} local commits not on GitHub yet')

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
