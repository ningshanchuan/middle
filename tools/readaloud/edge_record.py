# Stand-in recordings with a Microsoft Edge voice (edge-tts) of every clip that has no Serena recording yet (originals
# included: 先有，再全，最后好), from the spoken scripts (readaloud/say/<lang>.json, else the page text).
# One repo per language and subject group (shared/audio-sources.js "edge"), GitHub Pages:
#   <lang>/<key>.mp3                    one file per clip key (keys repeat across lessons; a key used in two groups is in both)
#   <subject>/<topic>/manifest.js       LabAudioManifest({lesson: 'edge:<id>', voice, <lang>: '<key> ...'})
# Recordings live in a local cache (<base>/edge_cache/<lang>); the repos get hard links. Each push reconciles every repo
# (missing files linked, files no longer needed removed, manifests rewritten).
# The site plays a Serena recording first, then this, then the browser voice (shared/lab.js).
# Slow on purpose (3 requests at a time, back-off on errors): edge-tts is an unofficial use of Microsoft's service.
#   python edge_record.py <lang> <corpus.json> <base dir, e.g. D:\labtmp>      (resumable; pushes every 300 new clips)
import asyncio, hashlib, json, os, re, shutil, subprocess, sys, time, urllib.request
import edge_tts

LANG, CORPUS, BASE = sys.argv[1], sys.argv[2], sys.argv[3]
VOICE = {'zh': 'zh-CN-XiaoxiaoNeural', 'en': 'en-US-AvaNeural'}[LANG]
SITE = r'F:\Shanchuan\Biology_study\science-lab'
src = open(os.path.join(SITE, 'shared', 'audio-sources.js'), encoding='utf-8').read()
SRC = json.loads(src[src.index('{'):src.rindex('}') + 1])
group = lambda lid: SRC['shared'] if lid == '_shared' else SRC['subjects'].get(lid.split('/')[0], SRC['fallback'])
REPOS = {g: os.path.join(BASE, re.search(r'/(gc-audio-edge-[\w-]+)/$', url).group(1)) for g, url in SRC['edge'][LANG].items()}
CACHE = os.path.join(BASE, 'edge_cache', LANG); os.makedirs(CACHE, exist_ok=True)
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


# 先有，再全，最后好 (the user): every clip without a Serena recording gets an Edge stand-in first (originals too)
SERENA = set()
for repo in ('gc-audio-science', 'gc-audio-humanities', 'gc-audio-lang-math'):
    try:
        t = urllib.request.urlopen(f'https://raw.githubusercontent.com/gladcolor/{repo}/main/status/ledger.tsv?v={time.time()}', timeout=60).read().decode('utf-8')
        SERENA |= {p[1] for p in (l.split('\t') for l in t.splitlines()[1:]) if len(p) > 3 and p[0] == LANG and p[3] == 'serena moss8b'}
    except Exception:                                    # noqa: BLE001
        pass
texts, raw, lessons = {}, {}, {}
for c in json.load(open(CORPUS, encoding='utf-8')):
    if c['key'] in SERENA:                               # Serena already has it: no stand-in needed
        continue
    h = hashlib.sha1(c['send'].encode('utf-8')).hexdigest()[:12]
    if h in SKIP:
        continue                                         # never read (photo credits, licences)
    t = flat.get(h) or c['send']
    raw[c['key']] = t
    texts[c['key']] = polyfix(t)
    lessons.setdefault(c['lesson'], set()).add(c['key'])
cache = lambda k: os.path.join(CACHE, k + '.mp3')
# files recorded before the cache existed (in the repos): into the cache
for d in REPOS.values():
    ld = os.path.join(d, LANG)
    if os.path.isdir(ld):
        for f in os.listdir(ld):
            if f.endswith('.mp3') and not os.path.exists(os.path.join(CACHE, f)):
                os.link(os.path.join(ld, f), os.path.join(CACHE, f))
sent_p = os.path.join(BASE, f'edge_{LANG}_sent.json')
sent = json.load(open(sent_p, encoding='utf-8')) if os.path.exists(sent_p) else {}
# record: missing files; files made from another text (sent = text of each file; files from before the 多音字 table
# have no entry: they were made from the unfixed text, so they are redone where the table changes the text)
todo = [k for k in texts if not os.path.exists(cache(k)) or sent.get(k, raw[k]) != texts[k]]
for k in todo:
    if os.path.exists(cache(k)):
        os.remove(cache(k))
