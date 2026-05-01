"""BIM sheet packs — assemble a Building into a multi-page construction
document set (cover + floor plans + schedules + BoQ summary) and emit a
single PDF.

A `SheetPack` is the deliverable an architect issues to a contractor. It is
the natural endpoint of the BIM pipeline: data → views → sheets → PDF.

Public surface:
    default_sheet_pack(building)              -> SheetPack
    sheet_pack_to_metadata(pack)              -> dict (for JSON / UI listing)
    build_sheet_pack_pdf(pack, project_meta)  -> bytes (multi-page PDF)
    render_sheet_preview_svg(sheet, ...)      -> str  (single-sheet SVG for UI)

The compositor uses reportlab + svglib (already in requirements.txt). Floor
plan SVGs come straight from `bim_renderer.floor_plan_svg`; schedules come
straight from `bim_schedules`. The compositor never re-derives geometry —
it just lays prepared views onto paper-sized pages with a title block.
"""

from __future__ import annotations

import datetime as _dt
import io
import logging
from dataclasses import dataclass, field
from typing import Any, Optional

from .bim_model import Building
from .bim_renderer import floor_plan_svg
from .bim_schedules import all_schedules

logger = logging.getLogger('eims.bim.sheets')

# ---------------------------------------------------------------------------
# Paper sizes (mm) — landscape orientation by convention for technical sheets
# ---------------------------------------------------------------------------

PAPER_SIZES_MM = {
    'A1': (841.0, 594.0),
    'A2': (594.0, 420.0),
    'A3': (420.0, 297.0),
    'A4': (297.0, 210.0),
}

DEFAULT_PAPER = 'A2'

# Standard architectural drawing scales (denominator only)
STANDARD_SCALES = [20, 50, 100, 200, 500, 1000, 2000]


# ---------------------------------------------------------------------------
# Sheet / View dataclasses
# ---------------------------------------------------------------------------

@dataclass
class View:
    """One drawing/table on a sheet.

    `kind` decides the renderer:
      - 'plan'     : data['svg']   = SVG string (uses _draw_svg_view)
      - 'schedule' : data['rows']  = list of dict rows + data['columns']
      - 'cover'    : data has project info + key_plan_svg
      - 'boq'      : data['rows'] (NRM-style summary)
      - 'note'     : data['lines'] = list of strings (general notes / legend)

    `bbox_mm` = (x, y, w, h) on the sheet in mm — origin = top-left of sheet.
    """
    name: str
    kind: str
    data: dict = field(default_factory=dict)
    scale_denom: Optional[int] = None  # only meaningful for 'plan' views
    bbox_mm: tuple[float, float, float, float] = (0, 0, 0, 0)


@dataclass
class Sheet:
    number: str               # 'A-101'
    title: str                # 'GROUND FLOOR PLAN'
    paper: str = DEFAULT_PAPER
    views: list[View] = field(default_factory=list)
    revision: str = '0'


@dataclass
class SheetPack:
    project_id: str
    project_name: str
    sheets: list[Sheet] = field(default_factory=list)
    revision: str = '0'
    issue_date: str = field(default_factory=lambda: _dt.date.today().isoformat())
    metadata: dict = field(default_factory=dict)  # location, client, drawn_by, ...


# ---------------------------------------------------------------------------
# Geometry helpers
# ---------------------------------------------------------------------------

def _building_bbox(b: Building, storey_index: int) -> tuple[float, float]:
    """Return (width_m, depth_m) for one storey of the building."""
    if storey_index >= len(b.storeys):
        return 10.0, 10.0
    s = b.storeys[storey_index]
    xs, ys = [], []
    for w in s.walls:
        for p in w.points:
            xs.append(p.x); ys.append(p.y)
    if not xs:
        return 10.0, 10.0
    return max(xs) - min(xs), max(ys) - min(ys)


def _choose_scale(width_m: float, height_m: float,
                  view_w_mm: float, view_h_mm: float) -> int:
    """Pick the smallest standard scale at which the building fits the view
    rect (with 5% margin so dim chains and grid bubbles don't get clipped)."""
    margin = 0.95
    for s in STANDARD_SCALES:
        if (width_m * 1000.0 / s <= view_w_mm * margin and
                height_m * 1000.0 / s <= view_h_mm * margin):
            return s
    return STANDARD_SCALES[-1]


