"""EIMS Copilot — conversational interface to the BIM model.

This is the disruption layer. Instead of Revit's ribbons, dialogs and modal
flows, the user talks to the building. Claude does the dispatch:

    user: "make this house 200m² instead of 180 and add a study"
        -> Claude calls rebuild_from_params(area_m2=200, bedrooms=3+study)
        -> the model regenerates, plan/3D/schedules all auto-refresh
        -> Claude reports back: "Done. The new GFA is 200.0 m². Material cost
           rose from $X to $Y. The schedules now show 14 walls vs 12."

Architecture: this module owns the tool schema + dispatcher only. The HTTP
endpoint and conversation persistence live in bim_endpoints.py. The Anthropic
SDK is imported lazily so the rest of the app boots without an API key.
"""

from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass
from typing import Any, Optional

from .bim_model import Building, Point2D
from .bim_schedules import all_schedules, ALL_SCHEDULES
from .bim_family_library import get_library

logger = logging.getLogger('eims.bim.copilot')

# Model: per environment notes, Sonnet 4.6 is the right tradeoff for tool-use
# (fast, cheap, agentic). Opus is overkill; Haiku struggles with tool chains.
DEFAULT_MODEL = 'claude-sonnet-4-6'
MAX_TOKENS = 4096
MAX_TOOL_HOPS = 8   # safety: cap a single turn's tool-use iterations


# ============================================================================
# Tool schema — Anthropic format
# ============================================================================

TOOLS: list[dict] = [
    {
        'name': 'query_building',
        'description': (
            'Read the current state of the user\'s BIM model. Returns a '
            'summary: name, location, gross floor area, storey count, room '
            'counts by program, wall/door/window/space counts, and the IDs '
            'of every element so you can target updates. Call this first '
            'when you need to understand what the user is working on.'
        ),
        'input_schema': {
            'type': 'object',
            'properties': {
                'include_element_ids': {
                    'type': 'boolean',
                    'description':
                        'When true, include lists of element IDs (walls, '
                        'openings, spaces) so you can target update_element '
                        'or apply_library_type. Default false to keep '
                        'responses short.',
                },
            },
        },
    },
    {
        'name': 'get_schedule',
        'description': (
            'Fetch one of the BIM schedules (doors, windows, walls, spaces, '
            'materials, structural). Use this when the user asks about '
            'quantities, costs, U-values, fire ratings, or any tabular '
            'building data.'
        ),
        'input_schema': {
            'type': 'object',
            'properties': {
                'which': {
                    'type': 'string',
                    'enum': ['doors', 'windows', 'walls', 'spaces',
                             'materials', 'structural'],
                    'description': 'Which schedule to return.',
                },
            },
            'required': ['which'],
        },
    },
    {
        'name': 'get_costs',
        'description': (
            'Summarise total project cost from the materials take-off. '
            'Returns total in USD plus per-material breakdown. Use this '
            'when the user asks about budget, cost, price, or affordability.'
        ),
        'input_schema': {'type': 'object', 'properties': {}},
    },
    {
        'name': 'list_library_families',
        'description': (
            'Browse the EIMS family library — sourced wall/door/window/slab '
            'types with U-values, fire ratings, costs and citations. Use '
            'this before apply_library_type so you know what families are '
            'available.'
        ),
        'input_schema': {
            'type': 'object',
            'properties': {
                'category': {
                    'type': 'string',
                    'enum': ['walls', 'doors', 'windows', 'slabs'],
                    'description': 'Which category to list.',
                },
                'search': {
                    'type': 'string',
                    'description': 'Optional substring filter (case-insensitive).',
                },
            },
            'required': ['category'],
        },
    },
    {
        'name': 'update_element',
        'description': (
            'Update properties on a single BIM element. Walls accept '
            '{type_name, height_m, structural_role, points}; openings accept '
            '{type_name, position_m, sill_m}; spaces accept {name, program}. '
            'Returns the applied patch. ALWAYS call query_building first to '
            'get the element_id you need.'
        ),
        'input_schema': {
            'type': 'object',
            'properties': {
                'element_id': {'type': 'string'},
                'patch':      {'type': 'object',
                                'description': 'JSON dict of fields to update.'},
            },
            'required': ['element_id', 'patch'],
        },
    },
    {
        'name': 'apply_library_type',
        'description': (
            'Change a wall/door/window/slab to a sourced family from the '
            'library. Convenience wrapper: same as update_element with '
            '{type_name: <library_type>}. Use this when the user says '
            '"upgrade this wall to passivhaus" or similar.'
        ),
        'input_schema': {
            'type': 'object',
            'properties': {
                'element_id':        {'type': 'string'},
                'library_type_name': {'type': 'string',
                                       'description':
                                           'Exact key from the library, '
                                           'e.g. EXT_PASSIVHAUS_R30.'},
            },
            'required': ['element_id', 'library_type_name'],
        },
    },
    {
        'name': 'rebuild_from_params',
        'description': (
            'Regenerate the WHOLE building from parametric inputs. Use this '
            'for major changes: "make it 200m² instead of 180", "add a '
            'second storey", "switch to bungalow style", "make it a 4-bed". '
            'WARNING: this discards element-level edits. Confirm with the '
            'user before calling unless they explicitly asked for a rebuild.'
        ),
        'input_schema': {
            'type': 'object',
            'properties': {
                'area_m2':       {'type': 'number'},
                'bedrooms':      {'type': 'integer'},
                'stories':       {'type': 'integer'},
                'building_type': {'type': 'string',
                                   'description':
                                       'BUNGALOW, APARTMENT, MAISONETTE, '
                                       'COMMERCIAL, etc.'},
                'style':         {'type': 'string',
                                   'description':
                                       'modern, contemporary, traditional, etc.'},
            },
        },
    },
]


