"""
Value-engineering assistant (QS tool).

Given a BOQ-like list of material line items, propose substitutions that
preserve structural/functional fitness while reducing cost. Rules-based;
no ML, no external APIs. Each suggestion carries a justification and a
performance-impact flag so the QS can decide whether to accept.

Output is advisory only -- never applied automatically.
"""
from __future__ import annotations
from typing import Any
import logging

logger = logging.getLogger('eims')

# Substitution rule format:
#   src: keywords that match the original item description
#   alt: replacement description
#   saves_pct: typical cost saving vs src (positive = cheaper)
#   performance: 'equivalent' | 'minor_tradeoff' | 'major_tradeoff'
#   basis:       short reason
#   caveat:      thing to check before accepting
_RULES: list[dict[str, Any]] = [
    # ------- CEMENT / CONCRETE -------
    {'src': ['opc', 'portland cement', 'cem i'],
     'alt': 'CEM II/B-M blended cement (30-35% GGBS or fly ash)',
     'saves_pct': 8, 'performance': 'equivalent',
     'basis': 'Lower clinker factor; meets EN 197-1; ~30% lower embodied CO2.',
     'caveat': 'Slightly slower early-age strength gain; not for rapid-strip forms.'},
    {'src': ['c32/40 concrete', 'c35/45 concrete'],
     'alt': 'Reduce to C25/30 for non-critical elements (internal slabs, walls)',
     'saves_pct': 12, 'performance': 'equivalent',
     'basis': 'EN 1992-1-1 minimum grade for RC is C20/25; many elements over-specified.',
     'caveat': 'Confirm with SE; keep original grade for transfer slabs + columns.'},
    # ------- STEEL REBAR -------
    {'src': ['y10 rebar', 'y12 rebar', 'grade 500 rebar', 'deformed bar'],
     'alt': 'Locally-rolled grade 500 MPa rebar (ISO 6935-2 + mill cert)',
     'saves_pct': 10, 'performance': 'equivalent',
     'basis': 'Same characteristic yield; import duty + logistics saved.',
     'caveat': 'Verify mill test certificate per batch; check ductility class (B or C).'},
    # ------- STRUCTURAL STEEL -------
    {'src': ['s355 steel', 's355 section'],
     'alt': 'S275 for secondary members (purlins, floor beams < 8 m)',
     'saves_pct': 15, 'performance': 'minor_tradeoff',
     'basis': 'S275 is sufficient for many typical loads; S355 reserved for long spans/columns.',
     'caveat': 'Run SE re-check; weight may increase slightly (deeper sections).'},
    # ------- MASONRY -------
    {'src': ['fair-faced blockwork', 'exposed blockwork'],
     'alt': 'Standard 7 N/mm2 blockwork + skim-render finish',
     'saves_pct': 18, 'performance': 'equivalent',
     'basis': 'Visual finish matched by render; no change in structural performance.',
     'caveat': 'Render adds ~3 days to programme; spec acrylic render for durability.'},
    {'src': ['natural stone cladding', 'marble cladding'],
     'alt': 'High-quality porcelain cladding with stone appearance',
     'saves_pct': 35, 'performance': 'minor_tradeoff',
     'basis': 'Modern rectified porcelain indistinguishable at > 2 m; lighter fixings.',
     'caveat': 'Sample approval with client; lifetime > stone but not heritage-grade.'},
    # ------- GLAZING -------
    {'src': ['triple glazed', 'triple-glazed'],
     'alt': 'Double-glazed unit with warm-edge spacer + low-e coating (U ~ 1.1)',
     'saves_pct': 22, 'performance': 'minor_tradeoff',
     'basis': 'For climate zones 3-5 (mild), double low-e meets building-reg U-value.',
     'caveat': 'Not for cold climates (zone 7-8); verify acoustic spec if city site.'},
    # ------- ROOFING -------
    {'src': ['clay tile', 'natural slate'],
     'alt': 'Concrete tile (profiled) or composite slate',
     'saves_pct': 28, 'performance': 'minor_tradeoff',
     'basis': 'Same warranty period typically; aesthetic difference closes up at distance.',
     'caveat': 'Weight change: check rafter spec; clay/slate are heritage-appropriate.'},
    # ------- FLOORING -------
    {'src': ['solid hardwood floor', 'oak floor'],
     'alt': 'Engineered oak floor (3 mm oak veneer on ply)',
     'saves_pct': 30, 'performance': 'equivalent',
     'basis': 'Same visual + can be refinished 1-2 times; dimensionally more stable.',
     'caveat': 'Refinishing limited vs solid; not for heritage listed work.'},
    {'src': ['natural stone floor'],
     'alt': 'Large-format porcelain with stone-effect print',
     'saves_pct': 40, 'performance': 'minor_tradeoff',
     'basis': 'Modern porcelain indistinguishable at 2 m; slip rating R10+ available.',
     'caveat': 'Client sample; not recommended for super-prime residential.'},
    # ------- INSULATION -------
    {'src': ['closed-cell pir insulation', 'kingspan'],
     'alt': 'Rockwool (mineral wool) + vapour barrier',
     'saves_pct': 20, 'performance': 'minor_tradeoff',
     'basis': 'Thicker build-up needed (~ +30 mm) but fire performance A1 vs B.',
     'caveat': 'Check cavity width; extra thickness may affect detailing.'},
    # ------- M&E -------
    {'src': ['copper pipework', 'copper plumbing'],
     'alt': 'PPR or multilayer (PEX-Al-PEX) for hot + cold distribution',
     'saves_pct': 35, 'performance': 'equivalent',
     'basis': 'Meets BS EN 12201 / 16412; faster install; same design life.',
     'caveat': 'Check local code acceptance; copper retained for solar primary loop.'},
    {'src': ['mineral wool mmc', 'fire-resistant cable'],
     'alt': 'Standard XLPE cable in galv steel conduit for routes < 1 h rating',
     'saves_pct': 25, 'performance': 'equivalent',
     'basis': 'BS 7671 accepts conduit-enclosed XLPE for most non-critical circuits.',
     'caveat': 'Keep fire-rated cable for escape routes + emergency lighting.'},
    # ------- FINISHES -------
    {'src': ['suspended gypsum ceiling'],
     'alt': 'Exposed soffit with acoustic rafts at active zones',
     'saves_pct': 55, 'performance': 'minor_tradeoff',
     'basis': 'Modern industrial aesthetic; higher ceiling height usable.',
     'caveat': 'M&E routing must be coordination-quality; not for ultra-luxury.'},
    {'src': ['solid timber door', 'hardwood door'],
     'alt': 'Engineered timber door (hollow-core with solid lippings, hardwood veneer)',
     'saves_pct': 40, 'performance': 'equivalent',
     'basis': 'Acoustic + fire rating identical when tested; lighter hinges.',
     'caveat': 'Client sample for entrance doors; hollow unsuitable for public frequent-use.'},
]


