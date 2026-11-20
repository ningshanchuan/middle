# Common brief for Genius Classroom lesson pages (read fully before starting)

Site: "Genius Classroom" (天才课堂), a bilingual EN/中文 middle-school study site. The current folder is `science-lab`; it is live at https://shanchuan.org/middle/.
- It is a supplement to school, used to preview, learn and review.
- Readers are Chinese-American middle schoolers (US grades 6–8, Georgia standards, Fulton County) and their parents.
- Every lesson also covers the matching mainland-China 初中 content (人教版/统编版).

**QUALITY COMES FIRST.** Accuracy, correct answers and clear teaching matter more than length or number of features. A smaller correct page beats a big page with mistakes.
- Double-check every fact, formula, unit, worked example and quiz answer. Compute every number you show.
- If you are unsure of a fact, leave it out or say it is approximate.

## Core ideas of the site (the user's overall spirit)
These guide the whole site — its choice of topics, media and tone. They are NOT a checklist for every lesson: do not add "beauty" or "reflection" cards for their own sake, do not preach, do not label things. Let them show naturally in good content.
- **Aesthetic education (美育) at heart:** wherever it fits naturally, let students meet the beauty of knowledge, nature, people, society, life, the universe, morality and history — graceful (秀美) and sublime (壮美) — through good choices of examples, images, sounds and simulations rather than through commentary. No separate "美在哪里 / Where is the beauty" section or card: where beauty is genuinely there, say it in one short phrase inside the normal text (画龙点睛, a finishing touch); where it is absent or would be forced, leave it out. Aesthetic education is the site's overall aim, not something every lesson must show.
- **斯美也，有丑也:** the main tone for middle schoolers is beauty; where a topic genuinely calls for it, darker parts of history are told briefly, factually and calmly, without sensationalism.
- **A shared future for humankind (人类命运共同体)** and **history made by the people (人民史观)** are the outlook behind how history and society are presented — e.g. ordinary people appear naturally in the story, and exchange between civilizations is shown — not slogans to insert.
- **实事求是 (seek truth from facts):** this one applies everywhere: every fact, date, number, quote and attribution verifiable and sourced; no exaggeration, no omission; say plainly when something is uncertain or disputed.

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

## Animations with narration (user rule, 2026-11-20)
- Design each animated step together with its spoken narration: one idea per step, narration about two sentences.
- Estimate the spoken length and time the step's animation to about the same length (Serena, measured on 9,100 clips):
  Chinese ≈ 1 + characters / 4.7 s; Chinese poetry / 文言文 ≈ characters / 3.2 s; English ≈ characters / 10.3 s (spaces and punctuation counted). Shorten the text or lengthen the animation where they differ.
- At run time anything that moves on by itself must await `Lab.whenSpoken()` when its narration is on (never cut a narration), then pause about 2.5 s; with read-aloud off, pause about 1 s.

## Standards vs enrichment (user rule, 2026-11-20)
- Topics in the standards (Georgia GSE / Fulton for grades 6–8, or China's 课程标准 / 人教·统编 textbooks for grades 7–9, including 《义务教育艺术课程标准（2022年版）》 for music, art, theater/戏曲, dance and film): enrich them.
- Topics that are in neither: they may be added, but must be clearly marked as enrichment — a visible badge "课外拓展 · Enrichment" in the page hero, and on any section that goes beyond the standards inside an otherwise in-standard lesson.
- Cite only standards you can verify (name + code, e.g. a GSE code, or the textbook grade/unit); never invent codes.

## Read-aloud unit length (TTS PC test, 2026-11-20)
- One read-aloud unit (one Lab.speak / utterance) must be at most about **150 Chinese characters** (title and author included) or about **400 English characters**; longer clips often stop part-way. Split longer texts at stanza, paragraph or sentence-group boundaries.
- Whole poems (绝句, 律诗, most 词) are read as one unit — much better than line by line.
