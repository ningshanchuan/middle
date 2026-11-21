# Listening table in the notebook: the same sentences recorded by the 4B and the 8B on Colab (colab_lessons.py runs),
# next to the recording live on the site. Usage: %run colab_listen.py math/expressions,math/ratios [rows per lesson]
import base64, html, json, sys
from pathlib import Path
from IPython.display import HTML, display
ROOT = Path('/content/gc-audio/_colab')
lessons = (sys.argv[1] if len(sys.argv) > 1 else 'math/expressions,math/ratios').split(',')
per = int(sys.argv[2]) if len(sys.argv) > 2 else 12
res = {}
for m in ('4b', '8b'):
    p = ROOT / m / 'results.json'
    res[m] = {(c['lesson'], c['key']): c for c in json.loads(p.read_text(encoding='utf-8'))['clips']} if p.exists() else {}
def audio(m, c):
    f = ROOT / m / c['lesson'].replace('/', '__') / c['lang'] / f"{c['key']}.mp3"
    if not f.exists():
        return '<i>—</i>'
    note = f"{c.get('sec', 0)}s · {c.get('pace', 0)}/s{' · ⚠ ' + '; '.join(c['reasons']) if c.get('reasons') else ''}"
    return f"<audio controls preload=none src='data:audio/mpeg;base64,{base64.b64encode(f.read_bytes()).decode()}'></audio><br><small>{html.escape(note)}</small>"
rows = []
for l in lessons:
    keys = [k for k in res['8b'] if k[0] == l and k in res['4b']]
    keys.sort(key=lambda k: -len(res['8b'][k]['send']))          # longer sentences first: easier to judge
    for k in keys[:per]:
        a, b = res['4b'][k], res['8b'][k]
        live = f"https://gladcolor.github.io/gc-audio-lang-math/{l}/zh/{k[1]}.mp3"
        rows.append(f"<tr><td style='max-width:360px'>{html.escape(b['send'][:140])}<br><small>{l} · target {b.get('pace_target') or 'free'}/s</small></td>"
                    f"<td>{audio('4b', a)}</td><td>{audio('8b', b)}</td><td><audio controls preload=none src='{live}'></audio></td></tr>")
display(HTML("<h3>同一句话：4B（左）· 8B（中）· 网站现在的录音（右）</h3>"
             "<table border=1 cellpadding=4 style='border-collapse:collapse'><tr><th>文字</th><th>4B（Colab）</th><th>8B（Colab）</th>"
             f"<th>网站现在</th></tr>{''.join(rows)}</table>"))
