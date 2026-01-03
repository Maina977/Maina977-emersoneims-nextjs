@echo off
title Final Fix - Move Contact Components to Root & Test Build
color 0B
echo ================================================
echo    FINAL FIX: Move Contact Components to Root
echo    Matches existing structure (components/ at root)
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [Step 1/5] Creating components/contact at root...
if not exist "components\contact" mkdir "components\contact"
echo ✓ Done

echo.
echo [Step 2/5] Copying contact components from app/components/contact/ to components/contact/...
if exist "app\components\contact\" (
    xcopy "app\components\contact\*.*" "components\contact\" /E /I /Y /Q
    echo ✓ Files copied successfully
) else (
    echo ❌ Source folder app\components\contact\ not found!
    pause
    exit /b 1
)

echo.
echo [Step 3/5] Fixing contact page imports...
powershell -Command "if (Test-Path 'app\contact\page.tsx') { $c = [System.IO.File]::ReadAllText('app\contact\page.tsx'); $c = $c -replace '@/app/components/contact/', '@/components/contact/'; [System.IO.File]::WriteAllText('app\contact\page.tsx', $c); Write-Host '✓ Contact page imports fixed' } else { Write-Host '❌ Contact page not found' }"

echo.
echo [Step 4/5] Verifying generators and diagnostics paths...
powershell -Command "if (Test-Path 'app\generators\page.tsx') { $c = [System.IO.File]::ReadAllText('app\generators\page.tsx'); $c = $c -replace '@/app/lib/data/', '@/lib/data/'; [System.IO.File]::WriteAllText('app\generators\page.tsx', $c); Write-Host '✓ Generators page fixed' }"
powershell -Command "if (Test-Path 'app\diagnostics\page.tsx') { $c = [System.IO.File]::ReadAllText('app\diagnostics\page.tsx'); $c = $c -replace '@/app/styles/', '@/styles/'; [System.IO.File]::WriteAllText('app\diagnostics\page.tsx', $c); Write-Host '✓ Diagnostics page fixed' }"

echo.
echo [Step 5/5] Testing build...
echo.
call npm.cmd run build

if errorlevel 1 (
    echo.
    echo ================================================
    echo    ❌ BUILD FAILED - Check errors above
    echo ================================================
    echo.
    echo Note: Contact components are now in components\contact\
    echo You can delete app\components\contact\ after build succeeds
) else (
    echo.
    echo ================================================
    echo    ✅ BUILD SUCCESSFUL!
    echo ================================================
    echo.
    echo ✓ Contact components moved to components\contact\
    echo ✓ All imports resolved correctly
    echo.
    echo Safe to delete: app\components\contact\
)

echo.
pause















