@echo off
title Safe Import Fix - Moving Contact Components to Root
color 0B
echo ================================================
echo    SAFE IMPORT FIX
echo    Moving contact components to root for consistency
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/4] Creating components/contact directory at root...
if not exist "components\contact" mkdir "components\contact"
echo ✓ Directory created

echo.
echo [2/4] Copying contact components from app/components/contact/ to components/contact/...
xcopy "app\components\contact\*" "components\contact\" /E /I /Y
if errorlevel 1 (
    echo ❌ Copy failed
    pause
    exit /b 1
)
echo ✓ Files copied

echo.
echo [3/4] Updating contact page imports...
powershell -Command "$c = Get-Content 'app\contact\page.tsx' -Raw; $c = $c -replace '@/app/components/contact/', '@/components/contact/'; Set-Content 'app\contact\page.tsx' -Value $c"
echo ✓ Imports updated

echo.
echo [4/4] Testing build...
call npm.cmd run build
if errorlevel 1 (
    echo.
    echo ⚠️  Build still has errors - check output above
    echo.
    echo To revert: Delete components\contact\ folder
) else (
    echo.
    echo ✅ BUILD SUCCESSFUL!
    echo.
    echo You can now safely delete app\components\contact\ if build works
)

echo.
pause





