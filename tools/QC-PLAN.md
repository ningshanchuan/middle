# Genius Classroom · Quality control plan (draft for review)

Draft by the content PC, 2026-11-21, for review by the TTS PC (gladcolor/gc-audio-science issue) and approval by the user.
Principle: **quality first**; a page or a lesson's audio is "done" only when the checks below say so, never by counting
our own output. Every problem the user finds becomes a rule and an automatic check.
**One lesson at a time** (the user, 2026-11-21): recording and checking go lesson by lesson; a lesson is finished,
checked and confirmed before the next one starts; no more site-wide bulk runs. Progress is reported as complete
lessons, never as clip counts. Chinese version: `tools/QC-PLAN.zh.md` (keep both in step).

Owners: **CP** content PC (Claude) · **CX** Codex (writer / reviewer) · **TP** TTS PC · **U** the user.
Check types: **A** automatic script · **L** LLM review (a second, independent pass) · **H** human (listening / looking).

## 1. Curriculum
- Standard: every topic maps to a standard (Georgia GSE grades 6–8 and/or 人教/统编 7–9) or is marked enrichment;
  no gaps in the catalog against both curricula; Advanced mode separate from the standard core.
- Checks: A coverage table catalog ↔ standards lists (school-topics/, catalog `std`); L gap review per subject each
  term; H the user's priorities (son's units, Canvas).
- Owner CP; cadence: per new batch and monthly. Gate: a lesson needs a `std` line.

## 2. Facts and sources (实事求是)
- Standard: every fact, number, date, quote and attribution verifiable; disputed points marked; no copied textbook text.
- Checks: L proof pass by a second Codex (recompute numbers with a script, check formulas, units, quiz keys);
  A numbers in simulations recomputed by scripts; H spot checks of history/politics claims.
- Owner CX/CP. Gate: proof PASS before publishing.

## 3. Text (EN + 中文)
- Standard: bilingual parity (every visible string in both languages, same meaning); mainland terms and full-width
  punctuation in Chinese; English for ages 12–14; no class-specific wording (the site is public).
- Checks: A scan for strings without data-zh, forbidden words (class/teacher/Canvas…), half-width punctuation in
  Chinese; L translation review; H reading by the user.
- Owner CX/CP. Gate: A scan clean.
- Review records use an MQM-style error typology (accuracy, fluency, terminology, style; minor / major / critical).

## 4. Pedagogy
- Standard: clear objectives; simulation/visual first; worked examples (US style + 已知/求/解/答); in-class checks after
  each section; common misconceptions; final quiz with explanations; difficulty levels.
- Checks: L structure review against COMMON.md; A quiz key sanity (every item has exactly one correct answer, every
  answer has an explanation); H the son as a test reader.
