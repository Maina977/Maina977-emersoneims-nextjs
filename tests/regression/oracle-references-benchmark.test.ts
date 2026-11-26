import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { FAMILIES, LOW_OIL_PRESSURE, OVERHEATING } from '@/lib/generator-oracle/diagnostics/families';
import { diagnose } from '@/lib/generator-oracle/diagnostics/engine';
import { answersFromRaw, cleanEquipment } from '@/lib/generator-oracle/diagnostics/session';
import { diagnosisRecord } from '@/lib/generator-oracle/diagnostics/jobCardRecord';
import { REFERENCE_DATASETS, NOT_VERIFIED, knownModels, questionReferenceNote, referencesFor } from '@/lib/generator-oracle/diagnostics/oemReferences';
import { BENCHMARK_CASES } from './oracle-benchmark-cases';

const ENGINE_A = '1104D (Mech) Industrial Engine NK'; // in SEBU8325-01
const ENGINE_B = '1106D Industrial Engine'; // a sibling Perkins model: NOT in any dataset

describe('published reference datasets', () => {
  it('every entry names its equipment and model(s), and every dataset its full source', () => {
    for (const d of REFERENCE_DATASETS) {
      const s = d.source;
      for (const k of ['publisher', 'title', 'documentNumber', 'revision', 'url', 'accessedVia', 'retrieved', 'permittedUse'] as const) expect(String(s[k] ?? '').length, `${d.dataset}.${k}`).toBeGreaterThan(3);
      expect(s.sha256).toMatch(/^[0-9a-f]{64}$/);
      expect(s.url).toMatch(/^https:\/\//);
      expect(d.gaps.length).toBeGreaterThan(0);
      for (const e of d.entries) {
        expect(e.equipment.models.length, e.id).toBeGreaterThan(0);
        expect(e.page.length).toBeGreaterThan(3);
        expect(e.verification).toBe('verified-from-public-document');
        for (const f of e.families) expect(FAMILIES.some((x) => x.id === f), `${e.id}: unknown family ${f}`).toBe(true);
        if (e.relatesTo) {
          const fam = FAMILIES.find((x) => x.id === e.relatesTo!.family)!;
          expect(fam.questions.some((q) => q.id === e.relatesTo!.question)).toBe(true);
          expect(['context-not-a-limit', 'published-limit']).toContain(e.relatesTo.relation);
        }
      }
    }
  });
  it('a published TYPICAL range is never presented as a limit', () => {
    const typical = REFERENCE_DATASETS.flatMap((d) => d.entries).filter((e) => e.kind === 'typical-range');
    expect(typical.length).toBeGreaterThan(0);
    for (const e of typical) expect(e.meaning).toMatch(/NOT a minimum/);
  });
});

describe('APPLICABILITY: a limit for model A is never shown for model B', () => {
  it('Perkins 1104D NK coolant maximum is shown for that model only', () => {
    const a = referencesFor({ engine: ENGINE_A }, 'overheating', 'oemAlarmCoolantTemp');
    expect(a).toHaveLength(1);
    expect(a[0].text).toMatch(/110 °C/);
    expect(a[0].text).toMatch(/SEBU8325-01 \(revision -01 as printed\), July 2012, PDF p\. 22/);
    expect(referencesFor({ engine: ENGINE_B }, 'overheating', 'oemAlarmCoolantTemp')).toHaveLength(0);
    expect(referencesFor({}, 'overheating', 'oemAlarmCoolantTemp')).toHaveLength(0);
    expect(questionReferenceNote({ engine: ENGINE_B }, 'overheating', 'oemAlarmCoolantTemp')).toMatch(new RegExp(`^${NOT_VERIFIED}`));
    expect(questionReferenceNote({ engine: ENGINE_B }, 'overheating', 'oemAlarmCoolantTemp')).not.toMatch(/110/);
  });
  it('no match by make or similarity: another Perkins string, a lower-case copy, or a controller slot gets nothing', () => {
    for (const eq of [{ engine: 'Perkins 1104D' }, { engine: ENGINE_A.toLowerCase() }, { controller: ENGINE_A }]) expect(referencesFor(eq, 'overheating')).toHaveLength(0);
  });
  it('DSE7200/7300 entries are not shown for the DSE7310 MKII or for a ComAp controller, and vice versa', () => {
    expect(referencesFor({ controller: 'DSE7300 series' }, 'overspeed').map((r) => r.entry.id)).toContain('dse7x-overspeed-shutdown');
    expect(referencesFor({ controller: 'DSE7310 MKII' }, 'overspeed')).toHaveLength(0);
    expect(referencesFor({ controller: 'InteliLite 4 AMF 25' }, 'overspeed').map((r) => r.entry.id)).toEqual(['il4amf25-protections']);
    expect(referencesFor({ controller: 'DSE7300 series' }, 'charging').map((r) => r.entry.id)).not.toContain('il4amf25-power-supply');
  });
  it('an unknown model saved in storage is dropped on read (never matched loosely)', () => {
    expect(cleanEquipment({ equipment: { engine: ENGINE_B, controller: 'DSE7300 series' } })).toEqual({ controller: 'DSE7300 series' });
    expect(knownModels('engine')).toContain(ENGINE_A);
    expect(knownModels('engine')).not.toContain(ENGINE_B);
  });
  it('reference data never changes the diagnosis: same answers, any equipment → identical result', () => {
    const raw = { coolantTemp: '108', 'coolantTemp.unit': '°C', oemAlarmCoolantTemp: '103', 'oemAlarmCoolantTemp.unit': '°C' };
    const base = diagnose(OVERHEATING, answersFromRaw(OVERHEATING, raw));
    expect(diagnosisRecord(OVERHEATING, raw, { engine: ENGINE_A }).result).toEqual(base);
    expect(diagnosisRecord(OVERHEATING, raw, { engine: ENGINE_B }).result).toEqual(base);
    // Without an entered figure no STOP is invented, even with a published maximum held for the model.
    const noFigure = diagnosisRecord(OVERHEATING, { coolantTemp: '115', 'coolantTemp.unit': '°C' }, { engine: ENGINE_A });
    expect(noFigure.result.stopActive).toBe(false);
    expect(noFigure.findings).toMatch(/110 °C/); // shown as context in the export…
    expect(noFigure.findings).toMatch(/Reference only — not entered as an answer/);
  });
  it('the job-card record shows NOT VERIFIED for model B and the cited figure for model A', () => {
    const a = diagnosisRecord(LOW_OIL_PRESSURE, { oilPressure: '150', 'oilPressure.unit': 'kPa' }, { engine: ENGINE_A }).findings;
    expect(a).toMatch(/207–413 kPa/);
    expect(a).toMatch(/NOT a minimum/);
    const b = diagnosisRecord(LOW_OIL_PRESSURE, { oilPressure: '150', 'oilPressure.unit': 'kPa' }, { engine: ENGINE_B }).findings;
    expect(b).not.toMatch(/207/);
    expect(b).toContain(`machine limits ${NOT_VERIFIED}`);
  });
});

function runCase(c: (typeof BENCHMARK_CASES)[number]) {
  const f = FAMILIES.find((x) => x.id === c.family)!;
  const r = diagnose(f, answersFromRaw(f, c.inputs));
  const actual = {
    stops: r.stops.map((s) => s.level),
    top: r.ranked.slice(0, c.expect.top.length).map((x) => [x.id, x.score] as [string, number]),
    excluded: r.excluded.map((e) => e.id),
    invalid: r.invalid.map((i) => i.q),
    nextQuestion: r.nextQuestion?.id ?? null,
    withheld: r.ranked.flatMap((x) => x.withheld),
    stopActive: r.stopActive,
  };
  const pass = JSON.stringify(actual.stops) === JSON.stringify(c.expect.stops)
    && JSON.stringify(actual.top) === JSON.stringify(c.expect.top)
    && (c.expect.excludedIncludes ?? []).every((x) => actual.excluded.includes(x))
    && JSON.stringify(actual.invalid) === JSON.stringify(c.expect.invalid ?? [])
    && (c.expect.nextQuestion === undefined || actual.nextQuestion === c.expect.nextQuestion);
  return { actual, pass };
}

describe('benchmark programme (ALL SYNTHETIC — not field validation)', () => {
  for (const c of BENCHMARK_CASES) {
    it(`${c.id} ${c.category}: ${c.problem}`, () => {
      const { actual, pass } = runCase(c);
      expect(actual.stops).toEqual(c.expect.stops);
      expect(actual.top).toEqual(c.expect.top);
      for (const x of c.expect.excludedIncludes ?? []) expect(actual.excluded).toContain(x);
      expect(actual.invalid).toEqual(c.expect.invalid ?? []);
      if (c.expect.nextQuestion !== undefined) expect(actual.nextQuestion).toBe(c.expect.nextQuestion);
      if (actual.stopActive) expect(actual.nextQuestion === null || !FAMILIES.find((f) => f.id === c.family)!.questions.find((q) => q.id === actual.nextQuestion)!.needsRunning).toBe(true);
      expect(pass).toBe(true);
    });
  }
  it('safety-critical cases withhold every running check', () => {
    for (const c of BENCHMARK_CASES.filter((x) => x.category === 'safety-critical')) {
      const f = FAMILIES.find((x) => x.id === c.family)!;
      const r = diagnose(f, answersFromRaw(f, c.inputs));
      expect(r.stopActive).toBe(true);
      for (const x of r.ranked) for (const rc of f.causes.find((y) => y.id === x.id)!.runningChecks ?? []) expect(x.actions).not.toContain(rc);
    }
  });
  it('the committed results table matches what the application outputs', () => {
    const file = path.resolve('docs/engineering/oracle-benchmark-results.md');
    const rows = BENCHMARK_CASES.map((c) => {
      const { actual, pass } = runCase(c);
      const cell = (s: string) => s.replace(/\|/g, '/');
      return `| ${c.id} | ${c.category} | ${c.family} | ${cell(c.problem)} | ${cell(c.principle)} | \`${cell(JSON.stringify(c.inputs))}\` | ${c.expect.stops.join(', ') || '—'}; ${c.expect.top.map(([i, s]) => `${i} (${s})`).join(', ')} | ${actual.stops.join(', ') || '—'}; ${actual.top.map(([i, s]) => `${i} (${s})`).join(', ')}${actual.invalid.length ? `; refused ${actual.invalid.join(', ')}` : ''}${actual.withheld.length ? `; ${actual.withheld.length} running check(s) withheld` : ''} | ${pass ? 'PASS' : 'FAIL'} | ${cell(c.source)} |`;
    });
    const md = [
      '# Generator Oracle benchmark results (generated)',
      '',
      'Generated by `tests/regression/oracle-references-benchmark.test.ts` from `tests/regression/oracle-benchmark-cases.ts` (regenerate with `WRITE_BENCHMARK=1`). **Every case is SYNTHETIC.** Passing them shows the rules behave as specified; it is not field validation (see `oracle-evidence-package.md`).',
      '',
      `Engine version: ${diagnose(FAMILIES[0], {}).engineVersion}. Cases: ${BENCHMARK_CASES.length}.`,
      '',
      '| ID | Category | Family | Problem | Principle | Inputs | Expected (stops; leading causes) | Application output | Result | Source |',
      '|---|---|---|---|---|---|---|---|---|---|',
      ...rows,
      '',
    ].join('\n');
    if (process.env.WRITE_BENCHMARK) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, md); }
    expect(fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n')).toBe(md);
  });
});
