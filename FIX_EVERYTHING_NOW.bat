@echo off
title FIX EVERYTHING - Complete Website Fix
color 0A
echo ================================================
echo    COMPLETE FIX - Making Website Work
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/8] Verifying app directory structure...
if exist "app\layout.tsx" (echo ✓ app/layout.tsx exists) else (echo ❌ MISSING: app/layout.tsx)
if exist "app\page.tsx" (echo ✓ app/page.tsx exists) else (echo ❌ MISSING: app/page.tsx)
if exist "app\contact\page.tsx" (echo ✓ app/contact/page.tsx exists) else (echo ❌ MISSING: app/contact/page.tsx)
if exist "app\generators\page.tsx" (echo ✓ app/generators/page.tsx exists) else (echo ❌ MISSING: app/generators/page.tsx)

echo.
echo [2/8] Copying contact components to root components/...
if not exist "components\contact" mkdir "components\contact"
if exist "app\components\contact\" (
    xcopy "app\components\contact\*.*" "components\contact\" /E /I /Y /Q >nul 2>&1
    echo ✓ Contact components copied to components/contact/
) else (
    echo ⚠️  Source folder not found, checking if already copied...
    if exist "components\contact\SEOHead.jsx" (echo ✓ Contact components already in root) else (echo ❌ Contact components missing!)
)

echo.
echo [3/8] Fixing contact page imports...
powershell -Command "$f='app\contact\page.tsx'; if (Test-Path $f) { $c=[System.IO.File]::ReadAllText($f); $c=$c -replace '@/app/components/contact/','@/components/contact/'; [System.IO.File]::WriteAllText($f,$c); Write-Host '✓ Contact imports fixed' }"

echo.
echo [4/8] Verifying all critical files exist...
if exist "components\contact\SEOHead.jsx" (echo ✓ components/contact/SEOHead.jsx) else (echo ❌ Missing SEOHead.jsx)
if exist "app\lib\data\cumminsgenerators.ts" (echo ✓ app/lib/data/cumminsgenerators.ts) else (echo ❌ Missing cumminsgenerators.ts)
if exist "app\styles\diagnostics.css" (echo ✓ app/styles/diagnostics.css) else (echo ❌ Missing diagnostics.css)
if exist "app\componets\diagnostics\UniversalDiagnosticMachine.jsx" (echo ✓ UniversalDiagnosticMachine.jsx) else (echo ❌ Missing UniversalDiagnosticMachine.jsx)

echo.
echo [5/8] Checking tsconfig.json path mapping...
findstr /C:"@/*" tsconfig.json
echo ✓ Path mapping verified

echo.
echo [6/8] Cleaning build cache...
if exist ".next" rmdir /s /q ".next" >nul 2>&1
echo ✓ Cache cleaned

echo.
echo [7/8] Running production build...
echo.
call npm.cmd run build

if errorlevel 1 (
    echo.
    echo ================================================
    echo    ❌ BUILD FAILED
    echo ================================================
    echo.
    echo Check errors above. Common issues:
    echo - Missing component files
    echo - Incorrect import paths
    echo - TypeScript errors
    echo.
    pause
    exit /b 1
) else (
    echo.
    echo ================================================
    echo    ✅ BUILD SUCCESSFUL!
    echo ================================================
    echo.
    echo Website is ready for deployment!
    echo.
    echo Next steps:
    echo 1. Test locally: npm run start
    echo 2. Deploy to Vercel: vercel --prod
    echo.
)

echo.
pause


