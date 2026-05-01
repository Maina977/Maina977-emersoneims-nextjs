"""
Natural-language design-brief parser.

Extracts structured design parameters from a free-text brief such as
  "modern Marbella villa, 4 bedrooms, 600 m2, sea view, infinity pool"
and returns a canonical project dict ready to feed into /api/generate.

Algorithm: regex + keyword matching. No LLM required. This is NOT an
AI model -- it is deterministic pattern extraction. A future upgrade
path can drop in Ollama / OpenRouter if desired, without changing the
endpoint contract.
"""
from __future__ import annotations
from typing import Any
import re
import logging

logger = logging.getLogger('eims')


# Keyword tables -----------------------------------------------------
_STYLE_KEYWORDS = {
    'marbella':     ['marbella', 'andalusian', 'andalusia', 'andaluz', 'moorish',
                      'al-andalus', 'pueblo blanco'],
    'mediterranean': ['mediterranean', 'med', 'greek', 'italian riviera', 'tuscan'],
    'modern':       ['modern', 'minimalist', 'contemporary', 'scandinavian',
                      'clean-lined'],
    'futuristic':   ['futuristic', 'parametric', 'organic', 'biomimetic',
                      'zaha', 'organic-form'],
    'traditional':  ['traditional', 'classical', 'colonial', 'victorian'],
    'tropical':     ['tropical', 'balinese', 'bali', 'thai', 'coastal'],
    'industrial':   ['industrial', 'loft', 'warehouse'],
}

_BUILDING_TYPE_KEYWORDS = {
    'VILLA':       ['villa', 'mansion', 'estate'],
    'BUNGALOW':    ['bungalow', 'cottage'],
    'MANSIONETTE': ['maisonette', 'duplex'],
    'APARTMENT':   ['apartment', 'flat', 'condo', 'penthouse'],
    'TOWNHOUSE':   ['townhouse', 'row house'],
    'OFFICE':      ['office', 'hq', 'headquarters'],
    'HOTEL':       ['hotel', 'resort', 'lodge'],
    'RESTAURANT':  ['restaurant', 'cafe', 'bistro'],
    'SCHOOL':      ['school', 'academy', 'college'],
    'HOSPITAL':    ['hospital', 'clinic', 'medical center'],
    'CHURCH':      ['church', 'cathedral', 'chapel'],
    'MOSQUE':      ['mosque', 'masjid'],
    'MALL':        ['mall', 'shopping center', 'retail'],
    'SHOP':        ['shop', 'boutique', 'store'],
}

_FEATURES = {
    'pool':            ['pool', 'swimming pool', 'infinity pool', 'lap pool'],
    'sea_view':        ['sea view', 'ocean view', 'coastal view', 'beachfront'],
    'mountain_view':   ['mountain view', 'forest view', 'valley view'],
    'garden':          ['garden', 'landscaped garden', 'patio'],
    'courtyard':       ['courtyard', 'atrium', 'riyad'],
    'rooftop_terrace': ['rooftop', 'roof terrace', 'sky terrace'],
    'basement':        ['basement', 'cellar'],
    'garage':          ['garage', 'car park', 'parking'],
    'solar_panels':    ['solar panel', 'pv panel', 'photovoltaic'],
    'smart_home':      ['smart home', 'home automation', 'iot'],
    'guest_house':     ['guest house', 'pool house', 'casita'],
    'gym':             ['gym', 'home gym', 'fitness'],
    'wine_cellar':     ['wine cellar', 'wine room'],
    'sauna':           ['sauna', 'steam room', 'hammam', 'spa'],
    'cinema':          ['cinema', 'home theater', 'media room'],
}

_LOCATION_HINT = {
    'spain':      ['marbella', 'costa del sol', 'malaga', 'madrid', 'barcelona',
                    'andalusia', 'seville', 'ronda'],
    'kenya':      ['nairobi', 'mombasa', 'nakuru', 'kisumu'],
    'uae':        ['dubai', 'abu dhabi', 'sharjah'],
    'usa':        ['miami', 'los angeles', 'new york', 'san francisco', 'beverly hills'],
    'uk':         ['london', 'manchester', 'birmingham'],
    'france':     ['paris', 'nice', 'cannes', 'monaco'],
    'italy':      ['rome', 'milan', 'florence', 'amalfi', 'tuscany'],
}


