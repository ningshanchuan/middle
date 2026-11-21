# Hand a re-record list to the worker: tools/readaloud/qa/<file> (lines "lang:key") -> /content/gc-audio/rerecord.txt.
# The worker drops those ledger rows at the start of its next pass and records the clips again (from their spoken script).
#   %run colab_rerecord.py rerecord_raw8b_zh.txt
import subprocess, sys
from pathlib import Path
name = sys.argv[1] if len(sys.argv) > 1 else 'rerecord_raw8b_zh.txt'
r = subprocess.run(['curl', '-sfH', 'Accept: application/vnd.github.raw',
                    f'https://api.github.com/repos/ningshanchuan/middle/contents/tools/readaloud/qa/{name}'], capture_output=True, check=True)
lines = [l for l in r.stdout.decode('utf-8').splitlines() if l.strip() and not l.startswith('#')]
p = Path('/content/gc-audio/rerecord.txt')
old = p.read_text(encoding='utf-8').splitlines() if p.exists() else []
p.write_text('\n'.join(sorted(set(old) | set(lines))) + '\n', encoding='utf-8')
print(f'rerecord.txt: {len(lines)} entries from {name}', flush=True)
