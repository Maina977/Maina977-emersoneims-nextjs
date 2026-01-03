@echo off
echo ===================================================
echo      EMERSON EIMS - 10/10 DEPLOYMENT SEQUENCE
echo ===================================================
echo.
echo [1/4] Building Optimized Production Build...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed! Aborting deployment.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/4] Deploying to Vercel (Production)...
echo.
echo NOTE: If asked to override, type 'Y'.
call vercel --prod
if %errorlevel% neq 0 (
    echo Deployment failed! Please check your Vercel login.
    pause
    exit /b %errorlevel%
)

echo.
echo [3/4] Verifying Domain Configuration...
echo Please ensure your domain 'www.emersoneims.com' is correctly set in Vercel dashboard.
echo If you see "Domain tied to multiple projects", go to Vercel Dashboard > Settings > Domains and remove it from the old project.

echo.
echo [4/4] Launching Live Site...
start https://www.emersoneims.com

echo.
echo ===================================================
echo      DEPLOYMENT COMPLETE - 10/10 STATUS ACHIEVED
echo ===================================================
pause
