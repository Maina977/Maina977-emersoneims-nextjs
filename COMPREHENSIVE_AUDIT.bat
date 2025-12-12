@echo off
title Comprehensive Website Audit
color 0B
echo ================================================
echo    COMPREHENSIVE WEBSITE AUDIT
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/8] Checking app folder structure...
if exist "app\contact\page.tsx" (
    echo   ✓ app\contact\page.tsx (CORRECT)
) else (
    echo   ❌ app\contact\page.tsx MISSING
)

if exist "app\service\page.tsx" (
    echo   ✓ app\service\page.tsx
) else (
    echo   ❌ app\service\page.tsx MISSING
)

if exist "app\generators\page.tsx" (
    echo   ✓ app\generators\page.tsx
) else (
    echo   ❌ app\generators\page.tsx MISSING
)

if exist "app\diagnostics\page.tsx" (
    echo   ✓ app\diagnostics\page.tsx
) else (
    echo   ❌ app\diagnostics\page.tsx MISSING
)

echo.
echo [2/8] Checking for files with spaces (INVALID)...
dir /s /b "* *" 2>nul | findstr /i "page.tsx" | findstr /v "node_modules"
if errorlevel 1 (
    echo   ✓ No page.tsx files with spaces found
) else (
    echo   ⚠️  Found files with spaces - these are INVALID
)

echo.
echo [3/8] Checking SEOHead components...
if exist "components\contact\SEOHead.jsx" (
    findstr /C:"keywords" "components\contact\SEOHead.jsx" >nul
    if errorlevel 1 (
        echo   ❌ components\contact\SEOHead.jsx missing keywords parameter
    ) else (
        echo   ✓ components\contact\SEOHead.jsx has keywords
    )
) else (
    echo   ❌ components\contact\SEOHead.jsx MISSING
)

if exist "app\components\common\SEOHead.jsx" (
    findstr /C:"keywords" "app\components\common\SEOHead.jsx" >nul
    if errorlevel 1 (
        echo   ❌ app\components\common\SEOHead.jsx missing keywords parameter
    ) else (
        echo   ✓ app\components\common\SEOHead.jsx has keywords
    )
) else (
    echo   ⚠️  app\components\common\SEOHead.jsx not found
)

echo.
echo [4/8] Checking contact page keywords prop...
findstr /C:"keywords=" "app\contact\page.tsx" >nul
if errorlevel 1 (
    echo   ❌ app\contact\page.tsx MISSING keywords prop
) else (
    echo   ✓ app\contact\page.tsx has keywords prop
)

echo.
echo [5/8] Checking service page keywords prop...
findstr /C:"keywords=" "app\service\page.tsx" >nul
if errorlevel 1 (
    echo   ❌ app\service\page.tsx MISSING keywords prop
) else (
    echo   ✓ app\service\page.tsx has keywords prop
)

echo.
echo [6/8] Checking SectionLead component...
if exist "app\components\generators\SectionLead.tsx" (
    findstr /C:"export default" "app\components\generators\SectionLead.tsx" >nul
    if errorlevel 1 (
        echo   ❌ SectionLead.tsx missing export
    ) else (
        echo   ✓ SectionLead.tsx has export
    )
) else (
    echo   ❌ SectionLead.tsx MISSING
)

echo.
echo [7/8] Checking tsconfig.json...
findstr /C:"\"incremental\"" "tsconfig.json" >nul
if errorlevel 1 (
    echo   ⚠️  tsconfig.json missing incremental setting
) else (
    echo   ✓ tsconfig.json has incremental setting
)

findstr /C:"\"baseUrl\"" "tsconfig.json" >nul
if errorlevel 1 (
    echo   ⚠️  tsconfig.json missing baseUrl
) else (
    echo   ✓ tsconfig.json has baseUrl
)

echo.
echo [8/8] Checking package.json scripts...
findstr /C:"\"build\"" "package.json" >nul
if errorlevel 1 (
    echo   ❌ package.json missing build script
) else (
    echo   ✓ package.json has build script
)

echo.
echo ================================================
echo    AUDIT COMPLETE
echo ================================================
echo.
pause


