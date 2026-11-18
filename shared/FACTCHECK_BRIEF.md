# Fact-check brief

The site (F:\Shanchuan\Biology_study\science-lab, static bilingual HTML lessons for a 12-year-old in the US) was built quickly, and many dates, statistics, records and textbook wordings were **written from memory**. Your job: find the factual claims a student would learn, verify them against reliable sources, and fix what's wrong — in both English and Chinese text.

## What to check (priority order)
1. **Dates and years** of events, missions, dynasties, treaties, inventions, constructions.
2. **Statistics & records**: lengths, heights, areas, populations, counts, speeds, masses, distances, temperatures.
3. **Names**: people, places, spacecraft, terms (spelling, pinyin, Chinese characters).
4. **Textbook definitions / standard wordings** (China & civics: 统编版/人教版 wording; e.g. 宪法是国家的根本法…).
5. **Captions** of photos/videos that state facts.
Also the "Meanwhile in the US/world" lines and US comparisons (state sizes, distances).

## What NOT to change
- Values explicitly labelled as game settings, simplified models, illustrations or "approximate" — unless they are badly wrong (off by >20%, or a wrong order of magnitude).
- Teaching structure, design, wording style. Make minimal, surgical edits.
- Anything in `shared/` (report shared issues instead). Don't git commit.

## Sources (use web search / fetch)
Prefer primary or authoritative sources: NASA (science.nasa.gov, NASA fact sheets, JPL), ESA, IAU, USGS, NOAA, Britannica, official agency/museum/government sites (e.g. CNSA, CMSE, 国家文物局, 故宫博物院, gov.cn, stats.gov.cn), UNESCO, peer-reviewed or encyclopedic references. For the China/civics curriculum, the 统编版 textbook wording as quoted by official education sites (e.g. 国家中小学智慧教育平台 basic.smartedu.cn, 人民教育出版社 pep.com.cn) or reliable mirrors. Where sources disagree, use the textbook/official value and add "约 / about" or note the alternative in the teacher notes.

## How to work
- Read each assigned page; list the checkable claims (skim the text strings, data arrays, card/timeline data). Check the important ones — aim for broad coverage, prioritising what students are tested on and what's most likely wrong.
- Fix errors in place (both languages, keep full-width Chinese punctuation （，。：；？！）). If a figure is uncertain, round it and add 约/about rather than inventing precision.
- After editing a page, verify it still loads: `powershell -ExecutionPolicy Bypass -File "C:\Users\SHANCH~1\AppData\Local\Temp\claude\6f5e0ec2c29fb31e\245e6224-c9a5-4bfd-9f83-bbf90434c222\scratchpad\shot.ps1" -Url "file:///F:/Shanchuan/Biology_study/science-lab/<subject>/<id>.html?lang=zh" -Out "F:\Shanchuan\Biology_study\.labtmp\fc_<id>.png" -Wait 8 -Port <yours>` → must print `ERRORS: []` (one shot at a time, 180 s timeout, retry on "chrome devtools did not start"; delete screenshots after).

## Final report
Per page: what you checked (roughly how many claims), every correction (old → new, with the source), anything you couldn't verify, and issues needing the coordinator (shared files, contested facts where you chose a version).
