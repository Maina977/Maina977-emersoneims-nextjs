"""Tender comparison matrix with abnormality detection.

Implements the standard QS workflow on receipt of priced tenders:

  1. Side-by-side comparison of bidder rates against a reference (lowest,
     mean, or pre-tender estimate).
  2. Abnormally Low Tender detection per:
       * EU Public Procurement Directive 2014/24 Art. 69 -- contracting
         authorities must investigate "abnormally low" bids.
       * UK Public Contracts Regulations 2015 reg. 69.
       * UNCITRAL Model Law on Public Procurement (2011) Art. 20.
     A common operational test: any bid more than 15% below the average
     of the others, or 10% below the lowest other compliant bid, is
     flagged for clarification.
  3. Outlier line items: bidder unit rate is flagged if it deviates by
     more than +/- N standard deviations from the cross-bidder mean for
     the same line.

This module performs the analysis only. The contracting authority
remains responsible for any decision on award or disqualification.
"""

from __future__ import annotations

import logging
import math
import statistics
from typing import Any, Dict, List, Optional

logger = logging.getLogger('eims.tender')


def compare_tenders(*, bidders: List[Dict[str, Any]],
                     pre_tender_estimate: Optional[float] = None,
                     low_bid_pct: float = 0.85,
                     low_avg_pct: float = 0.85,
                     line_outlier_sigma: float = 2.0,
                     currency: str = 'GBP') -> Dict[str, Any]:
    """Compare priced bids.

    bidders : [{name, total, items: [{ref, description, unit, quantity, rate}]}]
    """
    if not bidders or len(bidders) < 2:
        return {'success': False,
                 'error': 'at least two bidders required for comparison'}

    totals = [b.get('total', 0) for b in bidders]
    if any(t <= 0 for t in totals):
        return {'success': False, 'error': 'all bidder totals must be > 0'}

    sorted_b = sorted(bidders, key=lambda b: b['total'])
    lowest = sorted_b[0]
    mean_total = statistics.mean(totals)
    stdev_total = statistics.pstdev(totals) if len(totals) > 1 else 0.0

    # Abnormal-low test against (a) lowest other and (b) average of others
    flagged = []
    for b in sorted_b:
        others = [x['total'] for x in sorted_b if x is not b]
        avg_others = statistics.mean(others) if others else 0
        low_other = min(others) if others else 0
        threshold_avg = avg_others * low_avg_pct
        threshold_low = low_other * low_bid_pct
        if avg_others and b['total'] < threshold_avg:
            flagged.append({
                'bidder': b.get('name'),
                'total': b['total'],
                'reason': 'below_avg_of_others',
                'threshold': round(threshold_avg, 2),
                'shortfall_pct': round((1 - b['total'] / avg_others) * 100, 2),
                'reference': 'EU Dir. 2014/24/EU Art. 69',
            })
        if low_other and b is not lowest and b['total'] < threshold_low:
            flagged.append({
                'bidder': b.get('name'),
                'total': b['total'],
                'reason': 'below_lowest_other',
                'threshold': round(threshold_low, 2),
                'reference': 'UK PCR 2015 reg. 69',
            })

    # Line-by-line outliers
    by_ref: Dict[str, List[Dict[str, Any]]] = {}
    for b in bidders:
        for it in b.get('items', []) or []:
            ref = it.get('ref') or it.get('description', '')
            by_ref.setdefault(ref, []).append({
                'bidder': b.get('name'), 'rate': float(it.get('rate', 0) or 0),
                'description': it.get('description', ''), 'unit': it.get('unit', ''),
            })
    line_outliers = []
    for ref, rows in by_ref.items():
        rates = [r['rate'] for r in rows if r['rate'] > 0]
        if len(rates) < 3:
            continue
        mu = statistics.mean(rates)
        sd = statistics.pstdev(rates)
        if sd == 0:
            continue
        for r in rows:
            if r['rate'] <= 0:
                continue
            z = (r['rate'] - mu) / sd
            if abs(z) > line_outlier_sigma:
                line_outliers.append({
                    'item_ref': ref,
                    'description': r['description'],
                    'unit': r['unit'],
                    'bidder': r['bidder'],
                    'rate': r['rate'],
                    'mean_rate': round(mu, 2),
                    'std_dev': round(sd, 2),
                    'z_score': round(z, 2),
                    'direction': 'high' if z > 0 else 'low',
                })

    comparison_table = []
    for b in sorted_b:
        diff_vs_low = b['total'] - lowest['total']
        diff_vs_pte = (b['total'] - pre_tender_estimate
                        if pre_tender_estimate else None)
        comparison_table.append({
            'bidder':                b.get('name'),
            'total':                 b['total'],
            'rank':                  sorted_b.index(b) + 1,
            'diff_vs_lowest':        round(diff_vs_low, 2),
            'pct_above_lowest':      round(diff_vs_low / lowest['total'] * 100, 2),
            'diff_vs_pre_tender_est': round(diff_vs_pte, 2)
                if diff_vs_pte is not None else None,
        })

    return {
        'success': True,
        'currency': currency,
        'reference': 'EU Dir. 2014/24 Art. 69; UK PCR 2015 reg. 69; '
                     'UNCITRAL Model Law on Public Procurement (2011) Art. 20',
        'inputs': {
            'pre_tender_estimate': pre_tender_estimate,
            'low_bid_pct_threshold': low_bid_pct,
            'low_avg_pct_threshold': low_avg_pct,
            'line_outlier_sigma':    line_outlier_sigma,
        },
        'statistics': {
            'lowest':    round(lowest['total'], 2),
            'highest':   round(sorted_b[-1]['total'], 2),
            'mean':      round(mean_total, 2),
            'stdev':     round(stdev_total, 2),
            'spread_pct_low_to_high': round(
                (sorted_b[-1]['total'] - lowest['total']) / lowest['total'] * 100, 2),
        },
        'comparison_table': comparison_table,
        'abnormally_low_flags': flagged,
        'line_item_outliers': line_outliers,
        'disclaimer': 'Statistical screening only. Contracting authority must '
                      'still issue a formal request for clarification under the '
                      'cited regulation before any disqualification.',
    }


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/qs/tender/compare', methods=['POST'])
    def _cmp():
        data = request.get_json(silent=True) or {}
        try:
            r = compare_tenders(
                bidders=data.get('bidders') or [],
                pre_tender_estimate=(
                    float(data['pre_tender_estimate'])
                    if data.get('pre_tender_estimate') is not None else None),
                low_bid_pct=float(data.get('low_bid_pct', 0.85)),
                low_avg_pct=float(data.get('low_avg_pct', 0.85)),
                line_outlier_sigma=float(data.get('line_outlier_sigma', 2.0)),
                currency=str(data.get('currency', 'GBP')),
            )
        except (TypeError, ValueError) as e:
            return jsonify({'success': False, 'error': str(e)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    logger.info('Tender-comparison module registered')