def _find_number(text: str, patterns: list[str]) -> float | None:
    for p in patterns:
        m = re.search(p, text, re.IGNORECASE)
        if m:
            try:
                # normalise: remove commas, handle "one two three"
                s = m.group(1).replace(',', '').replace(' ', '')
                return float(s)
            except (ValueError, IndexError):
                continue
    # word numbers
    words = {'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6,
             'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10}
    for word, n in words.items():
        if re.search(rf'\b{word}\b', text, re.IGNORECASE):
            # tricky: only return on context patterns
            for p in patterns:
                ctx = p.replace(r'([\d\.,\s]+)', word)
                if re.search(ctx, text, re.IGNORECASE):
                    return float(n)
    return None


def parse(brief: str) -> dict[str, Any]:
    if not isinstance(brief, str) or not brief.strip():
        return {'success': False, 'error': 'brief (non-empty string) required'}

    t = brief.strip()

    # Area (m2)
    area = _find_number(t, [
        r'([\d\.,]+)\s*(?:m[²2]|square\s*met|sqm)',
        r'([\d\.,]+)\s*(?:sf|ft[²2]|square\s*feet|sqft)',
    ])
    # if square feet: convert to m2
    if re.search(r'(?:sf|ft[²2]|square\s*feet|sqft)', t, re.IGNORECASE) and area:
        area = round(area * 0.092903, 1)

    # Bedrooms
    bedrooms = _find_number(t, [
        r'([\d]+)[\s-]*(?:bed(?:room)?s?|br\b)',
        r'([\d]+)[\s-]*bhk',  # Indian usage
    ])

    # Bathrooms
    bathrooms = _find_number(t, [
        r'([\d]+)[\s-]*(?:bath(?:room)?s?|ba\b)',
    ])

    # Stories
    stories = _find_number(t, [
        r'([\d]+)[\s-]*(?:stor(?:e?y)?(?:s|ies)?|floors?|levels?)',
    ])

    # Units (for multi-unit buildings)
    units = _find_number(t, [
        r'([\d]+)[\s-]*(?:units?|apartments?|flats?)',
    ])

    # Style
    style_matches = []
    for style, kws in _STYLE_KEYWORDS.items():
        if any(kw in t.lower() for kw in kws):
            style_matches.append(style)

    # Building type
    btype = None
    for bt, kws in _BUILDING_TYPE_KEYWORDS.items():
        if any(kw in t.lower() for kw in kws):
            btype = bt
            break

    # Features
    feature_matches = []
    for feat, kws in _FEATURES.items():
        if any(kw in t.lower() for kw in kws):
            feature_matches.append(feat)

    # Location
    location_country = None
    location_city = None
    for country, cities in _LOCATION_HINT.items():
        for c in cities:
            if c.lower() in t.lower():
                location_country = country
                location_city = c.title()
                break
        if location_city:
            break

    # Budget (USD, EUR, GBP, KES)
    budget = _find_number(t, [
        r'[\$€£]\s*([\d\.,]+)\s*(?:million|m\b)',
        r'([\d\.,]+)\s*(?:million|m)\s*(?:usd|eur|gbp|kes|dollars?|euros?|pounds?|shillings?)',
        r'budget\s*(?:of)?\s*[\$€£]?\s*([\d\.,]+)',
    ])
    budget_unit = None
    if budget and re.search(r'million|\bm\b', t, re.IGNORECASE):
        budget *= 1_000_000
        budget_unit = 'USD (assumed from format)'

    # Confidence scoring
    signals = sum([bool(area), bool(bedrooms), bool(style_matches),
                   bool(btype), bool(feature_matches), bool(location_city)])
    confidence = min(1.0, signals / 4.0)

    return {
        'success':     True,
        'method':      'Regex + keyword pattern matching (deterministic)',
        'brief_text':  brief,
        'brief_length_chars': len(brief),
        'extracted': {
            'building_type': btype,
            'styles':        style_matches,
            'area_m2':       area,
            'bedrooms':      int(bedrooms) if bedrooms else None,
            'bathrooms':     int(bathrooms) if bathrooms else None,
            'stories':       int(stories) if stories else None,
            'units':         int(units) if units else None,
            'features':      feature_matches,
            'location':      {'country': location_country,
                               'city': location_city},
            'budget':        {'amount': budget, 'note': budget_unit},
        },
        'confidence':  round(confidence, 2),
        'ready_for_generate': confidence >= 0.5 and btype and (area or bedrooms),
        'disclaimer': (
            'Parser is deterministic pattern-matching, not an LLM. For ambiguous '
            'or very short briefs, confidence will be low -- edit fields before '
            'calling /api/generate.'
        ),
    }


def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/design/brief/parse', methods=['POST'])
    def _parse():
        data = request.get_json(silent=True) or {}
        brief = data.get('brief') or data.get('text') or ''
        return jsonify(parse(brief))

    logger.info('Brief parser module registered (deterministic NL extractor)')
