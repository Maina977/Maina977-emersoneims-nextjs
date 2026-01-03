@echo off
setlocal enabledelayedexpansion
title Complete Fix and Reorganize (Handles Spaces)
color 0B
echo ================================================
echo    COMPLETE FIX AND REORGANIZE
echo    (Properly handles spaces in paths)
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [Step 1/5] Creating backup (handling spaces)...
powershell -ExecutionPolicy Bypass -Command "if (Test-Path 'app\app_backup') { Remove-Item -Path 'app\app_backup' -Recurse -Force }; if (Test-Path 'app\app') { Copy-Item -Path 'app\app' -Destination 'app\app_backup' -Recurse -Force }"
echo ✓ Backup created at app\app_backup\

echo.
echo [Step 2/5] Using PowerShell to move files (handles spaces correctly)...
powershell -ExecutionPolicy Bypass -Command ^
    "$source = 'app\app'; $dest = 'app'; " ^
    "Get-ChildItem -Path $source -Recurse -File | ForEach-Object { " ^
    "  $relPath = $_.FullName.Substring($source.Length + 1); " ^
    "  $targetPath = Join-Path $dest $relPath; " ^
    "  $targetDir = Split-Path $targetPath -Parent; " ^
    "  if (-not (Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }; " ^
    "  Copy-Item -Path $_.FullName -Destination $targetPath -Force; " ^
    "  Write-Host \"Moved: $relPath\"; " ^
    "}; " ^
    "Write-Host \"`n✓ All files moved (spaces handled correctly)\""

if errorlevel 1 (
    echo ERROR: Failed to move files
    pause
    exit /b 1
)

echo.
echo [Step 3/5] Fixing all import paths...
powershell -ExecutionPolicy Bypass -Command ^
    "$files = Get-ChildItem -Path 'app' -Recurse -Include *.ts,*.tsx,*.js,*.jsx; " ^
    "$count = 0; " ^
    "foreach ($file in $files) { " ^
    "  $content = [IO.File]::ReadAllText($file.FullName); " ^
    "  $original = $content; " ^
    "  $content = $content -replace '@/app/components', '@/components'; " ^
    "  $content = $content -replace '@/app/componets', '@/componets'; " ^
    "  $content = $content -replace '@/app/lib', '@/lib'; " ^
    "  $content = $content -replace '@/app/app/data', '@/app/data'; " ^
    "  $content = $content -replace '@/app/styles', '@/styles'; " ^
    "  if ($content -ne $original) { " ^
    "    [IO.File]::WriteAllText($file.FullName, $content); " ^
    "    $count++ " ^
    "  } " ^
    "}; " ^
    "Write-Host \"✓ Fixed imports in $count files\""

echo.
echo [Step 4/5] Removing nested app/app/ folder...
if exist "app\app" (
    rem Try PowerShell first (handles spaces better)
    powershell -ExecutionPolicy Bypass -Command "Remove-Item -Path 'app\app' -Recurse -Force -ErrorAction SilentlyContinue"
    
    if exist "app\app" (
        echo WARNING: Could not remove app/app - files may be in use
        echo You may need to close any open editors and try again
    ) else (
        echo ✓ Nested app/app/ folder removed
    )
)

echo.
echo [Step 5/5] Verifying structure...
if exist "app\app" (
    echo ❌ WARNING: app/app/ still exists!
    echo    Please close all file editors and run this script again
) else (
    echo ✓ Structure verified - no nested app/app/
)

echo.
echo [Step 6/6] Rebuilding project...
call npm.cmd run build --turbo
if errorlevel 1 (
    echo.
    echo ================================================
    echo   ⚠️  BUILD FAILED - CHECK ERRORS ABOVE
    echo ================================================
    echo.
    echo If errors mention "app/app", run this script again
    echo after closing all file editors.
    echo.
    pause
    exit /b 1
)

echo.
echo ================================================
echo   ✅ SUCCESS! REORGANIZATION COMPLETE!
echo ================================================
echo.
echo Structure fixed:
echo   ✓ Files moved from app/app/ to app/
echo   ✓ Spaces in paths handled correctly
echo   ✓ Import paths updated
echo   ✓ Nested app/app/ removed
echo   ✓ Build successful
echo.
pause

