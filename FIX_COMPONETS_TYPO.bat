@echo off
title FIX componets Typo - Rename to components
color 0A
echo ================================================
echo    FIXING componets TYPO
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/5] Checking folder structure...
if exist "app\componets\" (
    echo   ✓ Found app\componets\ folder
) else (
    echo   ❌ app\componets\ folder not found!
    pause
    exit /b 1
)

if exist "app\components\" (
    echo   ⚠️  app\components\ already exists - will merge
) else (
    echo   ✓ app\components\ does not exist - will create
)

echo.
echo [2/5] Finding all imports from @/componets...
findstr /S /C:"@/componets" "app\*.tsx" "app\*.ts" "app\*.jsx" "app\*.js" 2>nul | findstr /V "node_modules" | findstr /V ".next"
if errorlevel 1 (
    echo   No imports found (unexpected)
) else (
    echo   Found imports that need updating
)

echo.
echo [3/5] Renaming folder app\componets to app\components...
if exist "app\components\" (
    echo   Merging app\componets\ into app\components\...
    xcopy /E /I /Y "app\componets\*" "app\components\" >nul 2>&1
    if errorlevel 1 (
        echo   ⚠️  Some files may have failed to copy
    ) else (
        echo   ✓ Files copied successfully
    )
    echo   Removing old folder...
    rd /s /q "app\componets" >nul 2>&1
    if errorlevel 1 (
        echo   ⚠️  Could not remove old folder (may be in use)
    ) else (
        echo   ✓ Old folder removed
    )
) else (
    echo   Renaming folder...
    ren "app\componets" "components" >nul 2>&1
    if errorlevel 1 (
        echo   ❌ Failed to rename folder
        pause
        exit /b 1
    ) else (
        echo   ✓ Folder renamed successfully
    )
)

echo.
echo [4/5] Updating tsconfig.json...
powershell -Command "(Get-Content 'tsconfig.json') -replace '@/componets/\*', '@/components/*' -replace 'app/componets', 'app/components' | Set-Content 'tsconfig.json'"
if errorlevel 1 (
    echo   ⚠️  Failed to update tsconfig.json
) else (
    echo   ✓ tsconfig.json updated
)

echo.
echo [5/5] Updating next.config.ts...
powershell -Command "(Get-Content 'next.config.ts') -replace '@/componets', '@/components' -replace 'app/componets', 'app/components' | Set-Content 'next.config.ts'"
if errorlevel 1 (
    echo   ⚠️  Failed to update next.config.ts
) else (
    echo   ✓ next.config.ts updated
)

echo.
echo ================================================
echo    ✅ TYPO FIX COMPLETE
echo ================================================
echo.
echo Next steps:
echo 1. Update all import statements in code files
echo 2. Run: FIND_AND_REPLACE_IMPORTS.bat
echo 3. Test build: BUILD.bat
echo.
pause















