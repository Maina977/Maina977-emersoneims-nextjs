/**
 * Content-safety withdrawal 2026-11-25 — /faults/[code] (audit F-W1..F-W4),
 * the /faults index copy, and /faults/engine/[brand] staying unpublished (E-W1).
 *
 * Every marker below was present in exactly one source file under app/,
 * components/ or lib/ at 4c2a6ee5 and is now absent from the data that renders
 * the page, from its HowTo / FAQPage JSON-LD and from its metadata.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { render } from '@testing-library/react';
import { FAULT_CODES } from '@/lib/data/faultCodes';
import { FMI_BY_SPN } from '@/lib/data/faultFmi';
import {
  FAULT_CONTENT_WITHDRAWN,
  buildFaultFaqPage,
  buildFaultHowTo,
} from '@/lib/faults/faultPageSchema';
import { CONTENT_SAFETY_WITHDRAWN_MESSAGE } from '@/lib/safety/contentWithdrawal';

const ROOT = path.resolve(__dirname, '../../..');
const src = (rel: string) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

/** code -> markers withdrawn from that code's description / steps / FAQs. */
export const FAULT_MARKERS: Record<string, string[]> = {
  'SPN-190': ['typically 10-15% above rated speed', 'Test load bank to verify proper load transfer and control'],
  'SPN-100': [
    'Install mechanical oil pressure gauge to verify actual pressure',
    'Replace oil pressure sensor if mechanical gauge shows normal pressure',
    'Verify with a mechanical gauge. If actual pressure is low',
  ],
  'SPN-110': ['Verify cooling fan operation and proper belt tension', 'Test water pump for proper flow and impeller condition'],
  'SPN-157': ['1,600-2,000+ bar', 'max 80ml/min per injector', 'More than 80ml per minute indicates a leaking injector'],
  'DSE-FAIL-TO-START': ['minimum 24V for cranking', 'typically allow 3 start attempts before locking out'],
  'DSE-UNDERSPEED': ['typically set 5-10% below rated speed'],
  'DSE-LOW-OIL-PRESSURE': [
    'Install mechanical pressure gauge to verify actual pressure',
    'If gauge shows good pressure, replace oil pressure sensor',
    'verify with a mechanical gauge before condemning the engine',
    '30-60 PSI',
  ],
  'DSE-LOW-FUEL-LEVEL': ['20% warning and 10% shutdown', '+/-5% of tank capacity', 'Inspect tank for leaks or damage', 'Check fuel lines for leaks'],
  'DSE-HIGH-COOLANT-TEMPERATURE': ['Verify cooling fan operates when engine is hot', '102-108'],
  'DSE-EMERGENCY-STOP': ['Locate and reset all emergency stop buttons', 'The emergency stop must be reset'],
  'DSE-GENERATOR-OVER-VOLTAGE': ['220V/380V +/-5%', '361V to 399V'],
  'COMAP-LOW-OIL-PRESSURE': ['while the engine keeps running', 'Compare oil pressure to mechanical gauge', 'Listen for unusual bearing noise'],
  'COMAP-OVERSPEED': ['115% of rated speed - 1725 RPM', 'Test governor response with InteliConfig'],
  'COMAP-HIGH-COOLANT-TEMPERATURE': ['typically 100-105 deg C'],
  'COMAP-START-FAIL': ['typically 3 start attempts with a configurable pause'],
  'COMAP-GENERATOR-OVER-FREQUENCY': ['+/-0.5Hz under stable load', 'sustained operation above 52Hz'],
  'PERKINS-110': ['102-108'],
  'PERKINS-100': ['Install mechanical pressure gauge', 'If gauge shows good pressure, replace sensor', 'Shutdown occurs below 10-15 PSI'],
  'DSE-REVERSE-POWER': ['5-15% of rated power'],
  'DSE-EARTH-FAULT': ['Disconnect loads and check if fault clears', '1 megohm per kV'],
  'COMAP-LOW-BATTERY-VOLTAGE': ['should not drop below 18V', 'below 80% of rated'],
  'COMAP-SPEED-SIGNAL-LOST': ['typically 100-1000 ohms'],
  'PERKINS-190': ['Test governor response with EST'],
};

/** Codes whose whole step list was withdrawn: no steps, no HowTo. */
const STEPS_EMPTIED = [
  'SPN-190', 'SPN-100', 'DSE-LOW-OIL-PRESSURE', 'DSE-EMERGENCY-STOP', 'COMAP-LOW-OIL-PRESSURE',
  'COMAP-OVERSPEED', 'PERKINS-100', 'DSE-EARTH-FAULT', 'PERKINS-190',
];
/** Codes whose whole FAQ list was withdrawn: no FAQ, no FAQPage. */
const FAQ_EMPTIED = ['DSE-LOW-OIL-PRESSURE', 'DSE-GENERATOR-OVER-VOLTAGE', 'COMAP-GENERATOR-OVER-FREQUENCY', 'COMAP-LOW-BATTERY-VOLTAGE'];

