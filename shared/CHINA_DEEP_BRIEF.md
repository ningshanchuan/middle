# China history & geography deep dives — shared brief for builders

**Who it's for:** the owner's son, a **12-year-old boy in the US**, learning about China. He has little background in China and loses interest in reading-heavy pages. Write and design so a 12-year-old boy *wants* to keep going:
- **Missions, not chapters.** Frame sections as missions/challenges ("Mission 2: hold the pass", "Can you get the grain to the capital before winter?") with scores, stars, ranks (e.g. 士兵 → 将军), streaks and a progress bar.
- **How it works.** Engineering and mechanisms he can build, load-test, break and fix (arches, locks, dams, crossbow triggers, seismoscopes, bridges, railways).
- **Strategy & decisions.** Let him choose and see consequences (commander decisions, route planning, trade, disaster response).
- **Epic numbers made concrete.** Compare with things he knows: football fields, the Empire State Building, US states, a school bus, "longer than Atlanta → New York". Miles/feet/°F next to km/m/°C.
- **Short, punchy text.** 1–3 sentences per chunk; details behind click-to-reveal (`details.peek`). Active voice, a bit of humour, no baby talk. No gore — battles are about strategy, terrain and logistics.
English is the primary text; Chinese (`?lang=zh`) must be complete, natural and in the textbook's terms. Pinyin for hard words is added automatically by `shared/pinyin.js` (list any new hard words/polyphonic names in your report — don't edit shared/).

**Content basis:** mainland China's curriculum and perspective — 《义务教育历史课程标准(2022年版)》《义务教育地理课程标准(2022年版)》 and the 统编版/人教版 textbooks. Use the textbooks' terms, dates and evaluations. Maps of China MUST use `shared/chinamap.js` (standard map incl. 台湾省 and 南海诸岛); historical maps are labelled 示意图. Where you add facts beyond the textbook, say so in the teacher notes. **Ancient place names must show their modern name** (owner request): shared/placenames.js glosses HTML text automatically (长安（今陕西西安）); on canvas/SVG maps and labels you draw, write it yourself (长安（今西安） / Chang’an (Xi’an)).

## Read first
- `shared/README.md` (framework; "Audience & engagement standard", LabPhotos, pinyin, gotchas at the end)
- `shared/photos.js` header (gallery items, incl. `type:'video'|'audio'` and **`type:'youtube'`**)
- Finished examples: `china/unity-diplomacy.html` (year slider + map + event card), `china/climate-rivers.html` (layered map), `china/prc-founding.html` (3D build slider), `astronomy/rocketry.html` (missions with stars)
- Your topics are in `shared/catalog.js` (subject `china`, entries with `deep:true`). File = `china/<id>.html`, `<body data-subject="china" data-topic="<id>">`.

## Every lesson has
1. Hero: a hook question + "Your mission:" line.
2. **At least two real interactive simulations/models** (Lab3D 3D models, canvas sims, `.timebar` time sliders driving maps) with live readouts.
3. **A main game/mission** with score/stars/rank, plus Lab.quiz (12, 中考-style incl. 1–2 map/figure reading) and Lab.sort.
4. **At least one data figure** with real values and a source caption (approximate values labelled).
5. **"See the real thing"** via LabPhotos: 6–10 real photos (Wikimedia Commons) **and 1–3 YouTube videos** from reliable channels (CCTV/央视, CGTN, China Daily, Xinhua, official museum/agency channels, CNSA-related official uploads, NASA/ESA where relevant, Smithsonian, National Geographic, PBS, TED-Ed, BBC). Prefer short clips (1–10 min); you may set `start:` seconds. No autoplay.
6. **"Go further" links** (`.linkgrid` / `a.linkcard`, see lab.css): 4–8 links, each saying what he can do there (Palace Museum digital collections, museum sites, Google Arts & Culture pages, official project pages, YouTube playlists of official channels…).
7. Info panel (key facts, memory hint 记忆口诀, common mix-up 易错点, read-aloud) and teacher notes (课标/教材单元).
Keep the nav to ~6 links. Calm visual design (shared classes and CSS variables) — the excitement comes from interaction, not decoration.

## Media & links rules
- **Photos:** only via `powershell -ExecutionPolicy Bypass -File "C:\Users\SHANCH~1\AppData\Local\Temp\claude\6f5e0ec2c29fb31e\245e6224-c9a5-4bfd-9f83-bbf90434c222\scratchpad\commons.ps1" -Search "…"` (`ok:true` only; copy URLs exactly; caption only what the Commons title/description supports; one search at a time, 30–60 s apart — Wikimedia rate-limits).
- **YouTube:** find candidates with web search, then VERIFY every ID with
  `& "C:\Users\SHANCH~1\AppData\Local\Temp\claude\6f5e0ec2c29fb31e\245e6224-c9a5-4bfd-9f83-bbf90434c222\scratchpad\ytcheck.ps1" -Ids @("ID1","ID2")`
  Use only results that print **OK**, and check the printed title and channel really match what you caption (never invent IDs; never caption beyond the title/channel/what you can confirm). Item: `{ type:'youtube', yt:'ID', en, zh, kind:{en:'Video',zh:'视频'}, credit:'<channel> (YouTube)', license:'YouTube' }`. Note: on pages opened from disk YouTube can't play embedded, so the viewer opens YouTube in a new tab — that's expected.
- **Web links:** check with `& "…\scratchpad\linkcheck.ps1" -Urls @("https://…","https://…")`; use only 200s; `target="_blank" rel="noopener"`.
- Nothing is downloaded or stored locally — everything is linked.

## Chinese text
Full-width punctuation (，。：；？！（）) you type may arrive as ASCII: convert half-width punctuation touching Chinese characters in YOUR strings (targeted pass, never blind regex over code). Brackets in pairs.

## Rules & verification
Do not edit `shared/`; do not git commit. Verify each page in English and `?lang=zh` (and one shot at `-W 420 -H 900`, one in dark mode) with your assigned ports, one shot at a time, 180 s+ timeout, retry on "chrome devtools did not start":
`powershell -ExecutionPolicy Bypass -File "C:\Users\SHANCH~1\AppData\Local\Temp\claude\6f5e0ec2c29fb31e\245e6224-c9a5-4bfd-9f83-bbf90434c222\scratchpad\shot.ps1" -Url "file:///F:/Shanchuan/Biology_study/science-lab/china/<id>.html?lang=zh" -Out "F:\Shanchuan\Biology_study\.labtmp\<id>_zh.png" -Wait 10 -Port <yours>`
`ERRORS: []` required. (`-Js` runs before the wait and doesn't await promises; set `document.documentElement.style.scrollBehavior='auto'` before scrolling.) Look at screenshots, drive sims via `-Js`, delete screenshots when done.

**Final report:** per lesson: sims, game, figures, media (photos + YouTube with channel names), links; verification (state plainly what wasn't verified); facts/figures written from memory; hard words/polyphonic names for the pinyin list; framework problems.
