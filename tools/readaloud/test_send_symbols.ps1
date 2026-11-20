$ErrorActionPreference = 'Stop'

# Load the production function without invoking the content PC export.
$exporter = Join-Path $PSScriptRoot 'export_jobs.ps1'
$tokens = $null
$parseErrors = $null
$ast = [System.Management.Automation.Language.Parser]::ParseFile($exporter, [ref]$tokens, [ref]$parseErrors)
if ($parseErrors) { throw ($parseErrors -join "`n") }
$definition = $ast.Find({
  param($node)
  $node -is [System.Management.Automation.Language.FunctionDefinitionAst] -and $node.Name -eq 'Convert-SendText'
}, $false)
if (-not $definition) { throw 'Convert-SendText was not found in export_jobs.ps1.' }
. ([scriptblock]::Create($definition.Extent.Text))

$cases = @(
  @{ Name = 'Chinese step'; Lang = 'zh'
     Input = '先做好临时装片（第①步）。'
     Expected = '先做好临时装片（第一步）。' }
  @{ Name = 'Chinese transcript list'; Lang = 'zh'
     Input = '细胞学说及其发展历程。① 所有生物都由一个或多个细胞构成；② 细胞是结构和功能的基本单位；③ 所有细胞都来自已有的细胞。'
     Expected = '细胞学说及其发展历程。一、所有生物都由一个或多个细胞构成；二、细胞是结构和功能的基本单位；三、所有细胞都来自已有的细胞。' }
  @{ Name = 'Chinese two-digit numbering'; Lang = 'zh'
     Input = '第⑩步；⑪ 接着做；⑲ 再做；⑳ 最后做。'
     Expected = '第十步；十一、接着做；十九、再做；二十、最后做。' }
  @{ Name = 'English step'; Lang = 'en'
     Input = 'First make the wet mount (step ①).'
     Expected = 'First make the wet mount (step one).' }
  @{ Name = 'English lists and uppercase step'; Lang = 'en'
     Input = '① Mount. ② Observe. ⑳ Finish with STEP ⑳.'
     Expected = 'One: Mount. Two: Observe. Twenty: Finish with STEP twenty.' }
  @{ Name = 'Chinese arithmetic'; Lang = 'zh'
     Input = '红＋黄＝橙；黄＋蓝＝绿；蓝＋红＝紫。'
     Expected = '红加黄等于橙；黄加蓝等于绿；蓝加红等于紫。' }
  @{ Name = 'English arithmetic and spaces'; Lang = 'en'
     Input = '  2  ＋  3  ＝5  '
     Expected = '2 plus 3 equals 5' }
  @{ Name = 'Chinese printing abbreviation'; Lang = 'zh'
     Input = '印刷（CMY＋K）：青、品红、黄＋黑。'
     Expected = '印刷，C M Y 加 K：青、品红、黄加黑。' }
  @{ Name = 'Chinese abbreviation before a full stop'; Lang = 'zh'
     Input = '内质网（ER）。'
     Expected = '内质网，E R。' }
  @{ Name = 'Chinese abbreviation with a digit'; Lang = 'zh'
     Input = '二氧化碳（CO2）是一种气体。'
     Expected = '二氧化碳，C O 2，是一种气体。' }
  @{ Name = 'Chinese abbreviations in ASCII parentheses'; Lang = 'zh'
     Input = '色光（RGB）与印刷(CMY＋K) 。'
     Expected = '色光，R G B，与印刷，C M Y 加 K。' }
  @{ Name = 'Chinese adjacent brackets and punctuation spacing'; Lang = 'zh'
     Input = '细胞 （结构），色光（RGB）（CMY＋K）。'
     Expected = '细胞（结构），色光，R G B，C M Y 加 K。' }
  @{ Name = 'Chinese bracket length and content limits'; Lang = 'zh'
     Input = '（ABC123）、（ABCD123）、（CMY加K）、（细胞）。'
     Expected = '，A B C 1 2 3、（ABCD123）、（CMY加K）、（细胞）。' }
  @{ Name = 'English abbreviation in brackets'; Lang = 'en'
     Input = 'Endoplasmic reticulum (ER) and carbon dioxide (CO2).'
     Expected = 'Endoplasmic reticulum (ER) and carbon dioxide (CO2).' }
  @{ Name = 'Chinese ASCII tilde range'; Lang = 'zh'
     Input = '每年 3~5 次'
     Expected = '每年 3到5 次' }
  @{ Name = 'Chinese full-width tilde range and approximation'; Lang = 'zh'
     Input = '每年 3 ～ 5 次，～20 人参加～。'
     Expected = '每年 3到5 次，约20 人参加。' }
  @{ Name = 'English tilde ranges and approximation'; Lang = 'en'
     Input = '3～5 or 7~9 times over ~20 days~.'
     Expected = '3 to 5 or 7 to 9 times over about 20 days.' }
  @{ Name = 'English duplicate about'; Lang = 'en'
     Input = 'about ~20 km'
     Expected = 'about 20 km' }
  @{ Name = 'Chinese power and less-than'; Lang = 'zh'
     Input = 'a^2<10 。'
     Expected = 'a 的 2 次方小于10。' }
  @{ Name = 'English power and less-than'; Lang = 'en'
     Input = 'x^2 < 10'
     Expected = 'x to the power of 2 less than 10' }
  @{ Name = 'Plain transcript stays unchanged'; Lang = 'zh'
     Input = '细胞是生物体结构和功能的基本单位。'
     Expected = '细胞是生物体结构和功能的基本单位。' }
  @{ Name = 'Chinese range after a number unit'; Lang = 'zh'
     Input = '科罗拉多河用了约 500 万~600 万年切出峡谷。'
     Expected = '科罗拉多河用了约 500 万到600 万年切出峡谷。' }
  @{ Name = 'English quotes and ellipsis keep their spaces'; Lang = 'en'
     Input = 'Robert Hooke named them “cells”. The vesicle moves from the … (organelle) to the Golgi.'
     Expected = 'Robert Hooke named them “cells”. The vesicle moves from the … (organelle) to the Golgi.' }
)

$failures = 0
foreach ($case in $cases) {
  $actual = Convert-SendText $case.Input $case.Lang
  if ($actual -ceq $case.Expected) {
    Write-Output "PASS $($case.Name)"
  } else {
    $failures++
    Write-Output "FAIL $($case.Name)"
    Write-Output "  Expected [$($case.Expected)]"
    Write-Output "  Actual   [$actual]"
  }
}
Write-Output "$($cases.Count - $failures)/$($cases.Count) cases passed."
if ($failures) { exit 1 }
