# EmersonEIMS Building Suite Pro

Construction-engineering, quantity-surveying and architecture API + console.
All numeric outputs carry **standard / clause / data-source citations**;
the platform refuses to fabricate baselines and labels every model output.

---

## Quick start

### Local development (Windows / venv)
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
pip install pytest                      # test-only dep
python app_professional.py              # dev server (debug mode, Flask built-in)
```

### Local production-mode (Windows / venv)
Use this when serving real traffic or testing with `debug=False`:
```powershell
python run_production.py                # Waitress WSGI server (production-grade)
```

### Docker (recommended for real deployment)
```bash
docker compose up --build               # Runs Gunicorn inside Linux container
```

Then open:
- **`http://localhost:5000/console`** — single-page console
- `http://localhost:5000/api/docs` — Redoc API browser
- `http://localhost:5000/api/openapi.json` — OpenAPI 3.0.3 spec
- `http://localhost:5000/api/health/deep` — health + module status

---

## What's inside (22 modules / 147 API endpoints)

### Engineering
| Module | Standard | Endpoint |
|---|---|---|
| Wind loads | ASCE 7-22 / EN 1991-1-4 | `POST /api/loads/wind/asce7`, `POST /api/loads/wind/eurocode` |
| Seismic | ASCE 7-22 §12.8 / EN 1998-1 | `POST /api/loads/seismic/asce7-elf`, `POST /api/loads/seismic/eurocode8` |
| Geotechnical | Terzaghi / Meyerhof / Hansen / SPT | `POST /api/geotech/bearing/{terzaghi,meyerhof,hansen}`, `POST /api/geotech/spt/*` |
| RC design | EN 1992-1-1 | `POST /api/rc/{beam/bending,beam/shear,column/axial,slab/oneway}` |
| Steel connections | EN 1993-1-8 | `POST /api/steel/{bolt,weld,baseplate}` |

### Quantity Surveying
| Module | Standard | Endpoint |
|---|---|---|
| Live FX | exchangerate.host + open.er-api.com (24 h cache) | `GET /api/global/fx/rates`, `POST /api/global/fx/convert` |
| Materials price index | BLS WPUIP2311001 + Eurostat sts_copi_m (no fabricated baseline) | `GET /api/materials/index?region=US\|EU` |
| NRM1 cost plan | RICS NRM1 (2nd ed.) | `GET /api/qs/nrm1/template`, `POST /api/qs/nrm1/cost-plan` |
| Rate build-up | CIOB CoEP / NRM2 | `POST /api/qs/rate-buildup`, `POST /api/qs/boq/price` |
| Cashflow + valuation | Tucker S-curve / JCT / NEC | `POST /api/qs/cashflow/s-curve`, `POST /api/qs/valuation/interim` |
| Variations register | FIDIC / JCT / NEC / AIA | `POST /api/qs/variations/*` |
| Tender comparison | EU Dir 2014/24 Art. 69 abnormally-low | `POST /api/qs/tender/compare` |
| Risk Monte-Carlo | AACE RP 57R-09 (labelled `[MODEL OUTPUT]`) | `POST /api/qs/risk/monte-carlo` |
| Earned Value | PMI / ANSI / AACE 80R-13 | `POST /api/qs/evm` |
| Embodied carbon | EN 15978 / RICS WLCA — flags missing factor sources | `POST /api/qs/carbon/assess` |
| BOQ format toggle | NRM2 / CESMM4 / SMM7 / POMI | `POST /api/qs/boq/render`, `GET /api/qs/boq/formats` |

### Architecture
| Module | Standard | Endpoint |
|---|---|---|
| Daylight factor | BS EN 17037 / BS 8206-2 / CIBSE LG10 | `POST /api/arch/daylight/adf` |
| Acoustics (Sabine / Eyring) | BS 8233 / BB93 | `POST /api/arch/acoustics/{reverberation,recommended}` |
| U-value | BS EN ISO 6946:2017 | `POST /api/arch/uvalue` |
| Egress capacity | IBC 2021 §1004-1010, BS 9999, NFPA 101 | `POST /api/arch/egress`, `GET /api/arch/egress/load-factors` |
| Accessibility | ADA 2010 + UK AD M + ISO 21542:2021 | `POST /api/arch/accessibility/{check,limits}` |

### Platform
| Capability | Endpoint |
|---|---|
| Healthcheck (light + deep) | `GET /api/health`, `GET /api/health/deep` |
| Audit log (append-only JSONL) | `GET /api/admin/audit?limit=50` |
| Rate limiting (token bucket / IP) | middleware (429 + Retry-After) |
| OpenAPI 3.0.3 spec + Redoc | `GET /api/openapi.json`, `GET /api/docs` |
| PDF report (with **Data Provenance Appendix**) | `POST /api/report/pdf` |

