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
  or three times too long, and that speed 0.9 caused an echo.
- **Audio**: MP3, mono, 24 kHz, **48 kbps**. The model outputs 24 kHz, so a higher sample rate gains nothing.
- **One request at a time** (a serial queue). The GPU crashed easily under parallel load on the old server.
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
  - Clips listed in `readaloud/_migrate/serena_<lang>.txt` (282 en, 364 zh) were already recorded in Serena on the old
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
