# Run one task with the local Codex CLI (bundled with the VS Code "openai.chatgpt" extension; default model from
# ~/.codex/config.toml, currently gpt-6.2-sol). The final answer goes to -Out; the full log to -Out + ".log".
# Usage: powershell -File codex_task.ps1 -PromptFile task.md -Out result.md [-Cd F:\Shanchuan\Biology_study\science-lab] [-Effort high]
param([Parameter(Mandatory)][string]$PromptFile, [Parameter(Mandatory)][string]$Out,
      [string]$Cd = 'F:\Shanchuan\Biology_study\science-lab', [string]$Effort = '', [string]$Sandbox = 'workspace-write')
$ext = Get-ChildItem "$env:USERPROFILE\.vscode\extensions" -Directory -Filter 'openai.chatgpt-*' | Sort-Object LastWriteTime -Descending | Select-Object -First 1
$cx = Join-Path $ext.FullName 'bin\windows-x86_64\codex.exe'
if (-not (Test-Path $cx)) { throw "codex.exe not found under $($ext.FullName)" }
$a = @('exec', '-C', $Cd, '-s', $Sandbox, '--add-dir', 'F:\Shanchuan\Biology_study\.labtmp', '-o', $Out)
if ($Effort) { $a += @('-c', "model_reasoning_effort=`"$Effort`"") }
Get-Content $PromptFile -Raw -Encoding UTF8 | & $cx @a - *> "$Out.log"
"exit $LASTEXITCODE; result: $Out"