# ---------------------------------------------------------------------------
# Default sheet pack — what every project gets out of the box
# ---------------------------------------------------------------------------

def default_sheet_pack(b: Building) -> SheetPack:
    """Generate a sensible default sheet pack for any Building.

    Numbering follows the AIA convention (-100 plans, -500 schedules, etc.)
    """
    pack = SheetPack(
        project_id=b.id, project_name=b.name,
        metadata={
            'location':     b.site.location_name,
            'building_type': b.metadata.get('building_type', ''),
            'style':         b.metadata.get('style', ''),
            'gfa_m2':        round(b.gross_floor_area_m2, 2),
            'storeys':       len(b.storeys),
        },
    )

    # ----- Cover sheet (A-001) -----
    cover_view = View(name='Cover', kind='cover', bbox_mm=(0, 0, 0, 0), data={
        'project_name': b.name,
        'location':     b.site.location_name,
        'building_type': b.metadata.get('building_type', ''),
        'style':         b.metadata.get('style', ''),
        'gfa_m2':        round(b.gross_floor_area_m2, 2),
        'storeys':       len(b.storeys),
        'walls':         len(b.all_walls()),
        'openings':      len(b.all_openings()),
        'spaces':        len(b.all_spaces()),
        # Mini key plan = ground-floor plan rendered small
        'key_plan_svg':  floor_plan_svg(b, storey_index=0, width_px=600)
                          if b.storeys else '',
    })
    pack.sheets.append(Sheet(number='A-001', title='COVER & PROJECT INFO',
                              views=[cover_view]))

    # ----- One floor-plan sheet per storey (A-101, A-102, ...) -----
    for i, s in enumerate(b.storeys):
        plan_svg = floor_plan_svg(b, storey_index=i, width_px=900)
        w_m, d_m = _building_bbox(b, i)
        pack.sheets.append(Sheet(
            number=f'A-{101 + i}',
            title=f'{s.name.upper()} FLOOR PLAN',
            views=[View(name=s.name, kind='plan', data={'svg': plan_svg,
                                                          'building_w_m': w_m,
                                                          'building_d_m': d_m})],
        ))

    # ----- Schedule sheets (A-501..A-505) -----
    sched = all_schedules(b)
    sched_specs = [
        ('A-501', 'DOOR SCHEDULE',     'doors'),
        ('A-502', 'WINDOW SCHEDULE',   'windows'),
        ('A-503', 'WALL SCHEDULE',     'walls'),
        ('A-504', 'SPACE SCHEDULE',    'spaces'),
        ('A-505', 'MATERIAL TAKE-OFF', 'materials'),
        ('A-506', 'STRUCTURAL SCHEDULE', 'structural'),
    ]
    for num, title, key in sched_specs:
        s_data = sched.get(key)
        if not s_data or not s_data.get('rows'):
            continue
        pack.sheets.append(Sheet(number=num, title=title, views=[View(
            name=s_data.get('name', title), kind='schedule', data={
                'columns': s_data.get('columns', []),
                'rows':    s_data.get('rows', []),
                'totals':  s_data.get('totals', {}),
                'sources': s_data.get('sources', []),
            },
        )]))

    # ----- BoQ summary (A-901) -----
    mat = sched.get('materials') or {}
    if mat.get('rows'):
        boq_rows = []
        for r in mat['rows']:
            boq_rows.append({
                'item':     r.get('material', ''),
                'quantity': r.get('quantity', 0),
                'unit':     r.get('unit', ''),
                'rate':     r.get('rate_USD', 0),
                'amount':   r.get('cost_USD', 0),
            })
        total = sum(float(r.get('amount', 0) or 0) for r in boq_rows)
        pack.sheets.append(Sheet(number='A-901', title='BoQ SUMMARY',
                                  views=[View(name='BoQ', kind='boq', data={
                                      'rows': boq_rows,
                                      'total_USD': round(total, 2),
                                      'sources':   mat.get('sources', []),
                                  })]))

    return pack


# ---------------------------------------------------------------------------
# JSON-friendly metadata (for the UI listing)
# ---------------------------------------------------------------------------

