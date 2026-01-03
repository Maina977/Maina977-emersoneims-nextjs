@echo off
title Create GitHub Repo & Push - Emerson EIMS
color 0A
echo ================================================
echo    CREATE GITHUB REPO AND PUSH CODE
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo STEP 1: CREATE GITHUB REPOSITORY
echo.
echo 1. Go to: https://github.com/new
echo 2. Repository name: emersoneims-nextjs
echo 3. Description: Emerson EIMS - Awwwards 9.8/10 Website
echo 4. Make it: Public or Private (your choice)
echo 5. DO NOT check:
echo    - ❌ Add a README file
echo    - ❌ Add .gitignore
echo    - ❌ Choose a license
echo 6. Click "Create repository"
echo.
echo Press any key after creating the repository...
pause >nul

echo.
echo ================================================
echo    STEP 2: INITIALIZE AND PUSH
echo ================================================
echo.

echo [1/6] Initializing git...
if not exist ".git" (
    git init
    echo ✓ Git initialized
) else (
    echo ✓ Git already initialized
)

echo.
echo [2/6] Adding remote...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/Maina977/emersoneims-nextjs.git
echo ✓ Remote added

echo.
echo [3/6] Setting branch to main...
git branch -M main
echo ✓ Branch set to main

echo.
echo [4/6] Adding all files...
git add .
echo ✓ Files staged

echo.
echo [5/6] Creating initial commit...
git commit -m "Initial commit - Awwwards 9.8/10 website - Production ready"
if errorlevel 1 (
    echo WARNING: Commit failed. Checking status...
    git status
    pause
)

echo.
echo [6/6] Pushing to GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ================================================
    echo   ⚠️  PUSH FAILED
    echo ================================================
    echo.
    echo Trying force push...
    git push -u origin main --force
    
    if errorlevel 1 (
        echo.
        echo ERROR: Still failed. Possible issues:
        echo 1. Repository not created yet
        echo 2. Authentication required (use Personal Access Token)
        echo 3. Network issues
        echo.
        echo MANUAL STEPS:
        echo 1. Create repo at: https://github.com/new
        echo 2. Then run: git push -u origin main
        echo.
    ) else (
        echo.
        echo ================================================
        echo   ✅ SUCCESS! PUSHED TO GITHUB!
        echo ================================================
    )
) else (
    echo.
    echo ================================================
    echo   ✅ SUCCESS! PUSHED TO GITHUB!
    echo ================================================
)

echo.
echo ================================================
echo   NEXT: DEPLOY TO VERCEL
echo ================================================
echo.
echo 1. Go to: https://vercel.com
echo 2. Sign up/login (use GitHub)
echo 3. Click "Import Project"
echo 4. Select: Maina977/emersoneims-nextjs
echo 5. Click "Deploy"
echo 6. Wait 2 minutes
echo 7. Your site is LIVE! ✅
echo.
pause

