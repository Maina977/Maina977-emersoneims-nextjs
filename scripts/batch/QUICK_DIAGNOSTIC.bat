@echo off
cls
echo ============================================
echo QUICK DIAGNOSTIC - emersoneims.com Status
echo ============================================
echo.

echo [DNS CHECK - www.emersoneims.com]
nslookup www.emersoneims.com
echo.

echo [DNS CHECK - emersoneims.com]
nslookup emersoneims.com
echo.

echo [HTTPS TEST - www.emersoneims.com]
curl -I -m 10 https://www.emersoneims.com 2>&1
echo.

echo [HTTPS TEST - emersoneims.com]
curl -I -m 10 https://emersoneims.com 2>&1
echo.

echo [VERCEL STATUS]
call vercel whoami
echo.

echo [VERCEL DOMAINS]
call vercel domains ls
echo.

echo [VERCEL DEPLOYMENTS]
call vercel ls
echo.

echo ============================================
echo DIAGNOSTIC COMPLETE
echo ============================================
pause
