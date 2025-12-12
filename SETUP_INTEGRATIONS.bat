@echo off
echo ========================================
echo   EMERSONEIMS INTEGRATION SETUP
echo   GitHub + WordPress + Vercel + Domain
echo ========================================
echo.

echo Step 1: Checking Git status...
git status
echo.

echo Step 2: Initializing Git (if needed)...
if not exist .git (
    echo Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit: Awwwards 10/10 website"
    echo.
    echo Please add your GitHub remote:
    echo   git remote add origin https://github.com/YOUR_USERNAME/emersoneims-nextjs.git
    echo   git push -u origin main
) else (
    echo Git already initialized.
)
echo.

echo Step 3: Checking Vercel CLI...
vercel --version
echo.

echo Step 4: Ready to deploy!
echo.
echo Next steps:
echo   1. Create GitHub repository
echo   2. Push code: git push origin main
echo   3. Deploy to Vercel: vercel --prod
echo   4. Configure DNS in Hostinger
echo   5. Add domain in Vercel dashboard
echo.
echo See INTEGRATION_SETUP_GUIDE.md for detailed instructions.
echo.
pause

