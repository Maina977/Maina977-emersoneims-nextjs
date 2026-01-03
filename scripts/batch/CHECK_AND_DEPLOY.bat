@echo off
cls
echo ========================================
echo   Emerson EIMS Deployment Checker
echo ========================================
echo.
echo [1] Checking current directory...
cd
echo.
echo [2] Changing to project directory...
cd /d C:\Users\PC\my-app
if errorlevel 1 (
    echo [ERROR] Cannot access C:\Users\PC\my-app
    echo Please check if the folder exists.
    pause
    exit /b 1
)
echo [OK] Directory changed!
echo.
echo [3] Verifying project files...
cd
if exist package.json (
    echo [OK] Found package.json - Ready to deploy!
    echo.
    echo ========================================
    echo   Starting Deployment...
    echo ========================================
    echo.
    npx vercel@latest --prod
) else (
    echo [ERROR] package.json not found!
    echo Current location: %CD%
    echo.
    echo Please make sure you're in the project folder.
)
echo.
pause


