# Read-aloud audio: handoff to the TTS PC

For: Claude Code running on the TTS PC (Windows, NVIDIA GPU, Python, ffmpeg) under the GitHub account **gladcolor**.
The user will ask you to "follow HANDOFF.md". Talk to the user in **Chinese**.

## 1. What this is

Genius Classroom (天才课堂, https://shanchuan.org/middle/) is a bilingual EN / 中文 middle-school science and
humanities site. Every lesson has 🔊 read-aloud buttons. A sentence with a recording plays the MP3. A sentence without one
falls back to the browser voice, so **the site works with no audio at all**.

Your job is to record every read-aloud sentence with **Qwen3-TTS, voice Serena**, keep the recordings up to date as
lessons change every day, and publish them from three gladcolor repos.

The content PC (another machine and another Claude session) edits the lessons and publishes the transcripts. Nobody else
writes to your audio repos.

## 2. How the pieces fit

```
content PC                                      TTS PC (you)
-----------                                     -------------
edits lessons                                   python tts_worker.py run --loop
readaloud_sync.ps1  --publishes-->  https://shanchuan.org/middle/readaloud/index.json        (every lesson + fingerprint)
                                    https://shanchuan.org/middle/readaloud/<subject>/<topic>.json   (the lesson's clips)
                                    https://shanchuan.org/middle/readaloud/shared.json   (the "_shared" bucket's clips)
                                                   |  download (HTTPS, public)
                                                   v
                                    record changed lessons, one clip at a time
                                    push to github.com/gladcolor/gc-audio-*     (storage)
                                    served at https://gladcolor.github.io/gc-audio-*/   (GitHub Pages: what pages play)
site pages read shared/audio-sources.js  -->  load <repo url><subject>/<topic>/manifest.js, play <lang>/<key>.mp3
```

- **Clip ID** is `key`: 8 hex characters, FNV-1a 32 of `"<lang>|<text>"`. The page computes the same key at run time.
  When text is edited it gets a new key, and the old clip becomes an orphan that the worker deletes.
- **Lesson ID** is `subject/topic`, the same as the page path, for example `biology/cell-theory`.
- **Transcript clip**: `{key, lang, send, text}`.
  - Send **`send`** exactly as written. Symbols are already turned into words and glued pinyin is already removed.
  - `text` is only what the page shows. Never send it.
- **Repos**, as decided in the site's `shared/audio-sources.js` and repeated in `index.json`:

  | repo | subjects |
  |---|---|
  | `gc-audio-science` | astronomy, biology, chemistry, physics, earth, cs |
  | `gc-audio-humanities` | geography, china, georgia, ushistory, worldhistory, politics, economics, **_shared** (place-book sentences, about 2,700) |
  | `gc-audio-lang-math` | math, yuwen, ela, music, art |

- **Repo layout**:
  - `<subject>/<topic>/<lang>/<key>.mp3`
  - `<subject>/<topic>/manifest.js`
  - `status/` containing `ledger.tsv`, `failed.tsv`, `lessons.json` and `STATUS.md`
  - `.nojekyll`. This is required, otherwise GitHub Pages hides `_shared/`.

## 3. Status labels

| clip | meaning |
|---|---|
| done | recorded in Serena (listed in `status/ledger.tsv`) |
| old | has an older-voice MP3 (migrated from the site) and still needs Serena |
| missing | no audio, so the browser voice plays |
| failed | the TTS failed `max_tries` times; retried after 12 h. See `status/failed.tsv` |
| held | never sent (`hold` list in the config) |

Lesson labels: **finished** (all clips done), **in progress**, **no audio**, **failed**, **old voice**, and **out of date**
(the transcript changed after recording; it is reprocessed automatically).

## 4. The user's settings (decided; do not change without asking)

- **Voice**: Serena for **both** English and Chinese, normal speed (1.0), **no style instructions**, text as written. There
  are no homophone swaps; Serena reads 多音字 correctly. Earlier tests found that style instructions made Chinese garbled
  or three times too long, and that speed 0.9 caused an echo. (A 2026-11-20 test of one teaching-style instruction on
  the TTS PC is waiting for the user's verdict; see 11.2.)
- **Sampling** (decided 2026-11-19): `temperature` 0.5 and `subtalker_temperature` 0.5. With the default 0.9 the
  Chinese voice changed from clip to clip (a mature woman in one, a child in the next); 0.6 and 0.7 sometimes gave very
  slow, overlong clips.
- **Audio**: MP3, mono, 24 kHz, **48 kbps**, loudness normalised to **-16 LUFS** (two-pass ffmpeg `loudnorm`, true
  peak -1.5 dB; the user found the raw output too quiet). The model outputs 24 kHz, so a higher sample rate gains nothing.
  The ledger tags every clip `serena t0.5 -16LUFS`; a clip with another tag is re-recorded.
- **Quality first, then speed** ("质量第一"). Every clip passes an automatic check before it is kept (11.2).
- **Batching** (replaces "one request at a time", approved by the user 2026-11-19): 2 model processes, each generating
  batches of up to 32 clips of similar length from a site-wide pool. Stable on the TTS PC (20 GB GPU, Windows).
- **Report only what you have verified.** The user was once told a lesson used the new voice when the page was really
  playing the Windows voice, and was upset. Report a lesson only after the worker prints `VERIFIED`, which means the live
  files match byte for byte.

## 5. Setup (once)

1. **Tools.** Check `git --version`, `python --version` (3.10 or later) and `ffmpeg -version`. Install anything missing
   with `winget` (`Git.Git`, `Python.Python.3.12`, `Gyan.FFmpeg`).
2. **Repos.** Ask the user to create three **public** repos under gladcolor: `gc-audio-science`, `gc-audio-humanities`
   and `gc-audio-lang-math`.
   - Each needs a README, so that a `main` branch exists.
   - In each, open Settings → Pages → Deploy from a branch → `main` / `(root)`.
   - Sign-in is the user's job: let Git Credential Manager open the browser and have the user log in as gladcolor. Never
     type or store passwords or tokens yourself.
3. **Clone** the three repos into one folder on a data disk, for example `D:\gc-audio\gc-audio-science`.
4. **Qwen3-TTS.**
   - Install it with its package's README instructions: a CUDA build of torch plus the package. Download the model.
     The old server ran "Qwen3-TTS 1.7B" with the speaker Serena.
   - Open `tts_worker.py` and **adapt `load_model()` and `synthesize()`**, the two functions marked `ADAPT`, to the real
     package API. Keep speaker Serena, language English or Chinese, no instruct text, and normal speed.
   - If the package lets you **cap the generation length** (for example `max_new_tokens`), set a cap that scales with
     the text length. On the old server the single word "mitochondria." generated endlessly, then the GPU crashed.
5. **Worker.**
   - Download it from https://shanchuan.org/middle/tools/readaloud/tts_worker.py and keep it outside the repos, for
     example `D:\gc-audio\tools\`.
   - Run `python tts_worker.py init`, then edit `tts_config.json` (`root`, `model`, `device`) and run `init` again.
     Every line should say ok or cloned.
   - The worker is a **draft** that was written on a machine without Python, so expect to fix small bugs. Do so freely.

## 6. Tests before real use

1. **Fake run (no GPU):**
   ```
   python tts_worker.py run --fake --no-push --lesson biology/cell-theory
   ```
   - Check `gc-audio-science/biology/cell-theory/` for `en/`, `zh/`, `manifest.js` and `status/STATUS.md`.
   - Then **throw the fake files away**:
     ```
     git -C D:\gc-audio\gc-audio-science reset --hard origin/main
     git -C D:\gc-audio\gc-audio-science clean -fd
     ```
2. **Real voice:**
   ```
   python tts_worker.py test-voice
   ```
   - Both lines must say `normal`. Typical pace is about 13 characters per second for English and about 4.8 for Chinese.
   - Ask the user to listen to `<root>\_test\test_en.wav` and `test_zh.wav` and confirm that this is Serena and sounds
     right.

## 7. Migration (once, before the site switches over)

```
python tts_worker.py migrate
```

- **What it does.** It copies the site's current MP3s (about 450 MB, from `https://shanchuan.org/middle/audio/<lang>/<key>.mp3`)
  into the lesson folders and pushes them lesson by lesson. It does no TTS.
- **Labels after migration.**
  - Clips listed in `readaloud/migrate/serena_<lang>.txt` (282 en, 364 zh) were already recorded in Serena on the old
    server, at 32 kbps. They become **done**.
  - The 10 biology lessons published so far should come out as **finished** and print `VERIFIED`. These are
    characteristics-of-life, cell-organelles, cell-theory, cell-city, cell-transport, osmosis, tonicity-labs, exocytosis,
    diffusion and endocytosis.
  - Everything else becomes **old** or **missing**.
- **When it ends**, tell the user in Chinese: "迁移完成，可以让内容电脑切换网站的音频来源了". The content PC then
  changes the site's `lab.js` to load from the audio repos and removes `audio/` from the site.

## 8. Daily operation

```
python tts_worker.py run --loop
```

Keep it running in its own terminal.

- **Each pass.** It downloads `index.json`, works through lessons whose fingerprint changed or that are not yet
  finished and verified, in catalog order, with `_shared` last. For each lesson it:
  1. deletes orphan clips;
  2. copies clips that are already recorded elsewhere;
  3. records the rest;
  4. writes `manifest.js` and the status files;
  5. pushes;
  6. waits for Pages and checks the live files.
- **Between passes** it sleeps `poll_minutes` (30), so new content from the content PC is picked up automatically.
- **Robustness.**
  - The model runs in a child process. A hang (over 75 s for a short text, or longer for long texts) or a CUDA error
    kills only the child. The worker then waits `cooldown_after_crash_s` (120 s) and reloads.
  - On retries, short English texts are sent written slightly differently ("Mitochondria." or "mitochondria").
  - A recording whose pace is far from normal is redone.
  - After 4 failed tries the clip is labelled **failed** and the worker moves on. It retries after 12 h, or immediately
    with `--retry-failed`.
- **When it prints `VERIFIED <中文标题> / <English title> <url>`**, tell the user. For example:
  > 已完成并在线核对：**细胞学说 · Cell Theory**: https://shanchuan.org/middle/biology/cell-theory.html （46 条，线上文件与录音逐字节一致）

  Until the user confirms that the site has switched over (step 7), the lesson **page** still plays the old site audio.
  So before the switch, say that the recordings are live in the audio repo, and give one direct MP3 link to listen to,
  for example `https://gladcolor.github.io/gc-audio-science/biology/cell-theory/en/<key>.mp3`.
- **Status at any time.** Run `python tts_worker.py status`, or open `status/STATUS.md` on GitHub. `published.log` in the
  root lists every verified lesson.

## 9. When something goes wrong

- **Repeated hangs or CUDA errors on the same clip.** Add it to `hold` in `tts_config.json` (`"en:39ecd1af"`), tell the
  user, and carry on.
- **The GPU crashes again and again, even with one request at a time.** Stop the worker and tell the user, who may need
  to reboot or check the driver. Do not raise the load.
- **Push rejected.** The worker pulls with rebase and retries. Only you write to these repos, so conflicts mean something
  unexpected; stop and ask.
- **A transcript looks wrong** (wrong text or wrong `send`). Do not edit it here. Tell the user, so the content PC can fix
  the lesson or the export.
- **Disk.** Keep the repos and temporary files on a data disk, not a nearly full C:.

## 10. Rules

- Never commit keys, tokens or passwords, and never put personal information in commits or files.
- Only these three repos are yours. Never push to `ningshanchuan/*`.
- Do not change voice, speed, bitrate or concurrency without asking the user.

## 11. Problems met on the TTS PC and how they were solved (2026-11-19/20)

The worker in production is `E:\gc-audio\tools\tts_worker.py` on the TTS PC; it has moved well beyond the draft in this
folder. Its config is `tts_config.json` next to it.

### 11.1 Speed

- **The GPU waited for the CPU.** On Windows (WDDM driver) one model process kept the GPU under 50 % busy: each
  generation step is many small kernel launches. More work per launch is what helps:
  - batch generation (`generate_custom_voice` with a list of texts): a batch of 16-32 costs little more per step than
    one clip;
  - 2 model processes, each with `torch.cuda.set_per_process_memory_fraction(0.45)`; a 3rd or 4th did not add speed;
  - a **site-wide pool**: clips from all lessons wait in one pool; each batch takes the oldest clip plus the clips
    closest to it in length, so a short clip does not wait for a 300-character one. Lessons are closed (manifest,
    push, live check) as soon as their last clip is in, not strictly in catalog order.
- **GPU memory peaks** came from decoding a whole batch to waveforms at once; decoding clip by clip removed them. When
  memory still runs out, the worker splits the batch and retries. Very long texts need small batches (12 texts of
  about 450 characters in one batch ran out of 20 GB).
- **Measured speed:** about 13x real time in a pure benchmark; in production 4.5x on average and 6-7x in the best
  hours (retries after failed checks, long clips and partly filled batches cost the difference).
- **Not adopted:** CUDA graphs (qwen3-tts-triton / faster-qwen3-tts): English 1.7x faster, but Chinese slower, with
  runaway clips and 12-14 GB for one process.

### 11.2 Voice quality and the automatic check

- **What the user hears as bad** (two listening reviews, 2026-11-19 and 11-20): a child-like or naive voice (most
  common), shouting, a sharp voice, too fast ("like a quarrel"), too slow and listless, uneven speed, over-acted
  intonation, a dialect-like sound, too casual for teaching.
- **What the metrics show:** every clip called child-like, naive, shouting or sharp had a median pitch of 306 Hz or more
  (Serena is normally 240-250 Hz). Of the clips slower than 3.5 Chinese characters/s, 62 of 80 were judged too slow or
  listless, poem lines included.
- **The check** (every new clip, in a pool of CPU processes so the GPU keeps working):
  - median pitch (librosa `pyin`, 120-600 Hz, on a 16 kHz copy) must be 185-300 Hz;
  - pace must be 3.5-6.5 Chinese characters/s (3.0-6.5 for the poetry and 文言文 lessons) or 8-18 characters/s for
    English. Pace counts characters as spoken: a Latin letter in Chinese text counts 0.4, an English digit 3, a decimal
    point 5, the degree and percent signs 7 each (without this, "Mitchell 县" or "56.2°S" raised false alarms);
  - a clip that fails is generated again in a later batch: up to 5 tries, 15 for science subjects. After the last try
    the best one is kept and listed in `qa_review.tsv` for listening. A review page (`tools/review_server.py`) lets the
    user listen and tag clips; clips tagged for redoing go into `rerecord.txt` and are recorded again.
- **Instruction test (2026-11-20, waiting for the user's verdict):** on 82 clips the user had rejected, the instruction
  "用自然、清晰、有精神的讲解语气，语速适中。" passed the check for 20 of 33 science and history clips (9 of 33 with a
  plain retry) and for 15 of 30 poem lines (10 of 30). A recitation-style instruction made poems slower (3 of 30).

### 11.3 Text that reads badly (fixed in the transcripts by the content PC)

Most problems came from the text, not from the voice model. They were reported to the content PC and fixed in the
export (`tools/tts/gen.ps1`):
- symbols: ①-⑩, full-width ＋＝, ~, ^, < >, ṁ, subscripts; fractions (2/3 → 3分之2, two thirds); doubled full stops;
- content made for the eye: mnemonics such as "天阴昆秦南", tables, labels;
- Chinese with an English abbreviation, "内质网（ER）": now a pause and the letters spelled out;
- single characters read alone (马, 车, 骤) and short term cards split by full stops ("立冬。冬季开始。"): all judged
  bad. The agreed fix is a **spoken script** (朗读稿) step in the export: an override table, key → spoken text, drafted
  by Codex for detected candidates only and reviewed; the page text and the key stay the same;
- poems recorded line by line do not join (pitch and rhythm change at every line): 语文 pages will read a whole poem
  (title, author, all lines) or a whole 文言文 paragraph as one clip, with stanza or paragraph units for long texts.
  The TTS PC tests the longest clip that stays stable and reports the limit.
- The worker stores a fingerprint of each clip's `send` text (`sha1(send)[:10]`) in the ledger, so a changed `send`
  is re-recorded even when the key stays the same.

### 11.4 Keeping the worker running without supervision

- `run_worker.cmd` → `supervise.ps1` → `tts_worker.py run --loop`. The supervisor restarts the worker after a crash
  (after 60 s, doubling up to 15 min if it keeps failing at once) and kills it when its heartbeat file is older than
  20 min. A lock file prevents two workers. QuickEdit is switched off in the console (in QuickEdit mode a click into the window pauses the program).
- It starts at logon from the Startup folder (`gc-audio-worker.cmd`); Task Scheduler needs admin rights on this PC.
- A lesson whose saved label is stale after a restart is finished again automatically.
- Log watchers must not hold the log files open (`tail -F` locked `supervisor.log` and made the supervisor look hung);
  poll the file size instead.

### 11.5 Website playback (fixed by the content PC, tested by the TTS PC)

- **Narration cut off** (math/equations): the step player went to the next step when the animation ended, which
  stopped the recording still playing. Now `Lab.whenSpoken()` in `lab.js` resolves when the narration has ended (it
  waits while paused). The rule for everything that moves on by itself: **about 2.5 s after a narration has ended;
  1 s after the animation when read-aloud is off**. A click of the student's own acts at once. The TTS PC checks this
  with a headless-Chrome test (`tools/test_narration.py` on the TTS PC).
- **Pause / resume** bar for long clips (a teacher can stop and explain), plus auto-read and auto-play switches.
- **Narration vs animation length:** the spoken length can be estimated when an animation is designed: Chinese
  seconds ≈ 1 + characters / 4.7; poetry and 文言文 ≈ characters / 3.2; English ≈ characters / 10.3 (90 % of clips
  within ±25-35 %). After recording, each lesson folder in the audio repos gets `timing.js` with the real duration of
  every clip.
- **China map:** DataV GeoAtlas refuses requests that carry the shanchuan.org referrer (HTTP 403); `chinamap.js` now
  fetches with `referrerPolicy: 'no-referrer'`.

### 11.6 Working between the two PCs

- The PCs talk only through the repos: `FOR-CONTENT-PC.md` (TTS → content) and `FOR-TTS-PC.md` (content → TTS) in
  `gladcolor/gc-audio-science`, newest first, dated.
- The TTS PC edits `FOR-CONTENT-PC.md` through the GitHub contents API, never in the worker's working tree (a
  `git pull` there collided with the worker's own commits).
- Quote commit ids that exist on GitHub; ids from an unpushed local history cannot be found by the other PC.
- Changes to the site's code go as a PR to `ningshanchuan/middle` or as a request in the mailbox; never push to its
  `main`.

### 11.7 Tools on the TTS PC

- **Codex CLI** does larger coding jobs; Claude writes the brief and reviews the result. Use the executable bundled
  with the VS Code extension: `codex exec -m gpt-6.2-sol -s workspace-write --skip-git-repo-check -C <dir> "<brief>"`.
  Codex's sandbox cannot start headless Chromium (each try opened a "chrome-headless-shell.exe - Application Error"
  dialog), so browser tests run outside the sandbox with the installed Chrome (`channel="chrome"` in Playwright).
- Never delete folders recursively (`rm -rf`); list them for the user to delete.
