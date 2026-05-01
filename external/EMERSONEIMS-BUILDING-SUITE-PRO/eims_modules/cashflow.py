"""Construction cash-flow forecasting and interim valuations.

Two industry-standard tools:

  1. cashflow_s_curve(...)
     Generates a project monthly cumulative spend curve using the
     Bromilow / Tucker S-curve regression (logistic form) widely used in
     construction-finance forecasting:

         y(t) = 1 / (1 + exp(-k * (t - t0)))

     where t is normalised time (0..1) and k controls steepness. Returns
     monthly progress %, monthly spend and cumulative spend.

  2. interim_valuation(...)
     Computes an interim payment certificate per the JCT / NEC family:
         Gross valuation
         less Retention (typ. 3-5%)
         less Previously certified
         less Advance recovery
         plus VAT (if specified)
         = Net amount due

References
----------
* Bromilow, F.J. (1969) "Contract time performance expectations and
  reality", Building Forum, Vol. 1.
* Tucker, S.N. (1988) "A single alternative formula for D.O.E. cash
  flow forecasting", Construction Management & Economics, 6(3).
* JCT Standard Building Contract 2016 (clause 4.9 -- Interim Certificates)
* NEC4 Engineering and Construction Contract (clause 50 -- Assessment)
* RICS Black Book / "Cash Flow Forecasting" guidance note, 2018.
"""

from __future__ import annotations

import logging
import math
from typing import Any, Dict, List, Optional

logger = logging.getLogger('eims.cashflow')


def cashflow_s_curve(*, contract_value: float, duration_months: int,
                      k: float = 6.0, t0: float = 0.5,
                      currency: str = 'GBP') -> Dict[str, Any]:
    """Generate monthly forecast spend on a logistic S-curve.

    k  : steepness (4-8 typical for buildings; 4 = gentle, 8 = steep)
    t0 : inflexion point as fraction of duration (0.5 = mid-project)
    """
    if contract_value <= 0 or duration_months < 1:
        return {'success': False,
                 'error': 'contract_value > 0 and duration_months >= 1 required'}

    # Compute logistic shape, normalised so y(0)=0 and y(1)=1 by subtracting/dividing
    def L(t):
        return 1.0 / (1.0 + math.exp(-k * (t - t0)))
    L0, L1 = L(0.0), L(1.0)
    span = L1 - L0
    if span <= 0:
        return {'success': False, 'error': 'invalid S-curve parameters'}

    months = []
    cumulative_pct_prev = 0.0
    cumulative_amount_prev = 0.0
    for m in range(1, duration_months + 1):
        t = m / duration_months
        cum_pct = (L(t) - L0) / span
        cum_amount = cum_pct * contract_value
        monthly_amount = cum_amount - cumulative_amount_prev
        months.append({
            'month': m,
            'progress_pct': round(cum_pct * 100, 2),
            'monthly_spend': round(monthly_amount, 2),
            'cumulative_spend': round(cum_amount, 2),
        })
        cumulative_pct_prev = cum_pct
        cumulative_amount_prev = cum_amount

    return {
        'success': True,
        'method': 'Logistic S-curve (Bromilow 1969 / Tucker 1988 family)',
        'reference': 'Tucker S.N. (1988) Construction Management & Economics 6(3)',
        'currency': currency,
        'inputs': {'contract_value': contract_value,
                    'duration_months': duration_months,
                    'k_steepness': k, 't0_inflexion_frac': t0},
        'monthly_forecast': months,
        'totals': {
            'forecast_total': round(sum(m['monthly_spend'] for m in months), 2),
            'months_to_50pct': next(
                (m['month'] for m in months if m['progress_pct'] >= 50), None),
        },
        'disclaimer': 'Logistic S-curve is an industry-standard parametric model; '
                      'replace with actual planned-spend from the construction '
                      'programme once available.',
    }


