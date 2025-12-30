@echo off
cls
echo.
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║                                                                   ║
echo ║         EMERSON EIMS - PRODUCTION DEPLOYMENT                     ║
echo ║                                                                   ║
echo ║         Domain: www.emersoneims.com                              ║
echo ║         Action: Deploy to Production                             ║
echo ║                                                                   ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.
echo This will:
echo   1. Clean all build artifacts
echo   2. Fresh install dependencies
echo   3. Configure production environment
echo   4. Deploy to Vercel Production
echo   5. Configure custom domain
echo   6. Make your website LIVE
echo.
echo.
pause
echo.
echo Starting deployment...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0DEPLOY_PRODUCTION_NOW.ps1"
