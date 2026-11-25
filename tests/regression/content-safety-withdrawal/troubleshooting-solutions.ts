/**
 * Content-safety withdrawal 2026-11-25 — /troubleshooting (T-W1..T-W15) and
 * /solutions/generators (SG-W1..SG-W6). Registered by
 * tests/regression/content-safety-withdrawal-2026-11-25.test.ts.
 *
 * Every marker below was present in exactly one source file at 4c2a6ee5 and
 * must now be absent from that file and from the JSON-LD the route emits.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { buildGeneratorSolutionsJsonLd } from '@/lib/solutions/generatorsSchema';
import { FAULT_CODES } from '@/lib/data/faultCodes';

const root = path.resolve(__dirname, '../../..');
const read = (rel: string) => fs.readFileSync(path.join(root, rel), 'utf8');

const TROUBLESHOOTING = 'app/troubleshooting/page.tsx';
const SOLUTIONS_PAGE = 'app/solutions/generators/page.tsx';
const SOLUTIONS_LAYOUT = 'app/solutions/generators/layout.tsx';
const DEEP_DIVE = 'components/solutions/GeneratorTroubleshootingDeepDive.tsx';

export const TROUBLESHOOTING_MARKERS: Record<string, string> = {
  'T-W1 charger volts': 'Check battery charger output (13.5-14.5V)',
  'T-W2 option label': 'Battery seems fine (12.6V+)',
  'T-W3 battery threshold': 'should read 12.6V+ when charged',
  'T-W4 e-stop reset first': 'Release emergency stop button by twisting/pulling',
  'T-W5 crank timing': 'Crank in short bursts (10 sec) with 30 sec rest',
  'T-W6 5-30 s result': "'Inspect sensors and connections', 'Review fault codes on display'",
  'T-W6 1-5 min result': "'Verify oil level and quality', 'Inspect for cooling system blockages'",
  'T-W7 cold-start figure 1': 'This is normal if it clears within 1-2 minutes',
  'T-W7 cold-start figure 2': 'Allow proper warm-up time (3-5 minutes)',
  'T-W8 dirty radiator result': "'Check cooling fan operation', 'Ensure adequate ventilation'",
  'T-W8 clean radiator result': "'Test thermostat operation', 'Check water pump flow'",
  'T-W9 low-voltage label': 'Low voltage (below 200V)',
  'T-W9 normal-voltage label': 'Normal voltage (220-240V)',
  'T-W9 live AVR adjust': 'Adjust AVR voltage setting if accessible',
  'T-W10 bearing noise run': 'Listen to turbo with stethoscope',
  'T-W11 restart after top-up': 'Do NOT restart until oil level correct',
  'T-W12 overspeed result': "'Inspect governor/actuator', 'Test speed sensor', 'Review load connection sequence'",
  'T-W13 coolant leak result': "'Replace failed hose or clamp', 'Repair/replace radiator'",
  'T-W14 withdrawn lookup': 'Use Our Diagnostic Suite for Detailed Analysis',
  'T-W14 unsupported claim': 'Our database covers all major controller brands',
  'T-W14 lookup pointer': 'Use Diagnostic Suite for fault codes',
  'T-W15 invented codes 1': "relatedCodes: ['E1010', 'BAT01']",
  'T-W15 invented codes 2': "relatedCodes: ['E360', 'E1030']",
};

export const SOLUTIONS_PAGE_MARKERS: Record<string, string> = {
  'SG-W1 insulation limit': '&gt;1MΩ @ 500V DC for LV',
  'SG-W1 lift pump figure': 'verify fuel lift pump pressure (2-5 PSI)',
  'SG-W1 cooling pressure': 'Pressure test cooling system: 1.0-1.4 bar',
  'SG-W1 room temperature': 'Room temperature should stay below 40°C',
  'SG-W1 backpressure': '3-4 kPa for naturally aspirated, 6-7 kPa for turbo',
  'SG-W1 protection settings': 'Overspeed 110%, undervoltage 85%, overcurrent 110%',
  'SG-W1 ATS timers': 'retransfer delay 5-30min',
  'SG-W2 daily battery volts': 'verify 12.6V+ (24V system: 25.2V+)',
  'SG-W2 belt deflection': '10-15mm deflection with 10kg force',
  'SG-W2 charger volts': 'Float 13.6V, Boost 14.4V',
  'SG-W2 compression variation': 'Test compression across all cylinders (variation &lt;10%)',
  'SG-W3 fuel pressure': 'Should be 2.5-4 bar (LP) or 200-2000 bar (HP)',
  'SG-W3 starter bypass': 'Apply direct power to starter solenoid',
  'SG-W3 oil pressure timing': 'Should reach 2 bar within 5 seconds',
  'SG-W3 mechanical gauge after LOP': 'oil pressure sensor may be faulty - verify with mechanical gauge',
  'SG-W3 sensor gap': 'Check speed sensor gap: 0.5-1.0mm',
  'SG-W3 running overheat check': 'Feel radiator: Top should be hot, bottom cooler',
  'SG-W3 load limit': 'Should not exceed 80% continuous',
  'SG-W3 voltage tolerance': 'Should be 380-415V ±5%',
  'SG-W3 earth leakage': 'Test earth leakage current (&lt;30mA for safety)',
  'SG-W3 charge volts': 'Should be 13.8-14.4V (27.6-28.8V for 24V)',
  'SG-W3 leak-back': 'Measure injector leak-back (max 100ml/min total)',
  'SG-W3 water content': 'Water content &lt;200ppm acceptable',
  'SG-W3 knocking run': 'Listen with stethoscope to isolate location',
  'SG-W3 exhaust spread': 'Monitor exhaust temperature per cylinder (should be ±30°C)',
  'SG-W4 AVR live adjust': 'Adjust voltage potentiometer to achieve 400-415V',
  'SG-W4 HP line torque': 'Reconnect high-pressure lines: 25-35 Nm',
  'SG-W4 pump bolt torque': 'Torque bolts in sequence: 15-25 Nm typically',
  'SG-W4 shaft play': 'Radial &lt;0.1mm, Axial &lt;0.15mm',
  'SG-W4 droop': 'Set droop percentage: 3-5% for most applications',
  'SG-W4 recovery time': 'Observe frequency recovery time (&lt;5 seconds)',
};

export const DEEP_DIVE_MARKERS: Record<string, string> = {
  'SG-W5 latched-alarm reset': 'Mode in STOP / latched alarm',
};

export const SOLUTIONS_JSONLD_MARKERS: Record<string, string> = {
  'SG-W6 FAQ battery limit': 'it should be above 12.6V for 12V systems',
  'SG-W6 FAQ overheating, no STOP': 'Check coolant level first, then inspect radiator for blockages.',
  'SG-W6 HowTo pre-start checks': 'Essential daily checks before starting your generator',
  'SG-W6 OG description': 'fault codes & troubleshooting. 24/7 emergency service.',
};

export function registerTroubleshootingSolutionsTests(): void {
  describe('content-safety withdrawal: /troubleshooting (T-W1..T-W15)', () => {
    const src = read(TROUBLESHOOTING);
    for (const [id, marker] of Object.entries(TROUBLESHOOTING_MARKERS)) {
      it(`${id}: withdrawn text is absent`, () => {
        expect(src).not.toContain(marker);
      });
    }

    it('withdrawn results render the shared notice in place of steps', () => {
      expect(src).toContain("import SafetyChecksWithdrawnNotice from '@/components/safety/SafetyChecksWithdrawnNotice'");
      expect(src).toContain('<SafetyChecksWithdrawnNotice surface="troubleshooting-result" />');
      // T-W4, T-W6 x2, T-W8 x2, T-W10, T-W11, T-W12, T-W13
      expect(src.match(/withdrawn: true,/g)?.length).toBe(9);
      // the engineer contact stays on every result card
      expect(src).toContain('href="tel:+254768860665"');
    });

    it('T-W4: nothing tells the user to release or reset an e-stop', () => {
      expect(src).not.toMatch(/Release emergency stop/i);
      expect(src).not.toContain('Reset the control panel');
      expect(src).not.toContain('Check emergency stop button is released');
    });

    it('T-W15: no /faults/<code> link to a code that has no page', () => {
      const published = new Set(FAULT_CODES.map((f) => f.code));
      const codes = [...src.matchAll(/relatedCodes:\s*\[([^\]]*)\]/g)].flatMap((m) =>
        [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]),
      );
      expect(codes.filter((c) => !published.has(c))).toEqual([]);
      expect(src).not.toContain('/faults/${encodeURIComponent(code)}');
    });

    it('T-W14: the error-code node no longer points at the withdrawn lookup', () => {
      expect(src).not.toContain('Diagnostic Suite');
      expect(src).toContain("diagnosis: 'Send Us the Code'");
    });
  });

  describe('content-safety withdrawal: /solutions/generators (SG-W1..SG-W6)', () => {
    const page = read(SOLUTIONS_PAGE);
    const deepDive = read(DEEP_DIVE);
    const layout = read(SOLUTIONS_LAYOUT);
    const ld = JSON.stringify(buildGeneratorSolutionsJsonLd());

    for (const [id, marker] of Object.entries(SOLUTIONS_PAGE_MARKERS)) {
      it(`${id}: withdrawn text is absent from the page`, () => {
        expect(page).not.toContain(marker);
      });
    }
    for (const [id, marker] of Object.entries(DEEP_DIVE_MARKERS)) {
      it(`${id}: withdrawn row is absent from the deep dive`, () => {
        expect(deepDive).not.toContain(marker);
      });
    }
    for (const [id, marker] of Object.entries(SOLUTIONS_JSONLD_MARKERS)) {
      it(`${id}: withdrawn text is absent from the layout and its JSON-LD`, () => {
        expect(layout).not.toContain(marker);
        expect(ld).not.toContain(marker);
      });
    }

    it('SG-W3: only the black-smoke fault entry remains', () => {
      expect(page.match(/symptom: '/g)?.length).toBe(1);
      expect(page).toContain("symptom: 'Excessive black smoke'");
    });

    it('SG-W4: no repair procedure data remains', () => {
      expect(page).not.toContain('const REPAIR_PROCEDURES');
      expect(page).not.toContain('REPAIR_PROCEDURES.map');
    });

    it('SG-W3/SG-W4: the Faults and Repairs tabs show the shared notice', () => {
      expect(page).toContain('<SafetyChecksWithdrawnNotice surface="solutions-generators-faults" />');
      expect(page).toContain('surface="solutions-generators-repairs"');
    });

    it('SG-W6: JSON-LD drops the HowTo and the FAQPage (no visible FAQ on the page)', () => {
      const graph = buildGeneratorSolutionsJsonLd()['@graph'] as Array<Record<string, unknown>>;
      expect(graph.some((n) => n['@type'] === 'HowTo')).toBe(false);
      // Follow-up 2026-11-25: the FAQPage had no visible counterpart on
      // /solutions/generators, so the whole object was removed.
      expect(graph.some((n) => n['@type'] === 'FAQPage')).toBe(false);
      expect(graph.map((n) => n['@type'])).toEqual(['WebPage', 'BreadcrumbList', 'Service']);
      expect(layout).toContain('buildGeneratorSolutionsJsonLd()');
    });
  });
}