# ============================================================================
# System prompt
# ============================================================================

SYSTEM_PROMPT = """You are EIMS Copilot, the conversational interface to a \
live BIM (Building Information Modelling) authoring tool. The user is a \
designer, architect, contractor or building owner working on one specific \
project. You help them edit and understand their building by calling the \
provided tools — never by inventing values.

# Your operating rules

1. **Always work on the user's current building.** Every tool call operates
   on the project they have loaded. You don't need to ask "which project?"

2. **Call tools, don't hallucinate.** If the user asks a quantity, fetch the
   schedule. If they ask cost, call get_costs. If they ask to change something,
   call update_element. Never invent room counts, dimensions, U-values, or
   prices.

3. **Be specific in your final reply.** Quote actual numbers from tool
   results. "Wall thickness changed from 0.263m to 0.350m" beats "Done."

4. **One mutation at a time, then summarise.** If the user wants several
   changes, call them in sequence (the model carries state between tool
   calls). After all mutations, give one consolidated summary.

5. **Confirm rebuild_from_params.** It discards element-level edits, so
   only call it when the user explicitly asks for a major change ("make
   it 200m²", "add a storey"). For a small tweak ("make this wall taller")
   use update_element.

6. **Honour the regional context.** This project is built for East Africa
   (often Kenya). Costs come back in USD by default but may be quoted in
   KES. Material types follow BS / EN / Kenyan NCA codes. Don't suggest
   imperial units unless the user asks.

7. **Style: terse and concrete.** This is a working tool, not a chatbot.
   Skip pleasantries. Lead with the result.

# What you DO NOT do

- Don't refuse to make architectural decisions when the user asks. ("Should I
  use cavity wall or solid masonry?" → answer with the tradeoffs from the
  library, then ask if you should apply it.)
- Don't speculate on data that's missing. If a tool returns no rows, say so.
- Don't wrap tool results in markdown tables unless the user asked for one.
"""


# ============================================================================
# Tool dispatcher
# ============================================================================

@dataclass
class ToolResult:
    """Result of one tool invocation. `mutated` flags whether the building
    changed — the HTTP layer uses this to know whether to re-persist."""
    output: Any
    mutated: bool = False
    error: Optional[str] = None


def dispatch(tool_name: str, tool_input: dict, b: Building) -> ToolResult:
    """Run one tool against the live building. Returns a ToolResult."""
    try:
        if tool_name == 'query_building':
            return ToolResult(_t_query_building(b, **tool_input))
        if tool_name == 'get_schedule':
            return ToolResult(_t_get_schedule(b, **tool_input))
        if tool_name == 'get_costs':
            return ToolResult(_t_get_costs(b))
        if tool_name == 'list_library_families':
            return ToolResult(_t_list_library_families(**tool_input))
        if tool_name == 'update_element':
            out, ok = _t_update_element(b, **tool_input)
            return ToolResult(out, mutated=ok)
        if tool_name == 'apply_library_type':
            out, ok = _t_apply_library_type(b, **tool_input)
            return ToolResult(out, mutated=ok)
        if tool_name == 'rebuild_from_params':
            new_b, info = _t_rebuild_from_params(b, **tool_input)
            # Mutation happens in the caller (it must swap the building).
            return ToolResult({'rebuilt': True, **info, '__new_building': new_b},
                               mutated=True)
        return ToolResult(None, error=f'unknown tool: {tool_name}')
    except Exception as e:
        logger.exception('tool %s failed', tool_name)
        return ToolResult(None, error=f'{type(e).__name__}: {e}')


