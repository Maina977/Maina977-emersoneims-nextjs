/**
 * SolarGenius proposal — honesty and consistency (2026-10-25 audit round 5).
 * The proposal is an indicative design, not a quotation; its payback, NPV and
 * IRR must come from its own cash-flow table.
 */
import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';
import { proposalFinance, loanMonthlyPayment } from '@/components/solar-modules/crc/src/services/proposalFinance';

const require = createRequire(import.meta.url);
const { dispatch } = require('../../lib/solar-genius/dispatch.js');
const reports = require('../../lib/solar-genius/server/reports.js');

describe('proposalFinance', () => {
  it('payback, NPV and IRR agree with the table', () => {
    const f = proposalFinance({ capexKes: 1_000_000, year1SavingsKes: 250_000, tariffEscalationPct: 0, panelDegradationPct: 0, omPctOfCapex: 0 });
    expect(f.cashFlowTable).toHaveLength(26);
    expect(f.cashFlowTable[0]).toEqual([0, -1_000_000, -1_000_000]);
    expect(f.paybackYears).toBe(4);
    // 25-year annuity of 250k at 10 % = 2.269M → NPV ≈ 1.269M
    expect(f.npvKes!).toBeGreaterThan(1_260_000);
    expect(f.npvKes!).toBeLessThan(1_275_000);
    // IRR of −1M then 250k × 25 ≈ 24.6 %
    expect(f.irrPct!).toBeGreaterThan(24);
    expect(f.irrPct!).toBeLessThan(25.2);
  });

  it('no savings → no payback, no IRR (not a 25 % default)', () => {
    const f = proposalFinance({ capexKes: 500_000, year1SavingsKes: 0 });
    expect(f.paybackYears).toBeNull();
    expect(f.irrPct).toBeNull();
    expect(f.npvKes).toBeNull();
  });

  it('a payback beyond 25 years is reported as none', () => {
    const f = proposalFinance({ capexKes: 5_000_000, year1SavingsKes: 100_000 });
    expect(f.paybackYears).toBeNull();
  });

  it('battery replacement shows in the year it happens', () => {
    const f = proposalFinance({ capexKes: 1_000_000, year1SavingsKes: 250_000, batteryReplacement: { year: 12, costKes: 360_000 } });
    expect(f.cashFlowTable[12][1]).toBeLessThan(0);
  });

  it('loan repayment is amortised, not capex / 50', () => {
    // 1,000,000 at 14 % APR over 60 months ≈ 23,268 / month
    const m = loanMonthlyPayment(1_000_000, 14, 60);
    expect(m).toBeGreaterThan(23_200);
    expect(m).toBeLessThan(23_330);
  });
});

describe('proposal endpoint', () => {
  it('{} → 400, not a PDF of dashes', async () => {
    for (const p of ['proposal', 'proposal-docx', 'proposal-xlsx']) {
      const r = await dispatch('reports', [p], 'POST', {}, {});
      expect(r.status, p).toBe(400);
    }
  });

  it('PDF is an indicative proposal with no quotation terms', () => {
    const f = proposalFinance({ capexKes: 1_000_000, year1SavingsKes: 250_000 });
    const buf: Buffer = reports.buildProposal({
      customer: { name: 'Test' },
      design: { systemKw: 6.8, bom: [['Panel', 14, 12500, 175000]] },
      financial: { capexKes: 1_000_000, year1SavingsKes: 250_000, paybackYears: f.paybackYears, cashFlowTable: f.cashFlowTable },
    });
    expect(buf.subarray(0, 4).toString()).toBe('%PDF');
    const raw = buf.toString('latin1');
    for (const banned of ['Valid until', 'Payment terms', 'Performance guarantee', 'IEEE 1547', 'traceable to an authoritative', 'Signature', 'Client Acceptance']) {
      expect(raw.includes(banned), banned).toBe(false);
    }
    expect(raw).toContain('not a quotation');
    expect(raw).toContain('Net cash by year 25');
    // BOM (175k) vs capex (1M) gap is disclosed
    expect(raw).toContain('not itemised');
  });
});
