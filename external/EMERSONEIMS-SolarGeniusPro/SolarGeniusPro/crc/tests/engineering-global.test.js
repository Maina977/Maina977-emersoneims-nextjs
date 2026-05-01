// Tests for engineering-global Tier-5 calculators
const eg = require('../server/engineering-global');

describe('engineering-global: epwTmyImport', () => {
  test('throws on empty input', () => {
    expect(() => eg.epwTmyImport({})).toThrow(/epwText/);
  });

  test('parses synthetic minimal EPW', () => {
    const header = [
      'LOCATION,Nairobi,,KEN,SG,63740,-1.32,36.92,3.0,1798',
      'DESIGN CONDITIONS,0',
      'TYPICAL/EXTREME PERIODS,0',
      'GROUND TEMPERATURES,0',
      'HOLIDAYS/DAYLIGHT SAVINGS,No,0,0,0',
      'COMMENTS 1,test',
      'COMMENTS 2,test',
      'DATA PERIODS,1,1,Data,Sunday,1/1,12/31',
    ];
    const rows = [];
    for (let i = 0; i < 8760; i++) {
      const ghi = Math.max(0, Math.sin((i % 24) / 24 * Math.PI) * 800);
      const dni = ghi * 0.7, dhi = ghi * 0.3;
      // 22 columns: yr,mo,da,hr,mn,src,tdb,tdp,rh,p,exh,exdn,hir,GHI,DNI,DHI,gilum,dnilum,dhilum,zenlum,wd,ws
      rows.push(`1985,1,1,${i % 24 + 1},60,?,20,15,75,101325,0,0,0,${ghi},${dni},${dhi},0,0,0,0,180,3.5`);
    }
    const text = header.concat(rows).join('\n');
    const r = eg.epwTmyImport({ epwText: text });
    expect(r.location.city).toBe('Nairobi');
    expect(r.location.country).toBe('KEN');
    expect(r.hourlyGhiWm2).toHaveLength(8760);
    expect(r.annualGhiKwhM2).toBeGreaterThan(500);
    expect(r.monthlyGhiKwhM2).toHaveLength(12);
    expect(r.provenance.reference).toMatch(/ASHRAE|EnergyPlus/);
  });
});

describe('engineering-global: panOndFullParse', () => {
  test('parses a synthetic PAN file', () => {
    const pan = `PVObject_=pvModule
Manufacturer=Trina Solar
Model=TSM-550NEG19RC.20
Technol=mtSiMono
PNom=550
Vmpp=42.1
Impp=13.07
Voc=50.1
Isc=13.94
TONOCT=43
muVocSpec=-130
muISC=6.5
muPmpReq=-0.34
NCelS=144
Surface=2.61
RSerie=0.27
RShunt=400
Gamma=1.10
BifacialityFactor=0.7
`;
    const r = eg.panOndFullParse({ fileText: pan });
    expect(r.detectedAs).toMatch(/module/);
    expect(r.manufacturer).toBe('Trina Solar');
    expect(r.nominalPowerW).toBe(550);
    expect(r.stc.Vmpp).toBe(42.1);
    expect(r.tempCoefs.gammaPmax_pctPerC).toBe(-0.34);
    expect(r.bifaciality).toBe(0.7);
  });

  test('parses a synthetic OND inverter file', () => {
    const ond = `PVObject_=pvInverter
Manufacturer=Sungrow
Model=SG110CX
PNomConv=110
PMaxOUT=121
PNomDC=165
VMpptMin=200
VMpptMax=1000
VAbsMax=1100
IMaxDC=26
EffEuroMax=98.7
NMPPT=9
`;
    const r = eg.panOndFullParse({ fileText: ond, fileType: 'OND' });
    expect(r.detectedAs).toMatch(/inverter/);
    expect(r.nominalAcKw).toBe(110);
    expect(r.mpptVoltageRange.minV).toBe(200);
    expect(r.mpptCount).toBe(9);
    expect(r.euroEfficiencyPct).toBe(98.7);
  });

  test('throws on empty input', () => {
    expect(() => eg.panOndFullParse({})).toThrow(/fileText/);
  });
});

