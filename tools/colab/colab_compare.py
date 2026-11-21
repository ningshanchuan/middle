# Same lessons with the 4B and the 8B, one after the other (each in its own process, so GPU memory is freed), then a
# plain-text comparison of speed and pass rate. Stops the running worker first (two models do not fit beside it).
import json, os, subprocess, sys, time
from pathlib import Path
ROOT = Path('/content/gc-audio')
LESSONS = sys.argv[1] if len(sys.argv) > 1 else 'math/expressions,math/ratios'
pidf = ROOT / 'worker.pid'
if pidf.exists():
    try:
        os.killpg(int(pidf.read_text()), 15); print('worker paused for the comparison', flush=True); time.sleep(8)
    except OSError:
        pass
for m in ('4b', '8b'):
    t = time.time()
    r = subprocess.run([sys.executable, 'colab_lessons.py', '--model', m, '--lessons', LESSONS, '--show', '0'],
                       capture_output=True, text=True)
    lines = [l for l in (r.stdout + r.stderr).splitlines() if l.startswith(('RESULT', 'Traceback', 'Error')) or 'Error' in l[:40]]
    print(f'{m}: exit {r.returncode} in {(time.time() - t) / 60:.1f} min | ' + ' | '.join(lines[-3:]), flush=True)
for m in ('4b', '8b'):
    p = ROOT / '_colab' / m / 'results.json'
    if not p.exists():
        print(m, 'no results'); continue
    d = json.loads(p.read_text(encoding='utf-8')); cl = [c for c in d['clips'] if c['lesson'] in LESSONS.split(',')]
    ok = sum(1 for c in cl if c.get('sec') and not c.get('reasons'))
    paces = sorted(c['pace'] for c in cl if c.get('pace'))
    print(f"COMPARE {m}: {len(cl)} clips, {ok} pass ({100 * ok / max(len(cl), 1):.0f}%), tries {sum(c['tries'] for c in cl)} "
          f"({sum(c['tries'] for c in cl) / max(len(cl), 1):.2f}/clip), audio {d['audio_s'] / 60:.1f} min in {d['wall_s'] / 60:.1f} min "
          f"= {d['audio_s'] / d['wall_s']:.2f}x real time, median pace {paces[len(paces) // 2] if paces else 0}", flush=True)
