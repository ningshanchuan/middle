# Verify one published lesson on the LIVE site: (1) every en+zh key of the lesson is in the live manifest, (2) every live MP3 is
# byte-identical to the local serena file and the key is in done_qwen3_<lang>.txt, (3) a speak button on the live page plays a recording.
# Waits up to -MaxMinutes for GitHub Pages to deploy. Prints "VERIFIED" or "NOT VERIFIED".
param([string]$Lesson, [int]$MaxMinutes = 20)
$ProgressPreference = 'SilentlyContinue'
$tts = 'F:\Shanchuan\Biology_study\.labtmp\tts'; $root = 'F:\Shanchuan\Biology_study\science-lab'; $tmp = "F:\Shanchuan\Biology_study\.labtmp\chk_verify.mp3"
$keys = @{}; $done = @{}
foreach ($l in 'en', 'zh') {
  $keys[$l] = @(); foreach ($line in [IO.File]::ReadAllLines("$tts\texts_$l.jsonl", [Text.Encoding]::UTF8)) { if (-not $line.Trim()) { continue }; $o = $line | ConvertFrom-Json; if (@($o.lessons) -contains $Lesson) { $keys[$l] += $o.key } }
  $d = @{}; foreach ($k in [IO.File]::ReadAllLines("$tts\done_qwen3_$l.txt")) { $d[$k.Trim()] = 1 }; $done[$l] = $d
}
function Check {
  $res = @{}; $all = $true
  foreach ($l in 'en', 'zh') {
    $man = (Invoke-WebRequest "https://shanchuan.org/middle/audio/$l/manifest.js?v=$(Get-Random)" -UseBasicParsing).Content
    $inMan = 0; $match = 0; $nd = 0
    foreach ($k in $keys[$l]) {
      if ($man -match $k) { $inMan++ }; if (-not $done[$l].ContainsKey($k)) { $nd++ }
      try { $r = Invoke-WebRequest "https://shanchuan.org/middle/audio/$l/$k.mp3?v=$(Get-Random)" -UseBasicParsing; [IO.File]::WriteAllBytes($tmp, [byte[]]$r.Content)
        if ((Get-FileHash $tmp -Algorithm MD5).Hash -eq (Get-FileHash "$root\audio\$l\$k.mp3" -Algorithm MD5).Hash) { $match++ } } catch {}
    }
    $n = $keys[$l].Count; $res[$l] = "$l : $n clips | in live manifest $inMan | live MP3 = new serena file $match | not serena-done $nd"
    if ($inMan -ne $n -or $match -ne $n -or $nd -ne 0) { $all = $false }
  }
  return @($all, $res)
}
$t0 = Get-Date
do { $ok, $res = Check; if ($ok) { break }; Start-Sleep 30 } while (((Get-Date) - $t0).TotalMinutes -lt $MaxMinutes)
$res['en']; $res['zh']
if (-not $ok) { "NOT VERIFIED (live files did not all match after $MaxMinutes min)"; exit 1 }
$usesLab = [IO.File]::ReadAllText("$root\$Lesson.html") -match '<script[^>]+src="[^"]*shared/lab\.js'
$js = [IO.File]::ReadAllText($(if ($usesLab) { "$tts\verify.js" } else { "$tts\verify_standalone.js" })); $play = $true
"playback test: " + $(if ($usesLab) { 'lab.js page' } else { 'standalone page (own speak code)' })
foreach ($l in 'en', 'zh') {
  $out = & powershell -ExecutionPolicy Bypass -File "$tts\vshot.ps1" -Url "https://shanchuan.org/middle/$Lesson.html?lang=$l" -Out "F:\Shanchuan\Biology_study\.labtmp\shots\verify_$l.png" -Wait 10 -Js $js -Js2 "JSON.stringify(window.__vlog)"
  $j = ($out | Where-Object { $_ -like 'JS:*' }) -join ''; $lg = ($out | Where-Object { $_ -like 'LOG:*' }) -join ''; $er = ($out | Where-Object { $_ -like 'ERRORS:*' }) -join ''
  "play $l : $j"; if ($lg -match 'duration ([\d.]+) s') { "   duration $($Matches[1]) s; $(if ($lg -match 'advancing') {'audio advancing'} else {'NOT advancing'}); $er" }
  if ($j -notmatch 'recorded (\w{8}) audio=true' -or -not $done[$l].ContainsKey($Matches[1]) -or $lg -notmatch 'advancing') { $play = $false }
}
if ($play) { "VERIFIED $Lesson at $(Get-Date -Format HH:mm)" } else { "NOT VERIFIED (playback test failed)" }
