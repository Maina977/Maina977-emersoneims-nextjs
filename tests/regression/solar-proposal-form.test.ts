import { describe, it, expect } from 'vitest';
import {
  parseLoadCsv, lastFullYear, buildEntries, buildBom, buildHourlyInput, buildHybridInput, formToProposalInput, dcKwp,
  WORKED_EXAMPLE_FORM, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION, EMPTY_BOM_ROW, LOSSES_SOURCE, type WeatherOk,
} from '@/lib/solar/design/proposalForm';
import { checkProposalRequest, proposalFileName } from '@/lib/solar/design/proposalRequest';
import { simulateHourly } from '@/lib/solar/design/hourly';
import { PVWATTS_DEFAULT_LOSSES } from '@/lib/solar/design/production';

// TEST values only.
describe('parseLoadCsv', () => {
  it('one value per line, optional header and timestamp column', () => {
    expect(parseLoadCsv('1\n2.5\n0\n')).toEqual({ values: [1, 2.5, 0], error: null });
    expect(parseLoadCsv('time,kWh\n2025-01-01T00:00,1\n2025-01-01T01:00,2')).toEqual({ values: [1, 2], error: null });
  });
  it('refuses gaps, negatives, text and a length mismatch', () => {
    expect(parseLoadCsv('1\n\n2').values).toEqual([1, 2]); // blank lines are not hours
    expect(parseLoadCsv('1\nx\n2').error).toMatch(/Row 2/);
    expect(parseLoadCsv('1\n-1').error).toMatch(/≥ 0/);
    expect(parseLoadCsv('1\n2', 3).error).toMatch(/2 hourly values.*3/);
    expect(parseLoadCsv('').error).toMatch(/empty/);
  });
});

describe('form mapping', () => {
  it('last full year is the previous calendar year', () => {
    expect(lastFullYear(new Date('2026-11-20T00:00:00Z'))).toBe(2025);
  });
  it('the worked example maps to the regression-test input (17.6 kWp, verified entries, sourced finance)', () => {
    const r = formToProposalInput(WORKED_EXAMPLE_FORM, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION, null);
    expect(r.errors).toEqual([]);
    const i = r.input!;
    expect(dcKwp(WORKED_EXAMPLE_FORM)).toBe(17.6);
    expect(i.module.status).toBe('verified');
    expect(i.inverter.data.maxDcV).toBe(1000);
    expect(i.design).toEqual({ modulesPerString: 16, stringsPerMppt: [1, 1] });
    expect(i.finance.tariffKesPerKwh).toEqual({ value: 25, source: 'customer bill (test)' });
    expect(i.finance.selfConsumedFraction).toEqual({ value: 0.8, source: 'load logger (test)' });
    expect(i.bom[1].rate).toEqual({ valueKes: 320000, source: 'test supplier quote Q-1', date: '2026-11-01' });
    expect(i).not.toHaveProperty('approval');
    expect(i.battery).toBeUndefined();
  });
  it('an empty form lists what is missing and builds nothing; no value is defaulted', () => {
    const r = formToProposalInput({}, [{ ...EMPTY_BOM_ROW }], null, null);
    expect(r.input).toBeNull();
    const all = r.errors.join(' | ');
    expect(all).toMatch(/Tariff \(KES\/kWh\) is required/);
    expect(all).toMatch(/Production is required/);
    expect(all).toMatch(/Module: pmaxW is required/);
  });
  it('a finance value without its source is refused', () => {
    const r = formToProposalInput({ ...WORKED_EXAMPLE_FORM, 'f.tariffSource': '' }, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION, null);
    expect(r.input).toBeNull();
    expect(r.errors).toContain('Tariff (KES/kWh): its source is required');
  });
  it('unchecked verification leaves entries unverified; the same person cannot verify', () => {
    expect(buildEntries({ ...WORKED_EXAMPLE_FORM, 'm.verified': '' }).module!.status).toBe('unverified');
    const e = buildEntries({ ...WORKED_EXAMPLE_FORM, 'm.verifiedBy': 'test' });
    expect(e.module!.status).toBe('unverified');
    expect(e.errors.join(' ')).toMatch(/different person/);
  });
  it('typed approval fields are ignored: no approval is ever built from the form', () => {
    const r = formToProposalInput({ ...WORKED_EXAMPLE_FORM, 'a.engineer': 'TEST ENGINEER', 'a.registration': 'TEST-REG', 'a.date': '2026-11-20' }, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION, null);
    expect(r.errors).toEqual([]);
    expect(r.input).not.toHaveProperty('approval');
    expect(r.input).not.toHaveProperty('verifiedApproval');
  });
});

