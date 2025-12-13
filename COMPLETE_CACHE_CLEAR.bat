@echo off
title Complete Cache Clear - Force Full Rebuild
color 0A
echo ================================================
echo    COMPLETE CACHE CLEAR - FORCE FULL REBUILD
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/6] Removing Next.js cache (.next)...
if exist ".next" (
    rd /s /q ".next" >nul 2>&1
    echo   ✓ .next removed
) else (
    echo   ✓ .next not found
)

echo.
echo [2/6] Removing TypeScript build info files...
if exist "tsconfig.tsbuildinfo" (
    del /f "tsconfig.tsbuildinfo" >nul 2>&1
    echo   ✓ tsconfig.tsbuildinfo removed
)
if exist ".tsbuildinfo" (
    del /f ".tsbuildinfo" >nul 2>&1
    echo   ✓ .tsbuildinfo removed
)

echo.
echo [3/6] Removing node_modules cache...
if exist "node_modules\.cache" (
    rd /s /q "node_modules\.cache" >nul 2>&1
    echo   ✓ node_modules\.cache removed
)

echo.
echo [4/6] Removing out folder...
if exist "out" (
    rd /s /q "out" >nul 2>&1
    echo   ✓ out removed
)

echo.
echo [5/6] Verifying tsconfig.json settings...
findstr /C:"incremental" "tsconfig.json" >nul
if errorlevel 1 (
    echo   ⚠️  incremental setting not found
) else (
    echo   ✓ tsconfig.json has incremental setting
)

echo.
echo [6/6] Running full type check...
call npm.cmd run type-check
if errorlevel 1 (
    echo   ⚠️  Type check found errors
    echo   Review errors above
) else (
    echo   ✓ Type check passed
)

echo.
echo ================================================
echo    CACHE CLEARED - READY FOR BUILD
echo ================================================
echo.
echo Next: Run npm run build
echo.
pause





