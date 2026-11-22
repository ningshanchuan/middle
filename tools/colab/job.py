# The current Colab job. The notebook has one fixed runner cell that fetches this file from the GitHub API (no CDN
# cache) and runs it; the content PC changes this file to change what Colab does:
#   !curl -sf -o job.py "https://raw.githubusercontent.com/ningshanchuan/middle/main/tools/colab/job.py?v=$(date +%s)"
#   %run job.py
import subprocess, sys, time

def get(name):
    # raw.githubusercontent.com (the time stamp skips its cache): the GitHub API allows only 60 unauthenticated
    # reads an hour per IP, and a 403 page ran as an empty job (2026-11-22)
    subprocess.run(['curl', '-sf', '-o', name,
                    f'https://raw.githubusercontent.com/ningshanchuan/middle/main/tools/colab/{name}?v={time.time():.0f}'], check=True)

# one lesson at a time (the user, 2026-11-21): the worker records the lessons in lesson_queue.txt first (each to the end:
# Chinese and English, pushed, live-checked), then the rest in catalog order; the queue is re-read before every lesson
JOBS = [['colab_resume.py']]   # fresh runtime: environment from Drive, then the worker (--queue) and progress lines
OLD_JOBS = [['colab_worker.py', '--restart', '--push', '--model', '8b', '--langs', 'zh,en', '--sglang', '32', '--streams', '2', '--yuwen', '--queue'],
        ['colab_watch.py', '180']]
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
