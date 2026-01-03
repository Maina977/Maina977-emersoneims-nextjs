@echo off
title Revert to Incremental Builds
color 0E
echo ================================================
echo    REVERTING TO INCREMENTAL BUILDS
echo ================================================
echo.
echo This will change "incremental": false to true
echo for faster development builds.
echo.
echo WARNING: Only do this AFTER a successful build!
echo.
pause

cd /d "C:\Users\PC\my-app"

powershell -Command "$content = Get-Content 'tsconfig.json' -Raw; $content = $content -replace '\"incremental\":\s*false', '\"incremental\": true'; Set-Content 'tsconfig.json' -Value $content -NoNewline"

if errorlevel 1 (
    echo   ❌ Failed to update tsconfig.json
) else (
    echo   ✓ tsconfig.json updated
    echo   ✓ incremental: true (faster dev builds enabled)
)

echo.
pause















