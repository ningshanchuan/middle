# Re-encode existing clips from their PCM masters (<Work>\pcm_<lang>\<key>.wav) at another bitrate. No API calls.
# Usage: powershell -ExecutionPolicy Bypass -File reencode.ps1 -Lang zh -Kbps 32 [-Workers 8]
#        (a clip without a master is left as it is; the manifest is rewritten at the end)
param([string]$Lang = "zh", [int]$Kbps = 32, [int]$Workers = 8, [int]$WorkerIndex = -1, [string]$Root = "", [string]$Work = "")
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot "paths.ps1")
$audioDir = Join-Path $Root "audio\$Lang"; $pcmDir = Join-Path $Work "pcm_$Lang"
$keys = @(Get-ChildItem $audioDir -Filter *.mp3 | Where-Object { $_.BaseName -match '^[0-9a-f]{8}$' -and (Test-Path (Join-Path $pcmDir ($_.BaseName + '.wav'))) } | ForEach-Object { $_.BaseName } | Sort-Object)
if ($WorkerIndex -ge 0) {
  Add-Type -AssemblyName System.Runtime.WindowsRuntime
  $null = [Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime]
  $null = [Windows.Media.Transcoding.MediaTranscoder, Windows.Media.Transcoding, ContentType = WindowsRuntime]
  $null = [Windows.Media.MediaProperties.MediaEncodingProfile, Windows.Media.MediaProperties, ContentType = WindowsRuntime]
  $ext = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 }
  $asOp = ($ext | Where-Object { $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
  $asProg = ($ext | Where-Object { $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncActionWithProgress`1' })[0]
  function Await($op, [Type]$t) { $task = $asOp.MakeGenericMethod($t).Invoke($null, @($op)); if (-not $task.Wait(120000)) { throw "WinRT timeout" }; $task.Result }
  function Convert-ToMp3([string]$wav, [string]$mp3) {
    $src = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($wav)) ([Windows.Storage.StorageFile])
    $dir = Await ([Windows.Storage.StorageFolder]::GetFolderFromPathAsync((Split-Path $mp3))) ([Windows.Storage.StorageFolder])
    $dst = Await ($dir.CreateFileAsync((Split-Path $mp3 -Leaf), [Windows.Storage.CreationCollisionOption]::ReplaceExisting)) ([Windows.Storage.StorageFile])
    $p = [Windows.Media.MediaProperties.MediaEncodingProfile]::CreateMp3([Windows.Media.MediaProperties.AudioEncodingQuality]::Low)
    $p.Audio.Bitrate = [uint32]($Kbps * 1000); $p.Audio.ChannelCount = 1; $p.Audio.SampleRate = [uint32]24000
    $prep = Await ((New-Object Windows.Media.Transcoding.MediaTranscoder).PrepareFileTranscodeAsync($src, $dst, $p)) ([Windows.Media.Transcoding.PrepareTranscodeResult])
    if (-not $prep.CanTranscode) { throw "cannot transcode: $($prep.FailureReason)" }
    $t = $asProg.MakeGenericMethod([double]).Invoke($null, @($prep.TranscodeAsync())); if (-not $t.Wait(120000)) { throw "transcode timeout" }
  }
  for ($i = $WorkerIndex; $i -lt $keys.Count; $i += $Workers) {
    $k = $keys[$i]; $out = Join-Path $audioDir "$k.mp3"; $part = Join-Path $audioDir "$k.part.mp3"
    try {
      Convert-ToMp3 (Join-Path $pcmDir "$k.wav") $part
      for ($w8 = 0; $w8 -lt 20; $w8++) { try { [IO.File]::Open($part, 'Open', 'Read', 'None').Dispose(); break } catch { Start-Sleep -Milliseconds 150 } }
      if ((Get-Item $part).Length -lt 400) { throw "tiny output" }
      Move-Item $part $out -Force; "OK $k"
    } catch { Remove-Item $part -Force -ErrorAction SilentlyContinue; "ERR $k $($_.Exception.Message)" }
  }
  exit 0
}
"re-encoding $($keys.Count) $Lang clips at $Kbps kbps with $Workers workers"
$procs = @(); for ($w = 0; $w -lt $Workers; $w++) {
  $a = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $PSCommandPath, '-Lang', $Lang, '-Kbps', $Kbps, '-Workers', $Workers, '-WorkerIndex', $w, '-Root', $Root, '-Work', $Work)
  $procs += Start-Process powershell -ArgumentList $a -RedirectStandardOutput (Join-Path $Work "re_w$w.log") -WindowStyle Hidden -PassThru
}
while (@($procs | Where-Object { -not $_.HasExited }).Count) { Start-Sleep 15 }
$ok = 0; $err = @(); foreach ($f in Get-ChildItem (Join-Path $Work "re_w*.log")) { foreach ($l in Get-Content $f.FullName) { if ($l -like 'OK *') { $ok++ } elseif ($l -like 'ERR *') { $err += $l } } }
"re-encoded $ok, errors $($err.Count)"; $err | Select-Object -First 5
& (Join-Path $PSScriptRoot "gen.ps1") -Lang $Lang -ManifestOnly -Kbps $Kbps
