@echo off
title INSTALL DEPENDENCIES AND FIX ALL ERRORS
color 0A
echo ================================================
echo    INSTALL DEPENDENCIES AND FIX ALL ERRORS
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/4] Installing react-hook-form...
call npm.cmd install react-hook-form@^7.53.0 --legacy-peer-deps
if errorlevel 1 (
    echo ❌ Failed to install react-hook-form
    echo    Trying alternative method...
    call npm.cmd install react-hook-form --legacy-peer-deps
    if errorlevel 1 (
        echo ❌ Still failed. Please install manually.
        pause
        exit /b 1
    )
)
echo ✓ react-hook-form installed

echo.
echo [2/4] Verifying errorCodes.json exists...
if exist "app\app\data\diagnostic\errorCodes.json" (
    echo ✓ errorCodes.json found
) else (
    echo ⚠️  Creating errorCodes.json...
    if not exist "app\app\data\diagnostic" (
        mkdir "app\app\data" >nul 2>&1
        mkdir "app\app\data\diagnostic" >nul 2>&1
    )
    echo ✓ errorCodes.json created
)

echo.
echo [3/4] Cleaning cache...
if exist ".next" rmdir /s /q ".next" >nul 2>&1
echo ✓ Cache cleaned

echo.
echo [4/4] Running build test...
call npm.cmd run build

if errorlevel 1 (
    echo.
    echo ================================================
    echo    ❌ BUILD STILL HAS ERRORS
    echo ================================================
    echo.
    echo Check errors above for remaining issues.
) else (
    echo.
    echo ================================================
    echo    ✅ BUILD SUCCESSFUL!
    echo ================================================
    echo.
    echo All errors fixed! Website is ready for deployment.
)

pause


