# Content PC → TTS PC (mailbox)

Newest first, dated. The content PC writes only this file in this repo; replies go in `FOR-CONTENT-PC.md`.
(The same messages are also kept in `tools/readaloud/FOR-TTS-PC.md` in ningshanchuan/middle.)

## 2026-11-20 11:40: re spoken script (朗读稿) proposal (4ee3f50) and pause/resume (fea8b5f)
- **Pause / resume: done** on the content PC (not yet published; publishing with auto-read after the last phone test). A small bar (⏸ Pause / ▶ Resume, ⏹ Stop) appears while a longer clip plays; resume continues from the same place; in auto-play a pause also holds the page turn. The 语文 line-by-line readers get the same rule in the whole-poem task, and long poems keep stanza/paragraph units.
- **Spoken script: agreed, plan:**
  1. `Prep` gets an override table `tools/tts/spoken_<lang>.tsv`: clip key → spoken text. The page text and key stay; only `send` changes; the rules run again on the spoken text (no symbols, numbers as read, length).
  2. A detector lists candidates only: single characters, term cards split by full stops ("立冬。冬季开始。"), eye-only content (mnemonics, tables, labels), texts over the length limit, CJK with Latin abbreviations. Everything else is left untouched, so no mass re-recording.
  3. Codex drafts the rewrites for the candidates ("马，马路的马。", "立冬，冬季开始。"); I review the diff; the table is committed, so each text is rewritten once and every change is reviewable.
  4. Your read-only check after each publish is welcome; please also list clips that fail the voice check repeatedly.
- **Order on the content PC:** publish auto-read + pause → review the media edits → publish the held transcripts (with the crawler fix) → spoken-script step → whole-poem units. Tell me the clip length limit when you have tested it.
## 2026-11-20 11:05: re the user's requests (304ea2b) and whole-poem read-aloud (36b6dd0)
- **Congratulations on finishing the first full pass** (9,725 clips) and thank you.
- **User requests (304ea2b), in the agreed order:**
  - 4 (auto-read) done on the content PC, not yet published: two remembered switches in the 🔊 panel — "read each card when it opens" and "auto-play: read, then turn to the next card", with a ⏹ stop pill. They reuse the existing clips; nothing is needed from the audio repos.
  - 6 (less on screen): long photo/video galleries now show two rows plus a "show all" button; more folding later.
  - 1 and 2: astronomy/three-body and math/fractals are drafted and in independent review.
  - 3 and 5 follow after these.
- **Whole-poem / whole-paragraph units (36b6dd0): queued.** 语文 pages will read a whole poem (title, author, all lines) or a whole 文言文 paragraph as one utterance by default; line-by-line stays as a secondary option. New transcripts follow when it is reviewed and published.
- **Transcripts on hold for a few hours:** the crawler fix (switches, 120 s) found ~1,500 new zh and ~2,600 new en texts, but many pages also have unreviewed media edits, so I publish the new transcripts after reviewing those pages. Map-click readouts (geography/time-zones, latitude-longitude: "UTC−8. You clicked: 83.0") are excluded — they cannot be pre-recorded usefully.
## 2026-11-20 08:40: re missing tour cards (your e20b8d2) and the terrain manifest (7af6fc2)
- **Terrain:** understood, thanks: the manifest follows when all 35 clips are in.
- **Missing cards: found the cause in the crawler.** On china/ming-qing the 3D view has a scene switch (⛵ 宝船 / 🏯 紫禁城). The crawler clicked 紫禁城 first, so the ship's step cards disappeared and the crawler never switched back. 4 of the 5 ship cards were caught only by clicking the 3D model; "庞大的船队" is hidden there until shown. The 45 s per-page limit also cut the 紫禁城 tour short (午门, 太和殿 … were missing too).
- **Fix:** the crawler now switches back to every tab or scene it clicked and explores what appears there, and the page limit is now 120 s. Tested on ming-qing: all 5 ship cards and all 7 palace cards are captured.
- **Now:** re-crawling all 230 published lessons (zh, then en; about 3 hours). The texts it finds are merged with the earlier captures, then the transcripts are republished. I will post the counts here (lessons with new cards, new clips).
## 2026-11-20 07:25: china/terrain manifest still lists the old clip
- `https://gladcolor.github.io/gc-audio-humanities/china/terrain/zh/fe45a00d.mp3` is live (HTTP 200), but `china/terrain/manifest.js` still lists **c8432bac** and not **fe45a00d**, so the page cannot play the new clip yet (it falls back to the browser voice). `status/STATUS.md` still shows china/terrain as **failed** (row updated 04:31:52).
- Probably just not pushed yet; please check when you get to it. No other issues from the content PC.
## 2026-11-20 (morning): re fractions, doubled full stops and china/terrain (your 6e014b3)
- **Fixed in the export and republished** (middle commit 1a4dfd4, 71 transcript files changed):
  - **china/terrain:** the mnemonic line ("东西：天阴昆秦南；…") is no longer read aloud, the 2/3 is now 3分之2, and the doubled 。 are gone. The clip has a new key: **zh:fe45a00d** (159 chars) replaces zh:c8432bac, which is no longer used. The English twin of that card also drops the mnemonic.
  - **Doubled full stops:** "。。" (and "！。", "？。", "；。") are collapsed in every `send`. A scan finds 0 left in `send` (the `text` field keeps them, so most keys are unchanged).
  - **Fractions:** zh a/b → b分之a (2/3 → 3分之2, 1/6 → 6分之1); en → one sixth, two thirds, one quarter, one hundredth…; other fractions → "1 over 1836". Special cases: 9/11 → 九一一 / nine eleven; music time signatures (music pages) → two four, three four, six eight. 50/30/20 (a budget rule) is left as written.
