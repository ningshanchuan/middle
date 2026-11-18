# Merge the per-lesson captures into one list of unique texts: <Work>\texts_<lang>.jsonl  ({key,text,via,lessons})
# plus a per-lesson coverage table <Work>\coverage_<lang>.tsv.
# Usage: powershell -ExecutionPolicy Bypass -File merge.ps1 [-Lang zh]
param([string]$Lang = "zh", [string]$Root = "", [string]$Work = "")
. (Join-Path $PSScriptRoot "paths.ps1")
$utf8 = New-Object Text.UTF8Encoding($false)
$byKey = [ordered]@{}; $cov = New-Object Collections.Generic.List[string]
$cov.Add("lesson`tzh_texts`tall_texts`tspeak_calls`tsec`tclicks`tphase`tnote")
foreach ($f in Get-ChildItem (Join-Path $Work "lessons") -Filter "*.$Lang.json" | Sort-Object Name) {
  $j = [IO.File]::ReadAllText($f.FullName, [Text.Encoding]::UTF8) | ConvertFrom-Json
  $id = "$($j.s)/$($j.t)"
  if (-not (Test-Path (Join-Path $Root "$($j.s)\$($j.t).html"))) { continue }
  $nz = 0
  foreach ($x in @($j.texts)) {
    if ($x.lang -ne $Lang) { continue }
    $nz++
    if (-not $byKey.Contains($x.key)) { $byKey[$x.key] = [pscustomobject]@{ key = $x.key; text = $x.text; via = $x.via; raw = $x.raw; lessons = New-Object Collections.Generic.List[string] } }
    if (-not $byKey[$x.key].lessons.Contains($id)) { $byKey[$x.key].lessons.Add($id) }
  }
  $m = $j.meta; $note = @()
  if ($m -and $m.err) { $note += ($m.err -join '; ') }
  if ($m -and $m.js) { $note += ('JS: ' + ($m.js -join '; ')) }
  if ($m -and $m.lost) { $note += 'page navigated away' }
  $cov.Add(("{0}`t{1}`t{2}`t{3}`t{4}`t{5}`t{6}`t{7}" -f $id, $nz, @($j.texts).Count, $m.calls, $j.sec, $m.clicks, $m.phase, (($note -join ' | ') -replace "[`t`r`n]", ' ')))
}
$lines = foreach ($v in $byKey.Values) { $o = [ordered]@{ key = $v.key; text = $v.text; via = $v.via; lessons = @($v.lessons) }; if ($v.raw) { $o.raw = $v.raw }; [pscustomobject]$o | ConvertTo-Json -Compress -Depth 4 }
[IO.File]::WriteAllLines((Join-Path $Work "texts_$Lang.jsonl"), [string[]]@($lines), $utf8)
[IO.File]::WriteAllLines((Join-Path $Work "coverage_$Lang.tsv"), [string[]]$cov, $utf8)
$chars = 0; foreach ($v in $byKey.Values) { $chars += $v.text.Length }
"merged: $($cov.Count - 1) lessons, $($byKey.Count) unique $Lang texts, $chars characters -> $Work\texts_$Lang.jsonl"
