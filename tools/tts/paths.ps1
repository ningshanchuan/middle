# Shared path discovery (dot-sourced). Works from .labtmp\tts\ and from science-lab\tools\tts\.
#   $Root = science-lab folder, $Work = .labtmp\tts (data, logs, lesson captures - never published)
if (-not $Root) {
  $h = $PSScriptRoot
  foreach ($c in @((Join-Path $h "..\.."), (Join-Path $h "..\..\science-lab"))) { if (Test-Path (Join-Path $c "shared\lab.js")) { $Root = (Resolve-Path $c).Path; break } }
  if (-not $Root) { throw "cannot find the science-lab folder from $h (pass -Root)" }
}
if (-not $Work) { $Work = Join-Path (Split-Path $Root) ".labtmp\tts" }
New-Item -ItemType Directory -Force $Work | Out-Null
$KeyFile = Join-Path $Root "OpenAI_key.txt"