describe('engineering-global: continuousBeamFE', () => {
  test('single-span uniform load matches wL²/8', () => {
    const r = eg.continuousBeamFE({ spanLengthsM: [4], uniformLoadKnPerM: 2.0 });
    expect(r.fieldMoments[0].peakKnm).toBeCloseTo(2.0 * 16 / 8, 1);
    expect(r.supportReactionsKn[0]).toBeCloseTo(4.0, 1);
  });

  test('two equal spans: support moment ≈ -wL²/8 at centre', () => {
    const r = eg.continuousBeamFE({ spanLengthsM: [3, 3], uniformLoadKnPerM: 1.0 });
    // Theory: M_centre = -w·L²/8 = -1·9/8 = -1.125 kNm
    expect(r.supportMomentsKnm[1]).toBeCloseTo(-1.125, 1);
  });

  test('four equal spans returns five reactions', () => {
    const r = eg.continuousBeamFE({ spanLengthsM: [3, 3, 3, 3], uniformLoadKnPerM: 0.5 });
    expect(r.supportReactionsKn).toHaveLength(5);
    expect(r.fieldMoments).toHaveLength(4);
    expect(r.maxAbsoluteMomentKnm).toBeGreaterThan(0);
  });

  test('deflection is sensible', () => {
    const r = eg.continuousBeamFE({ spanLengthsM: [3, 3, 3], uniformLoadKnPerM: 0.5, E_GPa: 210, I_mm4: 1e7 });
    expect(r.maxDeflectionMm).toBeGreaterThan(0);
    expect(r.maxDeflectionMm).toBeLessThan(50);
  });
});

describe('engineering-global: globalGridCodePack', () => {
  test('Kenya returns EPRA pack', () => {
    const r = eg.globalGridCodePack({ countryCode: 'KE', systemAcKw: 50 });
    expect(r.country).toBe('Kenya');
    expect(r.regulator).toMatch(/EPRA/);
    expect(r.requiredDocuments.length).toBeGreaterThan(2);
    expect(r.detectedTier).toMatch(/commercial/);
  });

  test('US returns IEEE 1547 pack', () => {
    const r = eg.globalGridCodePack({ countryCode: 'US', systemAcKw: 6000 });
    expect(r.regulations.some(x => /IEEE 1547/.test(x))).toBe(true);
    expect(r.detectedTier).toBe('utility-scale IPP');
  });

  test('unknown country falls back to IEC', () => {
    const r = eg.globalGridCodePack({ countryCode: 'XX', systemAcKw: 10 });
    expect(r.country).toMatch(/IEC/);
  });

  test('all 11 countries + IEC available', () => {
    const r = eg.globalGridCodePack({ countryCode: 'KE' });
    expect(r.availableCountries).toEqual(expect.arrayContaining(['KE','US','EU','UK','DE','AU','ZA','IN','NG','JP','BR','IEC']));
  });
});

describe('engineering-global: globalFinancePack', () => {
  test('Kenya residential returns positive NPV', () => {
    const r = eg.globalFinancePack({
      capexLocalCurrency: 500_000, annualGenKwh: 7800, tariffPerKwh: 25,
      currencyCode: 'KES', systemLifetimeYears: 25, discountRatePct: 8, inflationRatePct: 5,
    });
    expect(r.npvLocal).toBeGreaterThan(0);
    expect(r.lcoeLocalPerKwh).toBeGreaterThan(0);
    expect(r.lcoeLocalPerKwh).toBeLessThan(25);
    expect(r.paybackYears).toBeGreaterThan(0);
    expect(r.paybackYears).toBeLessThan(15);
    expect(r.currency.code).toBe('KES');
    expect(r.currency.symbol).toBe('KSh');
  });

  test('USD project returns USD-denominated metrics', () => {
    const r = eg.globalFinancePack({
      capexLocalCurrency: 1_000_000, annualGenKwh: 1_500_000, tariffPerKwh: 0.12,
      currencyCode: 'USD', systemLifetimeYears: 25,
    });
    expect(r.currency.code).toBe('USD');
    expect(r.currency.fxToUsd).toBe(1);
    expect(r.lcoeUsdPerKwh).toBeCloseTo(r.lcoeLocalPerKwh, 4);
  });

  test('IRR is between -90% and 500%', () => {
    const r = eg.globalFinancePack({ capexLocalCurrency: 100_000, annualGenKwh: 5000, tariffPerKwh: 25, currencyCode: 'KES' });
    expect(r.irrPct).toBeGreaterThan(-90);
    expect(r.irrPct).toBeLessThan(500);
  });
});

describe('engineering-global: provenance footer present', () => {
  test('every function returns provenance with method+reference+limits', () => {
    const samples = [
      eg.panOndFullParse({ fileText: 'PNom=400\nVmpp=30\nmuPmpReq=-0.4\n' }),
      eg.continuousBeamFE({ spanLengthsM: [3,3], uniformLoadKnPerM: 0.5 }),
      eg.globalGridCodePack({ countryCode: 'KE' }),
      eg.globalFinancePack({ capexLocalCurrency: 100000, annualGenKwh: 5000, tariffPerKwh: 25, currencyCode: 'KES' }),
    ];
    for (const r of samples) {
      expect(r.provenance.method).toBeTruthy();
      expect(r.provenance.reference).toBeTruthy();
      expect(r.provenance.limits).toBeTruthy();
    }
  });
});
