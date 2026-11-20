# Codex task queue: runs every task file in codex_tasks\queue\ (name order), one at a time per worker, and keeps the results
# for later review. Task file = a self-contained brief (.md). Result = codex_tasks\done\<name>.result.md (+ .log);
# the brief moves to codex_tasks\done\. A failed run moves to codex_tasks\failed\. Status lines go to codex_tasks\queue.log.
# Start 1–2 workers:  powershell -File codex_queue.ps1 -Worker 1     (a second one with -Worker 2)
# Tasks run in the science-lab folder with the workspace-write sandbox; they must not commit or push.
param([int]$Worker = 1, [string]$Effort = 'high')
$root = 'F:\Shanchuan\Biology_study\.labtmp\codex_tasks'
foreach ($d in 'queue', 'running', 'done', 'failed') { New-Item -ItemType Directory -Force "$root\$d" | Out-Null }
$log = "$root\queue.log"
function Write-QLog($m) { $l = "{0:yyyy-MM-dd HH:mm:ss} w{1} {2}" -f (Get-Date), $Worker, $m; Add-Content $log $l -Encoding UTF8; $l }
Write-QLog "worker started"
while ($true) {
  $next = Get-ChildItem "$root\queue" -Filter *.md | Sort-Object Name | Select-Object -First 1
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
