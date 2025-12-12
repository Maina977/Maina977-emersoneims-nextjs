@echo off
title Find All Contact-Related Files
color 0A
echo ================================================
echo    FINDING ALL CONTACT-RELATED FILES
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/3] Finding all page.tsx files...
echo.
dir /s /b page.tsx 2>nul

echo.
echo [2/3] Finding all files with "contact" in path or name...
echo.
dir /s /b *contact* 2>nul | findstr /i "page.tsx"

echo.
echo [3/3] Checking correct contact page location...
if exist "app\contact\page.tsx" (
    echo   ✓ FOUND: app\contact\page.tsx (CORRECT LOCATION)
    echo   File details:
    dir /B "app\contact\page.tsx"
) else (
    echo   ❌ NOT FOUND: app\contact\page.tsx
)

if exist "app\contact page.tsx" (
    echo   ⚠️  WARNING: Found app\contact page.tsx (WITH SPACE - INCORRECT)
) else (
    echo   ✓ No app\contact page.tsx found (good - no spaces)
)

echo.
echo ================================================
echo    SUMMARY
echo ================================================
echo.
echo Correct file should be: app\contact\page.tsx
echo (folder: contact, file: page.tsx - NO SPACES)
echo.
pause