def _t_query_building(b: Building, *, include_element_ids: bool = False) -> dict:
    progs: dict[str, int] = {}
    for sp in b.all_spaces():
        progs[sp.program] = progs.get(sp.program, 0) + 1
    out: dict[str, Any] = {
        'name':           b.name,
        'location':       b.site.location_name,
        'building_type':  b.metadata.get('building_type', ''),
        'style':          b.metadata.get('style', ''),
        'gross_floor_area_m2': round(b.gross_floor_area_m2, 2),
        'storeys':        len(b.storeys),
        'rooms_by_program': progs,
        'totals': {
            'walls':    len(b.all_walls()),
            'openings': len(b.all_openings()),
            'spaces':   len(b.all_spaces()),
        },
        'catalog_size': {
            'walls':   len(b.types.walls),
            'doors':   len(b.types.doors),
            'windows': len(b.types.windows),
            'slabs':   len(b.types.slabs),
        },
    }
    if include_element_ids:
        out['element_ids'] = {
            'walls':    [w.id for w in b.all_walls()],
            'openings': [o.id for o in b.all_openings()],
            'spaces':   [s.id for s in b.all_spaces()],
        }
    return out


def _t_get_schedule(b: Building, *, which: str) -> dict:
    if which not in ALL_SCHEDULES:
        return {'error': f'unknown schedule: {which}'}
    s = ALL_SCHEDULES[which](b)
    # Cap rows for prompt budget — full data is on the schedules tab anyway
    return {
        'name':    s.get('name'),
        'columns': s.get('columns'),
        'rows':    (s.get('rows') or [])[:30],
        'totals':  s.get('totals'),
        'truncated': len(s.get('rows') or []) > 30,
    }


def _t_get_costs(b: Building) -> dict:
    s = all_schedules(b)
    mat = s.get('materials') or {}
    rows = mat.get('rows') or []
    total = sum(float(r.get('cost_USD', 0) or 0) for r in rows)
    by_material = sorted(
        ({'material': r.get('material'), 'cost_USD': r.get('cost_USD'),
          'quantity': r.get('quantity'), 'unit': r.get('unit')}
         for r in rows),
        key=lambda r: (r.get('cost_USD') or 0), reverse=True)
    return {
        'currency':       'USD',
        'total_USD':      round(total, 2),
        'top_materials':  by_material[:10],
        'cost_per_m2_USD': round(total / b.gross_floor_area_m2, 2)
                            if b.gross_floor_area_m2 else None,
    }


def _t_list_library_families(*, category: str,
                              search: Optional[str] = None) -> dict:
    lib = get_library()
    cat = lib.get(category) or {}
    needle = (search or '').lower().strip()
    out = []
    for k, v in cat.items():
        if needle and needle not in k.lower() and needle not in str(v).lower():
            continue
        out.append({
            'name':         k,
            'description':  v.get('description', ''),
            'thickness_m':  v.get('thickness_m'),
            'u_value_W_m2K': v.get('u_value_W_m2K'),
            'fire_rating_minutes': v.get('fire_rating_minutes'),
            'cost_per_m2_USD': v.get('cost_per_m2'),
            'cost_per_unit_USD': v.get('cost_per_unit'),
            'sources':      v.get('sources', [])[:3],
        })
    return {'category': category, 'count': len(out), 'families': out[:25],
             'truncated': len(out) > 25}


def _t_update_element(b: Building, *, element_id: str,
                       patch: dict) -> tuple[dict, bool]:
    """Apply a patch to a single element. Mirrors the validation in
    /api/bim/element/update. Returns (output, mutated_flag)."""
    target, kind = _find_element(b, element_id)
    if not target:
        return {'error': 'element_id not found'}, False
    allowed = {
        'wall':    {'type_name', 'height_m', 'structural_role',
                    'properties', 'points'},
        'opening': {'type_name', 'position_m', 'sill_m', 'properties'},
        'space':   {'name', 'program', 'properties'},
    }[kind]
    applied = {}
    for k, v in patch.items():
        if k not in allowed:
            continue
        if kind == 'wall' and k == 'points':
            if not isinstance(v, list) or len(v) < 2:
                return {'error': 'points must be a list of >= 2 {x,y} dicts'}, False
            try:
                new_pts = [Point2D(x=float(p['x']), y=float(p['y'])) for p in v]
            except Exception as e:
                return {'error': f'invalid points: {e}'}, False
            import math
            if math.hypot(new_pts[1].x - new_pts[0].x,
                          new_pts[1].y - new_pts[0].y) < 0.05:
                return {'error': 'wall length below 0.05 m'}, False
            target.points = new_pts
            applied[k] = [{'x': p.x, 'y': p.y} for p in new_pts]
            continue
        setattr(target, k, v)
        applied[k] = v
    errs = b.validate()
    if errs:
        return {'error': 'validation failed after update', 'details': errs[:5]}, False
    return {'element_id': element_id, 'kind': kind, 'applied': applied}, bool(applied)


