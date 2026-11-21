# Build readaloud/say/zh.json (spoken scripts for Chinese clips) from the checked LLM batches.
#   python say_build.py <done dir> <zh_corpus.json>
# A batch counts only when its checked output passes validate.py for that line (no digits / symbols left, Han
# coverage >= 0.93). Output: {"updated": ..., "count": n, "lessons": {lesson: {sha1(send)[:12]: say}}}
import datetime, difflib, glob, hashlib, json, os, re, sys

done, corpus = sys.argv[1], sys.argv[2]
LANG = sys.argv[3] if len(sys.argv) > 3 else 'zh'          # zh or en
HAN = re.compile(r'[一-鿿]')
LEFT = re.compile(r'[0-9/+=×÷%°℃²³⁰¹⁴⁵⁶⁷⁸⁹⁺⁻½¼¾⅓|∠_<>≈≤≥]')


def cover(a, b):
    a = ''.join(HAN.findall(a)); b = ''.join(HAN.findall(b))
    m = difflib.SequenceMatcher(None, a, b, autojunk=False)
    return sum(x.size for x in m.get_matching_blocks()) / max(len(a), 1)


WORD = re.compile(r"[A-Za-z]+")


def cover_en(a, b):
    a = [w.lower() for w in WORD.findall(a)]; b = [w.lower() for w in WORD.findall(b)]
    m = difflib.SequenceMatcher(None, a, b, autojunk=False)
    return sum(x.size for x in m.get_matching_blocks()) / max(len(a), 1)


def all_han(a, b):
    """every Han char of a is in b (order may change, e.g. 17 人每平方千米 -> 每平方千米十七人)"""
    from collections import Counter
    need, have = Counter(HAN.findall(a)), Counter(HAN.findall(b))
    return sum(max(0, n - have[ch]) for ch, n in need.items()) <= 2   # e.g. 来源 dropped from a photo credit, a doubled 乘 fixed


say, bad = {}, []
for chk in sorted(glob.glob(os.path.join(done, '[bce]*.chk.jsonl'))):
    src = {json.loads(l)['key']: json.loads(l) for l in open(chk.replace('.chk.jsonl', '.jsonl'), encoding='utf-8') if l.strip()}
    for l in open(chk, encoding='utf-8'):
        if not l.strip():
            continue
        o = json.loads(l); s = src.get(o['key'])
        if not s:
            continue
        txt = re.sub(r'\s+', ' ', o['say']).strip()
        if LANG == 'en':
            ok = txt and not LEFT.search(txt) and cover_en(s['send'], txt) >= 0.8 and all_han(s['send'], txt)
        else:
            ok = txt and not LEFT.search(txt) and (cover(s['send'], txt) >= 0.93 or all_han(s['send'], txt))
        if not ok:
            bad.append((o['key'], s['send'][:60], txt[:60])); continue
        say[o['key']] = txt
lessons = {}
for c in json.load(open(corpus, encoding='utf-8')):
    h = hashlib.sha1(c['send'].encode('utf-8')).hexdigest()[:12]
    if h in say and c.get('lang', LANG) == LANG:
        lessons.setdefault(c['lesson'], {})[h] = say[h]
out = os.path.join(os.path.dirname(__file__), '..', '..', 'readaloud', 'say', LANG + '.json')
os.makedirs(os.path.dirname(out), exist_ok=True)
json.dump(dict(updated=datetime.datetime.now().strftime('%Y-%m-%d %H:%M'), count=len(say), lessons=lessons),
          open(out, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(f'{len(say)} scripts in {len(lessons)} lessons -> {os.path.normpath(out)}; held back (failed checks): {len(bad)}')
for b in bad[:20]:
    print('  HELD', *b, sep=' | ')
