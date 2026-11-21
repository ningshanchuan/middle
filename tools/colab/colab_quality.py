# Does SGLang concurrency change the quality? (SGLang-Omni's own benchmark: best WER at 8 requests in flight.)
# The same clips are recorded once each (no retries) with N requests in flight for every N given, then transcribed with
# faster-whisper large-v3 on the GPU and compared with the spoken script: character error rate (CER), plus speed, pace
# and pitch checks. A listening set goes to gc-audio-lang-math/_listen/conc/ (site page listen/ab.html?d=...).
#   %run colab_quality.py 8,32 [clips per group]
import io, json, os, re, signal, subprocess, sys, time, wave, hashlib, random, shutil
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
ROOT = Path('/content/gc-audio'); TOOLS = ROOT / '_tts/tools/moss/tools'; V = Path('/content/sgl')
sys.path.insert(0, str(TOOLS))
import tts_worker as W, moss_engine as ME            # noqa: E402,E401
CONCS = [int(x) for x in (sys.argv[1] if len(sys.argv) > 1 else '8,32').split(',')]
PER = int(sys.argv[2]) if len(sys.argv) > 2 else 36
import urllib.request as ur

# 1. clips: plain Chinese explanation clips + clips with a published spoken script (numbers, units ...)
say = json.loads(W.fetch('https://shanchuan.org/middle/readaloud/say/zh.json').decode('utf-8'))
flat = {h: s for m in say['lessons'].values() for h, s in m.items()}
NEED = re.compile(r'[0-9A-Za-z]|[^一-鿿　-〿＀-￯“”‘’—…·\s]')
random.seed(5)
lessons = ['biology/cell-theory', 'china/ming-qing', 'geography/population', 'physics/energy', 'china/terrain', 'math/exponents',
           'earth/plate-tectonics', 'worldhistory/wh-greece-rome']
plain, scripted = [], []
for l in lessons:
    try:
        t = json.loads(W.fetch(ME.SITE + l + '.json').decode('utf-8'))
    except Exception:                                    # noqa: BLE001
        continue
    for c in t['clips']:
        if c['lang'] != 'zh' or c.get('demand') or c.get('style') or not (20 <= len(c['send']) <= 140):
            continue
        h = hashlib.sha1(c['send'].encode('utf-8')).hexdigest()[:12]
        if not NEED.search(c['send']):
            plain.append(dict(lesson=l, key=c['key'], text=c['send']))
        elif h in flat:
            scripted.append(dict(lesson=l, key=c['key'], text=flat[h]))
