# The current Colab job. The notebook has one fixed runner cell that fetches this file from the GitHub API (no CDN
# cache) and runs it; the content PC changes this file to change what Colab does:
#   !curl -sH "Accept: application/vnd.github.raw" -o job.py https://api.github.com/repos/ningshanchuan/middle/contents/tools/colab/job.py
#   %run job.py
import subprocess, sys

def get(name):
    subprocess.run(['curl', '-sfH', 'Accept: application/vnd.github.raw', '-o', name,
                    f'https://api.github.com/repos/ningshanchuan/middle/contents/tools/colab/{name}'], check=True)

JOB = ['colab_worker.py', '--start', '--status', '--model', '8b', '--langs', 'zh']   # keep recording (no push until GH_TOKEN is in Colab Secrets) + counts
get(JOB[0])
sys.argv = JOB
print('job:', ' '.join(JOB), flush=True)
import traceback
try:
    exec(compile(open(JOB[0], encoding='utf-8').read(), JOB[0], 'exec'), {'__name__': '__main__'})
except BaseException:
    tb = traceback.format_exc()
    open('/content/job_error.txt', 'w').write(tb)
    print('JOB FAILED (plain text so it can be read):', tb[-3000:], sep='\n', flush=True)
