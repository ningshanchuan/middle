# Chinese spoken script ("layer 1" of the read-aloud plan agreed with the TTS PC): turns the display text of a clip
# (`send`) into what the voice should say, deterministically. Order:
#   1. our rules first, for what the library gets wrong or reorders:
#      - a number with a unit "a/b" keeps its order: 20公里/小时 -> 20公里每小时, 3 m/s -> 3米每秒, 9.8 m/s² -> 9.8米每二次方秒
#      - Latin units after a number -> Chinese unit names (km, kg, g/cm³, kWh, ℃ ...)
#      - powers written with superscripts: 10⁶ -> 10的6次方; ions Na⁺ -> Na离子 (charge read as 正/负 only when alone)
#      - ∠B -> 角B, ∽ -> 相似于, |a| -> a的绝对值, ½ -> 二分之一, number ranges 1856–1863 -> 1856到1863
#      - chemical formulas, gene / base letters, pinyin and English words are protected (left as written)
#   2. WeTextProcessing (wetext, zh TN) for numbers, dates, times, percentages and ratios, on the unprotected parts
#   3. tidy: no spaces between Chinese characters, single spaces elsewhere
# speech_len(text): the length for pace checks = the spoken script without spaces and silent symbols; Chinese
# punctuation still counts 1 (as in the pace limits the user calibrated by listening), each Latin letter 0.4.
import re
from functools import lru_cache

UNIT = {  # Latin / symbol units after a number -> spoken Chinese
    'km': '千米', 'm': '米', 'cm': '厘米', 'mm': '毫米', 'nm': '纳米', 'μm': '微米', 'um': '微米',
    'kg': '千克', 'g': '克', 'mg': '毫克', 't': '吨',
    's': '秒', 'min': '分钟', 'h': '小时', 'ms': '毫秒',
    'L': '升', 'mL': '毫升', 'ml': '毫升',
    'N': '牛', 'J': '焦', 'kJ': '千焦', 'W': '瓦', 'kW': '千瓦', 'kWh': '千瓦时', 'kW·h': '千瓦时',
    'Pa': '帕', 'kPa': '千帕', 'MPa': '兆帕', 'V': '伏', 'A': '安', 'mA': '毫安', 'Ω': '欧', 'Hz': '赫兹', 'kHz': '千赫',
    'MHz': '兆赫', 'GHz': '吉赫', 'K': '开', '℃': '摄氏度', '°C': '摄氏度', '°F': '华氏度', '°': '度',
    'cal': '卡', 'kcal': '千卡', 'dB': '分贝', 'mol': '摩尔',
    'm²': '平方米', 'cm²': '平方厘米', 'km²': '平方千米', 'mm²': '平方毫米',
    'm³': '立方米', 'cm³': '立方厘米', 'dm³': '立方分米', 'mm³': '立方毫米',
    's²': '二次方秒',
    'B': '字节', 'KB': '千字节', 'MB': '兆字节', 'GB': '吉字节', 'TB': '太字节',
}
CN_UNIT = r'(?:千米|公里|米|厘米|毫米|千克|公斤|克|毫克|吨|秒|分钟|分|小时|时|天|年|升|毫升|立方米|立方厘米|平方米|焦|千焦|瓦|千瓦|千瓦时|牛|帕|伏|安|欧|度|人|元|个|次)'
LAT_UNIT = '|'.join(sorted((re.escape(u) for u in UNIT), key=len, reverse=True))
NUM = r'\d+(?:[.,]\d+)*'
SUP = str.maketrans('⁰¹²³⁴⁵⁶⁷⁸⁹⁻', '0123456789-')
FRAC = {'½': '二分之一', '⅓': '三分之一', '⅔': '三分之二', '¼': '四分之一', '¾': '四分之三', '⅕': '五分之一', '⅛': '八分之一'}


def _unit(u):
    u = u.strip()
    return UNIT.get(u, u)


