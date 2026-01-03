@echo off
title Complete Reorganization
color 0B
echo ================================================
echo    COMPLETE REORGANIZATION
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/5] Fixing all import paths in app/app/...
powershell -ExecutionPolicy Bypass -File "FIX_IMPORTS_BULK.ps1"
echo ✓ Imports fixed

echo.
echo [2/5] Moving files from app/app/ to app/ (handling spaces)...
powershell -ExecutionPolicy Bypass -Command "$source = 'app\app'; $dest = 'app'; Get-ChildItem -Path $source -Recurse -File | ForEach-Object { $relPath = $_.FullName.Substring($source.Length + 1); $targetPath = Join-Path $dest $relPath; $targetDir = Split-Path $targetPath -Parent; if (-not (Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }; Copy-Item -Path $_.FullName -Destination $targetPath -Force }"
echo ✓ Files moved (spaces handled correctly)

echo.
echo [3/5] Removing nested app/app/ folder...
powershell -ExecutionPolicy Bypass -Command "Remove-Item -Path 'app\app' -Recurse -Force -ErrorAction SilentlyContinue"
if exist "app\app" (
    echo WARNING: app/app still exists
) else (
    echo ✓ Nested folder removed
)

echo.
echo [4/5] Fixing remaining imports in app/...
powershell -Command "$files = Get-ChildItem -Path 'app' -Recurse -Include *.ts,*.tsx,*.js,*.jsx; foreach ($file in $files) { $content = [IO.File]::ReadAllText($file.FullName); $content = $content -replace '@/app/components', '@/components'; $content = $content -replace '@/app/componets', '@/componets'; $content = $content -replace '@/app/lib', '@/lib'; $content = $content -replace '@/app/app/data', '@/app/data'; $content = $content -replace '@/app/styles', '@/styles'; [IO.File]::WriteAllText($file.FullName, $content) }"
echo ✓ All imports fixed

echo.
echo [5/5] Rebuilding project...
call npm.cmd run build
if errorlevel 1 (
    echo.
    echo ================================================
    echo   ⚠️  BUILD FAILED
    echo ================================================
    pause
    exit /b 1
)

echo.
echo ================================================
echo   ✅ SUCCESS! REORGANIZATION COMPLETE!
echo ================================================
pause