---

## Data policy (enforced)

1. **Real authoritative sources only.** No fabricated estimates anywhere.
2. **Every numeric value is traceable** — outputs carry `code`/`clause`/`reference`.
3. **Estimates supplementing sparse records are explicitly labelled** — Monte-Carlo
   results are tagged `[MODEL OUTPUT]`; carbon factors without `factor_source` are
   reported in `data_provenance.items_missing_source`.
4. **PDF reports MUST include a Data Provenance Appendix** listing every distinct
   citation used in the document.

---

## Tests

94 pytest cases covering engineering / QS / architecture / platform modules, wiring, house designer, and sprint gap-closers:

```powershell
.\.venv\Scripts\python.exe -m pytest tests/ -v
```

Tests also run automatically in GitHub Actions on every push / PR to `main` (see [`.github/workflows/ci.yml`](.github/workflows/ci.yml)), on Python 3.11 and 3.12.

---

## Configuration (env vars)

Copy [`.env.example`](.env.example) to `.env` and edit for your environment. `.env` is gitignored.

| Var | Default | Purpose |
|---|---|---|
| `EIMS_HOST` | `127.0.0.1` | Bind address. Use `0.0.0.0` only behind a reverse proxy + TLS. |
| `EIMS_PORT` | `5000` | Listening port |
| `EIMS_THREADS` | `8` | Waitress worker threads (`run_production.py` only) |
| `EIMS_DEBUG` | `0` | Flask debug mode. MUST be `0` in production. |
| `EIMS_MAX_UPLOAD_MB` | `10` | Hard cap on request body size (DoS guard) |
| `EIMS_CORS_ORIGINS` | *(empty)* | Comma-separated list of allowed cross-origin sites |
| `EIMS_UPLOAD_FOLDER` | `./uploads` | FX cache, audit log, variations register |
| `EIMS_RATELIMIT_PER_MINUTE` | `60` | Per-IP per-route rate limit |
| `EIMS_RATELIMIT_BURST` | `20` | Burst allowance above the per-minute limit |
| `EIMS_VERSION` | `2026.04` | Reported by `/api/health` |

---

## Safety & backup

Your code is version-controlled by git and (when you push) replicated to GitHub. But some data is intentionally **not** in git:

- `eims.db` — live SQLite database (users, sessions, projects)
- `uploads/` — user uploads + audit log + `eims_projects.db`
- `.env` — secrets

These are gitignored because they are either sensitive, binary, or changing constantly. Back them up separately:

```powershell
python backup.py                                  # writes ./backups/<timestamp>/
python backup.py D:\offsite\eims                  # writes to external location
```

Schedule this weekly via Windows Task Scheduler. For production, send the output to cloud storage (OneDrive / Google Drive / S3).

---

## Security posture

- **Security headers** set on every response: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and HSTS (when HTTPS is detected).
- **Request size cap** via `EIMS_MAX_UPLOAD_MB` — blocks oversized payload DoS.
- **Rate limiting** — 60/min + burst 20 per IP per route (configurable).
- **Filename sanitization** — uploads are whitelisted by extension and stripped of path components.
- **Same-origin by default** — CORS is opt-in via `EIMS_CORS_ORIGINS`.
- **Argon2id** password hashing when available, salted SHA-256 fallback.
- **Dev server is NOT production** — run via `run_production.py` (Waitress) or Docker (Gunicorn); never expose `python app_professional.py` directly to the public internet.

---

## Architecture

```
app_professional.py        # Flask app (auth, projects, BIM, etc.)
eims_modules/              # All 22 calculation/platform modules
  fx.py  materials_index.py  wind_loads.py  seismic.py  geotech.py
  rc_design.py  steel_connections.py
  nrm1_costplan.py  rate_buildup.py  cashflow.py  variations.py
  tender_compare.py  risk_montecarlo.py  evm.py  carbon.py  boq_format.py
  daylight.py  acoustics.py  uvalue.py  egress.py  accessibility.py
  healthcheck.py  audit_log.py  rate_limit.py  openapi.py  pdf_report.py
tests/test_eims_modules.py # 28 pytest cases
eims_console.html          # /console SPA exposing all modules
Dockerfile / docker-compose.yml
```

Each module exports a single `register(app, *, auth_required=None)` and is
imported via a `try/except` block in `app_professional.py` immediately
before the `if __name__ == '__main__':` guard.
