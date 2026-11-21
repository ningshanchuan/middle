# Echo the running worker's key log lines, the GPU memory peak and the clip count every minute, for N minutes
# (so progress can be read from the notebook output). Usage: %run colab_watch.py [minutes]
import os, re, sys, time
from pathlib import Path
ROOT = Path('/content/gc-audio')
mins = int(sys.argv[1]) if len(sys.argv) > 1 else 20
keys = re.compile(r'finished|pushed|push|commit|error|Traceback|failed|OOM|dead|live', re.I)
seen = len((ROOT / 'worker.log').read_text(errors='replace').splitlines()) if (ROOT / 'worker.log').exists() else 0
def clips():
    n = 0
    for r in ('gc-audio-science', 'gc-audio-humanities', 'gc-audio-lang-math'):
        p = ROOT / r / 'status/ledger.tsv'
        if p.exists():
            n += sum(1 for l in p.read_text(encoding='utf-8').splitlines() if '\tserena moss8b' in l)
    return n
start, n0 = time.time(), clips()
while time.time() - start < mins * 60:
    time.sleep(60)
    p = ROOT / 'worker.log'
    lines = p.read_text(errors='replace').splitlines() if p.exists() else []
    new, seen = lines[seen:], len(lines)
    for ln in [l for l in new if keys.search(l)][-8:]:
        print('  log:', ln[:200], flush=True)
    peak = (ROOT / 'gpu_peak.txt').read_text().strip() if (ROOT / 'gpu_peak.txt').exists() else 'no batch yet'
    oom = len((ROOT / 'gpu_oom.txt').read_text().splitlines()) if (ROOT / 'gpu_oom.txt').exists() else 0
    alive = True
    try:
        os.kill(int((ROOT / 'worker.pid').read_text()), 0)
    except (OSError, ValueError):
        alive = False
    n = clips()
    print(f"{time.strftime('%H:%M:%S')} UTC  8B clips {n} (+{n - n0} in {(time.time() - start) / 60:.0f} min)  GPU {peak}  "
          f"OOM splits {oom}  worker {'running' if alive else 'STOPPED'}", flush=True)
    if not alive:
        print('worker.out tail:\n' + '\n'.join((ROOT / 'worker.out').read_text(errors='replace').splitlines()[-30:]), flush=True)
        break
