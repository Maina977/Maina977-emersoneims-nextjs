// Golden-value tests for crc/server/solar-engineering.js
//
// These tests anchor the pure-physics functions to published references so
// regressions are caught immediately. Tolerances reflect documented
// algorithm uncertainty (Michalsky ±0.01°, NREL SAM losses ~±5%).

'use strict';

const eng = require('../server/solar-engineering');

describe('sunPosition (Michalsky 1988)', () => {
  test('returns altitude near solar noon at the equator on equinox', () => {
    // 21 March 2026, 12:00 UTC, lat=0, lon=0 — sun should be almost overhead.
    const p = eng.sunPosition(0, 0, new Date(Date.UTC(2026, 2, 21, 12, 0, 0)));
    expect(p.elevation).toBeGreaterThan(85);
    expect(p.elevation).toBeLessThanOrEqual(90.5);
  });

  test('returns negative elevation at midnight', () => {
    const p = eng.sunPosition(0, 0, new Date(Date.UTC(2026, 2, 21, 0, 0, 0)));
    expect(p.elevation).toBeLessThan(0);
  });

  test('Nairobi (-1.286, 36.817) at local noon June solstice has high sun', () => {
    // 09:00 UTC ≈ 12:00 EAT
    const p = eng.sunPosition(-1.286, 36.817, new Date(Date.UTC(2026, 5, 21, 9, 0, 0)));
    expect(p.elevation).toBeGreaterThan(60);
  });
});

describe('inverterMatch DC/AC ratio (NREL/IEC 62109)', () => {
  test('1.20 ratio is a good match', () => {
    const r = eng.inverterMatch({ pvKwStc: 6.0, inverterAcKw: 5.0 });
    expect(r.dcAcRatio).toBeCloseTo(1.20, 2);
    expect(r.verdict).toMatch(/good match/i);
  });
  test('0.80 ratio flags undersized PV', () => {
    const r = eng.inverterMatch({ pvKwStc: 4.0, inverterAcKw: 5.0 });
    expect(r.verdict).toMatch(/undersized/i);
  });
  test('1.50 ratio flags clipping risk', () => {
    const r = eng.inverterMatch({ pvKwStc: 7.5, inverterAcKw: 5.0 });
    expect(r.verdict).toMatch(/clipping/i);
  });
});

describe('voltageDrop (IEC 60364-5-52 §G)', () => {
  test('hand calc: 25 A, 30 m one-way, 6 mm² Cu, 30 °C → ~4.4 V drop', () => {
    // ρ_30 = 0.01724 * (1 + 0.00393*10) = 0.01792 Ω·mm²/m
    // ΔV = 2*25*30*0.01792 / 6 = 4.48 V
    const r = eng.voltageDrop({
      systemType: 'dc', currentA: 25, voltageV: 600, oneWayLengthM: 30,
      csaMm2: 6, conductorMaterial: 'copper', ambientTempC: 30
    });
    expect(r.dropV).toBeGreaterThan(4.3);
    expect(r.dropV).toBeLessThan(4.6);
  });
  test('three-phase uses √3 factor', () => {
    const r = eng.voltageDrop({
      systemType: 'ac_three_phase', currentA: 50, voltageV: 400, oneWayLengthM: 50,
      csaMm2: 16, conductorMaterial: 'copper', ambientTempC: 20
    });
    // ΔV = √3 * 50 * 50 * 0.01724 / 16 ≈ 4.66 V
    expect(r.dropV).toBeGreaterThan(4.5);
    expect(r.dropV).toBeLessThan(4.8);
  });
});

describe('recommendConductor', () => {
  test('selects a CSA that satisfies 3% drop limit', () => {
    const r = eng.recommendConductor({
      systemType: 'dc', currentA: 25, voltageV: 600, oneWayLengthM: 30,
      conductorMaterial: 'copper', ambientTempC: 30, maxVoltDropPct: 3
    });
    expect(r.recommendedCsaMm2).toBeGreaterThanOrEqual(1.5);
    expect(r.voltageDropPct).toBeLessThanOrEqual(3);
  });
  test('returns null verdict when constraint impossible', () => {
    // 1000 A over 5000 m at 12 V — no standard CSA can satisfy
    const r = eng.recommendConductor({
      systemType: 'dc', currentA: 1000, voltageV: 12, oneWayLengthM: 5000,
      maxVoltDropPct: 3
    });
    expect(r.recommendedCsaMm2).toBeNull();
  });
});

describe('ocpdSizing (NEC 690.9 / IEC 60269-6)', () => {
  test('string fuse ≥ 1.56 × Isc; rounded UP to standard gPV size', () => {
    const r = eng.ocpdSizing({ panelIscStc: 11, stringsInParallel: 4 });
    // 1.56 * 11 = 17.16 A → next std gPV size = 20 A
    expect(r.stringFuse.minRatingA).toBeGreaterThan(17);
    expect(r.stringFuse.minRatingA).toBeLessThan(17.5);
    expect(r.stringFuse.recommendedStdA).toBe(20);
    expect(r.stringFuse.required).toBe(true);
  });
  test('two parallel strings → fuses optional', () => {
    const r = eng.ocpdSizing({ panelIscStc: 11, stringsInParallel: 2 });
    expect(r.stringFuse.required).toBe(false);
  });
  test('AC breaker uses 1.25 × inverter continuous current', () => {
    // 5 kW @ 230 V single-phase → 21.74 A → ×1.25 = 27.17 → next std = 32 A
    const r = eng.ocpdSizing({
      panelIscStc: 11, stringsInParallel: 3, inverterAcKw: 5, acVoltageV: 230
    });
    expect(r.acBreaker.recommendedStdA).toBe(32);
  });
});

