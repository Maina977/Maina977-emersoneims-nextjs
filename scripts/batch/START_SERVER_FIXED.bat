@echo off
title Emerson EIMS - Fixed Server Startup
color 0A
echo ================================================
echo    EMERSON EIMS - PERMANENT FIXED STARTUP
echo ================================================
echo.

REM Change to project directory
cd /d "C:\Users\PC\my-app"
if errorlevel 1 (
    echo ERROR: Cannot navigate to project directory
    pause
    exit /b 1
)

echo [1/5] Checking Node.js installation...
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found! Please install Node.js 18+
    pause
    exit /b 1
)
node --version
echo Node.js found!

echo.
echo [2/5] Checking npm installation...
where npm.cmd >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm not found!
    pause
    exit /b 1
)
npm.cmd --version
echo npm found!

echo.
echo [3/5] Checking if port 3000 is available...
netstat -ano | findstr ":3000" >nul 2>&1
if not errorlevel 1 (
    echo WARNING: Port 3000 is already in use!
    echo Attempting to kill existing process...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 2 >nul
)

echo.
echo [4/5] Checking dependencies...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm.cmd install --legacy-peer-deps
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo Dependencies already installed.
)

echo.
echo [5/5] Starting development server...
echo.
echo ================================================
echo   SERVER STARTING AT: http://localhost:3000
echo ================================================
echo.
echo Wait 15-20 seconds for the server to start...
echo Then open: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo ================================================
echo.

REM Use npm.cmd explicitly to avoid PowerShell issues
call npm.cmd run dev

pause

