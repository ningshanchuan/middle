# Codex task queue: runs every task file in codex_tasks\queue\ (name order), one at a time per worker, and keeps the results
# for later review. Task file = a self-contained brief (.md). Result = codex_tasks\done\<name>.result.md (+ .log);
# the brief moves to codex_tasks\done\. A failed run moves to codex_tasks\failed\. Status lines go to codex_tasks\queue.log.
# Start 1–2 workers:  powershell -File codex_queue.ps1 -Worker 1     (a second one with -Worker 2)
# Tasks run in the science-lab folder with the workspace-write sandbox; they must not commit or push.
param([int]$Worker = 1, [string]$Effort = 'high')
$__jg = Join-Path $PSScriptRoot 'jobguard.ps1'; if (Test-Path $__jg) { . $__jg } else { try { (Get-Process -Id $PID).PriorityClass = 'Idle' } catch {} }   # idle CPU only; started Chrome/Codex die with this script
$root = 'F:\Shanchuan\Biology_study\.labtmp\codex_tasks'
foreach ($d in 'queue', 'running', 'done', 'failed') { New-Item -ItemType Directory -Force "$root\$d" | Out-Null }
$log = "$root\queue.log"
function Write-QLog($m) { $l = "{0:yyyy-MM-dd HH:mm:ss} w{1} {2}" -f (Get-Date), $Worker, $m; Add-Content $log $l -Encoding UTF8; $l }
Write-QLog "worker started"
while ($true) {
  # ordinal name order (culture sort ignores '-', which put "11p-proof" before "11-pressure"); a review task (NNp-proof-x)
  # waits until its build task (NN-x) is neither queued nor running
  $names = [string[]]@(Get-ChildItem "$root\queue" -Filter *.md | ForEach-Object Name); [Array]::Sort($names, [StringComparer]::Ordinal)
  $busy = @(Get-ChildItem "$root\queue", "$root\running" -Filter *.md | ForEach-Object Name)
  # any number of digits (101p-proof-x waits for 101-x); the old "9NNp" style also waits for "NN-x"
  $waits = { param($n) $m = [regex]::Match($n, '^(\d+)p-proof-(.+)\.md$'); if (-not $m.Success) { return $false }; $num = $m.Groups[1].Value; $rest = $m.Groups[2].Value
    if ($busy -contains "$num-$rest.md") { return $true }
    return ($num.Length -eq 3 -and $num.StartsWith('9') -and ($busy -contains "$($num.Substring(1))-$rest.md")) }
  $pick = $names | Where-Object { -not (& $waits $_) } | Select-Object -First 1
  $next = if ($pick) { Get-Item "$root\queue\$pick" } else { $null }
  if (-not $next -and $names.Count) { Start-Sleep -Seconds 60; continue }   # only reviews left, their builds still running
  if (-not $next) { Write-QLog "queue empty, worker stops"; break }
  $run = "$root\running\$($next.Name)"
  try { Move-Item $next.FullName $run -ErrorAction Stop } catch { continue }   # another worker took it
  $base = [IO.Path]::GetFileNameWithoutExtension($next.Name); $out = "$root\done\$base.result.md"
  Write-QLog "start $base"
  $t0 = Get-Date
  & "$PSScriptRoot\codex_task.ps1" -PromptFile $run -Out $out -Effort $Effort | Out-Null
  $ok = (Test-Path $out) -and ((Get-Item $out).Length -gt 0)
  Move-Item $run "$root\$(if ($ok) { 'done' } else { 'failed' })\$($next.Name)" -Force
  if (-not $ok -and (Test-Path "$out.log")) { Move-Item "$out.log" "$root\failed\$base.result.md.log" -Force }
  Write-QLog ("{0} {1} ({2:N0} min)" -f $(if ($ok) { 'done' } else { 'FAILED' }), $base, ((Get-Date) - $t0).TotalMinutes)
}


