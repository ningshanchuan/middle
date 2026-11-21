# Diagnostics of the Colab worker: process state, log tails, SGLang errors, and what the log says about some lessons.
#   %run colab_diag.py [lesson ...]
import os, subprocess, sys
from pathlib import Path
ROOT = Path('/content/gc-audio')
def alive(pidfile):
    try:
        os.kill(int((ROOT / pidfile).read_text()), 0); return 'running'
    except Exception as e:                               # noqa: BLE001
        return f'NOT running ({e.__class__.__name__})'
print('worker', alive('worker.pid'), '| sglang server', alive('sgl.pid'))
print(subprocess.run('nvidia-smi --query-gpu=memory.used,memory.total,utilization.gpu --format=csv', shell=True,
                     capture_output=True, text=True).stdout)
for f, n in (('worker.log', 40), ('worker.out', 30), ('sgl_errors.txt', 10)):
    p = ROOT / f
    if p.exists():
        print(f'--- {f} (last {n})'); print('\n'.join(p.read_text(errors='replace').splitlines()[-n:]))
lessons = sys.argv[1:] or ['math/exponents', 'china/terrain']
log = (ROOT / 'worker.log').read_text(errors='replace').splitlines() if (ROOT / 'worker.log').exists() else []
for l in lessons:
    hits = [x for x in log if l in x][-6:]
    print(f'--- log lines for {l}:'); print('\n'.join(hits) or '(none)')
p = Path('/content/sgl_server.log')
if p.exists():
    print('--- sgl_server.log (last 15)'); print('\n'.join(p.read_text(errors='replace').splitlines()[-15:]))
