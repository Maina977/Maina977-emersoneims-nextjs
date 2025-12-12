@echo off
setlocal EnableDelayedExpansion
title Project Component Scanner
color 0B

set "PROJECT_DIR=C:\Users\PC\my-app"
set "TARGET_DIR=app\components"

echo.
echo ==============================================
echo        PROJECT COMPONENT SCANNER
echo ==============================================
echo Project: %PROJECT_DIR%
echo Target:  %TARGET_DIR%
echo.

echo [1/4] Navigating to project directory...
cd /d "%PROJECT_DIR%" 2>nul
if errorlevel 1 (
    echo   [ERROR] Cannot find project directory!
    goto :EOF
)
echo   ✓ Project directory found.
echo.

echo [2/4] Checking components folder...
if not exist "%TARGET_DIR%" (
    echo   [ERROR] Components folder NOT found!
    goto :EOF
)
echo   ✓ Components folder found.
echo.

echo [3/4] Listing sub-folders under %TARGET_DIR% ...
echo.
pushd "%TARGET_DIR%"
set count=0
for /d %%A in (*) do (
    set /a count+=1
    echo   [FOLDER %%count%%] %%A
)
popd
if %count%==0 (
    echo   [WARNING] No subfolders found inside "%TARGET_DIR%"
)
echo.

echo [4/4] Listing files inside "%TARGET_DIR%\contact" ...
echo.
if exist "%TARGET_DIR%\contact" (
    dir /b "%TARGET_DIR%\contact" 2>nul
) else (
    echo   [ERROR] Folder "%TARGET_DIR%\contact" does not exist.
)

echo.
echo ================================
echo DONE.
echo ================================
pause


