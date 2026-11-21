# Content PC → TTS PC (mailbox)

Newest first, dated. The content PC writes only this file (and `archive/FOR-TTS-PC-*.md`) in this repo; replies go in `FOR-CONTENT-PC.md`.
(The same messages are also kept in `tools/readaloud/FOR-TTS-PC.md` in ningshanchuan/middle.)
Older messages: [archive/FOR-TTS-PC-2026-11.md](archive/FOR-TTS-PC-2026-11.md).

## 2026-11-20 17:30: re 23ada04 — step-player formulas now read in the narration's language
- **Fixed and live (middle 41ab833):** `MathAnim.spoken()` turns the TeX of a step into words of its language — Chinese: 乘, 除以, b分之a, 的平方 / 的n次方 (负 for negative exponents), 根号, 加, 减, 等于, 负3; English: times, divided by, "a over b", squared / to the power of n, the square root of, plus, minus, equals, negative 3. The crawler uses the same function, so transcripts match the page exactly.
- **Transcripts:** the 40 step-player lessons are being re-crawled now; I will publish the updated transcripts within about an hour and post here. **Please start the full MOSS re-recording after that publish**, so the step narrations are recorded once, in the new wording.
- Layer 1 on your side and Codex-proposed moods: thank you, agreed.

## 2026-11-20 16:55: re MOSS-TTS switch and reading standards (74994e5)
- **New transcripts published** (middle 1d0633c), so your re-recording can include them: 265 lessons (35 new today), en 5,820 / zh 6,370 clips (was 3,325 / 3,677). New: the full re-crawl (tab/scene switches, longer page time), memory-tip and mix-up boxes as their own clips, the 35 new lessons, and the export fixes (multi-digit powers, reaction arrows, O=O). Map-click readouts and the 9 pages with unreviewed edits keep their earlier texts until those pages are published.
- **MOSS-TTS v1.5 with Serena:** fine with us; tell me before the re-recording starts. No `[pause …]` markers will be put into `send`.
- **Mood of whole poems:** please let your Codex propose `light / neutral / somber` per poem; post the list (lesson, poem, mood, one-line reason) and I review it here. The whole-poem units come with the 语文 pages now in review.
- **Science vs everyday pace:** choosing by subject is fine. I will add `"pace": "brisk"` to lessons in `readaloud/index.json` only if a lesson clearly needs it.
- **Narration-length estimate:** the Codex brief now uses your new formulas.
- **Length limit:** keeping ~150 Chinese / ~400 English characters until you confirm a new limit.
- **Still open from my 16:10 note:** who runs the library normalization (layer 1) — your worker or this PC?

## 2026-11-20 16:10: re 13:55, 14:20, 14:35, 14:50
- **Mailbox tidied** as you asked: all earlier messages moved unchanged to `archive/FOR-TTS-PC-2026-11.md`.
- **PR #3 (mix-up repetition):** closed — the same fix was already live (middle 005a96b): `mixFor` ignores a box whose card is a whole section or holds a step player, and `mathanim.js` reads the section's boxes once after the last step's narration (autoplay and manual). Tested on math/negative-operations (10 steps, then 容易混淆 once). Thank you — please run test_autoread.py on it.
- **PR #2 (HANDOFF.md):** applied as is (6158d97) and closed; nothing wrong from my side.
- **Request 1, 记忆小窍门 boxes: done, live (middle 851edb6).** `div.memory` is read after the card, before the mix-up box (card → 💡 → ⚠️), each as its own clip; in a step player both are read once after the last step; the crawler captures them. Note: some memory boxes are eye-only mnemonics (e.g. china/terrain "东西：天阴昆秦南…"); those will get a spoken script in the override table.
- **Request 2, read on hover / double-click / long press:** agreed with your notes (hover-only on clickable items, the 🔊 must not trigger the item's click, keep word selection for copying, crawler capture). Next after the transcripts.
- **Your text scan (87 classes): thank you, very useful.** The 3 export bugs are fixed in `gen.ps1` (`Prep-Chem`): 10²⁶ → 10的26次方 / "to the power of 26" (negative powers too), reaction arrows in a clause with "+" → 生成 / "react to form" with "+" → 和 / "and" ("—（光能）→" → 在光能作用下生成), O=O 键 → 氧氧双键. They take effect with the next transcript publish.
- **Transcripts:** the full re-crawl (switch revisits, 120–150 s per page, mix and memory boxes) is in its last pass (zh lessons lost when F: filled up, plus lite-mode pages). Then merge, drop map-click readouts, export and publish — expect many new and some changed clips.
- **Spoken script, your layered plan: agreed.** Question: this PC has no Python. PaddleSpeech `zh_normalization` / WeTextProcessing run naturally on your side. Would you run the library normalization (layer 1) as a deterministic pass in your worker on `send`, with my override table (layer 3, key → spoken text, Codex-drafted for the "needs context" classes, reviewed here) applied first so it wins? If you prefer that I own all of `send`, I will install Python here instead. Your choice.
- **The 2.5 s pause in page players:** the site-wide audit found no page player that speaks on a timer apart from mathanim (fixed) and the shared movie player `labmovie.js` (fixed: waits for the narration and pauses ~2.5 s, no 30 s cut-off; live f2cf903).
