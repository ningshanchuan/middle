# The current Colab job. The notebook has one fixed runner cell that fetches this file from the GitHub API (no CDN
# cache) and runs it; the content PC changes this file to change what Colab does:
#   !curl -sH "Accept: application/vnd.github.raw" -o job.py https://api.github.com/repos/ningshanchuan/middle/contents/tools/colab/job.py
#   %run job.py
import subprocess, sys

def get(name):
    subprocess.run(['curl', '-sfH', 'Accept: application/vnd.github.raw', '-o', name,
                    f'https://api.github.com/repos/ningshanchuan/middle/contents/tools/colab/{name}'], check=True)

# zh + en (zh is nearly done; en clips that need a spoken script wait for it, the rest record now); SGLang 32 in flight as
# 2 streams; then 3 hours of progress lines (keeps the session active)
JOBS = [['colab_worker.py', '--restart', '--push', '--model', '8b', '--langs', 'zh,en', '--sglang', '32', '--streams', '2', '--yuwen'],
        ['colab_watch.py', '180']]   # + yuwen (mood list approved by the user)
import traceback
for JOB in JOBS:
    get(JOB[0])
    sys.argv = JOB
    print('job:', ' '.join(JOB), flush=True)
    try:
        exec(compile(open(JOB[0], encoding='utf-8').read(), JOB[0], 'exec'), {'__name__': '__main__'})
    except BaseException:
        tb = traceback.format_exc()
        open('/content/job_error.txt', 'w').write(tb)
        print('JOB FAILED (plain text so it can be read):', tb[-3000:], sep='\n', flush=True)
        break
