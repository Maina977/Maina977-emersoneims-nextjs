"""Auto-discovery OpenAPI 3.0.3 spec from Flask URL map.

Walks `app.url_map`, lists every rule under /api/* with its methods, and
emits a minimal but valid OpenAPI document. Endpoints not yet documented
in the per-module docstrings are still listed so consumers see them.
"""

from __future__ import annotations

import logging
from typing import Any, Dict

logger = logging.getLogger('eims.openapi')


def build_spec(app) -> Dict[str, Any]:
    paths: Dict[str, Dict[str, Any]] = {}
    for rule in app.url_map.iter_rules():
        path = str(rule)
        if not path.startswith('/api/'):
            continue
        methods = sorted(m for m in (rule.methods or set())
                          if m not in ('HEAD', 'OPTIONS'))
        if not methods:
            continue
        # Convert <var> to {var}
        oapi_path = path
        for arg in rule.arguments or ():
            oapi_path = oapi_path.replace(f'<{arg}>', '{' + arg + '}')
        paths.setdefault(oapi_path, {})
        for m in methods:
            paths[oapi_path][m.lower()] = {
                'summary':     rule.endpoint,
                'operationId': rule.endpoint,
                'tags':        [oapi_path.split('/')[2] if len(oapi_path.split('/')) > 2 else 'api'],
                'responses':   {
                    '200': {'description': 'OK',
                             'content': {'application/json': {}}},
                    '400': {'description': 'Validation error'},
                    '429': {'description': 'Rate limit exceeded'},
                    '500': {'description': 'Server error'},
                },
            }

    return {
        'openapi': '3.0.3',
        'info': {
            'title':       'EmersonEIMS Building Suite Pro API',
            'version':     '2026.04',
            'description': 'Construction engineering, QS and architecture API. '
                            'All numeric outputs carry standard, clause and '
                            'data-source citations per the platform data policy.',
        },
        'servers': [{'url': '/'}],
        'paths':   paths,
    }


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify

    @app.route('/api/openapi.json', methods=['GET'])
    def _spec():
        return jsonify(build_spec(app))

    @app.route('/api/docs', methods=['GET'])
    def _docs():
        # Redoc-based viewer using the auto spec
        return ("""<!doctype html><html><head>
            <title>EmersonEIMS API</title>
            <meta charset="utf-8"/>
            <style>body{margin:0}</style>
        </head><body>
            <redoc spec-url="/api/openapi.json"></redoc>
            <script src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"></script>
        </body></html>""", 200, {'Content-Type': 'text/html'})

    logger.info('OpenAPI spec + /api/docs registered')
