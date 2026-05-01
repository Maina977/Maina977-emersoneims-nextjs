"""BIM HTTP endpoints — exposes the unified Building model over Flask.

Routes (all under /api/bim/*):

  POST /api/bim/build
       body: {project_id?, name?, area_m2, bedrooms?, stories?, units?,
              building_type?, style?, location?, gps_lat?, gps_lng?,
              persist?: bool}
       Builds a Building from the given params (or, if `project_id` is
       provided, from the params already saved on that project) and
       optionally persists the model to data_json.bim. Returns a summary.

  GET  /api/bim/project/<project_id>
       Returns the persisted Building JSON for a project, or 404.

  POST /api/bim/schedules
       body: {project_id} OR {bim: <full Building dict>}
       Returns the 6-schedule pack (doors, windows, walls, spaces,
       materials, structural).

  POST /api/bim/floor-plan
       body: {project_id, storey_index?: 0, width_px?: 900}
            OR {bim: ..., storey_index?, width_px?}
       Returns {svg, storey_id, storey_name, ...}.

  POST /api/bim/element/update
       body: {project_id, element_id, patch: {...}}
       Update a property on a single element (wall thickness, door type,
       room name, etc.) and re-persist. The single mutation primitive every
       editor UI will eventually call.

This module intentionally has *no* dependency on the rest of app_professional
beyond the project-loading helper that's passed in via register(). Keeps the
BIM core decoupled and easy to test in isolation.
"""

from __future__ import annotations

import json
import logging
import sqlite3
from datetime import datetime
from typing import Any, Callable, Optional

from .bim_model import Building
from .bim_schedules import all_schedules, ALL_SCHEDULES
from .bim_renderer import floor_plan_svg
from .bim_three import building_to_three
from .bim_family_library import get_library, merge_library_into
from .bim_sheets import (default_sheet_pack, sheet_pack_to_metadata,
                         build_sheet_pack_pdf, render_sheet_preview_svg)
from .bim_copilot import run_turn as copilot_run_turn, is_configured as copilot_is_configured

logger = logging.getLogger('eims.bim')


def _params_from_project_data(proj: dict) -> dict:
    """Best-effort extraction of Building.from_params() arguments out of a
    saved project dict. The project JSON is heterogeneous (multiple wizard
    versions) so we read every plausible field name."""
    p1 = (proj.get('phases', {}) or {}).get('1', {}).get('data', {}) if proj.get('phases') else {}
    return {
        'name':          proj.get('name') or 'BIM Project',
        'project_id':    proj.get('id'),
        'area_m2':       float(proj.get('area') or p1.get('area') or p1.get('total_area') or 180),
        'bedrooms':      int(proj.get('bedrooms') or p1.get('bedrooms') or 3),
        'stories':       int(proj.get('stories') or p1.get('stories') or p1.get('floors') or 1),
        'units':         int(proj.get('units') or p1.get('units') or p1.get('residential_units') or 1),
        'building_type': proj.get('building_type') or p1.get('building_type') or 'BUNGALOW',
        'style':         proj.get('style') or p1.get('style') or p1.get('architectural_style') or 'modern',
        'location':      proj.get('location') or p1.get('location') or '',
        'gps_lat':       proj.get('gps_lat') or p1.get('gps_lat'),
        'gps_lng':       proj.get('gps_lng') or p1.get('gps_lng'),
    }


