import { describe, it, expect } from 'vitest';
import { solarPosition } from '@/lib/solar/design/sunPosition';
import { solarPosition as solarPositionFromHourly, simulateHourly } from '@/lib/solar/design/hourly';
import {
  horizonErrors, horizonElevationDeg, obstacleElevationDeg, skyViewFactorHorizontal, hourBlockedFraction,
  beamLossFromDni, parseHorizonText, type HorizonProfile,
} from '@/lib/solar/design/shading';
import { buildSld, sldToSvg, TBS } from '@/lib/solar/design/sld';
import { PVWATTS_DEFAULT_LOSSES } from '@/lib/solar/design/production';
import { buildProposal, type ProposalInput } from '@/lib/solar/design/proposal';
import { checkProposalRequest } from '@/lib/solar/design/proposalRequest';
import { proposalRevisionHash } from '@/lib/solar/design/proposalApproval';
import { buildHourlyInput, formToProposalInput, LOSSES_WITH_HORIZON, sldPreviewFromForm, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_FORM, WORKED_EXAMPLE_PRODUCTION, type WeatherOk } from '@/lib/solar/design/proposalForm';
import type { Module, Inverter } from '@/lib/solar/design/validate';
import type { LibraryEntry } from '@/lib/solar/design/datasheet';
import type { HourlyResult } from '@/lib/solar/design/hourly';

const D = Math.PI / 180;
// SYNTHETIC test components (same values as solar-proposal.test.ts) — not products.
const MOD: Module = { model: 'test-module', pmaxW: 550, vocV: 49.5, iscA: 13.9, vmpV: 41.5, impA: 13.1, betaVocPct: -0.27, betaVmpPct: -0.35, alphaIscPct: 0.048, gammaPmaxPct: -0.35, noctC: 45, maxSystemV: 1500, maxSeriesFuseA: 25, datasheet: 'test datasheet rev A' };
const INV: Inverter = { model: 'test-inverter', acKw: 15, maxDcV: 1000, mpptMinV: 200, mpptMaxV: 850, mpptCount: 2, maxInputA: 26, maxIscA: 40, generatorCompatibility: null, datasheet: 'test inverter rev B' };

describe('sun position: independent published example (Meeus, Astronomical Algorithms 2nd ed.)', () => {
  it('matches Example 25.a (δ = −7.78507°) and Example 28.b (E = +13.7094 min) for 1992 Oct 13.0 TD', () => {
    // 1992 Oct 13 0h TD = 1992 Oct 12 23:59:01 UT (ΔT ≈ 59 s in 1992). Site lat 0°, lon 180° E.
    const t = Date.UTC(1992, 9, 12, 23, 59, 1);
    const delta = -7.78507, E = 13.70940; // published (Meeus Ex. 25.a, 28.b)
    // Hand calculation: true solar time = UT minutes + E + 4 × lon; hour angle H = TST/4 − 180 (°).
    const tst = (23 * 60 + 59 + 1 / 60) + E + 4 * 180;
    const H = (tst / 4 - 180) % 360;
    const cosZ = Math.cos(delta * D) * Math.cos(H * D); // lat 0
    const zExpected = Math.acos(cosZ) / D;
    const s = solarPosition(t, 0, 180);
    expect(Math.abs(s.zenith - zExpected), `${s.zenith} vs ${zExpected}`).toBeLessThan(0.02);
    expect(zExpected).toBeCloseTo(8.39, 1);
    // Afternoon (H > 0), sun south of the equator → azimuth between 180° and 270°.
    expect(s.azimuth).toBeGreaterThan(180); expect(s.azimuth).toBeLessThan(270);
    expect(solarPositionFromHourly).toBe(solarPosition); // hourly.ts uses the same function
  });
});

