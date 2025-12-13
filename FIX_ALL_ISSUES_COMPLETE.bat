@echo off
title COMPLETE FIX - All Issues
color 0A
echo ================================================
echo    COMPLETE FIX - All Issues
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/7] Copying contact components using PowerShell...
powershell -ExecutionPolicy Bypass -File "COPY_CONTACT_COMPONENTS.ps1"
if errorlevel 1 (
    echo ❌ PowerShell copy failed, trying manual copy...
    if not exist "components\contact" mkdir "components\contact"
    copy "app\components\contact\SEOHead.jsx" "components\contact\" /Y
    copy "app\components\contact\ErrorBoundary.jsx" "components\contact\" /Y
    copy "app\components\contact\AdaptivePerformanceMonitor.jsx" "components\contact\" /Y
    copy "app\components\contact\CallUs.jsx" "components\contact\" /Y
    copy "app\components\contact\EmailUs.jsx" "components\contact\" /Y
    copy "app\components\contact\VisitUs.jsx" "components\contact\" /Y
    copy "app\components\contact\Gallery.jsx" "components\contact\" /Y
    copy "app\components\contact\ContactForm.jsx" "components\contact\" /Y
    copy "app\components\contact\CountiesGrid.jsx" "components\contact\" /Y
    copy "app\components\contact\HeroSection.jsx" "components\contact\" /Y
    echo ✓ Manual copy completed
)

echo.
echo [2/7] Verifying all contact component files exist...
set "missing=0"
if exist "components\contact\SEOHead.jsx" (echo ✓ SEOHead.jsx) else (echo ❌ SEOHead.jsx MISSING & set /a missing+=1)
if exist "components\contact\ErrorBoundary.jsx" (echo ✓ ErrorBoundary.jsx) else (echo ❌ ErrorBoundary.jsx MISSING & set /a missing+=1)
if exist "components\contact\AdaptivePerformanceMonitor.jsx" (echo ✓ AdaptivePerformanceMonitor.jsx) else (echo ❌ AdaptivePerformanceMonitor.jsx MISSING & set /a missing+=1)
if exist "components\contact\CallUs.jsx" (echo ✓ CallUs.jsx) else (echo ❌ CallUs.jsx MISSING & set /a missing+=1)
if exist "components\contact\EmailUs.jsx" (echo ✓ EmailUs.jsx) else (echo ❌ EmailUs.jsx MISSING & set /a missing+=1)
if exist "components\contact\VisitUs.jsx" (echo ✓ VisitUs.jsx) else (echo ❌ VisitUs.jsx MISSING & set /a missing+=1)
if exist "components\contact\Gallery.jsx" (echo ✓ Gallery.jsx) else (echo ❌ Gallery.jsx MISSING & set /a missing+=1)
if exist "components\contact\ContactForm.jsx" (echo ✓ ContactForm.jsx) else (echo ❌ ContactForm.jsx MISSING & set /a missing+=1)
if exist "components\contact\CountiesGrid.jsx" (echo ✓ CountiesGrid.jsx) else (echo ❌ CountiesGrid.jsx MISSING & set /a missing+=1)
if exist "components\contact\HeroSection.jsx" (echo ✓ HeroSection.jsx) else (echo ❌ HeroSection.jsx MISSING & set /a missing+=1)

if %missing% GTR 0 (
    echo.
    echo ❌ %missing% files are missing! Check source folder.
    pause
    exit /b 1
)

echo.
echo [3/7] Verifying contact page imports...
findstr /C:"@/components/contact/" "app\contact\page.tsx" >nul
if errorlevel 1 (
    echo ⚠️  Fixing contact page imports...
    powershell -Command "$c=[System.IO.File]::ReadAllText('app\contact\page.tsx'); $c=$c -replace '@/app/components/contact/','@/components/contact/'; [System.IO.File]::WriteAllText('app\contact\page.tsx',$c)"
    echo ✓ Fixed
) else (
    echo ✓ Contact page imports correct
)

echo.
echo [4/7] Verifying all critical data files...
if exist "app\lib\data\cumminsgenerators.ts" (echo ✓ cumminsgenerators.ts) else (echo ❌ cumminsgenerators.ts MISSING)
if exist "app\lib\data\generatorservices.ts" (echo ✓ generatorservices.ts) else (echo ❌ generatorservices.ts MISSING)
if exist "app\styles\diagnostics.css" (echo ✓ diagnostics.css) else (echo ❌ diagnostics.css MISSING)

echo.
echo [5/7] Verifying all route pages exist...
if exist "app\page.tsx" (echo ✓ app/page.tsx) else (echo ❌ app/page.tsx MISSING)
if exist "app\layout.tsx" (echo ✓ app/layout.tsx) else (echo ❌ app/layout.tsx MISSING)
if exist "app\contact\page.tsx" (echo ✓ app/contact/page.tsx) else (echo ❌ app/contact/page.tsx MISSING)
if exist "app\generators\page.tsx" (echo ✓ app/generators/page.tsx) else (echo ❌ app/generators/page.tsx MISSING)
if exist "app\diagnostics\page.tsx" (echo ✓ app/diagnostics/page.tsx) else (echo ❌ app/diagnostics/page.tsx MISSING)

echo.
echo [6/7] Cleaning build cache...
if exist ".next" rmdir /s /q ".next" >nul 2>&1
echo ✓ Cache cleaned

echo.
echo [7/7] Running build test...
echo.
call npm.cmd run build

if errorlevel 1 (
    echo.
    echo ================================================
    echo    ❌ BUILD FAILED
    echo ================================================
    echo.
    echo Check errors above for remaining issues.
) else (
    echo.
    echo ================================================
    echo    ✅ BUILD SUCCESSFUL!
    echo ================================================
    echo.
    echo Website is ready for deployment!
)

pause





