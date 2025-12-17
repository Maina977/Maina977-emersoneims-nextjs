@echo off
title Verify Contact Page Keywords
color 0A
echo ================================================
echo    VERIFYING CONTACT PAGE KEYWORDS
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/3] Checking file path...
if exist "app\contact\page.tsx" (
    echo   ✓ File exists at: app\contact\page.tsx
    echo   ✓ No spaces in filename
) else (
    echo   ❌ File NOT found at app\contact\page.tsx
    pause
    exit /b 1
)

echo.
echo [2/3] Checking keywords prop...
findstr /C:"keywords=" "app\contact\page.tsx" >nul
if errorlevel 1 (
    echo   ❌ keywords prop NOT found!
    echo   Checking for variations...
    findstr /C:"keyword" "app\contact\page.tsx" >nul
    if errorlevel 1 (
        echo   ❌ No keyword-related text found
    ) else (
        echo   ⚠️  Found 'keyword' but may be misspelled
    )
) else (
    echo   ✓ keywords prop found
    echo   Showing line:
    findstr /C:"keywords=" "app\contact\page.tsx"
)

echo.
echo [3/3] Verifying exact format...
findstr /C:"keywords=\"contact, Kenya, EmersonEIMS" "app\contact\page.tsx" >nul
if errorlevel 1 (
    echo   ⚠️  Keywords value may not match exact format
) else (
    echo   ✓ Keywords value matches expected format
)

echo.
echo ================================================
echo    VERIFICATION COMPLETE
echo ================================================
echo.
pause















