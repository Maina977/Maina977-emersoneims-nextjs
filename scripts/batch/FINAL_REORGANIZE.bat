@echo off
title Final Reorganization - Move app/app to app
color 0B
echo ================================================
echo    FINAL REORGANIZATION
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/4] Moving files from app/app/ to app/ (handling spaces)...
powershell -ExecutionPolicy Bypass -Command "$source = 'app\app'; $dest = 'app'; Get-ChildItem -Path $source -Recurse -File | ForEach-Object { $relPath = $_.FullName.Substring($source.Length + 1); $targetPath = Join-Path $dest $relPath; $targetDir = Split-Path $targetPath -Parent; if (-not (Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }; Copy-Item -Path $_.FullName -Destination $targetPath -Force }"
if errorlevel 1 (
    echo ERROR: Failed to move files
    pause
    exit /b 1
)
echo ✓ Files moved (spaces handled correctly)

echo.
echo [2/4] Removing nested app/app/ folder...
powershell -ExecutionPolicy Bypass -Command "Remove-Item -Path 'app\app' -Recurse -Force -ErrorAction SilentlyContinue"
if exist "app\app" (
    echo WARNING: app/app folder still exists
) else (
    echo ✓ Nested folder removed
)

echo.
echo [3/4] Fixing all remaining import paths...
powershell -Command "$files = Get-ChildItem -Path 'app' -Recurse -Include *.ts,*.tsx,*.js,*.jsx; foreach ($file in $files) { $content = [IO.File]::ReadAllText($file.FullName); $content = $content -replace '@/app/components', '@/components'; $content = $content -replace '@/app/componets', '@/componets'; $content = $content -replace '@/app/lib', '@/lib'; $content = $content -replace '@/app/app/data', '@/app/data'; $content = $content -replace '@/app/styles', '@/styles'; [IO.File]::WriteAllText($file.FullName, $content) }"
echo ✓ All imports fixed

echo.
echo [4/4] Rebuilding...
call npm.cmd run build --turbo
if errorlevel 1 (
    echo.
    echo ================================================
    echo   ⚠️  BUILD FAILED - CHECK ERRORS
    echo ================================================
    pause
    exit /b 1
)

echo.
echo ================================================
echo   ✅ SUCCESS! REORGANIZATION COMPLETE!
echo ================================================
pause

