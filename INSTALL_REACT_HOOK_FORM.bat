@echo off
title INSTALL react-hook-form
color 0A
echo ================================================
echo    INSTALLING react-hook-form
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo Checking if react-hook-form is already installed...
call npm.cmd list react-hook-form 2>nul | findstr "react-hook-form" >nul
if not errorlevel 1 (
    echo ✓ react-hook-form is already installed
    echo.
    echo Verifying installation...
    call npm.cmd list react-hook-form
    echo.
    echo Running build test...
    call npm.cmd run build
    goto :end
)

echo.
echo Installing react-hook-form@^7.53.0...
call npm.cmd install react-hook-form@^7.53.0 --legacy-peer-deps --save

if errorlevel 1 (
    echo.
    echo ❌ Installation failed. Trying alternative method...
    echo.
    call npm.cmd install react-hook-form --legacy-peer-deps --save
    if errorlevel 1 (
        echo.
        echo ❌ Still failed. Please check your npm configuration.
        echo.
        echo Troubleshooting:
        echo 1. Check internet connection
        echo 2. Try: npm cache clean --force
        echo 3. Try: npm install --legacy-peer-deps
        pause
        exit /b 1
    )
)

echo.
echo ✓ react-hook-form installed successfully!
echo.
echo Verifying installation...
call npm.cmd list react-hook-form

echo.
echo ================================================
echo    TESTING BUILD
echo ================================================
echo.

call npm.cmd run build

if errorlevel 1 (
    echo.
    echo ⚠️  Build still has errors. Check output above.
) else (
    echo.
    echo ================================================
    echo    ✅ BUILD SUCCESSFUL!
    echo ================================================
    echo.
    echo react-hook-form is installed and working!
)

:end
pause





