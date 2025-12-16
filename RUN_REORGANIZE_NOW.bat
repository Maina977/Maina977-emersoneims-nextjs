@echo off
title RUN REORGANIZATION NOW
color 0B
echo ================================================
echo    REORGANIZATION SCRIPT
echo ================================================
echo.
echo This script will:
echo   1. Move files from app/app/ to app/ (handles spaces)
echo   2. Fix all import paths
echo   3. Remove nested app/app/ folder
echo   4. Rebuild the project
echo.
echo Make sure all file editors are closed before proceeding!
echo.
pause

call "COMPLETE_FIX_AND_REORGANIZE.bat"













