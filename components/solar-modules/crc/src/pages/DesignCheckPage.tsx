import React, { useMemo, useState } from 'react';
import {
  validateStrings, checkCable, checkBattery, checkGenerator, SOLAR_DESIGN_ENGINE_VERSION,
  type Check, type Module, type Inverter, type Battery,
} from '@/lib/solar/design/validate';
import { simulateProduction, PVWATTS_DEFAULT_LOSSES, type ProductionResult } from '@/lib/solar/design/production';

/**
 * Design Check (P1-B). Validates a string / inverter / cable / battery /
 * generator design against datasheet values entered by the designer.
 * Fields start empty: there is no default module, inverter or battery.
 * Engine: lib/solar/design/validate.ts (tests: solar-design-validation.test.ts).
 */

type Form = Record<string, string>;
const FIELDS: Array<{ group: string; items: Array<[string, string, string]> }> = [
  { group: 'Module (datasheet)', items: [['m.model', 'Model', ''], ['m.datasheet', 'Datasheet reference', ''], ['m.pmaxW', 'Pmax', 'W'], ['m.vocV', 'Voc', 'V'], ['m.iscA', 'Isc', 'A'], ['m.vmpV', 'Vmp', 'V'], ['m.impA', 'Imp', 'A'], ['m.betaVocPct', 'β Voc', '%/°C'], ['m.betaVmpPct', 'β Vmp', '%/°C'], ['m.noctC', 'NOCT', '°C'], ['m.maxSystemV', 'Max system voltage', 'V'], ['m.maxSeriesFuseA', 'Max series fuse', 'A']] },
  { group: 'Inverter (datasheet)', items: [['i.model', 'Model', ''], ['i.datasheet', 'Datasheet reference', ''], ['i.acKw', 'AC power', 'kW'], ['i.maxDcV', 'Max DC voltage', 'V'], ['i.mpptMinV', 'MPPT min', 'V'], ['i.mpptMaxV', 'MPPT max', 'V'], ['i.mpptCount', 'MPPTs', 'No'], ['i.maxInputA', 'Max input current per MPPT', 'A'], ['i.maxIscA', 'Max Isc per MPPT', 'A'], ['i.batteryMaxDischargeKw', 'Battery discharge power (required with a battery)', 'kW'], ['i.batteryMaxChargeKw', 'Battery charge power (required with a battery)', 'kW'], ['i.generatorCompatibility', 'Generator compatibility statement (required with a generator)', '']] },
  { group: 'Site and array', items: [['s.recordLowC', 'Site record low', '°C'], ['s.maxAmbientC', 'Max ambient while generating', '°C'], ['d.modulesPerString', 'Modules per string', 'No'], ['d.stringsPerMppt', 'Strings on each MPPT (e.g. 2,1)', '']] },
  { group: 'String cable (optional)', items: [['c.lengthM', 'One-way length', 'm'], ['c.csaMm2', 'Cross-section', 'mm²'], ['c.tabulatedAmpacityA', 'Tabulated ampacity It (IEC 60364-5-52)', 'A'], ['c.ambientFactor', 'Ambient factor Ca', ''], ['c.groupingFactor', 'Grouping factor Cg', ''], ['c.maxDropPct', 'Max voltage drop', '%']] },
  { group: 'Battery (optional, datasheet)', items: [['b.model', 'Model', ''], ['b.datasheet', 'Datasheet reference', ''], ['b.nominalKwh', 'Nominal energy per unit', 'kWh'], ['b.units', 'Units', 'No'], ['b.usableDoD', 'Usable DoD (0–1)', ''], ['b.dischargeEfficiency', 'Discharge efficiency (0–1)', ''], ['b.maxDischargeC', 'Max discharge', 'C'], ['b.maxChargeC', 'Max charge', 'C'], ['b.usableAcKwh', 'Energy needed from the battery per cycle', 'kWh']] },
  { group: 'Generator (optional)', items: [['g.ratedKw', 'Generator rating', 'kW'], ['g.oemMinLoadPct', 'OEM minimum load (blank = 30 % practice)', '%'], ['g.minSiteLoadKw', 'Lowest site load while it runs', 'kW'], ['g.backfeed', 'Can PV export into the running generator? (yes/no)', '']] },
  { group: 'Production estimate (optional)', items: [['p.lat', 'Latitude', '°'], ['p.tilt', 'Tilt', '°'], ['p.azimuth', 'Azimuth (0 = N, 180 = S)', '°'], ['p.ghi', '12 monthly irradiation, comma-separated', 'kWh/m²/day'], ['p.ghiSource', 'Irradiation source (e.g. NASA POWER, retrieved date)', ''], ['p.tamb', '12 monthly daytime ambient, comma-separated', '°C'], ['p.tambSource', 'Temperature source', ''], ['p.gammaPmaxPct', 'Module γ Pmax (datasheet)', '%/°C'], ['p.invEff', 'Inverter nominal efficiency (0–1, datasheet)', ''], ['p.losses', 'Losses: type "pvwatts" for NREL PVWatts defaults (14.08 %)', '']] },
];

