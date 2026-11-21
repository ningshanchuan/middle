# QA scan of the 8B clips the Colab worker recorded (ledger rows tagged "serena moss8b"): pace over the whole clip vs
# the TTS PC's target for the clip's kind (moss_engine.target_pace, window ±0.5), so problems are found before upload.
# Writes /content/gc-audio/qa_8b.json and prints a summary. CPU only (runs beside the worker).
import json, subprocess, sys, statistics, urllib.request
from collections import Counter, defaultdict
from pathlib import Path
ROOT = Path('/content/gc-audio'); TOOLS = ROOT / '_tts/tools/moss/tools'
sys.path.insert(0, str(TOOLS))
import tts_worker as W, moss_engine as ME   # noqa: E402
SITE = 'https://shanchuan.org/middle/readaloud/'
idx = json.loads(W.fetch(SITE + 'index.json').decode('utf-8'))
brisk = {l['id'] for l in idx['lessons'] if l.get('pace') == 'brisk'}
rows = []
for repo in ['gc-audio-science', 'gc-audio-humanities', 'gc-audio-lang-math']:
    lp = ROOT / repo / 'status/ledger.tsv'
    if not lp.exists():
        continue
    for line in lp.read_text(encoding='utf-8').splitlines()[1:]:
        p = line.split('\t')
        if len(p) >= 4 and p[3] == 'serena moss8b':
            rows.append((repo, p[2], p[0], p[1]))           # repo, lesson, lang, key
trans = {}
def clip_info(lesson, lang, key):
    if lesson not in trans:
        try:
            t = json.loads(W.fetch(SITE + lesson + '.json').decode('utf-8'))
            trans[lesson] = {(c['lang'], c['key']): c for c in t['clips']}
        except Exception:                                   # noqa: BLE001
            trans[lesson] = {}
    return trans[lesson].get((lang, key))
out, by_subj = [], defaultdict(list)
for repo, lesson, lang, key in rows:
    f = ROOT / repo / lesson / lang / f'{key}.mp3'
    c = clip_info(lesson, lang, key)
    if not f.exists() or not c:
        out.append(dict(repo=repo, lesson=lesson, lang=lang, key=key, problem='missing file or transcript')); continue
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', str(f)],
                       capture_output=True, text=True)
    sec = float(r.stdout or 0)
    kind = ME.kind_of(lesson, lang, c.get('style'))
    tgt = ME.target_pace(lesson, kind, c['send'], brisk=lesson in brisk)
    text = ME.with_pauses(c['send'], lang, kind)
    sl = W.speech_len(c['send'], lang)
    pace = sl / sec if sec else 0
    # pace without the pause markers' time (how fast the words themselves are read)
    words_pace = sl / max(sec - ME.tags_seconds(text), 0.5) if sec else 0
    status = 'ok'
    if tgt and sl >= 15:
        if pace > tgt + 0.5:
            status = 'fast' if pace <= 1.6 * tgt else 'extreme-fast'
        elif pace < tgt - 0.5:
            status = 'slow' if pace >= 0.5 * tgt else 'extreme-slow'
    d = dict(repo=repo, lesson=lesson, lang=lang, key=key, kind=kind, chars=round(sl), sec=round(sec, 2),
             pace=round(pace, 2), words_pace=round(words_pace, 2), target=tgt, status=status, send=c['send'][:80])
    out.append(d); by_subj[lesson.split('/')[0]].append(d)
(ROOT / 'qa_8b.json').write_text(json.dumps(out, ensure_ascii=False, indent=0), encoding='utf-8')
st = Counter(d.get('status', d.get('problem')) for d in out)
print(f'QA 8B: {len(out)} clips in the ledger: {dict(st)}')
for s, ds in sorted(by_subj.items()):
    paced = [d for d in ds if d['target'] and d['chars'] >= 15]
    if paced:
        print(f"  {s:12s} n={len(ds):5d}  pace median {statistics.median(d['pace'] for d in paced):.2f} vs target median "
              f"{statistics.median(d['target'] for d in paced):.2f}; out of window {sum(d['status'] != 'ok' for d in paced)} "
              f"(extreme {sum(d['status'].startswith('extreme') for d in paced)})")
for d in [d for d in out if str(d.get('status', '')).startswith('extreme')][:15]:
    print(f"  EXTREME {d['lesson']} {d['key']} {d['sec']}s pace {d['pace']} (target {d['target']}): {d['send']}")
