@echo off
title DIRECT FIX - All Import Paths Based on Actual File Locations
color 0A
echo ================================================
echo    DIRECT FIX - ALL IMPORTS
echo    Based on ACTUAL file locations
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo Step 1: Copying contact components to root (if needed)...
if not exist "components\contact" mkdir "components\contact"
if exist "app\components\contact\" (
    xcopy "app\components\contact\*.*" "components\contact\" /E /I /Y /Q >nul 2>&1
    echo ✓ Contact components ready
)

echo.
echo Step 2: Fixing ALL import paths in ALL files...
echo.

REM Fix contact page
powershell -Command "$f='app\contact\page.tsx'; if (Test-Path $f) { $c=[System.IO.File]::ReadAllText($f); $c=$c -replace '@/app/components/contact/','@/components/contact/'; [System.IO.File]::WriteAllText($f,$c); Write-Host '✓ Contact page' }"

REM Fix generators page - data files are in app/lib/data/
powershell -Command "$f='app\generators\page.tsx'; if (Test-Path $f) { $c=[System.IO.File]::ReadAllText($f); if ($c -match '@/lib/data/') { $c=$c -replace '@/lib/data/','@/app/lib/data/'; [System.IO.File]::WriteAllText($f,$c); Write-Host '✓ Generators page' } }"

REM Fix diagnostics page - styles are in app/styles/
powershell -Command "$f='app\diagnostics\page.tsx'; if (Test-Path $f) { $c=[System.IO.File]::ReadAllText($f); if ($c -match '@/styles/') { $c=$c -replace '@/styles/','@/app/styles/'; [System.IO.File]::WriteAllText($f,$c); Write-Host '✓ Diagnostics page' } }"

echo.
echo Step 3: Verifying critical files exist...
if exist "components\contact\SEOHead.jsx" (echo ✓ components/contact/SEOHead.jsx) else (echo ❌ Missing: components/contact/SEOHead.jsx)
if exist "app\lib\data\cumminsgenerators.ts" (echo ✓ app/lib/data/cumminsgenerators.ts) else (echo ❌ Missing: app/lib/data/cumminsgenerators.ts)
if exist "app\styles\diagnostics.css" (echo ✓ app/styles/diagnostics.css) else (echo ❌ Missing: app/styles/diagnostics.css)
if exist "app\componets\diagnostics\UniversalDiagnosticMachine.jsx" (echo ✓ app/componets/diagnostics/UniversalDiagnosticMachine.jsx) else (echo ❌ Missing: UniversalDiagnosticMachine.jsx)

echo.
echo Step 4: Testing build...
echo.
call npm.cmd run build 2>&1 | findstr /C:"error" /C:"Error" /C:"Failed" /C:"SUCCESS" /C:"Compiled"

if errorlevel 1 (
    echo.
    echo ❌ BUILD FAILED - See errors above
) else (
    echo.
    echo ✅ BUILD SUCCESSFUL!
)

pause





