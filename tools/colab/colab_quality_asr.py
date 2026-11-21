# Scoring of the concurrency test recorded by colab_quality.py (files /content/gc-audio/_colab/conc/c<N>__<lesson>__<key>.mp3):
# faster-whisper large-v3-turbo on the CPU (the GPU stays with the recording worker), CER against the spoken script,
# pace/pitch checks, and a listening set uploaded as a release asset of gladcolor/gc-audio-lang-math (tag listen-tests):
# no commit, so nothing collides with the worker's pushes.   %run colab_quality_asr.py
import hashlib, io, json, re, subprocess, sys, zipfile
from collections import defaultdict
from pathlib import Path
import numpy as np
ROOT = Path('/content/gc-audio'); TOOLS = ROOT / '_tts/tools/moss/tools'; OUT = ROOT / '_colab/conc'
sys.path.insert(0, str(TOOLS))
import tts_worker as W, moss_engine as ME            # noqa: E402,E401

say = json.loads(W.fetch('https://shanchuan.org/middle/readaloud/say/zh.json').decode('utf-8'))
flat = {h: s for m in say['lessons'].values() for h, s in m.items()}
NEED = re.compile('[0-9A-Za-z]|[^一-鿿　-〿＀-￯“”‘’—…·\\s]')
files = sorted(OUT.glob('c*__*.mp3'))
groups = defaultdict(dict)
texts = {}
for f in files:
    n, rest = f.stem.split('__', 1)
    parts = rest.split('__'); key = parts[-1]; lesson = '/'.join(parts[:-1])
    groups[int(n[1:])][(lesson, key)] = f
    if (lesson, key) not in texts:
        t = json.loads(W.fetch(ME.SITE + lesson + '.json').decode('utf-8'))
        for c in t['clips']:
            if c['lang'] == 'zh' and c['key'] == key:
                h = hashlib.sha1(c['send'].encode('utf-8')).hexdigest()[:12]
                texts[(lesson, key)] = (flat.get(h) or c['send'], bool(NEED.search(c['send'])))
print({n: len(g) for n, g in groups.items()}, 'files;', len(texts), 'texts', flush=True)

subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', 'faster-whisper'], check=True)
from faster_whisper import WhisperModel
asr = WhisperModel('large-v3-turbo', device='cpu', compute_type='int8', cpu_threads=8)


def pcm(f, sr):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(f), '-ac', '1', '-ar', str(sr), '-f', 's16le', 'pipe:1'], capture_output=True, check=True)
    return r.stdout


def norm(s):
    return re.sub('[^一-鿿A-Za-z0-9]', '', s)


def cer(ref, hyp):
    import difflib
    ref, hyp = norm(ref), norm(hyp)
    m = difflib.SequenceMatcher(None, ref, hyp, autojunk=False)
    return 1 - sum(x.size for x in m.get_matching_blocks()) / max(len(ref), 1)


cfg = W.load_config(TOOLS / 'tts_config_moss.json'); cfg['ffmpeg'] = 'ffmpeg'
res = defaultdict(dict)
for n, g in sorted(groups.items()):
    for k, f in g.items():
        text, scripted = texts.get(k, ('', False))
        a16 = np.frombuffer(pcm(f, 16000), dtype='<i2').astype('float32') / 32768
        segs, _ = asr.transcribe(a16, language='zh', beam_size=5, initial_prompt='以下是普通话的句子。')
        hyp = ''.join(s.text for s in segs)
        p24 = pcm(f, 24000)
        c = dict(lesson=k[0], lang='zh', key=k[1], send=text, kind='explain', pace=ME.target_pace(k[0], 'explain', text),
                 text=ME.with_pauses(text, 'zh', 'explain'))
        m = ME.check(c, p24, cfg)
        res[n][k] = dict(f=f.name, text=text, scripted=scripted, asr=hyp, cer=cer(text, hyp), sec=m['sec'], pace=m['pace'], ok=not m['reasons'])
    rs = list(res[n].values()); pl = sorted(r['cer'] for r in rs if not r['scripted'])
    print(f"RESULT conc {n}: plain clips CER mean {100 * sum(pl) / max(len(pl), 1):.1f}% median {100 * pl[len(pl) // 2]:.1f}% "
          f"| plain clips with CER > 10%: {sum(1 for x in pl if x > 0.1)}/{len(pl)} | all clips CER mean "
          f"{100 * sum(r['cer'] for r in rs) / len(rs):.1f}% | pace/pitch pass {sum(1 for r in rs if r['ok'])}/{len(rs)}", flush=True)
keys = sorted(set().union(*[set(g) for g in res.values()]))
for k in keys:                                           # the clips where the two settings differ most
    vals = {n: res[n][k]['cer'] for n in res if k in res[n]}
    if max(vals.values()) > 0.1:
        print('  ', k[0], k[1], {n: f'{100 * v:.0f}%' for n, v in vals.items()}, '|', texts[k][0][:40], flush=True)

# listening set as a release asset (zip of the mp3s + index.json in the listen/ab.html format)
rows = []
for k in keys:
    takes = {f'SGLang 并发 {n}': dict(src=res[n][k]['f'], sec=res[n][k]['sec'], pace=res[n][k]['pace'], tries=1, ok=res[n][k]['ok'],
                                      asr=res[n][k]['asr'], cer=round(100 * res[n][k]['cer'], 1)) for n in sorted(res) if k in res[n]}
    rows.append(dict(lesson=k[0], key=k[1], send=texts[k][0], target=ME.target_pace(k[0], 'explain', texts[k][0]), takes=takes))
buf = io.BytesIO()
with zipfile.ZipFile(buf, 'w', zipfile.ZIP_STORED) as z:
    z.writestr('index.json', json.dumps(dict(title='并发数对比（同一句只录一次，不重试；识别：Whisper large-v3-turbo）', rows=rows), ensure_ascii=False))
    for n in res:
        for r in res[n].values():
            z.write(OUT / r['f'], r['f'])
try:
    import urllib.request as ur
    from google.colab import userdata
    tok = userdata.get('GH_TOKEN')
    H = {'Authorization': f'Bearer {tok}', 'Accept': 'application/vnd.github+json'}
    api = 'https://api.github.com/repos/gladcolor/gc-audio-lang-math'
    try:
        rel = json.loads(ur.urlopen(ur.Request(f'{api}/releases/tags/listen-tests', headers=H)).read())
    except Exception:                                    # noqa: BLE001
        rel = json.loads(ur.urlopen(ur.Request(f'{api}/releases', data=json.dumps(dict(tag_name='listen-tests', name='listening tests (not lesson audio)',
                         body='Test recordings for comparison pages; not used by the site.', prerelease=True)).encode(), headers=H, method='POST')).read())
    for a in rel.get('assets', []):
        if a['name'] == 'conc.zip':
            ur.urlopen(ur.Request(a['url'], headers=H, method='DELETE'))
    up = rel['upload_url'].split('{')[0] + '?name=conc.zip'
    ur.urlopen(ur.Request(up, data=buf.getvalue(), headers=dict(H, **{'Content-Type': 'application/zip'}), method='POST'))
    print(f'listening set uploaded: release listen-tests / conc.zip ({len(buf.getvalue()) / 2**20:.1f} MB)', flush=True)
except Exception as e:                                   # noqa: BLE001
    print('upload failed:', str(e)[:200], flush=True)
