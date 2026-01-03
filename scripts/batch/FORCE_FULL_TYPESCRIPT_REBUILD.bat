@echo off
title Force Full TypeScript Rebuild
color 0A
echo ================================================
echo    FORCING FULL TYPESCRIPT REBUILD
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/4] Disabling incremental compilation in tsconfig.json...
powershell -Command "$content = Get-Content 'tsconfig.json' -Raw; $content = $content -replace '\"incremental\":\s*true', '\"incremental\": false'; Set-Content 'tsconfig.json' -Value $content -NoNewline"
if errorlevel 1 (
    echo   ⚠️  Failed to update tsconfig.json
) else (
    echo   ✓ tsconfig.json updated (incremental: false)
)

echo.
echo [2/4] Removing TypeScript build info files...
if exist "tsconfig.tsbuildinfo" (
    del /f "tsconfig.tsbuildinfo" >nul 2>&1
    echo   ✓ tsconfig.tsbuildinfo removed
)
if exist ".tsbuildinfo" (
    del /f ".tsbuildinfo" >nul 2>&1
    echo   ✓ .tsbuildinfo removed
)

echo.
echo [3/4] Removing Next.js cache...
if exist ".next" (
    rd /s /q ".next" >nul 2>&1
    echo   ✓ .next folder removed
)

echo.
echo [4/4] Running full TypeScript rebuild...
call npm.cmd run type-check
if errorlevel 1 (
    echo   ⚠️  Type check found errors (see above)
) else (
    echo   ✓ Type check passed
)

echo.
echo ================================================
echo    FULL REBUILD COMPLETE
echo ================================================
echo.
echo Note: incremental: false forces full rebuild every time
echo To re-enable incremental builds, set incremental: true
echo.
pause















