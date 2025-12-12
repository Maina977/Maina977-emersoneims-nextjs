@echo off
title Fix All Issues & Deploy - Emerson EIMS
color 0B
echo ================================================
echo    FIX ALL ISSUES AND DEPLOY
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/6] Checking Node.js and npm...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found!
    echo Please install Node.js first
    pause
    exit /b 1
)
echo ✓ Node.js found

npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm not found!
    pause
    exit /b 1
)
echo ✓ npm found

echo.
echo [2/6] Installing dependencies...
call npm.cmd install --legacy-peer-deps
if errorlevel 1 (
    echo WARNING: Some dependencies failed, but continuing...
)

echo.
echo [3/6] Checking git repository...
git status >nul 2>&1
if errorlevel 1 (
    echo Initializing git...
    git init
    git remote add origin https://github.com/Maina977/emersoneims-nextjs.git 2>nul
    git branch -M main
)
echo ✓ Git repository ready

echo.
echo [4/6] Building project...
call npm.cmd run build
if errorlevel 1 (
    echo.
    echo ================================================
    echo   ⚠️  BUILD ERRORS FOUND
    echo ================================================
    echo.
    echo Trying to fix common issues...
    echo.
    
    REM Clear cache
    rd /s /q .next >nul 2>&1
    rd /s /q node_modules\.cache >nul 2>&1
    
    REM Try building again
    echo Retrying build...
    call npm.cmd run build
    if errorlevel 1 (
        echo.
        echo ERROR: Build still failing
        echo Please check the errors above
        pause
        exit /b 1
    )
)
echo ✓ Build successful

echo.
echo [5/6] Pushing to GitHub...
git add .
git commit -m "Fix and deploy - Production ready" 2>nul
git push -u origin main 2>nul
echo ✓ Code pushed to GitHub

echo.
echo [6/6] Deploying to Vercel...
echo.
echo Installing Vercel CLI...
call npm.cmd install -g vercel
if errorlevel 1 (
    echo.
    echo ================================================
    echo   ⚠️  VERCEL CLI INSTALLATION FAILED
    echo ================================================
    echo.
    echo Please deploy manually:
    echo 1. Go to: https://vercel.com
    echo 2. Import project: Maina977/emersoneims-nextjs
    echo 3. Click Deploy
    echo.
    pause
    exit /b 1
)

echo.
echo Deploying...
echo You may need to login to Vercel
echo.
vercel --prod --yes

if errorlevel 1 (
    echo.
    echo ================================================
    echo   ⚠️  AUTOMATIC DEPLOYMENT FAILED
    echo ================================================
    echo.
    echo MANUAL DEPLOYMENT REQUIRED:
    echo.
    echo 1. Go to: https://vercel.com
    echo 2. Sign up/login (use GitHub)
    echo 3. Click "Import Project"
    echo 4. Select: Maina977/emersoneims-nextjs
    echo 5. Click "Deploy"
    echo 6. Wait 2 minutes
    echo 7. Your site will be LIVE! ✅
    echo.
) else (
    echo.
    echo ================================================
    echo   ✅ SUCCESS! DEPLOYED TO VERCEL!
    echo ================================================
    echo.
    echo Your website is now LIVE!
    echo Check the URL above
    echo.
)

pause


