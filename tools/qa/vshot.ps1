# Copy of shot.ps1 for read-aloud checks: -Js runs WITH a user gesture (like a real click), so audio may start. Also prints -Js2 result after -Wait.
# Usage: powershell -File shot.ps1 -Url "file:///F:/..../page.html" -Out "C:\...\out.png" [-Wait 8] [-W 1400] [-H 1000] [-Js "javascript to run after load"] [-Port 9333]
# Prints JS errors captured on the page (window.__labErr) plus the result of -Js.
param([string]$Url, [string]$Out, [int]$Wait = 8, [int]$W = 1400, [int]$H = 1000, [string]$Js = "", [int]$Port = 9333, [string]$Js2 = "", [string]$Click = "")
$__jg = Join-Path $PSScriptRoot 'jobguard.ps1'; if (Test-Path $__jg) { . $__jg } else { try { (Get-Process -Id $PID).PriorityClass = 'Idle' } catch {} }   # idle CPU only; started Chrome/Codex die with this script
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$udd = Join-Path "D:\labtmp" ("labvshot_" + $Port)   # Chrome profile on D: (C: and F: are nearly full)
New-Item -ItemType Directory -Force (Split-Path $udd) | Out-Null
Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -like "*labvshot_$Port*" } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
$__ct = 'D:\labtmp\chrometmp'; New-Item -ItemType Directory -Force $__ct | Out-Null; $env:TEMP = $__ct; $env:TMP = $__ct   # headless Chrome leaves scoped_dir* temp folders when it is killed: keep them off the nearly-full C: drive
Get-ChildItem $__ct -Directory -ErrorAction SilentlyContinue | Where-Object { $_.LastWriteTime -lt (Get-Date).AddHours(-1) } | ForEach-Object { try { [IO.Directory]::Delete($_.FullName, $true) } catch {} }
$proc = Start-Process -FilePath $chrome -ArgumentList "--headless=new","--use-angle=swiftshader","--enable-unsafe-swiftshader","--user-data-dir=$udd","--window-size=$W,$H","--remote-debugging-port=$Port","about:blank" -PassThru
$tabs = $null
for ($k = 0; $k -lt 30 -and -not $tabs; $k++) { Start-Sleep -Milliseconds 500; try { $tabs = Invoke-RestMethod "http://127.0.0.1:$Port/json" -TimeoutSec 2 } catch {} }
if (-not $tabs) { 'ERRORS: ["chrome devtools did not start on port ' + $Port + '"]'; exit 1 }
$ws = New-Object System.Net.WebSockets.ClientWebSocket
$ws.ConnectAsync([Uri]($tabs | Where-Object type -eq 'page' | Select-Object -First 1).webSocketDebuggerUrl, [Threading.CancellationToken]::None).Wait()
$script:id = 0
function Send($method, $params) {
  $script:id++
  $obj = @{ id = $script:id; method = $method; params = $params } | ConvertTo-Json -Depth 6 -Compress
  $b = [Text.Encoding]::UTF8.GetBytes($obj)
  $ws.SendAsync([ArraySegment[byte]]$b, 'Text', $true, [Threading.CancellationToken]::None).Wait()
  while ($true) {
    $sb = New-Object Text.StringBuilder; $buf = New-Object byte[] 1048576
    if ($ws.State -ne 'Open') { throw "devtools socket closed" }
    $guard = 0
    do { $r = $ws.ReceiveAsync([ArraySegment[byte]]$buf, [Threading.CancellationToken]::None); if (-not $r.Wait(30000)) { throw "devtools receive timeout" }; if ($r.Result.MessageType -eq 'Close') { throw "devtools socket closed" }; [void]$sb.Append([Text.Encoding]::UTF8.GetString($buf, 0, $r.Result.Count)); $guard++ } while (-not $r.Result.EndOfMessage -and $guard -lt 5000)
    $m = $sb.ToString() | ConvertFrom-Json
    if ($m.id -eq $script:id) { return $m }
  }
}
[void](Send "Page.enable" @{})
[void](Send "Page.addScriptToEvaluateOnNewDocument" @{ source = "window.__labErr=[];addEventListener('error',e=>__labErr.push(e.message+' @'+(e.filename||'').split('/').pop()+':'+e.lineno));addEventListener('unhandledrejection',e=>__labErr.push('promise: '+e.reason));" })
[void](Send "Page.navigate" @{ url = $Url })
Start-Sleep -Seconds 3
if ($Js) { $r = Send "Runtime.evaluate" @{ expression = $Js; returnByValue = $true; userGesture = $true }; "JS: " + ($r.result.result.value | ConvertTo-Json -Compress) }
# -Click "css;;wait:800;;js:expr;;css2": trusted mouse clicks (Input.dispatchMouseEvent, so e.isTrusted is true) at each element's centre, waits, and JS probes
if ($Click) { foreach ($st in ($Click -split ';;')) { $st = $st.Trim(); if (-not $st) { continue }
  if ($st -match '^wait:(\d+)$') { Start-Sleep -Milliseconds ([int]$Matches[1]); continue }
  if ($st -match '^js:(.*)$') { $r = Send "Runtime.evaluate" @{ expression = $Matches[1]; returnByValue = $true }; "STEP JS: " + ($r.result.result.value | ConvertTo-Json -Compress); continue }
  $q = "(()=>{const e=document.querySelector(" + ($st | ConvertTo-Json) + ");if(!e)return null;e.scrollIntoView({block:'center',behavior:'instant'});const r=e.getBoundingClientRect();return JSON.stringify([r.left+r.width/2,r.top+r.height/2])})()"
  $r = Send "Runtime.evaluate" @{ expression = $q; returnByValue = $true }; $v = $r.result.result.value
  if (-not $v) { "STEP click: NOT FOUND $st"; continue }; $xy = $v | ConvertFrom-Json
  foreach ($t in 'mousePressed', 'mouseReleased') { [void](Send "Input.dispatchMouseEvent" @{ type = $t; x = $xy[0]; y = $xy[1]; button = 'left'; clickCount = 1 }) }
  "STEP click: $st" } }
Start-Sleep -Seconds $Wait
if ($Js2) { $r2 = Send "Runtime.evaluate" @{ expression = $Js2; returnByValue = $true; userGesture = $true }; Start-Sleep -Seconds 4; $r3 = Send "Runtime.evaluate" @{ expression = "JSON.stringify({log:window.__vlog||null, t:window.__va?window.__va.currentTime:null, paused:window.__va?window.__va.paused:null, rate:window.__va?window.__va.playbackRate:null})"; returnByValue = $true }; "LOG: " + $r3.result.result.value; "JS2: " + ($r2.result.result.value | ConvertTo-Json -Compress) }
$e = Send "Runtime.evaluate" @{ expression = "JSON.stringify(window.__labErr)"; returnByValue = $true }
"ERRORS: " + $e.result.result.value
$s = Send "Page.captureScreenshot" @{ format = "png" }
[IO.File]::WriteAllBytes($Out, [Convert]::FromBase64String($s.result.data))
"saved $Out"
$ws.Dispose()
Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -like "*labvshot_$Port*" } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
Start-Sleep -Milliseconds 800
Remove-Item $udd -Recurse -Force -ErrorAction SilentlyContinue   # keep disk usage low
