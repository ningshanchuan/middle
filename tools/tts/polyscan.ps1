# Lists, for each polyphonic character, the words around it that polyfix.tsv does NOT cover (to review by eye).
param([string]$Lang = "zh", [string]$Root = "", [string]$Work = "", [int]$Top = 12)
. (Join-Path $PSScriptRoot "paths.ps1")
$chars = [IO.File]::ReadAllText((Join-Path $PSScriptRoot "polychars.txt"), [Text.Encoding]::UTF8).Trim()
$fix = @{}; $maxLen = 1
foreach ($l in [IO.File]::ReadAllLines((Join-Path $PSScriptRoot "polyfix.tsv"), [Text.Encoding]::UTF8)) { if ($l -match '^\s*#' -or -not $l.Trim()) { continue }; $p = $l -split "`t"; if ($p.Count -ge 3) { $fix[$p[0]] = 1; if ($p[0].Length -gt $maxLen) { $maxLen = $p[0].Length } } }
$ctx = @{}
foreach ($l in [IO.File]::ReadAllLines((Join-Path $Work "texts_$Lang.jsonl"), [Text.Encoding]::UTF8)) {
  if (-not $l.Trim()) { continue }
  $t = ($l | ConvertFrom-Json).text
  $cov = New-Object bool[] ($t.Length); $i = 0
  while ($i -lt $t.Length) { $hit = 0; for ($L = [Math]::Min($maxLen, $t.Length - $i); $L -ge 1; $L--) { if ($fix.ContainsKey($t.Substring($i, $L))) { $hit = $L; break } }; if ($hit) { for ($j = $i; $j -lt $i + $hit; $j++) { $cov[$j] = $true }; $i += $hit } else { $i++ } }
  for ($i = 0; $i -lt $t.Length; $i++) {
    $ch = [string]$t[$i]
    if ($chars.Contains($ch) -and -not $cov[$i]) {
      $a = [Math]::Max(0, $i - 2); $w = $t.Substring($a, [Math]::Min($t.Length, $i + 3) - $a)
      if (-not $ctx.ContainsKey($ch)) { $ctx[$ch] = @{} }
      $ctx[$ch][$w] = 1 + [int]$ctx[$ch][$w]
    }
  }
}
$sb = New-Object Text.StringBuilder
foreach ($ch in $chars.ToCharArray()) { $c = $ctx[[string]$ch]; if (-not $c) { continue }
  $tot = ($c.Values | Measure-Object -Sum).Sum
  [void]$sb.AppendLine("$ch ($tot): " + (($c.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First $Top | ForEach-Object { "$($_.Key)x$($_.Value)" }) -join '  ')) }
[IO.File]::WriteAllText((Join-Path $Work "polyscan_$Lang.txt"), $sb.ToString(), (New-Object Text.UTF8Encoding($false)))
