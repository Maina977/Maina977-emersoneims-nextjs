@echo off
REM QUICK IMAGE PROCESSING SCRIPT
REM Processes all images with Hollywood color grading and 4K resolution

echo.
echo ========================================
echo   PROCESSING IMAGES WITH CINEMATIC
echo   COLOR GRADING AND 4K RESOLUTION
echo ========================================
echo.

REM Check if Sharp is installed
node -e "require('sharp')" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing Sharp image processing library...
    call npm install sharp --save-dev --legacy-peer-deps
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install Sharp
        pause
        exit /b 1
    )
)

echo.
echo Starting image processing...
echo This will process all images in public/images/premium/
echo Output will be saved to public/images/premium/processed/
echo.

REM Process images
call npm run process:images

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCCESS!
    echo ========================================
    echo.
    echo All images have been processed with:
    echo   - 4K Resolution (3840x2160)
    echo   - Hollywood Color Grading
    echo   - Advanced Sharpening
    echo   - Brightness ^& Contrast Optimization
    echo   - WebP Conversion
    echo.
    echo Processed images: public/images/premium/processed/
    echo.
    echo To watch for new images automatically:
    echo   npm run watch:images
    echo.
) else (
    echo.
    echo ========================================
    echo   ERROR OCCURRED
    echo ========================================
    echo.
    echo Please check the error messages above.
    echo.
)

pause