def sheet_pack_to_metadata(pack: SheetPack) -> dict:
    return {
        'project_id':   pack.project_id,
        'project_name': pack.project_name,
        'revision':     pack.revision,
        'issue_date':   pack.issue_date,
        'metadata':     pack.metadata,
        'sheet_count':  len(pack.sheets),
        'sheets': [{
            'number':   s.number, 'title': s.title, 'paper': s.paper,
            'view_kinds': [v.kind for v in s.views],
        } for s in pack.sheets],
    }


# ---------------------------------------------------------------------------
# PDF compositor
# ---------------------------------------------------------------------------

def build_sheet_pack_pdf(pack: SheetPack,
                          project_meta: Optional[dict] = None) -> bytes:
    """Render the entire pack as a multi-page PDF.

    One page per sheet, sized to the sheet's paper. Title block is drawn on
    the right margin of every page; the view area sits on the left.
    """
    try:
        from reportlab.pdfgen import canvas
        from reportlab.lib.units import mm
    except ImportError:
        # Hard fallback — return a JSON description so the caller still has
        # something to display.
        import json
        return json.dumps({'_warning': 'reportlab not installed',
                            'pack': sheet_pack_to_metadata(pack)},
                           indent=2).encode('utf-8')

    project_meta = project_meta or {}
    project_meta = {**pack.metadata, **project_meta,
                     'project_name': pack.project_name,
                     'project_id':   pack.project_id,
                     'revision':     pack.revision,
                     'issue_date':   pack.issue_date}

    buf = io.BytesIO()
    # Each sheet may have a different paper size; we pass per-page sizes.
    c = canvas.Canvas(buf, pagesize=(PAPER_SIZES_MM[DEFAULT_PAPER][0] * mm,
                                       PAPER_SIZES_MM[DEFAULT_PAPER][1] * mm))

    for sheet in pack.sheets:
        paper = PAPER_SIZES_MM.get(sheet.paper, PAPER_SIZES_MM[DEFAULT_PAPER])
        c.setPageSize((paper[0] * mm, paper[1] * mm))

        # Layout: title block on the right (160mm wide), drawing area to the left.
        sheet_w_mm, sheet_h_mm = paper
        margin_mm = 8.0
        tb_w_mm = 160.0

        view_x_mm = margin_mm
        view_y_mm = margin_mm
        view_w_mm = sheet_w_mm - tb_w_mm - 2 * margin_mm - 4
        view_h_mm = sheet_h_mm - 2 * margin_mm

        # Outer border
        _draw_border(c, sheet_w_mm, sheet_h_mm, margin_mm)

        # Auto-fill view bbox if the view didn't specify one
        for v in sheet.views:
            if v.bbox_mm == (0, 0, 0, 0):
                v.bbox_mm = (view_x_mm, view_y_mm, view_w_mm, view_h_mm)

        # Render each view
        for v in sheet.views:
            try:
                _render_view(c, v, sheet_h_mm)
            except Exception as e:
                logger.exception('sheet %s view %s failed: %s',
                                  sheet.number, v.name, e)
                _render_view_error(c, v, sheet_h_mm, str(e))

        # Title block
        _draw_title_block(c, sheet_w_mm - tb_w_mm - margin_mm,
                           margin_mm, tb_w_mm, sheet_h_mm - 2 * margin_mm,
                           sheet=sheet, project_meta=project_meta,
                           sheet_index=pack.sheets.index(sheet) + 1,
                           sheet_total=len(pack.sheets))
        c.showPage()

    c.save()
    return buf.getvalue()


# ---------------------------------------------------------------------------
# Per-view renderers (reportlab canvas-based)
# ---------------------------------------------------------------------------

def _render_view(c, v: View, sheet_h_mm: float) -> None:
    if v.kind == 'plan':
        _draw_svg_view(c, v, sheet_h_mm)
    elif v.kind == 'schedule':
        _draw_table_view(c, v, sheet_h_mm,
                          totals=v.data.get('totals'),
                          sources=v.data.get('sources'))
    elif v.kind == 'cover':
        _draw_cover_view(c, v, sheet_h_mm)
    elif v.kind == 'boq':
        _draw_boq_view(c, v, sheet_h_mm)
    elif v.kind == 'note':
        _draw_note_view(c, v, sheet_h_mm)


