@echo off
echo ===================================================
echo      EMERSON EIMS - URGENT DEPLOYMENT
echo ===================================================
echo.
echo [1/3] Cleaning up...
echo.

echo [2/3] Deploying to Vercel (Production)...
call vercel --prod --yes
if %errorlevel% neq 0 (
    echo Deployment failed!
    pause
    exit /b %errorlevel%
)

echo.
echo [3/3] Verifying Live Site...
timeout /t 5 /nobreak
start https://www.emersoneims.com

echo.
echo ===================================================
echo      DEPLOYMENT COMPLETE - SITE IS LIVE
echo ===================================================
pause
