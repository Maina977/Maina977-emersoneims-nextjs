@echo off
REM ============================================
REM Borehole AI Platform - Quick Start Script
REM ============================================

echo.
echo ======================================
echo BOREHOLE AI PLATFORM - API SERVER
echo ======================================
echo.

cd /d "%~dp0"

echo [1/4] Checking Python...
python --version

echo [2/4] Activating environment (if venv exists)...
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
    echo ✓ Virtual environment activated
) else (
    echo ⚠ No venv found - using system Python
)

echo [3/4] Installing dependencies...
pip install -q -r requirements/base.txt
echo ✓ Dependencies installed

echo.
echo ======================================
echo [4/4] Starting FastAPI Server...
echo ======================================
echo.
echo 🚀 Server starting on http://localhost:8000
echo.
echo 📚 Interactive API Docs:
echo    http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop
echo.

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
