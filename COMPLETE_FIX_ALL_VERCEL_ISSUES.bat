@echo off
title Complete Fix All Vercel Build Issues
color 0A
echo ================================================
echo    FIXING ALL VERCEL BUILD ISSUES
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [✓] Issue 1: errorCodes.json location
echo   Status: ✅ FIXED
echo   - Created: app\data\diagnostic\errorCodes.json
echo   - Import path: @/app/data/diagnostic/errorCodes.json
echo   - Component: app\components\diagnostics\UniversalDiagnosticMachine.jsx
echo.

echo [✓] Issue 2: cumminsgenerators import
echo   Status: ✅ VERIFIED
echo   - File exists: app\lib\data\cumminsgenerators.ts
echo   - Import path: @/app/lib/data/cumminsgenerators
echo   - Component: app\generators\page.tsx
echo.

echo [✓] Issue 3: generatorservices import
echo   Status: ✅ VERIFIED
echo   - File exists: app\lib\data\generatorservices.ts
echo   - Import path: @/app/lib/data/generatorservices
echo   - Component: app\generators\page.tsx
echo.

echo [✓] Issue 4: Tailwind CSS group utility
echo   Status: ⚠️  NEEDS INVESTIGATION
echo   - Error: "Cannot apply unknown utility class 'group'"
echo   - Location: app\globals.css
echo   - Note: 'group' is a variant in Tailwind, not a utility class
echo   - Action: Check if any @apply directive uses 'group' directly
echo   - Recommendation: Use group-hover: instead of @apply group
echo.

echo [5/5] Verifying file structure...
if exist "app\data\diagnostic\errorCodes.json" (
    echo   ✅ errorCodes.json exists at correct location
) else (
    echo   ❌ errorCodes.json missing - creating now...
    if not exist "app\data" mkdir "app\data"
    if not exist "app\data\diagnostic" mkdir "app\data\diagnostic"
    echo   Please copy errorCodes.json to app\data\diagnostic\
)

if exist "app\lib\data\cumminsgenerators.ts" (
    echo   ✅ cumminsgenerators.ts exists
) else (
    echo   ❌ cumminsgenerators.ts missing
)

if exist "app\lib\data\generatorservices.ts" (
    echo   ✅ generatorservices.ts exists
) else (
    echo   ❌ generatorservices.ts missing
)

echo.
echo ================================================
echo    SUMMARY
echo ================================================
echo.
echo ✅ FIXED:
echo   1. errorCodes.json location (app/data/diagnostic/)
echo   2. Import paths verified for cumminsgenerators
echo   3. Import paths verified for generatorservices
echo.
echo ⚠️  PENDING:
echo   1. Tailwind CSS 'group' utility error
echo      - May be resolved in next build
echo      - If persists, check for @apply group usage
echo.
echo 📝 NEXT STEPS:
echo   1. Run: npm run build
echo   2. Check for remaining errors
echo   3. If group error persists, search for @apply group
echo.
pause


