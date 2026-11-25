/**
 * Content-safety withdrawal 2026-11-25 — Group 3 (/services generator pages,
 * also the same GEN_QA copy on /diagnostics), /technical-bible and
 * /knowledge-base. Registered by
 * tests/regression/content-safety-withdrawal-2026-11-25.test.ts.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { getServiceDiagnostics } from '@/lib/services/serviceDiagnostics';
import { getServiceBible } from '@/lib/services/serviceBibles';
import { getServiceBySlug } from '@/lib/services/allServices';
import {
  SAMPLE_SCHEMATICS,
  TROUBLESHOOTING_TREES,
  REPAIR_PROCEDURES,
  MAINTENANCE_SCHEDULES,
} from '@/lib/technical/technicalBible';
import { CONTENT_SAFETY_WITHDRAWN_MESSAGE } from '@/lib/safety/contentWithdrawal';

const ROOT = path.resolve(__dirname, '../../..');
const src = (rel: string) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

const GEN_SLUGS = ['cummins-generators', 'generator-repairs', 'ats-changeover'] as const;

/** S-W1 / S-W2 offending text, also republished verbatim on /diagnostics. */
const GEN_QA_MARKERS = [
  '12.5V+',
  '2.5–3.5 PSI',
  '2.5-3.5 PSI',
  'Stop if below 20 PSI',
  'Low oil pressure warning?',
  'Generator overheating?',
];

/** S-W4 (C6-C24) offending text in GENERATOR_BIBLE. */
const BIBLE_MARKERS = [
  'will derate to ~90 kVA',
  'inlet area ≥ radiator face area × 1.5',
  'Earth resistance ≤ 5 Ω is enough for general',
  '5-minute no-load run',
  'load-bank ≥ 30% of nameplate for 30 minutes',
  'plinth ≥ 1.5 × wet weight',
  'full-load current × 1.25 + voltage drop',
  'Inlet free area ≥ radiator face × 1.5',
  'No-load run 30 minutes',
  'Load-bank to 100% nameplate for 1 hour',
  'Step-load test 25 / 50 / 75 / 100%',
  'typically 18–22 Nm',
  'replace when ΔP > 100 kPa',
  'capacity < 80%',
  'Confirm cranking RPM ≥ 150',
  'replace if > 6 kPa',
  'once below 60 °C',
  '(82 / 88 °C typical)',
  'typically 220–240 V single phase',
  'should be < 0.5 V at engagement',
  'where it falls over tells you which subsystem is limiting',
  'Overheating at high load points at cooling',
  'Replace sender if reading conflicts with manual gauge',
  'Verify ECU calibration not corrupted',
  'Verify charger output 13.8–14.4 V at 12 V system',
  'Replace battery if < 80% capacity',
  'Reset and re-test under load',
  '≥ 1 MΩ/kV +1',
  'pressure-test 100 kPa for 10 minutes',
  'connections at 80% load',
];

/** S-W5 (C25-C27) in BibleDiagrams.tsx and S-W6 (C28) in the AMF table. */
const DIAGRAM_MARKERS = [
  'below 82 °C bypass returns to pump',
  'pressure cap 90–110 kPa',
  'Coolant pH 8.5–10.5',
  '(typically 10–30 s)',
  'Sense voltage 80–110% nominal',
  'Earth resistance target ≤ 1 Ω',
];
const AMF_MARKERS = ["'Typical range'", "'1–5 s'", "'5–30 s'", "'0.5–2 s'", "'10–60 s'", "'60–300 s'"];

