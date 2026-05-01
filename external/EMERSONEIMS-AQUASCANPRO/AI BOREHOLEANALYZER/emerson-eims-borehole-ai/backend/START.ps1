# ============================================
# Borehole AI Platform - Quick Start Script
# ============================================

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "BOREHOLE AI PLATFORM - API SERVER" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Python
Write-Host "[1/4] Checking Python..." -ForegroundColor Yellow
python --version

# Step 2: Activate venv if exists
Write-Host "[2/4] Setting up environment..." -ForegroundColor Yellow
if (Test-Path "venv\Scripts\Activate.ps1") {
    & "venv\Scripts\Activate.ps1"
    Write-Host "✓ Virtual environment activated" -ForegroundColor Green
} else {
    Write-Host "⚠ No venv found - using system Python" -ForegroundColor Yellow
}

# Step 3: Install dependencies
Write-Host "[3/4] Installing dependencies..." -ForegroundColor Yellow
pip install -q -r requirements/base.txt
Write-Host "✓ Dependencies installed" -ForegroundColor Green

# Step 4: Start server
Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "[4/4] Starting FastAPI Server..." -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Server starting on http://localhost:8000" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Interactive API Docs:" -ForegroundColor Cyan
Write-Host "   http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