/** Marker -> the one source file it was in at 4c2a6ee5 (page/template copy). */
export const FAULT_FILE_MARKERS: Record<string, string[]> = {
  'lib/data/faultFmi.ts': [
    'then confirm the real pressure with a mechanical gauge before any restart',
    'a mechanical gauge reading at idle and at rated speed',
    'Confirm the actual pressure with a mechanical gauge before replacing parts',
  ],
  'app/faults/[code]/page.tsx': [
    'the steps to clear the fault',
    'how to diagnose it, and the steps to clear it',
    'with troubleshooting steps, in Generator Oracle',
    'Launch Generator Oracle',
    'How to Fix the ${fault.brand}',
  ],
  'components/repair-centre/FaultCodeRepairLinks.tsx': [
    'ordered steps with the reading',
    'These tell you what to do next',
  ],
  'app/faults/page.tsx': ['the likely causes, and how to fix it'],
  // Cross-cutting rules applied beyond the audited pages: reset-first e-stop
  // and gauge-after-low-oil-pressure on /solutions/controls.
  'app/solutions/controls/page.tsx': [
    'Release E-Stop, reset alarm, check for actual emergency',
    'verify with mechanical gauge, check sensor wiring',
  ],
};

const fault = (code: string) => {
  const f = FAULT_CODES.find((x) => x.code === code);
  if (!f) throw new Error(`no fault ${code}`);
  return f;
};

async function metaText(code: string): Promise<string> {
  const page = await import('@/app/faults/[code]/page');
  const m = await page.generateMetadata({ params: Promise.resolve({ code: code.toLowerCase() }) });
  return JSON.stringify(m);
}

