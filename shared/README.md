# Science Lab framework — how to build a topic app

Every topic is ONE self-contained HTML file at `science-lab/<subject>/<topic-id>.html` (ids are in `shared/catalog.js`).
The reference implementation is **`biology/dna.html`** — copy its structure.

## Page skeleton (required)
```html
<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>English topic title</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../shared/lab.css">
<script src="../shared/catalog.js"></script><script src="../shared/lab.js"></script><script src="../shared/lab3d.js"></script>
<style>/* page-specific only */</style>
</head>
<body data-subject="biology" data-topic="dna">      <!-- MUST match catalog ids -->
<div id="lab-nav"></div>                             <!-- nav is injected (home, breadcrumb, section links, EN/中文, theme) -->
<header class="hero wrap"> eyebrow + h1 + p.lead </header>
<section class="wrap" id="explore" data-nav="3D Model" data-nav-zh="3D 模型"> 3D stage + info panel </section>
<section class="wrap" id="..." data-nav="..." data-nav-zh="..."> 1–2 extra simulations / explanations </section>
<section class="wrap" id="games" data-nav="Quiz" data-nav-zh="测验"> quiz + sort game + teacher notes </section>
<div id="lab-footer"></div>                          <!-- prev/next topic + standard are injected -->
<script> data + UI (classic) </script>
<script type="importmap">{ "imports": { "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js", "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/" } }</script>
<script type="module"> 3D scene </script>
</body></html>
```
Sections with `data-nav` become nav links automatically. Keep 3–5 of them.

## Bilingual text (English + Simplified Chinese) — REQUIRED for every visible string
- Static: `<h2 data-zh="中文标题">English title</h2>`; markup: `<h1 data-zh-html="DNA:<em>生命密码</em>">DNA: <em>The Code of Life</em></h1>`; inputs: `data-zh-placeholder`.
- Dynamic: store `{en:'…', zh:'…'}` objects and render with `Lab.L(obj)`. Re-render in `Lab.onLang(fn)` (it is also called once at startup).
- `Lab.lang` is `'en'` or `'zh'`. After inserting markup that contains `data-zh`, call `Lab.translate(el)`.
- Chinese must be natural, accurate, middle-school level (use standard mainland textbook terms, e.g. 细胞核, 光合作用, 板块, 加速度, 化合物).

## Lab API (shared/lab.js)
- `Lab.$(sel)`, `Lab.$$(sel)`, `Lab.L(obj)`, `Lab.onLang(fn)`, `Lab.ready(fn)`, `Lab.speak(text)` (read-aloud in current language), `Lab.shuffle(arr)`, `Lab.UI.listen` (label for read-aloud buttons).
- `Lab.quiz(el, questions, {count:8})` — questions: `[{q:{en,zh}, options:[{en,zh}×4], answer:0, explain:{en,zh}}]`. Put the correct answer at index given by `answer` (options are shuffled for display). Provide 10–12 questions.
- `Lab.sort(el, {bins:[{id,en,zh}], items:[{en,zh,bin}]})` — drag/tap sorting game. 2–4 bins, 8–12 items. (Item colours are intentionally not rendered — they tended to reveal the answer.)

