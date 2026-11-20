# Search-engine basics for Genius Classroom (shanchuan.org/middle).
# For every published lesson page (tracked in git, listed in shared/catalog.js) it writes a marked block after </title>:
#   meta description (EN + 中文, from the catalog), canonical URL, hreflang alternates (en = page, zh-Hans = page?lang=zh),
#   Open Graph / Twitter tags, and a schema.org LearningResource (JSON-LD). The <title> gets the Chinese name and the site.
# It also writes sitemap.xml (every page in both languages, lastmod from git). Re-run after adding or renaming lessons.
# Pages whose working copy differs from the last commit are skipped (their unreviewed edits must not be published with this).
# Usage: powershell -ExecutionPolicy Bypass -File tools\seo\seo.ps1 [-All] [-DryRun]
param([switch]$All, [switch]$DryRun)
$ErrorActionPreference = 'Stop'
$site = Split-Path (Split-Path $PSScriptRoot); $base = 'https://shanchuan.org/middle/'
$enc = New-Object Text.UTF8Encoding($false)
$esc = { param($s) ([string]$s).Replace('&', '&amp;').Replace('"', '&quot;').Replace('<', '&lt;').Replace('>', '&gt;') }
Push-Location $site
try {
  $cat = [IO.File]::ReadAllText("$site\shared\catalog.js", [Text.Encoding]::UTF8)
  $subj = @{}; $topics = [ordered]@{}; $sid = $null
  $q = "((?:[^'\\]|\\.)*)"
  foreach ($line in $cat -split "`n") {
    if ($line -match "^\s*\{\s*id\s*:\s*'([a-z]+)'\s*,\s*icon\s*:.*?\ben\s*:\s*'$q'\s*,\s*zh\s*:\s*'$q'") { $sid = $Matches[1]; $subj[$sid] = @{ en = $Matches[2]; zh = $Matches[3] }; continue }
    if ($sid -and $line -match "^\s*\{\s*id\s*:\s*'([\w-]+)'\s*,\s*std\s*:.*?\ben\s*:\s*'$q'\s*,\s*zh\s*:\s*'$q'") {
      $id = $Matches[1]; $t = @{ s = $sid; id = $id; en = $Matches[2]; zh = $Matches[3]; den = ''; dzh = '' }
      if ($line -match "\bd\s*:\s*\{\s*en\s*:\s*'$q'\s*,\s*zh\s*:\s*'$q'") { $t.den = $Matches[1]; $t.dzh = $Matches[2] }
      $topics["$sid/$id"] = $t
    }
  }
  # the head's own <title> only (pages also contain SVG <title> elements inside scripts)
  $setTitle = { param($h, $rep) $he = $h.IndexOf('</head>'); $m = ([regex]'<title>[^<]*</title>').Match($h); if (-not $m.Success -or $he -lt 0 -or $m.Index -gt $he) { return $h }; $h.Substring(0, $m.Index) + $rep + $h.Substring($m.Index + $m.Length) }
  $unq = { param($s) ([string]$s) -replace "\\'", "'" -replace '\\\\', '\' }
  $tracked = @(git ls-files '*/*.html' | ForEach-Object { $_ -replace '\.html$', '' })
  $dirty = @(git diff --name-only -- '*.html' | ForEach-Object { ($_ -replace '^Biology_study/science-lab/', '') -replace '\.html$', '' })
  $pages = @($tracked | Where-Object { $topics.Contains($_) })
  $done = 0; $skipped = @()
  $start = '<!-- seo:start (tools/seo/seo.ps1) -->'; $end = '<!-- seo:end -->'
  foreach ($p in $pages) {
    if (-not $All -and $dirty -contains $p) { $skipped += $p; continue }
    $t = $topics[$p]; $url = "$base$p.html"
    $en = & $unq $t.en; $zh = & $unq $t.zh; $sEn = $subj[$t.s].en; $sZh = $subj[$t.s].zh
    $desc = (((& $unq $t.den) + ' ' + (& $unq $t.dzh)).Trim()); if (-not $desc) { $desc = "$en · $zh" }
    $desc = "$desc Free bilingual (English · 中文) interactive $sEn lesson for middle school. 免费中英双语初中$sZh互动课。"
    $ld = [ordered]@{ '@context' = 'https://schema.org'; '@type' = 'LearningResource'; name = $en; alternateName = $zh; description = $desc; url = $url
      inLanguage = @('en', 'zh-Hans'); educationalLevel = 'Middle school (grades 6-9)'; learningResourceType = 'Interactive lesson'; isAccessibleForFree = $true
      about = "$sEn · $sZh"; provider = [ordered]@{ '@type' = 'Organization'; name = 'Genius Classroom 天才课堂'; url = $base } }
    $json = ($ld | ConvertTo-Json -Depth 4 -Compress).Replace('</', '<\/')
    $block = @($start,
      "<meta name=""description"" content=""$(& $esc $desc)"">",
      "<link rel=""alternate"" hreflang=""en"" href=""$url"">",
      "<link rel=""alternate"" hreflang=""zh-Hans"" href=""${url}?lang=zh"">",
      "<link rel=""alternate"" hreflang=""x-default"" href=""$url"">",
      '<meta property="og:type" content="website"><meta property="og:site_name" content="Genius Classroom 天才课堂">',
      "<meta property=""og:title"" content=""$(& $esc "$en · $zh")""><meta property=""og:description"" content=""$(& $esc $desc)""><meta property=""og:url"" content=""$url"">",
      '<meta property="og:locale" content="en_US"><meta property="og:locale:alternate" content="zh_CN"><meta name="twitter:card" content="summary">',
      "<script type=""application/ld+json"">$json</script>",
      $end) -join "`n"
    $f = "$site\$p.html"; $h = [IO.File]::ReadAllText($f, [Text.Encoding]::UTF8); $o = $h
    $h = [regex]::Replace($h, '\r?\n?' + [regex]::Escape($start) + '[\s\S]*?' + [regex]::Escape($end), '')
    $title = "$en · $zh | Genius Classroom 天才课堂"
    $h = & $setTitle $h "<title>$(& $esc $title)</title>`n$block"
    if ($h -ne $o -and -not $DryRun) { [IO.File]::WriteAllText($f, $h, $enc) }
    $done++
  }
  # home page
  $hd = 'Genius Classroom 天才课堂: free bilingual (English · 中文) interactive middle-school lessons — science, math, Chinese language and literature, history, geography, art and music — for the US (Georgia) and Chinese curricula, with 3D models, simulations, real photos and read-aloud. 免费中英双语初中互动课：理科、数学、语文、历史、地理、美术与音乐。'
  $hld = ([ordered]@{ '@context' = 'https://schema.org'; '@type' = 'WebSite'; name = 'Genius Classroom 天才课堂'; url = $base; inLanguage = @('en', 'zh-Hans'); description = $hd } | ConvertTo-Json -Compress).Replace('</', '<\/')
  $hblock = @($start, "<meta name=""description"" content=""$(& $esc $hd)"">",
    "<link rel=""alternate"" hreflang=""en"" href=""$base""><link rel=""alternate"" hreflang=""zh-Hans"" href=""${base}?lang=zh""><link rel=""alternate"" hreflang=""x-default"" href=""$base"">",
    '<meta property="og:type" content="website"><meta property="og:site_name" content="Genius Classroom 天才课堂"><meta property="og:title" content="Genius Classroom 天才课堂">',
    "<meta property=""og:description"" content=""$(& $esc $hd)""><meta property=""og:url"" content=""$base""><meta name=""twitter:card"" content=""summary"">",
    "<script type=""application/ld+json"">$hld</script>", $end) -join "`n"
  if ($All -or $dirty -notcontains 'index') {
    $f = "$site\index.html"; $h = [IO.File]::ReadAllText($f, [Text.Encoding]::UTF8); $o = $h
    $h = [regex]::Replace($h, '\r?\n?' + [regex]::Escape($start) + '[\s\S]*?' + [regex]::Escape($end), '')
    $h = & $setTitle $h "<title>Genius Classroom 天才课堂 · Free bilingual middle-school lessons</title>`n$hblock"
    if ($h -ne $o -and -not $DryRun) { [IO.File]::WriteAllText($f, $h, $enc) }
  }
  # sitemap: home + every page, both languages
  $sb = New-Object Text.StringBuilder
  [void]$sb.AppendLine('<?xml version="1.0" encoding="UTF-8"?>')
  [void]$sb.AppendLine('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">')
  $add = { param($loc, $last)
    foreach ($v in @($loc, "$loc?lang=zh")) {
      [void]$sb.AppendLine("  <url><loc>$(& $esc $v)</loc>$(if ($last) { "<lastmod>$last</lastmod>" })")
      [void]$sb.AppendLine("    <xhtml:link rel=""alternate"" hreflang=""en"" href=""$(& $esc $loc)""/><xhtml:link rel=""alternate"" hreflang=""zh-Hans"" href=""$(& $esc "$loc?lang=zh")""/><xhtml:link rel=""alternate"" hreflang=""x-default"" href=""$(& $esc $loc)""/></url>") } }
  & $add $base (git log -1 --format=%cs -- index.html)
  foreach ($p in $pages) { & $add "$base$p.html" (git log -1 --format=%cs -- "$p.html") }
  [void]$sb.AppendLine('</urlset>')
  if (-not $DryRun) { [IO.File]::WriteAllText("$site\sitemap.xml", $sb.ToString(), $enc) }
  "pages tagged: $done; skipped (uncommitted edits): $($skipped.Count) $($skipped -join ', '); sitemap URLs: $(2 * ($pages.Count + 1))"
} finally { Pop-Location }
