@echo off
echo Fixing import paths...
cd /d "C:\Users\PC\my-app"

REM Since baseUrl is "." and @/* maps to ./*, we need to check the actual paths
REM Contact components are in app/components/contact/
REM So @/app/components/contact/ should work
REM But let's verify the actual structure first

echo Checking file structure...
dir /b /s app\components\contact\*.jsx | findstr /i "SEOHead ErrorBoundary"
if errorlevel 1 (
    echo ERROR: Contact components not found in app/components/contact/
    pause
    exit /b 1
)

echo Files found! Imports should be correct.
echo.
echo Running build test...
call npm.cmd run build

pause