describe('horizon geometry (hand calculations)', () => {
  const wall = { name: 'wall', heightAboveArrayM: 10, distanceM: 20, azimuthDeg: 90, widthM: 40 };
  it('obstacle: e = atan(h cos θ / d) within ±atan(w/2 / d)', () => {
    expect(obstacleElevationDeg(wall, 90)).toBeCloseTo(Math.atan(0.5) / D, 9); // 26.565°
    expect(obstacleElevationDeg(wall, 90)).toBeCloseTo(26.565, 3);
    expect(obstacleElevationDeg(wall, 120)).toBeCloseTo(Math.atan(0.5 * Math.cos(30 * D)) / D, 9); // 23.413°
    expect(obstacleElevationDeg(wall, 134.9)).toBeGreaterThan(0); // half-width 45°
    expect(obstacleElevationDeg(wall, 135.1)).toBe(0);
  });
  it('sectors: wrap through north; maximum of overlapping entries', () => {
    const p: HorizonProfile = { sectors: [{ fromAzDeg: 330, toAzDeg: 30, elevationDeg: 12 }, { fromAzDeg: 0, toAzDeg: 10, elevationDeg: 20 }], obstacles: [], source: 'test' };
    expect(horizonElevationDeg(p, 345)).toBe(12);
    expect(horizonElevationDeg(p, 5)).toBe(20);
    expect(horizonElevationDeg(p, 30)).toBe(0);
    expect(horizonElevationDeg(p, 180)).toBe(0);
  });
  it('sky-view factor: uniform 30° horizon → cos²30° = 0.75; one 90° sector at 30° → 1 − ¼ × sin²30° = 0.9375', () => {
    expect(skyViewFactorHorizontal({ sectors: [{ fromAzDeg: 0, toAzDeg: 360, elevationDeg: 30 }], obstacles: [], source: 't' })).toBeCloseTo(0.75, 6);
    expect(skyViewFactorHorizontal({ sectors: [{ fromAzDeg: 90, toAzDeg: 180, elevationDeg: 30 }], obstacles: [], source: 't' })).toBeCloseTo(0.9375, 6);
  });
});

describe('invalid horizon inputs are refused with a reason', () => {
  it.each([
    [{ sectors: [], obstacles: [], source: 's' }, /at least one sector or obstacle/],
    [{ sectors: [{ fromAzDeg: 0, toAzDeg: 90, elevationDeg: 10 }], obstacles: [], source: '' }, /source/],
    [{ sectors: [{ fromAzDeg: -5, toAzDeg: 90, elevationDeg: 10 }], obstacles: [], source: 's' }, /0–360/],
    [{ sectors: [{ fromAzDeg: 0, toAzDeg: 90, elevationDeg: 95 }], obstacles: [], source: 's' }, /below 90/],
    [{ sectors: [{ fromAzDeg: 0, toAzDeg: 90, elevationDeg: -1 }], obstacles: [], source: 's' }, /0° or more/],
    [{ sectors: [{ fromAzDeg: 40, toAzDeg: 40, elevationDeg: 10 }], obstacles: [], source: 's' }, /no width/],
    [{ sectors: [], obstacles: [{ name: 'tree', heightAboveArrayM: -2, distanceM: 10, azimuthDeg: 90, widthM: 5 }], source: 's' }, /height above the array/],
    [{ sectors: [], obstacles: [{ name: 'tree', heightAboveArrayM: 2, distanceM: 0, azimuthDeg: 90, widthM: 5 }], source: 's' }, /distance/],
    [{ sectors: [], obstacles: [{ name: '', heightAboveArrayM: 2, distanceM: 5, azimuthDeg: 90, widthM: 5 }], source: 's' }, /name is required/],
  ])('%#', (p, re) => { expect(horizonErrors(p).join(' ')).toMatch(re); });
  it('form text: wrong column count and non-numbers are reported by line; all blank = no horizon', () => {
    expect(parseHorizonText('', '', '')).toEqual({ profile: null, errors: [] });
    expect(parseHorizonText('0,90', '', 'survey').errors.join(' ')).toMatch(/line 1.*expected from-azimuth/);
    expect(parseHorizonText('0,90,abc', '', 'survey').errors.join(' ')).toMatch(/must be numbers/);
    const ok = parseHorizonText('60,120,15; 240,300,10', 'mast,8,25,180,1', 'survey 2026-11-25');
    expect(ok.errors).toEqual([]);
    expect(ok.profile!.sectors).toHaveLength(2); expect(ok.profile!.obstacles[0].name).toBe('mast');
  });
});