## Lab3D API (shared/lab3d.js) — inside the module script
```js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const ctx = Lab3D.stage('#stage', { THREE, OrbitControls, camera:[0,4,14], target:[0,0,0], autoRotate:false, minDistance:3, maxDistance:40, fov:40 });
// ctx.scene, ctx.camera, ctx.controls, ctx.renderer, ctx.THREE
ctx.onFrame((dt, t) => { ... });                 // per-frame update (dt seconds, t seconds)
ctx.pickable(meshOrGroup, 'key');                // make clickable; key identifies the part
ctx.onPick((key, hit) => select(key));           // click handler (key null = empty space)
ctx.hoverText(key => Lab.L(PARTS[key].name));    // hover tooltip
ctx.flyTo(vec3OrArray, distance); ctx.flyToPose(pos, target); ctx.home();
const L = ctx.label({en:'Crust', zh:'地壳'}, object3DOrVector3, {offset:[0,1,0]}); L.visible = false; // HTML label tracking a 3D point; updates on language switch
ctx.caption({en:'…', zh:'…'});                   // caption bubble at top of stage (null hides)
ctx.mat(color, opacity, extra)                   // MeshPhysicalMaterial helper
const story = Lab3D.story('#stage', steps, (i, step) => {...}, () => {...}); story.start();  // guided Back/Next/Replay steps, steps = [{en,zh}]
Lab3D.texture(THREE, Lab3D.TEX + 'planets/earth_atmos_2048.jpg', tex => { if (tex) mat.map = tex, mat.needsUpdate = true; });
```
- Stage markup: `<div class="stage card" id="stage" data-3d> <div class="toolbar">…buttons (.tbtn)…</div> <div class="bottombar"><div class="pill">…slider…</div><div class="tip">…</div></div> </div>`.
  Add class `space` to the stage for a dark space background (astronomy).
- Info panel: `<aside class="info card" id="info">` rendered from data (tag, h3 with .dot, .job, ul facts, .memory hint, optional .mix misconception, read-aloud button, prev/next). Clickable `.chips` row under the stage.
- Textures available at `Lab3D.TEX` (three.js r160 examples): `planets/earth_atmos_2048.jpg`, `planets/earth_normal_2048.jpg`, `planets/earth_clouds_1024.png`, `planets/earth_lights_2048.png`, `planets/moon_1024.jpg`. Always work without them (fallback color) — prefer procedural geometry.
- Other libraries only from cdn.jsdelivr.net/npm with pinned versions (e.g. `world-atlas@2.0.2/countries-110m.json`, `topojson-client@3.1.0`).

## Quality bar
- A REAL 3D centerpiece that teaches the mechanism (not decoration): clickable parts, animation, at least one control (slider/toggle) that changes the model, and a guided story (Lab3D.story) where it fits.
- At least one extra interactive simulation (2D canvas or HTML) with live feedback / counters, plus a quiz (10–12 Qs) and a sort game.
- Content accurate and aligned to the Georgia standard in the catalog; include memory hints, a “common mix-up” callout, and `<details class="teacher">` notes.
- No console errors. Works at phone width (no horizontal page scroll). Light + dark mode via CSS tokens (`var(--surface)`, `var(--ink)`, `var(--brand)` …). Canvas drawings read colors from `getComputedStyle(document.documentElement)` so they work in dark mode.
- Target 600–1100 lines per file. Write the file in several chunks (skeleton first with `<!--PART_X-->` markers, then Edit to fill each part) to avoid output limits.

## Verify
Screenshot + error check (Chrome headless via DevTools protocol):
`powershell -File <scratchpad>\shot.ps1 -Url "file:///F:/Shanchuan/Biology_study/science-lab/<subject>/<id>.html" -Out <png> -Wait 6 [-Js "..."] [-Port 9xxx]` → prints `ERRORS: [...]`. Use a unique -Port per agent.

