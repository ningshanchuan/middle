# Build readaloud/say/zh.json (spoken scripts for Chinese clips) from the checked LLM batches.
#   python say_build.py <done dir> <zh_corpus.json>
# A batch counts only when its checked output passes validate.py for that line (no digits / symbols left, Han
# coverage >= 0.93). Output: {"updated": ..., "count": n, "lessons": {lesson: {sha1(send)[:12]: say}}}
import datetime, difflib, glob, hashlib, json, os, re, sys

done, corpus = sys.argv[1], sys.argv[2]
LANG = sys.argv[3] if len(sys.argv) > 3 else 'zh'          # zh or en
HAN = re.compile(r'[一-鿿]')
LEFT = re.compile(r'[0-9/+=×÷%°℃²³⁰¹⁴⁵⁶⁷⁸⁹⁺⁻½¼¾⅓|∠_<>≈≤≥₀-₉√±∞→⇌△‰$€£¥\[\]【】]')


def cover(a, b):
    a = ''.join(HAN.findall(a)); b = ''.join(HAN.findall(b))
    m = difflib.SequenceMatcher(None, a, b, autojunk=False)
    return sum(x.size for x in m.get_matching_blocks()) / max(len(a), 1)


WORD = re.compile(r"[A-Za-z]+")


UNITS = {'km', 'cm', 'mm', 'kg', 'mg', 'ml', 'kwh', 'kw', 'kj', 'hz', 'khz', 'mhz', 'ghz', 'pa', 'kpa', 'mph', 'ft', 'lb', 'lbs', 'oz',
         'mi', 'yd', 'au', 'mbit', 'kbit', 'gbit', 'kb', 'mb', 'gb', 'tb', 'utc', 'bce', 'ce', 'bc', 'ad', 'mins', 'min', 'hr', 'hrs', 'sec'}


def _words(t):
    t = t.replace("'", '').replace('’', '')        # Dont / Don't / Don’t compare equal
    t = re.sub(r'\S*[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]\S*', ' ', t)   # tone-marked pinyin (dropped by the rules)
    return [w.lower() for w in WORD.findall(t) if len(w) > 1 and w.lower() not in UNITS]


def cover_en(a, b):
    a = _words(a); b = _words(b)
    m = difflib.SequenceMatcher(None, a, b, autojunk=False)
    return sum(x.size for x in m.get_matching_blocks()) / max(len(a), 1)


def cover_letters(a, b):
    """letters of a (no spaces, digits, pinyin) found in order in b: CO2 + H2O -> C O two plus H two O"""
    a = ''.join(_words(a)) if False else re.sub('[^a-z]', '', re.sub(r'\S*[ā-ǜà-ü]\S*', ' ', a.lower()))
    b = re.sub('[^a-z]', '', b.lower())
    m = difflib.SequenceMatcher(None, a, b, autojunk=False)
    return sum(x.size for x in m.get_matching_blocks()) / max(len(a), 1)


def all_han(a, b):
    """every Han char of a is in b (order may change, e.g. 17 人每平方千米 -> 每平方千米十七人)"""
    from collections import Counter
    need, have = Counter(HAN.findall(a)), Counter(HAN.findall(b))
    return sum(max(0, n - have[ch]) for ch, n in need.items()) <= 2   # e.g. 来源 dropped from a photo credit, a doubled 乘 fixed


# photo credits: in the page text "图片：<author> · CC BY-SA 4.0 · 来源" / "Photo: <author> · CC BY 2.0 · Source"; in older
# scripts "图片作者 <author>，知识共享许可。" / "Photo by <author>, Creative Commons license."
CREDIT_SEND = re.compile(r'(图片|照片|Photo|Image)\s*[：:][^。！？\n]*?(来源|Source|公有领域|Public domain|CC[ -]?BY[^。\n]*|CC0)[^。！？\n]*', re.I)
CREDIT_SAY = re.compile(r'(图片作者|照片作者|图片来源|图片：)[^。！？]*(。|$)|(Photo|Image) (by|credit)[^.!?]*(\.|$)|Photo: [^.!?]*(\.|$)', re.I)

