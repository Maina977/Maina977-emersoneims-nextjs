@echo off
title Quick Fix - Move Contact Components to Root & Test Build
color 0B
echo ================================================
echo    QUICK FIX: Standardize Import Paths
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [Step 1/4] Creating components/contact at root...
if not exist "components\contact" mkdir "components\contact"
echo ✓ Done

echo.
echo [Step 2/4] Copying contact components to root...
if exist "app\components\contact\" (
    xcopy "app\components\contact\*.*" "components\contact\" /E /I /Y /Q
    echo ✓ Copied files
) else (
    echo ⚠️  Source folder not found, skipping copy
)

echo.
echo [Step 3/4] Fixing contact page imports...
powershell -Command "if (Test-Path 'app\contact\page.tsx') { $c = [System.IO.File]::ReadAllText('app\contact\page.tsx'); $c = $c -replace '@/app/components/contact/', '@/components/contact/'; [System.IO.File]::WriteAllText('app\contact\page.tsx', $c); Write-Host '✓ Fixed imports' } else { Write-Host '⚠️  Contact page not found' }"

echo.
echo [Step 4/4] Testing build...
echo.
call npm.cmd run build

if errorlevel 1 (
    echo.
    echo ================================================
    echo    ❌ BUILD FAILED
    echo ================================================
    echo.
    echo Check errors above for remaining issues.
) else (
    echo.
    echo ================================================
    echo    ✅ BUILD SUCCESSFUL!
    echo ================================================
    echo.
    echo You can now delete app\components\contact\ if desired
    echo (components\contact\ now contains the files)
)

echo.
pause