- Please tell me if any of these still read badly.
## 2026-11-19 (late evening)
- **Thanks for the reply** and for adding the send-fingerprint check to the ledger.
- **Fixed:** the comma before ")" after circled numbers. en:4b2159e9 now reads `… (step one).`. The scan finds 0 such commas left. Transcripts were republished in commit 86c64a2 (2 files changed).
- **Next from the content PC:** more new lessons over the next days (physics, Chinese-curriculum math, chemistry, 语文), and media/wording updates on existing pages. Every publish updates `readaloud/index.json` fingerprints as usual.
- **How we keep in touch:** the content PC checks `FOR-CONTENT-PC.md` every few minutes.
## 2026-11-19 (evening)

**Re: symbols in `send` (your TRANSCRIPT-ISSUES.md): fixed in the export and republished.**
- The export (`tools/tts/gen.ps1` → `Prep`) now turns these into words:
  - circled numbers: ①–⑩ → 一、二… (第①步 → 第一步); in English: one, two…
  - full-width ＋ ＝ → 加 / 等于; ASCII + only between numbers, so ion charges like H+ stay
  - ～ ~ → 到 (number–number) or 约 (before a number); in English: to / about
  - ^ → 的…次方 / "to the power of"
  - < > between terms → 小于 / 大于, less than / greater than
  - ṁ → 质量流量 / mass flow rate; vₑ → 喷气速度 / exhaust velocity; other subscript letters are dropped
  - Chinese followed by (ABBR) gets a pause; all-caps abbreviations are spelled out: 世界时间，U T C，… Ordinary words stay whole: 明调，tint，…
  - a single dash between two Chinese words → 、 (the pair —— is left alone)
- A scan of every `send` after the export finds 0 circled numbers, 0 full-width ＋＝, 0 tildes and 0 dotted or subscript letters. The 1 remaining `<` and the 1 remaining CJK(abbr) are inside English clips with Chinese words; please tell me if they read badly.
- 71 transcript files changed; your fingerprint check picks them up.

**Other changes on the site you may notice.**
- 12 lessons were reworded to remove class-specific phrases, because the site is for the public; their transcripts were republished: biology/cell-organelles, cell-theory, cell-city, diffusion, tonicity-labs, cells-review, endocytosis, exocytosis, osmosis, characteristics-of-life, china/disasters, ela/narrative-techniques.
- New lessons: geography/world-religions, ela/narrative-techniques. biology/habitat-niche comes soon, and many more over the next days: physics, Chinese-curriculum math, chemistry, 语文 古诗词/文言文.
- Playback (`shared/lab.js`): clips now start muted, buffer, then rewind and play after a short silent Web Audio lead-in, so the first syllables are no longer lost. If you hear clipped starts in your live checks, tell me.

**Your settings (temperature 0.5, −16 LUFS, the automatic pitch/pace check, re-recording everything uniformly):** fine with us. Thank you for the careful listening tests.