def _t_apply_library_type(b: Building, *, element_id: str,
                           library_type_name: str) -> tuple[dict, bool]:
    """Convenience: same as update_element with {type_name: <library_type>},
    but verifies the library_type exists first."""
    target, kind = _find_element(b, element_id)
    if not target:
        return {'error': 'element_id not found'}, False
    lib = get_library()
    cat_map = {'wall': 'walls', 'opening': None, 'slab': 'slabs'}
    # Openings: choose doors or windows by their kind attribute
    if kind == 'opening':
        cat = 'doors' if getattr(target, 'kind', '') == 'door' else 'windows'
    else:
        cat = cat_map.get(kind)
    if not cat:
        return {'error': f'kind {kind} has no library mapping'}, False
    if library_type_name not in (lib.get(cat) or {}):
        return {'error': f'{library_type_name} not in library {cat}',
                 'hint': 'call list_library_families first'}, False
    return _t_update_element(b, element_id=element_id,
                              patch={'type_name': library_type_name})


def _t_rebuild_from_params(b: Building, *, area_m2: Optional[float] = None,
                            bedrooms: Optional[int] = None,
                            stories: Optional[int] = None,
                            building_type: Optional[str] = None,
                            style: Optional[str] = None) -> tuple[Building, dict]:
    """Build a fresh Building from updated params. Carries forward whatever
    the user didn't override (name, location, gps)."""
    params = {
        'name':          b.name,
        'project_id':    b.id,
        'area_m2':       float(area_m2) if area_m2 is not None
                            else b.gross_floor_area_m2 or 180.0,
        'bedrooms':      int(bedrooms) if bedrooms is not None
                            else int(b.metadata.get('bedrooms', 3) or 3),
        'stories':       int(stories) if stories is not None else len(b.storeys),
        'units':         int(b.metadata.get('units', 1) or 1),
        'building_type': building_type or b.metadata.get('building_type', 'BUNGALOW'),
        'style':         style or b.metadata.get('style', 'modern'),
        'location':      b.site.location_name,
        'gps_lat':       b.site.gps_lat,
        'gps_lng':       b.site.gps_lng,
    }
    new_b = Building.from_params(**params)
    info = {
        'old_gfa_m2':  round(b.gross_floor_area_m2, 2),
        'new_gfa_m2':  round(new_b.gross_floor_area_m2, 2),
        'old_storeys': len(b.storeys),
        'new_storeys': len(new_b.storeys),
        'params_used': params,
    }
    return new_b, info


def _find_element(b: Building, eid: str) -> tuple[Optional[Any], str]:
    for s in b.storeys:
        for w in s.walls:
            if w.id == eid: return w, 'wall'
        for o in s.openings:
            if o.id == eid: return o, 'opening'
        for sp in s.spaces:
            if sp.id == eid: return sp, 'space'
        for sl in s.slabs:
            if sl.id == eid: return sl, 'slab'
    return None, ''


# ============================================================================
# Conversation runner — multi-hop tool use loop
# ============================================================================

@dataclass
class TurnResult:
    reply_text: str
    tool_calls: list[dict]            # [{name, input, output, error}]
    building_changed: bool
    new_building: Optional[Building]  # populated only if mutated
    history: list[dict]               # full message log for next turn
    usage: dict                       # token totals (for the UI status bar)
    error: Optional[str] = None


