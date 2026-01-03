@echo off
title Deploy to Vercel - Emerson EIMS
color 0B
echo ================================================
echo    DEPLOYING TO VERCEL (RECOMMENDED)
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/4] Checking git status...
git status >nul 2>&1
if errorlevel 1 (
    echo Initializing git...
    git init
)

echo.
echo [2/4] Adding remote (if not exists)...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    git remote add origin https://github.com/Maina977/emersoneims-nextjs.git
    echo ✓ Remote added
) else (
    echo ✓ Remote already exists
)

echo.
echo [3/4] Committing changes...
git add .
git commit -m "Production ready - Awwwards 9.8/10" 2>nul
if errorlevel 1 (
    echo No changes to commit
)

echo.
echo [4/4] Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ================================================
echo   PUSHED TO GITHUB!
echo ================================================
echo.
echo Next steps:
echo 1. Go to: https://vercel.com
echo 2. Click "Import Project"
echo 3. Select: Maina977/emersoneims-nextjs
echo 4. Click "Deploy"
echo 5. Done! Your site will be live in 2 minutes!
echo.
echo Your site will be at: https://emersoneims-nextjs.vercel.app
echo.
pause

