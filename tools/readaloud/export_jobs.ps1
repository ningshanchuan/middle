# CONTENT PC ONLY. Publish the read-aloud transcripts the TTS PC downloads (see tools/readaloud/HANDOFF.md).
#   science-lab/readaloud/index.json                 every lesson (catalog order): id, titles, page URL, clip counts, fingerprint
#   science-lab/readaloud/<subject>/<topic>.json     the lesson's clips: {key, lang, send, text}
#   science-lab/readaloud/shared.json               clips no single lesson owns (place-book sentences, speed-panel test ...)
#     key  = FNV-1a 32 of "<lang>|<text>" (same as Lab.speechKey in shared/lab.js) = the clip's file name <key>.mp3
#     send = exactly what to send to the TTS (symbols as words, glued pinyin removed, maths in words); text = what the page shows
#     fingerprint = first 12 hex of SHA-1 of the lesson file: changes only when the lesson's clips change
# No file or folder name here may start with "_": the site's GitHub Pages (Jekyll) does not publish those.
# Transcripts say WHAT a lesson needs, never what is recorded (that is the audio repos' status/).
# Needs the crawler output .labtmp\tts\texts_<lang>.jsonl (collect_all.ps1; readaloud_sync.ps1 runs both).
param([string]$Out = 'F:\Shanchuan\Biology_study\science-lab\readaloud')

function Convert-SendText([string]$s, [string]$lang) {
  # Symbols Qwen3-TTS skips or never stops on, turned into words (found by the TTS PC). A text without them is
  # returned unchanged, byte for byte.
  $orig = $s
  $circled = '[\u2460-\u2473]'
  $chinesePunctuation = '[\u2014\u2018\u2019\u201C\u201D\u2026\u3001\u3002\u3008-\u3011\u3014-\u301B\uFF01\uFF08\uFF09\uFF0C\uFF1A\uFF1B\uFF1F\uFF3B\uFF3D]'
  $range = '(?<=\d)\s*[~\uFF5E]\s*(?=\d)'
  $approximation = '[~\uFF5E]\s*(?=\d)'

  if ($lang -eq 'zh') {
    # Chinese number words from one through twenty.
    $words = [regex]::Unescape(
      '\u4E00 \u4E8C \u4E09 \u56DB \u4E94 \u516D \u4E03 \u516B \u4E5D \u5341 ' +
      '\u5341\u4E00 \u5341\u4E8C \u5341\u4E09 \u5341\u56DB \u5341\u4E94 \u5341\u516D \u5341\u4E03 \u5341\u516B \u5341\u4E5D \u4E8C\u5341') -split ' '
    $s = [regex]::Replace($s, ('(?<=\u7B2C)' + $circled + '(?=\u6B65)'), {
      param($match)
      $words[([int][char]$match.Value - 0x2460)]
    })
    $s = [regex]::Replace($s, "($circled)\s*", {
      param($match)
      $words[([int][char]$match.Groups[1].Value - 0x2460)] + [char]0x3001
    })

    # Match the original plus sign here so Chinese text containing the word for plus stays in brackets.
    $abbreviation = '(?<abbr>[A-Za-z0-9](?:\uFF0B?[A-Za-z0-9]){0,5})'
    $brackets = '(?:\({0}\)|\uFF08{0}\uFF09)(?<followedByPunctuation>(?=\s*{1}))?' -f $abbreviation, $chinesePunctuation
    $s = [regex]::Replace($s, $brackets, {
      param($match)
      $comma = [char]0xFF0C
      $letters = ($match.Groups['abbr'].Value -replace '\uFF0B', [char]0x52A0).ToCharArray() -join ' '
      if ($match.Groups['followedByPunctuation'].Success) {
        return "$comma$letters"
      }
      "$comma$letters$comma"
    })
    $s = $s -replace '\uFF0B', [char]0x52A0 -replace '\uFF1D', (-join [char[]](0x7B49, 0x4E8E))
    $rangeZh = '(?<=[\d\u4E07\u4EBF\u5343\u767E\u5341])\s*[~\uFF5E]\s*(?=\d)'   # a range also after wan/yi/qian/bai/shi
    $s = $s -replace $rangeZh, [char]0x5230 -replace $approximation, [char]0x7EA6
    $power = [regex]::Unescape(' \u7684 $1 \u6B21\u65B9')
    $s = $s -replace '\s*\^\s*([+-]?\d+(?:\.\d+)?)', $power -replace '<', (-join [char[]](0x5C0F, 0x4E8E))
  } else {
    $words = 'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty' -split ' '
    $s = [regex]::Replace($s, "(?<step>\bstep\s+)?(?<number>$circled)", {
      param($match)
      $word = $words[([int][char]$match.Groups['number'].Value - 0x2460)]
      if ($match.Groups['step'].Success) {
        return $match.Groups['step'].Value + $word
      }
      $word.Substring(0, 1).ToUpperInvariant() + $word.Substring(1) + ': '
    }, [Text.RegularExpressions.RegexOptions]::IgnoreCase)
    $s = $s -replace '\uFF0B', ' plus ' -replace '\uFF1D', ' equals '
    $s = $s -replace $range, ' to '
    $s = $s -replace "(?<=\babout)\s*$approximation", ' ' -replace $approximation, 'about '
    $s = $s -replace '\^', ' to the power of ' -replace '<', ' less than '
  }

  $s = $s -replace '[~\uFF5E]', ''
  if ($s -ceq $orig) { return $orig }
  $s = $s -replace ' {2,}', ' '
  if ($lang -eq 'zh') { $s = $s -replace " +(?=$chinesePunctuation)", '' }   # English keeps its spaces before quotes
  return $s.Trim()
}