describe('Anisotropic POA models (Hay-Davies, Perez)', () => {
  // Clear midday: high DNI, low DHI. POA on a flat horizontal panel must
  // equal beam_horizontal + DHI = DNI·sin(elev) + DHI.
  test('Hay-Davies on horizontal panel ≈ DNI·sin(elev) + DHI', () => {
    const r = eng.poaIrradianceHayDavies({
      ghi: 836, dni: 850, dhi: 100,           // 850·sin(60°)+100 ≈ 836
      sunElev: 60, sunAz: 180, tilt: 0, azimuth: 180, albedo: 0.2
    });
    expect(r.poa).toBeGreaterThan(820);
    expect(r.poa).toBeLessThan(860);
    expect(r.model).toBe('hay-davies');
  });

  // Tilted panel toward the sun should beat a horizontal panel under the
  // same beam conditions because cos(AOI) is larger when the panel normal
  // is closer to the sun vector.
  test('Hay-Davies on 30° tilt facing the sun beats a horizontal panel', () => {
    const inputs = { ghi: 800, dni: 850, dhi: 80, sunElev: 30, sunAz: 180, azimuth: 180, albedo: 0.2 };
    const flat   = eng.poaIrradianceHayDavies({ ...inputs, tilt: 0  });
    const tilted = eng.poaIrradianceHayDavies({ ...inputs, tilt: 30 });
    expect(tilted.poa).toBeGreaterThan(flat.poa);
  });

  test('Perez returns finite POA with realistic clear-sky inputs', () => {
    const r = eng.poaIrradiancePerez({
      ghi: 900, dni: 850, dhi: 80,
      sunElev: 45, sunAz: 180, tilt: 20, azimuth: 180, albedo: 0.2
    });
    expect(Number.isFinite(r.poa)).toBe(true);
    expect(r.poa).toBeGreaterThan(0);
    expect(r.model).toBe('perez');
    expect(typeof r.epsilon).toBe('number');
  });

  test('Perez at sun below horizon returns zero', () => {
    const r = eng.poaIrradiancePerez({
      ghi: 0, dni: 0, dhi: 0,
      sunElev: -5, sunAz: 180, tilt: 20, azimuth: 180, albedo: 0.2
    });
    expect(r.poa).toBe(0);
  });
});

describe('bifacialGain (first-order rear-irradiance)', () => {
  test('Bifacial 80%, tilt 30°, albedo 0.25 → 5–15% gain over front POA', () => {
    const r = eng.bifacialGain({
      poaFront: 800, ghi: 900, tilt: 30,
      albedo: 0.25, bifacialityFactor: 0.80, structureFactor: 0.95
    });
    expect(r.gainPct).toBeGreaterThan(3);
    expect(r.gainPct).toBeLessThan(20);
    expect(r.poaTotal).toBeGreaterThan(800);
  });

  test('Monofacial-equivalent (φ=0) yields zero gain', () => {
    const r = eng.bifacialGain({
      poaFront: 800, ghi: 900, tilt: 30,
      albedo: 0.25, bifacialityFactor: 0, structureFactor: 0.95
    });
    expect(r.gainPct).toBe(0);
    expect(r.poaTotal).toBe(800);
  });
});

describe('autoDesigner pipeline', () => {
  const ad = require('../server/autoDesigner');
  test('full design returns coverage, BOM, and inverter match', () => {
    const d = ad.autoDesign({
      annualConsumptionKwh: 6000,
      ambientMinC: 10, ambientMaxC: 35,
      tiltDeg: 5, azimuthDeg: 0,
      targetSpecificYieldKwhPerKwp: 1500
    });
    expect(d.summary.arrayKwp).toBeGreaterThan(3);
    expect(d.summary.arrayKwp).toBeLessThan(6);
    expect(d.summary.coverageOfLoadPct).toBeGreaterThan(95);
    expect(d.bom.length).toBeGreaterThanOrEqual(5);
    expect(d.inverterMatch).toHaveProperty('dcAcRatio');
  });

  test('throws on missing required field', () => {
    expect(() => ad.autoDesign({ annualConsumptionKwh: 1000 })).toThrow(/missing required/);
  });
});

describe('SLD generator', () => {
  const sld = require('../server/sld-generator');
  const ad = require('../server/autoDesigner');
  test('emits SVG with required component labels', () => {
    const d = ad.autoDesign({
      annualConsumptionKwh: 6000, ambientMinC: 10, ambientMaxC: 35,
      tiltDeg: 5, azimuthDeg: 0, targetSpecificYieldKwhPerKwp: 1500
    });
    const svg = sld.generateSLD({
      panel: d.equipment.panel, panelCount: d.summary.panelCount,
      stringSeries: d.string.recommendedSeriesPerString || 10,
      stringsParallel: d.string.recommendedParallelStrings || 1,
      inverter: d.equipment.inverter, battery: null,
      ocpd: d.bos.ocpd,
      wiring: { dcCsaMm2: d.bos.dcWiring.recommendedCsaMm2, acCsaMm2: d.bos.acWiring.recommendedCsaMm2 }
    });
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg).toContain('PV Array');
    expect(svg).toContain('Inverter');
    expect(svg).toContain('Utility Grid');
  });
});
