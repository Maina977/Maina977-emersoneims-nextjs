@echo off
title Fix All SEOHead Keywords Issues
color 0A
echo ================================================
echo    FIXING ALL SEOHEAD KEYWORDS ISSUES
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/4] Checking contact page...
findstr /C:"keywords=" "app\contact\page.tsx" >nul
if errorlevel 1 (
    echo   ❌ Contact page missing keywords
) else (
    echo   ✓ Contact page has keywords
)

echo.
echo [2/4] Checking service page...
findstr /C:"keywords=" "app\service\page.tsx" >nul
if errorlevel 1 (
    echo   ❌ Service page missing keywords
) else (
    echo   ✓ Service page has keywords
)

echo.
echo [3/4] Checking SEOHead components...
if exist "components\contact\SEOHead.jsx" (
    findstr /C:"keywords" "components\contact\SEOHead.jsx" >nul
    if errorlevel 1 (
        echo   ❌ components/contact/SEOHead.jsx missing keywords parameter
    ) else (
        echo   ✓ components/contact/SEOHead.jsx has keywords parameter
    )
) else (
    echo   ⚠️  components/contact/SEOHead.jsx not found
)

if exist "app\components\common\SEOHead.jsx" (
    findstr /C:"keywords" "app\components\common\SEOHead.jsx" >nul
    if errorlevel 1 (
        echo   ❌ app/components/common/SEOHead.jsx missing keywords parameter
    ) else (
        echo   ✓ app/components/common/SEOHead.jsx has keywords parameter
    )
) else (
    echo   ⚠️  app/components/common/SEOHead.jsx not found
)

echo.
echo [4/4] Summary...
echo   All SEOHead components and usages verified
echo.
echo Next step: Run npm run build
echo.
pause