describe('WORKED EXAMPLE (docs/engineering/solar-sld-and-shading.md §3): beam loss behind a uniform 30° horizon', () => {
  // SYNTHETIC: lat 0°, horizontal plane, 20 March 2026 (equinox, δ ≈ 0), DNI = 800 W/m² for every daylit hour.
  // lon 1.85° E cancels the equation of time (≈ −7.4 min), so true solar time ≈ UTC.
  // Hand calculation: sun altitude at the hour midpoints α = 90° − 15° × |t − 12 h| = 7.5, 22.5, 37.5, 52.5, 67.5, 82.5 (and mirror).
  // Beam on horizontal = DNI × sin α. Blocked (α < 30°): the 06:30, 07:30, 16:30, 17:30 hours.
  // Loss = (sin 7.5 + sin 22.5) / (sin 7.5 + … + sin 82.5) = 0.513210 / 3.830649 = 0.133975 (= 1 − cos 30°).
  const p: HorizonProfile = { sectors: [{ fromAzDeg: 0, toAzDeg: 360, elevationDeg: 30 }], obstacles: [], source: 'synthetic worked example' };
  const site = { latDeg: 0, lonDeg: 1.85, tiltDeg: 0, azimuthDeg: 180 };
  const dni = Array.from({ length: 24 }, (_, h) => (h >= 6 && h < 18 ? 800 : 0));
  const sines = [7.5, 22.5, 37.5, 52.5, 67.5, 82.5].map((a) => Math.sin(a * D));
  const handLoss = (sines[0] + sines[1]) / sines.reduce((a, b) => a + b, 0);
  it('hand value 0.133975', () => { expect(handLoss).toBeCloseTo(0.133975, 6); expect(handLoss).toBeCloseTo(1 - Math.cos(30 * D), 6); });
  it('engine: blocked hours are exactly 06–08 and 16–18 solar time; loss within 0.002 of the hand value', () => {
    const r = beamLossFromDni(p, site, '2026-03-20T00:30:00Z', dni);
    expect(r.blockedFractions.map((f, h) => (f > 0 ? h : -1)).filter((h) => h >= 0)).toEqual([6, 7, 16, 17]);
    expect(r.blockedFractions.filter((f) => f > 0).every((f) => f === 1)).toBe(true);
    expect(Math.abs(r.lossFraction - handLoss), `${r.lossFraction}`).toBeLessThan(0.002);
    expect(r.beamWhM2).toBeCloseTo(800 * 2 * sines.reduce((a, b) => a + b, 0), -1); // ≈ 6129 Wh/m²
  });
  it('no horizon (0°) blocks nothing; sun-down hours are never counted as shaded', () => {
    expect(hourBlockedFraction({ sectors: [{ fromAzDeg: 0, toAzDeg: 360, elevationDeg: 0 }], obstacles: [], source: 't' }, Date.parse('2026-03-20T06:30:00Z'), 0, 1.85)).toBe(0);
    expect(hourBlockedFraction(p, Date.parse('2026-03-20T02:30:00Z'), 0, 1.85)).toBe(0);
  });
});

