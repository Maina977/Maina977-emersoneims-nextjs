@echo off
title Check All Common Mistakes
color 0E
echo ================================================
echo    CHECKING ALL COMMON MISTAKES
echo ================================================
echo.

cd /d "C:\Users\PC\my-app"

echo [1/6] Checking package.json build script...
findstr /C:"\"build\"" "package.json" >nul
if errorlevel 1 (
    echo   ❌ MISSING: "build" script in package.json
    echo   ACTION: Add "build": "next build" to scripts
) else (
    echo   ✓ package.json has "build" script
    findstr /C:"\"build\"" "package.json"
)

echo.
echo [2/6] Checking SEOHead keywords in contact page...
findstr /C:"keywords=" "app\contact\page.tsx" >nul
if errorlevel 1 (
    echo   ❌ MISSING: keywords prop in app/contact/page.tsx
    echo   ACTION: Add keywords="..." to SEOHead component
) else (
    echo   ✓ app/contact/page.tsx has keywords prop
    findstr /C:"keywords=" "app\contact\page.tsx"
)

echo.
echo [3/6] Checking SEOHead keywords in service page...
findstr /C:"keywords=" "app\service\page.tsx" >nul
if errorlevel 1 (
    echo   ❌ MISSING: keywords prop in app/service/page.tsx
    echo   ACTION: Add keywords="..." to SEOHead component
) else (
    echo   ✓ app/service/page.tsx has keywords prop
    findstr /C:"keywords=" "app\service\page.tsx"
)

echo.
echo [4/6] Checking SectionLead export...
findstr /C:"export default" "app\components\generators\SectionLead.tsx" >nul
if errorlevel 1 (
    echo   ❌ MISSING: export default in SectionLead.tsx
    echo   ACTION: Add export default function SectionLead
) else (
    echo   ✓ SectionLead.tsx has export default
)

echo.
echo [5/6] Checking for locked Node.js processes...
tasklist /FI "IMAGENAME eq node.exe" 2>nul | find /I "node.exe" >nul
if errorlevel 1 (
    echo   ✓ No Node.js processes running (folders should not be locked)
) else (
    echo   ⚠️  WARNING: Node.js processes are running
    echo   ACTION: Run KILL_NODE_PROCESSES.bat to release locks
    tasklist /FI "IMAGENAME eq node.exe"
)

echo.
echo [6/6] Checking .next folder lock status...
if exist ".next" (
    echo   ⚠️  .next folder exists
    echo   Checking if locked...
    dir ".next" >nul 2>&1
    if errorlevel 1 (
        echo   ❌ .next folder is LOCKED
        echo   ACTION: Run KILL_NODE_PROCESSES.bat and close editors
    ) else (
        echo   ✓ .next folder accessible (not locked)
    )
) else (
    echo   ✓ .next folder does not exist (will be created on build)
)

echo.
echo ================================================
echo    CHECK COMPLETE
echo ================================================
echo.
pause













