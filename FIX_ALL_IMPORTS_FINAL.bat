@echo off
title Fix All Import Paths - Final
color 0B
echo ================================================
echo    FIXING ALL IMPORT PATHS
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/6] Fixing contact page imports...
powershell -Command "$c = Get-Content 'app\contact\page.tsx' -Raw; $c = $c -replace '@/components/contact/', '@/app/components/contact/'; Set-Content 'app\contact\page.tsx' -Value $c"
echo ✓ Contact page fixed

echo.
echo [2/6] Fixing generators page data imports...
powershell -Command "$c = Get-Content 'app\generators\page.tsx' -Raw; $c = $c -replace '@/lib/data/', '@/app/lib/data/'; Set-Content 'app\generators\page.tsx' -Value $c"
echo ✓ Generators page fixed

echo.
echo [3/6] Fixing diagnostics CSS import...
powershell -Command "$c = Get-Content 'app\diagnostics\page.tsx' -Raw; $c = $c -replace '@/styles/', '@/app/styles/'; Set-Content 'app\diagnostics\page.tsx' -Value $c"
echo ✓ Diagnostics page fixed

echo.
echo [4/6] All other imports use @/componets/ (correct - typo folder exists)
echo ✓ Service, diagnostics, generators imports already correct

echo.
echo [5/6] Building project...
call npm.cmd run build
if errorlevel 1 (
    echo.
    echo ❌ Build failed - check errors above
    echo.
    echo Common fixes:
    echo - Verify all files exist in app/components/contact/
    echo - Verify app/lib/data/ files exist
    echo - Verify app/styles/diagnostics.css exists
    pause
    exit /b 1
) else (
    echo.
    echo ✅ BUILD SUCCESSFUL!
)

echo.
echo [6/6] All imports fixed!
pause













