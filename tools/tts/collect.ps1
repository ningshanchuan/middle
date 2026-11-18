# Collector worker: opens each lesson in headless Chrome (DevTools Protocol), runs drive.js and saves every text the
# page would read aloud to <Work>\lessons\<subject>__<topic>.json. Normally started by collect_all.ps1.
# Usage: powershell -ExecutionPolicy Bypass -File collect.ps1 -Port 9921 -List lessons_w0.txt [-Lang zh] [-MaxSec 45]
#        (-List = text file, one "subject/topic" per line)
param([int]$Port = 9921, [string]$List, [string]$Lang = "zh", [int]$MaxSec = 45,
      [string]$Root = "", [string]$Work = "")
$ErrorActionPreference = 'Continue'
. (Join-Path $PSScriptRoot "paths.ps1")
$utf8 = New-Object Text.UTF8Encoding($false)
$pre = [IO.File]::ReadAllText((Join-Path $PSScriptRoot "pre.js"), [Text.Encoding]::UTF8)
$drive = [IO.File]::ReadAllText((Join-Path $PSScriptRoot "drive.js"), [Text.Encoding]::UTF8)
$outDir = Join-Path $Work "lessons"; New-Item -ItemType Directory -Force $outDir | Out-Null
$items = @([IO.File]::ReadAllLines($List, [Text.Encoding]::UTF8) | Where-Object { $_.Trim() })
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chrome)) { $chrome = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" }
$uddBase = Join-Path (Split-Path $Work) ("labcol_" + $Port); $script:udd = $uddBase; $script:starts = 0
$script:proc = $null; $script:ws = $null; $script:id = 0

function Stop-Browser {
  try { if ($script:ws) { $script:ws.Dispose() } } catch {}
  $script:ws = $null
  try { if ($script:proc) { Stop-Process -Id $script:proc.Id -Force -ErrorAction SilentlyContinue } } catch {}
  Get-CimInstance Win32_Process -Filter "Name='chrome.exe' OR Name='msedge.exe'" | Where-Object { $_.CommandLine -like "*labcol_$Port*" } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
  Start-Sleep -Milliseconds 600
  Get-ChildItem (Split-Path $uddBase) -Directory -Filter ("labcol_" + $Port + "*") -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
}
function Send($method, $params, [int]$timeoutMs = 30000) {
  $script:id++
  $obj = @{ id = $script:id; method = $method; params = $params } | ConvertTo-Json -Depth 6 -Compress
  $b = [Text.Encoding]::UTF8.GetBytes($obj)
  if (-not $script:ws.SendAsync([ArraySegment[byte]]$b, 'Text', $true, [Threading.CancellationToken]::None).Wait($timeoutMs)) { throw "send timeout" }
  $deadline = (Get-Date).AddMilliseconds($timeoutMs)
  while ($true) {
    $ms = New-Object IO.MemoryStream; $buf = New-Object byte[] 262144
    do {
      if ($script:ws.State -ne 'Open') { throw "devtools socket closed" }
      $left = [int][Math]::Max(500, ($deadline - (Get-Date)).TotalMilliseconds)
      $r = $script:ws.ReceiveAsync([ArraySegment[byte]]$buf, [Threading.CancellationToken]::None)
      if (-not $r.Wait($left)) { throw "devtools receive timeout ($method)" }
      if ($r.Result.MessageType -eq 'Close') { throw "devtools socket closed" }
      $ms.Write($buf, 0, $r.Result.Count)
    } while (-not $r.Result.EndOfMessage)
    $txt = [Text.Encoding]::UTF8.GetString($ms.ToArray())
    if ($txt.StartsWith('{"id":' + $script:id + ',')) { return ($txt | ConvertFrom-Json) }
  }
}
function Eval($js, [int]$timeoutMs = 30000) {
  $r = Send "Runtime.evaluate" @{ expression = $js; returnByValue = $true } $timeoutMs
  return $r.result.result.value
}
function Start-Browser1 {
  Stop-Browser
  $script:starts++; $script:udd = "${uddBase}_$($script:starts)"
  $script:proc = Start-Process -FilePath $chrome -ArgumentList "--headless=new","--use-angle=swiftshader","--enable-unsafe-swiftshader","--mute-audio","--autoplay-policy=no-user-gesture-required","--disable-extensions","--no-first-run","--user-data-dir=$($script:udd)","--window-size=1300,900","--remote-debugging-port=$Port","about:blank" -PassThru
  $tabs = $null
  for ($k = 0; $k -lt 40 -and -not $tabs; $k++) { Start-Sleep -Milliseconds 500; try { $tabs = Invoke-RestMethod "http://127.0.0.1:$Port/json" -TimeoutSec 2; $tabs = @($tabs | ForEach-Object { $_ } | Where-Object { $_.type -eq "page" }); if (-not $tabs.Count) { $tabs = $null } } catch {} }
  if (-not $tabs) { throw "chrome devtools did not start on port $Port" }
  $script:ws = New-Object System.Net.WebSockets.ClientWebSocket
  if (-not $script:ws.ConnectAsync([Uri]($tabs | Select-Object -First 1).webSocketDebuggerUrl, [Threading.CancellationToken]::None).Wait(15000)) { throw "devtools connect timeout" }
  $script:id = 0
  [void](Send "Page.enable" @{})
  [void](Send "Page.addScriptToEvaluateOnNewDocument" @{ source = $pre })
}
function Start-Browser {   # a few attempts: under load Chrome sometimes needs longer to open its DevTools port
  for ($a = 1; ; $a++) { try { Start-Browser1; return } catch { if ($a -ge 4) { throw }; Start-Sleep -Seconds (3 * $a) } }
}

function Collect-One($s, $t, $file, [int]$maxSec, [int]$lite = 0) {
  $t0 = Get-Date
  [void](Send "Page.navigate" @{ url = "file:///" + $file.Replace('\', '/') + "?lang=$Lang" } 30000)
  Start-Sleep -Milliseconds 800
  for ($k = 0; $k -lt 40; $k++) { if ((Eval "document.readyState==='complete'") -eq $true) { break }; Start-Sleep -Milliseconds 250 }
  Start-Sleep -Milliseconds 1200          # let module scripts / Lab.ready handlers finish
  [void](Eval ("window.__colMax=$maxSec;window.__colLite=$lite;" + $drive))
  $frags = New-Object Collections.Generic.List[string]; $from = 0; $meta = 'null'; $href0 = $null
  $poll = "(()=>{const C=window.__col,P=window.__cap;if(!C||!P)return null;const s=P.t.slice(FROM);return JSON.stringify({n:P.t.length,calls:P.calls,done:C.done,clicks:C.clicks,rounds:C.rounds,phase:C.phase,ms:C.ms||0,err:C.err.slice(0,5),js:(window.__labErr||[]).slice(0,5),href:location.pathname})+'\u0001'+JSON.stringify(s).slice(1,-1)})()"
  for ($k = 0; $k -lt ($maxSec + 25); $k++) {
    Start-Sleep -Milliseconds 1000
    $v = Eval ($poll.Replace('FROM', "$from"))
    if ($null -eq $v) { $meta = '{"lost":true}'; break }      # page navigated away
    $parts = $v -split [char]1, 2
    $meta = $parts[0]; $m = $meta | ConvertFrom-Json
    if ($parts[1].Length -gt 0) { $frags.Add($parts[1]) }
    $from = $m.n
    if ($m.done) { break }
  }
  $sec = [int]((Get-Date) - $t0).TotalSeconds
  $mtime = (Get-Item $file).LastWriteTimeUtc.ToString('o')
  $json = '{"s":"' + $s + '","t":"' + $t + '","lang":"' + $Lang + '","mtime":"' + $mtime + '","sec":' + $sec + ',"meta":' + $meta + ',"texts":[' + ($frags -join ',') + ']}'
  [IO.File]::WriteAllText((Join-Path $outDir ("{0}__{1}.{2}.json" -f $s, $t, $Lang)), $json, $utf8)
  return "n=$from sec=$sec $meta"
}

try { Start-Browser } catch { "FATAL $($_.Exception.Message)"; exit 1 }
$done = 0
foreach ($line in $items) {
  $s, $t = $line.Trim() -split '/', 2
  $file = Join-Path $Root "$s\$t.html"
  if (-not (Test-Path $file)) { "MISSING $s/$t"; continue }
  $ok = $false
  for ($try = 1; $try -le 2 -and -not $ok; $try++) {
    try {
      $res = Collect-One $s $t $file $(if ($try -eq 1) { $MaxSec } else { [int]($MaxSec * 0.6) }) $(if ($try -eq 1) { 0 } else { 1 })
      "DONE $s/$t $res"; $ok = $true
    } catch {
      "RETRY$try $s/$t $($_.Exception.Message) $($_.Exception.InnerException.Message)"
      try { Start-Browser } catch { "FATAL restart failed: $($_.Exception.Message)"; exit 1 }
    }
  }
  if (-not $ok) { "FAIL $s/$t" }
  $done++
  if ($done % 25 -eq 0) { try { Start-Browser } catch { "FATAL $($_.Exception.Message)"; exit 1 } }   # fresh browser now and then (memory)
}
Stop-Browser
"FINISHED"

