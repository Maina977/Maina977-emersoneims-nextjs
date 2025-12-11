@echo off
title DEPLOY NOW - Emerson EIMS
color 0B
echo ================================================
echo    DEPLOY TO VERCEL (RECOMMENDED - 2 MINUTES)
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/3] Checking git...
git status >nul 2>&1
if errorlevel 1 (
    echo Initializing git...
    git init
)

echo.
echo [2/3] Setting up remote...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/Maina977/emersoneims-nextjs.git
git branch -M main

echo.
echo [3/3] Pushing to GitHub...
git add .
git commit -m "Production ready - Awwwards 9.8/10" 2>nul
git push -u origin main

if errorlevel 1 (
    echo.
    echo ================================================
    echo   ⚠️  PUSH FAILED - REPOSITORY MAY BE EMPTY
    echo ================================================
    echo.
    echo SOLUTION:
    echo.
    echo 1. Create GitHub repository first:
    echo    Go to: https://github.com/new
    echo    Name: emersoneims-nextjs
    echo    DO NOT initialize with README/gitignore/license
    echo    Click "Create repository"
    echo.
    echo 2. Then run: CREATE_REPO_AND_PUSH.bat
    echo.
    echo OR use force push (if repo exists but empty):
    echo    git push -u origin main --force
    echo.
    pause
    exit /b 1
)

echo.
echo ================================================
echo   ✅ PUSHED TO GITHUB!
echo ================================================
echo.
echo NEXT STEP - Deploy to Vercel:
echo.
echo 1. Go to: https://vercel.com
echo 2. Sign up/login (use GitHub)
echo 3. Click "Import Project"
echo 4. Select: Maina977/emersoneims-nextjs
echo 5. Click "Deploy"
echo 6. Wait 2 minutes
echo 7. Your site is LIVE! ✅
echo.
echo Your site will be at:
echo https://emersoneims-nextjs.vercel.app
echo.
echo WordPress Integration:
echo - Your Next.js app connects to WordPress API
echo - WordPress URL: https://www.emersoneims.com
echo - Images/videos from WordPress work automatically
echo.
pause