def interim_valuation(*, gross_value_to_date: float,
                       previously_certified: float = 0.0,
                       retention_pct: float = 0.05,
                       retention_cap: Optional[float] = None,
                       advance_payment_recovery: float = 0.0,
                       vat_pct: float = 0.0,
                       half_retention_at_pc: bool = False,
                       practical_completion: bool = False,
                       currency: str = 'GBP') -> Dict[str, Any]:
    """Compute one interim payment certificate.

    half_retention_at_pc, practical_completion : if both True, retention
    drops to half the rate (common JCT mechanism for the moiety release
    on practical completion).
    """
    if gross_value_to_date < 0 or previously_certified < 0:
        return {'success': False,
                 'error': 'gross_value and previously_certified must be >= 0'}

    eff_retention_pct = retention_pct / 2 if (half_retention_at_pc and practical_completion) else retention_pct
    retention_amount = gross_value_to_date * eff_retention_pct
    if retention_cap is not None:
        retention_amount = min(retention_amount, retention_cap)

    net_value_to_date = gross_value_to_date - retention_amount - advance_payment_recovery
    payment_due_excl_vat = max(net_value_to_date - previously_certified, 0.0)
    vat_amount = payment_due_excl_vat * vat_pct
    payment_due_incl_vat = payment_due_excl_vat + vat_amount

    return {
        'success': True,
        'reference': 'JCT SBC 2016 cl. 4.9; NEC4 ECC cl. 50; RICS Black Book',
        'currency': currency,
        'inputs': {
            'gross_value_to_date':       gross_value_to_date,
            'previously_certified':      previously_certified,
            'retention_pct':             retention_pct,
            'effective_retention_pct':   eff_retention_pct,
            'retention_cap':             retention_cap,
            'advance_payment_recovery':  advance_payment_recovery,
            'vat_pct':                   vat_pct,
            'practical_completion':      practical_completion,
            'half_retention_at_pc':      half_retention_at_pc,
        },
        'certificate': {
            'gross_value_to_date':   round(gross_value_to_date, 2),
            'less_retention':        round(retention_amount, 2),
            'less_advance_recovery': round(advance_payment_recovery, 2),
            'net_value_to_date':     round(net_value_to_date, 2),
            'less_previously_certified': round(previously_certified, 2),
            'amount_due_excl_vat':   round(payment_due_excl_vat, 2),
            'vat':                   round(vat_amount, 2),
            'amount_due_incl_vat':   round(payment_due_incl_vat, 2),
        },
        'disclaimer': 'Computational model only. The contract administrator / '
                      'project manager remains responsible for issuing the '
                      'certificate within the timeframes set by the contract '
                      'and applicable construction-payment legislation.',
    }


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/qs/cashflow/s-curve', methods=['POST'])
    def _scurve():
        data = request.get_json(silent=True) or {}
        try:
            r = cashflow_s_curve(
                contract_value=float(data.get('contract_value', 0)),
                duration_months=int(data.get('duration_months', 0)),
                k=float(data.get('k', 6.0)),
                t0=float(data.get('t0', 0.5)),
                currency=str(data.get('currency', 'GBP')),
            )
        except (TypeError, ValueError) as e:
            return jsonify({'success': False, 'error': str(e)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    @app.route('/api/qs/valuation/interim', methods=['POST'])
    def _val():
        data = request.get_json(silent=True) or {}
        try:
            cap = data.get('retention_cap')
            cap = float(cap) if cap is not None else None
            r = interim_valuation(
                gross_value_to_date=float(data.get('gross_value_to_date', 0)),
                previously_certified=float(data.get('previously_certified', 0)),
                retention_pct=float(data.get('retention_pct', 0.05)),
                retention_cap=cap,
                advance_payment_recovery=float(data.get('advance_payment_recovery', 0)),
                vat_pct=float(data.get('vat_pct', 0)),
                half_retention_at_pc=bool(data.get('half_retention_at_pc', False)),
                practical_completion=bool(data.get('practical_completion', False)),
                currency=str(data.get('currency', 'GBP')),
            )
        except (TypeError, ValueError) as e:
            return jsonify({'success': False, 'error': str(e)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    logger.info('Cashflow & interim-valuation module registered')
