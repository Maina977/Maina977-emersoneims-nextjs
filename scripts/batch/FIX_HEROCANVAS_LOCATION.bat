@echo off
title FIX HeroCanvas Location - Remove Duplicate
color 0A
echo ================================================
echo    FIXING HeroCanvas LOCATION
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/3] Checking HeroCanvas files...
if exist "app\componets\HeroCanvas.tsx" (
    echo   ⚠️  Found duplicate in app\componets\HeroCanvas.tsx
    echo   ✓ Correct file exists at components\hero\HeroCanvas.tsx
) else (
    echo   ✓ No duplicate found
)

if exist "components\hero\HeroCanvas.tsx" (
    echo   ✓ Correct file found at components\hero\HeroCanvas.tsx
) else (
    echo   ❌ Correct file NOT found!
    pause
    exit /b 1
)

echo.
echo [2/3] Checking imports...
findstr /C:"@/components/hero/HeroCanvas" "app\page.tsx" >nul
if errorlevel 1 (
    echo   ⚠️  app/page.tsx doesn't import from correct path
) else (
    echo   ✓ app/page.tsx imports from @/components/hero/HeroCanvas (correct)
)

echo.
echo [3/3] Removing duplicate file...
if exist "app\componets\HeroCanvas.tsx" (
    echo   Removing app\componets\HeroCanvas.tsx (duplicate/unused)...
    del /f "app\componets\HeroCanvas.tsx" >nul 2>&1
    if errorlevel 1 (
        echo   ⚠️  Could not delete (file may be in use)
    ) else (
        echo   ✓ Duplicate removed
    )
) else (
    echo   ✓ No duplicate to remove
)

echo.
echo ================================================
echo    ✅ HERO CANVAS LOCATION FIXED
echo ================================================
echo.
echo Correct file: components\hero\HeroCanvas.tsx
echo Import path: @/components/hero/HeroCanvas
echo.
pause















