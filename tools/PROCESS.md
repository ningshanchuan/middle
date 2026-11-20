# How Genius Classroom is built and improved

This is a log of how the site's production process grew, what went wrong along the way and what we changed. It is for anyone maintaining the site, human or AI.

## 1. The site
- Bilingual EN / 中文 middle-school lessons, one self-contained HTML file per lesson (`<subject>/<id>.html`). They share `shared/` (lab.js, lab.css, catalog.js, pinyin.js, labmap.js, labmovie.js, photos.js …).
- **Purpose:** a supplement to school for Chinese-American middle schoolers to **preview, learn and review**. It covers US (Georgia GSE, metro-Atlanta pacing) and mainland-China (人教版/统编版) content.
- **Public:** no class-specific wording ("your class", worksheet names, quiz dates), no teacher or student names. Class materials we see are only references for *what* to teach.
- **Quality first:** correct facts and answers matter more than more pages.

## 2. Read-aloud audio: from browser voice to a dedicated TTS PC
1. **Browser voice.** Works everywhere, but sounds robotic, and Chinese tones and 多音字 come out wrong.
2. **OpenAI TTS.** Pre-recorded MP3s stored with the site, plus homophone swaps for 多音字.
   - Sounded good, but cost money and the swaps needed upkeep.
   - The site approached GitHub Pages' 1 GB limit.
3. **Qwen3-TTS on a home GPU server (voice Serena).**
   - Free, and reads 多音字 correctly.
   - The GPU crashed under load ("CUDA error"), even with one request at a time.
   - Lessons: serial queue, timeouts that grow with text length, retries with slightly changed wording, and a skip list for clips that hang.
4. **A separate TTS PC plus three audio repos.** This is the current setup; see `tools/readaloud/HANDOFF.md`.
   - **Content PC.** Edits lessons, crawls each page for every sentence the page can speak, and publishes transcripts:
     - `readaloud/index.json` (lesson list with fingerprints);
     - `readaloud/<subject>/<topic>.json` (clips `{key, lang, send, text}`).
   - **TTS PC.** Polls the transcripts, records changed lessons, and pushes MP3s and per-lesson manifests to `gladcolor/gc-audio-science`, `gc-audio-humanities` and `gc-audio-lang-math`. Each repo is served by GitHub Pages.
   - **The site.** `shared/audio-sources.js` maps each subject to its repo. `lab.js` loads the lesson manifest plus the `_shared` manifest and plays `<repo>/<subject>/<topic>/<lang>/<key>.mp3`. A sentence without a recording falls back to the browser voice.
   - **Clip key.** FNV-1a 32 of `lang|normalised text`; the page computes the same key at run time.
   - **One writer per repo.** The content PC writes the site; the TTS PC writes the audio repos.
   - **Mailbox.** The machines talk through `tools/readaloud/FOR-TTS-PC.md` (content PC → TTS PC) and `FOR-CONTENT-PC.md` in gc-audio-science (TTS PC → content PC).
5. **Lessons learned.**
   - Report a lesson as done only after the live files match byte for byte and a playback test passes.
   - Jekyll on GitHub Pages hides names starting with `_`. Use `.nojekyll` in the audio repos and avoid `_` names in the site.
   - The text sent to TTS (`send`) must spell out symbols the model can't read. The TTS PC found circled numbers, full-width ＋＝, ～, ^, <, dotted letters, "中文（ABBR）" and word—word dashes. `tools/tts/gen.ps1` → `Prep` converts them.
   - **Clipped first syllables.** Many devices drop the first ~0.2 s after the audio output was idle. `lab.js` now plays a silent Web Audio lead-in, starts the clip muted so it buffers, then rewinds and plays.

## 3. Page quality checks (`tools/qa/`)
- `vshot.ps1`: headless Chrome screenshot plus page JS errors; `-Js` / `-Js2` run code with a user gesture.
- `phone.ps1`: a phone-emulated screenshot (390×844, touch) that reports horizontal overflow.
- `phone_sweep.ps1`: one Chrome visits every catalog page at phone or desktop width, in en or zh. It reports:
  - pages wider than the screen;
  - elements sticking out;
  - JS errors;
  - pages that keep **jumping** after load (layout shifts; moving 3D labels are ignored).
- **Problems these tools found and fixed site-wide:**
  - Segmented buttons didn't wrap on phones.
  - `grid-template-columns: 1fr` let content widen the column; it now uses `minmax(0,1fr)`.
  - Hidden 3D labels widened the page; `html, body { overflow-x: clip }` stops that.
  - A ResizeObserver redraw rewrote text every frame. In Chinese mode `pinyin.js` adds ruby pinyin, which changes the height, so the page jumped in a loop. Rule: write text only when it changed.
  - `id="katex"` shadowed `window.katex`. Never give an element an id equal to a global library name.

## 4. Working with Codex (`tools/codex/`)
- Codex CLI (run locally) does the volume work:
  - drafting new lessons;
  - translation, pinyin and proofreading;
  - finding verified photos and videos;
  - extension modules;
  - curriculum research.
- Claude writes the requirements and does quality control.
- `COMMON.md` is the shared brief every lesson task reads: quality first, interactive simulations tied to formulas, live graphics, worked examples, a quick check after each section, Advanced mode, bilingual, phone-friendly, public wording, and the known pitfalls.
- `codex_queue.ps1` runs task briefs one after another and keeps every result for later review.
- **QC (`QC.md`)**, for every page:
  1. Codex builds the page.
  2. An independent Codex review re-checks every fact, formula and answer.
  3. Claude runs the browser and phone tests (the Codex sandbox cannot run Chrome) and spot-checks the content.
  4. Fixes go back to Codex.
  5. Only then: transcripts, publish, live check.
- Run a small pilot before any large batch.

## 5. Curriculum coverage
- Class tracking notes stay unpublished. Research files list the Georgia/Fulton standards, the Chinese 7–9 syllabus by chapter and every required formula, and the 统编版 语文 texts with their public-domain status.
- **Formulas.** Math, physics and chemistry lessons show formulas with KaTeX, always next to a simulation or diagram the student can change.
- **语文.** Full text is published only for public-domain works (all 古诗文; modern works first published in 1930 or earlier by authors who died before 1976). Other texts get our own summary and guide. All notes and translations are our own.