describe('hourly simulation with a horizon', () => {
  // SYNTHETIC 28-day series (not weather).
  const hours = 24 * 28;
  const ghi = Array.from({ length: hours }, (_, h) => Math.max(0, 900 * Math.sin((((h % 24) - 6) / 12) * Math.PI)));
  const base = { site: { latDeg: -1.29, lonDeg: 36.82, tiltDeg: 10, azimuthDeg: 0 }, start: '2025-03-01T00:30:00.000Z', ghiWm2: ghi, tempC: Array(hours).fill(22), weatherSource: 'synthetic', array: { dcKw: 10, gammaPmaxPct: -0.35, noctC: 45 }, inverter: { acKw: 10, nominalEfficiency: 0.96 }, losses: LOSSES_WITH_HORIZON, lossesSource: 't' };
  it('without a horizon the result has no shading member (existing results unchanged)', () => {
    expect('shading' in simulateHourly(base)).toBe(false);
  });
  it('a horizon lowers energy; reported monthly/annual losses are consistent with the energies', () => {
    const un = simulateHourly(base);
    const sh = simulateHourly({ ...base, horizon: { sectors: [{ fromAzDeg: 225, toAzDeg: 315, elevationDeg: 25 }], obstacles: [], source: 'synthetic' } });
    expect(sh.shading).toBeDefined();
    expect(sh.annualKwh).toBeLessThan(un.annualKwh);
    expect(sh.shading!.annual.unshadedAnnualKwh).toBe(un.annualKwh);
    expect(sh.shading!.annual.shadedAnnualKwh).toBe(sh.annualKwh);
    expect(sh.shading!.annual.energyLossPct!).toBeCloseTo((1 - sh.annualKwh / un.annualKwh) * 100, 1);
    expect(sh.shading!.monthly[2].beamLossPct!).toBeGreaterThan(0); // March
    expect(sh.shading!.monthly[5].beamLossPct).toBeNull(); // June not in the series
    expect(sh.assumptions.join(' ')).toMatch(/Diffuse.*not reduced/i);
    expect(sh.poaKwhM2).toBe(un.poaKwhM2); // POA reported unshaded
  });
  it('flags a double-counted general shading allowance', () => {
    const sh = simulateHourly({ ...base, losses: PVWATTS_DEFAULT_LOSSES, horizon: { sectors: [{ fromAzDeg: 225, toAzDeg: 315, elevationDeg: 25 }], obstacles: [], source: 's' } });
    expect(sh.assumptions.join(' ')).toMatch(/general shading allowance of 3 %/);
  });
  it('form: a horizon replaces the 3 % PVWatts shading allowance and is passed to the engine; a bad horizon blocks the simulation', () => {
    const w: WeatherOk = { status: 'OK', start: base.start, hours, source: 'synthetic', ghiWm2: ghi, tempC: base.tempC };
    const form = { ...WORKED_EXAMPLE_FORM, 'd.tilt': '10', 'd.azimuth': '0', 'i.nominalEfficiency': '0.96' };
    const h = buildHourlyInput({ ...form, 'sh.sectors': '45,135,25', 'sh.source': 'survey' }, w);
    expect(h.input!.losses.shading).toBe(0);
    expect(h.input!.horizon!.sectors).toHaveLength(1);
    expect(buildHourlyInput({ ...form, 'sh.sectors': '45,135,25' }, w).errors.join(' ')).toMatch(/source/);
    // The worked example itself carries the TEST tilt / azimuth / efficiency, so it simulates straight through.
    expect(buildHourlyInput(WORKED_EXAMPLE_FORM, w).errors).toEqual([]);
  });
});

