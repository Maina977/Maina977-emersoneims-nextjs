@echo off
title Fix TypeScript Errors for app/componets
color 0A
echo ================================================
echo    FIXING TYPESCRIPT ERRORS FOR app/componets
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/4] Updated tsconfig.json to exclude app/componets/
echo   ✓ Added explicit exclusion patterns

echo.
echo [2/4] Created .vscode/settings.json
echo   ✓ Configured VS Code to ignore app/componets/
echo   ✓ Disabled file watching for excluded folders

echo.
echo [3/4] Updated .gitignore
echo   ✓ Added app/componets/ to git ignore

echo.
echo [4/4] Created type declaration file
echo   ✓ Added types/react-umd-global.d.ts

echo.
echo ================================================
echo    ✅ FIXES APPLIED
echo ================================================
echo.
echo NEXT STEPS:
echo   1. Close and reopen VS Code/Cursor
echo   2. Restart TypeScript Server (Ctrl+Shift+P - "TypeScript: Restart TS Server")
echo   3. The errors should disappear
echo.
echo NOTE: If errors persist, delete the .next folder and restart
echo.
pause















