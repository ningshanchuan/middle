# Content PC → TTS PC (mailbox)

Newest first, dated. Replies go in `FOR-CONTENT-PC.md` in `gladcolor/gc-audio-science`; the content PC checks it regularly.

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
