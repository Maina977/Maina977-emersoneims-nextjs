// Cash flow, payback, NPV and IRR for proposals, computed from one set of
// stated assumptions so a proposal's headline numbers agree with its own
// cash-flow table (2026-10-25 audit: IRR defaulted to 25 %, NPV to
// "savings × 8", and the table escalated at 2.5 % while the PDF said 3 %).

export interface FinanceAssumptions {
  capexKes: number;
  year1SavingsKes: number;
  years?: number;
  tariffEscalationPct?: number;
  panelDegradationPct?: number;
  omPctOfCapex?: number;
  discountRatePct?: number;
  /** One battery replacement at today's price, e.g. { year: 12, costKes }. */
  batteryReplacement?: { year: number; costKes: number } | null;
}

export interface FinanceResult {
  /** Rows of [year, net cash that year (year 0 = −capex), cumulative]. */
  cashFlowTable: Array<[number, number, number]>;
  paybackYears: number | null;
  npvKes: number | null;
  irrPct: number | null;
  assumptions: Required<Omit<FinanceAssumptions, 'batteryReplacement'>> & { batteryReplacement: FinanceAssumptions['batteryReplacement'] };
}

export function proposalFinance(a: FinanceAssumptions): FinanceResult {
  const assumptions = {
    capexKes: Math.max(0, Number(a.capexKes) || 0),
    year1SavingsKes: Math.max(0, Number(a.year1SavingsKes) || 0),
    years: a.years ?? 25,
    tariffEscalationPct: a.tariffEscalationPct ?? 3,
    panelDegradationPct: a.panelDegradationPct ?? 0.5,
    omPctOfCapex: a.omPctOfCapex ?? 1,
    discountRatePct: a.discountRatePct ?? 10,
    batteryReplacement: a.batteryReplacement ?? null,
  };
  const { capexKes: capex, year1SavingsKes: s1, years } = assumptions;
  const esc = assumptions.tariffEscalationPct / 100;
  const deg = assumptions.panelDegradationPct / 100;
  const om = capex * assumptions.omPctOfCapex / 100;

  const nets: number[] = [-capex];
  for (let y = 1; y <= years; y++) {
    const saving = s1 * Math.pow(1 + esc, y - 1) * Math.pow(1 - deg, y - 1);
    const repl = assumptions.batteryReplacement && assumptions.batteryReplacement.year === y
      ? assumptions.batteryReplacement.costKes : 0;
    nets.push(Math.round(saving - om - repl));
  }
  let cum = 0;
  const cashFlowTable = nets.map((n, y) => { cum += n; return [y, n, cum] as [number, number, number]; });

  if (!(capex > 0) || !(s1 > 0)) {
    return { cashFlowTable, paybackYears: null, npvKes: null, irrPct: null, assumptions };
  }

  // Payback: first year the cumulative turns non-negative, interpolated.
  let paybackYears: number | null = null;
  for (let y = 1; y < cashFlowTable.length; y++) {
    const prev = cashFlowTable[y - 1][2];
    const [, net, cumY] = cashFlowTable[y];
    if (prev < 0 && cumY >= 0 && net > 0) {
      paybackYears = Math.round((y - 1 + (-prev) / net) * 10) / 10;
      break;
    }
  }

  const npvAt = (r: number) => nets.reduce((s, n, y) => s + n / Math.pow(1 + r, y), 0);
  const npvKes = Math.round(npvAt(assumptions.discountRatePct / 100));

  // IRR by bisection; null when the cash flow never changes sign in range.
  let irrPct: number | null = null;
  let lo = -0.9, hi = 1.0;
  let fLo = npvAt(lo), fHi = npvAt(hi);
  if (fLo * fHi < 0) {
    for (let i = 0; i < 100; i++) {
      const mid = (lo + hi) / 2;
      const fMid = npvAt(mid);
      if (fLo * fMid <= 0) { hi = mid; fHi = fMid; } else { lo = mid; fLo = fMid; }
    }
    irrPct = Math.round(((lo + hi) / 2) * 1000) / 10;
  }

  return { cashFlowTable, paybackYears, npvKes, irrPct, assumptions };
}

/** Level monthly repayment of an amortised loan. */
export function loanMonthlyPayment(principalKes: number, aprPct: number, months: number): number {
  const r = aprPct / 100 / 12;
  if (!(principalKes > 0) || !(months > 0)) return 0;
  if (r === 0) return Math.round(principalKes / months);
  return Math.round(principalKes * r / (1 - Math.pow(1 + r, -months)));
}
