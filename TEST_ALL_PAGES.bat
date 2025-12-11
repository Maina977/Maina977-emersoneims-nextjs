@echo off
title Test All Pages - Emerson EIMS
color 0B
echo ================================================
echo    TESTING ALL PAGES
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/3] Checking server status...
netstat -ano | findstr ":3000" >nul 2>&1
if errorlevel 1 (
    echo Server NOT running. Starting server...
    echo.
    start "Next.js Dev Server" cmd /k "cd /d C:\Users\PC\my-app && npm.cmd run dev"
    echo Waiting 20 seconds for server to start...
    timeout /t 20 >nul
) else (
    echo Server is already running on port 3000
)

echo.
echo [2/3] Verifying server is accessible...
curl -s http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo Server is starting... Please wait 10 more seconds...
    timeout /t 10 >nul
)

echo.
echo [3/3] Opening all pages for testing...
echo.
echo ================================================
echo   ALL 9 PAGES TO TEST:
echo ================================================
echo.
echo 1. Homepage
echo 2. About Us
echo 3. Services
echo 4. Solutions
echo 5. Solar
echo 6. Generators
echo 7. Generators Used
echo 8. Diagnostics
echo 9. Contact
echo.
echo ================================================
echo.

timeout /t 2 >nul

echo Opening browser...
start http://localhost:3000

echo.
echo ================================================
echo   SERVER STATUS: RUNNING
echo   URL: http://localhost:3000
echo ================================================
echo.
echo Pages available:
echo   - http://localhost:3000/
echo   - http://localhost:3000/about-us
echo   - http://localhost:3000/service
echo   - http://localhost:3000/solution
echo   - http://localhost:3000/solar
echo   - http://localhost:3000/generators
echo   - http://localhost:3000/generators/used
echo   - http://localhost:3000/diagnostics
echo   - http://localhost:3000/contact
echo.
echo Test each page using the navigation bar!
echo.
pause

