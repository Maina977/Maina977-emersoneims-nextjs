@echo off
echo ========================================
echo   DEPLOYING EMERSONEIMS TO VERCEL
echo   Awwwards 10/10 Website
echo ========================================
echo.

echo Step 1: Checking Vercel CLI...
vercel --version
echo.

echo Step 2: Deploying to production...
echo.
echo NOTE: You will be prompted to:
echo   - Login (if not already)
echo   - Confirm deployment
echo   - Link project (or create new)
echo.

vercel --prod

echo.
echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your website is now live!
echo Check the URL provided above.
echo.
pause
