@echo off
cls
echo ============================================
echo EMERGENCY SITE RESTORATION - emersoneims.com
echo ============================================
echo.
echo Time: %date% %time%
echo.

cd /d "C:\Users\PC\my-app"

echo [STEP 1] Checking Vercel Status...
call vercel whoami
echo.

echo [STEP 2] Removing Conflicting Domains...
call vercel domains rm emersoneims.com --yes 2>nul
call vercel domains rm www.emersoneims.com --yes 2>nul
echo.

echo [STEP 3] Re-adding Domains to This Project...
call vercel domains add emersoneims.com --yes
call vercel domains add www.emersoneims.com --yes
echo.

echo [STEP 4] Listing Current Domains...
call vercel domains ls
echo.

echo [STEP 5] Force Redeployment to Production...
call vercel --prod --yes --force
echo.

echo [STEP 6] Waiting 15 seconds for deployment...
timeout /t 15 /nobreak
echo.

echo [STEP 7] Testing Site Accessibility...
curl -I https://www.emersoneims.com
echo.
curl -I https://emersoneims.com
echo.

echo ============================================
echo EMERGENCY RESTORATION COMPLETE
echo ============================================
echo.
echo NEXT STEPS:
echo 1. Open browser and test: https://www.emersoneims.com
echo 2. Check global DNS: https://dnschecker.org/#A/www.emersoneims.com
echo 3. Verify Vercel dashboard for any domain conflicts
echo.
echo DNS Records Required at Domain Registrar:
echo   Type A    - Name: @     - Value: 76.76.21.21
echo   Type CNAME - Name: www   - Value: cname.vercel-dns.com
echo.
pause
