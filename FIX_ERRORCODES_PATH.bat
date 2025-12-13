@echo off
title Fix errorCodes.json Path
color 0A
echo ================================================
echo    FIXING ERRORCODES.JSON PATH
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/3] Creating app\data\diagnostic directory if needed...
if not exist "app\data" mkdir "app\data"
if not exist "app\data\diagnostic" mkdir "app\data\diagnostic"
echo   ✓ Directory created/verified

echo.
echo [2/3] Copying errorCodes.json to correct location...

if exist "public\data\diagnostic\errorCodes.json" (
    copy /Y "public\data\diagnostic\errorCodes.json" "app\data\diagnostic\errorCodes.json" >nul
    echo   ✓ Copied from public\data\diagnostic\errorCodes.json
) else if exist "app\app\data\diagnostic\errorCodes.json" (
    copy /Y "app\app\data\diagnostic\errorCodes.json" "app\data\diagnostic\errorCodes.json" >nul
    echo   ✓ Copied from app\app\data\diagnostic\errorCodes.json
) else (
    echo   ⚠️  Source file not found, checking data\diagnostic...
    if exist "data\diagnostic\errorCodes.json" (
        copy /Y "data\diagnostic\errorCodes.json" "app\data\diagnostic\errorCodes.json" >nul
        echo   ✓ Copied from data\diagnostic\errorCodes.json
    ) else (
        echo   ❌ errorCodes.json not found in any location
        echo   Please ensure the file exists
        pause
        exit /b 1
    )
)

echo.
echo [3/3] Verifying import path in UniversalDiagnosticMachine.jsx...
findstr /C:"@/app/data/diagnostic/errorCodes.json" "app\components\diagnostics\UniversalDiagnosticMachine.jsx" >nul
if errorlevel 1 (
    echo   ⚠️  Import path may need updating
    echo   Current import should be: @/app/data/diagnostic/errorCodes.json
) else (
    echo   ✓ Import path is correct: @/app/data/diagnostic/errorCodes.json
)

echo.
echo ================================================
echo    ✅ PATH FIX COMPLETE
echo ================================================
echo.
echo File location: app\data\diagnostic\errorCodes.json
echo Import path: @/app/data/diagnostic/errorCodes.json
echo.
pause