def register(app, *, auth_required: Optional[Callable] = None,
             db_getter: Optional[Callable] = None) -> None:
    """Register BIM routes on `app`. `db_getter` should return a sqlite3
    connection compatible with the rest of the app (Row factory)."""
    from flask import jsonify, request

    if auth_required is None:
        def auth_required(fn): return fn

    if db_getter is None:
        # Soft fallback — endpoints that need persistence will fail gracefully.
        def db_getter(): raise RuntimeError('db_getter not configured')

    # ---------- helpers shared by the routes ----------

    def _load_project(pid: str) -> Optional[dict]:
        try:
            conn = db_getter()
        except Exception as e:
            logger.warning('db_getter failed: %s', e)
            return None
        try:
            row = conn.execute(
                'SELECT data_json, phases_json FROM projects WHERE id=?', (pid,)
            ).fetchone()
            if not row:
                return None
            proj = json.loads(row['data_json']) if row['data_json'] else {}
            phases = json.loads(row['phases_json']) if row['phases_json'] else {}
            if phases:
                proj['phases'] = phases
            proj['id'] = pid
            return proj
        finally:
            conn.close()

    def _save_bim(pid: str, bim_dict: dict) -> bool:
        try:
            conn = db_getter()
        except Exception as e:
            logger.warning('persist failed: %s', e)
            return False
        try:
            row = conn.execute(
                'SELECT data_json FROM projects WHERE id=?', (pid,)
            ).fetchone()
            if not row:
                return False
            proj = json.loads(row['data_json']) if row['data_json'] else {}
            proj['bim'] = bim_dict
            conn.execute(
                'UPDATE projects SET data_json=?, updated_at=? WHERE id=?',
                (json.dumps(proj), datetime.now().isoformat(), pid))
            conn.commit()
            return True
        finally:
            conn.close()

    def _building_from_request(data: dict) -> tuple[Optional[Building], Optional[tuple]]:
        """Resolve a Building from the request body. Order of precedence:
        1. Inline `bim` dict (lets callers pass an unsaved model).
        2. `project_id` — load saved bim from data_json.bim.
        3. `project_id` without saved bim — rebuild from saved project params.
        4. Bare params {area_m2, bedrooms, ...} — build fresh.
        Returns (building, error) where error is (status, dict) on failure.
        """
        if isinstance(data.get('bim'), dict):
            try:
                return Building.from_dict(data['bim']), None
            except Exception as e:
                return None, (400, {'success': False,
                                     'error': f'invalid bim payload: {e}'})

        pid = data.get('project_id')
        if pid:
            proj = _load_project(pid)
            if not proj:
                return None, (404, {'success': False,
                                     'error': 'project not found'})
            saved = proj.get('bim')
            if isinstance(saved, dict):
                try:
                    return Building.from_dict(saved), None
                except Exception as e:
                    logger.warning('saved bim malformed for %s: %s — rebuilding', pid, e)
            # No saved bim or malformed — rebuild from project params
            try:
                params = _params_from_project_data(proj)
                return Building.from_params(**params), None
            except Exception as e:
                return None, (500, {'success': False,
                                     'error': f'rebuild failed: {e}'})

        # Bare params
        try:
            params = {k: data[k] for k in (
                'name','area_m2','bedrooms','stories','units','building_type',
                'style','location','gps_lat','gps_lng') if k in data}
            params.setdefault('name', 'BIM ad-hoc')
            if 'area_m2' not in params and 'area' in data:
                params['area_m2'] = data['area']
            if 'area_m2' not in params:
                return None, (400, {'success': False,
                                     'error': 'area_m2 (or project_id) is required'})
            return Building.from_params(**params), None
        except Exception as e:
            return None, (400, {'success': False,
                                 'error': f'param error: {e}'})

    # ---------- routes ----------

    @app.route('/api/bim/build', methods=['POST'])
    @auth_required
    def _bim_build():
        data = request.get_json(silent=True) or {}
        b, err = _building_from_request(data)
        if err:
            return jsonify(err[1]), err[0]
        errors = b.validate()
        bim_dict = b.to_dict()
        persisted = False
        if data.get('persist') and data.get('project_id'):
            persisted = _save_bim(data['project_id'], bim_dict)
        return jsonify({
            'success': True,
            'building_id': b.id,
            'name': b.name,
            'storeys': len(b.storeys),
            'walls':   len(b.all_walls()),
            'spaces':  len(b.all_spaces()),
            'openings': len(b.all_openings()),
            'gross_floor_area_m2': round(b.gross_floor_area_m2, 2),
            'validation_errors': errors,
            'persisted': persisted,
            'bim': bim_dict,
        })

    @app.route('/api/bim/project/<project_id>', methods=['GET'])
    @auth_required
    def _bim_get_project(project_id):
        proj = _load_project(project_id)
        if not proj:
            return jsonify({'success': False, 'error': 'project not found'}), 404
        if isinstance(proj.get('bim'), dict):
            return jsonify({'success': True, 'bim': proj['bim'],
                             'persisted': True})
        # Fall through to a fresh build so the caller never gets nothing
        try:
            b = Building.from_params(**_params_from_project_data(proj))
            return jsonify({'success': True, 'bim': b.to_dict(),
                             'persisted': False})
        except Exception as e:
            return jsonify({'success': False,
                             'error': f'rebuild failed: {e}'}), 500

    @app.route('/api/bim/schedules', methods=['POST'])
    @auth_required
    def _bim_schedules():
        data = request.get_json(silent=True) or {}
        b, err = _building_from_request(data)
        if err:
            return jsonify(err[1]), err[0]
        which = data.get('which')
        if which:
            keys = [k.strip() for k in (which if isinstance(which, list)
                                          else str(which).split(','))
                    if k.strip() in ALL_SCHEDULES]
            return jsonify({'success': True,
                             'schedules': {k: ALL_SCHEDULES[k](b) for k in keys}})
        return jsonify({'success': True, 'schedules': all_schedules(b)})

    @app.route('/api/bim/floor-plan', methods=['POST'])
    @auth_required
    def _bim_floor_plan():
        data = request.get_json(silent=True) or {}
        b, err = _building_from_request(data)
        if err:
            return jsonify(err[1]), err[0]
        idx = int(data.get('storey_index', 0))
        if idx >= len(b.storeys):
            return jsonify({'success': False,
                             'error': f'storey_index {idx} out of range '
                                      f'(building has {len(b.storeys)} storeys)'}), 400
        width = int(data.get('width_px', 900))
        try:
            svg = floor_plan_svg(b, storey_index=idx, width_px=width)
        except Exception as e:
            logger.exception('floor_plan render failed')
            return jsonify({'success': False, 'error': str(e)}), 500
        s = b.storeys[idx]
        return jsonify({
            'success': True, 'svg': svg, 'format': 'SVG',
            'storey_id': s.id, 'storey_name': s.name,
            'walls_drawn':    len(s.walls),
            'openings_drawn': len(s.openings),
            'spaces_drawn':   len(s.spaces),
        })

    @app.route('/api/bim/family-library', methods=['GET'])
    @auth_required
    def _bim_family_library():
        """Return the full family library — every wall/door/window/slab type
        with sources. Used by the BIM Studio "Family library" browser to let
        the user pick from real, sourced types instead of typing names."""
        return jsonify({'success': True, 'library': get_library()})

    @app.route('/api/bim/types/import', methods=['POST'])
    @auth_required
    def _bim_types_import():
        """Merge the full library into a project's BIM catalog. Idempotent:
        names that already exist are kept as-is (so existing element refs
        are never broken)."""
        data = request.get_json(silent=True) or {}
        pid = data.get('project_id')
        if not pid:
            return jsonify({'success': False, 'error': 'project_id required'}), 400
        proj = _load_project(pid)
        if not proj:
            return jsonify({'success': False, 'error': 'project not found'}), 404
        if not isinstance(proj.get('bim'), dict):
            return jsonify({'success': False, 'error': 'no BIM model on project'}), 400
        b = Building.from_dict(proj['bim'])
        added = merge_library_into(b)
        if not _save_bim(pid, b.to_dict()):
            return jsonify({'success': False, 'error': 'persistence failed'}), 500
        return jsonify({'success': True, 'added': added,
                         'totals': {
                             'walls':   len(b.types.walls),
                             'doors':   len(b.types.doors),
                             'windows': len(b.types.windows),
                             'slabs':   len(b.types.slabs)}})

    @app.route('/api/bim/3d-model', methods=['POST'])
    @auth_required
    def _bim_3d_model():
        """BIM-driven three.js mesh list. Same response shape as the legacy
        /api/drawings/3d-model so the wizard's existing addMesh() works
        unchanged. Each object carries `bim_element_id` so future click-in-3D
        can call /api/bim/element/update."""
        data = request.get_json(silent=True) or {}
        b, err = _building_from_request(data)
        if err:
            return jsonify(err[1]), err[0]
        try:
            result = building_to_three(b)
        except Exception as e:
            logger.exception('bim 3d failed')
            return jsonify({'success': False, 'error': str(e)}), 500
        return jsonify(result)

    @app.route('/api/bim/element/update', methods=['POST'])
    @auth_required
    def _bim_update():
        data = request.get_json(silent=True) or {}
        pid = data.get('project_id')
        elem_id = data.get('element_id')
        patch = data.get('patch') or {}
        if not pid or not elem_id or not isinstance(patch, dict):
            return jsonify({'success': False,
                             'error': 'project_id, element_id, patch required'}), 400
        proj = _load_project(pid)
        if not proj:
            return jsonify({'success': False, 'error': 'project not found'}), 404
        if not isinstance(proj.get('bim'), dict):
            return jsonify({'success': False, 'error': 'no BIM model on project'}), 400

        b = Building.from_dict(proj['bim'])
        target = None
        target_kind = None
        for s in b.storeys:
            for w in s.walls:
                if w.id == elem_id:
                    target, target_kind = w, 'wall'; break
            if target: break
            for o in s.openings:
                if o.id == elem_id:
                    target, target_kind = o, 'opening'; break
            if target: break
            for sp in s.spaces:
                if sp.id == elem_id:
                    target, target_kind = sp, 'space'; break
            if target: break

        if not target:
            return jsonify({'success': False, 'error': 'element not found'}), 404

        # Whitelist of mutable fields per element kind to keep the model honest.
        allowed = {
            'wall':    {'type_name', 'height_m', 'structural_role', 'properties', 'points'},
            'opening': {'type_name', 'position_m', 'sill_m', 'properties'},
            'space':   {'name', 'program', 'properties'},
        }[target_kind]
        applied = {}
        from .bim_model import Point2D
        for k, v in patch.items():
            if k not in allowed:
                continue
            # Special-case `points` — caller sends [{x,y},{x,y}]; we store as Point2D
            if target_kind == 'wall' and k == 'points':
                if not isinstance(v, list) or len(v) < 2:
                    return jsonify({'success': False,
                                     'error': 'points must be a list of >= 2 {x,y} dicts'}), 400
                try:
                    new_pts = [Point2D(x=float(p['x']), y=float(p['y'])) for p in v]
                except Exception as e:
                    return jsonify({'success': False,
                                     'error': f'invalid points: {e}'}), 400
                # Reject zero-length walls — they break the renderer & schedules
                import math as _m
                if _m.hypot(new_pts[1].x - new_pts[0].x,
                             new_pts[1].y - new_pts[0].y) < 0.05:
                    return jsonify({'success': False,
                                     'error': 'wall length below 0.05 m'}), 400
                target.points = new_pts
                applied[k] = [{'x': p.x, 'y': p.y} for p in new_pts]
                continue
            setattr(target, k, v)
            applied[k] = v

        errs = b.validate()
        if errs:
            return jsonify({'success': False,
                             'error': 'validation failed after update',
                             'details': errs}), 400
        if not _save_bim(pid, b.to_dict()):
            return jsonify({'success': False, 'error': 'persistence failed'}), 500
        return jsonify({'success': True, 'element_id': elem_id,
                         'kind': target_kind, 'applied': applied})

    # ----- sheet pack -----

    @app.route('/api/bim/sheet-pack/<project_id>', methods=['GET'])
    @auth_required
    def _bim_sheet_pack_meta(project_id):
        """Return the default sheet pack metadata (sheet list, titles,
        view kinds) for a project. UI uses this to populate the Sheets tab."""
        proj = _load_project(project_id)
        if not proj:
            return jsonify({'success': False, 'error': 'project not found'}), 404
        try:
            if isinstance(proj.get('bim'), dict):
                b = Building.from_dict(proj['bim'])
            else:
                b = Building.from_params(**_params_from_project_data(proj))
        except Exception as e:
            return jsonify({'success': False,
                             'error': f'building load failed: {e}'}), 500
        pack = default_sheet_pack(b)
        return jsonify({'success': True,
                         'pack': sheet_pack_to_metadata(pack)})

    @app.route('/api/bim/sheet-pack/<project_id>/preview/<sheet_no>',
               methods=['GET'])
    @auth_required
    def _bim_sheet_preview(project_id, sheet_no):
        proj = _load_project(project_id)
        if not proj:
            return jsonify({'success': False, 'error': 'project not found'}), 404
        try:
            if isinstance(proj.get('bim'), dict):
                b = Building.from_dict(proj['bim'])
            else:
                b = Building.from_params(**_params_from_project_data(proj))
        except Exception as e:
            return jsonify({'success': False,
                             'error': f'building load failed: {e}'}), 500
        pack = default_sheet_pack(b)
        match = next((s for s in pack.sheets if s.number == sheet_no), None)
        if not match:
            return jsonify({'success': False, 'error': 'sheet not in pack'}), 404
        return jsonify({'success': True, 'sheet_number': match.number,
                         'title': match.title, 'paper': match.paper,
                         'svg': render_sheet_preview_svg(match)})

    @app.route('/api/bim/sheet-pack/<project_id>/pdf', methods=['GET'])
    @auth_required
    def _bim_sheet_pack_pdf(project_id):
        from flask import Response
        proj = _load_project(project_id)
        if not proj:
            return jsonify({'success': False, 'error': 'project not found'}), 404
        try:
            if isinstance(proj.get('bim'), dict):
                b = Building.from_dict(proj['bim'])
            else:
                b = Building.from_params(**_params_from_project_data(proj))
        except Exception as e:
            return jsonify({'success': False,
                             'error': f'building load failed: {e}'}), 500
        pack = default_sheet_pack(b)
        meta = {
            'client':     (proj.get('client') or '–'),
            'drawn_by':   'EIMS-AUTO',
            'checked_by': proj.get('checked_by') or '—',
        }
        try:
            pdf_bytes = build_sheet_pack_pdf(pack, project_meta=meta)
        except Exception as e:
            logger.exception('sheet pack pdf failed')
            return jsonify({'success': False, 'error': str(e)}), 500
        fname = f'{b.name.replace(" ", "_") or "project"}_SheetPack.pdf'
        return Response(pdf_bytes, mimetype='application/pdf', headers={
            'Content-Disposition': f'attachment; filename="{fname}"',
            'Content-Length': str(len(pdf_bytes)),
        })

    # ----- EIMS Copilot (conversational interface) -----

    def _save_copilot_history(pid: str, history: list) -> bool:
        try:
            conn = db_getter()
        except Exception:
            return False
        try:
            row = conn.execute(
                'SELECT data_json FROM projects WHERE id=?', (pid,)
            ).fetchone()
            if not row:
                return False
            proj = json.loads(row['data_json']) if row['data_json'] else {}
            proj['copilot_history'] = history[-40:]  # last 40 messages only
            conn.execute(
                'UPDATE projects SET data_json=?, updated_at=? WHERE id=?',
                (json.dumps(proj), datetime.now().isoformat(), pid))
            conn.commit()
            return True
        finally:
            conn.close()

    @app.route('/api/bim/copilot/status', methods=['GET'])
    @auth_required
    def _copilot_status():
        return jsonify({'success': True, 'configured': copilot_is_configured()})

    @app.route('/api/bim/copilot/history/<project_id>', methods=['GET'])
    @auth_required
    def _copilot_history(project_id):
        proj = _load_project(project_id)
        if not proj:
            return jsonify({'success': False, 'error': 'project not found'}), 404
        history = proj.get('copilot_history') or []
        return jsonify({'success': True, 'history': history})

    @app.route('/api/bim/copilot/reset/<project_id>', methods=['POST'])
    @auth_required
    def _copilot_reset(project_id):
        proj = _load_project(project_id)
        if not proj:
            return jsonify({'success': False, 'error': 'project not found'}), 404
        if _save_copilot_history(project_id, []):
            return jsonify({'success': True})
        return jsonify({'success': False, 'error': 'persistence failed'}), 500

    @app.route('/api/bim/copilot', methods=['POST'])
    @auth_required
    def _copilot_chat():
        data = request.get_json(silent=True) or {}
        pid = data.get('project_id')
        msg = (data.get('message') or '').strip()
        if not pid:
            return jsonify({'success': False, 'error': 'project_id required'}), 400
        if not msg:
            return jsonify({'success': False, 'error': 'message required'}), 400
        proj = _load_project(pid)
        if not proj:
            return jsonify({'success': False, 'error': 'project not found'}), 404
        # Resolve current building (saved bim, else rebuild from params)
        try:
            if isinstance(proj.get('bim'), dict):
                b = Building.from_dict(proj['bim'])
            else:
                b = Building.from_params(**_params_from_project_data(proj))
        except Exception as e:
            return jsonify({'success': False,
                             'error': f'building load failed: {e}'}), 500
        history = proj.get('copilot_history') or []
        result = copilot_run_turn(message=msg, history=history, building=b)

        # Persist the new history (always — even on failures so user sees what happened)
        _save_copilot_history(pid, result.history)
        # Persist mutated building if any tool changed it
        persisted = False
        if result.building_changed and result.new_building is not None:
            persisted = _save_bim(pid, result.new_building.to_dict())

        return jsonify({
            'success':           True,
            'reply':             result.reply_text,
            'tool_calls':        result.tool_calls,
            'building_changed':  result.building_changed,
            'building_persisted': persisted,
            'usage':             result.usage,
            'error':             result.error,
        })

    logger.info('BIM endpoints registered (build, project/<id>, schedules, '
                 'floor-plan, 3d-model, element/update, family-library, '
                 'types/import, sheet-pack, sheet-pack/pdf, copilot)')
