# SGLang-Omni speed test for the 8B (OpenMOSS-Team/MOSS-TTS-v1.5) on the Colab A100, against the Hugging Face path the
# worker uses now. Same lessons, same TTS PC rules (kind, pace target, pause markers, 5 free tries, moss_engine.check),
# same Serena reference: only the inference engine differs.
#   %run colab_sglang.py --setup      install sglang-omni into its own venv (/content/sgl) in the background; the worker
#                                     keeps recording (CPU / disk only). Log: /content/sgl_setup.log
#   %run colab_sglang.py --status     tail of the setup log
#   %run colab_sglang.py --bench math/expressions,math/ratios [--conc 16] [--ref-text]
#                                     pause the worker, start the server, record the lessons, print RESULT / COMPARE
#                                     lines, stop the server and restart the worker (direct pushes, 8b, zh)
import argparse, json, os, signal, subprocess, sys, time, io, wave
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument('--setup', action='store_true'); ap.add_argument('--status', action='store_true')
ap.add_argument('--bench', default='')
ap.add_argument('--conc', type=int, default=16)
ap.add_argument('--ref-text', action='store_true', help='also send the reference transcript (the worker sends audio only)')
args, _ = ap.parse_known_args()
VENV = Path('/content/sgl'); LOG = Path('/content/sgl_setup.log'); ROOT = Path('/content/gc-audio')
MODEL = 'OpenMOSS-Team/MOSS-TTS-v1.5'

SETUP = f'''set -x
nvidia-smi --query-gpu=name,driver_version,memory.total --format=csv
nvidia-smi | sed -n 3p
python3 --version
apt-get -qq update >/dev/null && apt-get -qq install -y sox libsox-dev >/dev/null
pip -q install uv
uv venv {VENV} -p 3.12
uv pip install --python {VENV}/bin/python --prerelease=allow "sglang-omni==0.2.0" soundfile requests
{VENV}/bin/python -c "import torch; print('torch', torch.__version__, 'cuda', torch.version.cuda, 'available', torch.cuda.is_available(), torch.cuda.get_device_capability() if torch.cuda.is_available() else '')"
{VENV}/bin/python -c "import sglang_omni; print('sglang_omni ok', getattr(sglang_omni, '__version__', ''))"
{VENV}/bin/python -c "import flash_attn; print('flash_attn ok')" || echo "flash_attn import failed"
ls {VENV}/bin | grep -i sgl
echo SETUP DONE
'''

if args.setup:
    if (VENV / 'bin/sgl-omni').exists():
        print('already installed:', VENV)
    else:
        Path('/content/sgl_setup.sh').write_text(SETUP)
        subprocess.Popen(['bash', '/content/sgl_setup.sh'], stdout=open(LOG, 'w'), stderr=subprocess.STDOUT, start_new_session=True)
        print('sglang-omni setup started in the background; log', LOG, flush=True)

if args.status:
    print('--- sgl_setup.log (key lines)')
    if LOG.exists():
        keep = [l for l in LOG.read_text(errors='replace').splitlines()
                if not l.startswith('+ ') or 'uv pip' in l or 'nvidia' in l]
        print('\n'.join(keep[-40:]))

