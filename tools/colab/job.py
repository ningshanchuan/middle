# The current Colab job. The notebook has one fixed runner cell that fetches this file from the GitHub API (no CDN
# cache) and runs it; the content PC changes this file to change what Colab does:
#   !curl -sH "Accept: application/vnd.github.raw" -o job.py https://api.github.com/repos/ningshanchuan/middle/contents/tools/colab/job.py
#   %run job.py
import subprocess, sys

def get(name):
    subprocess.run(['curl', '-sfH', 'Accept: application/vnd.github.raw', '-o', name,
                    f'https://api.github.com/repos/ningshanchuan/middle/contents/tools/colab/{name}'], check=True)

# SGLang-Omni test, step 2: pause the worker, serve the 8B with SGLang-Omni, record math/expressions + math/ratios with
# the same rules and checks as the worker (16 requests in flight), print RESULT / COMPARE, restart the worker
get('colab_worker.py')
JOBS = [['colab_sglang.py', '--bench', 'math/expressions,math/ratios', '--conc', '32', '--ref-text']]   # round 2: 32 in flight + reference transcript; then the worker restarts with the say patch
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
