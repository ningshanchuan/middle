# CONTENT PC ONLY. Publish the read-aloud transcripts the TTS PC downloads (see tools/readaloud/HANDOFF.md).
#   science-lab/readaloud/index.json                 every lesson (catalog order): id, titles, page URL, clip counts, fingerprint
#   science-lab/readaloud/<subject>/<topic>.json     the lesson's clips: {key, lang, send, text[, demand:1][, style, work]}
#   science-lab/readaloud/shared.json               clips no single lesson owns (place-book sentences, speed-panel test ...)
#     key  = FNV-1a 32 of "<lang>|<text>" (same as Lab.speechKey in shared/lab.js) = the clip's file name <key>.mp3
#     send = exactly what to send to the TTS (symbols as words, glued pinyin removed, maths in words); text = what the page shows
#     fingerprint = first 12 hex of SHA-1 of the lesson file: changes only when the lesson's clips change
# No file or folder name here may start with "_": the site's GitHub Pages (Jekyll) does not publish those.
# Transcripts say WHAT a lesson needs, never what is recorded (that is the audio repos' status/).
# Needs the crawler output .labtmp\tts\texts_<lang>.jsonl (collect_all.ps1; readaloud_sync.ps1 runs both).
# -Only "a/b,c/d": export just these lessons (one lesson at a time, 2026-11-21): the TTS input is computed for their texts
# only (minutes instead of ~10), only their files and index entries are rewritten; shared.json and every other lesson stay.
param([string]$Out = 'F:\Shanchuan\Biology_study\science-lab\readaloud', [string]$Only = '')
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
# one spelling per work across pages (the TTS PC gives each work one mood): "tune(first line)" -> "tune + middle dot + first line",
# but "(qi N)" numbers stay; a bare tune name used for a known ci gets its full title. Chinese is written as \u escapes
# because this file has no BOM (PowerShell 5.1 would misread literal Chinese).
$U = { param($s) [regex]::Unescape($s) }
$workAlias = @{ (& $U '\u6C34\u8C03\u6B4C\u5934') = (& $U '\u6C34\u8C03\u6B4C\u5934\u00B7\u660E\u6708\u51E0\u65F6\u6709') }
$reParen = & $U '^(.+?)\uFF08(?!\u5176)(.+)\uFF09$'
$reBook = & $U '^\u300A|\u300B$'
function Norm-Work([string]$w) {
  $w = $w.Trim() -replace $reBook, ''
  if ($w -match $reParen) { $w = $Matches[1] + [char]0x00B7 + $Matches[2] }
  if ($workAlias.ContainsKey($w)) { $w = $workAlias[$w] }
  return $w
}
$shared = New-Object Collections.Generic.List[object]
$onlySet = @{}; foreach ($x in ($Only -split ',')) { if ($x.Trim()) { $onlySet[$x.Trim()] = 1 } }
$gw = $tts
if ($onlySet.Count) {
  $gw = 'F:\labtmp_uv\tmp\export_only'; if (Test-Path $gw) { Remove-Item $gw -Recurse -Force }; New-Item -ItemType Directory -Force $gw | Out-Null
  foreach ($l in 'en', 'zh') {
    $keep = foreach ($line in [IO.File]::ReadAllLines("$tts\texts_$l.jsonl", [Text.Encoding]::UTF8)) { if ($line.Trim()) { $o = $line | ConvertFrom-Json; if (@($o.lessons | Where-Object { $onlySet.ContainsKey($_) }).Count) { $line } } }
    [IO.File]::WriteAllLines("$gw\texts_$l.jsonl", [string[]]@($keep), $utf8)
    $sk = "$tts\skip_qwen3_$l.txt"; if (Test-Path $sk) { Copy-Item $sk "$gw\skip_qwen3_$l.txt" }
  }
  $allIds = @($lessons.Keys)   # catalog order, for the merged index
  foreach ($k in @($lessons.Keys)) { if (-not $onlySet.ContainsKey($k)) { $lessons.Remove($k) } }
  $missingIds = @($onlySet.Keys | Where-Object { -not $lessons.Contains($_) }); if ($missingIds.Count) { throw "not in the catalog: $($missingIds -join ', ')" }
}
foreach ($l in 'en', 'zh') {
  # the TTS input for EVERY clip: gen.ps1 -Estimate in Replace mode with an empty done list (the list is put back afterwards)
  if ($onlySet.Count) {   # own work folder: no done list there, so nothing to move aside
    & powershell -ExecutionPolicy Bypass -File "$tts\gen.ps1" -Lang $l -Engine qwen3 -Endpoint 'http://127.0.0.1:8000/v1/audio/speech' -Voice serena -Model qwen3 -Replace -Estimate -Work $gw | Out-Null
  } else {
  $df = "$tts\done_qwen3_$l.txt"; $bak = "$df.export-bak"
  if (Test-Path $df) { Move-Item $df $bak -Force }
  try { & powershell -ExecutionPolicy Bypass -File "$tts\gen.ps1" -Lang $l -Engine qwen3 -Endpoint 'http://127.0.0.1:8000/v1/audio/speech' -Voice serena -Model qwen3 -Replace -Estimate | Out-Null }
  finally { if (Test-Path $bak) { Move-Item $bak $df -Force } }
  }
  $send = @{}; $text = @{}
  foreach ($r in [IO.File]::ReadAllLines("$gw\gen_preview_$l.tsv", [Text.Encoding]::UTF8)) { $k, $s, $t = $r -split "`t", 3; $send[$k] = ($s -replace '\s+', ' ').Trim(); $text[$k] = ($t -replace '\s+', ' ').Trim() }
  $owned = @{}
  foreach ($line in [IO.File]::ReadAllLines("$gw\texts_$l.jsonl", [Text.Encoding]::UTF8)) {
    if (-not $line.Trim()) { continue }; $o = $line | ConvertFrom-Json
    if (-not $send.ContainsKey($o.key)) { continue }    # nothing speakable, or too long for one request
    foreach ($les in @($o.lessons | Where-Object { $_ } | Sort-Object -Unique)) {
      if (-not $lessons.Contains($les)) { continue }
      $c = [ordered]@{ key = $o.key; lang = $l; send = $send[$o.key]; text = $text[$o.key] }; if ($o.via -eq 'hover') { $c.demand = 1 }; if ($o.style) { $c.style = $o.style; if ($o.work) { $c.work = (Norm-Work $o.work) } }   # style: verse / wenyan / prose original; work: its title   # demand: read only on demand (hover / double-click / long press): record after the others
      $lessons[$les].clips.Add([pscustomobject]$c); $owned[$o.key] = 1
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
if ((Test-Path $Out) -and -not $onlySet.Count) { Get-ChildItem $Out -Recurse -Filter '*.json' | Where-Object { $_.FullName -notlike (Join-Path $Out 'say*') } | Remove-Item -Force }   # regenerated every time: removed lessons disappear
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
if ($onlySet.Count) {   # merge: these lessons' entries replace the old ones; every other entry and shared stay as they were
  $old = [IO.File]::ReadAllText("$Out\index.json", [Text.Encoding]::UTF8) | ConvertFrom-Json
  $byId = @{}; foreach ($e in $old.lessons) { $byId[$e.id] = $e }
  foreach ($e in $index) { $byId[$e.id] = $e }
  foreach ($k in $onlySet.Keys) { if (-not (@($index | Where-Object { $_.id -eq $k }).Count)) { $byId.Remove($k) } }   # no clips now
  $merged = @($allIds | Where-Object { $byId.ContainsKey($_) } | ForEach-Object { $byId[$_] })
  $idx = [pscustomobject]@{ format = 1; generated = (Get-Date -Format 'yyyy-MM-ddTHH:mm:ssK'); voice = 'serena'; repos = $src.repos; lessons = $merged; shared = $old.shared }
} else {
$sfp = Save-Json "$Out\shared.json" ([pscustomobject]@{ id = '_shared'; clips = $shared.ToArray() })
$idx = [pscustomobject]@{ format = 1; generated = (Get-Date -Format 'yyyy-MM-ddTHH:mm:ssK'); voice = 'serena'; repos = $src.repos; lessons = $index.ToArray(); shared = [pscustomobject]@{ id = '_shared'; repo = (Repo-Of '_shared'); clips = $shared.Count; fingerprint = $sfp } }
}
$null = Save-Json "$Out\index.json" $idx
"lessons with read-aloud: $($index.Count)  (en $nEn, zh $nZh clips)  shared: $($shared.Count)  -> $Out"