describe('bill of materials', () => {
  it('empty rate = rate required (null); a given rate needs source and date; blank rows are skipped', () => {
    const errors: string[] = [];
    const lines = buildBom([{ item: 'Mounting', model: 'TBD', quantity: '1', unit: 'item', rate: '', rateSource: '', rateDate: '' }, { ...EMPTY_BOM_ROW }], errors);
    expect(errors).toEqual([]);
    expect(lines).toEqual([{ item: 'Mounting', model: 'TBD', quantity: 1, unit: 'item', rate: null }]);
    buildBom([{ item: 'Cable', model: 'x', quantity: '2', unit: 'm', rate: '100', rateSource: '', rateDate: '' }], errors);
    expect(errors.join(' ')).toMatch(/source/);
    expect(errors.join(' ')).toMatch(/date/);
  });
});

describe('simulation inputs', () => {
  // A synthetic 28-day test series (not real weather) to exercise the mapping.
  const hours = 24 * 28;
  const w: WeatherOk = { status: 'OK', start: '2025-01-01T00:30:00.000Z', hours, source: 'synthetic test series', ghiWm2: Array.from({ length: hours }, (_, h) => Math.max(0, 800 * Math.sin(((h % 24) - 4) / 16 * Math.PI))), tempC: Array(hours).fill(20) };
  const form = { ...WORKED_EXAMPLE_FORM, 'd.tilt': '10', 'd.azimuth': '0', 'i.nominalEfficiency': '0.96' };
  it('hourly input uses the design kWp, the inverter total and PVWatts v5 defaults, labelled', () => {
    const h = buildHourlyInput(form, w);
    expect(h.errors).toEqual([]);
    expect(h.input!.array.dcKw).toBe(17.6);
    expect(h.input!.inverter).toEqual({ acKw: 15, nominalEfficiency: 0.96 });
    expect(h.input!.losses).toBe(PVWATTS_DEFAULT_LOSSES);
    expect(h.input!.lossesSource).toBe(LOSSES_SOURCE);
    const r = simulateHourly(h.input!);
    expect(r.hourlyAcKwh.length).toBe(hours);
    expect(r.annualKwh).toBeGreaterThan(0);
  });
  it('hourly input refuses a missing tilt or inverter efficiency', () => {
    const h = buildHourlyInput({ ...form, 'd.tilt': '', 'i.nominalEfficiency': '' }, w);
    expect(h.input).toBeNull();
    expect(h.errors.join(' ')).toMatch(/Tilt.*Inverter nominal efficiency/);
  });
  it('hybrid input: needs PV hours, load and its source; a started block must be complete', () => {
    expect(buildHybridInput({}, [], null).errors.join(' ')).toMatch(/fetch the hourly weather.*Upload the hourly load.*Load source/);
    const pv = Array(48).fill(1), load = Array(48).fill(0.5);
    expect(buildHybridInput({ 'h.loadSource': 'logger (test)', 'hb.usableKwh': '10' }, pv, load).errors.join(' ')).toMatch(/Hybrid battery: maxChargeKw is required/);
    const ok = buildHybridInput({ 'h.loadSource': 'logger (test)', 'hg.exportAllowed': 'no', 'hg.source': 'utility (test)' }, pv, load);
    expect(ok.errors).toEqual([]);
    expect(ok.input!.grid).toEqual({ exportAllowed: false, importLimitKw: undefined, exportLimitKw: undefined, source: 'utility (test)' });
    expect(ok.input!.battery).toBeUndefined();
  });
});

describe('request shape and file names', () => {
  it('rejects a missing input and unknown formats; accepts the worked example', () => {
    expect(checkProposalRequest(null)).toHaveProperty('error');
    expect(checkProposalRequest({ input: {}, format: 'json' })).toHaveProperty('error');
    expect(checkProposalRequest({ input: {}, format: 'csv' })).toEqual({ error: 'format must be json, xlsx or pdf' });
    const i = formToProposalInput(WORKED_EXAMPLE_FORM, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION, null).input;
    expect(checkProposalRequest({ input: i })).toMatchObject({ format: 'json' });
    expect(checkProposalRequest({ input: { ...i, approval: { engineer: 'TEST ENGINEER', registration: 'TEST-REG', date: '2026-11-20' } } })).toEqual({ error: expect.stringMatching(/client-supplied approval is not accepted/) });
  });
  it('file names are sanitised', () => {
    expect(proposalFileName('ABC/12 "x"', 'pdf')).toBe('solar-proposal-ABC_12_x.pdf');
    expect(proposalFileName('///', 'xlsx')).toBe('solar-proposal-proposal.xlsx');
  });
});
