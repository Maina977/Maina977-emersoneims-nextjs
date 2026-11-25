import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import SolarROICalculator, { ROI_DRAFT_FORM } from '@/components/solar/SolarROICalculator';
import { DRAFT_PREFIX } from '@/lib/loading/sessionDraft';

/**
 * The ROI / Savings Calculator results for fixed inputs, pinned to the
 * implementation as it was before the 2026-11-25 layout and accessibility work
 * (production 34072f31). That work changed only classes, labels and the space
 * reserved while the module downloads; these figures prove no result moved.
 *
 * Worked example 1 (by hand, see docs/engineering/solar-hub-roi-layout-and-a11y.md):
 *   bill KES 15,000, tariff KES 25/kWh -> 600 kWh/month
 *   5 kW x 5.5 h x 0.78 x 30 = 643.5 kWh/month -> coverage 100%
 *   direct use min(643.5, 300) x 0.75 = 225; battery 10 kWh -> min(397.6, 375, 270) = 270
 *   saved 495 kWh x 25 = KES 12,375/month = KES 148,500/year
 *   cost KES 600,000, maintenance 1% = 6,000/year, output -0.5%/year
 *   running net: 142,500 / 284,258 / 425,276 / 565,560 / 705,112 -> payback in year 5
 *   25-year net KES 2.7M, ROI 458%, CO2 495 x 12 x 0.213 = 1,265 kg/year, 32 t over 25 years
 */

type Draft = {
  monthlyBill: number; tariffInput: string; systemSize: number; quotedCostInput: string;
  batteryReplacementInput: string; includesBattery: boolean; batteryCapacity: number;
};
const BASE: Draft = { monthlyBill: 15000, tariffInput: '', systemSize: 5, quotedCostInput: '', batteryReplacementInput: '', includesBattery: true, batteryCapacity: 10 };

function seed(d: Partial<Draft>) {
  sessionStorage.setItem(DRAFT_PREFIX + ROI_DRAFT_FORM, JSON.stringify({ ...BASE, ...d }));
}

/** The figure shown above a result label, e.g. value('Payback Period'). */
function value(label: string): string {
  const el = screen.getByText(label, { selector: 'p' });
  return (el.previousElementSibling?.textContent ?? '').trim();
}
function coverage(): string {
  return (screen.getByText('Energy Coverage').nextElementSibling?.textContent ?? '').trim();
}
function co2(label: string): string {
  return (screen.getByText(label).nextElementSibling?.textContent ?? '').trim();
}

beforeEach(() => sessionStorage.clear());
afterEach(() => { cleanup(); sessionStorage.clear(); });

