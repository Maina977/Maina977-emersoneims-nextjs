@echo off
title Fix All Import Paths After Reorganization
color 0B
echo ================================================
echo    FIXING ALL IMPORT PATHS
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/4] Fixing contact page imports...
powershell -Command "(Get-Content 'app\contact\page.tsx') -replace '@/components/contact/', '@/app/components/contact/' | Set-Content 'app\contact\page.tsx'"
echo ✓ Contact page fixed

echo.
echo [2/4] Verifying data files exist...
if exist "app\lib\data\cumminsgenerators.ts" (echo ✓ cumminsgenerators.ts exists) else (echo ❌ MISSING: cumminsgenerators.ts)
if exist "app\lib\data\generatorservices.ts" (echo ✓ generatorservices.ts exists) else (echo ❌ MISSING: generatorservices.ts)
if exist "app\styles\diagnostics.css" (echo ✓ diagnostics.css exists) else (echo ❌ MISSING: diagnostics.css)

echo.
echo [3/4] All other imports should use @/componets/ (typo folder exists)
echo ✓ Service, diagnostics, generators use @/componets/ (correct)

echo.
echo [4/4] Running build test...
call npm.cmd run build
if errorlevel 1 (
    echo.
    echo ❌ Build failed - check errors above
) else (
    echo.
    echo ✅ BUILD SUCCESSFUL!
)

echo.
pause
