@echo off
echo ========================================
echo FIXING NPM ISSUES AND STARTING SERVER
echo ========================================
cd /d "C:\Users\PC\my-app"

echo.
echo Step 1: Installing dependencies...
call npm.cmd install
if errorlevel 1 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo Step 2: Building project...
call npm.cmd run build
if errorlevel 1 (
    echo ERROR: Build failed - checking errors...
    pause
    exit /b 1
)

echo.
echo Step 3: Starting development server...
echo Server will start at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
call npm.cmd run dev

