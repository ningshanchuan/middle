# One command to resume recording in a FRESH Colab session (after the runtime was reset or timed out). Everything
# pushed is on GitHub; this rebuilds what lived only in /content:
#   1. SGLang-Omni in /content/sgl (colab_sglang.py --setup, waited for; about 10 minutes)
#   2. the worker: clones the TTS PC code and the three audio repos, patches, starts the SGLang server and the worker
#      (8B, zh + en + yuwen, 32 requests in flight as 2 streams, direct pushes with GH_TOKEN from Colab Secrets)
#   3. progress lines (keeps the session active)
# In job.py:  JOBS = [['colab_resume.py']]
import subprocess, sys, time
from pathlib import Path

def get(name):
    subprocess.run(['curl', '-sfH', 'Accept: application/vnd.github.raw', '-o', name,
                    f'https://api.github.com/repos/ningshanchuan/middle/contents/tools/colab/{name}'], check=True)

for f in ('colab_sglang.py', 'colab_worker.py', 'colab_watch.py'):
    get(f)
subprocess.run(['nvidia-smi', '--query-gpu=name,memory.used,memory.total', '--format=csv'])
if not Path('/content/sgl/bin/sgl-omni').exists():
    subprocess.run([sys.executable, 'colab_sglang.py', '--setup'], check=True)
    log = Path('/content/sgl_setup.log'); t0 = time.time()
    while time.time() - t0 < 2400:
        time.sleep(30)
        txt = log.read_text(errors='replace') if log.exists() else ''
        if 'SETUP DONE' in txt:
            break
        print(f'installing SGLang-Omni ... {(time.time() - t0) / 60:.0f} min', flush=True)
    subprocess.run([sys.executable, 'colab_sglang.py', '--status'])
    if not Path('/content/sgl/bin/sgl-omni').exists():
        raise SystemExit('SGLang-Omni did not install; see /content/sgl_setup.log')
r = subprocess.run([sys.executable, 'colab_worker.py', '--restart', '--push', '--model', '8b', '--langs', 'zh,en',
                    '--sglang', '32', '--streams', '2', '--yuwen'])
if r.returncode:
    raise SystemExit('worker start failed')
subprocess.run([sys.executable, 'colab_watch.py', '180'])