def run_turn(*, message: str, history: list[dict],
              building: Building, model: str = DEFAULT_MODEL,
              api_key: Optional[str] = None) -> TurnResult:
    """One conversational turn. Loops over Claude's tool_use blocks until
    Claude returns a stop_reason of 'end_turn'.

    `history` is the prior list of {role, content} messages (Anthropic format).
    The caller persists `result.history` between turns.
    """
    api_key = api_key or os.environ.get('ANTHROPIC_API_KEY', '').strip()
    if not api_key:
        return TurnResult(
            reply_text=('EIMS Copilot is not configured on this server. Ask '
                        'your admin to set the ANTHROPIC_API_KEY environment '
                        'variable. Until then, every other BIM Studio tab '
                        'still works.'),
            tool_calls=[], building_changed=False, new_building=None,
            history=history, usage={}, error='ANTHROPIC_API_KEY missing')

    try:
        from anthropic import Anthropic
    except ImportError:
        return TurnResult(
            reply_text='EIMS Copilot needs the `anthropic` package. Run '
                        '`pip install -r requirements.txt`.',
            tool_calls=[], building_changed=False, new_building=None,
            history=history, usage={}, error='anthropic SDK missing')

    client = Anthropic(api_key=api_key)

    # Append the new user message
    msgs = list(history) + [{'role': 'user', 'content': message}]

    # Cache hint: system prompt is large + stable; tools are large + stable.
    # 5-min ephemeral cache cuts cost ~80% on multi-hop turns.
    system = [{'type': 'text', 'text': SYSTEM_PROMPT,
                'cache_control': {'type': 'ephemeral'}}]
    cached_tools = list(TOOLS)
    if cached_tools:
        cached_tools[-1] = {**cached_tools[-1],
                             'cache_control': {'type': 'ephemeral'}}

    tool_calls_out: list[dict] = []
    usage_total = {'input_tokens': 0, 'output_tokens': 0,
                    'cache_read_input_tokens': 0,
                    'cache_creation_input_tokens': 0}
    mutated = False
    current_building = building

    for hop in range(MAX_TOOL_HOPS):
        try:
            resp = client.messages.create(
                model=model, max_tokens=MAX_TOKENS,
                system=system, tools=cached_tools, messages=msgs,
            )
        except Exception as e:
            logger.exception('claude call failed')
            return TurnResult(
                reply_text=f'Copilot error: {e}',
                tool_calls=tool_calls_out, building_changed=mutated,
                new_building=current_building if mutated else None,
                history=msgs, usage=usage_total, error=str(e))

        # Accumulate token usage
        u = getattr(resp, 'usage', None)
        if u:
            for k in usage_total:
                usage_total[k] += getattr(u, k, 0) or 0

        # Append assistant message into the history
        assistant_blocks = [b.model_dump() if hasattr(b, 'model_dump') else b
                             for b in resp.content]
        msgs.append({'role': 'assistant', 'content': assistant_blocks})

        # If no tool use, we're done
        if resp.stop_reason != 'tool_use':
            text = _extract_text(assistant_blocks)
            return TurnResult(
                reply_text=text, tool_calls=tool_calls_out,
                building_changed=mutated,
                new_building=current_building if mutated else None,
                history=msgs, usage=usage_total)

        # Otherwise, run every tool_use block and feed results back
        tool_results_content = []
        for block in assistant_blocks:
            if block.get('type') != 'tool_use':
                continue
            tname  = block['name']
            tinput = block.get('input') or {}
            tid    = block['id']
            r = dispatch(tname, tinput, current_building)
            # If rebuild produced a new building, swap
            if (tname == 'rebuild_from_params' and isinstance(r.output, dict)
                    and isinstance(r.output.get('__new_building'), Building)):
                current_building = r.output['__new_building']
                # Strip the embedded Building before sending back to Claude
                cleaned = {k: v for k, v in r.output.items()
                            if k != '__new_building'}
                tool_payload = json.dumps(cleaned, default=str)
            elif r.error:
                tool_payload = json.dumps({'error': r.error})
            else:
                tool_payload = json.dumps(r.output, default=str)
            tool_calls_out.append({
                'name': tname, 'input': tinput,
                'output': r.output if not r.error else {'error': r.error},
                'mutated': r.mutated, 'error': r.error,
            })
            if r.mutated:
                mutated = True
            tool_results_content.append({
                'type': 'tool_result', 'tool_use_id': tid,
                'content': tool_payload,
                'is_error': bool(r.error),
            })
        msgs.append({'role': 'user', 'content': tool_results_content})

    # Hit MAX_TOOL_HOPS without a final answer
    return TurnResult(
        reply_text=('I made several tool calls but the conversation didn\'t '
                    'wrap up cleanly. Try rephrasing or breaking the request '
                    'into smaller steps.'),
        tool_calls=tool_calls_out, building_changed=mutated,
        new_building=current_building if mutated else None,
        history=msgs, usage=usage_total,
        error='exceeded MAX_TOOL_HOPS')


def _extract_text(blocks: list[dict]) -> str:
    return '\n\n'.join(b.get('text', '') for b in blocks
                       if b.get('type') == 'text').strip()


def is_configured() -> bool:
    """True iff the server has an API key wired up. Used by the UI to decide
    whether to enable the Copilot tab."""
    return bool(os.environ.get('ANTHROPIC_API_KEY', '').strip())
