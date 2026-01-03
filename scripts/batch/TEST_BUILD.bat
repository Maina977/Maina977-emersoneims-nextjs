@echo off
title Test Build - Identify All Errors
color 0B
echo ================================================
echo    BUILD TEST - Identifying All Errors
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/1] Running Next.js build...
echo.
echo This will show all module resolution errors...
echo.

call npm.cmd run build > build_output.txt 2>&1

echo.
echo ================================================
echo    BUILD OUTPUT SAVED TO: build_output.txt
echo ================================================
echo.

if errorlevel 1 (
    echo ❌ BUILD FAILED
    echo.
    echo Showing first 50 lines of errors:
    echo ----------------------------------------
    powershell -Command "Get-Content build_output.txt | Select-Object -First 50"
    echo.
    echo Full errors saved to: build_output.txt
) else (
    echo ✅ BUILD SUCCESSFUL!
    echo.
    echo Showing build summary:
    echo ----------------------------------------
    powershell -Command "Get-Content build_output.txt | Select-Object -Last 20"
)

echo.
echo ================================================
pause