def _render_view_error(c, v: View, sheet_h_mm: float, msg: str) -> None:
    from reportlab.lib.units import mm
    from reportlab.lib import colors
    x, y, w, h = v.bbox_mm
    py = (sheet_h_mm - y - h) * mm  # PDF y is bottom-up
    c.saveState()
    c.setStrokeColor(colors.red); c.setLineWidth(0.4)
    c.rect(x * mm, py, w * mm, h * mm, stroke=1, fill=0)
    c.setFillColor(colors.red); c.setFont('Helvetica-Bold', 10)
    c.drawString((x + 4) * mm, py + h * mm - 6 * mm,
                  f'View "{v.name}" failed to render')
    c.setFont('Helvetica', 8); c.setFillColor(colors.black)
    c.drawString((x + 4) * mm, py + h * mm - 12 * mm, msg[:120])
    c.restoreState()


def _draw_border(c, sheet_w_mm: float, sheet_h_mm: float, margin_mm: float) -> None:
    from reportlab.lib.units import mm
    from reportlab.lib import colors
    c.saveState()
    c.setStrokeColor(colors.black); c.setLineWidth(0.6)
    c.rect(margin_mm * mm, margin_mm * mm,
           (sheet_w_mm - 2 * margin_mm) * mm,
           (sheet_h_mm - 2 * margin_mm) * mm,
           stroke=1, fill=0)
    c.restoreState()


def _draw_svg_view(c, v: View, sheet_h_mm: float) -> None:
    """Place an SVG inside the view's bbox, scaling to fit, anchored at top-left.
    Picks an architectural scale (1:50, 1:100, ...) and writes a 'SCALE 1:N' label.
    """
    from reportlab.lib.units import mm
    from reportlab.lib import colors
    from reportlab.graphics import renderPDF
    from svglib.svglib import svg2rlg

    x_mm, y_mm, w_mm, h_mm = v.bbox_mm
    # Reserve top 10mm for view title + scale label
    title_band = 10.0
    avail_w = w_mm - 2.0
    avail_h = h_mm - title_band - 2.0

    # Decide scale based on the building's actual dims (the SVG is in mm units
    # in its viewBox so scaling math reduces to a ratio).
    bw = float(v.data.get('building_w_m') or 0) or 10.0
    bd = float(v.data.get('building_d_m') or 0) or 10.0
    scale = _choose_scale(bw, bd, avail_w, avail_h)
    v.scale_denom = scale

    svg_str = v.data.get('svg', '')
    if not svg_str:
        return

    try:
        drawing = svg2rlg(io.StringIO(svg_str))
    except Exception as e:
        logger.warning('svg2rlg failed for view %s: %s — drawing placeholder', v.name, e)
        c.saveState()
        c.setStrokeColor(colors.grey); c.setLineWidth(0.4)
        py = (sheet_h_mm - y_mm - h_mm) * mm
        c.rect(x_mm * mm, py, w_mm * mm, h_mm * mm, stroke=1, fill=0)
        c.setFont('Helvetica', 8); c.setFillColor(colors.grey)
        c.drawString((x_mm + 4) * mm, py + h_mm * mm / 2, '[SVG render failed]')
        c.restoreState()
        return

    # svg2rlg drawing is sized in pt (1pt = 0.3528mm). Compute a scale factor
    # that fits the drawing into the available rect; also enforce architectural scale.
    dw_pt = drawing.width or 1
    dh_pt = drawing.height or 1
    # Convert pt -> mm
    pt_per_mm = 1 / 0.3528
    dw_mm = dw_pt / pt_per_mm
    dh_mm = dh_pt / pt_per_mm

    fit = min(avail_w / dw_mm, avail_h / dh_mm) if dw_mm and dh_mm else 1.0
    drawing.scale(fit, fit)
    drawing.width  = dw_pt * fit
    drawing.height = dh_pt * fit

    # Center horizontally inside the view rect; top-anchor below title band
    drawn_w_mm = drawing.width / pt_per_mm
    drawn_h_mm = drawing.height / pt_per_mm
    draw_x_mm = x_mm + max(0, (avail_w - drawn_w_mm) / 2.0) + 1.0
    # PDF y is bottom-up; sheet y is top-down — convert
    draw_y_top_mm = y_mm + title_band + 1.0
    draw_y_bot_mm = draw_y_top_mm + drawn_h_mm
    draw_y_pdf = (sheet_h_mm - draw_y_bot_mm) * mm

    renderPDF.draw(drawing, c, draw_x_mm * mm, draw_y_pdf)

    # Title strip
    c.saveState()
    c.setFillColor(colors.black)
    c.setFont('Helvetica-Bold', 9)
    title_y_pdf = (sheet_h_mm - y_mm - 6) * mm
    c.drawString((x_mm + 1) * mm, title_y_pdf, v.name.upper())
    c.setFont('Helvetica', 8)
    c.drawRightString((x_mm + w_mm - 1) * mm, title_y_pdf,
                      f'SCALE 1:{scale}')
    c.restoreState()


