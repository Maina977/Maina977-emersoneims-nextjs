@echo off
echo ========================================
echo URGENT: Restoring www.emersoneims.com
echo ========================================
echo.

echo Step 1: Checking DNS Configuration...
echo ----------------------------------------
nslookup www.emersoneims.com
echo.
nslookup emersoneims.com
echo.

echo Step 2: Verifying Vercel Authentication...
echo ----------------------------------------
call vercel whoami
echo.

echo Step 3: Adding Domains to Vercel...
echo ----------------------------------------
call vercel domains add emersoneims.com --yes
call vercel domains add www.emersoneims.com --yes
echo.

echo Step 4: Checking Current Domains...
echo ----------------------------------------
call vercel domains ls
echo.

echo Step 5: Deploying to Production...
echo ----------------------------------------
call vercel --prod --yes
echo.

echo Step 6: Verifying Site Accessibility...
echo ----------------------------------------
timeout /t 10 /nobreak
curl -I https://www.emersoneims.com
curl -I https://emersoneims.com
echo.

echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Please verify the site is accessible at:
echo - https://www.emersoneims.com
echo - https://emersoneims.com
echo.
echo If issues persist, check:
echo 1. DNS propagation at https://dnschecker.org
echo 2. Vercel dashboard for domain conflicts
echo 3. SSL certificate status
echo.
pause
