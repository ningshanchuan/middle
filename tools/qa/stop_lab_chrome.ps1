# Ends every headless Chrome started by the lab tools (crawler, screenshots, phone tests) and nothing else.
# They are recognised by their own profile folders under .labtmp (labcol_*, labvshot_*, labphone*, labsweep*);
# the user's normal Chrome is never touched. The whole process tree is ended (taskkill /T /F), which also works
# when "End task" in Task Manager does not.
# Usage:  powershell -ExecutionPolicy Bypass -File stop_lab_chrome.ps1            (end them all)
#         powershell -ExecutionPolicy Bypass -File stop_lab_chrome.ps1 -Orphans   (only those whose launcher script is gone)
#         powershell -ExecutionPolicy Bypass -File stop_lab_chrome.ps1 -List      (show them, end nothing)
param([switch]$Orphans, [switch]$List)
$all = Get-CimInstance Win32_Process
$lab = @($all | Where-Object { $_.Name -eq 'chrome.exe' -and $_.CommandLine -match '\\\.labtmp\\lab(col|vshot|phone|sweep)' })
$ids = @($lab | ForEach-Object ProcessId)
# the browser (main) process of each instance is the one whose parent is not a lab Chrome itself
$mains = @($lab | Where-Object { $ids -notcontains $_.ParentProcessId })
$n = 0
foreach ($m in $mains) {
  $parent = $all | Where-Object ProcessId -eq $m.ParentProcessId
  $orphan = -not $parent
  $udd = if ($m.CommandLine -match 'user-data-dir="?([^" ]+)') { Split-Path $Matches[1] -Leaf } else { '?' }
  $tree = @($lab | Where-Object { $_.ProcessId -eq $m.ProcessId -or $_.ParentProcessId -eq $m.ProcessId })
  $cpu = (Get-Process -Id ($tree | ForEach-Object ProcessId) -ErrorAction SilentlyContinue | Measure-Object CPU -Sum).Sum
  "{0,-22} pid {1,-6} procs {2,-3} cpu-sec {3,7:N0} {4}" -f $udd, $m.ProcessId, $tree.Count, $cpu, $(if ($orphan) { 'ORPHAN (launcher gone)' } else { "launcher: $($parent.Name) $($parent.ProcessId)" })
  if ($List -or ($Orphans -and -not $orphan)) { continue }
  & taskkill.exe /PID $m.ProcessId /T /F 2>&1 | Out-Null; $n++
}
# leftovers whose browser process already died (renderer / GPU children still spinning)
if (-not $List -and -not $Orphans) {
  Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'chrome.exe' -and $_.CommandLine -match '\\\.labtmp\\lab(col|vshot|phone|sweep)' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
}
if (-not $List) { "ended $n lab Chrome instance(s); the user's own Chrome was not touched" }