/** Worked example: the test values from solar-design-validation.test.ts, not a product recommendation. */
const EXAMPLE: Form = {
  'm.model': 'Worked example module', 'm.datasheet': 'example values', 'm.pmaxW': '550', 'm.vocV': '49.5', 'm.iscA': '13.9', 'm.vmpV': '41.5', 'm.impA': '13.1', 'm.betaVocPct': '-0.27', 'm.betaVmpPct': '-0.35', 'm.noctC': '45', 'm.maxSystemV': '1500', 'm.maxSeriesFuseA': '25',
  'i.model': 'Worked example inverter', 'i.datasheet': 'example values', 'i.acKw': '15', 'i.maxDcV': '1000', 'i.mpptMinV': '200', 'i.mpptMaxV': '850', 'i.mpptCount': '2', 'i.maxInputA': '26', 'i.maxIscA': '40',
  's.recordLowC': '10', 's.maxAmbientC': '35', 'd.modulesPerString': '16', 'd.stringsPerMppt': '1,1',
};

const n = (f: Form, k: string) => (f[k] ?? '').trim() === '' ? NaN : Number(f[k]);
const has = (f: Form, prefix: string, keys: string[]) => keys.every((k) => (f[`${prefix}.${k}`] ?? '').trim() !== '');

const colour: Record<Check['verdict'], string> = { PASS: '#22c55e', WARN: '#f59e0b', REFUSE: '#ef4444' };