## Math lessons (subject `math`) — MathAnim
Math pages are animated explainers. Reference: **`math/pythagorean.html`**. Extra head includes (before lab.js):
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
... <script src="../shared/lab.js"></script><script src="../shared/mathanim.js"></script>
```
- Stage: `<div class="ma-stage" id="stage" data-fs></div><div id="player"></div>` (16:9 dark canvas; full-screen button auto-added).
- `const S = MathAnim.scene('#stage', {x:[-8,8], y:[-4.5,4.5]})` — world coords, y up. Objects: `S.line/arrow/path/poly/rect/circle/arc/sector/dot/text/graph/custom/group/axes/numberLine`, KaTeX labels `S.tex('a^2', x, y, {color, size})` (`label.set(tex)` updates; `{en,zh}` objects allowed with `{html:true}` + `$math$`).
- Animations (await them): `S.create(ob,dur)` (draw-on), `S.fadeIn/fadeOut/pop/flash`, `S.to(ob,{x, y, r, pts, color, opacity, tx, ty, scale, rot, draw}, dur)` (arrays morph point-by-point), `S.wait(s)`, `S.all([...])`. Colours: `MathAnim.C.blue/teal/green/yellow/gold/orange/red/pink/purple/white/grey/dim`.
- `MathAnim.lesson({el:'#player', scene:S, steps:[{en, zh, run: async S => {...}}], intro:{en,zh}, preview: async S => {...}})` — narration supports `$inline$` and `$$display$$` KaTeX. Jumping to step i replays steps 0..i−1 instantly, so each `run` must be deterministic and build on the previous state (keep shared objects in a plain object like `const st = {}`).
- Explore interactives: a second `MathAnim.scene` with `S.custom((ctx, S) => {...})` redraw (S.sx/S.sy/S.px map world → pixels, S.wx/S.wy inverse for pointer input), linked to sliders; show results with `MathAnim.tex(...)` in `.ma-big` boxes. Layout `.ma-explore` (stage + `.card.ctl`).
- Pedagogy: 3Blue1Brown-like *style* (original visuals — no copied characters/branding): start from a concrete picture or question, let the animation reveal the pattern, then name the rule and formalize with colour-matched symbols; finish with a worked example. Keep narration short (1–3 sentences per step), concrete numbers before letters.

## Audience & engagement standard (applies to every lesson)
The site is for **American middle-school students** (12–14). The China modules teach mainland China's curriculum to students with no background in it.
- **Do, don't read.** Each lesson needs: an interactive centerpiece (3D model or clickable map/diagram with layer toggles), at least one **time slider / scrubber** where the topic changes over time or with a variable (use the shared `.timebar` class: `<div class="timebar"><button>▶</button><input type="range"><output></output></div>`), a drag-and-drop or click-to-place activity, instant feedback and a visible score.
- **Real media.** A "See the real thing" gallery of real photos — and video/audio where a good clip exists — via `LabPhotos` (`shared/photos.js`; freely licensed Wikimedia Commons files only, credit shown). Nothing autoplays.
- **English for a newcomer.** Short chunks; reveal detail on click. Explain Chinese terms on first use with pinyin + meaning; anchor with US comparisons (states, cities, miles/°F next to km/°C; "meanwhile in the US…"). Open with a hook question. Chinese (`?lang=zh`) stays complete.
- **Calm design.** Engagement comes from interaction, not decoration: no animation that isn't teaching something, shared classes and colour variables only, readable at 420px and in dark mode.
## Pinyin for hard words (`shared/pinyin.js`, auto-loaded)
In Chinese mode, words listed in the `DICT` at the top of `pinyin.js` get small pinyin above them (once per paragraph). A **拼** button in the nav turns it on/off. Add new hard words (rare characters, names, polyphonic characters, science terms) to `DICT` with tone marks; do not hand-write `<ruby>` in pages. Wrap anything that must not be annotated in `data-nopy`.
## Gotchas found while building
- **ResizeObserver redraws**: if a ResizeObserver callback redraws a canvas and that changes layout, Chrome throws "ResizeObserver loop completed…" (counted as a page error). Do the redraw inside `requestAnimationFrame(...)`.
- **`data-zh` replaces text**: it swaps `textContent`, so inline `<b>`, `<sub>` etc. are lost when switching back to English. Use `data-zh-html` for elements with markup.
- **`Lab.onLang(fn)` runs `fn` immediately** if Lab is already ready: don't let `fn` touch `let`/`const` variables declared later in the script (temporal-dead-zone error).
## Modern names for ancient places (`shared/placenames.js`, auto-loaded on China pages)
In HTML text, ancient place names get the modern name once per paragraph: 长安（今陕西西安） / Chang’an (today: Xi’an). It skips names already followed by 今… / today…, skips buttons, headings and 3D labels, and puts the note after a whole proper name (赵州桥（今河北赵县）). Canvas/SVG map labels can't be reached — write modern names there by hand. Add names to `ZH` / `EN` in the file; add false-friend guards to `NOT_AFTER` / `NOT_BEFORE` (e.g. 华北平原 contains 北平; 长安街 is modern Beijing).
