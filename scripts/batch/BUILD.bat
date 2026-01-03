@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   BUILD SCRIPT — C:\Users\PC\my-app
echo ========================================

cd /d "C:\Users\PC\my-app"
if %ERRORLEVEL% NEQ 0 (
    echo ❌ FAILED: Could not enter C:\Users\PC\my-app
    exit /b 1
)

echo [1/5] ✅ Working directory: %CD%

:: 2. Fix folder typo: componets → components
if exist "app\componets" (
    echo [2/5] 🛠️  Renaming 'app\componets' to 'app\components'...
    ren "app\componets" "components" >nul 2>&1
    if exist "app\components" (
        echo      ✅ Renamed successfully.
    ) else (
        echo      ⚠️  Failed to rename — check permissions.
    )
)

:: 3. Ensure react-hook-form is installed
echo [3/5] 🔍 Checking react-hook-form...
npm list react-hook-form --depth=0 | findstr /C:"react-hook-form@7.53.0" >nul
if %ERRORLEVEL% NEQ 0 (
    echo      ❌ Not found — installing...
    npm install react-hook-form@7.53.0 --legacy-peer-deps --no-fund --silent
    if %ERRORLEVEL% NEQ 0 (
        echo      ❌ Install failed. Aborting.
        exit /b 1
    )
    echo      ✅ Installed.
) else (
    echo      ✅ Already installed.
)

:: 4. Auto-patch HeroCanvas.tsx if exists and unpatched
set "FILE=app\components\HeroCanvas.tsx"
if exist "%FILE%" (
    echo [4/5] 🛠️  Checking %FILE% for JSX.IntrinsicElements recursion...
    findstr /C:"declare global {" "%FILE%" >nul
    if %ERRORLEVEL% EQU 0 (
        echo      🔧 Patching problematic JSX augmentation...
        (
            echo import type { ReactNode } from 'react'
            echo.
            echo // Patched for React 19 compatibility
            echo declare module 'react' {
            echo   namespace JSX {
            echo     interface IntrinsicElements {
            echo       ambientLight: any;
            echo       pointLight: any;
            echo       directionalLight: any;
            echo       mesh: any;
            echo       primitive: any;
            echo       // Add other Three.js elements as needed
            echo     }
            echo   }
            echo }
        ) > "%TEMP%\HeroCanvas.patched.tsx"

        :: Preserve non-declaration code (imports, component logic)
        findstr /v /c:"declare global {" /c:"namespace JSX {" /c:"interface IntrinsicElements {" /c:"}" "%FILE%" | findstr /v /r "^$" >> "%TEMP%\HeroCanvas.patched.tsx"

        move /y "%TEMP%\HeroCanvas.patched.tsx" "%FILE%" >nul
        echo      ✅ Patched successfully.
    ) else (
        echo      ✅ Already patched or not using legacy augmentation.
    )
)

:: 5. Build
echo [5/5] 🏗️  Running build...
npm run build > build.log 2>&1
set BUILD_EXIT=%ERRORLEVEL%

echo.
if %BUILD_EXIT% EQU 0 (
    echo ========================================
    echo   ✅ BUILD SUCCESSFUL
    echo   🌐 Ready to deploy: npm run start
    echo ========================================
    exit /b 0
) else (
    echo ========================================
    echo   ❌ BUILD FAILED — Summary:
    echo ========================================
    findstr /i /c:"error" /c:"failed" /c:"module not found" /c:"type error" build.log
    echo.
    echo 🔍 Full log: build.log
    exit /b %BUILD_EXIT%
)














