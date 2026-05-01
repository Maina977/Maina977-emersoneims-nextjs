"""Earned Value Management (EVM) reporting per:

  * PMI Practice Standard for Earned Value Management (3rd ed., 2019)
  * ANSI/EIA-748-D ("Standard for Earned Value Management Systems"), 2019
  * AACE International RP 80R-13 ("Estimate at Completion")
  * ISO 21508:2018 ("Earned Value Management in project and programme management")

Computes the canonical EVM metrics from PV, EV and AC at the data date:

    Schedule Variance:   SV  = EV - PV
    Cost Variance:       CV  = EV - AC
    Schedule Performance: SPI = EV / PV
    Cost Performance:     CPI = EV / AC
    BAC, EAC, ETC, VAC, TCPI

Three EAC methods are produced (per AACE RP 80R-13):
   EAC1  = AC + (BAC - EV)                       [remaining at planned rate]
   EAC2  = BAC / CPI                             [remaining at current CPI -- most common]
   EAC3  = AC + (BAC - EV) / (CPI * SPI)         [remaining at combined index]
"""

from __future__ import annotations

import logging
from typing import Any, Dict

logger = logging.getLogger('eims.evm')


def evm_report(*, BAC: float, PV: float, EV: float, AC: float,
                currency: str = 'GBP',
                data_date: str = '') -> Dict[str, Any]:
    if BAC <= 0:
        return {'success': False, 'error': 'BAC must be positive'}
    if min(PV, EV, AC) < 0:
        return {'success': False, 'error': 'PV, EV, AC must be non-negative'}

    SV  = EV - PV
    CV  = EV - AC
    SPI = EV / PV if PV > 0 else None
    CPI = EV / AC if AC > 0 else None

    EAC1 = AC + (BAC - EV)
    EAC2 = BAC / CPI if CPI and CPI > 0 else None
    EAC3 = (AC + (BAC - EV) / (CPI * SPI)) if (CPI and SPI and CPI*SPI > 0) else None

    ETC2 = (EAC2 - AC) if EAC2 is not None else None
    VAC2 = (BAC - EAC2) if EAC2 is not None else None

    # To-Complete Performance Index -- to BAC and to EAC2
    TCPI_BAC = ((BAC - EV) / (BAC - AC)) if (BAC - AC) > 0 else None
    TCPI_EAC = ((BAC - EV) / (EAC2 - AC)) if EAC2 and (EAC2 - AC) > 0 else None

    def _interp(metric, val):
        if val is None:
            return 'n/a'
        if metric == 'index':
            return 'on plan' if abs(val - 1) < 1e-9 else ('ahead/under' if val > 1 else 'behind/over')
        return 'on plan' if abs(val) < 1e-9 else ('favourable' if val > 0 else 'adverse')

    return {
        'success': True,
        'standard': 'PMI EVM (3rd ed., 2019); ANSI/EIA-748-D',
        'reference_eac_methods': 'AACE RP 80R-13',
        'currency': currency, 'data_date': data_date,
        'inputs': {'BAC': BAC, 'PV': PV, 'EV': EV, 'AC': AC},
        'variances': {
            'SV_schedule_variance':  round(SV, 2),
            'CV_cost_variance':      round(CV, 2),
            'SV_status':             _interp('var', SV),
            'CV_status':             _interp('var', CV),
            'SV_pct_of_PV':          round(SV / PV * 100, 2) if PV > 0 else None,
            'CV_pct_of_EV':          round(CV / EV * 100, 2) if EV > 0 else None,
        },
        'performance_indices': {
            'SPI':       round(SPI, 4) if SPI is not None else None,
            'CPI':       round(CPI, 4) if CPI is not None else None,
            'SPI_status': _interp('index', SPI),
            'CPI_status': _interp('index', CPI),
        },
        'forecast': {
            'EAC_method1_planned_rate':           round(EAC1, 2),
            'EAC_method2_current_CPI':            round(EAC2, 2) if EAC2 is not None else None,
            'EAC_method3_CPI_x_SPI':              round(EAC3, 2) if EAC3 is not None else None,
            'ETC_to_complete_using_EAC2':         round(ETC2, 2) if ETC2 is not None else None,
            'VAC_variance_at_completion_method2': round(VAC2, 2) if VAC2 is not None else None,
            'TCPI_to_BAC':                        round(TCPI_BAC, 4) if TCPI_BAC is not None else None,
            'TCPI_to_EAC2':                       round(TCPI_EAC, 4) if TCPI_EAC is not None else None,
        },
        'pct_complete': round(EV / BAC * 100, 2),
        'pct_spent':    round(AC / BAC * 100, 2),
        'pct_planned':  round(PV / BAC * 100, 2),
        'disclaimer': 'EVM metrics computed per PMI / ANSI standards. Forecast '
                      'methods are calculator outputs; selection of which EAC '
                      'is "most realistic" is a project-management judgement.',
    }


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/qs/evm', methods=['POST'])
    def _evm():
        data = request.get_json(silent=True) or {}
        try:
            r = evm_report(
                BAC=float(data.get('BAC', 0)),
                PV=float(data.get('PV', 0)),
                EV=float(data.get('EV', 0)),
                AC=float(data.get('AC', 0)),
                currency=str(data.get('currency', 'GBP')),
                data_date=str(data.get('data_date', '')),
            )
        except (TypeError, ValueError) as e:
            return jsonify({'success': False, 'error': str(e)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    logger.info('Earned Value Management module registered')
