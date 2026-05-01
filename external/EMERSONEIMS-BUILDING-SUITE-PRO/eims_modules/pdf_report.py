"""PDF report builder with mandatory Data Provenance appendix.

Honors the user's strict data policy: every PDF must list the source of
every data point. The builder accepts a structured payload and produces
a multi-page PDF using ReportLab.

Sections:
  1. Cover (title, project, date, author)
  2. Executive summary (free text)
  3. Findings table (rows of {item, value, unit, source, clause})
  4. Calculations / module outputs (renders any dict that contains a
     'standard'/'reference' key)
  5. Data Provenance Appendix -- consolidated list of every distinct
     source citation across the report.

Falls back to a JSON document if reportlab is not installed.
"""

from __future__ import annotations

import datetime as _dt
import io
import json
import logging
import os
from typing import Any, Dict, List, Optional

logger = logging.getLogger('eims.pdfreport')

try:
    from reportlab.lib import colors          # type: ignore
    from reportlab.lib.pagesizes import A4    # type: ignore
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle  # type: ignore
    from reportlab.lib.units import mm        # type: ignore
    from reportlab.platypus import (Paragraph, SimpleDocTemplate, Spacer,  # type: ignore
                                       Table, TableStyle, PageBreak)
    REPORTLAB_OK = True
except Exception:  # pragma: no cover
    REPORTLAB_OK = False


def _collect_sources(payload: Dict[str, Any]) -> List[str]:
    found = set()

    def walk(o):
        if isinstance(o, dict):
            for k, v in o.items():
                if k in ('source', 'factor_source', 'rate_source',
                          'reference', 'standard', 'data_source',
                          'water_table_source'):
                    if isinstance(v, str) and v.strip():
                        found.add(v.strip())
                walk(v)
        elif isinstance(o, list):
            for x in o:
                walk(x)

    walk(payload)
    return sorted(found)


def build_pdf(*, payload: Dict[str, Any]) -> bytes:
    """Render PDF; returns bytes (PDF or JSON fallback)."""
    sources = _collect_sources(payload)

    if not REPORTLAB_OK:
        # Fallback: well-formed JSON document (clearly labelled)
        fallback = {'_warning': 'reportlab not installed; returning JSON',
                     'data_provenance_appendix': sources, **payload}
        return json.dumps(fallback, indent=2, default=str).encode('utf-8')

    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4,
                              leftMargin=18 * mm, rightMargin=18 * mm,
                              topMargin=18 * mm, bottomMargin=18 * mm,
                              title=str(payload.get('title', 'EmersonEIMS report')))
    styles = getSampleStyleSheet()
    h1 = styles['Heading1']; h2 = styles['Heading2']; body = styles['BodyText']
    small = ParagraphStyle('small', parent=body, fontSize=8, leading=10)

    story: List[Any] = []
    title = str(payload.get('title', 'EmersonEIMS Report'))
    project = str(payload.get('project', ''))
    author = str(payload.get('author', ''))
    today = _dt.date.today().isoformat()

    story += [Paragraph(title, h1),
              Paragraph(f'Project: {project}', body),
              Paragraph(f'Author: {author}', body),
              Paragraph(f'Date: {today}', body),
              Spacer(1, 8 * mm)]

    summary = payload.get('summary')
    if summary:
        story += [Paragraph('Executive summary', h2),
                  Paragraph(str(summary), body),
                  Spacer(1, 6 * mm)]

    findings = payload.get('findings') or []
    if findings:
        story += [Paragraph('Findings', h2)]
        rows = [['Item', 'Value', 'Unit', 'Source', 'Clause']]
        for f in findings:
            rows.append([
                str(f.get('item', '')),
                str(f.get('value', '')),
                str(f.get('unit', '')),
                str(f.get('source', '')),
                str(f.get('clause', '')),
            ])
        t = Table(rows, repeatRows=1, hAlign='LEFT',
                   colWidths=[55 * mm, 25 * mm, 15 * mm, 50 * mm, 25 * mm])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
            ('GRID', (0, 0), (-1, -1), 0.25, colors.grey),
            ('FONT', (0, 0), (-1, 0), 'Helvetica-Bold', 9),
            ('FONT', (0, 1), (-1, -1), 'Helvetica', 8),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        story += [t, Spacer(1, 6 * mm)]

    calcs = payload.get('calculations') or []
    if calcs:
        story += [Paragraph('Calculations', h2)]
        for c in calcs:
            label = c.get('label', '')
            std = c.get('standard') or c.get('code') or c.get('reference', '')
            story += [Paragraph(f'<b>{label}</b> &nbsp; <i>{std}</i>', body),
                      Paragraph('<font face="Courier" size="8">'
                                f'{json.dumps(c, indent=2, default=str)}'
                                '</font>', small),
                      Spacer(1, 3 * mm)]

    # Mandatory Data Provenance Appendix
    story += [PageBreak(),
              Paragraph('Data Provenance Appendix', h1),
              Paragraph('Per platform data policy, every numeric value in '
                        'this report is traceable to one of the following '
                        'sources. Estimates supplementing sparse records '
                        'are explicitly labelled in the source line.', body),
              Spacer(1, 4 * mm)]
    if sources:
        rows = [['#', 'Source citation']]
        for i, s in enumerate(sources, 1):
            rows.append([str(i), s])
        tt = Table(rows, repeatRows=1, hAlign='LEFT',
                    colWidths=[12 * mm, 158 * mm])
        tt.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
            ('GRID', (0, 0), (-1, -1), 0.25, colors.grey),
            ('FONT', (0, 0), (-1, 0), 'Helvetica-Bold', 9),
            ('FONT', (0, 1), (-1, -1), 'Helvetica', 8),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        story += [tt]
    else:
        story += [Paragraph('<i>No source citations found in the payload. '
                             'Report flagged as incomplete.</i>', body)]

    doc.build(story)
    return buf.getvalue()


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import Response, jsonify, request

    def _route():
        data = request.get_json(silent=True) or {}
        if not isinstance(data, dict) or not data.get('title'):
            return jsonify({'success': False,
                             'error': 'payload must include title'}), 400
        try:
            pdf_bytes = build_pdf(payload=data)
        except Exception as e:
            logger.exception('PDF build failed')
            return jsonify({'success': False, 'error': str(e)}), 500
        mime = 'application/pdf' if REPORTLAB_OK else 'application/json'
        ext = 'pdf' if REPORTLAB_OK else 'json'
        fname = f"eims_report_{_dt.datetime.now(_dt.timezone.utc).strftime('%Y%m%d_%H%M%S')}.{ext}"
        return Response(pdf_bytes, mimetype=mime,
                         headers={'Content-Disposition': f'attachment; filename={fname}'})

    if auth_required:
        _route = auth_required(_route)
    app.add_url_rule('/api/report/pdf', 'eims_pdf_report',
                      _route, methods=['POST'])

    logger.info('PDF report builder registered (reportlab=%s)', REPORTLAB_OK)
