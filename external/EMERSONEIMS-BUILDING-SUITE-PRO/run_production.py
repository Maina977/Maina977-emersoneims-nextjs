"""
Production runner for EMERSON EIMS Building Suite Pro.

Uses Waitress (production-grade WSGI server) instead of Flask's built-in dev server.
Run this — NOT `python app_professional.py` — when serving real traffic.

Usage:
    python run_production.py

Environment variables:
    EIMS_HOST   (default 127.0.0.1) — bind address. Use 0.0.0.0 only if you
                intend the app to be reachable from other machines, and
                only behind a reverse proxy + TLS.
    EIMS_PORT   (default 5000)
    EIMS_THREADS (default 8) — worker thread count.
"""
import os
from waitress import serve

os.environ['EIMS_DEBUG'] = '0'
from app_professional import app

host = os.environ.get('EIMS_HOST', '127.0.0.1')
port = int(os.environ.get('EIMS_PORT', '5000'))
threads = int(os.environ.get('EIMS_THREADS', '8'))

print(f'EIMS production server (waitress) on http://{host}:{port} threads={threads}')
serve(app, host=host, port=port, threads=threads, ident='EIMS')
