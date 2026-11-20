# Collect read-aloud texts for every lesson in shared/catalog.js, several headless Chromes in parallel, then merge.
# Incremental: a lesson is skipped when its capture is newer than the lesson file (use -Force to redo all).
# Usage: powershell -ExecutionPolicy Bypass -File collect_all.ps1 [-Workers 6] [-BasePort 9921] [-MaxSec 45]
#        [-Only "biology/dna,math/area"] [-Subjects "yuwen,ela"] [-Force] [-Lang zh]
param([int]$Workers = 3, [int]$BasePort = 9921, [int]$MaxSec = 120, [string]$Only = "", [string]$Subjects = "",
      [switch]$Force, [string]$Lang = "zh", [string]$Root = "", [string]$Work = "")
$__jg = Join-Path $PSScriptRoot 'jobguard.ps1'; if (Test-Path $__jg) { . $__jg } else { try { (Get-Process -Id $PID).PriorityClass = 'Idle' } catch {} }   # idle CPU only; started Chrome/Codex die with this script
# keep F: from filling up: remove test-browser profiles and Chrome temp files older than 1 h that no running Chrome uses
try { $__use = @(Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | ForEach-Object { if ($_.CommandLine -match 'user-data-dir="?([^" ]+)') { Split-Path $Matches[1] -Leaf } })
  Get-ChildItem 'F:\Shanchuan\Biology_study\.labtmp', 'D:\labtmp' -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -match '^lab(shot|qa|vshot|phone|sweep|col)_' -and $__use -notcontains $_.Name -and $_.LastWriteTime -lt (Get-Date).AddHours(-1) } | ForEach-Object { try { [IO.Directory]::Delete($_.FullName, $true) } catch {} }
  Get-ChildItem 'D:\labtmp\chrometmp' -Force -ErrorAction SilentlyContinue | Where-Object { $_.LastWriteTime -lt (Get-Date).AddHours(-1) } | ForEach-Object { try { if ($_.PSIsContainer) { [IO.Directory]::Delete($_.FullName, $true) } else { Remove-Item $_.FullName -Force } } catch {} } } catch {}
. (Join-Path $PSScriptRoot "paths.ps1")
$cat = [IO.File]::ReadAllText((Join-Path $Root "shared\catalog.js"), [Text.Encoding]::UTF8)
$all = @(); $sid = $null
foreach ($m in [regex]::Matches($cat, "\{\s*id\s*:\s*'([\w-]+)'\s*,\s*(icon|std|soon)\s*:")) {   # "soon" topics count once their file exists
  if ($m.Groups[2].Value -eq 'icon') { $sid = $m.Groups[1].Value } elseif ($sid) { $all += "$sid/$($m.Groups[1].Value)" }
}
if ($Only) { $want = $Only -split ','; $all = @($all | Where-Object { $want -contains $_ }) }
if ($Subjects) { $ws = $Subjects -split ','; $all = @($all | Where-Object { $ws -contains ($_ -split '/')[0] }) }
$outDir = Join-Path $Work "lessons"; New-Item -ItemType Directory -Force $outDir | Out-Null
$todo = @(); $missing = @(); $fresh = 0
foreach ($l in $all) {
  $s, $t = $l -split '/', 2
  $f = Join-Path $Root "$s\$t.html"
  if (-not (Test-Path $f)) { $missing += $l; continue }
  $j = Join-Path $outDir ("{0}__{1}.{2}.json" -f $s, $t, $Lang)
  if (-not $Force -and (Test-Path $j) -and (Get-Item $j).LastWriteTimeUtc -gt (Get-Item $f).LastWriteTimeUtc) {
    $txt = [IO.File]::ReadAllText($j, [Text.Encoding]::UTF8)
    if ($txt -notmatch '"lost":true') { $fresh++; continue }
  }
  $todo += $l
}
"catalog lessons: $($all.Count)  file missing: $($missing.Count)  up to date: $fresh  to collect: $($todo.Count)"
if ($missing.Count) { "missing files: " + ($missing -join ', ') }
if ($todo.Count) {
  $n = [Math]::Max(1, [Math]::Min($Workers, $todo.Count))
  $procs = @()
  for ($w = 0; $w -lt $n; $w++) {
    $lst = Join-Path $Work "list_w$w.txt"
    $mine = @(); for ($i = $w; $i -lt $todo.Count; $i += $n) { $mine += $todo[$i] }
    [IO.File]::WriteAllLines($lst, [string[]]$mine)
    $log = Join-Path $Work "col_w$w.log"
    $args2 = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', (Join-Path $PSScriptRoot 'collect.ps1'), '-Port', ($BasePort + $w), '-List', $lst, '-Lang', $Lang, '-MaxSec', $MaxSec, '-Root', $Root, '-Work', $Work)
    $procs += Start-Process powershell -ArgumentList $args2 -RedirectStandardOutput $log -RedirectStandardError ($log + '.err') -WindowStyle Hidden -PassThru
  }
  "started $n workers (ports $BasePort-$($BasePort + $n - 1)); logs: $Work\col_w*.log"
  $t0 = Get-Date
  while (@($procs | Where-Object { -not $_.HasExited }).Count) {
    Start-Sleep -Seconds 20
    $d = (Get-ChildItem (Join-Path $Work "col_w*.log") | ForEach-Object { Get-Content $_.FullName } | Where-Object { $_ -match '^(DONE|FAIL|MISSING)' }).Count
    "  {0:N0}s  {1}/{2} lessons" -f ((Get-Date) - $t0).TotalSeconds, $d, $todo.Count
  }
  Get-ChildItem (Join-Path $Work "col_w*.log") | ForEach-Object { Get-Content $_.FullName } | Where-Object { $_ -match '^(FAIL|RETRY|FATAL)' }
}
& (Join-Path $PSScriptRoot "merge.ps1") -Lang $Lang -Root $Root -Work $Work
