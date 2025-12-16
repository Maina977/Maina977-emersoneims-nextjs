@echo off
title Reorganize App Structure
color 0B
echo ================================================
echo    REORGANIZING APP STRUCTURE
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/4] Moving files from app/app/ to app/...
xcopy "app\app\*" "app\" /E /I /Y
if errorlevel 1 (
    echo ERROR: Failed to copy files
    pause
    exit /b 1
)
echo ✓ Files moved

echo.
echo [2/4] Removing nested app/app/ folder...
rmdir /S /Q "app\app" 2>nul
if exist "app\app" (
    echo WARNING: app/app folder still exists, but continuing...
) else (
    echo ✓ Nested folder removed
)

echo.
echo [3/4] Fixing import paths...
powershell -Command "Get-ChildItem -Path 'app' -Recurse -Include *.ts,*.tsx,*.js,*.jsx | ForEach-Object { $content = [IO.File]::ReadAllText($_.FullName); $content = $content -replace '@/app/components', '@/components'; $content = $content -replace '@/app/componets', '@/componets'; [IO.File]::WriteAllText($_.FullName, $content) }"
if errorlevel 1 (
    echo WARNING: PowerShell command failed, but continuing...
) else (
    echo ✓ Import paths fixed
)

echo.
echo [4/4] Rebuilding project...
call npm.cmd run build
if errorlevel 1 (
    echo.
    echo ================================================
    echo   ⚠️  BUILD FAILED
    echo ================================================
    echo.
    echo Please check the errors above
    pause
    exit /b 1
)

echo.
echo ================================================
echo   ✅ SUCCESS! STRUCTURE REORGANIZED!
echo ================================================
echo.
pause













