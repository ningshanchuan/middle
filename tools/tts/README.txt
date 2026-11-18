Genius Classroom - pre-recorded Chinese read-aloud (OpenAI gpt-4o-mini-tts)
==========================================================================

What it does
------------
Every text a lesson reads aloud (Lab.speak in shared/lab.js, MathAnim narration, and pages that call
speechSynthesis.speak themselves with Chinese) is recorded once with OpenAI TTS and stored with the site:

    science-lab/audio/zh/<key>.mp3      key = FNV-1a 32-bit hex of  "zh|" + text (tags stripped, spaces collapsed)
    science-lab/audio/zh/manifest.js    list of recorded keys - loaded by shared/lab.js (works from file:// too)
    science-lab/audio/zh/manifest.json  same list as JSON (for tools)

At run time Lab.speak() looks the text up; if a recording exists it plays it (speed = the reader's 🔊-panel speed,
pitch preserved), otherwise it falls back to the browser voice. Texts that change get a new key, so edited lessons
simply fall back to the browser voice until the scripts below are re-run.

Voice: marin, speed 0.9, instructions in instructions_zh.txt. Audio: the API returns 24 kHz PCM; it is encoded here with
the Windows Media Foundation MP3 encoder (MPEG-1 Layer III, 32 kHz mono, 48 kbps) - plays in Chrome, Edge, Safari,
Firefox. The PCM masters are kept in .labtmp\tts\pcm_zh\ (not published; delete them if disk space is needed - they
only save API calls if you ever re-encode).

Where things are
----------------
Scripts (identical copies, no key inside):  F:\Shanchuan\Biology_study\.labtmp\tts\   and   science-lab\tools\tts\
Work data (never published):                F:\Shanchuan\Biology_study\.labtmp\tts\
    lessons\<subject>__<topic>.zh.json   what the collector captured per lesson
    texts_zh.jsonl                       unique texts {key, text, via, lessons[, raw]}   (raw = MathAnim step with TeX)
    coverage_zh.tsv                      per-lesson counts, time, notes
    gen_zh.tsv                           every generated clip: key, chars, bytes, seconds, exact text sent to TTS
    gen_preview_zh.tsv                   (after -Estimate) what would be sent: key, TTS input, original
    polyscan_zh.txt                      (after polyscan.ps1) polyphonic characters in contexts polyfix.tsv does not cover
API key: science-lab\OpenAI_key.txt (gitignored). Only gen.ps1's worker processes read it. Never print or commit it.

Files
-----
collect_all.ps1   reads shared/catalog.js, opens each lesson (?lang=zh) in headless Chrome, N workers in parallel,
                  then runs merge.ps1. Incremental: skips lessons whose capture is newer than the lesson file.
collect.ps1       one worker (Chrome DevTools Protocol). pre.js = capture hooks injected before page scripts;
                  drive.js = clicks through the lesson (prev/next, chips, cards, tabs, sliders, selects) and presses
                  every visible speak button after each change. A page that hangs is retried once in "lite" mode.
merge.ps1         lessons\*.json -> texts_zh.jsonl + coverage_zh.tsv
gen.ps1           texts -> TTS input (math in words, symbols, polyphone fixes) -> MP3 + manifest. Skips keys that
                  already have an MP3; keeps going on errors (retries 5x with back-off); -Estimate prints chars,
                  minutes, cost and MB without calling the API; refuses to start above -MaxUSD (default 25).
polyfix.tsv       多音字 fixes used only for the text sent to TTS: word, pinyin, substitute (same syllable+tone,
                  single-reading common characters). A rule is skipped where it overlaps another listed word
                  (e.g. 医生长期), and words listed with themselves as substitute are "protected".
mathspeak_zh.tsv  how maths is spoken (分之, 的平方, 根号, 等于, 乘, 除以 ...)
extras_zh.txt     extra texts to record that no lesson page reaches (e.g. the 🔊-panel test sentence)
polyscan.ps1      review aid: lists polyphonic characters in contexts not covered by polyfix.tsv
vshot.ps1, verify.js, verify_ss.js   verification: opens a page with a user gesture, presses a 🔊 button whose text is recorded
                  and reports whether an <audio> element started (prints LOG/JS2 and ERRORS)

Re-run after lessons are added or edited  (PowerShell; run from F:\Shanchuan\Biology_study\.labtmp\tts
or from science-lab\tools\tts - both work; ports 9921-9929 are this project's)
-----------------------------------------------------------------------------------------------------
1. Collect texts of new/changed lessons (about 1 min per lesson per worker):
     powershell -ExecutionPolicy Bypass -File collect_all.ps1 -Workers 6 -BasePort 9921
   options: -Subjects "music,art"   -Only "math/area,biology/dna"   -Force (redo all)   -MaxSec 45 (time cap per lesson)
   astronomy/telescopes-light hangs headless Chrome when explored for long; collect it with:
     powershell -ExecutionPolicy Bypass -File collect_all.ps1 -Only "astronomy/telescopes-light" -MaxSec 3 -Force
2. Check the cost (no API calls) and look at gen_preview_zh.tsv:
     powershell -ExecutionPolicy Bypass -File gen.ps1 -Estimate
3. (optional) review polyphones in new texts, add lines to polyfix.tsv:
     powershell -ExecutionPolicy Bypass -File polyscan.ps1
4. Generate the missing recordings and rewrite the manifest:
     powershell -ExecutionPolicy Bypass -File gen.ps1 -Workers 6
   (re-run the same command to retry anything that failed; -ManifestOnly just rewrites the manifest)
5. Check a page:
     powershell -ExecutionPolicy Bypass -File vshot.ps1 -Url "file:///F:/Shanchuan/Biology_study/science-lab/math/area.html?lang=zh" -Out C:\temp\v.png -Port 9927 -Wait 5 -Js "Lab.recordings('zh').state" -Js2 ([IO.File]::ReadAllText("$PWD\verify.js"))
6. Remove clips of texts that no longer exist (old versions of edited texts), then publish as usual:
     powershell -ExecutionPolicy Bypass -File gen.ps1 -Prune
   (only prune right after a full collect, so every lesson is in texts_zh.jsonl)

Editing polyfix.tsv after clips exist: the key does not depend on the TTS input, so to re-record a clip delete its
MP3 (and its pcm_zh\<key>.wav master, otherwise the old audio is re-encoded) and run step 4.

Adding English later: generate audio/en/ the same way (gen.ps1 -Lang en with instructions_en.txt, collect with
-Lang en), then add 'en' to REC_LANGS in shared/lab.js.
