@echo off
title DIRECT FIX - Contact Components
color 0A
echo ================================================
echo    DIRECT FIX - Contact Components
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo Step 1: Creating components/contact at root...
if not exist "components\contact" mkdir "components\contact"

echo Step 2: Copying ALL contact component files...
copy "app\components\contact\*.jsx" "components\contact\" /Y
copy "app\components\contact\*.tsx" "components\contact\" /Y

echo Step 3: Verifying files were copied...
if exist "components\contact\SEOHead.jsx" (
    echo ✓ SEOHead.jsx copied
) else (
    echo ❌ SEOHead.jsx NOT copied!
)

if exist "components\contact\ErrorBoundary.jsx" (
    echo ✓ ErrorBoundary.jsx copied
) else (
    echo ❌ ErrorBoundary.jsx NOT copied!
)

if exist "components\contact\AdaptivePerformanceMonitor.jsx" (
    echo ✓ AdaptivePerformanceMonitor.jsx copied
) else (
    echo ❌ AdaptivePerformanceMonitor.jsx NOT copied!
)

echo.
echo Step 4: Verifying contact page imports are correct...
findstr /C:"@/components/contact/" "app\contact\page.tsx" >nul
if errorlevel 1 (
    echo ⚠️  Contact page may have wrong imports
) else (
    echo ✓ Contact page imports look correct
)

echo.
echo Done! Files should now be in components/contact/
pause