export default function DesignCheckPage() {
  const [f, setF] = useState<Form>({});
  const set = (k: string, v: string) => setF((x) => ({ ...x, [k]: v }));

  const result = useMemo(() => {
    const required = FIELDS.slice(0, 3).flatMap((g) => g.items.filter(([k]) => !/optional/i.test(g.items.find((i) => i[0] === k)![1])).map(([k]) => k));
    const missing = required.filter((k) => (f[k] ?? '').trim() === '');
    if (missing.length) return { missing, errors: [] as string[], checks: [] as Check[], valid: false, kWp: 0 };
    const module: Module = { model: f['m.model'], datasheet: f['m.datasheet'], pmaxW: n(f, 'm.pmaxW'), vocV: n(f, 'm.vocV'), iscA: n(f, 'm.iscA'), vmpV: n(f, 'm.vmpV'), impA: n(f, 'm.impA'), betaVocPct: n(f, 'm.betaVocPct'), betaVmpPct: n(f, 'm.betaVmpPct'), alphaIscPct: 0, gammaPmaxPct: 0, noctC: n(f, 'm.noctC'), maxSystemV: n(f, 'm.maxSystemV'), maxSeriesFuseA: n(f, 'm.maxSeriesFuseA') };
    const optNum = (k: string) => (Number.isFinite(n(f, k)) ? n(f, k) : undefined);
    const inverter: Inverter = { model: f['i.model'], datasheet: f['i.datasheet'], acKw: n(f, 'i.acKw'), maxDcV: n(f, 'i.maxDcV'), mpptMinV: n(f, 'i.mpptMinV'), mpptMaxV: n(f, 'i.mpptMaxV'), mpptCount: n(f, 'i.mpptCount'), maxInputA: n(f, 'i.maxInputA'), maxIscA: n(f, 'i.maxIscA'), batteryMaxDischargeKw: optNum('i.batteryMaxDischargeKw'), batteryMaxChargeKw: optNum('i.batteryMaxChargeKw'), generatorCompatibility: (f['i.generatorCompatibility'] ?? '').trim() || null };
    const strings = (f['d.stringsPerMppt'] ?? '').split(',').map((s) => Number(s.trim()));
    const r = validateStrings(module, inverter, { modulesPerString: n(f, 'd.modulesPerString'), stringsPerMppt: strings }, { recordLowC: n(f, 's.recordLowC'), maxAmbientC: n(f, 's.maxAmbientC') });
    const errors = [...r.errors];
    const checks = [...r.checks];
    if (!errors.length && has(f, 'c', ['lengthM', 'csaMm2', 'tabulatedAmpacityA', 'ambientFactor', 'groupingFactor', 'maxDropPct'])) {
      const maxStrings = Math.max(...strings);
      const hotVmp = r.checks.find((c) => c.id === 'hot-vmp')!.value;
      const c = checkCable({ name: 'String cable', lengthM: n(f, 'c.lengthM'), csaMm2: n(f, 'c.csaMm2'), designCurrentA: Math.round(1.25 * module.iscA * Math.max(1, maxStrings - 1) * 100) / 100, systemV: hotVmp, tabulatedAmpacityA: n(f, 'c.tabulatedAmpacityA'), ambientFactor: n(f, 'c.ambientFactor'), groupingFactor: n(f, 'c.groupingFactor'), maxDropPct: n(f, 'c.maxDropPct') });
      errors.push(...c.errors); checks.push(...c.checks);
    }
    if (has(f, 'b', ['nominalKwh', 'units', 'usableDoD', 'dischargeEfficiency', 'maxDischargeC', 'maxChargeC', 'usableAcKwh'])) {
      const battery: Battery = { model: f['b.model'] ?? '', datasheet: f['b.datasheet'] ?? '', nominalKwh: n(f, 'b.nominalKwh'), usableDoD: n(f, 'b.usableDoD'), dischargeEfficiency: n(f, 'b.dischargeEfficiency'), maxDischargeC: n(f, 'b.maxDischargeC'), maxChargeC: n(f, 'b.maxChargeC') };
      const b = checkBattery(battery, inverter, n(f, 'b.usableAcKwh'), n(f, 'b.units'));
      errors.push(...b.errors); checks.push(...b.checks);
    }
    if (has(f, 'g', ['ratedKw', 'minSiteLoadKw', 'backfeed'])) {
      const back = /^y/i.test(f['g.backfeed']);
      checks.push(...checkGenerator(inverter, { ratedKw: n(f, 'g.ratedKw'), oemMinLoadPct: optNum('g.oemMinLoadPct') }, n(f, 'g.minSiteLoadKw'), back));
    }
    const valid = !errors.length && !checks.some((c) => c.verdict === 'REFUSE');
    let production: ProductionResult | null = null, productionError = '';
    if (has(f, 'p', ['lat', 'tilt', 'azimuth', 'ghi', 'ghiSource', 'tamb', 'tambSource', 'gammaPmaxPct', 'invEff', 'losses'])) {
      if (!valid) productionError = 'Production is estimated only for a valid design.';
      else if (!/^pvwatts$/i.test(f['p.losses'].trim())) productionError = 'Enter "pvwatts" to use the NREL PVWatts default losses (itemised losses come next).';
      else {
        try {
          const list = (k: string) => f[k].split(',').map((x) => Number(x.trim()));
          production = simulateProduction({
            site: { latDeg: n(f, 'p.lat'), tiltDeg: n(f, 'p.tilt'), azimuthDeg: n(f, 'p.azimuth') },
            ghiMonthly: list('p.ghi'), ghiSource: f['p.ghiSource'], ambientMonthlyC: list('p.tamb'), ambientSource: f['p.tambSource'],
            array: { dcKw: r.kWp, gammaPmaxPct: n(f, 'p.gammaPmaxPct'), noctC: module.noctC },
            inverter: { acKw: inverter.acKw, nominalEfficiency: n(f, 'p.invEff') },
            losses: PVWATTS_DEFAULT_LOSSES, lossesSource: 'NREL PVWatts v5 default losses (14.08 %)',
          });
        } catch (e) { productionError = (e as Error).message; }
      }
    }
    return { missing: [] as string[], errors, checks, valid, kWp: r.kWp, production, productionError };
  }, [f]);

  const label = (k: string) => FIELDS.flatMap((g) => g.items).find((i) => i[0] === k)?.[1] ?? k;
  const box: React.CSSProperties = { background: 'rgba(15,23,42,0.7)', border: '1px solid #334155', borderRadius: 12, padding: 16 };

  return (
    <div style={{ padding: 16, color: '#e2e8f0', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Design Check</h1>
      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>
        Checks string voltages at the site&apos;s temperature extremes, MPPT currents, string fusing, DC/AC ratio, cable capacity and voltage drop, battery energy and C-rates, and generator compatibility. Enter values from the datasheets. A design with any REFUSE is not valid and must not be quoted.
      </p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button type="button" onClick={() => setF(EXAMPLE)} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #475569', background: '#1e293b', color: '#e2e8f0' }}>Load worked example (test values, not a recommendation)</button>
        <button type="button" onClick={() => setF({})} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #475569', background: 'transparent', color: '#94a3b8' }}>Clear</button>
        <a href="#/proposal" style={{ fontSize: 13, color: '#fbbf24', alignSelf: 'center' }}>Continue to proposal →</a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 16 }}>
        <div style={{ display: 'grid', gap: 12 }}>
          {FIELDS.map((g) => (
            <fieldset key={g.group} style={box}>
              <legend style={{ fontWeight: 600, color: '#fbbf24', padding: '0 4px' }}>{g.group}</legend>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8 }}>
                {g.items.map(([k, l, u]) => (
                  <label key={k} style={{ fontSize: 12, color: '#cbd5e1' }}>
                    {l}{u ? <span style={{ color: '#64748b' }}> ({u})</span> : null}
                    <input value={f[k] ?? ''} onChange={(e) => set(k, e.target.value)} inputMode={u && u !== '' ? 'decimal' : undefined}
                      style={{ display: 'block', width: '100%', marginTop: 4, padding: '6px 8px', borderRadius: 6, border: '1px solid #475569', background: '#0f172a', color: '#fff' }} />
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
        <div style={{ ...box, alignSelf: 'start' }} aria-live="polite">
          {result.missing.length > 0 ? (
            <p style={{ fontSize: 13, color: '#94a3b8' }}>Waiting for: {result.missing.map(label).join(', ')}.</p>
          ) : (
            <>
              <div style={{ fontSize: 18, fontWeight: 700, color: result.valid ? '#22c55e' : '#ef4444', marginBottom: 8 }}>
                {result.valid ? `Design valid · ${result.kWp} kWp` : 'Design NOT valid'}
              </div>
              {result.errors.map((e) => <p key={e} style={{ color: '#fca5a5', fontSize: 13 }}>Refused input: {e}</p>)}
              <div style={{ display: 'grid', gap: 8 }}>
                {result.checks.map((c) => (
                  <div key={c.id} style={{ borderLeft: `4px solid ${colour[c.verdict]}`, padding: '6px 10px', background: 'rgba(30,41,59,0.6)', borderRadius: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 13 }}>
                      <strong>{c.title}</strong>
                      <span style={{ color: colour[c.verdict], fontWeight: 700 }}>{c.verdict}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#cbd5e1' }}>{c.value} {c.unit} against limit {c.limit} {c.unit} (margin {c.marginPct} %)</div>
                    {c.note ? <div style={{ fontSize: 12, color: '#fbbf24' }}>{c.note}</div> : null}
                    <div style={{ fontSize: 11, color: '#64748b' }}>{c.formula} · {c.reference}</div>
                  </div>
                ))}
              </div>
              {'productionError' in result && result.productionError ? <p style={{ color: '#fbbf24', fontSize: 13, marginTop: 12 }}>Production: {result.productionError}</p> : null}
              {'production' in result && result.production ? (() => { const p = result.production; return (
                <div style={{ marginTop: 16, borderTop: '1px solid #334155', paddingTop: 12 }} aria-label="Production estimate">
                  <div style={{ fontSize: 16, fontWeight: 700 }}>Estimated production: {p.annualKwh.toLocaleString('en-KE')} kWh/year</div>
                  <div style={{ fontSize: 12, color: '#cbd5e1' }}>Specific yield {p.specificYieldKwhPerKwp} kWh/kWp · performance ratio {p.performanceRatio} · temperature loss {p.temperatureLossPct} % · system losses {p.systemLossPct} % · clipped {p.clippedKwh} kWh</div>
                  <table style={{ fontSize: 12, marginTop: 6, borderCollapse: 'collapse' }}><tbody><tr>
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((m, i) => <td key={i} style={{ padding: '2px 6px', textAlign: 'center' }}>{m}<br />{Math.round(p.monthlyKwh[i])}</td>)}
                  </tr></tbody></table>
                  <ul style={{ fontSize: 11, color: '#94a3b8', marginTop: 6, paddingLeft: 16 }}>{p.assumptions.map((a) => <li key={a}>{a}</li>)}</ul>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{p.engineVersion}; benchmarked against pvlib 0.16.1 (annual within 1.5 %).</div>
                </div>
              ); })() : null}
            </>
          )}
          <p style={{ fontSize: 11, color: '#64748b', marginTop: 12 }}>{SOLAR_DESIGN_ENGINE_VERSION}. Checks follow IEC 62548-1 and IEC 60364-5-52 practice; the installer remains responsible for compliance with the local regulations (in Kenya, the EPRA solar PV regulations).</p>
        </div>
      </div>
    </div>
  );
}
