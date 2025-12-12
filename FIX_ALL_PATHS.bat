@echo off
title VERIFY ALL PATHS - Ensure Consistency
color 0A
echo ================================================
echo    VERIFYING ALL PATHS ARE CORRECT
echo ================================================
echo.
echo Correct path: C:\Users\PC\my-app (uppercase PC)
echo.

cd /d "C:\Users\PC\my-app"

if not exist "package.json" (
    echo ❌ ERROR: Not in project directory!
    echo    Current: %CD%
    echo    Expected: C:\Users\PC\my-app
    pause
    exit /b 1
)

echo ✓ In correct project directory: %CD%
echo.

echo [1/3] Checking .bat files for incorrect paths...
for %%f in (*.bat) do (
    findstr /C:"C:\Users\Pc\my-app" "%%f" >nul 2>&1
    if not errorlevel 1 (
        echo   ⚠️  Found incorrect path in %%f - fixing...
        powershell -Command "(Get-Content '%%f') -replace 'C:\\Users\\Pc\\my-app', 'C:\Users\PC\my-app' | Set-Content '%%f'"
    )
)

echo.
echo [2/3] Checking .md files for incorrect paths...
for %%f in (*.md) do (
    findstr /C:"C:\Users\Pc\my-app" "%%f" >nul 2>&1
    if not errorlevel 1 (
        echo   ⚠️  Found incorrect path in %%f - fixing...
        powershell -Command "(Get-Content '%%f') -replace 'C:\\Users\\Pc\\my-app', 'C:\Users\PC\my-app' | Set-Content '%%f'"
    )
)

echo.
echo [3/3] Checking PowerShell scripts...
for %%f in (*.ps1) do (
    findstr /C:"C:\Users\Pc\my-app" "%%f" >nul 2>&1
    if not errorlevel 1 (
        echo   ⚠️  Found incorrect path in %%f - fixing...
        powershell -Command "(Get-Content '%%f') -replace 'C:\\Users\\Pc\\my-app', 'C:\Users\PC\my-app' | Set-Content '%%f'"
    )
)

echo.
echo ================================================
echo    ✅ PATH VERIFICATION COMPLETE!
echo ================================================
echo.
echo All files verified to use: C:\Users\PC\my-app
echo.
pause