say, bad = {}, []
for chk in sorted(glob.glob(os.path.join(done, '*.chk.jsonl')), key=os.path.getmtime):   # newest last: a re-written script wins
    src = {json.loads(l)['key']: json.loads(l) for l in open(chk.replace('.chk.jsonl', '.jsonl'), encoding='utf-8') if l.strip()}
    for l in open(chk, encoding='utf-8'):
        if not l.strip():
            continue
        o = json.loads(l); s = src.get(o['key'])
        if not s:
            continue
        txt = re.sub(r'\s+', ' ', o['say']).strip()
        send = CREDIT_SEND.sub('', s['send'])            # photo credits are not read at all (the user, 2026-11-21)
        txt = CREDIT_SAY.sub('', txt).strip()
        if LANG == 'zh':
            txt = txt.replace('〇', '零')               # years: 零 not 〇 (the voice may not read 〇; TTS PC, #12)
            # the 8B read 记忆小窍门 as 进一小窍门 in about 1 of 6 clips; 记忆的小窍门 fixed 21 of 24 flagged ones (TTS PC test,
            # 2026-11-22). Script only - the page keeps 记忆小窍门.
            txt = txt.replace('记忆小窍门', '记忆的小窍门')
        if not txt:
            continue                                     # the clip is only a credit: nothing to record
        reviewed = os.path.basename(chk).startswith(('zrev', 'zcredit'))   # case-by-case review + independent check +
        if reviewed:                                     # a nothing-lost check: same-sound characters and moved brackets
            ok = not LEFT.search(txt)                    # lower the coverage on purpose, so only the leftover check here
        elif LANG == 'en':
            ok = not LEFT.search(txt) and (cover_en(send, txt) >= 0.8 or cover_letters(send, txt) >= 0.9) and all_han(send, txt)
        else:
            ok = not LEFT.search(txt) and (cover(send, txt) >= 0.93 or all_han(send, txt))
        if not ok:
            bad.append((o['key'], s['send'][:60], txt[:60])); continue
        say[o['key']] = txt
# memory-tip boxes in plain Chinese have no script (nothing to write out), so the voice read the page text: give them a
# script that differs only in 记忆的小窍门 (see above; TTS PC test 2026-11-22)
if LANG == 'zh':
    for c in json.load(open(corpus, encoding='utf-8')):
        h = hashlib.sha1(c['send'].encode('utf-8')).hexdigest()[:12]
        if '记忆小窍门' in c['send'] and h not in say and not re.search(r'[0-9A-Za-z]', c['send']) and not LEFT.search(c['send']):
            say[h] = re.sub(r'\s+', ' ', c['send']).strip().replace('记忆小窍门', '记忆的小窍门')
# hand-written scripts (tools/readaloud/say/manual_<lang>.jsonl) win; "" = never read (photo credits, licences)
skip = set()
mp = os.path.join(os.path.dirname(__file__), 'say', f'manual_{LANG}.jsonl')
if os.path.exists(mp):
    for l in open(mp, encoding='utf-8'):
        if l.strip():
            r = json.loads(l)
            if r['say']:
                say[r['key']] = r['say']
            else:
                say.pop(r['key'], None); skip.add(r['key'])
lessons = {}
for c in json.load(open(corpus, encoding='utf-8')):
    h = hashlib.sha1(c['send'].encode('utf-8')).hexdigest()[:12]
    if h in say and c.get('lang', LANG) == LANG:
        lessons.setdefault(c['lesson'], {})[h] = say[h]
out = os.path.join(os.path.dirname(__file__), '..', '..', 'readaloud', 'say', LANG + '.json')
os.makedirs(os.path.dirname(out), exist_ok=True)
json.dump(dict(updated=datetime.datetime.now().strftime('%Y-%m-%d %H:%M'), count=len(say), lessons=lessons, skip=sorted(skip)),
          open(out, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(f'{len(say)} scripts in {len(lessons)} lessons -> {os.path.normpath(out)}; held back (failed checks): {len(bad)}')
for b in bad[:20]:
    print('  HELD', *b, sep=' | ')
# every held script, for review (only the first 20 are printed above)
with open(os.path.join(done, '..', f'held_{LANG}.tsv'), 'w', encoding='utf-8') as f:
    for b in bad:
        f.write('\t'.join(str(x) for x in b) + '\n')
