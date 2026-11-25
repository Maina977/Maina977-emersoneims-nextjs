import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ORACLE_SAFETY_WITHDRAWN_MESSAGE } from '@/lib/generator-oracle/safety/withdrawal';
import { jobCardReport, STOP_NOT_CARRIED_NOTICE, type Asset, type JobCard } from '@/lib/generator-oracle/service/maintenance';
import { jobCardToPdf } from '@/lib/generator-oracle/service/jobCardPdf';
import { emptyState, reduce, type ServiceAction, type ServiceState } from '@/lib/generator-oracle/service/store';

// Safety withdrawal (management rule, 2026-11-25): an instruction-giving workflow that is
// not safe stays unavailable until corrected and independently re-verified. The independent
// review (ORACLE-SURFACES-REVIEW.md) found S1-S8 and S10-S15 gave running/cranking/live-circuit
// steps under STOP conditions, used invented thresholds, or omitted STOPs.

const NOTICE = 'This part of Generator Oracle is temporarily unavailable while safety checks are being updated. Please consult the applicable OEM service manual and a qualified technician.';

/** Withdrawn modules (path without extension, relative to the repo root). */
const WITHDRAWN = [
  'components/generator-oracle/RuleBasedAssistantPanel', // S1 rule-based Diagnostic Assistant
  'components/generator-oracle/panels/ExpertAIChatPanel', // S12 Describe Symptoms
  'components/generator-oracle/AIVisualDiagnostic', // S13 Visual Checklist (also /generators)
  'components/generator-oracle/panels/AIAnalysisPanel', // S10/S11 Readings Analysis
  'components/generator-oracle/panels/FaultDiagnosticsPanel', // S2/S3 Fault Code Lookup + Expert Notes
  'components/generator-oracle/DetailedFaultExample', // S4 Worked Example
  'components/generator-oracle/DetailedFaultDisplay', // S4 renderer
  'components/generator-oracle/InteractiveTroubleshooter', // S5
  'components/generator-oracle/TechnicianInputDiagnostics', // S6
  'components/generator-oracle/panels/WiringDiagnosticFlows', // S7 Wiring > Diagnostics flows
  'components/generator-oracle/panels/ControllerRepairManualsWithdrawnSections', // S8 Repair Procedures / Fault Codes
  'components/generator-oracle/panels/InteractiveDiagnosticSystem', // hidden; mounted S1 and called expert-chat
  'components/generator-oracle/panels/TechnicianAssistantPanel', // P3, withdrawn earlier
];

const ROOT = path.resolve('.');
const EXTS = ['.ts', '.tsx', '.js', '.jsx', '.mjs'];
const rel = (f: string) => path.relative(ROOT, f).split(path.sep).join('/');
const noExt = (f: string) => rel(f).replace(/\.(tsx?|jsx?|mjs)$/, '');

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === 'node_modules' ? [] : walk(p);
    return /\.(tsx?|jsx?|mjs)$/.test(e.name) ? [p] : [];
  });
}

function resolveSpec(from: string, spec: string): string | null {
  let base: string;
  if (spec.startsWith('@/')) base = path.join(ROOT, spec.slice(2));
  else if (spec.startsWith('.')) base = path.resolve(path.dirname(from), spec);
  else return null;
  const tries = [base, ...EXTS.map((e) => base + e), ...EXTS.map((e) => path.join(base, 'index' + e))];
  return tries.find((t) => fs.existsSync(t) && fs.statSync(t).isFile()) ?? null;
}

