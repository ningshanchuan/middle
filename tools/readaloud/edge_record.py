# Stand-in recordings of the on-demand clips with a Microsoft Edge voice (edge-tts), from the spoken scripts
# (readaloud/say/<lang>.json, else the page text), into ningshanchuan/gc-audio-edge-<lang> (GitHub Pages):
#   <lang>/<key>.mp3                    one file per clip key (keys repeat across lessons)
#   <subject>/<topic>/manifest.js       LabAudioManifest({lesson: 'edge:<id>', voice, <lang>: '<key> ...'})
# The site plays a Serena recording first, then this, then the browser voice (shared/lab.js, audio-sources.js "edge").
# Slow on purpose (3 requests at a time, back-off on errors): edge-tts is an unofficial use of Microsoft's service.
#   python edge_record.py <lang> <corpus.json> <repo dir>      (resumable; pushes every 300 new clips)
import asyncio, hashlib, json, os, random, subprocess, sys, time
import edge_tts

LANG, CORPUS, REPO = sys.argv[1], sys.argv[2], sys.argv[3]
VOICE = {'zh': 'zh-CN-XiaoxiaoNeural', 'en': 'en-US-AvaNeural'}[LANG]
SITE = r'F:\Shanchuan\Biology_study\science-lab'
say = json.load(open(os.path.join(SITE, 'readaloud', 'say', LANG + '.json'), encoding='utf-8'))
flat = {h: s for m in say['lessons'].values() for h, s in m.items()}
SKIP = set(say.get('skip', []))
# 多音字: the site's substitution table (tools/tts/polyfix.tsv: word, pinyin, same-sound single-reading substitute),
# applied only to the text sent to the voice; longest match wins, left to right; "word = substitute" protects a word
POLY = {}
for line in open(os.path.join(SITE, 'tools', 'tts', 'polyfix.tsv'), encoding='utf-8'):
    p = line.rstrip('\r\n').split('\t')
    if len(p) >= 3 and not p[0].startswith('#') and len(p[0]) == len(p[2]):
        POLY[p[0]] = p[2]
MAXW = max(map(len, POLY)) if POLY else 0


def polyfix(t):
    if LANG != 'zh' or not POLY:
        return t
    out, i = [], 0
    while i < len(t):
        for n in range(min(MAXW, len(t) - i), 0, -1):
            w = t[i:i + n]
            if w in POLY:
                out.append(POLY[w]); i += n; break
        else:
            out.append(t[i]); i += 1
    return ''.join(out)


texts, raw, lessons = {}, {}, {}
for c in json.load(open(CORPUS, encoding='utf-8')):
    if not c.get('demand'):
        continue
    h = hashlib.sha1(c['send'].encode('utf-8')).hexdigest()[:12]
    if h in SKIP:
        continue                                         # never read (photo credits, licences)
    t = flat.get(h) or c['send']
    raw[c['key']] = t
    texts[c['key']] = polyfix(t)
    lessons.setdefault(c['lesson'], set()).add(c['key'])
os.makedirs(os.path.join(REPO, LANG), exist_ok=True)
path = lambda k: os.path.join(REPO, LANG, k + '.mp3')
sent_p = os.path.join(REPO, '..', f'edge_{LANG}_sent.json')
sent = json.load(open(sent_p, encoding='utf-8')) if os.path.exists(sent_p) else {}
# record: missing files; files made from another text (sent = text of each file; files from before the 多音字 table
# have no entry: they were made from the unfixed text, so they are redone where the table changes the text)
todo = [k for k in texts if not os.path.exists(path(k)) or sent.get(k, raw[k]) != texts[k]]
redo = [k for k in todo if os.path.exists(path(k))]
for k in redo:
    os.remove(path(k))
random.shuffle(todo)
log = open(os.path.join(REPO, '..', f'edge_{LANG}.log'), 'a', encoding='utf-8')
def say_log(m):
    line = time.strftime('%H:%M:%S ') + m
    print(line, flush=True); log.write(line + '\n'); log.flush()


def publish(n):
    for lid, keys in lessons.items():
        have = sorted(k for k in keys if os.path.exists(path(k)))
        if not have:
            continue
        d = os.path.join(REPO, lid); os.makedirs(d, exist_ok=True)
        js = 'LabAudioManifest(' + json.dumps({'lesson': 'edge:' + lid, 'voice': 'edge ' + VOICE, LANG: ' '.join(have)}) + ');\n'
        with open(os.path.join(d, 'manifest.js'), 'w', encoding='utf-8') as f:
            f.write('/* stand-in recordings (Microsoft Edge voice) of the on-demand clips; Serena recordings play first */\n' + js)
    g = ['git', '-C', REPO]
    subprocess.run(g + ['add', '-A'], check=True)
    if subprocess.run(g + ['diff', '--cached', '--quiet']).returncode:
        subprocess.run(g + ['commit', '-q', '-m', f'{n} {LANG} on-demand clips ({VOICE})'], check=True)
        r = subprocess.run(['git', '-C', REPO, '-c', 'credential.helper=', '-c', 'credential.helper=!gh auth git-credential', 'push', '-q', 'origin', 'main'],
                           env=dict(os.environ, GIT_TERMINAL_PROMPT='0'), capture_output=True, text=True)
        say_log('pushed' if r.returncode == 0 else 'PUSH FAILED ' + r.stderr[-200:])


async def main():
    say_log(f'{LANG}: {len(texts)} clips, {len(todo)} to record, voice {VOICE}')
    sem = asyncio.Semaphore(3); done = 0; errors = 0; pause = 0
    async def one(k):
        nonlocal done, errors, pause
        async with sem:
            for a in range(6):
                if pause > time.time():
                    await asyncio.sleep(pause - time.time())
                try:
                    tmp = path(k) + '.part'
                    await edge_tts.Communicate(texts[k], VOICE).save(tmp)
                    if os.path.getsize(tmp) < 800:
                        raise RuntimeError('empty audio')
                    os.replace(tmp, path(k)); done += 1; errors = 0; sent[k] = texts[k]
                    await asyncio.sleep(0.3)
                    return
                except Exception as e:                   # noqa: BLE001
                    errors += 1
                    wait = min(300, 5 * 2 ** a)
                    if errors >= 10:                     # many failures in a row: maybe throttled - back off for everyone
                        pause = time.time() + 300; say_log(f'many errors ({str(e)[:80]}), pausing 5 min')
                    await asyncio.sleep(wait)
            say_log(f'FAILED {k}')
    for i in range(0, len(todo), 300):
        await asyncio.gather(*(one(k) for k in todo[i:i + 300]))
        say_log(f'{done} recorded of {len(todo)}')
        json.dump(sent, open(sent_p, 'w', encoding='utf-8'), ensure_ascii=False)
        publish(done)
    publish(done)
    say_log('finished')

asyncio.run(main())