def _draw_table_view(c, v: View, sheet_h_mm: float,
                     totals: Optional[dict] = None,
                     sources: Optional[list] = None) -> None:
    """Generic table renderer for schedules. Uses reportlab's Table within a
    constrained frame so it auto-paginates within the bbox.
    """
    from reportlab.lib.units import mm
    from reportlab.lib import colors
    from reportlab.platypus import Table, TableStyle, Paragraph, Frame, KeepInFrame
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

    x_mm, y_mm, w_mm, h_mm = v.bbox_mm
    py = (sheet_h_mm - y_mm - h_mm) * mm

    cols = v.data.get('columns') or []
    rows = v.data.get('rows') or []

    # Choose displayed column subset — the schedule rows have many keys; show
    # the most useful ones and gracefully handle missing.
    if not cols:
        # Auto-derive from first row
        cols = list(rows[0].keys())[:8] if rows else []

    # Build header + body
    header = [str(c_).replace('_', ' ').title() for c_ in cols]
    body = []
    for r in rows:
        body.append([_fmt_cell(r.get(k, '')) for k in cols])
    # Totals row
    if totals:
        tot_row = [''] * len(cols)
        if cols:
            tot_row[0] = 'TOTAL'
        # Try to fill numeric totals into matching columns
        for i, k in enumerate(cols):
            if k in totals:
                tot_row[i] = _fmt_cell(totals[k])
        body.append(tot_row)

    table_data = [header] + body if header else body

    if not table_data:
        return

    styles = getSampleStyleSheet()
    title_p = Paragraph(f'<b>{v.name.upper()}</b>',
                         ParagraphStyle('vt', parent=styles['BodyText'],
                                         fontSize=10, leading=12, spaceAfter=2))

    n_cols = len(cols) if cols else 1
    col_w_mm = (w_mm - 2) / n_cols if n_cols else w_mm
    table = Table(table_data, repeatRows=1,
                  colWidths=[col_w_mm * mm] * n_cols)
    style_cmds = [
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#cfd8dc')),
        ('GRID', (0, 0), (-1, -1), 0.25, colors.grey),
        ('FONT', (0, 0), (-1, 0), 'Helvetica-Bold', 7),
        ('FONT', (0, 1), (-1, -1), 'Helvetica', 6.5),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 2),
        ('RIGHTPADDING', (0, 0), (-1, -1), 2),
        ('TOPPADDING', (0, 0), (-1, -1), 1.4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1.4),
    ]
    if totals:
        style_cmds.append(('BACKGROUND', (0, -1), (-1, -1),
                           colors.HexColor('#eceff1')))
        style_cmds.append(('FONT', (0, -1), (-1, -1), 'Helvetica-Bold', 7))
    table.setStyle(TableStyle(style_cmds))

    flowables = [title_p, table]
    if sources:
        src_p = Paragraph(
            '<i>Sources: ' + '; '.join(str(s) for s in sources[:6]) + '</i>',
            ParagraphStyle('src', parent=styles['BodyText'],
                            fontSize=6, leading=7, textColor=colors.grey,
                            spaceBefore=2))
        flowables.append(src_p)

    frame = Frame(x_mm * mm, py, w_mm * mm, h_mm * mm,
                  leftPadding=1, rightPadding=1,
                  topPadding=1, bottomPadding=1, showBoundary=0)
    kif = KeepInFrame(w_mm * mm - 2, h_mm * mm - 2, flowables, mode='shrink')
    frame.addFromList([kif], c)