def _match(desc: str, keywords: list[str]) -> bool:
    d = desc.lower()
    return any(k in d for k in keywords)


def suggest(boq_items: list[dict[str, Any]]) -> dict[str, Any]:
    """boq_items: [{'description': str, 'quantity': float, 'unit': str, 'rate': float}, ...]"""
    if not isinstance(boq_items, list) or not boq_items:
        return {'success': False, 'error': 'boq_items must be a non-empty list'}

    suggestions = []
    total_saving = 0.0
    total_original = 0.0
    for i, it in enumerate(boq_items):
        desc = str(it.get('description', '')).strip()
        qty = float(it.get('quantity', 0) or 0)
        rate = float(it.get('rate', 0) or 0)
        original_cost = qty * rate
        total_original += original_cost

        matched = None
        for rule in _RULES:
            if _match(desc, rule['src']):
                matched = rule
                break

        if not matched:
            continue

        saving = original_cost * matched['saves_pct'] / 100.0
        total_saving += saving
        suggestions.append({
            'line': i + 1,
            'original': desc,
            'original_cost': round(original_cost, 2),
            'suggested_alternative': matched['alt'],
            'typical_saving_pct': matched['saves_pct'],
            'estimated_saving': round(saving, 2),
            'performance_impact': matched['performance'],
            'basis': matched['basis'],
            'caveat_before_accepting': matched['caveat'],
        })

    return {
        'success': True,
        'method': 'Rule-based value-engineering advisor (RICS VE principles)',
        'disclaimer': (
            'Suggestions are ADVISORY only. Each substitution must be reviewed '
            'by the design team (SE + MEP + Architect) before acceptance. '
            'Saving percentages are market-typical and vary by region + volume.'
        ),
        'items_reviewed': len(boq_items),
        'suggestions_found': len(suggestions),
        'total_original_cost': round(total_original, 2),
        'total_estimated_saving': round(total_saving, 2),
        'saving_pct_of_reviewed_scope': (
            round(100.0 * total_saving / total_original, 2) if total_original > 0 else 0.0
        ),
        'suggestions': suggestions,
    }


def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/qs/ve/suggest', methods=['POST'])
    def _ve():
        data = request.get_json(silent=True) or {}
        items = data.get('boq_items') or data.get('items') or []
        return jsonify(suggest(items))

    @app.route('/api/qs/ve/rules', methods=['GET'])
    def _ve_rules():
        return jsonify({
            'success': True,
            'count': len(_RULES),
            'rules_sample': [{'triggers_on': r['src'],
                              'suggests': r['alt'],
                              'saves_pct': r['saves_pct']} for r in _RULES],
        })

    logger.info('Value-engineering module registered (rule-based advisor)')
