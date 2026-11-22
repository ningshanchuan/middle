# One command to resume recording in a FRESH Colab session (after the runtime was reset or timed out). Everything
# pushed is on GitHub; this rebuilds what lived only in /content:
#   1. SGLang-Omni in /content/sgl: restored from Google Drive (colab_drive_env.py, the user clicks Allow), or else
#      installed (colab_sglang.py --setup, about 10 minutes)
#   2. the worker: clones the TTS PC code and the three audio repos, patches, starts the SGLang server and the worker
#      (8B, zh + en + yuwen, 32 requests in flight as 2 streams, direct pushes with GH_TOKEN from Colab Secrets)
#   3. progress lines (keeps the session active)
# In job.py:  JOBS = [['colab_resume.py']]
import subprocess, sys, time
from pathlib import Path

def get(name):
    # raw.githubusercontent.com (the time stamp skips its cache): the GitHub API allows only 60 unauthenticated
    # reads an hour per IP, and a 403 page ran as an empty job (2026-11-22)
    subprocess.run(['curl', '-sf', '-o', name,
                    f'https://raw.githubusercontent.com/ningshanchuan/middle/main/tools/colab/{name}?v={time.time():.0f}'], check=True)

for f in ('colab_sglang.py', 'colab_worker.py', 'colab_watch.py', 'colab_drive_env.py'):
    get(f)
subprocess.run(['nvidia-smi', '--query-gpu=name,memory.used,memory.total', '--format=csv'])
if not Path('/content/sgl/bin/sgl-omni').exists():          # first the saved environment from Google Drive
    argv = sys.argv; sys.argv = ['colab_drive_env.py', '--restore']   # in this kernel: drive.mount needs the notebook
    try:
        exec(compile(open('colab_drive_env.py', encoding='utf-8').read(), 'colab_drive_env.py', 'exec'), {'__name__': '__main__'})
    except SystemExit:
        pass
    sys.argv = argv
if not Path('/content/sgl/bin/sgl-omni').exists():          # no archive: install the latest packages
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
# in THIS kernel (like the Drive restore): only the notebook kernel can read GH_TOKEN from Colab Secrets; a separate
# python process cannot, and the start failed with "no GH_TOKEN" (2026-11-21)
argv = sys.argv
sys.argv = ['colab_worker.py', '--restart', '--push', '--model', '8b', '--langs', 'zh,en',
            '--sglang', '64', '--streams', '4', '--inflight', '96', '--layout', 'single', '--yuwen', '--queue']
# 2026-11-22: split layout out of memory on the 40 GB A100 at 0.68 and 0.56 (a second stage process holds ~12 GB);
# single layout with 32 running kept the GPU fed without gaps but at ~50 % use: 64 at once gives each decode step more work
try:
    exec(compile(open('colab_worker.py', encoding='utf-8').read(), 'colab_worker.py', 'exec'), {'__name__': '__main__'})
except SystemExit as ex:
    if ex.code not in (None, 0):
        raise SystemExit('worker start failed: %s' % ex.code)
sys.argv = argv
subprocess.run([sys.executable, 'colab_watch.py', '180'])
