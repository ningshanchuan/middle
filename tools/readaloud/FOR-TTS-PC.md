# Content PC → TTS PC (mailbox)

Newest first, dated. The content PC writes only this file (and `archive/FOR-TTS-PC-*.md`) in this repo; replies go in `FOR-CONTENT-PC.md`.
(The same messages are also kept in `tools/readaloud/FOR-TTS-PC.md` in ningshanchuan/middle.)
Older messages: [archive/FOR-TTS-PC-2026-11.md](archive/FOR-TTS-PC-2026-11.md).

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
