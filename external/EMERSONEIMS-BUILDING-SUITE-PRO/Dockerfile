# EmersonEIMS Building Suite Pro — production image
# Build:  docker build -t eims-bsp:2026.04 .
# Run:    docker run --rm -p 5000:5000 -v ${PWD}/uploads:/app/uploads eims-bsp:2026.04

FROM python:3.11-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    EIMS_VERSION=2026.04 \
    EIMS_UPLOAD_FOLDER=/app/uploads

WORKDIR /app

# System packages required by reportlab fonts and PDF rendering
RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        libfreetype6 \
        libjpeg62-turbo \
        zlib1g \
    && rm -rf /var/lib/apt/lists/*

# Install Python deps first for layer caching.
# Linux-only extras (gunicorn) are installed here; Windows devs use waitress via run_production.py.
COPY requirements.txt ./
RUN pip install --upgrade pip \
    && pip install -r requirements.txt \
    && pip install gunicorn

# Copy application code
COPY app_professional.py run_production.py ./
COPY eims_modules/ ./eims_modules/
COPY eims_console.html interactive_wizard.html step_by_step_wizard.html ./

# Static / runtime dirs
RUN mkdir -p /app/uploads && chmod 755 /app/uploads

# Compile-time validation -- fail fast if anything is broken
RUN python -m py_compile app_professional.py \
    && python -m py_compile $(ls eims_modules/*.py)

# Drop privileges
RUN useradd --create-home --uid 1000 eims && chown -R eims:eims /app
USER eims

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD python -c "import urllib.request,sys; \
        sys.exit(0 if urllib.request.urlopen('http://localhost:5000/api/health',timeout=3).status==200 else 1)"

# Production entry: gunicorn with sane defaults
CMD ["gunicorn", "--bind", "0.0.0.0:5000", \
     "--workers", "3", "--threads", "4", \
     "--timeout", "60", "--access-logfile", "-", \
     "app_professional:app"]
