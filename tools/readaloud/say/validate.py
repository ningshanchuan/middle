# Deterministic checks of LLM spoken scripts: python validate.py <out.jsonl> [in.jsonl]
#  - every input key present once; no Arabic digits / reading symbols left in `say`
#  - the Han characters of `send` appear in `say` in order (pinyin and licence codes may go): coverage >= 0.97
#  - length sanity: say not shorter than 0.8x the Han count of send
import json, re, sys
out_p = sys.argv[1]; in_p = sys.argv[2] if len(sys.argv) > 2 else 'test_in.jsonl'
inp = [json.loads(l) for l in open(in_p, encoding='utf-8') if l.strip()]
out = {}
for l in open(out_p, encoding='utf-8'):
    if l.strip():
        o = json.loads(l); out[o['key']] = o
HAN = re.compile(r'[一-鿿]')
LEFT = re.compile(r'[0-9/+=×÷%°℃²³⁰¹⁴⁵⁶⁷⁸⁹⁺⁻½¼¾⅓|∠_<>≈≤≥]')
def coverage(a, b):
    """share of the Han chars of a that line up with b (difflib matching blocks, order kept)"""
    import difflib
    a = ''.join(HAN.findall(a)); b = ''.join(HAN.findall(b))
    m = difflib.SequenceMatcher(None, a, b, autojunk=False)
    return sum(x.size for x in m.get_matching_blocks()) / max(len(a), 1)
probs = []
for c in inp:
    o = out.get(c['key'])
    if not o:
        probs.append((c['key'], 'MISSING', c['send'][:60])); continue
    s = o['say']
    left = sorted(set(LEFT.findall(s)))
    if left:
        probs.append((c['key'], 'LEFT ' + ''.join(left), s[:80]))
    cov = coverage(c['send'], s)
    if cov < 0.97:
        probs.append((c['key'], f'COVERAGE {cov:.2f}', c['send'][:50] + ' || ' + s[:50]))
    if len(HAN.findall(s)) < 0.8 * len(HAN.findall(c['send'])):
        probs.append((c['key'], 'SHORT', s[:60]))
print(f'{len(inp)} inputs, {len(out)} outputs, {len(probs)} problems')
for p in probs:
    print(' | '.join(p))
