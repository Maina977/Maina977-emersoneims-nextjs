@echo off
title Push to GitHub - Emerson EIMS
color 0A
echo ================================================
echo    PUSHING TO GITHUB
echo ================================================
echo.

REM Navigate to project root
cd /d "C:\Users\PC\my-app"

echo Current directory: %CD%
echo.

echo [1/4] Checking git status...
git status >nul 2>&1
if errorlevel 1 (
    echo Git not initialized. Initializing...
    git init
)

echo.
echo [2/4] Adding remote repository...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/Maina977/emersoneims-nextjs.git
echo ✓ Remote added: https://github.com/Maina977/emersoneims-nextjs.git

echo.
echo [3/4] Setting branch to main...
git branch -M main
echo ✓ Branch set to main

echo.
echo [4/4] Adding all files and pushing...
git add .
git commit -m "Initial commit - Awwwards 9.8/10 website ready for deployment"
git push -u origin main

echo.
echo ================================================
echo   PUSH COMPLETE!
echo ================================================
echo.
pause

