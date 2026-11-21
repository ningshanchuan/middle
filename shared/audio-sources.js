/* Where the read-aloud recordings live (see tools/readaloud/HANDOFF.md).
   The site works without them: a sentence with no recording uses the browser voice.
   Each audio repo is a GitHub Pages site; a lesson's clips are at <repo url><subject>/<topic>/<lang>/<key>.mp3
   and listed in <repo url><subject>/<topic>/manifest.js. "_shared" = clips no single lesson owns (place-book sentences ...).
   The object below must stay strict JSON (tools/readaloud/export_jobs.ps1 and tts_worker.ps1 read it).
   To move a subject to another repo: change its line here, then let the TTS PC copy the files over.
   "edge": stand-in recordings (Microsoft Edge voice), one repo per language and subject group (as "subjects"), flat <lang>/<key>.mp3
   with <subject>/<topic>/manifest.js (lesson "edge:<id>"); used only when no Serena recording exists. */
window.LAB_AUDIO_SOURCES = {
  "repos": {
    "gc-audio-science":    "https://gladcolor.github.io/gc-audio-science/",
    "gc-audio-humanities": "https://gladcolor.github.io/gc-audio-humanities/",
    "gc-audio-lang-math":  "https://gladcolor.github.io/gc-audio-lang-math/"
  },
  "subjects": {
    "astronomy": "gc-audio-science", "biology": "gc-audio-science", "chemistry": "gc-audio-science",
    "physics": "gc-audio-science", "earth": "gc-audio-science", "cs": "gc-audio-science",
    "geography": "gc-audio-humanities", "china": "gc-audio-humanities", "georgia": "gc-audio-humanities",
    "ushistory": "gc-audio-humanities", "worldhistory": "gc-audio-humanities", "politics": "gc-audio-humanities",
    "economics": "gc-audio-humanities",
    "math": "gc-audio-lang-math", "yuwen": "gc-audio-lang-math", "ela": "gc-audio-lang-math",
    "music": "gc-audio-lang-math", "art": "gc-audio-lang-math"
  },
  "shared": "gc-audio-humanities",
  "fallback": "gc-audio-humanities",
  "edge": {
    "zh": { "gc-audio-science": "https://shanchuan.org/gc-audio-edge-zh/",
            "gc-audio-humanities": "https://shanchuan.org/gc-audio-edge-zh-humanities/",
            "gc-audio-lang-math": "https://shanchuan.org/gc-audio-edge-zh-lang-math/" },
    "en": { "gc-audio-science": "https://shanchuan.org/gc-audio-edge-en/",
            "gc-audio-humanities": "https://shanchuan.org/gc-audio-edge-en-humanities/",
            "gc-audio-lang-math": "https://shanchuan.org/gc-audio-edge-en-lang-math/" }
  }
};
