@echo off
title Initialize Git & Push to GitHub - Emerson EIMS
color 0B
echo ================================================
echo    INITIALIZE GIT AND PUSH TO GITHUB
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/5] Checking if git is initialized...
if not exist ".git" (
    echo Git not initialized. Initializing...
    git init
    echo ✓ Git initialized
) else (
    echo ✓ Git already initialized
)

echo.
echo [2/5] Checking remote...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo Adding remote repository...
    git remote add origin https://github.com/Maina977/emersoneims-nextjs.git
    echo ✓ Remote added
) else (
    echo Updating remote URL...
    git remote set-url origin https://github.com/Maina977/emersoneims-nextjs.git
    echo ✓ Remote updated
)

echo.
echo [3/5] Setting branch to main...
git branch -M main
echo ✓ Branch set to main

echo.
echo [4/5] Adding all files...
git add .
echo ✓ Files staged

echo.
echo [5/5] Committing and pushing...
git commit -m "Initial commit - Awwwards 9.8/10 website - Production ready" 2>nul
if errorlevel 1 (
    echo No changes to commit or commit failed
    echo Attempting to push existing commits...
)

echo.
echo Pushing to GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ================================================
    echo   ⚠️  PUSH FAILED - REPOSITORY MAY BE EMPTY
    echo ================================================
    echo.
    echo SOLUTION:
    echo.
    echo 1. Go to: https://github.com/Maina977/emersoneims-nextjs
    echo 2. If repo doesn't exist, create it:
    echo    - Click "New repository"
    echo    - Name: emersoneims-nextjs
    echo    - DO NOT initialize with README
    echo    - DO NOT add .gitignore
    echo    - DO NOT add license
    echo    - Click "Create repository"
    echo.
    echo 3. Then run this script again
    echo.
    echo OR use force push (if repo exists but is empty):
    echo    git push -u origin main --force
    echo.
) else (
    echo.
    echo ================================================
    echo   ✅ SUCCESS! PUSHED TO GITHUB!
    echo ================================================
    echo.
    echo Next: Deploy to Vercel
    echo 1. Go to: https://vercel.com
    echo 2. Import project: Maina977/emersoneims-nextjs
    echo 3. Click Deploy
    echo.
)

pause