def _draw_cover_view(c, v: View, sheet_h_mm: float) -> None:
    from reportlab.lib.units import mm
    from reportlab.lib import colors

    x_mm, y_mm, w_mm, h_mm = v.bbox_mm

    # Header
    c.saveState()
    c.setFillColor(colors.HexColor('#0d47a1'))
    c.setFont('Helvetica-Bold', 28)
    c.drawString(x_mm * mm, (sheet_h_mm - y_mm - 22) * mm,
                  v.data.get('project_name', 'PROJECT'))
    c.setFillColor(colors.HexColor('#37474f'))
    c.setFont('Helvetica', 13)
    c.drawString(x_mm * mm, (sheet_h_mm - y_mm - 32) * mm,
                  v.data.get('location', ''))
    # Stat strip
    c.setFillColor(colors.HexColor('#eceff1'))
    strip_y_top = y_mm + 38
    strip_h = 24
    c.rect(x_mm * mm, (sheet_h_mm - strip_y_top - strip_h) * mm,
           w_mm * mm, strip_h * mm, fill=1, stroke=0)
    stats = [
        ('TYPE',    str(v.data.get('building_type', '–'))),
        ('STYLE',   str(v.data.get('style', '–')).replace('_', ' ')),
        ('GFA',     f"{v.data.get('gfa_m2', 0)} m²"),
        ('STOREYS', str(v.data.get('storeys', 0))),
        ('WALLS',   str(v.data.get('walls', 0))),
        ('OPENINGS', str(v.data.get('openings', 0))),
        ('SPACES',  str(v.data.get('spaces', 0))),
    ]
    cw = w_mm / len(stats)
    for i, (lbl, val) in enumerate(stats):
        cx = (x_mm + i * cw + cw / 2) * mm
        c.setFillColor(colors.HexColor('#546e7a'))
        c.setFont('Helvetica', 7)
        c.drawCentredString(cx, (sheet_h_mm - strip_y_top - 7) * mm, lbl)
        c.setFillColor(colors.HexColor('#0d47a1'))
        c.setFont('Helvetica-Bold', 12)
        c.drawCentredString(cx, (sheet_h_mm - strip_y_top - 18) * mm, val)
    c.restoreState()

    # Key plan
    key_svg = v.data.get('key_plan_svg', '')
    if key_svg:
        kp_view = View(name='KEY PLAN', kind='plan',
                        data={'svg': key_svg,
                              'building_w_m': 20.0, 'building_d_m': 15.0},
                        bbox_mm=(x_mm, y_mm + 70, w_mm, h_mm - 90))
        try:
            _draw_svg_view(c, kp_view, sheet_h_mm)
        except Exception as e:
            logger.warning('cover key plan failed: %s', e)


def _draw_boq_view(c, v: View, sheet_h_mm: float) -> None:
    """BoQ summary rendered as a table with a TOTAL row at the bottom."""
    rows = v.data.get('rows') or []
    cols = ['item', 'quantity', 'unit', 'rate', 'amount']
    fake_view = View(name=v.name, kind='schedule',
                      data={'columns': cols, 'rows': rows},
                      bbox_mm=v.bbox_mm)
    totals = {'item': 'TOTAL', 'amount': v.data.get('total_USD', 0)}
    _draw_table_view(c, fake_view, sheet_h_mm,
                      totals=totals, sources=v.data.get('sources'))


def _draw_note_view(c, v: View, sheet_h_mm: float) -> None:
    from reportlab.lib.units import mm
    from reportlab.lib import colors
    x_mm, y_mm, w_mm, h_mm = v.bbox_mm
    c.saveState()
    c.setFillColor(colors.black); c.setFont('Helvetica-Bold', 10)
    c.drawString(x_mm * mm, (sheet_h_mm - y_mm - 6) * mm, v.name.upper())
    c.setFont('Helvetica', 8)
    for i, line in enumerate(v.data.get('lines') or []):
        c.drawString(x_mm * mm,
                      (sheet_h_mm - y_mm - 14 - i * 4) * mm, str(line))
    c.restoreState()


# ---------------------------------------------------------------------------
# Title block
# ---------------------------------------------------------------------------