- Owner CX/CP/U.
- From practice elsewhere: score each lesson on the 8 Achieve OER rubric dimensions (alignment, explanation, teaching
  utility, assessment, interactivity, practice, deeper learning, accessibility; 0–3 each, applied to the smallest unit),
  and, like PhET, a lesson leaves "new" only after a think-aloud try by students of the target age (the user's son).

## 5. Interaction and function
- Standard: every control works by mouse, touch and keyboard; no JS errors; simulations behave physically/mathematically
  right; state survives language switches; read-aloud controls behave (stop on manual turn, auto-read, on-demand).
- Checks: A headless sweep per page (JS errors, broken images, raw TeX, 390 px overflow) — `tools/qa/phone_sweep`,
  `hover_test`, media steps; A click-through crawl (the read-aloud crawler doubles as a smoke test: "page lost" =
  failure); A read-aloud stop test (`.labtmp/test_stop.mjs`: browser voice and recordings; stop bar, Esc, double-click
  again); L code review of new pages; H the user's hands-on testing.
- Owner CP/CX. Gate: sweep clean on every new or changed page.

## 6. Aesthetics (美育, visual calm)
- Standard: calm, uncluttered layout; consistent typography and colour; beauty through examples, images, sound —
  "画龙点睛", never a separate "where is the beauty" card; folding for secondary material.
- Checks: A screenshots at 1300 px and 390 px for every new page (`vshot`); L design review of the screenshots against
  the site's style; H the user's judgement.
- Owner CP/U.

## 7. Media and rights
- Standard: real, verified media only (Wikimedia Commons with credit, verified YouTube/bilibili); credits on the page,
  never read aloud; no broken or removed videos.
- Checks: A image load check per page; A video availability (YouTube oEmbed, bilibili API) monthly; L licence check
  for new media.
- Owner CP. Cadence: per publish + monthly link/video sweep.

## 8. Age-appropriateness and values
- Standard: suitable for 11–14; no violent works, no culture-war or partisan controversy; darker history told briefly
  and calmly; 人类命运共同体, 人民史观 as outlook, not slogans; balanced sources.
- Checks: L sensitivity review of history/politics/literature pages; H the user.
- Owner CX/CP/U. Gate: L review for new humanities pages.

## 9. Accessibility and compatibility
- Standard: keyboard operable, visible focus, contrast ≥ 4.5:1, colour-blind-safe palettes, motion can be stopped,
  images have alt text; works on Edge, Chrome, Safari/iOS, Android; fast load.
- Checks: A axe-core / contrast scan per page; A load-time and size budget; H device checks (iPhone, Android).
- Automatic scans find only about half of accessibility issues (most WCAG criteria have no automatic rule), so
  keyboard and screen-reader checks by hand are part of the gate for new interaction types.
- Owner CP. Cadence: per new page + quarterly full scan.

## 10. Spoken scripts (朗读稿)
- Standard: the voice never reads page text. Every clip whose text has digits, units, symbols, formulas, Latin letters
  in Chinese or Han characters in English gets a spoken script (`say`) that keeps the exact meaning, words and order and
  writes everything as it is spoken: numbers by meaning (years digit by digit, 两 vs 二, 二度), units in written order
  (二十公里每小时), dates and times, negatives (负 / 零下 / 南纬), chemical formulas (H二O) and ions, symbols, Greek
  letters, ranges (六到八年级), sentence ends kept for pauses; photo credits and licences never read; no brackets.
  多音字 are fixed for the voice (tools/tts/polyfix.tsv) without changing the page.
- Checks:
  - written by Codex from RULES_zh.md / RULES_en.md (with real examples), reviewed by a second Codex pass;
  - A validator: no digits/symbols left, Han coverage (zh) / word or letter coverage (en), nothing dropped;
  - A number check (TP proposal): each number in `send` must appear in `say` in one of its valid readings;
  - A rule-based TN as a cross-check only: where its reading of a number differs from the LLM's, the clip goes back to
    the review pass;
  - feedback from the ASR check and the user's listening: every misreading becomes a rule, an example, a polyfix entry;
  - H sample review of each new batch on `listen/say.html`; held-back sentences are hand-written.
- When page text changes: re-crawl → export → new sends queued (`queue_new.py`) → scripts → publish → recordings.
- Owners CX (write/review), CP (rules, validator, publish), TP (number check, review), U (decisions on readings).
  Gate: a clip that needs a script is not recorded until its checked script is published.

## 11. Read-aloud audio
- Standard: every text a page can read (auto, buttons, hover / double-click / long press) has a recording: Serena
  (MOSS 8B) where done, else the Edge stand-in, else the browser voice only as a last resort. Nothing is ever read from
  page text: every clip with digits, units, symbols, formulas, Latin-in-Chinese, Han-in-English uses an LLM spoken
  script. Correct readings (多音字, numbers, units, dates), natural pace, no stray sounds, steady loudness.
- Checks:
  - A **coverage audit** (`.labtmp/audit_audio.mjs`): every page, zh + en, all readable texts vs transcript and the
    Serena/Edge manifests. "Complete" only from this result.
  - spoken scripts: see section 10.
  - A + L **ASR check** (TP): FunASR / Whisper on live clips vs the script, then an LLM verdict (real misreading vs ASR
    artefact) → re-record list; misreadings feed RULES_zh/en.md and polyfix.tsv.
  - A pace / pitch / loudness / stray-end QC in the worker (moss_engine.check).
  - A pronunciation check for 多音字: a polyphone model (g2pW / g2pM) predicts the expected pinyin of each polyphone in
    the script; it is compared with the pinyin of the ASR text (ASR CER alone misses these, and ASR raises false
    alarms, hence the LLM verdict and listening).
  - H listening pages (`listen/`) for samples and every new kind of problem; listening stays the release gate for a
    new engine, voice or rule (automatic scores are smoke tests).
- Per lesson (one at a time): 1 re-crawl the lesson (on-demand texts and every quiz item); 2 coverage audit
  (`audit_audio.mjs <id>`); 3 spoken scripts for its new sends (write, review, validate, publish); 4 Edge recording of
  that lesson (`edge_record.py <lang> <corpus> F:\labtmp_edge <id>`); 5 Serena 8B replaces Edge; 6 QC: audit shows
  no audio missing, ASR + LLM check; 7 the user listens on `listen/lesson.html?id=<id>`, marks problems, fixes are
  re-checked; 8 marked complete in the lesson status list, reported, next lesson.
- Owners CP (transcripts, scripts, Edge), Colab worker (8B), TP (ASR check, independent QC). Gate: audit + validator +
  the user's listening.

## 12. Privacy, security, public site
- Standard: no personal data, no class or school references, no tracking, no secrets in any repo (OpenAI key,
  tokens); public GitHub issues without personal information.
- Checks: A secret scan before every push (keys, tokens, emails, machine names); A forbidden-word scan.
- Owner CP. Gate: scans clean before push.

## 13. Technical health and release
- Standard: catalog ↔ files ↔ transcripts consistent; no dead internal links; SEO block and sitemap current; audio
  repos below the GitHub Pages 1 GB limit (one repo per subject planned); releases reversible.
- Checks: A catalog/transcript consistency (every live lesson has a transcript); A crawl comparison (after a re-crawl,
  a lesson whose clip count in a language drops to 0 or falls clearly is not published but crawled again); A link check; A repo size check;
  A post-publish live check (pages 200, audio manifests reachable).
- Owner CP. Gate: release checklist below.

## 14. Operations
- Colab session (24 h limit; resume script + Drive environment), compute units, Edge rate limits, TTS PC health,
  disk space (C: nearly full). Owner CP, monitored in each work session.

## 15. Feedback loop
- Every problem found by the user, the TTS PC or a check → logged (tools/readaloud/qa/, GitHub issues) → fixed →
  re-checked → turned into a rule / check so it cannot come back. Monthly summary of problems by kind.

## 16. After a lesson is updated (the chain of follow-up actions)
1. **Page QC:** proof pass (L) and page sweep (A: JS errors, images, TeX, 390 px, accessibility scan), screenshots (H/L).
2. **Publish:** commit, catalog / hub category, SEO block and sitemap (`tools/seo/seo.ps1`), push; live check (200).
3. **Transcript:** re-crawl the lesson (`readaloud_sync.ps1 -Only <id> -Force`, zh + en, with hover capture) → export.
   Changed sentences get new keys; unchanged keys keep their recordings.
4. **Spoken scripts:** `queue_new.py` queues the new sends (zh, en) → Codex write + review → validator → publish
   `readaloud/say/<lang>.json`.
5. **Edge stand-in:** `edge_record.py` records the new clips at once (minutes); the page has audio the same day.
6. **Serena (MOSS 8B):** the Colab worker sees the new transcript fingerprint / say version, records the new clips and
   pushes the lesson.
7. **Coverage audit** of the lesson (`audit_audio.mjs <id>`): every readable text has audio; ASR check of the new clips
   (TP); listening sample if a new kind of text appeared.
8. **Clean-up:** recordings whose keys no longer appear in any transcript are listed and removed after a grace period,
   so the audio repos stay small (Pages 1 GB limit).
9. **Log:** what changed and what was re-recorded, in the lesson's QC record.
A script (`tools/lesson_update.ps1`) should run steps 3–7 for a list of lessons, so nothing is forgotten.

## Release checklist (every publish)
1. A page sweep (JS errors, images, TeX, 390 px) on new/changed pages. 2. Proof PASS (L). 3. Text scans (bilingual,
forbidden words, punctuation). 4. Secret scan. 5. Catalog/transcript consistency. 6. After publish: live check, then
transcript export → spoken scripts → Edge → 8B → coverage audit.

## Sources consulted (practice elsewhere)
Achieve OER rubrics (8 dimensions, 0–3); PhET design process (student interviews, classroom observation, accessibility
research); NVIDIA Riva TTS evaluation (ASR CER/WER as smoke test, MOS/CMOS listening as the real measure); TTS evaluation
papers on the limits of WER/UTMOS and missed mispronunciations; g2pW / g2pM polyphone disambiguation; MQM translation
quality typology; Deque / WCAG coverage studies of automatic accessibility testing.

## Open questions for the TTS PC
- Your additions to any section; which checks you can run on your PC (ASR, independent audio QC, accessibility scans?).
- Thresholds: CER for the ASR check, pace windows, loudness range.
- Cadence of your independent checks and where you post results.
