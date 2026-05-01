@echo off
REM AquaScan Pro — Validation Pipeline Launcher (GLOBAL)
REM Uses Anaconda Python at G:\anaconda3
REM Coverage: 80+ countries via WPdx+, NASA POWER, ISRIC SoilGrids, Open-Elevation
REM
REM Usage examples:
REM   validate.bat
                                             (all countries, 300 records)
REM   validate.bat --country Kenya --adm1 "Murang'a" --limit 150
REM   validate.bat --country Nigeria --limit 500
REM   validate.bat --country India --adm1 Rajasthan --limit 500
REM   validate.bat --country Bangladesh --limit 300
REM   validate.bat --country Cambodia --limit 200
REM   validate.bat --country Bolivia --limit 200
REM   validate.bat --local-csv data\local_boreholes.csv
REM   validate.bat --no-api

SET PYTHON=G:\anaconda3\python.exe
SET BACKEND=%~dp0

IF NOT EXIST "%PYTHON%" (
    echo ERROR: Python not found at %PYTHON%
    echo Please update PYTHON path in this script.
    pause
    exit /b 1
)

cd /d "%BACKEND%"
echo Running AquaScan Pro Global Validation Pipeline...
echo Python: %PYTHON%
echo Arguments: %*
echo.

"%PYTHON%" -m validation.run_validation %*

IF %ERRORLEVEL% EQU 0 (
    echo.
    echo [PASS] Accuracy target met.
) ELSE (
    echo.
    echo [FAIL] Accuracy below target - see summary.txt for details.
)
pause