describe('ROI calculator: results for fixed inputs are unchanged', () => {
  it('worked example 1: hybrid 5 kW + 10 kWh, KES 15,000 bill, KES 25/kWh, KES 600,000 -> payback 5 years', () => {
    seed({ tariffInput: '25', quotedCostInput: '600000' });
    render(<SolarROICalculator />);
    expect(value('Monthly Savings')).toBe(`KES ${(12375).toLocaleString()}`);
    expect(value('Payback Period')).toBe('5 Years');
    expect(value('25-Year ROI')).toBe('458%');
    expect(value('25-Year Net Savings')).toBe('KES 2.7M');
    expect(coverage()).toBe('100%');
    expect(screen.getByText(/System produces ~644 kWh\/month/)).toBeTruthy();
    expect(screen.getByText(/Estimated consumption: ~600 kWh\/month/)).toBeTruthy();
    expect(co2('Annual CO2 Offset')).toBe('1265 kg');
    expect(co2('25-Year CO2 Offset')).toBe('32 tonnes');
    expect(screen.getByText(`KES ${(600000).toLocaleString()}`)).toBeTruthy();
  });

  it('worked example 2: grid-tied 3 kW, KES 8,000 bill, KES 30/kWh, KES 450,000', () => {
    seed({ monthlyBill: 8000, tariffInput: '30', systemSize: 3, quotedCostInput: '450000', includesBattery: false });
    render(<SolarROICalculator />);
    // 266.67 kWh; production 386.1; direct min(386.1, 133.3) x 0.75 = 100 kWh -> KES 3,000/month
    expect(value('Monthly Savings')).toBe(`KES ${(3000).toLocaleString()}`);
    // net 31,500 a year at first (36,000 - 4,500 maintenance): running total passes 450,000 in year 15
    expect(value('Payback Period')).toBe('15 Years');
    expect(value('25-Year ROI')).toBe('63%');
    expect(value('25-Year Net Savings')).toBe('KES 0.3M');
    expect(coverage()).toBe('100%');
    expect(co2('Annual CO2 Offset')).toBe('256 kg');
    expect(co2('25-Year CO2 Offset')).toBe('6 tonnes');
  });

  it('worked example 3: battery replacement quoted for year 12 is deducted', () => {
    seed({ monthlyBill: 40000, tariffInput: '28', systemSize: 10, quotedCostInput: '1500000', batteryCapacity: 20, batteryReplacementInput: '400000' });
    render(<SolarROICalculator />);
    // 1,428.6 kWh; production 1,287; direct 535.7 + battery min(713.7, 892.9, 540) = 1,075.7 kWh x 28
    expect(value('Monthly Savings')).toBe(`KES ${(30120).toLocaleString()}`);
    expect(value('Payback Period')).toBe('5 Years');
    // 25 years: 361,440 x 23.556 - 375,000 maintenance - 400,000 battery = 7.74M; less 1.5M cost
    expect(value('25-Year ROI')).toBe('416%');
    expect(value('25-Year Net Savings')).toBe('KES 6.2M');
    expect(coverage()).toBe('90%');
    expect(screen.getByText(/replaced once, in year 12, at your quoted KES 400,000/)).toBeTruthy();
  });

  it('missing tariff and cost: no figures are invented', () => {
    render(<SolarROICalculator />);
    expect(value('Monthly Savings')).toBe('Enter your tariff');
    expect(value('Payback Period')).toBe('Enter your tariff and a quoted cost');
    expect(value('25-Year ROI')).toBe('—');
    expect(value('25-Year Net Savings')).toBe('—');
    expect(coverage()).toBe('Enter your bill and tariff');
    expect(screen.getByText('Request a quotation')).toBeTruthy();
  });
});

describe('ROI calculator: inputs and results survive a remount (reload)', () => {
  it('typed bill, tariff and quoted cost come back from sessionStorage and give the same payback', () => {
    const first = render(<SolarROICalculator />);
    fireEvent.change(screen.getByLabelText(/Monthly Electricity Bill/), { target: { value: '15000' } });
    fireEvent.change(screen.getByLabelText(/Your tariff/), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText(/Quoted installed cost/), { target: { value: '600000' } });
    expect(value('Payback Period')).toBe('5 Years');
    first.unmount();

    const saved = JSON.parse(sessionStorage.getItem(DRAFT_PREFIX + ROI_DRAFT_FORM) as string);
    expect(saved).toMatchObject({ monthlyBill: 15000, tariffInput: '25', quotedCostInput: '600000' });

    render(<SolarROICalculator />);
    expect((document.getElementById('roi-bill') as HTMLInputElement).value).toBe('15000');
    expect((document.getElementById('roi-tariff') as HTMLInputElement).value).toBe('25');
    expect((document.getElementById('roi-cost') as HTMLInputElement).value).toBe('600000');
    expect(value('Payback Period')).toBe('5 Years');
    expect(value('25-Year ROI')).toBe('458%');
  });

  it('the battery choice is restored too', () => {
    const first = render(<SolarROICalculator />);
    fireEvent.click(screen.getByLabelText(/Include Battery Storage/));
    first.unmount();
    render(<SolarROICalculator />);
    expect((screen.getByLabelText(/Include Battery Storage/) as HTMLInputElement).checked).toBe(false);
    expect(document.getElementById('roi-battery')).toBeNull();
  });
});
