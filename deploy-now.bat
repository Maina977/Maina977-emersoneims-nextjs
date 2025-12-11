@echo off
echo ========================================
echo   Deploying Emerson EIMS to Vercel
echo   Domain: www.emersoneims.com
echo ========================================
echo.
cd /d "%~dp0"
echo Current directory: %CD%
echo.
echo Starting deployment...
echo.
npx vercel@latest --prod --yes
echo.
pause