/** Value imports (type-only imports are erased and never reach the build). */
function importsOf(file: string): string[] {
  const src = fs.readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const specs: string[] = [];
  const re = /(?:^|[^.\w])(?:import|export)\s+(type\s+)?(?:[\w*{}\s,]+?\s+from\s+)?['"]([^'"]+)['"]|import\(\s*['"`]([^'"`]+)['"`]\s*\)|require\(\s*['"]([^'"]+)['"]\s*\)/gm;
  for (const m of src.matchAll(re)) {
    if (m[1]) continue;
    const s = m[2] ?? m[3] ?? m[4];
    if (s) specs.push(s);
  }
  return specs;
}

/** Every file reachable from app/ (pages, layouts, routes, sitemap, ...) plus middleware/proxy. */
function reachable(): Map<string, string> {
  const entries = [...walk(path.join(ROOT, 'app')), ...['middleware.ts', 'proxy.ts', 'instrumentation.ts'].map((f) => path.join(ROOT, f)).filter((f) => fs.existsSync(f))];
  const seen = new Map<string, string>(); // file -> who imported it
  const queue = entries.map((e) => { seen.set(e, '(entry)'); return e; });
  while (queue.length) {
    const f = queue.shift()!;
    for (const spec of importsOf(f)) {
      const r = resolveSpec(f, spec);
      if (r && !seen.has(r)) { seen.set(r, rel(f)); queue.push(r); }
    }
  }
  return seen;
}

describe('Oracle safety withdrawal 2026-11-25: withdrawn modules are not in the build', () => {
  const graph = reachable();
  it('the import graph from app/ was built (sanity)', () => {
    const names = [...graph.keys()].map(noExt);
    expect(names).toContain('components/generator-oracle/GeneratorOracleModule');
    expect(names).toContain('components/generator-oracle/panels/GuidedDiagnosisPanel');
    expect(names).toContain('components/generator-oracle/panels/WiringDiagramsPanel');
    expect(names).toContain('components/generator-oracle/OracleSafetyWithdrawnNotice');
  });
  for (const w of WITHDRAWN) {
    it(`${w} is not reachable from any shipped entry point`, () => {
      const hit = [...graph.entries()].filter(([f]) => noExt(f) === w).map(([f, by]) => `${rel(f)} <- ${by}`);
      expect(hit).toEqual([]);
    });
  }
  it('no shipped (reachable) source file names a withdrawn module in an import', () => {
    const offenders: string[] = [];
    for (const f of graph.keys()) {
      for (const spec of importsOf(f)) {
        const r = resolveSpec(f, spec);
        if (r && WITHDRAWN.includes(noExt(r))) offenders.push(`${rel(f)} -> ${spec}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});

const ROUTES = [
  'app/api/generator-oracle/diagnose/route',
  'app/api/generator-oracle/fault-code/route',
  'app/api/generator-oracle/search/route',
  'app/api/generator-oracle/ai-diagnose/route',
  'app/api/generator-oracle/expert-chat/route',
  'app/api/generator-oracle/ai-visual-diagnose/route',
  'app/api/ai/chat/route',
  'app/api/ai/diagnose/route',
];
const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'] as const;

describe('Oracle safety withdrawal 2026-11-25: withdrawn API routes answer 503 before any work', () => {
  it('the shared notice is the exact management wording', () => {
    expect(ORACLE_SAFETY_WITHDRAWN_MESSAGE).toBe(NOTICE);
  });
  for (const r of ROUTES) {
    it(`${r}: every method returns 503 { error: 'temporarily_unavailable', message: notice }`, async () => {
      const mod = (await import(/* @vite-ignore */ pathToFileURL(path.join(ROOT, `${r}.ts`)).href)) as Record<string, (req: Request) => Promise<Response>>;
      for (const m of METHODS) {
        expect(typeof mod[m], `${r} ${m}`).toBe('function');
        const body = m === 'GET' || m === 'HEAD' ? undefined : JSON.stringify({ symptoms: ['low oil pressure'], query: 'SPN 100 FMI 1', message: 'engine knocking', readings: { oilPressure: 10 } });
        const res = await mod[m](new Request(`http://localhost/${r.replace(/^app\//, '').replace(/\/route$/, '')}?code=SPN%20100%20FMI%201&q=overheating`, { method: m, body, headers: { 'content-type': 'application/json' } }));
        expect(res.status, `${r} ${m}`).toBe(503);
        expect(res.headers.get('cache-control')).toBe('no-store');
        expect(await res.json()).toEqual({ error: 'temporarily_unavailable', message: NOTICE });
      }
    });
    it(`${r}: imports nothing but the withdrawal helper`, () => {
      const file = resolveSpec(path.join(ROOT, 'x.ts'), `@/${r}`)!;
      expect(importsOf(file)).toEqual(['@/lib/generator-oracle/safety/withdrawal']);
    });
  }
});

describe('Oracle safety withdrawal 2026-11-25: screens', () => {
  const mod = fs.readFileSync('components/generator-oracle/GeneratorOracleModule.tsx', 'utf8');
  it('the default Fault Center sub-tab is Guided Diagnosis, and Fault Center is the default screen', () => {
    expect(mod).toMatch(/useState<'guided' \| 'lookup' \| 'analysis' \| 'troubleshoot'>\('guided'\)/);
    expect(mod).toMatch(/'command' \| 'ai' \| 'faults' \| 'systems' \| 'controllers' \| 'wiring' \| 'monitoring' \| 'tools' \| 'service'\s*>\('faults'\)/);
    expect(mod).toMatch(/faultsSubTab === 'guided' && <GuidedDiagnosisPanel \/>/);
  });
  it('every withdrawn tab renders the shared notice', () => {
    expect(mod).toMatch(/<OracleSafetyWithdrawnNotice surface=\{`diagnostic-assistant-\$\{aiSubTab\}`\} \/>/);
    for (const s of ['fault-code-lookup', 'worked-example', 'interactive-troubleshoot', 'tech-input', 'interactive-diagnostic-system']) expect(mod).toContain(`<OracleSafetyWithdrawnNotice surface="${s}" />`);
    const wiring = fs.readFileSync('components/generator-oracle/panels/WiringDiagramsPanel.tsx', 'utf8');
    expect(wiring).toContain('<OracleSafetyWithdrawnNotice surface="wiring-diagnostics-flows" />');
    expect(wiring).not.toMatch(/DIAGNOSTIC_TROUBLESHOOTING\s*[:=[.]/);
    const manuals = fs.readFileSync('components/generator-oracle/panels/ControllerRepairManualsPanel.tsx', 'utf8');
    expect(manuals).toContain('<OracleSafetyWithdrawnNotice surface="repair-manuals-procedures" />');
    expect(manuals).toContain('<OracleSafetyWithdrawnNotice surface="repair-manuals-common-faults" />');
    const gens = fs.readFileSync('app/generators/GeneratorsPageClient.tsx', 'utf8');
    expect(gens).toContain('<OracleSafetyWithdrawnNotice surface="generators-visual-checklist" />');
    const notice = fs.readFileSync('components/generator-oracle/OracleSafetyWithdrawnNotice.tsx', 'utf8');
    expect(notice).toContain('{ORACLE_SAFETY_WITHDRAWN_MESSAGE}');
  });
  it('the Technician Assistant keeps its own notice text', () => {
    expect(mod).toContain("Technician Assistant is temporarily unavailable while safety checks are being updated. Please consult the applicable OEM service manual and a qualified technician.");
  });
});

const LINE = 'Generator Oracle cannot confirm a set is safe to run. A STOP from Guided Diagnosis is kept only in this browser — record it on this card. Do not test-run a set with an unresolved STOP.';

describe('Oracle safety withdrawal 2026-11-25: job card carries the STOP line', () => {
  type Pdfjs = typeof import('pdfjs-dist/legacy/build/pdf.mjs');
  let pdfjs: Pdfjs;
  beforeAll(async () => {
    pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')).href;
  });
  const run = (s: ServiceState, ...acts: ServiceAction[]) => acts.reduce(reduce, s);
  const s = run(emptyState(),
    { type: 'saveAsset', asset: { make: 'TEST', model: 'T-100', engine: 'TEST-ENG', controller: 'TEST-CTRL', serial: 'S-1', ratedKva: 100 } },
    { type: 'openCard', card: { assetId: 'A-1', opened: '2026-11-25', reportedFault: 'TEST knocking', faultCodes: [], technician: 'TECH-A' } });
  const card: JobCard = s.jobCards[0];
  const asset: Asset = s.assets[0];

  it('the wording is exact', () => expect(STOP_NOT_CARRIED_NOTICE).toBe(LINE));
  it('the .txt report has it right under the title', () => {
    const lines = jobCardReport(card, asset).split('\n');
    expect(lines[1]).toBe(`SAFETY: ${LINE}`);
  });
  it('the PDF has it', async () => {
    const doc = await pdfjs.getDocument({ data: jobCardToPdf(card, asset).slice() }).promise;
    const text = (await (await doc.getPage(1)).getTextContent()).items.map((i) => ('str' in i ? i.str : '')).join(' ').replace(/\s+/g, ' ');
    expect(text).toContain(LINE);
  });
  it('the job-card screen shows it at the top', () => {
    const panel = fs.readFileSync('components/generator-oracle/panels/ServiceManagementPanel.tsx', 'utf8');
    expect(panel).toMatch(/<div className="space-y-4 min-w-0">\s*\{\/\*[^*]*\*\/\}\s*<p role="note" data-testid="stop-not-carried-notice"[^>]*>\s*<strong>Safety\.<\/strong> \{STOP_NOT_CARRIED_NOTICE\}/);
  });
});
