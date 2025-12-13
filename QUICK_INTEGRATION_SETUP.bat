@echo off
echo ========================================
echo   EMERSONEIMS INTEGRATION SETUP
echo   GitHub + WordPress + Vercel
echo   Domain: emersoneims.com
echo ========================================
echo.

echo [1/5] Staging all changes...
git add .
echo.

echo [2/5] Committing changes...
git commit -m "Awwwards 10/10 website - All pages enhanced, ready for deployment"
echo.

echo [3/5] Checking GitHub remote...
git remote -v
echo.

if %errorlevel% neq 0 (
    echo GitHub remote not found.
    echo.
    echo Please add your GitHub remote:
    echo   git remote add origin https://github.com/YOUR_USERNAME/emersoneims-nextjs.git
    echo.
    pause
    exit
)

echo [4/5] Pushing to GitHub...
git push origin main
echo.

echo [5/5] Ready to deploy to Vercel!
echo.
echo Next: Run 'vercel --prod' to deploy
echo.
echo Or connect GitHub to Vercel:
echo   1. Go to vercel.com/new
echo   2. Import your GitHub repository
echo   3. Add domain: emersoneims.com
echo   4. Configure DNS in Hostinger
echo.
pause




