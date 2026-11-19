# CONTENT PC, daily: after editing or adding lessons, refresh the read-aloud transcripts the TTS PC downloads.
#   1. collect the texts of new / changed lessons (headless Chrome; incremental - unchanged lessons are skipped), en + zh
#   2. export readaloud/index.json + readaloud/<subject>/<topic>.json (+ _shared.json)
#   3. show which lessons changed; then commit + publish the site as usual (the TTS PC picks the changes up by itself)
# Usage: powershell -ExecutionPolicy Bypass -File readaloud_sync.ps1 [-Only "biology/dna,math/area"] [-Force] [-Workers 4]
param([string]$Only = "", [switch]$Force, [int]$Workers = 4)
$ErrorActionPreference = 'Stop'
$tts = 'F:\Shanchuan\Biology_study\.labtmp\tts'; $site = 'F:\Shanchuan\Biology_study\science-lab'
$old = @{}
$ixf = "$site\readaloud\index.json"
if (Test-Path $ixf) { foreach ($l in (Get-Content $ixf -Raw -Encoding UTF8 | ConvertFrom-Json).lessons) { $old[$l.id] = $l.fingerprint } }
foreach ($lang in 'zh', 'en') {
  $a = @('-ExecutionPolicy', 'Bypass', '-File', "$tts\collect_all.ps1", '-Lang', $lang, '-Workers', $Workers, '-BasePort', 9921)
  if ($Only) { $a += @('-Only', $Only) }; if ($Force) { $a += '-Force' }
  "collecting $lang texts ..."; & powershell @a | Select-Object -Last 3
}
& powershell -ExecutionPolicy Bypass -File "$PSScriptRoot\export_jobs.ps1"
$new = (Get-Content $ixf -Raw -Encoding UTF8 | ConvertFrom-Json).lessons
$chg = @($new | Where-Object { $old[$_.id] -ne $_.fingerprint })
$gone = @($old.Keys | Where-Object { $id = $_; -not ($new | Where-Object { $_.id -eq $id }) })
"changed or new lessons: $($chg.Count)"; $chg | ForEach-Object { "  $($_.id)  $($_.zh) / $($_.en)  (en $($_.clips.en), zh $($_.clips.zh))" }
if ($gone.Count) { "lessons without read-aloud now: $($gone -join ', ')" }
"next: commit science-lab (incl. readaloud/) and publish as usual; the TTS PC records the changes within its next check"