def rules(s):
    s = s.replace(' ', ' ')
    s = re.sub(r'(?<=\d),(?=\d{3}(?!\d))', '', s)                 # thousands separators: 85,000 -> 85000
    # superscript powers on a number or a unit-less base: 10⁶ -> 10的6次方, 10⁻³ -> 10的负3次方
    s = re.sub(r'(\d)([⁻]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+)(?![A-Za-z])',
               lambda m: m.group(1) + '的' + m.group(2).translate(SUP).replace('-', '负') + '次方', s)
    # compound units after a number: 20公里/小时, 3 m/s, 9.8 m/s², 1.0 g/cm³, 2.5 kW·h
    s = re.sub(rf'({NUM})\s*({LAT_UNIT}|{CN_UNIT})\s*/\s*({LAT_UNIT}|{CN_UNIT})(?![A-Za-z])',
               lambda m: f'{m.group(1)}{_unit(m.group(2))}每{_unit(m.group(3))}', s)
    # a unit "a/b" without a number in front: 单位 kg/m³, km/h
    s = re.sub(rf'(?<![A-Za-z])({LAT_UNIT})\s*/\s*({LAT_UNIT})(?![A-Za-z0-9])',
               lambda m: f'{_unit(m.group(1))}每{_unit(m.group(2))}' if m.group(1) in UNIT and m.group(2) in UNIT else m.group(0), s)
    # a simple Latin unit after a number: 270 km, 25 ℃, 3.6 J
    s = re.sub(rf'({NUM})\s*({LAT_UNIT})(?![A-Za-z0-9²³])', lambda m: m.group(1) + _unit(m.group(2)), s)
    s = re.sub(rf'({NUM})\s*({LAT_UNIT})(?=[²³])', lambda m: m.group(0), s)
    # fractions written as one glyph; mixed numbers 4½ -> 4又二分之一
    s = re.sub(r'(\d)([½⅓⅔¼¾⅕⅛])', lambda m: m.group(1) + '又' + FRAC[m.group(2)], s)
    for k, v in FRAC.items():
        s = s.replace(k, v)
    # geometry and math symbols
    s = re.sub(r'∠\s*', '角', s)
    s = s.replace('∽', '相似于').replace('≈', '约等于').replace('≠', '不等于').replace('≤', '小于等于').replace('≥', '大于等于')
    s = re.sub(r'\|([A-Za-z0-9]{1,3})\|', r'\1的绝对值', s)
    s = re.sub(r'Δ\s*', 'delta ', s)
    # number ranges with a dash: 1856–1863 年 -> 1856到1863年, 3–5 天
    s = re.sub(rf'({NUM})\s*[–—~～]\s*({NUM})', r'\1到\2', s)
    return s


# tokens the number normalizer must not touch: chemical formulas (H2O, CO₂, Na⁺, Fe2O3), letter-digit names (COVID-19 stays
# as is), Latin words (incl. pinyin with tone marks), A–T base pairs
PROTECT = re.compile(r"[A-Za-zÀ-ɏ][A-Za-zÀ-ɏ0-9₀-₉⁺⁻'′·\-]*")


@lru_cache(maxsize=1)
def _tn():
    from wetext import Normalizer
    return Normalizer(lang='zh', operator='tn')


def _tidy(s):
    s = re.sub(r'(?<=[一-鿿，。、；：？！“”（）])\s+(?=[一-鿿，。、；：？！“”（）])', '', s)
    s = re.sub(r'(?<=[一-鿿])\s+(?=[一-鿿])', '', s)
    return re.sub(r'[ \t]{2,}', ' ', s).strip()


def spoken(send):
    """display text of a zh clip -> spoken script"""
    s = rules(send)
    parts, pos, out = [], 0, []
    for m in PROTECT.finditer(s):
        parts.append((False, s[pos:m.start()])); parts.append((True, m.group(0))); pos = m.end()
    parts.append((False, s[pos:]))
    tn = _tn()
    for prot, p in parts:
        if prot or not re.search(r'\d|%', p):
            out.append(p)
        else:
            lead = len(p) - len(p.lstrip()); trail = len(p) - len(p.rstrip())
            core = tn.normalize(p.strip()) if p.strip() else ''
            out.append(p[:lead] + core + (p[len(p) - trail:] if trail else ''))
    return _tidy(''.join(out))


SILENT = re.compile(r"[\s·•/|()\[\]{}<>_*#~—–\-…‘’'\"]")


def speech_len(text, spoken_already=False):
    """length for the pace checks: spoken script, no spaces / silent symbols; Latin letters 0.4 each"""
    s = text if spoken_already else spoken(text)
    s = SILENT.sub('', s)
    letters = sum(1 for ch in s if ch.isascii() and ch.isalpha())
    return len(s) - 0.6 * letters


if __name__ == '__main__':
    import sys
    for t in sys.argv[1:] or ['汽车以20公里/小时的速度行驶。', '加速度 9.8 m/s²，密度单位 kg/m³。', '约 1.5 乘 10⁸ 千米',
                              '孟德尔在 1856–1863 年的豌豆实验中发现', 'H2O 和 CO2，Na⁺ 和 Cl⁻', '放大 85,000 倍', '∠B 与 ∠C 相等，|a| 是绝对值']:
        print(t, '=>', spoken(t), f'(len {speech_len(t):.1f})')
