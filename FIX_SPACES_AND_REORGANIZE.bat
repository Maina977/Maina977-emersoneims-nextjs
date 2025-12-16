@echo off
title Fix Spaces and Reorganize Structure
color 0B
echo ================================================
echo    FIXING SPACES AND REORGANIZING
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/6] Finding files/folders with spaces...
echo.
echo Files/folders with spaces that need fixing:
dir /B /S "app\app\* *" 2>nul
dir /B /S "app\app\*page.tsx" 2>nul
echo.

echo [2/6] Creating backup of app/app/...
if exist "app\app_backup" rmdir /S /Q "app\app_backup"
xcopy "app\app" "app\app_backup\" /E /I /Y /Q >nul 2>&1
echo ✓ Backup created

echo.
echo [3/6] Moving files from app/app/ to app/ (handling spaces)...
for /R "app\app" %%F in (*.tsx *.ts *.jsx *.js *.json) do (
    set "source=%%F"
    set "relative=!source:app\app\=!"
    set "target=app\!relative!"
    
    rem Create target directory if it doesn't exist
    for %%P in ("!target!") do (
        if not exist "%%~dP%%~pP" mkdir "%%~dP%%~pP"
    )
    
    rem Copy file (quoted to handle spaces)
    copy /Y "!source!" "!target!" >nul 2>&1
)
echo ✓ Files moved (spaces handled)

echo.
echo [4/6] Moving data folder...
if exist "app\app\data" (
    if exist "app\data" rmdir /S /Q "app\data"
    xcopy "app\app\data" "app\data\" /E /I /Y >nul 2>&1
    echo ✓ Data folder moved
)

echo.
echo [5/6] Fixing all import paths (handling spaces)...
powershell -Command "$files = Get-ChildItem -Path 'app' -Recurse -Include *.ts,*.tsx,*.js,*.jsx; foreach ($file in $files) { $content = [IO.File]::ReadAllText($file.FullName); $content = $content -replace '@/app/components', '@/components'; $content = $content -replace '@/app/componets', '@/componets'; $content = $content -replace '@/app/lib', '@/lib'; $content = $content -replace '@/app/app/data', '@/app/data'; $content = $content -replace '@/app/styles', '@/styles'; [IO.File]::WriteAllText($file.FullName, $content) }"
echo ✓ Import paths fixed

echo.
echo [6/6] Removing nested app/app/ folder...
if exist "app\app" (
    rmdir /S /Q "app\app"
    if exist "app\app" (
        echo WARNING: app/app still exists - may contain locked files
    ) else (
        echo ✓ Nested folder removed
    )
)

echo.
echo ================================================
echo   ✅ REORGANIZATION COMPLETE!
echo ================================================
echo.
echo Note: Files with spaces in names are preserved.
echo If you encounter issues, check app/app_backup/
echo.
pause