// ------------------------------------------------------------------ single-line diagram
const prov = { manufacturer: 'TEST', datasheetUrl: 'https://example.com/test.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'test', enteredOn: '2026-11-20', verifiedBy: 'test-2', verifiedOn: '2026-11-20' };
const entry = <T,>(data: T, kind: 'module' | 'inverter'): LibraryEntry<T> => ({ kind, id: `${kind}-test`, data, provenance: prov, status: 'verified', warnings: [] });
const production = { annualKwh: 20000, monthlyKwh: Array(12).fill(20000 / 12), clippedKwh: 50, hours: 8760, hourlyAcKwh: [], specificYieldKwhPerKwp: 1136, performanceRatio: 0.8, poaKwhM2: 1900, assumptions: ['Weather: test.'], engineVersion: 'solar-hourly test' } as unknown as HourlyResult;
const s = (value: number) => ({ value, source: 'test source' });
const input = (over: Partial<ProposalInput> = {}): ProposalInput => ({
  reference: 'TEST-SLD', client: { name: 'Test', siteAddress: 'Test', lat: -1.29, lon: 36.82 },
  module: entry(MOD, 'module'), inverter: entry(INV, 'inverter'), design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: 1,
  temps: { recordLowC: 10, maxAmbientC: 35, source: 'test' }, cables: [], production, bom: [],
  finance: { tariffKesPerKwh: s(25), selfConsumedFraction: s(0.8), tariffEscalationPct: s(0), discountRatePct: s(10), degradationPctPerYear: s(0), omKesPerYear: s(20000), lifetimeYears: 20 },
  ...over,
});

describe('single-line diagram', () => {
  it('labels come from the design: cold Voc = 49.5 × (1 + 0.27/100 × 15) × 16 = 824.08 V; 1.25 × 13.9 × 1 = 17.38 A', () => {
    const m = buildSld({ reference: 'R', module: MOD, inverter: INV, design: { modulesPerString: 16, stringsPerMppt: [1, 1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35 }, cables: [] });
    const pv1 = m.boxes.find((b) => b.id === 'pv-1')!.lines.join(' ');
    expect(pv1).toMatch(/1 string × 16 modules = 16 modules, 8\.8 kWp/);
    expect(pv1).toMatch(/16 × 49\.5 V = 792 V/);
    expect(pv1).toMatch(/824\.08 V/);
    expect(pv1).toMatch(/17\.38 A/);
    expect(m.boxes.find((b) => b.id === 'fuse-1')!.lines.join(' ')).toMatch(/not required/);
    expect(m.boxes.find((b) => b.id === 'iso-1')!.lines.join(' ')).toMatch(/≥ 824\.08 V DC and ≥ 17\.38 A/);
    // Nothing the design does not determine is given a value:
    expect(m.boxes.find((b) => b.id === 'ac')!.lines.join(' ')).toContain(TBS);
    expect(m.boxes.find((b) => b.id === 'grid')!.lines.join(' ')).toContain(TBS);
    expect(m.boxes.find((b) => b.id === 'generator')!.dashed).toBe(true);
    expect(m.designValid).toBe(true);
  });
  it('three strings on one MPPT: fuses required with the IEC 62548-1 window 1.5 × Isc < I_n ≤ min(2.4 × Isc, max series fuse)', () => {
    const inv = { ...INV, maxInputA: 40, maxIscA: 60 };
    const m = buildSld({ reference: 'R', module: MOD, inverter: inv, design: { modulesPerString: 16, stringsPerMppt: [3] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35 }, cables: [] });
    expect(m.boxes.find((b) => b.id === 'fuse-1')!.lines.join(' ')).toMatch(/required on both poles.*above 20\.85 A and at most 25 A/);
  });
  it('SAFETY: cold Voc above the inverter maximum → the diagram is marked as refused', () => {
    const m = buildSld({ reference: 'R', module: MOD, inverter: INV, design: { modulesPerString: 21, stringsPerMppt: [1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35 }, cables: [] });
    expect(m.designValid).toBe(false);
    expect(m.boxes.find((b) => b.id === 'notes')!.lines.join(' ')).toMatch(/REFUSE THIS DESIGN/);
  });
  it('generator stated without a manufacturer compatibility statement is not shown as confirmed', () => {
    const m = buildSld({ reference: 'R', module: MOD, inverter: INV, design: { modulesPerString: 16, stringsPerMppt: [1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35 }, cables: [], connections: { grid: true, generator: true } });
    expect(m.boxes.find((b) => b.id === 'generator')!.lines.join(' ')).toMatch(/No manufacturer generator-compatibility statement.*not confirmed/);
    expect(m.boxes.find((b) => b.id === 'generator')!.lines.join(' ')).toMatch(new RegExp(`Rating: ${TBS}`));
  });
  it('SVG is well-formed text and escapes markup from datasheet fields', () => {
    const svg = sldToSvg(buildSld({ reference: 'R<1>', module: { ...MOD, model: 'a&b <x>' }, inverter: INV, design: { modulesPerString: 16, stringsPerMppt: [1] }, inverterCount: 1, temps: { recordLowC: 10, maxAmbientC: 35 }, cables: [] }));
    expect(svg.startsWith('<svg')).toBe(true); expect(svg.endsWith('</svg>')).toBe(true);
    expect(svg).toContain('a&amp;b &lt;x&gt;'); expect(svg).not.toContain('<x>');
  });
  it('the proposal carries the same diagram as the form preview; the preview needs no finance inputs', () => {
    const form = { ...WORKED_EXAMPLE_FORM, 'sld.grid': 'yes', 'sld.generator': 'no' };
    const mapped = formToProposalInput(form, WORKED_EXAMPLE_BOM, WORKED_EXAMPLE_PRODUCTION, null);
    expect(mapped.errors).toEqual([]);
    expect(mapped.input!.connections).toEqual({ grid: true, generator: false });
    const p = buildProposal(mapped.input!);
    const prev = sldPreviewFromForm(Object.fromEntries(Object.entries(form).filter(([k]) => !k.startsWith('f.'))));
    expect(prev.errors).toEqual([]);
    expect(p.sld.boxes.some((b) => b.id === 'generator')).toBe(false);
    expect(prev.model!.boxes.map((b) => b.lines)).toEqual(p.sld.boxes.map((b) => b.lines));
  });
});

describe('proposal: shading and approval rules preserved', () => {
  const shadedProduction = (): HourlyResult => {
    const hours = 24 * 28;
    const ghi = Array.from({ length: hours }, (_, h) => Math.max(0, 900 * Math.sin((((h % 24) - 6) / 12) * Math.PI)));
    return { ...simulateHourly({ site: { latDeg: -1.29, lonDeg: 36.82, tiltDeg: 10, azimuthDeg: 0 }, start: '2025-03-01T00:30:00.000Z', ghiWm2: ghi, tempC: Array(hours).fill(22), weatherSource: 'synthetic', array: { dcKw: 17.6, gammaPmaxPct: -0.35, noctC: 45 }, inverter: { acKw: 15, nominalEfficiency: 0.96 }, losses: LOSSES_WITH_HORIZON, lossesSource: 't', horizon: { sectors: [{ fromAzDeg: 225, toAzDeg: 315, elevationDeg: 25 }], obstacles: [], source: 'synthetic survey' } }), hourlyAcKwh: [] };
  };
  it('shading flows into the proposal, its disclosures and versions; status stays DRAFT; the revision changes', () => {
    const pr = shadedProduction();
    const p = buildProposal(input({ production: pr }));
    expect(p.status).toBe('DRAFT');
    expect(p.approval).toBeNull();
    expect(p.shading!.annual.energyLossPct).toBe(pr.shading!.annual.energyLossPct);
    expect(p.energy.year1Kwh).toBe(pr.annualKwh);
    expect(p.disclosures.join(' ')).toMatch(/Horizon shading.*Diffuse light is not reduced/);
    expect(p.revisionHash).not.toBe(proposalRevisionHash(input()));
    // Existing IEC 62548 string checks are all still present.
    expect(p.checks.map((c) => c.id)).toEqual(expect.arrayContaining(['cold-voc', 'hot-vmp', 'cold-vmp', 'imp-mppt1', 'isc-mppt1', 'fusing-mppt1', 'dc-ac']));
  });
  it('a tampered shading result (energy not matching) is refused', () => {
    const pr = shadedProduction();
    expect(() => buildProposal(input({ production: { ...pr, annualKwh: pr.annualKwh + 500 } }))).toThrow(/does not match/);
    expect(() => buildProposal(input({ production: { ...pr, shading: { ...pr.shading!, horizon: { ...pr.shading!.horizon, source: '' } } } }))).toThrow(/source/);
  });
  it('request check: shading and connections shapes; a client approval is still rejected', () => {
    const pr = shadedProduction();
    expect('input' in checkProposalRequest({ input: input({ production: pr, connections: { grid: true, generator: null } }) })).toBe(true);
    expect(checkProposalRequest({ input: { ...input(), connections: { grid: 'yes', generator: null } } })).toMatchObject({ error: expect.stringMatching(/connections/) });
    expect(checkProposalRequest({ input: { ...input(), approval: { by: 'me' } } })).toMatchObject({ error: expect.stringMatching(/not accepted/) });
  });
});

describe('exports show the same SLD and shading numbers', () => {
  it('Excel and PDF', async () => {
    const { proposalToXlsx, proposalToPdf, shadingRows } = await import('@/lib/solar/design/proposalExport');
    const hours = 24 * 28;
    const ghi = Array.from({ length: hours }, (_, h) => Math.max(0, 900 * Math.sin((((h % 24) - 6) / 12) * Math.PI)));
    const pr = { ...simulateHourly({ site: { latDeg: -1.29, lonDeg: 36.82, tiltDeg: 10, azimuthDeg: 0 }, start: '2025-03-01T00:30:00.000Z', ghiWm2: ghi, tempC: Array(hours).fill(22), weatherSource: 'synthetic', array: { dcKw: 17.6, gammaPmaxPct: -0.35, noctC: 45 }, inverter: { acKw: 15, nominalEfficiency: 0.96 }, losses: LOSSES_WITH_HORIZON, lossesSource: 't', horizon: { sectors: [{ fromAzDeg: 225, toAzDeg: 315, elevationDeg: 25 }], obstacles: [], source: 'synthetic survey' } }), hourlyAcKwh: [] };
    const p = buildProposal(input({ production: pr }));
    const ExcelJS = (await import('exceljs')).default;
    const wb = new ExcelJS.Workbook(); await wb.xlsx.load(await proposalToXlsx(p) as unknown as ArrayBuffer);
    expect(wb.worksheets.map((w) => w.name)).toEqual(['Summary', 'Design checks', 'Equipment & costs', 'Cash flow', 'Single-line diagram', 'Horizon shading']);
    const cells: string[] = [];
    wb.getWorksheet('Single-line diagram')!.eachRow((r) => r.eachCell((c) => { cells.push(String(c.value)); }));
    expect(cells.join(' ')).toContain('824.08 V');
    const sh: string[] = [];
    wb.getWorksheet('Horizon shading')!.eachRow((r) => r.eachCell((c) => { sh.push(String(c.value)); }));
    const march = shadingRows(p.shading!)[2];
    expect(sh).toContain(march[3]);

    const pdf = proposalToPdf(p);
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const { pathToFileURL } = await import('node:url'); const path = await import('node:path');
    pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')).href;
    const doc = await pdfjs.getDocument({ data: pdf.slice() }).promise;
    let text = '';
    for (let n = 1; n <= doc.numPages; n++) text += (await (await doc.getPage(n)).getTextContent()).items.map((i) => ('str' in i ? i.str : '')).join(' ') + '\n';
    text = text.replace(/\s+/g, ' ');
    expect(text).toContain('Single-line diagram, TEST-SLD');
    expect(text).toContain('824.08 V');
    expect(text).toContain(march[3]);
    expect(text).toContain('DRAFT: NOT FOR ISSUE');
    expect(text).toContain(`page ${doc.numPages} of ${doc.numPages}`);
    // Characters outside jsPDF's WinAnsi font are replaced, so no text run is corrupted (2026-11-25 fix).
    expect(text).toMatch(/rated >= 824\.08 V DC and >= 17\.38 A/);
    expect(text).toMatch(/Earthing, equipotential bonding and lightning protection: to be specified by the engineer/);
    expect(text).not.toMatch(/"e|"d/);
  }, 60000);
  it('pdfSafe keeps WinAnsi text and replaces the rest', async () => {
    const { pdfSafe } = await import('@/lib/solar/design/proposalExport');
    expect(pdfSafe('≥ 824 V, ≤ 25 A, −0.27, 1 × 16, 10 °C, mm², 200–850 V, β, ✓')).toBe('>= 824 V, <= 25 A, -0.27, 1 × 16, 10 °C, mm², 200–850 V, beta, ?');
  }, 60000);
});
