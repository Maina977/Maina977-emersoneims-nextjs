@echo off
title Test Build - Verify All Imports
color 0B
echo ================================================
echo    BUILD TEST
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo Running build test...
echo.
call npm.cmd run build

echo.
echo ================================================
if errorlevel 1 (
    echo    ❌ BUILD FAILED
    echo ================================================
) else (
    echo    ✅ BUILD SUCCESSFUL!
    echo ================================================
)

pause





