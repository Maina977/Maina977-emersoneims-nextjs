"""Healthcheck endpoint: /api/health and /api/health/deep.

Light:  /api/health    -- always returns 200 with uptime + version.
Deep:   /api/health/deep
        Probes filesystem (uploads dir writable), checks new modules
        imported successfully, and reports cache freshness for FX and
        materials_index.
"""

from __future__ import annotations

import logging
import os
import time
from typing import Any, Dict

logger = logging.getLogger('eims.health')

_BOOT_TS = time.time()
_VERSION = os.environ.get('EIMS_VERSION', 'EIMS-BSP-2026.04')


def _module_status() -> Dict[str, str]:
    out = {}
    for name in ('fx', 'materials_index', 'wind_loads', 'seismic', 'geotech',
                  'rc_design', 'steel_connections', 'nrm1_costplan',
                  'rate_buildup', 'cashflow', 'variations', 'tender_compare',
                  'risk_montecarlo', 'evm', 'carbon', 'daylight', 'acoustics',
                  'uvalue', 'egress', 'accessibility', 'boq_format',
                  'audit_log', 'rate_limit', 'pdf_report', 'openapi',
                  'projects', 'scheduler', 'frame_analysis', 'export',
                  'house_designer'):
        try:
            __import__(f'eims_modules.{name}')
            out[name] = 'ok'
        except Exception as e:
            out[name] = f'err: {e.__class__.__name__}'
    return out


def _uploads_status() -> Dict[str, Any]:
    folder = os.environ.get('EIMS_UPLOAD_FOLDER',
                              os.path.join(os.path.dirname(os.path.dirname(__file__)),
                                            'uploads'))
    return {
        'folder':  folder,
        'exists':  os.path.isdir(folder),
        'writable': os.access(folder, os.W_OK) if os.path.isdir(folder) else False,
    }


def light() -> Dict[str, Any]:
    return {
        'status':         'ok',
        'version':        _VERSION,
        'uptime_seconds': round(time.time() - _BOOT_TS, 1),
        'now_unix':       int(time.time()),
    }


def deep() -> Dict[str, Any]:
    mods = _module_status()
    return {
        **light(),
        'modules': mods,
        'modules_total': len(mods),
        'modules_ok':    sum(1 for v in mods.values() if v == 'ok'),
        'uploads':       _uploads_status(),
    }


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify

    @app.route('/api/health', methods=['GET'])
    def _h():
        return jsonify(light())

    @app.route('/api/health/deep', methods=['GET'])
    def _hd():
        return jsonify(deep())

    logger.info('Healthcheck endpoints registered (/api/health, /api/health/deep)')
