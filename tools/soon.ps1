# Flag catalog topics whose lesson file doesn't exist yet with soon:1 (and unflag built ones).
# A lesson counts as built only when its file is tracked/staged in git (git add it first), so half-written files never get a live card.
# Usage: git add <lesson files>; powershell -ExecutionPolicy Bypass -File tools/soon.ps1
$root = Split-Path $PSScriptRoot
$f = Join-Path $root 'shared\catalog.js'
$t = [IO.File]::ReadAllText($f, [Text.Encoding]::UTF8)
$tracked = @{}; git -C $root ls-files | ForEach-Object { $tracked[$_] = 1 }
$sid = ''; $soon = 0; $out = New-Object Text.StringBuilder
foreach ($line in $t -split "`n") {
  if ($line -match "^\s*\{ id:'(\w+)', icon") { $sid = $Matches[1] }
  if ($line -match "^(\s*)\{id:'([\w-]+)', (soon:1, )?(.*)$") {
    $ind = $Matches[1]; $tid = $Matches[2]; $rest = $Matches[4]
    $exists = $tracked.ContainsKey("$sid/$tid.html")
    if ($exists) { $line = "$ind{id:'$tid', $rest" } else { $line = "$ind{id:'$tid', soon:1, $rest"; $soon++; "soon: $sid/$tid" }
  }
  [void]$out.Append($line + "`n")
}
$s = $out.ToString(); $s = $s.Substring(0, $s.Length - 1)
[IO.File]::WriteAllText($f, $s, (New-Object Text.UTF8Encoding $false))
"$soon topics flagged as coming soon"