if args.bench:
    TOOLS = ROOT / '_tts/tools/moss/tools'
    sys.path.insert(0, str(TOOLS))
    import requests
    import tts_worker as W, moss_engine as ME        # noqa: E401
    REFS = ROOT / '_tts/tools/moss/refs'
    reftext = json.loads((REFS / 'refs.json').read_text(encoding='utf-8'))
    wavdir = Path('/content/sgl_refs'); wavdir.mkdir(exist_ok=True)
    refs = {}
    for k, f in {'poem': 'serena_zh_poem', 'explain': 'serena_zh_explain', 'en': 'serena_en_explain'}.items():
        w = wavdir / f'{f}.wav'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(REFS / f'{f}.mp3'), '-ac', '1', '-ar', '24000', str(w)], check=True)
        refs[k] = (str(w), reftext[f]['text'])

    # 1. pause the worker (one GPU); remember to restart it at the end, whatever happens
    pidf = ROOT / 'worker.pid'
    try:
        os.killpg(int(pidf.read_text()), signal.SIGTERM); print('worker paused for the SGLang test', flush=True); time.sleep(10)
    except (OSError, ValueError):
        pass
    srv = None
    try:
        cfgp = Path('/content/sgl_moss.yaml')
        cfgp.write_text(f'''config_cls: MossTTSSingleProcessPipelineConfig
model_path: {MODEL}

stages:
  preprocessing:
    factory:
      device: cpu
      compute_dtype: bfloat16
      max_concurrency: {args.conc}

  tts_engine:
    engine:
      max_running_requests: {args.conc}
      mem_fraction_static: 0.75
      cuda_graph_max_bs: {args.conc}

  vocoder:
    factory:
      dtype: bfloat16
      max_batch_size: {args.conc}
      max_batch_wait_ms: 5
''')
        slog = open('/content/sgl_server.log', 'w')
        t0 = time.time()
        srv = subprocess.Popen([str(VENV / 'bin/sgl-omni'), 'serve', '--model-path', MODEL, '--config', str(cfgp), '--port', '8000'],
                               stdout=slog, stderr=subprocess.STDOUT, start_new_session=True,
                               env=dict(os.environ, PATH=f"{VENV}/bin:" + os.environ['PATH']))
        up = False
        while time.time() - t0 < 1500 and srv.poll() is None:
            for path in ('/health', '/v1/models'):
                try:
                    if requests.get('http://127.0.0.1:8000' + path, timeout=5).status_code == 200:
                        up = True
                except requests.RequestException:
                    pass
            if up:
                break
            time.sleep(10)
        tail = '\n'.join(Path('/content/sgl_server.log').read_text(errors='replace').splitlines()[-30:])
        if not up:
            raise SystemExit(f'SGLANG SERVER DID NOT START (exit {srv.poll()}) after {time.time() - t0:.0f}s:\n{tail}')
        print(f'server up in {time.time() - t0:.0f}s', flush=True)

        class SglEngine:
            def _one(self, it):
                ref, rtext = refs[ME.REF_KIND.get(it['kind'], it['kind'])]
                sec = 2 * ME.expected_seconds(it['text'], it['lang'], it['kind'], it.get('pace')) + 10
                body = dict(model=MODEL, voice='default', input=it['text'], ref_audio=ref,
                            language='Chinese' if it['lang'] == 'zh' else 'English',
                            audio_temperature=1.7, audio_top_p=0.8, audio_top_k=25, audio_repetition_penalty=1.0,
                            max_new_tokens=min(4096, int(sec * 12.5) + 25))
                if args.ref_text:
                    body['ref_text'] = rtext
                try:
                    r = requests.post('http://127.0.0.1:8000/v1/audio/speech', json=body, timeout=900)
                    r.raise_for_status()
                    with wave.open(io.BytesIO(r.content)) as w:
                        sr, ch, raw = w.getframerate(), w.getnchannels(), w.readframes(w.getnframes())
                    p = subprocess.run(['ffmpeg', '-v', 'error', '-f', 's16le', '-ar', str(sr), '-ac', str(ch), '-i', 'pipe:0',
                                        '-ac', '1', '-ar', '24000', '-f', 's16le', 'pipe:1'], input=raw, capture_output=True)
                    return p.stdout or None
                except Exception as e:                       # noqa: BLE001
                    print('request failed:', str(e)[:200], flush=True)
                    return None

            def generate(self, items, ffmpeg):
                from concurrent.futures import ThreadPoolExecutor
                with ThreadPoolExecutor(len(items)) as ex:
                    return list(ex.map(self._one, items))

        _b = ME.batches
        ME.batches = lambda cl, budget=10 ** 9, most=args.conc: _b(cl, 10 ** 9, args.conc)   # requests in flight together
        cfg = W.load_config(TOOLS / 'tts_config_moss.json'); cfg['ffmpeg'] = 'ffmpeg'
        lessons = args.bench.split(',')
        clips = []
        for l in lessons:
            t = json.loads(W.fetch(ME.SITE + l + '.json').decode('utf-8'))
            for c in t['clips']:
                if c['lang'] != 'zh' or c.get('demand'):
                    continue
                kind = ME.kind_of(l, 'zh', c.get('style'))
                clips.append(dict(lesson=l, lang='zh', key=c['key'], send=c['send'], kind=kind,
                                  pace=ME.target_pace(l, kind, c['send']), text=ME.with_pauses(c['send'], 'zh', kind)))
        OUT = ROOT / '_colab' / ('sglang-rt' if args.ref_text else 'sglang')
        dst = lambda c: OUT / c['lesson'].replace('/', '__') / 'zh' / f"{c['key']}.mp3"
        eng = SglEngine()
        eng.generate([clips[0]], 'ffmpeg')                   # warm-up
        t1 = time.time(); first = {}
        def on_best(c):
            first.setdefault(c['key'], c['best']['sec'])
            W.to_mp3(cfg, c['best']['pcm'], 24000, dst(c))
        ME.record(eng, clips, cfg, log=lambda s: None, on_best=on_best)
        wall = time.time() - t1
        audio_s = sum(c['best']['sec'] for c in clips if c.get('best'))
        ok = [c for c in clips if c.get('best') and not c['best']['reasons']]
        tries = sum(c.get('tries', 0) for c in clips)
        paces = sorted(c['best']['pace'] for c in clips if c.get('best'))
        print(f"RESULT sglang{' +ref_text' if args.ref_text else ''} conc {args.conc}: {len(clips)} clips, {len(ok)} pass "
              f"({100 * len(ok) / max(len(clips), 1):.0f}%), tries {tries} ({tries / max(len(clips), 1):.2f}/clip), "
              f"audio {audio_s / 60:.1f} min in {wall / 60:.1f} min = {audio_s / max(wall, 1):.2f}x real time, "
              f"median pace {paces[len(paces) // 2] if paces else 0}", flush=True)
        res = [dict(lesson=c['lesson'], lang='zh', key=c['key'], send=c['send'], kind=c['kind'], pace_target=c['pace'],
                    tries=c.get('tries', 0), **{k: v for k, v in (c.get('best') or {}).items() if k != 'pcm'}) for c in clips]
        OUT.mkdir(parents=True, exist_ok=True)
        (OUT / 'results.json').write_text(json.dumps(dict(engine='sglang-omni', wall_s=wall, audio_s=audio_s, clips=res),
                                                     ensure_ascii=False, indent=1), encoding='utf-8')
        for m in ('8b', '4b'):
            p = ROOT / '_colab' / m / 'results.json'
            if p.exists():
                d = json.loads(p.read_text(encoding='utf-8')); cl = [c for c in d['clips'] if c['lesson'] in lessons]
                okm = sum(1 for c in cl if c.get('sec') and not c.get('reasons')); tr = sum(c['tries'] for c in cl)
                print(f"COMPARE HF {m} (batch 8): {len(cl)} clips, {okm} pass, tries {tr / max(len(cl), 1):.2f}/clip, "
                      f"{d['audio_s'] / d['wall_s']:.2f}x real time", flush=True)
    finally:
        if srv and srv.poll() is None:
            os.killpg(srv.pid, signal.SIGTERM); time.sleep(15)
            try:
                os.killpg(srv.pid, signal.SIGKILL)
            except OSError:
                pass
        print('restarting the worker', flush=True)
        subprocess.run([sys.executable, 'colab_worker.py', '--restart', '--push', '--model', '8b', '--langs', 'zh'])