export function registerFaultsTests(): void {
  describe('/faults/[code]: withdrawn C content is gone from data, JSON-LD and metadata', () => {
    for (const [code, markers] of Object.entries(FAULT_MARKERS)) {
      it(`${code}`, async () => {
        const f = fault(code);
        const data = JSON.stringify(f);
        const howTo = JSON.stringify(buildFaultHowTo(f));
        const faq = JSON.stringify(buildFaultFaqPage(f));
        const meta = await metaText(code);
        for (const m of markers) {
          expect(data, `${code} data: ${m}`).not.toContain(m);
          expect(howTo, `${code} HowTo: ${m}`).not.toContain(m);
          expect(faq, `${code} FAQPage: ${m}`).not.toContain(m);
          expect(meta, `${code} metadata: ${m}`).not.toContain(m);
        }
        expect(FAULT_CONTENT_WITHDRAWN[code], `${code} is flagged for the notice`).toBeTruthy();
      });
    }

    it('codes with every step withdrawn have no steps and emit no HowTo', () => {
      for (const code of STEPS_EMPTIED) {
        expect(fault(code).troubleshootingSteps, code).toEqual([]);
        expect(buildFaultHowTo(fault(code)), code).toBeNull();
      }
    });

    it('codes with every FAQ withdrawn emit no FAQPage', () => {
      for (const code of FAQ_EMPTIED) {
        expect(fault(code).faqQuestions, code).toEqual([]);
        expect(buildFaultFaqPage(fault(code)), code).toBeNull();
      }
    });

    it('HowTo and FAQPage mirror exactly what the page shows', () => {
      for (const f of FAULT_CODES) {
        const h = buildFaultHowTo(f) as { step: { text: string }[]; name: string } | null;
        if (f.troubleshootingSteps.length === 0) expect(h).toBeNull();
        else {
          expect(h!.step.map((s) => s.text)).toEqual(f.troubleshootingSteps);
          expect(h!.name).not.toMatch(/How to Fix/);
        }
        const q = buildFaultFaqPage(f) as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] } | null;
        if (f.faqQuestions.length === 0) expect(q).toBeNull();
        else expect(q!.mainEntity.map((e) => [e.name, e.acceptedAnswer.text])).toEqual(f.faqQuestions.map((x) => [x.question, x.answer]));
      }
    });

    it('no fault page meta description promises steps to clear the fault', async () => {
      for (const f of FAULT_CODES) {
        const meta = await metaText(f.code);
        expect(meta, f.code).not.toMatch(/steps to clear|how to diagnose it/);
        const d = String(JSON.parse(meta).description);
        expect(d.length, f.code).toBeLessThanOrEqual(156);
        expect(d, f.code).toMatch(/(\.|…)$/);
      }
    });

    it('/faults/spn-157 social description no longer carries the bar figure', async () => {
      const page = await import('@/app/faults/[code]/page');
      const m = await page.generateMetadata({ params: Promise.resolve({ code: 'spn-157' }) });
      expect(String(m.openGraph?.description)).not.toContain('bar)');
      expect(String(m.openGraph?.description)).not.toContain('2,000');
    });

    it('SPN-100 FMI table: withdrawn first checks and note are gone; FMI 1 keeps the stop', () => {
      const spn100 = FMI_BY_SPN['SPN-100'];
      // Low-pressure entries (FMI 1, 17, 18) and the note carry no gauge-running
      // check. FMI 0 (pressure HIGH, not a lubrication STOP) is B and stays.
      const low = spn100.entries.filter((e) => [1, 17, 18].includes(e.fmi));
      expect(JSON.stringify(low)).not.toMatch(/mechanical gauge/);
      expect(spn100.note).toBeUndefined();
      expect(spn100.entries.find((e) => e.fmi === 18)!.firstCheck).toBeUndefined();
      expect(spn100.entries.find((e) => e.fmi === 1)!.firstCheck).toBe('Stop the engine. Check the oil level.');
    });

    it('the rendered page shows the notice where content was withdrawn, and no HowTo script', async () => {
      const page = await import('@/app/faults/[code]/page');
      const el = await page.default({ params: Promise.resolve({ code: 'dse-emergency-stop' }) });
      const { container } = render(el);
      const html = container.innerHTML;
      expect(html).toContain(CONTENT_SAFETY_WITHDRAWN_MESSAGE);
      expect(html).not.toContain('"@type":"HowTo"');
      expect(html).not.toContain('Locate and reset all emergency stop buttons');
      expect(html).not.toContain('Troubleshooting Steps');
      expect(html).not.toContain('/repair-centre/controllers/controller-alarm-interpretation');
      // FAQ[1] (the N/C wiring fact) stays, in the page and in the FAQPage.
      expect(html).toContain('"@type":"FAQPage"');
    });

    it('a page with only some steps withdrawn keeps the rest plus the notice', async () => {
      const page = await import('@/app/faults/[code]/page');
      const el = await page.default({ params: Promise.resolve({ code: 'spn-110' }) });
      const { container } = render(el);
      const html = container.innerHTML;
      expect(html).toContain('Troubleshooting Steps');
      expect(html).toContain(CONTENT_SAFETY_WITHDRAWN_MESSAGE);
      expect(html).toContain('"@type":"HowTo"');
      expect(html).not.toContain('Test water pump for proper flow');
    });
  });

  describe('/faults page copy and links', () => {
    for (const [file, markers] of Object.entries(FAULT_FILE_MARKERS)) {
      it(`${file}: withdrawn copy is absent from source`, () => {
        const text = src(file);
        for (const m of markers) expect(text, `${file}: ${m}`).not.toContain(m);
      });
    }

    it('FaultCodeRepairLinks no longer links any fault category to a withdrawn guide', async () => {
      const mod = await import('@/components/repair-centre/FaultCodeRepairLinks');
      const all = Object.values(mod.CATEGORY_TO_GUIDES).flat();
      for (const slug of mod.WITHDRAWN_GUIDE_SLUGS) expect(all).not.toContain(slug);
      for (const f of FAULT_CODES) {
        const { container, unmount } = render(<mod.default category={f.category} code={f.code} />);
        for (const slug of mod.WITHDRAWN_GUIDE_SLUGS) expect(container.innerHTML, `${f.code}: ${slug}`).not.toContain(slug);
        unmount();
      }
    });
  });

  describe('/faults/engine/[brand] stays unpublished (E-W1)', () => {
    it('next.config.ts keeps the permanent redirect to /faults', () => {
      const cfg = src('next.config.ts');
      expect(cfg).toMatch(/\{\s*source:\s*'\/faults\/engine\/:brand',\s*destination:\s*'\/faults',\s*permanent:\s*true\s*\}/);
    });

    it('the redirect is returned by the Next config', async () => {
      const cfg = (await import('@/next.config')).default as { redirects?: () => Promise<{ source: string; destination: string; permanent: boolean }[]> };
      const redirects = await cfg.redirects!();
      const r = redirects.find((x) => x.source === '/faults/engine/:brand');
      expect(r).toBeTruthy();
      expect(r!.destination).toBe('/faults');
      expect(r!.permanent).toBe(true);
    });

    it('the sitemap lists no /faults/engine/ URL', async () => {
      const sitemap = (await import('@/app/sitemap')).default;
      const urls = (await sitemap()).map((e) => e.url);
      expect(urls.filter((u) => u.includes('/faults/engine/'))).toEqual([]);
    }, 60000);
  });
}
