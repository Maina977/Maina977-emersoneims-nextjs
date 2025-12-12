@echo off
title FIX componets Typo - Complete Fix
color 0A
echo ================================================
echo    FIXING componets TYPO - COMPLETE FIX
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/6] Checking folder structure...
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
echo [2/6] Renaming folder app\componets to app\components...
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
        echo   Please manually delete app\componets\ after closing all editors
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
echo [3/6] Updating all imports in code files...
powershell -Command "$files = Get-ChildItem -Path 'app' -Recurse -Include *.ts,*.tsx,*.js,*.jsx; $count = 0; foreach ($file in $files) { $content = [IO.File]::ReadAllText($file.FullName); $original = $content; $content = $content -replace '@/componets/', '@/app/components/'; $content = $content -replace 'from \"@/componets/', 'from \"@/app/components/'; $content = $content -replace 'from ''@/componets/', 'from ''@/app/components/'; if ($content -ne $original) { [IO.File]::WriteAllText($file.FullName, $content); $count++; Write-Host \"  Fixed: $($file.Name)\" } }; Write-Host \"  ✓ Updated $count files\""
if errorlevel 1 (
    echo   ⚠️  PowerShell script failed
) else (
    echo   ✓ All imports updated
)

echo.
echo [4/6] Updating tsconfig.json...
powershell -Command "$content = Get-Content 'tsconfig.json' -Raw; $content = $content -replace '\"@/componets/\*\":\\s*\\[\"./app/componets/\*\"\\]', '\"@/app/components/*\": [\"./app/components/*\"]'; $content = $content -replace 'app/componets', 'app/components'; Set-Content 'tsconfig.json' -Value $content -NoNewline"
if errorlevel 1 (
    echo   ⚠️  Failed to update tsconfig.json
) else (
    echo   ✓ tsconfig.json updated
)

echo.
echo [5/6] Updating next.config.ts...
powershell -Command "$content = Get-Content 'next.config.ts' -Raw; $content = $content -replace '@/componets', '@/app/components'; $content = $content -replace 'app/componets', 'app/components'; Set-Content 'next.config.ts' -Value $content -NoNewline"
if errorlevel 1 (
    echo   ⚠️  Failed to update next.config.ts
) else (
    echo   ✓ next.config.ts updated
)

echo.
echo [6/6] Verifying changes...
findstr /S /C:"@/componets" "app\*.tsx" "app\*.ts" "app\*.jsx" "app\*.js" 2>nul | findstr /V "node_modules" | findstr /V ".next" | findstr /V "app\PC\"
if errorlevel 1 (
    echo   ✓ No remaining @/componets imports found
) else (
    echo   ⚠️  Some imports may still need manual fixing
)

echo.
echo ================================================
echo    ✅ TYPO FIX COMPLETE
echo ================================================
echo.
echo Changes made:
echo 1. Renamed app\componets\ to app\components\
echo 2. Updated all imports: @/componets/ → @/app/components/
echo 3. Updated tsconfig.json
echo 4. Updated next.config.ts
echo.
echo Next step: Run BUILD.bat to verify everything works
echo.
pause


