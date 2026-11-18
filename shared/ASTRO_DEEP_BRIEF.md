# Astronomy deep dives — shared brief for builders

**Who it's for:** the owner's son (middle school, in the US) *loves* astronomy and wants more depth, more figures, more links, more simulations and more interaction. Write for a curious, capable 12–14-year-old: never dumbed-down, never jargon without explanation. Real numbers, real data, real images. English is the primary text; Chinese (`?lang=zh`) must be complete (full-width punctuation; pinyin is added automatically by `shared/pinyin.js` — add hard astronomy words to its DICT only if you are asked to edit shared/, otherwise list them in your report).

## Read first
- `shared/README.md` (framework; especially "Audience & engagement standard", LabPhotos, pinyin)
- `shared/photos.js` header (gallery items incl. `type:'video'|'audio'`)
- A finished astronomy lesson, e.g. `astronomy/solar-system.html` and `astronomy/gravity-orbits.html` (page structure, Lab3D usage, gallery wiring)
- Your topics are already in `shared/catalog.js` (subject `astronomy`, entries with `deep:true`). File name = `astronomy/<id>.html`, `<body data-subject="astronomy" data-topic="<id>">`.

## Every deep-dive lesson has
1. **Hero** with a hook question and a one-line "what you'll be able to do".
2. **Two or more real simulations** the student drives (sliders, drag, click, play/pause, time scrubber with the shared `.timebar`), with live numbers/readouts. Physics must be real where feasible (e.g. Newtonian gravity integration, Kepler's 3rd law, inverse-square brightness, Doppler shift, Hubble's law, blackbody colour vs temperature). Use three.js via Lab3D for 3D, canvas 2D for charts/sims.
3. **At least two data figures** made from real values (charts/tables built in canvas/SVG: e.g. planet sizes to scale, an H-R diagram with real stars, a light curve, a distance ladder). Cite the data source in a small caption (e.g. "Data: NASA Planetary Fact Sheet") and label anything approximate.
4. **A challenge or game** with score/progress (e.g. "get the probe to Mars", "classify these stars", "find the planet in the light curve").
5. **"See the real thing" gallery** via LabPhotos: 6–10 real images (NASA/ESA/Hubble/JWST/ESO are usually public domain or CC BY on Wikimedia Commons) + 1–2 clips (video/audio). Badges (telescope photo / spacecraft photo / illustration — say so when it's an artist's impression) and real scale/distance.
6. **"Go further" links** section (`data-nav`): 5–8 cards using the shared `.linkgrid` / `a.linkcard` classes (see lab.css), each saying what the student can DO there. Prefer NASA (science.nasa.gov, eyes.nasa.gov, solarsystem.nasa.gov, exoplanets.nasa.gov, apod.nasa.gov, spaceplace.nasa.gov), ESA, JPL, webbtelescope.org, hubblesite.org, stellarium-web.org, heavens-above.com, timeanddate.com, Zooniverse projects. Every link must open: check them all with
   `powershell -ExecutionPolicy Bypass -File "C:\Users\SHANCH~1\AppData\Local\Temp\claude\6f5e0ec2c29fb31e\245e6224-c9a5-4bfd-9f83-bbf90434c222\scratchpad\linkcheck.ps1" -Urls "https://…","https://…"`
   and use only links that return 200 (prefer stable top-level/section pages over deep article URLs). `target="_blank" rel="noopener"`.
7. Info panel with key facts, a memory hint, a common mix-up, read-aloud; `Lab.quiz` with 12 questions (some data-reading questions using your figures); `Lab.sort`; teacher notes (Georgia S6E1/S6E2 connection + "this goes beyond grade 6").
Keep the nav to ~5–6 links. Calm design: shared classes and CSS variables; dark space stages (`.stage.space`) are fine for sky/space scenes; no decoration that isn't teaching.

## Media rules
Find media ONLY with `powershell -ExecutionPolicy Bypass -File "C:\Users\SHANCH~1\AppData\Local\Temp\claude\6f5e0ec2c29fb31e\245e6224-c9a5-4bfd-9f83-bbf90434c222\scratchpad\commons.ps1" -Search "…"` (add `filetype:video` / `filetype:audio`; `-Titles "File:…"` for known files). Use only `ok:true` results, copy URLs exactly, never invent URLs, caption only what the Commons title/description supports. It returns an `mb` field: skip clips over ~30 MB. Wikimedia rate-limits (HTTP 429) and several builders share it: one search at a time, 30–60 s apart, 120 s timeout. Nothing autoplays.

## Data you may load
Only from public CDNs already allowed in pages (cdn.jsdelivr.net/npm, unpkg, cdnjs), pinned versions. Example: real star catalog + constellation lines from the `d3-celestial` npm package data files (`https://cdn.jsdelivr.net/npm/d3-celestial@0.7.35/data/stars.6.json`, `constellations.lines.json`, `constellations.json`) — check the exact paths/version respond before relying on them, and show a friendly message if offline. Otherwise embed data you are confident of (NASA fact-sheet values) and label approximate values.

## Chinese text
Full-width punctuation (，。：；？！（）) you type may arrive as ASCII; after writing, convert half-width punctuation that touches Chinese characters in YOUR strings only (targeted pass, never blind regex over code). Use mainland-standard astronomy terms (e.g. 赫罗图、主序星、红巨星、白矮星、中子星、事件视界、系外行星、凌星法、视向速度法、宜居带、开普勒第三定律、霍曼转移轨道、宇宙微波背景辐射、哈勃–勒梅特定律).

## Rules
Do not edit `shared/` (only the coordinator does) and do not git commit. Verify every page in English and `?lang=zh` with the screenshot tool and your assigned ports (one shot at a time, 180 s+ timeout, retry on "chrome devtools did not start"):
`powershell -ExecutionPolicy Bypass -File "C:\Users\SHANCH~1\AppData\Local\Temp\claude\6f5e0ec2c29fb31e\245e6224-c9a5-4bfd-9f83-bbf90434c222\scratchpad\shot.ps1" -Url "file:///F:/Shanchuan/Biology_study/science-lab/astronomy/<id>.html?lang=zh" -Out "F:\Shanchuan\Biology_study\.labtmp\<id>_zh.png" -Wait 10 -Port <yours>`
It prints `ERRORS: [...]`; must be `[]`. Look at screenshots (Read tool), drive the sims via `-Js` to check readouts change, check one shot at `-W 420 -H 900`, delete screenshots when done.

**Final report:** per lesson what's in it (sims, figures, game, media, links), verification results (state plainly what wasn't verified), facts/figures written from memory, hard words for the pinyin DICT, and framework problems.
