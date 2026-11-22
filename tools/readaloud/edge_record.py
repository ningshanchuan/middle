# Stand-in recordings with a Microsoft Edge voice (edge-tts) of every clip that has no Serena recording yet (originals
# included: 先有，再全，最后好), from the spoken scripts (readaloud/say/<lang>.json, else the page text).
# One repo per language and subject group (shared/audio-sources.js "edge"), GitHub Pages:
#   <lang>/<key>.mp3                    one file per clip key (keys repeat across lessons; a key used in two groups is in both)
#   <subject>/<topic>/manifest.js       LabAudioManifest({lesson: 'edge:<id>', voice, <lang>: '<key> ...'})
# Recordings live in a local cache (<base>/edge_cache/<lang>); the repos get hard links. Each push reconciles every repo
# (missing files linked, files no longer needed removed, manifests rewritten).
# The site plays a Serena recording first, then this, then the browser voice (shared/lab.js).
# Slow on purpose (3 requests at a time, back-off on errors): edge-tts is an unofficial use of Microsoft's service.
#   python edge_record.py <lang> <corpus.json> <base dir, e.g. F:\labtmp_edge> [lesson,lesson,...]
#   (resumable; pushes every 300 new clips). With lessons: records only those lessons (one lesson at a time, the user
#   2026-11-21: easier to check and change); the push still keeps every other lesson's clips and manifests as they are.
import asyncio, hashlib, json, os, re, shutil, subprocess, sys, time, urllib.request
import edge_tts

LANG, CORPUS, BASE = sys.argv[1], sys.argv[2], sys.argv[3]
ONLY = set(filter(None, sys.argv[4].split(','))) if len(sys.argv) > 4 else None
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
# A page plays Serena only from ITS lesson's manifest (and _shared): so "Serena has it" is decided per lesson, from the
# lesson manifests (a clip Serena recorded for another lesson still needs a stand-in here - found on astronomy/seasons)
from concurrent.futures import ThreadPoolExecutor
_corpus = json.load(open(CORPUS, encoding='utf-8'))
def _serena(lid):
    repo = SRC['shared'] if lid == '_shared' else group(lid)
    for _ in range(3):
        try:
            js = urllib.request.urlopen(f'https://raw.githubusercontent.com/gladcolor/{repo}/main/{lid}/manifest.js?v={time.time()}', timeout=60).read().decode('utf-8')
            m = json.loads(js[js.index('{'):js.rindex('}') + 1])
            return lid, (set(str(m.get(LANG) or '').split()) if 'serena' in str(m.get('voice', '')) else set())
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return lid, set()                        # nothing recorded for this lesson yet
        except Exception:                                # noqa: BLE001
            time.sleep(2)
    raise SystemExit(f'cannot read the Serena manifest of {lid}: stopping rather than guessing')
with ThreadPoolExecutor(16) as ex:
    SERENA_BY = dict(ex.map(_serena, sorted({c['lesson'] for c in _corpus} | {'_shared'})))
SERENA_SHARED = SERENA_BY.get('_shared', set())
# sends that need a spoken script (digits, symbols, Latin letters in Chinese, Han in English: same rule as the script
# queue, .labtmp/tn/queue_new.py); such a clip is NOT recorded until its checked script is published (QC plan, sect. 10)
NEED = {'zh': re.compile('[0-9A-Za-z\u00c0-\u024f\uff3f]|[^\u4e00-\u9fff\u3000-\u303f\uff00-\uffef\u201c\u201d\u2018\u2019\u2014\u2026\u00b7\\s]'),
        'en': re.compile('\\d|[/+=\u00d7\u00f7%\u00b0\u2103\u00b2\u00b3\u2070-\u2079\u207a\u207b\u00bd\u00bc\u00be\u2153|\u2220_<>\u2248\u2264\u2265~^*#@&$\u20ac\u00a3\u00a5\u2192\u2190\u2194\u2206\u0394\u03b1\u03b2\u03b3\u03b8\u03bc\u03c0\u00b7\u2022]|[\u4e00-\u9fff]')}
waiting = 0
texts, raw, lessons = {}, {}, {}
for c in _corpus:
    if c['key'] in SERENA_BY.get(c['lesson'], ()) or c['key'] in SERENA_SHARED:   # this page plays Serena for it
        continue
    h = hashlib.sha1(c['send'].encode('utf-8')).hexdigest()[:12]
    if h in SKIP:
        continue                                         # never read (photo credits, licences)
    if h not in flat and NEED[LANG].search(c['send']):
        waiting += 1
        continue                                         # needs a script, none published yet: wait for it
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
if ONLY is not None:
    want = {k for lid in ONLY for k in lessons.get(lid, ())}
    todo = [k for k in todo if k in want]
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
            # keep the history small (the user, 2026-11-21: old versions are not needed): past 30 commits, the current
            # files become a single commit (same tree, so the live site does not change) and replace the history
            n = int(subprocess.run(gi + ['rev-list', '--count', 'HEAD'], capture_output=True, text=True).stdout.strip() or 0)
            if r.returncode == 0 and n > 30:
                tree = subprocess.run(gi + ['rev-parse', 'HEAD^{tree}'], capture_output=True, text=True).stdout.strip()
                subprocess.run(gi + ['checkout', '-q', '--orphan', 'squash'], check=True)
                subprocess.run(gi + ['commit', '-q', '-m', f'Edge stand-in recordings (history squashed {time.strftime("%Y-%m-%d")})'], check=True)
                same = subprocess.run(gi + ['rev-parse', 'HEAD^{tree}'], capture_output=True, text=True).stdout.strip() == tree
                if same:
                    subprocess.run(gi + ['branch', '-D', '-q', 'main'], check=True); subprocess.run(gi + ['branch', '-m', 'main'], check=True)
                    r2 = subprocess.run(['git', '-C', repo, '-c', 'credential.helper=', '-c', 'credential.helper=!gh auth git-credential', 'push', '-q', '-f', 'origin', 'main'],
                                        env=dict(os.environ, GIT_TERMINAL_PROMPT='0'), capture_output=True, text=True)
                    subprocess.run(gi + ['reflog', 'expire', '--expire=now', '--all']); subprocess.run(gi + ['gc', '-q', '--prune=now'])
                    say_log(f'squashed {os.path.basename(repo)} history ({n} commits -> 1)' if r2.returncode == 0 else f'SQUASH PUSH FAILED {os.path.basename(repo)} ' + r2.stderr[-200:])
                else:                                    # should never happen: go back to main untouched
                    subprocess.run(gi + ['checkout', '-q', '-f', 'main']); subprocess.run(gi + ['branch', '-D', '-q', 'squash'])
                    say_log(f'SQUASH SKIPPED {os.path.basename(repo)}: tree changed')


async def main():
    say_log(f'{LANG}: {len(texts)} clips, {waiting} waiting for a spoken script, {len(todo)} to record, voice {VOICE}, repos {", ".join(os.path.basename(r) for r in REPOS.values())}')
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
