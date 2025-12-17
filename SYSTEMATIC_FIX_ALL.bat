@echo off
title SYSTEMATIC FIX - All Import Paths
color 0C
echo ================================================
echo    SYSTEMATIC FIX - ALL IMPORT PATHS
echo    Fixing everything at once
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/6] Copying contact components to root components/...
if not exist "components\contact" mkdir "components\contact"
if exist "app\components\contact\" (
    xcopy "app\components\contact\*.*" "components\contact\" /E /I /Y /Q
    echo ✓ Contact components copied
) else (
    echo ⚠️  app\components\contact\ not found
)

echo.
echo [2/6] Fixing contact page imports...
powershell -Command "$f='app\contact\page.tsx'; if (Test-Path $f) { $c=[System.IO.File]::ReadAllText($f); $c=$c -replace '@/app/components/contact/','@/components/contact/'; [System.IO.File]::WriteAllText($f,$c); Write-Host '✓ Fixed' }"

echo.
echo [3/6] Fixing generators page imports...
powershell -Command "$f='app\generators\page.tsx'; if (Test-Path $f) { $c=[System.IO.File]::ReadAllText($f); $c=$c -replace '@/app/lib/data/','@/app/lib/data/'; [System.IO.File]::WriteAllText($f,$c); Write-Host '✓ Fixed' }"

echo.
echo [4/6] Fixing diagnostics page imports...
powershell -Command "$f='app\diagnostics\page.tsx'; if (Test-Path $f) { $c=[System.IO.File]::ReadAllText($f); $c=$c -replace '@/app/styles/','@/app/styles/'; [System.IO.File]::WriteAllText($f,$c); Write-Host '✓ Fixed' }"

echo.
echo [5/6] Verifying all critical files exist...
if exist "components\contact\SEOHead.jsx" (echo ✓ SEOHead) else (echo ❌ SEOHead missing)
if exist "app\lib\data\cumminsgenerators.ts" (echo ✓ cumminsgenerators) else (echo ❌ cumminsgenerators missing)
if exist "app\styles\diagnostics.css" (echo ✓ diagnostics.css) else (echo ❌ diagnostics.css missing)
if exist "app\componets\diagnostics\UniversalDiagnosticMachine.jsx" (echo ✓ UniversalDiagnosticMachine) else (echo ❌ UniversalDiagnosticMachine missing)

echo.
echo [6/6] Running build test...
echo.
call npm.cmd run build

pause