$ErrorActionPreference = 'Stop'
$tts = 'F:\Shanchuan\Biology_study\.labtmp\tts'; $root = 'F:\Shanchuan\Biology_study\science-lab'
$utf8 = New-Object Text.UTF8Encoding($false); $sha = [Security.Cryptography.SHA1]::Create()
$cat = [IO.File]::ReadAllText("$root\shared\catalog.js", [Text.Encoding]::UTF8)
$lessons = [ordered]@{}; $sid = $null
foreach ($m in [regex]::Matches($cat, "\{\s*id\s*:\s*'([\w-]+)'\s*,\s*(icon|std|soon)\s*:([^\r\n]*)")) {
  if ($m.Groups[2].Value -eq 'icon') { $sid = $m.Groups[1].Value; continue }
  if (-not $sid) { continue }
  $rest = $m.Groups[3].Value; $id = "$sid/$($m.Groups[1].Value)"
  $lessons[$id] = [pscustomobject]@{ id = $id; en = [regex]::Match($rest, "\ben\s*:\s*'((?:[^'\\]|\\.)*)'").Groups[1].Value; zh = [regex]::Match($rest, "\bzh\s*:\s*'((?:[^'\\]|\\.)*)'").Groups[1].Value; clips = New-Object Collections.Generic.List[object] }
}
$shared = New-Object Collections.Generic.List[object]
foreach ($l in 'en', 'zh') {
  # the TTS input for EVERY clip: gen.ps1 -Estimate in Replace mode with an empty done list (the list is put back afterwards)
  $df = "$tts\done_qwen3_$l.txt"; $bak = "$df.export-bak"
  if (Test-Path $df) { Move-Item $df $bak -Force }
  try { & powershell -ExecutionPolicy Bypass -File "$tts\gen.ps1" -Lang $l -Engine qwen3 -Endpoint 'http://127.0.0.1:8000/v1/audio/speech' -Voice serena -Model qwen3 -Replace -Estimate | Out-Null }
  finally { if (Test-Path $bak) { Move-Item $bak $df -Force } }
  $send = @{}; $text = @{}
  foreach ($r in [IO.File]::ReadAllLines("$tts\gen_preview_$l.tsv", [Text.Encoding]::UTF8)) { $k, $s, $t = $r -split "`t", 3; $send[$k] = Convert-SendText (($s -replace '\s+', ' ').Trim()) $l; $text[$k] = ($t -replace '\s+', ' ').Trim() }
  $owned = @{}
  foreach ($line in [IO.File]::ReadAllLines("$tts\texts_$l.jsonl", [Text.Encoding]::UTF8)) {
    if (-not $line.Trim()) { continue }; $o = $line | ConvertFrom-Json
    if (-not $send.ContainsKey($o.key)) { continue }    # nothing speakable, or too long for one request
    foreach ($les in @($o.lessons | Where-Object { $_ } | Sort-Object -Unique)) {
      if (-not $lessons.Contains($les)) { continue }
      $lessons[$les].clips.Add([pscustomobject]@{ key = $o.key; lang = $l; send = $send[$o.key]; text = $text[$o.key] }); $owned[$o.key] = 1
    }
  }
  foreach ($k in ($send.Keys | Sort-Object)) { if (-not $owned.ContainsKey($k)) { $shared.Add([pscustomobject]@{ key = $k; lang = $l; send = $send[$k]; text = $text[$k] }) } }
}
function Save-Json($path, $obj) {   # stable text (same input -> same bytes -> same fingerprint)
  New-Item -ItemType Directory -Force (Split-Path $path) | Out-Null
  $s = ($obj | ConvertTo-Json -Depth 6 -Compress) + "`n"
  [IO.File]::WriteAllText($path, $s, $utf8)
  return ([BitConverter]::ToString($sha.ComputeHash($utf8.GetBytes($s))) -replace '-', '').Substring(0, 12).ToLower()
}
if (Test-Path $Out) { Get-ChildItem $Out -Recurse -Filter '*.json' | Remove-Item -Force }   # regenerated every time: removed lessons disappear
# which audio repo holds which subject: shared/audio-sources.js (the one place this is decided)
$src = [IO.File]::ReadAllText("$root\shared\audio-sources.js", [Text.Encoding]::UTF8)
$src = ($src.Substring($src.IndexOf('{', $src.IndexOf('LAB_AUDIO_SOURCES')), $src.LastIndexOf('}') - $src.IndexOf('{', $src.IndexOf('LAB_AUDIO_SOURCES')) + 1)) | ConvertFrom-Json
function Repo-Of([string]$id) { $s = ($id -split '/')[0]; if ($id -eq '_shared') { return $src.shared }; $r = $src.subjects.$s; if ($r) { return $r }; Write-Warning "subject '$s' is not in audio-sources.js -> $($src.fallback)"; return $src.fallback }
# one-time migration help: clips this PC already recorded in serena (their MP3s are on the site under audio/<lang>/)
New-Item -ItemType Directory -Force "$Out\migrate" | Out-Null
foreach ($l in 'en', 'zh') { Copy-Item "$tts\done_qwen3_$l.txt" "$Out\migrate\serena_$l.txt" -Force }
$index = New-Object Collections.Generic.List[object]; $nEn = 0; $nZh = 0
foreach ($les in $lessons.Values) {
  if (-not $les.clips.Count) { continue }
  $clips = @($les.clips | Sort-Object lang, key -Unique)
  $en = @($clips | Where-Object { $_.lang -eq 'en' }).Count; $zh = $clips.Count - $en; $nEn += $en; $nZh += $zh
  $fp = Save-Json (Join-Path $Out ($les.id + '.json')) ([pscustomobject]@{ id = $les.id; title = [pscustomobject]@{ en = $les.en; zh = $les.zh }; url = "https://shanchuan.org/middle/$($les.id).html"; clips = $clips })
  $index.Add([pscustomobject]@{ id = $les.id; en = $les.en; zh = $les.zh; url = "https://shanchuan.org/middle/$($les.id).html"; repo = (Repo-Of $les.id); clips = [pscustomobject]@{ en = $en; zh = $zh }; fingerprint = $fp })
}
$sfp = Save-Json "$Out\shared.json" ([pscustomobject]@{ id = '_shared'; clips = $shared.ToArray() })
$idx = [pscustomobject]@{ format = 1; generated = (Get-Date -Format 'yyyy-MM-ddTHH:mm:ssK'); voice = 'serena'; repos = $src.repos; lessons = $index.ToArray(); shared = [pscustomobject]@{ id = '_shared'; repo = (Repo-Of '_shared'); clips = $shared.Count; fingerprint = $sfp } }
$null = Save-Json "$Out\index.json" $idx
"lessons with read-aloud: $($index.Count)  (en $nEn, zh $nZh clips)  shared: $($shared.Count)  -> $Out"
