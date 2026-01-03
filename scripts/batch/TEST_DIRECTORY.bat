@echo off
echo Testing directory navigation...
echo.
echo Current directory BEFORE:
cd
echo.
echo Changing to: C:\Users\PC\my-app
cd /d C:\Users\PC\my-app
if errorlevel 1 (
    echo [ERROR] Failed to change directory!
    echo The path might not exist.
    pause
    exit /b 1
)
echo.
echo Current directory AFTER:
cd
echo.
if exist package.json (
    echo [SUCCESS] Found package.json!
    echo Directory is correct.
) else (
    echo [ERROR] package.json not found!
    echo Current directory: %CD%
)
echo.
pause