clips = random.sample(plain, min(PER, len(plain))) + random.sample(scripted, min(PER // 2, len(scripted)))
for c in clips:
    c['kind'] = 'explain'; c['pace'] = ME.target_pace(c['lesson'], 'explain', c['text']); c['tagged'] = ME.with_pauses(c['text'], 'zh', 'explain')
print(f'{len(clips)} clips ({sum(1 for c in clips if not NEED.search(c["text"]) and c in plain)} plain)', flush=True)

refs = json.loads((ROOT / '_tts/tools/moss/refs/refs.json').read_text(encoding='utf-8'))
REF = ('/content/sgl_refs/serena_zh_explain.wav', refs['serena_zh_explain']['text'])
OUT = ROOT / '_colab/conc'; OUT.mkdir(parents=True, exist_ok=True)


def serve(n):
    yp = Path(f'/content/sgl_q{n}.yaml')
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
    p = subprocess.Popen([str(V / 'bin/sgl-omni'), 'serve', '--model-path', 'OpenMOSS-Team/MOSS-TTS-v1.5', '--config', str(yp), '--port', '8000'],
                         stdout=open(f'/content/sgl_q{n}.log', 'w'), stderr=subprocess.STDOUT, start_new_session=True,
                         env=dict(os.environ, PATH=f"{V}/bin:" + os.environ['PATH']))
    t0 = time.time()
    while time.time() - t0 < 1200 and p.poll() is None:
        time.sleep(8)
        try:
            if ur.urlopen('http://127.0.0.1:8000/health', timeout=5).status == 200:
                return p
        except Exception:                                # noqa: BLE001
            pass
    raise SystemExit(f'server {n} did not start')


def one(c):
    body = dict(model='OpenMOSS-Team/MOSS-TTS-v1.5', voice='default', input=c['tagged'], ref_audio=REF[0], ref_text=REF[1], language='Chinese',
                audio_temperature=1.7, audio_top_p=0.8, audio_top_k=25, audio_repetition_penalty=1.0,
                max_new_tokens=int((2 * ME.expected_seconds(c['tagged'], 'zh', 'explain', c['pace']) + 10) * 12.5) + 25)
    raw = ur.urlopen(ur.Request('http://127.0.0.1:8000/v1/audio/speech', data=json.dumps(body).encode('utf-8'),
                                headers={'Content-Type': 'application/json'}), timeout=900).read()
    with wave.open(io.BytesIO(raw)) as w:
        sr, ch, pcm = w.getframerate(), w.getnchannels(), w.readframes(w.getnframes())
    r = subprocess.run(['ffmpeg', '-v', 'error', '-f', 's16le', '-ar', str(sr), '-ac', str(ch), '-i', 'pipe:0', '-ac', '1', '-ar', '24000',
                        '-f', 's16le', 'pipe:1'], input=pcm, capture_output=True)
    return r.stdout


pidf = ROOT / 'worker.pid'
for pf in (pidf, ROOT / 'sgl.pid'):
    try:
        os.killpg(int(pf.read_text()), signal.SIGTERM)
    except Exception:                                    # noqa: BLE001
        pass
time.sleep(20); print('worker and server paused for the test', flush=True)
cfg = W.load_config(TOOLS / 'tts_config_moss.json'); cfg['ffmpeg'] = 'ffmpeg'
res = {}
try:
    for n in CONCS:
        srv = serve(n); print(f'server {n} up', flush=True)
        one(clips[0])                                    # warm-up
        t0 = time.time()
        with ThreadPoolExecutor(n) as ex:
            pcms = list(ex.map(one, clips))
        wall = time.time() - t0
        os.killpg(srv.pid, signal.SIGTERM); time.sleep(20)
        rows = []
        for c, pcm in zip(clips, pcms):
            f = OUT / f'c{n}__{c["lesson"].replace("/", "__")}__{c["key"]}.mp3'
            W.to_mp3(cfg, pcm, 24000, f)
            m = ME.check(dict(c, lang='zh', send=c['text'], text=c['tagged']), pcm, cfg)
            rows.append(dict(c=c, f=f, sec=m['sec'], pace=m['pace'], reasons=m['reasons']))
        res[n] = dict(wall=wall, rows=rows)
        print(f'conc {n}: {len(clips)} clips in {wall:.0f}s, audio {sum(r["sec"] for r in rows):.0f}s', flush=True)
    # 2. transcribe on the (now free) GPU
    subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', 'faster-whisper'], check=True)
    from faster_whisper import WhisperModel
    asr = WhisperModel('large-v3', device='cuda', compute_type='float16')
    def norm(s):
        return re.sub(r'[^一-鿿A-Za-z0-9]', '', s)
    def cer(ref, hyp):
        import difflib
        ref, hyp = norm(ref), norm(hyp)
        m = difflib.SequenceMatcher(None, ref, hyp, autojunk=False)
        same = sum(x.size for x in m.get_matching_blocks())
        return 1 - same / max(len(ref), 1)
    listen = []
    for n, d in res.items():
        for r in d['rows']:
            segs, _ = asr.transcribe(str(r['f']), language='zh', beam_size=5, initial_prompt='以下是普通话的句子。')
            r['asr'] = ''.join(s.text for s in segs)
            r['cer'] = cer(r['c']['text'], r['asr'])
    for n, d in res.items():
        rs = d['rows']; plain_rs = [r for r in rs if not NEED.search(r['c']['text'])]
        cs = sorted(r['cer'] for r in plain_rs)
        audio = sum(r['sec'] for r in rs)
        print(f"RESULT conc {n}: speed {audio / d['wall']:.2f}x real time | plain-clip CER mean {100 * sum(cs) / max(len(cs), 1):.1f}% "
              f"median {100 * cs[len(cs) // 2]:.1f}% | clips with CER > 10%: {sum(1 for x in cs if x > 0.1)}/{len(cs)} | "
              f"all clips CER mean {100 * sum(r['cer'] for r in rs) / len(rs):.1f}% | pace/pitch pass {sum(1 for r in rs if not r['reasons'])}/{len(rs)}", flush=True)
    # 3. listening set for the site
    L = ROOT / 'gc-audio-lang-math'; dd = L / '_listen/conc'; dd.mkdir(parents=True, exist_ok=True)
    rowsout = []
    for i, c in enumerate(clips):
        takes = {}
        for n, d in res.items():
            r = d['rows'][i]; shutil.copy(r['f'], dd / r['f'].name)
            takes[f'SGLang 并发 {n}'] = dict(src=r['f'].name, sec=r['sec'], pace=r['pace'], tries=1, ok=not r['reasons'],
                                         asr=r['asr'], cer=round(100 * r['cer'], 1))
        rowsout.append(dict(lesson=c['lesson'], key=c['key'], send=c['text'], target=c['pace'], takes=takes))
    (dd / 'index.json').write_text(json.dumps(dict(title='并发数对比（同一句只录一次，不重试）', rows=rowsout), ensure_ascii=False), encoding='utf-8')
    subprocess.run(f'cd {L} && git add _listen && git commit -qm "_listen/conc: concurrency comparison clips (test)" && git push -q origin HEAD:main', shell=True)
    print('listening set pushed: gc-audio-lang-math/_listen/conc/', flush=True)
finally:
    print('restarting the worker', flush=True)
    subprocess.run([sys.executable, 'colab_worker.py', '--restart', '--push', '--model', '8b', '--langs', 'zh', '--sglang', '32', '--streams', '2'])
