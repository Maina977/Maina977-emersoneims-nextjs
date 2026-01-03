@echo off
title View All Pages - Emerson EIMS
color 0B
echo ================================================
echo    VIEW ALL PAGES - EMERSON EIMS
echo ================================================
echo.
echo Starting development server...
echo.
echo Once the server starts, open your browser and visit:
echo.
echo    MAIN PAGES:
echo    ===========
echo    1. Homepage:        http://localhost:3000/
echo    2. About Us:        http://localhost:3000/about-us
echo    3. Services:        http://localhost:3000/service
echo    4. Solutions:       http://localhost:3000/solution
echo    5. Solar:           http://localhost:3000/solar
echo    6. Generators:      http://localhost:3000/generators
echo    7. Diagnostics:     http://localhost:3000/diagnostics
echo    8. Contact:         http://localhost:3000/contact
echo.
echo    SUB-PAGES:
echo    ==========
echo    9. Generators Used: http://localhost:3000/generators/used
echo.
echo ================================================
echo.
echo Press any key to start the server...
pause >nul

cd /d "C:\Users\PC\my-app"
call npm.cmd run dev

