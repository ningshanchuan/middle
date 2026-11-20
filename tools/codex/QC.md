# Quality control (Claude), for every page Codex builds

Codex writes the page (NN-id) and then reviews it independently (NNp-proof-id). Claude never publishes until all of the following pass.

1. **Read both result notes** in `done/`: the build note and the proof verdict with its list of changes. Any "unsure" item gets checked or sent back.
2. **Browser test.** Codex's sandbox cannot run Chrome.
   - `vshot.ps1` en, zh and `?adv=1`: ERRORS must be `[]`.
   - Look at the screenshot.
   - Click through the main simulation with `-Js` when the page is new.
3. **Phone test:** `phone_sweep.ps1 -Only <id>` en and zh must report `with problems: 0`.
4. **Spot-check content myself.**
   - Check 3 formulas or worked examples and 3 quiz answers.
   - Check that the sim really moves the picture, the graph and the formula together.
   - Check that the Chinese terms are right.
5. **Requirements check.** Simulations and graphics come first; an in-class check after each section; worked examples; Advanced mode; read-aloud; bilingual.
6. **Problems found:** write a short fix brief and queue it for Codex (`NNf-fix-id.md`). Fix it myself only if it is a one-line fix.
7. **Publish.**
   - Commit only reviewed pages, with **only their catalog entries** (strip the entries of pages that are not yet published).
   - Run `readaloud_sync.ps1 -Only <ids>`.
   - Push to origin and the middle subtree.
   - Verify live (bytes equal) and report to the user.
