# Common brief for Genius Classroom lesson pages (read fully before starting)

Site: "Genius Classroom" (天才课堂), a bilingual EN/中文 middle-school study site. The current folder is `science-lab`; it is live at https://shanchuan.org/middle/.
- It is a supplement to school, used to preview, learn and review.
- Readers are Chinese-American middle schoolers (US grades 6–8, Georgia standards, Fulton County) and their parents.
- Every lesson also covers the matching mainland-China 初中 content (人教版/统编版).

**QUALITY COMES FIRST.** Accuracy, correct answers and clear teaching matter more than length or number of features. A smaller correct page beats a big page with mistakes.
- Double-check every fact, formula, unit, worked example and quiz answer. Compute every number you show.
- If you are unsure of a fact, leave it out or say it is approximate.

## Read first
- `shared/README.md`, fully: the page skeleton, bilingual rules, and the Lab API (Lab.quiz, Lab.sort, Lab.speak, Lab.onLang, Lab.translate, Lab.L, Lab3D, LabMovie in shared/labmovie.js, photos via shared/photos.js, Advanced mode, read-aloud).
- `shared/FACTCHECK_BRIEF.md`.
- Model pages for the current standard: `biology/tonicity-labs.html`, `ela/narrative-techniques.html`, `geography/world-religions.html`.
- Math pages that already render formulas with KaTeX (katex@0.16.9 from cdn.jsdelivr.net), e.g. `math/area.html`, `math/slope.html`.
- `physics/electricity.html` (an existing physics simulation) and `chemistry/reactions.html`.

## Teaching style for math, physics and chemistry (user's request)
- **Interactive simulations and graphics first.** Every formula is tied to a picture, animation or simulation the student can change: sliders and drag handles that move a diagram, a live graph, and the formula with its numbers updating together.
- Keep numbers and formulas visible, but explain them through the visual. Avoid walls of text.
- **Worked examples**, step by step, with formulas in KaTeX and units in every step. Use the problem styles of both US and Chinese textbooks: Chinese-style calculation problems with 已知/求/解/答 are welcome.
- **In-class checks (随堂测试):** after EACH main section, 2–3 questions with instant feedback and an explanation.
- A final Lab.quiz of 10–12 questions modelled on school tests, with correct answers and explanations.
- **Practice:** a few harder problems with a "show steps" reveal or a key-point self-check.
- An **Advanced mode** toggle for deeper content, as other pages do.
- 🔊 read-aloud via Lab.speak on the main explanations.
- Optional "Observe": only real, verifiable media. Use Wikimedia Commons photos with credit, as shared/photos.js does, or YouTube ids verified with https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=ID&format=json. Never invent ids or URLs.
- Show the Chinese textbook terms (e.g. 压强、浮力、比热容、欧姆定律、配方法、判别式、化合价) and the US terms side by side where they differ. Use SI units, plus US-customary notes where a US class would use them.

## Rules
- One self-contained HTML file per lesson at `<subject>/<id>.html`, using `../shared/*`. The catalog entry already exists in `shared/catalog.js`: **never edit catalog.js** or any shared/* file. Edit only the files your task names.
- Every visible string must be bilingual: data-zh / data-zh-html, or {en,zh} objects rendered with Lab.L and re-rendered in Lab.onLang. Chinese must be natural, mainland-textbook style, with full-width punctuation.
- The page must work on a phone 390 px wide:
  - no horizontal page scroll;
  - canvases and SVGs scale to the width;
  - controls are touch-friendly (pointer events, not mouse-only);
  - wide tables scroll inside their own box.
- No teacher or student names.
- **The site is for the public, not one class.** Never mention a particular class, teacher, school schedule or school tool. Forbidden examples: "your class", "your teacher", 你们班, "your Hyperdoc", "quiz on 12/8", TAG, Canvas, Blooket, Nearpod, Gizmo, DeltaMath, "the Eggcellent Eggsperiment". Present activities generally instead, e.g. "the classic egg osmosis lab" or "a common test question". Write all text yourself; do not copy textbook text, except full texts of public-domain classics where the task says so.
- External scripts only from the CDNs existing pages use: cdn.jsdelivr.net for KaTeX and three.js.

## Known pitfalls (found in the pilot)
- Never give an element `id="katex"`, or any id that matches a global library name (THREE, Lab, LabMovie …). Browsers expose element ids as `window.<id>`, so `window.katex` became the `<script>` element and `katex.render` crashed. Load KaTeX with a different id, e.g. `id="katexLib"`, and guard every call with `window.katex && window.katex.render`.
- Never rewrite visible text on every redraw, especially from a ResizeObserver, animation frame or timer. In Chinese mode shared/pinyin.js adds ruby pinyin to hard words, which changes the height. A redraw that rewrites the text removes the ruby, the size changes, the ResizeObserver fires again, and the page jumps up and down forever (this happened on cs/cs-algorithms). Write text only when it changed, e.g. `if (el.dataset.v !== s){ el.dataset.v = s; el.textContent = s; }`. Never let a ResizeObserver callback change the size of the element it observes.
- Chrome usually cannot start inside the Codex sandbox, so you may not be able to take screenshots. Then check the scripts as well as you can (syntax, data and answer checks with a small script), and say clearly that the browser tests were not run. The reviewer will run them.

## Tests (PowerShell). Use only the ports given in your task.
- `powershell -ExecutionPolicy Bypass -File F:\Shanchuan\Biology_study\.labtmp\tts\vshot.ps1 -Url "file:///F:/Shanchuan/Biology_study/science-lab/<subject>/<id>.html" -Out F:\Shanchuan\Biology_study\.labtmp\shots\<id>.png -Wait 6 -Port <port>`
  Run it again with `?lang=zh`. It prints `ERRORS: [...]`, which must be `[]`. Open the PNG and check the layout.
- `powershell -ExecutionPolicy Bypass -File F:\Shanchuan\Biology_study\.labtmp\tts\phone_sweep.ps1 -Only "<subject>/<id>" -Port <port+1>` (and `-Lang zh`) must report `with problems: 0`.
- If Chrome cannot start in your sandbox, say so in your final answer.

Do NOT commit or push. Final answer, in English and concise:
- sections built;
- formulas and simulations included;
- media and how you verified it;
- test results;
- a list of anything you are unsure about.
