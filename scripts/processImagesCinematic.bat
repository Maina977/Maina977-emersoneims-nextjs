@echo off
REM CINEMATIC IMAGE PROCESSING BATCH SCRIPT
REM Processes all images with Hollywood color grading and 4K resolution

echo.
echo ========================================
echo   CINEMATIC IMAGE PROCESSOR
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Sharp is installed
node -e "require('sharp')" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing Sharp image processing library...
    call npm install sharp --save-dev
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install Sharp
        pause
        exit /b 1
    )
)

echo Processing images in public/images/premium...
echo.

REM Process images with Hollywood preset
node scripts/processImagesCinematic.js public/images/premium public/images/premium/processed hollywood

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   PROCESSING COMPLETE!
    echo ========================================
    echo.
    echo Processed images saved to: public/images/premium/processed
    echo WebP versions also created for web optimization
    echo.
) else (
    echo.
    echo ========================================
    echo   PROCESSING FAILED!
    echo ========================================
    echo.
)

pause


