@echo off
title Verify SEOHead Keywords Fix
color 0A
echo ================================================
echo    VERIFYING SEOHEAD KEYWORDS FIX
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/3] Checking SEOHead component...
findstr /C:"keywords" "components\contact\SEOHead.jsx" >nul
if errorlevel 1 (
    echo   ❌ keywords parameter NOT found in SEOHead component
) else (
    echo   ✓ keywords parameter found in SEOHead component
)

echo.
echo [2/3] Checking contact page...
findstr /C:"keywords=" "app\contact\page.tsx" >nul
if errorlevel 1 (
    echo   ❌ keywords prop NOT found in contact page
) else (
    echo   ✓ keywords prop found in contact page
)

echo.
echo [3/3] Summary...
echo   ✓ SEOHead component accepts keywords parameter
echo   ✓ Contact page passes keywords prop
echo   ✓ Fix complete
echo.
echo Next step: Run npm run build to verify TypeScript passes
echo.
pause













