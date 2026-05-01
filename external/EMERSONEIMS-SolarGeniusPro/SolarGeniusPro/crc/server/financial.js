// Financial engineering module — real algorithms, no mocks.
// All formulas: standard corporate finance + Kenya-specific tariff data.
// Sources cited inline with each function for the data-provenance policy.

// ---------------------------------------------------------------------------
// 1. NPV — Net Present Value
//    NPV = Σ (CFt / (1+r)^t)  for t=0..N
//    Source: Brealey/Myers "Principles of Corporate Finance", Ch 5
// ---------------------------------------------------------------------------
function npv(discountRate, cashFlows) {
  if (!Array.isArray(cashFlows) || cashFlows.length === 0) {
    throw new Error('cashFlows must be a non-empty array (year 0 = -investment)');
  }
  let total = 0;
  for (let t = 0; t < cashFlows.length; t++) {
    total += cashFlows[t] / Math.pow(1 + discountRate, t);
  }
  return total;
}

// ---------------------------------------------------------------------------
// 2. IRR — Internal Rate of Return (Newton–Raphson, then bisection fallback)
//    Solves: NPV(r) = 0
// ---------------------------------------------------------------------------
function irr(cashFlows, guess = 0.1) {
  const MAX_ITER = 100;
  const TOL = 1e-7;
  // Newton–Raphson
  let r = guess;
  for (let i = 0; i < MAX_ITER; i++) {
    let f = 0, fPrime = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      const denom = Math.pow(1 + r, t);
      f += cashFlows[t] / denom;
      if (t > 0) fPrime -= (t * cashFlows[t]) / Math.pow(1 + r, t + 1);
    }
    if (Math.abs(f) < TOL) return r;
    if (fPrime === 0) break;
    const next = r - f / fPrime;
    if (Math.abs(next - r) < TOL) return next;
    r = next;
    if (r <= -0.999) r = -0.999; // keep in domain
  }
  // Bisection fallback in [-0.99, 10]
  let lo = -0.99, hi = 10;
  const fAt = (x) => cashFlows.reduce((s, c, t) => s + c / Math.pow(1 + x, t), 0);
  let fLo = fAt(lo), fHi = fAt(hi);
  if (fLo * fHi > 0) return null; // no sign change → no real IRR in range
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fMid = fAt(mid);
    if (Math.abs(fMid) < TOL) return mid;
    if (fMid * fLo < 0) { hi = mid; fHi = fMid; } else { lo = mid; fLo = fMid; }
  }
  return (lo + hi) / 2;
}

// ---------------------------------------------------------------------------
// 3. Loan amortization — flat-rate annuity (PMT formula)
//    PMT = P * r(1+r)^n / ((1+r)^n - 1)
// ---------------------------------------------------------------------------
function amortize(principal, annualRate, years, paymentsPerYear = 12) {
  const n = years * paymentsPerYear;
  const r = annualRate / paymentsPerYear;
  const pmt = r === 0 ? principal / n
                      : principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const schedule = [];
  let balance = principal;
  let totalInterest = 0;
  for (let i = 1; i <= n; i++) {
    const interest = balance * r;
    const principalPaid = pmt - interest;
    balance -= principalPaid;
    totalInterest += interest;
    schedule.push({
      period: i,
      payment: round2(pmt),
      interest: round2(interest),
      principal: round2(principalPaid),
      balance: round2(Math.max(0, balance))
    });
  }
  return {
    payment: round2(pmt),
    totalPaid: round2(pmt * n),
    totalInterest: round2(totalInterest),
    schedule
  };
}

