# The current Colab job. The notebook has one fixed runner cell that fetches this file from the GitHub API (no CDN
# cache) and runs it; the content PC changes this file to change what Colab does:
#   !curl -sH "Accept: application/vnd.github.raw" -o job.py https://api.github.com/repos/ningshanchuan/middle/contents/tools/colab/job.py
#   %run job.py
import subprocess, sys

def get(name):
    subprocess.run(['curl', '-sfH', 'Accept: application/vnd.github.raw', '-o', name,
                    f'https://api.github.com/repos/ningshanchuan/middle/contents/tools/colab/{name}'], check=True)

# restart the 8B worker (HF) with direct pushes and the say patch, then 10 minutes of progress (prints the worker's
# output if it stops)
JOBS = [['colab_worker.py', '--restart', '--push', '--model', '8b', '--langs', 'zh'],
        ['colab_watch.py', '10']]
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
