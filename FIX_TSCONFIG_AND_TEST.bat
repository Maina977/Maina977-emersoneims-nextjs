@echo off
title Fix tsconfig.json Path Mapping & Test Build
color 0B
echo ================================================
echo    FIX: Update tsconfig.json Path Mapping
echo    @/* now maps to ./app/* (App Router convention)
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/3] Checking current tsconfig.json...
findstr /C:"@/*" tsconfig.json
echo.

echo [2/3] Fixing imports in contact page...
powershell -Command "if (Test-Path 'app\contact\page.tsx') { $c = [System.IO.File]::ReadAllText('app\contact\page.tsx'); $c = $c -replace '@/app/components/contact/', '@/components/contact/'; [System.IO.File]::WriteAllText('app\contact\page.tsx', $c); Write-Host '✓ Contact page fixed' }"

powershell -Command "if (Test-Path 'app\generators\page.tsx') { $c = [System.IO.File]::ReadAllText('app\generators\page.tsx'); $c = $c -replace '@/app/lib/data/', '@/lib/data/'; [System.IO.File]::WriteAllText('app\generators\page.tsx', $c); Write-Host '✓ Generators page fixed' }"

powershell -Command "if (Test-Path 'app\diagnostics\page.tsx') { $c = [System.IO.File]::ReadAllText('app\diagnostics\page.tsx'); $c = $c -replace '@/app/styles/', '@/styles/'; [System.IO.File]::WriteAllText('app\diagnostics\page.tsx', $c); Write-Host '✓ Diagnostics page fixed' }"

echo.
echo [3/3] Testing build with fixed path mapping...
echo.
call npm.cmd run build

if errorlevel 1 (
    echo.
    echo ================================================
    echo    ❌ BUILD FAILED - Check errors above
    echo ================================================
) else (
    echo.
    echo ================================================
    echo    ✅ BUILD SUCCESSFUL!
    echo ================================================
    echo.
    echo Path mapping fixed: @/* → ./app/*
    echo All imports now resolve correctly.
)

echo.
pause





