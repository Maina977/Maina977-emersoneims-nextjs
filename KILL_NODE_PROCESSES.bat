@echo off
title Kill All Node.js Processes
color 0C
echo ================================================
echo    KILLING ALL NODE.JS PROCESSES
echo ================================================
echo.

echo Stopping all Node.js processes...
taskkill /f /im node.exe >nul 2>&1
if errorlevel 1 (
    echo   ✓ No Node.js processes running
) else (
    echo   ✓ Node.js processes terminated
)

echo.
echo Waiting 2 seconds for processes to release locks...
timeout /t 2 /nobreak >nul

echo.
echo ================================================
echo    PROCESSES KILLED - LOCKS RELEASED
echo ================================================
echo.
pause