def _draw_title_block(c, x_mm: float, y_mm_bottom: float,
                       w_mm: float, h_mm: float, *,
                       sheet: Sheet, project_meta: dict,
                       sheet_index: int, sheet_total: int) -> None:
    from reportlab.lib.units import mm
    from reportlab.lib import colors

    c.saveState()
    # Outer block
    c.setStrokeColor(colors.black); c.setLineWidth(0.6)
    c.rect(x_mm * mm, y_mm_bottom * mm, w_mm * mm, h_mm * mm,
           stroke=1, fill=0)

    # Vertical layout (top -> bottom in PDF): we work in PDF coords directly.
    pdf_top = (y_mm_bottom + h_mm) * mm

    # Helper to draw a labelled cell
    def cell(y_top_mm_below_pdftop, height_mm, label, value,
             value_size=11, bold=True):
        cell_top_pdf = pdf_top - y_top_mm_below_pdftop * mm
        cell_bot_pdf = cell_top_pdf - height_mm * mm
        c.setStrokeColor(colors.black); c.setLineWidth(0.3)
        c.line(x_mm * mm, cell_bot_pdf, (x_mm + w_mm) * mm, cell_bot_pdf)
        c.setFillColor(colors.HexColor('#546e7a'))
        c.setFont('Helvetica', 6)
        c.drawString((x_mm + 2) * mm, cell_top_pdf - 4 * mm, label)
        c.setFillColor(colors.black)
        c.setFont('Helvetica-Bold' if bold else 'Helvetica', value_size)
        c.drawString((x_mm + 2) * mm, cell_top_pdf - (height_mm - 2) * mm,
                     str(value)[:36])

    # ----- Logo / company strip -----
    logo_h = 18
    c.setFillColor(colors.HexColor('#0d47a1'))
    c.rect(x_mm * mm, pdf_top - logo_h * mm, w_mm * mm, logo_h * mm,
           stroke=0, fill=1)
    c.setFillColor(colors.white); c.setFont('Helvetica-Bold', 14)
    c.drawString((x_mm + 4) * mm, pdf_top - 10 * mm, 'EMERSON EIMS')
    c.setFont('Helvetica', 7)
    c.drawString((x_mm + 4) * mm, pdf_top - 15 * mm,
                 'BUILDING SUITE PRO  ·  BIM AUTHORING')

    y = logo_h
    cell(y, 14, 'PROJECT', project_meta.get('project_name', ''), 10)
    y += 14
    cell(y, 10, 'LOCATION', project_meta.get('location', '–'), 8, bold=False)
    y += 10
    cell(y, 10, 'CLIENT', project_meta.get('client', '–'), 8, bold=False)
    y += 10
    cell(y, 18, 'SHEET TITLE', sheet.title, 11)
    y += 18
    # Sheet number + scale on a single row split visually
    half_y_top_pdf = pdf_top - y * mm
    half_h = 18
    c.setStrokeColor(colors.black); c.setLineWidth(0.3)
    half_w = w_mm / 2
    c.line((x_mm + half_w) * mm, half_y_top_pdf,
           (x_mm + half_w) * mm, half_y_top_pdf - half_h * mm)
    cell(y, half_h, 'SHEET No.', sheet.number, 14)
    # Right half: SHEET INDEX
    c.setFillColor(colors.HexColor('#546e7a'))
    c.setFont('Helvetica', 6)
    c.drawString((x_mm + half_w + 2) * mm, half_y_top_pdf - 4 * mm, 'SHEET')
    c.setFillColor(colors.black)
    c.setFont('Helvetica-Bold', 14)
    c.drawString((x_mm + half_w + 2) * mm,
                 half_y_top_pdf - (half_h - 2) * mm,
                 f'{sheet_index} / {sheet_total}')
    y += half_h
    cell(y, 10, 'REVISION', project_meta.get('revision', '0'), 9)
    y += 10
    cell(y, 10, 'ISSUE DATE', project_meta.get('issue_date',
                                                  _dt.date.today().isoformat()),
          8, bold=False)
    y += 10
    cell(y, 10, 'DRAWN BY', project_meta.get('drawn_by', 'EIMS-AUTO'),
          8, bold=False)
    y += 10
    cell(y, 10, 'CHECKED BY', project_meta.get('checked_by', '—'),
          8, bold=False)
    y += 10
    # Footer note
    c.setFillColor(colors.HexColor('#90a4ae'))
    c.setFont('Helvetica-Oblique', 6)
    c.drawString((x_mm + 2) * mm, (y_mm_bottom + 4) * mm,
                  'Generated from BIM model. Schema v1. Data provenance: see report.')
    c.restoreState()


