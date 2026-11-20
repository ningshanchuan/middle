# Phone-width sweep of every lesson page in one headless Chrome (iPhone-like 390x844, mobile, touch).
# For each page: horizontal overflow (document wider than the screen, or elements sticking out that no scroll box clips) + JS errors.
# Usage: powershell -File phone_sweep.ps1 [-Only "biology/dna,ela/x"] [-Lang en|zh] [-Out result.tsv] [-Port 9950] [-W 390]
param([string]$Only = "", [string]$Lang = "en", [string]$Out = "", [int]$Port = 9950, [int]$W = 390, [int]$H = 844, [int]$Wait = 3, [string]$ProbeJs = "")   # -ProbeJs "js": run your own probe instead; its value is written per page
$__jg = Join-Path $PSScriptRoot 'jobguard.ps1'; if (Test-Path $__jg) { . $__jg } else { try { (Get-Process -Id $PID).PriorityClass = 'Idle' } catch {} }   # idle CPU only; started Chrome/Codex die with this script
$site = 'F:\Shanchuan\Biology_study\science-lab'
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$udd = "F:\Shanchuan\Biology_study\.labtmp\labsweep_$Port"
$ct = 'F:\Shanchuan\Biology_study\.labtmp\chrometmp'; New-Item -ItemType Directory -Force $ct | Out-Null; $env:TEMP = $ct; $env:TMP = $ct
Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -like "*labsweep_$Port*" } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
if ($Only) { $pages = $Only.Split(',') | ForEach-Object { $_.Trim() } }
else {
  $cat = Get-Content "$site\shared\catalog.js" -Raw -Encoding UTF8; $pages = @(); $subj = ''
  foreach ($line in $cat -split "`n") { if ($line -match "^\s*\{\s*id:'([a-z]+)',\s*icon") { $subj = $Matches[1] } elseif ($line -match "\{id:'([a-z0-9-]+)',\s*std:") { $pages += "$subj/$($Matches[1])" } }
  $pages = @('index') + $pages
}
$pages = @($pages | Where-Object { Test-Path "$site\$_.html" })
$proc = Start-Process -FilePath $chrome -ArgumentList "--headless=new","--use-angle=swiftshader","--enable-unsafe-swiftshader","--mute-audio","--user-data-dir=$udd","--window-size=$W,$H","--remote-debugging-port=$Port","about:blank" -PassThru
$tabs = $null; for ($k = 0; $k -lt 30 -and -not $tabs; $k++) { Start-Sleep -Milliseconds 500; try { $tabs = Invoke-RestMethod "http://127.0.0.1:$Port/json" -TimeoutSec 2 } catch {} }
$ws = New-Object System.Net.WebSockets.ClientWebSocket
$ws.ConnectAsync([Uri]($tabs | Where-Object type -eq 'page' | Select-Object -First 1).webSocketDebuggerUrl, [Threading.CancellationToken]::None).Wait()
$script:id = 0
function Send($method, $params) {
  $script:id++; $b = [Text.Encoding]::UTF8.GetBytes((@{ id = $script:id; method = $method; params = $params } | ConvertTo-Json -Depth 6 -Compress))
  $ws.SendAsync([ArraySegment[byte]]$b, 'Text', $true, [Threading.CancellationToken]::None).Wait()
  while ($true) {
    $sb = New-Object Text.StringBuilder; $buf = New-Object byte[] 1048576
    do { $r = $ws.ReceiveAsync([ArraySegment[byte]]$buf, [Threading.CancellationToken]::None); if (-not $r.Wait(30000)) { throw "timeout" }; [void]$sb.Append([Text.Encoding]::UTF8.GetString($buf, 0, $r.Result.Count)) } while (-not $r.Result.EndOfMessage)
    $m = $sb.ToString() | ConvertFrom-Json; if ($m.id -eq $script:id) { return $m }
  }
}
[void](Send "Page.enable" @{})
[void](Send "Emulation.setDeviceMetricsOverride" @{ width = $W; height = $H; deviceScaleFactor = 2; mobile = $true; screenWidth = $W; screenHeight = $H })
[void](Send "Emulation.setTouchEmulationEnabled" @{ enabled = $true; maxTouchPoints = 5 })
[void](Send "Page.addScriptToEvaluateOnNewDocument" @{ source = "window.__labErr=[];addEventListener('error',e=>__labErr.push(e.message+' @'+(e.filename||'').split('/').pop()+':'+e.lineno));addEventListener('unhandledrejection',e=>__labErr.push('promise: '+e.reason));window.__jit=0;try{new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(e.startTime>2500&&!e.hadRecentInput&&!(e.sources||[]).every(s=>s.node&&s.node.closest&&s.node.closest('.lab-label3d,.stage')))__jit++})).observe({type:'layout-shift',buffered:true})}catch(e){}" })
$probe = @'
(()=>{const vw=document.documentElement.clientWidth,r=[];
document.querySelectorAll('body *').forEach(e=>{const b=e.getBoundingClientRect();if(b.width<=0||b.height<=0)return;
 if(b.right>vw+1||b.left<-1){let p=e.parentElement,clip=false;while(p&&p!==document.body){const s=getComputedStyle(p);if(/(auto|scroll|hidden|clip)/.test(s.overflowX)){clip=true;break}p=p.parentElement}
 const cs=getComputedStyle(e);if(!clip&&cs.position!=='fixed'&&cs.visibility!=='hidden')r.push(e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+(typeof e.className==='string'&&e.className?'.'+e.className.split(' ')[0]:'')+'['+Math.round(b.left)+'..'+Math.round(b.right)+']')}});
return JSON.stringify({sw:document.documentElement.scrollWidth,vw,n:r.length,el:r.slice(0,4),err:(window.__labErr||[]).slice(0,3).concat(window.__jit>4?['JUMPING: '+window.__jit+' layout shifts after load']:[])})})()
'@
if ($ProbeJs) { $probe = $ProbeJs }
$rows = @("page`tscrollWidth`toverflowEls`terrors`tsample")
foreach ($p in $pages) {
  $url = "file:///" + ($site -replace '\\','/') + "/$p.html" + $(if ($Lang -eq 'zh') { '?lang=zh' } else { '' })
  try {
    [void](Send "Page.navigate" @{ url = $url }); Start-Sleep -Seconds $Wait
    if ($ProbeJs) { $rows += "$p`t" + (Send "Runtime.evaluate" @{ expression = $probe; returnByValue = $true }).result.result.value; continue }
    $v = (Send "Runtime.evaluate" @{ expression = $probe; returnByValue = $true }).result.result.value | ConvertFrom-Json
    $rows += "$p`t$($v.sw)`t$($v.n)`t$(@($v.err).Count)`t$((@($v.el) + @($v.err)) -join ' | ')"
  } catch { $rows += "$p`t?`t?`t?`t$($_.Exception.Message)" }
}
$ws.Dispose(); Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -like "*labsweep_$Port*" } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
Start-Sleep -Milliseconds 800; Remove-Item $udd -Recurse -Force -ErrorAction SilentlyContinue
if ($Out) { $rows | Set-Content $Out -Encoding UTF8 }
$bad = @($rows | Select-Object -Skip 1 | Where-Object { $c = $_.Split("`t"); $c[1] -ne "$W" -or $c[2] -ne '0' -or $c[3] -ne '0' })
"pages: $($pages.Count)  with problems: $($bad.Count)"
$bad



