# Plain-text summary of a colab_lessons.py run (results.json), readable from outside the notebook.
import json, statistics, sys
from collections import defaultdict
model = sys.argv[1] if len(sys.argv) > 1 else '8b'
r = json.load(open(f'/content/gc-audio/_colab/{model}/results.json', encoding='utf-8'))
cl = r['clips']
ok = [c for c in cl if c.get('sec') and not c.get('reasons')]
print(f"SUMMARY {r['model']} ({r['tag']}): {len(cl)} clips, {len(ok)} pass all checks, {len(cl) - len(ok)} kept with a failed check")
print(f"audio {r['audio_s'] / 60:.1f} min in {r['wall_s'] / 60:.1f} min = {r['audio_s'] / r['wall_s']:.2f}x real time; tries {sum(c['tries'] for c in cl)} "
      f"(avg {sum(c['tries'] for c in cl) / len(cl):.2f} per clip)")
by = defaultdict(list)
for c in cl:
    if c.get('sec'):
        by[(c['lesson'], c['kind'])].append(c)
for (l, k), cs in sorted(by.items()):
    paces = [c['pace'] for c in cs if c.get('pace')]
    tgt = cs[0].get('pace_target')
    fails = sum(1 for c in cs if c.get('reasons'))
    print(f"  {l:22s} {k:8s} n={len(cs):3d} pace median {statistics.median(paces):.2f} (target {tgt}) F0 median "
          f"{statistics.median([c['f0'] for c in cs]):.0f} Hz, still failing {fails}")
reasons = defaultdict(int)
for c in cl:
    for x in c.get('reasons') or []:
        reasons[x.split(' ')[0] + ' ' + (x.split(' ')[1] if x.startswith('stray') else '')] += 1
print('failure reasons:', dict(reasons))
for c in [c for c in cl if c.get('reasons')][:12]:
    print(f"  FAIL {c['lesson']} {c['key']} {c['sec']}s {c['pace']}/s: {'; '.join(c['reasons'])} | {c['send'][:40]}")
