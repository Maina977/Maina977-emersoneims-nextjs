<# 
  EMERSON EIMS - Project Validation Script (Windows)
  
  Run BEFORE committing or deploying:
    .\scripts\Validate.ps1
  
  Checks:
    1. TypeScript type checking (zero errors)
    2. Vite production build (zero errors)  
    3. Python __init__.py naming (no init.py without __)
    4. Python syntax (all .py files parse)
    5. No cross-language file contamination
    6. No duplicate function exports
#>

$ErrorActionPreference = "Continue"
$root = Split-Path $PSScriptRoot -Parent
$errors = @()
$passed = 0

function Write-Check {
    param([string]$name, [bool]$ok, [string]$msg)
    if ($ok) {
        Write-Host "  [PASS] $name" -ForegroundColor Green
        $script:passed++
    } else {
        Write-Host "  [FAIL] $name - $msg" -ForegroundColor Red
        $script:errors += @{ Name = $name; Message = $msg }
    }
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  EMERSON EIMS - Project Validation" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# --- 1. TypeScript Type Check ---
Write-Host "> TypeScript Type Checking..." -ForegroundColor Yellow
Push-Location $root
try {
    $tsOutput = & npx tsc --noEmit 2>&1
    $tsOk = ($LASTEXITCODE -eq 0)
    $tsMsg = ($tsOutput | Select-Object -First 3 | Out-String).Trim()
    Write-Check -name "TypeScript (tsc --noEmit)" -ok $tsOk -msg $tsMsg
} catch {
    Write-Check -name "TypeScript (tsc --noEmit)" -ok $false -msg $_.Exception.Message
}
Pop-Location

# --- 2. Vite Build ---
Write-Host ""
Write-Host "> Vite Production Build..." -ForegroundColor Yellow
Push-Location (Join-Path $root "ai-borehole-analyzer")
try {
    $buildOutput = & npx vite build 2>&1
    $buildOk = ($LASTEXITCODE -eq 0)
    $buildMsg = ($buildOutput | Select-Object -Last 3 | Out-String).Trim()
    Write-Check -name "Vite build (ai-borehole-analyzer)" -ok $buildOk -msg $buildMsg
} catch {
    Write-Check -name "Vite build" -ok $false -msg $_.Exception.Message
}
Pop-Location

# --- 3. Python __init__.py Audit ---
Write-Host ""
Write-Host "> Python Package Structure..." -ForegroundColor Yellow
$backendApp = Join-Path $root "backend\app"
if (Test-Path $backendApp) {
    $badInits = Get-ChildItem $backendApp -Recurse -Filter "init.py" | Where-Object { $_.Name -eq "init.py" }
    $badCount = 0
    if ($null -ne $badInits) { $badCount = @($badInits).Count }
    $badMsg = "Found $badCount misnamed init.py files"
    Write-Check -name "No misnamed init.py files" -ok ($badCount -eq 0) -msg $badMsg
} else {
    Write-Check -name "Backend app directory exists" -ok $false -msg "backend/app not found"
}

# --- 4. Python Syntax ---
Write-Host ""
Write-Host "> Python Syntax Check..." -ForegroundColor Yellow
if (Test-Path $backendApp) {
    $pyFiles = Get-ChildItem $backendApp -Recurse -Filter "*.py"
    $syntaxErrors = 0
    foreach ($f in $pyFiles) {
        $null = python -c "import ast; ast.parse(open(r'$($f.FullName)', encoding='utf-8').read())" 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Host "    [FAIL] $($f.FullName)" -ForegroundColor Red
            $syntaxErrors++
        }
    }
    $pyCount = @($pyFiles).Count
    Write-Check -name "Python syntax ($pyCount files)" -ok ($syntaxErrors -eq 0) -msg "$syntaxErrors files with syntax errors"
}

# --- 5. File Hygiene ---
Write-Host ""
Write-Host "> File Hygiene..." -ForegroundColor Yellow

$tsInBackend = Get-ChildItem $backendApp -Recurse -Include "*.ts","*.tsx" -ErrorAction SilentlyContinue
$tsBackendCount = 0
if ($null -ne $tsInBackend) { $tsBackendCount = @($tsInBackend).Count }
Write-Check -name "No TypeScript in backend/" -ok ($tsBackendCount -eq 0) -msg "Found $tsBackendCount .ts files in Python backend"

$aiSrc = Join-Path $root "ai-borehole-analyzer\src"
$pyInFrontend = Get-ChildItem $aiSrc -Recurse -Filter "*.py" -ErrorAction SilentlyContinue
$pyFrontendCount = 0
if ($null -ne $pyInFrontend) { $pyFrontendCount = @($pyInFrontend).Count }
Write-Check -name "No Python in ai-borehole-analyzer/" -ok ($pyFrontendCount -eq 0) -msg "Found $pyFrontendCount .py files in frontend"

# --- 6. Duplicate Function Check ---
Write-Host ""
Write-Host "> Code Integrity..." -ForegroundColor Yellow
$rgFile = Join-Path $root "ai-borehole-analyzer\src\reportGenerator.ts"
if (Test-Path $rgFile) {
    $content = Get-Content $rgFile -Raw
    $pdfExports = [regex]::Matches($content, '(?m)^export\s+(async\s+)?function\s+generatePDFReport')
    Write-Check -name "No duplicate generatePDFReport" -ok ($pdfExports.Count -le 1) -msg "Found $($pdfExports.Count) declarations"
    
    $indexFile = Join-Path $root "ai-borehole-analyzer\src\index.tsx"
    if (Test-Path $indexFile) {
        $indexContent = Get-Content $indexFile -Raw
        $importMatch = [regex]::Match($indexContent, "import\s*\{([^}]+)\}\s*from\s*'\.\/reportGenerator'")
        if ($importMatch.Success) {
            $imports = $importMatch.Groups[1].Value -split ',' | ForEach-Object { $_.Trim() -replace '\s+as\s+\w+', '' } | Where-Object { $_ -notmatch '^type ' -and $_ -ne '' }
            $exportMatches = [regex]::Matches($content, '(?m)^export\s+(?:async\s+)?(?:function|class|const|let)\s+(\w+)')
            $exports = $exportMatches | ForEach-Object { $_.Groups[1].Value }
            $missing = $imports | Where-Object { $_ -notin $exports }
            $missingCount = 0
            if ($null -ne $missing) { $missingCount = @($missing).Count }
            $missingMsg = "Missing exports: $($missing -join ', ')"
            Write-Check -name "All imports from reportGenerator exist" -ok ($missingCount -eq 0) -msg $missingMsg
        }
    }
}

# --- SUMMARY ---
Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  RESULTS: $passed passed, $($errors.Count) errors" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

if ($errors.Count -gt 0) {
    Write-Host ""
    Write-Host "ERRORS:" -ForegroundColor Red
    foreach ($e in $errors) {
        Write-Host "   * $($e.Name): $($e.Message)" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "FIX THESE BEFORE COMMITTING OR DEPLOYING." -ForegroundColor Red
    exit 1
} else {
    Write-Host ""
    Write-Host "ALL CHECKS PASSED - Project is clean." -ForegroundColor Green
    Write-Host ""
    exit 0
}