// ---------------------------------------------------------------------------
// 4. Inflation-adjusted projection
//    Real = Nominal / (1+inflation)^t
// ---------------------------------------------------------------------------
function inflateSeries(baseAmount, inflationRate, years) {
  const out = [];
  for (let t = 0; t < years; t++) {
    out.push({
      year: t + 1,
      nominal: round2(baseAmount * Math.pow(1 + inflationRate, t)),
      real: round2(baseAmount) // base year purchasing power
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// 5. KPLC tariff schedule — Kenya electricity rates (KES/kWh, incl. taxes/levies)
//    Source: EPRA tariff order Q1 2026, KPLC published rates
//    https://www.epra.go.ke
// ---------------------------------------------------------------------------
const KPLC_TARIFFS_2026 = {
  domestic: {
    DC: { name: 'Domestic Lifeline (0–30 kWh)',  energyKES: 12.22, fixedKES: 0,    upTo: 30 },
    DC1: { name: 'Domestic Ordinary (31–100)',   energyKES: 16.30, fixedKES: 200,  upTo: 100 },
    DC2: { name: 'Domestic Ordinary (101–15000)', energyKES: 21.39, fixedKES: 200, upTo: 15000 }
  },
  smallCommercial: {
    SC: { name: 'Small Commercial (0–15000)', energyKES: 17.66, fixedKES: 800, upTo: 15000 }
  },
  // Levies & taxes typically added on top:
  levies: {
    fuelEnergyCharge: 3.50,    // KES/kWh (variable monthly; 2026 avg)
    foreignExchange: 1.30,     // KES/kWh
    inflationAdjustment: 0.50, // KES/kWh
    repLevy: 0.05,             // KES/kWh (Rural Electrification Programme)
    erc: 0.03,                 // KES/kWh (Energy Regulatory Commission)
    vat: 0.16                  // 16% on energy + levies
  },
  source: 'EPRA tariff order Q1 2026 (epra.go.ke); KPLC published rates'
};

function kplcMonthlyBill(kWh, category = 'DC2') {
  const all = { ...KPLC_TARIFFS_2026.domestic, ...KPLC_TARIFFS_2026.smallCommercial };
  const tariff = all[category] || all.DC2;
  const L = KPLC_TARIFFS_2026.levies;
  const energy = kWh * tariff.energyKES;
  const levies = kWh * (L.fuelEnergyCharge + L.foreignExchange + L.inflationAdjustment + L.repLevy + L.erc);
  const subtotal = energy + tariff.fixedKES + levies;
  const vat = subtotal * L.vat;
  const total = subtotal + vat;
  return {
    category,
    kWh,
    energyCharge: round2(energy),
    fixedCharge: tariff.fixedKES,
    levies: round2(levies),
    vat: round2(vat),
    total: round2(total),
    effectiveKESperKWh: round2(total / kWh)
  };
}

// ---------------------------------------------------------------------------
// 6. Multi-currency conversion
//    Source: Frankfurter (https://www.frankfurter.app) — ECB reference rates,
//    truly free, no key. Fallback: open.er-api.com.
// ---------------------------------------------------------------------------
async function fetchWithTimeout(url, opts = {}, timeoutMs = 6000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try { return await fetch(url, { ...opts, signal: ctrl.signal }); }
  finally { clearTimeout(t); }
}

async function convertCurrency(amount, from, to) {
  if (from === to) return { amount, from, to, rate: 1, source: 'identity' };
  // Primary: Frankfurter (ECB)
  try {
    const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;
    const r = await fetchWithTimeout(url, {}, 6000);
    if (r.ok) {
      const j = await r.json();
      const converted = j?.rates?.[to];
      if (typeof converted === 'number') {
        return {
          amount: converted,
          rate: converted / amount,
          from, to,
          date: j.date,
          provenance: { source: 'Frankfurter (ECB reference rates)', url: 'https://www.frankfurter.app', license: 'free public API', retrieved_at: new Date().toISOString() }
        };
      }
    }
  } catch (_) { /* fall through to backup */ }
  // Fallback: open.er-api.com
  try {
    const r2 = await fetchWithTimeout(`https://open.er-api.com/v6/latest/${from}`, {}, 6000);
    if (!r2.ok) throw new Error(`open.er-api.com HTTP ${r2.status}`);
    const j2 = await r2.json();
    const rate = j2?.rates?.[to];
    if (typeof rate !== 'number') throw new Error(`Currency '${to}' not found in fallback feed.`);
    return {
      amount: amount * rate,
      rate,
      from, to,
      date: j2.time_last_update_utc,
      provenance: { source: 'open.er-api.com', license: 'free public API (fallback)', retrieved_at: new Date().toISOString() }
    };
  } catch (e) {
    const err = new Error(`Both Frankfurter and open.er-api.com unavailable: ${e.name === 'AbortError' ? 'timeout' : e.message}`);
    err.statusCode = 503;
    throw err;
  }
}

// ---------------------------------------------------------------------------
// 7. Profit margin / quote pricing
// ---------------------------------------------------------------------------
function profitMargin({ cost, sellingPrice }) {
  if (!cost || !sellingPrice) throw new Error('cost and sellingPrice are required');
  const profit = sellingPrice - cost;
  const marginPct = (profit / sellingPrice) * 100;
  const markupPct = (profit / cost) * 100;
  return {
    cost: round2(cost),
    sellingPrice: round2(sellingPrice),
    profit: round2(profit),
    marginPct: round2(marginPct),     // profit / sellingPrice
    markupPct: round2(markupPct),     // profit / cost
    breakEvenSellingPrice: round2(cost)
  };
}

// ---------------------------------------------------------------------------
// 8. Loan vs cash comparison
// ---------------------------------------------------------------------------
function loanVsCash({ systemCost, annualSavings, years, loanRate, downPaymentPct = 0.2, discountRate = 0.10 }) {
  // Cash scenario: pay everything upfront
  const cashFlowsCash = [-systemCost, ...Array(years).fill(annualSavings)];
  const cashNPV = npv(discountRate, cashFlowsCash);
  const cashIRR = irr(cashFlowsCash);

  // Loan scenario: down-payment now, monthly payments
  const downPayment = systemCost * downPaymentPct;
  const principal = systemCost - downPayment;
  const loan = amortize(principal, loanRate, years, 12);
  const annualLoanCost = loan.payment * 12;
  const cashFlowsLoan = [-downPayment];
  for (let y = 1; y <= years; y++) {
    cashFlowsLoan.push(annualSavings - annualLoanCost);
  }
  const loanNPV = npv(discountRate, cashFlowsLoan);
  const loanIRR = irr(cashFlowsLoan);

  return {
    cash: {
      upfront: round2(systemCost),
      annualNet: round2(annualSavings),
      totalSavings: round2(annualSavings * years - systemCost),
      npv: round2(cashNPV),
      irr: cashIRR != null ? round4(cashIRR) : null
    },
    loan: {
      downPayment: round2(downPayment),
      monthlyPayment: round2(loan.payment),
      totalLoanPaid: round2(loan.totalPaid),
      totalInterest: round2(loan.totalInterest),
      annualNet: round2(annualSavings - annualLoanCost),
      totalSavings: round2((annualSavings - annualLoanCost) * years - downPayment),
      npv: round2(loanNPV),
      irr: loanIRR != null ? round4(loanIRR) : null
    },
    recommendation: cashNPV >= loanNPV ? 'cash' : 'loan',
    delta: round2(cashNPV - loanNPV)
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function round2(x) { return Math.round(x * 100) / 100; }
function round4(x) { return Math.round(x * 10000) / 10000; }

module.exports = {
  npv, irr, amortize, inflateSeries,
  kplcMonthlyBill, KPLC_TARIFFS_2026,
  convertCurrency, profitMargin, loanVsCash
};
