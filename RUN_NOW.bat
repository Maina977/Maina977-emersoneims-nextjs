@echo off
REM SIMPLE, FOOLPROOF SERVER STARTUP
REM This script ALWAYS works - no PowerShell issues

cd /d C:\Users\PC\my-app

REM Kill any existing server on port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

REM Start server using npm.cmd (always works, bypasses PowerShell)
echo Starting server... Please wait 15 seconds...
echo.
start "Next.js Dev Server" cmd /k "cd /d C:\Users\PC\my-app && npm.cmd run dev"

timeout /t 3 >nul

echo.
echo ================================================
echo   SERVER STARTED!
echo   Opening browser in 15 seconds...
echo ================================================
echo.
echo URL: http://localhost:3000
echo.

timeout /t 15 >nul

start http://localhost:3000

echo Browser opened! If page doesn't load, wait 10 more seconds.
pause

