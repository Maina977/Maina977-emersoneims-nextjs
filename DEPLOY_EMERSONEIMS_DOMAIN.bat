@echo off
echo ========================================
echo EMERSON EIMS - PRODUCTION DEPLOYMENT
echo ========================================
echo.
echo Starting PowerShell deployment script...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0DEPLOY_EMERSONEIMS_DOMAIN.ps1"
pause
