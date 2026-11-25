import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import SolarROICalculator, { ROI_DRAFT_FORM } from '@/components/solar/SolarROICalculator';
import { DRAFT_PREFIX } from '@/lib/loading/sessionDraft';
import { PERFORMANCE_RATIO, BATTERY_DOD, BATTERY_EFFICIENCY, REQUEST_QUOTATION } from '@/lib/solar/sizing';
import benchmarks from '@/data/solar-hub/test-cases/roi-benchmarks-2026-11-25.json';
import refs from '@/data/solar-hub/references/solar-hub-references-2026-11-25.json';

/**
 * Test-case programme for the ROI / Savings Calculator (2026-11-25).
 * The cases are SYNTHETIC (hand-calculated, not metered installations); each
 * expected value carries a tolerance. They run through the real component, as
 * the customer sees it, so a change to the formula or to its display fails here.
 */

beforeEach(() => sessionStorage.clear());
afterEach(() => { cleanup(); sessionStorage.clear(); });

const num = (s: string) => Number(s.replace(/[^0-9.-]/g, ''));
const shown = (label: string) => (screen.getByText(label, { selector: 'p' }).previousElementSibling?.textContent ?? '').trim();
const next = (label: string) => (screen.getByText(label).nextElementSibling?.textContent ?? '').trim();

type Expected = Partial<Record<'monthlySavingsKes' | 'paybackYears' | 'roiPercent' | 'netSavingsMillions' | 'coveragePercent' | 'co2KgPerYear', number>> & { paybackText?: string };

describe('ROI benchmark cases (synthetic, hand-calculated)', () => {
  it('the programme is labelled synthetic and every case has a hand calculation', () => {
    expect(benchmarks.label).toBe('SYNTHETIC');
    for (const c of benchmarks.cases) expect(c.handCalc.length).toBeGreaterThan(20);
  });

  for (const c of benchmarks.cases) {
    it(`${c.id}: within tolerance`, () => {
      sessionStorage.setItem(DRAFT_PREFIX + ROI_DRAFT_FORM, JSON.stringify(c.inputs));
      render(<SolarROICalculator />);
      const e = c.expected as Expected;
      const tol = c.tolerance as Record<string, number>;
      const actual: Record<string, number> = {
        monthlySavingsKes: num(shown('Monthly Savings')),
        paybackYears: num(shown('Payback Period')),
        roiPercent: num(shown('25-Year ROI')),
        netSavingsMillions: num(shown('25-Year Net Savings')),
        coveragePercent: num(next('Energy Coverage')),
        co2KgPerYear: num(next('Annual CO2 Offset')),
      };
      for (const [k, v] of Object.entries(e)) {
        if (k === 'paybackText') { expect(shown('Payback Period')).toBe(v); continue; }
        expect(Math.abs(actual[k] - (v as number)), `${c.id} ${k}: expected ${v}, got ${actual[k]}`).toBeLessThanOrEqual(tol[k] ?? 0);
      }
    });
  }
});

describe('ROI invalid inputs are rejected, never turned into a result', () => {
  const set = (id: string, value: string) => fireEvent.change(document.getElementById(id) as HTMLInputElement, { target: { value } });

  it('I1/I2: a zero or negative tariff is not used', () => {
    render(<SolarROICalculator />);
    set('roi-cost', '600000');
    for (const v of ['0', '-5']) {
      set('roi-tariff', v);
      expect(shown('Monthly Savings')).toBe('Enter your tariff');
      expect(shown('Payback Period')).toBe('Enter your tariff');
      expect(next('Energy Coverage')).toBe('Enter your bill and tariff');
    }
  });

  it('I3/I4: a zero or negative quoted cost is not used', () => {
    render(<SolarROICalculator />);
    set('roi-tariff', '25');
    for (const v of ['0', '-100000']) {
      set('roi-cost', v);
      expect(screen.getByText(REQUEST_QUOTATION)).toBeTruthy();
      expect(shown('Payback Period')).toBe('Enter a quoted cost');
      expect(shown('25-Year ROI')).toBe('—');
    }
  });

  it('I5: a negative bill is clamped to 0', () => {
    render(<SolarROICalculator />);
    set('roi-bill', '-500');
    expect((document.getElementById('roi-bill') as HTMLInputElement).value).toBe('0');
  });

  it('I6: a corrupt saved draft is ignored field by field', () => {
    sessionStorage.setItem(DRAFT_PREFIX + ROI_DRAFT_FORM, JSON.stringify({ monthlyBill: 'lots', tariffInput: 25 }));
    render(<SolarROICalculator />);
    expect((document.getElementById('roi-bill') as HTMLInputElement).value).toBe('15000');
    expect((document.getElementById('roi-tariff') as HTMLInputElement).value).toBe('');
  });
});

describe('Reference dataset: every value has a dated source and a status', () => {
  const statuses = Object.keys(refs.statusVocabulary);
  const ids = new Set(refs.sources.map((s) => s.id));

  it('sources are identifiable (title, URL, date, accessed date)', () => {
    for (const s of refs.sources) {
      expect(s.title).toBeTruthy();
      expect(s.url).toMatch(/^https:\/\//);
      expect(s.date).toBeTruthy();
      expect(s.accessed).toBe('2026-11-25');
    }
  });

  it('every value names a known source and a status from the vocabulary; no value is called a price or verified', () => {
    for (const v of refs.values) {
      expect(ids.has(v.source), v.id).toBe(true);
      expect(statuses).toContain(v.status);
    }
    for (const a of refs.calculatorAssumptions) expect(statuses).toContain(a.status);
    expect(JSON.stringify(refs)).not.toMatch(/"status":\s*"verified/);
  });

  it('the calculator constants match what the dataset says they are', () => {
    const a = Object.fromEntries(refs.calculatorAssumptions.map((x) => [x.id, x.value]));
    expect(a['roi.performanceRatio']).toBe(PERFORMANCE_RATIO);
    expect(a['roi.batteryDod']).toBe(BATTERY_DOD * 100);
    expect(a['roi.batteryEfficiency']).toBe(BATTERY_EFFICIENCY * 100);
  });

  it('the calculator is no more optimistic than the referenced datasheets', () => {
    const v = Object.fromEntries(refs.values.map((x) => [x.id, x.value]));
    // module output falls faster in the calculator (0.5 %/yr) than Jinko's warranty limit (0.40 %/yr)
    expect(0.5).toBeGreaterThanOrEqual(v['module.jinko.annualDegradation'] as number);
    // the calculator uses less of the battery (90 %) than Pylontech's printed DoD (95 %)
    expect(BATTERY_DOD * 100).toBeLessThanOrEqual(v['battery.us5000.depthOfDischarge'] as number);
    // battery replacement assumed in year 12, before the 15+ year design life
    expect(12).toBeLessThan(v['battery.us5000.designLife'] as number);
    // the 0.78 performance ratio is below the inverter's own Euro efficiency alone
    expect(PERFORMANCE_RATIO * 100).toBeLessThan(v['inverter.deye.euroEfficiency'] as number);
  });
});