first = {}                                               # course order (corpus order), so whole lessons finish together
for i, (lid, keys) in enumerate(lessons.items()):
    for k in keys:
        first.setdefault(k, i)
todo.sort(key=lambda k: first.get(k, 1 << 30))
log = open(os.path.join(BASE, f'edge_{LANG}.log'), 'a', encoding='utf-8')
def say_log(m):
    line = time.strftime('%H:%M:%S ') + m
    print(line, flush=True); log.write(line + '\n'); log.flush()


def publish(n):
    for g, repo in REPOS.items():
        ld = os.path.join(repo, LANG); os.makedirs(ld, exist_ok=True)
        mine = {lid: sorted(k for k in keys if os.path.exists(cache(k))) for lid, keys in lessons.items() if group(lid) == g}
        need = {k for ks in mine.values() for k in ks}
        for f in os.listdir(ld):                         # files no longer needed in this repo (wrong group, Serena has it)
            if f.endswith('.mp3') and f[:-4] not in need:
                os.remove(os.path.join(ld, f))
        for k in need:
            dst = os.path.join(ld, k + '.mp3')
            if os.path.exists(dst) and os.path.getsize(dst) != os.path.getsize(cache(k)):
                os.remove(dst)                           # re-recorded since
            if not os.path.exists(dst):
                os.link(cache(k), dst)
        for sub in os.listdir(repo):                     # manifests of lessons of other groups (old layout)
            sd = os.path.join(repo, sub)
            if os.path.isdir(sd) and sub not in (LANG, '.git'):
                for topic in os.listdir(sd):
                    lid = sub + '/' + topic
                    if lid not in mine or not mine[lid]:
                        shutil.rmtree(os.path.join(sd, topic), ignore_errors=True)
        for lid, have in mine.items():
            if not have:
                continue
            d = os.path.join(repo, lid); os.makedirs(d, exist_ok=True)
            js = 'LabAudioManifest(' + json.dumps({'lesson': 'edge:' + lid, 'voice': 'edge ' + VOICE, LANG: ' '.join(have)}) + ');\n'
            with open(os.path.join(d, 'manifest.js'), 'w', encoding='utf-8') as f:
                f.write('/* stand-in recordings (Microsoft Edge voice); Serena recordings play first */\n' + js)
        gi = ['git', '-C', repo]
        subprocess.run(gi + ['add', '-A'], check=True)
        if subprocess.run(gi + ['diff', '--cached', '--quiet']).returncode:
            subprocess.run(gi + ['commit', '-q', '-m', f'{len(need)} {LANG} stand-in clips ({VOICE})'], check=True)
            r = subprocess.run(['git', '-C', repo, '-c', 'credential.helper=', '-c', 'credential.helper=!gh auth git-credential', 'push', '-q', 'origin', 'main'],
                               env=dict(os.environ, GIT_TERMINAL_PROMPT='0'), capture_output=True, text=True)
            say_log(f'pushed {os.path.basename(repo)} ({len(need)} clips)' if r.returncode == 0 else f'PUSH FAILED {os.path.basename(repo)} ' + r.stderr[-200:])


async def main():
    say_log(f'{LANG}: {len(texts)} clips, {len(todo)} to record, voice {VOICE}, repos {", ".join(os.path.basename(r) for r in REPOS.values())}')
    publish(0)                                           # move what is already recorded into the right repos at once
    sem = asyncio.Semaphore(3); done = 0; errors = 0; pause = 0
    async def one(k):
        nonlocal done, errors, pause
        async with sem:
            for a in range(6):
                if pause > time.time():
                    await asyncio.sleep(pause - time.time())
                try:
                    tmp = cache(k) + '.part'
                    await edge_tts.Communicate(texts[k], VOICE).save(tmp)
                    if os.path.getsize(tmp) < 800:
                        raise RuntimeError('empty audio')
                    os.replace(tmp, cache(k)); done += 1; errors = 0; sent[k] = texts[k]
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
