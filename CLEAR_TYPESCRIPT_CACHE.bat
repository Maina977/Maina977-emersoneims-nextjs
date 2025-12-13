@echo off
title Clear TypeScript Cache and Rebuild
color 0A
echo ================================================
echo    CLEARING TYPESCRIPT CACHE
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/5] Clearing Next.js cache...
if exist ".next" (
    rd /s /q ".next" >nul 2>&1
    echo   ✓ .next folder removed
) else (
    echo   ✓ .next folder not found (already clean)
)

echo.
echo [2/5] Clearing TypeScript cache...
if exist "tsconfig.tsbuildinfo" (
    del /f "tsconfig.tsbuildinfo" >nul 2>&1
    echo   ✓ tsconfig.tsbuildinfo removed
) else (
    echo   ✓ tsconfig.tsbuildinfo not found
)

if exist ".tsbuildinfo" (
    del /f ".tsbuildinfo" >nul 2>&1
    echo   ✓ .tsbuildinfo removed
) else (
    echo   ✓ .tsbuildinfo not found
)

echo.
echo [3/5] Clearing node_modules cache...
if exist "node_modules\.cache" (
    rd /s /q "node_modules\.cache" >nul 2>&1
    echo   ✓ node_modules\.cache removed
) else (
    echo   ✓ node_modules\.cache not found
)

echo.
echo [4/5] Clearing out folder...
if exist "out" (
    rd /s /q "out" >nul 2>&1
    echo   ✓ out folder removed
) else (
    echo   ✓ out folder not found
)

echo.
echo [5/5] Verifying contact page keywords...
findstr /C:"keywords=" "app\contact\page.tsx" >nul
if errorlevel 1 (
    echo   ❌ WARNING: keywords prop not found in contact page!
) else (
    echo   ✓ keywords prop found in contact page
)

echo.
echo ================================================
echo    CACHE CLEARED - READY TO BUILD
echo ================================================
echo.
echo Next step: Run npm run build
echo.
pause