# ---------------------------------------------------------------------------
# Cell formatting
# ---------------------------------------------------------------------------

def _fmt_cell(val: Any) -> str:
    if val is None:
        return ''
    if isinstance(val, float):
        if abs(val) >= 1000:
            return f'{val:,.0f}'
        return f'{val:.3f}'.rstrip('0').rstrip('.')
    if isinstance(val, (list, tuple)):
        return ', '.join(str(x) for x in val[:4])
    if isinstance(val, dict):
        return str(val)[:60]
    return str(val)


# ---------------------------------------------------------------------------
# Lightweight per-sheet preview SVG (for the UI tab thumbnail)
# ---------------------------------------------------------------------------

def render_sheet_preview_svg(sheet: Sheet, *, scale_px: int = 360) -> str:
    """Return a small SVG that visually previews the sheet layout: a paper
    rectangle with the title block on the right, plus inset chips for each
    view kind. Cheap and CSS-safe — no svg2rlg needed."""
    paper = PAPER_SIZES_MM.get(sheet.paper, PAPER_SIZES_MM[DEFAULT_PAPER])
    w_mm, h_mm = paper
    s = scale_px / w_mm
    sw, sh = w_mm * s, h_mm * s
    margin = 8 * s
    tb_w = 160 * s

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'viewBox="0 0 {sw:.0f} {sh:.0f}" width="{sw:.0f}" height="{sh:.0f}" '
        f'style="background:#fff;font-family:Arial,sans-serif">',
        # Outer paper
        f'<rect x="0.5" y="0.5" width="{sw-1:.0f}" height="{sh-1:.0f}" '
        f'fill="#fafafa" stroke="#90a4ae" stroke-width="1"/>',
        # Inner border
        f'<rect x="{margin:.0f}" y="{margin:.0f}" '
        f'width="{sw-2*margin:.0f}" height="{sh-2*margin:.0f}" '
        f'fill="none" stroke="#37474f" stroke-width="0.6"/>',
        # Title block
        f'<rect x="{sw - tb_w - margin:.0f}" y="{margin:.0f}" '
        f'width="{tb_w:.0f}" height="{sh - 2*margin:.0f}" '
        f'fill="none" stroke="#37474f" stroke-width="0.4"/>',
        # Title block header (blue band)
        f'<rect x="{sw - tb_w - margin:.0f}" y="{margin:.0f}" '
        f'width="{tb_w:.0f}" height="{18*s:.0f}" '
        f'fill="#0d47a1"/>',
        f'<text x="{sw - tb_w - margin + 6*s:.0f}" '
        f'y="{margin + 12*s:.0f}" fill="#fff" '
        f'font-size="{10*s:.1f}" font-weight="bold">EMERSON EIMS</text>',
        f'<text x="{sw - tb_w - margin + 6*s:.0f}" '
        f'y="{margin + 30*s:.0f}" fill="#37474f" '
        f'font-size="{8*s:.1f}">SHEET {sheet.number}</text>',
        f'<text x="{sw - tb_w - margin + 6*s:.0f}" '
        f'y="{margin + 42*s:.0f}" fill="#37474f" '
        f'font-size="{6.5*s:.1f}">{sheet.title}</text>',
        # View chip (one or many)
        f'<rect x="{margin + 4:.0f}" y="{margin + 4:.0f}" '
        f'width="{sw - 2*margin - tb_w - 12:.0f}" '
        f'height="{sh - 2*margin - 8:.0f}" '
        f'fill="#fff" stroke="#cfd8dc" stroke-dasharray="3,2" stroke-width="0.5"/>',
        f'<text x="{(margin + (sw - tb_w - margin)/2):.0f}" '
        f'y="{(sh/2):.0f}" fill="#90a4ae" '
        f'font-size="{12*s:.1f}" text-anchor="middle">'
        f'{sheet.views[0].kind.upper() if sheet.views else "EMPTY"}</text>',
        '</svg>',
    ]
    return ''.join(parts)