export function registerServicesBibleKbTests(): void {
  describe('Group 3: /services generator pages (S-W1..S-W7)', () => {
    it.each(GEN_SLUGS)('%s: GEN_QA C items and fixed gauges withdrawn (S-W1, S-W2)', (slug) => {
      const d = getServiceDiagnostics(slug)!;
      expect(d).toBeTruthy();
      const text = JSON.stringify(d);
      for (const m of GEN_QA_MARKERS) expect(text, m).not.toContain(m);
      expect(d.gauges).toEqual([]);
      // A items kept verbatim.
      expect(d.qaPairs.map((q) => q.q)).toEqual([
        'Generator fails to start?',
        'Generator starts but stops immediately?',
        'No power output?',
        'Excessive black smoke?',
      ]);
    });

    it('no "Live Telemetry" heading renders when a page has no gauges', () => {
      const panel = src('components/services/ServiceDiagnosticsPanel.tsx');
      expect(panel).toMatch(/diagnostics\.gauges\.length > 0 && \(/);
    });

    it('deep links: no Repair Manual / Error Codes, and no #bible-* anchors where there is no bible (S-W3)', () => {
      for (const slug of GEN_SLUGS) {
        const links = getServiceDiagnostics(slug)!.deepLinks;
        expect(links.map((l) => l.href)).not.toContain('#bible-repair');
        expect(links.map((l) => l.href)).not.toContain('#bible-errors');
        if (!getServiceBible(slug)) {
          expect(links.some((l) => l.href.startsWith('#bible')), slug).toBe(false);
        }
      }
    });

    it('GENERATOR_BIBLE C items withdrawn (S-W4, C6-C24)', () => {
      const bible = getServiceBible('cummins-generators')!;
      expect(bible).toBeTruthy();
      const text = JSON.stringify(bible);
      for (const m of BIBLE_MARKERS) expect(text, m).not.toContain(m);
      // Withdrawn entries show the notice, not their steps.
      const loadBank = bible.repairManual.find((r) => r.fault === 'Set will not deliver rated output on load bank')!;
      expect(loadBank.steps).toEqual([CONTENT_SAFETY_WITHDRAWN_MESSAGE]);
      const spn190 = bible.errorCodes.find((e) => e.code === 'SPN 190 / FMI 0')!;
      expect(spn190.fix).toEqual([CONTENT_SAFETY_WITHDRAWN_MESSAGE]);
      // A content kept: the STOP-first E-stop entry is unchanged.
      expect(text).toContain('Identify which device latched before resetting anything');
    });

    it('diagram captions and the AMF timer table carry no unsourced figures (S-W5, S-W6)', () => {
      const diagrams = src('components/services/BibleDiagrams.tsx');
      for (const m of DIAGRAM_MARKERS) expect(diagrams, m).not.toContain(m);
      const amf = src('components/solutions/ControlsEngineeringDeepDive.tsx');
      for (const m of AMF_MARKERS) expect(amf, m).not.toContain(m);
    });

    it.each(GEN_SLUGS)('%s: Service/FAQPage JSON-LD sources carry none of the withdrawn text (S-W7)', (slug) => {
      const svc = getServiceBySlug(slug)!;
      expect(svc).toBeTruthy();
      const ldSource = JSON.stringify({
        name: svc.name,
        description: svc.description,
        faqs: svc.faqs,
        pricingTiers: (svc as unknown as Record<string, unknown>).pricingTiers,
        metaTitle: svc.metaTitle,
        metaDescription: svc.metaDescription,
      });
      for (const m of [...GEN_QA_MARKERS, ...BIBLE_MARKERS, ...DIAGRAM_MARKERS]) {
        expect(ldSource, m).not.toContain(m);
      }
    });

    it('/diagnostics carries the same GEN_QA withdrawal (same text, same rule)', () => {
      const page = src('app/diagnostics/page.tsx');
      for (const m of GEN_QA_MARKERS) expect(page, m).not.toContain(m);
      expect(page).not.toContain("{ label: 'Oil Pressure', value: 45, max: 80, unit: 'PSI', color: '#00ff00' }");
      expect(page).toMatch(/selectedService\.gauges\.length > 0 && \(/);
    });
  });

  describe('/technical-bible (TK-W1..TK-W5)', () => {
    it('starter-circuit notes keep only the isolation note (TK-W1)', () => {
      const s = SAMPLE_SCHEMATICS.find((x) => x.id === 'gen-starter-circuit')!;
      expect(s.notes).toEqual(['Always disconnect battery negative before working on starting circuit']);
      const text = JSON.stringify(SAMPLE_SCHEMATICS);
      expect(text).not.toContain('minimum 24V for proper operation');
      expect(text).not.toContain('disengage within 0.5 seconds');
    });

    it('gen-no-start tree (e-stop reset first, 24V threshold, compression crank) is withdrawn (TK-W2)', () => {
      expect(TROUBLESHOOTING_TREES.find((t) => t.id === 'gen-no-start')).toBeUndefined();
      expect(TROUBLESHOOTING_TREES.some((t) => t.serviceId === 'diesel-generators')).toBe(false);
      const text = JSON.stringify(TROUBLESHOOTING_TREES);
      expect(text).not.toContain('Is battery voltage above 24V');
      expect(text).not.toContain('Twist clockwise or pull out to release');
      expect(text).not.toContain('solution-compression');
    });

    it('fuel-filter change: steps 11-12 and the full-load test withdrawn; Hub shows the notice (TK-W3)', () => {
      const p = REPAIR_PROCEDURES.find((r) => r.id === 'gen-fuel-filter-change')!;
      expect(p.steps.map((s) => s.stepNumber)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect(p.testProcedure).toBeUndefined();
      const text = JSON.stringify(p);
      expect(text).not.toContain('let it run for several minutes');
      expect(text).not.toContain('Generator should carry full load smoothly');
      expect(text).not.toContain('Run generator at full rated load for 15 minutes');
      const hub = src('components/technical/TechnicalBibleHub.tsx');
      expect(hub).toContain('surface="technical-bible-repair-test-procedure"');
    });

    it('daily check: the test start after a leak check is withdrawn (TK-W4)', () => {
      const text = JSON.stringify(MAINTENANCE_SCHEDULES);
      expect(text).not.toContain('Test start the generator if not in use');
    });

    it('layout description no longer promises fault trees; title unchanged (TK-W5)', async () => {
      const { metadata } = await import('@/app/technical-bible/layout');
      expect(String(metadata.description)).not.toContain('fault trees');
      expect(metadata.title).toBe('Technical Bible | Engineering Reference');
    });
  });

  describe('/knowledge-base (KB-W1)', () => {
    it('gen-maintenance-schedule: weekly loaded run and running noise check withdrawn, notice in place', () => {
      const page = src('app/knowledge-base/page.tsx');
      expect(page).not.toContain('Run generator for 30 minutes under load');
      expect(page).not.toContain('Check for unusual noises or vibrations');
      expect(page).toContain('- ${CONTENT_SAFETY_WITHDRAWN_MESSAGE}');
      // A content kept verbatim.
      expect(page).toContain('- [ ] Check coolant level (when cold)');
    });
  });
}
