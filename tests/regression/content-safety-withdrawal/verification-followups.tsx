/**
 * Content-safety withdrawal 2026-11-25 — follow-ups from the independent
 * verification of e39f5a5c (CONTENT-WITHDRAWAL-VERIFICATION.md, items B1-B3).
 *
 * Every marker was in exactly one source file under app/, components/ or lib/
 * at 4c2a6ee5 and is now absent from it, from the page data and from the
 * structured data the page emits.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { render } from '@testing-library/react';
import { getRepairArticle } from '@/lib/repair-centre';
import { buildRepairArticleJsonLd } from '@/lib/repair-centre/schema';
import GeneratorOracleSEO from '@/components/seo/GeneratorOracleSEO';
import ControlsLayout from '@/app/solutions/controls/layout';
import { CONTENT_SAFETY_WITHDRAWN_MESSAGE } from '@/lib/safety/contentWithdrawal';

const ROOT = path.resolve(__dirname, '../../..');
const src = (rel: string) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

export const FOLLOWUP_MARKERS: Record<string, string[]> = {
  'lib/repair-centre/articles/generator-low-oil-pressure-shutdown.ts': [
    'Can I just top it up and return the set to service',
    'Top it up, yes, but find out where the oil went',
  ],
  'components/seo/GeneratorOracleSEO.tsx': [
    'Generator Oracle provides detailed diagnostic steps for each cause',
    'clear fault codes and run the generator',
    'Follow the step-by-step repair guide provided',
    'Enter the fault code into Generator Oracle',
    'Step-by-Step Repair Guides',
    'Controller alarm lookup for 10 controller brands',
    'identifying fault codes, and providing repair guidance',
  ],
  'app/solutions/controls/page.tsx': [
    'verify temp with IR gun, check fan operation',
    'verify speed with tachometer, check sensor gap',
    "action: 'Check coolant, thermostat, fan, water pump'",
    "action: 'Check oil level, filter, pump, pressure sender'",
    "action: 'Check governor, fuel system, speed sensor'",
  ],
  'app/solutions/controls/layout.tsx': [
    'battery voltage (>24V), fuel supply, starter motor, speed sensing',
    'Reset and retry after checking these items',
  ],
};

export function registerVerificationFollowupTests(): void {
  describe('verification follow-ups B1-B3', () => {
    for (const [file, markers] of Object.entries(FOLLOWUP_MARKERS)) {
      it(`${file}: withdrawn text is absent from source`, () => {
        const text = src(file);
        for (const m of markers) expect(text, `${file}: ${m}`).not.toContain(m);
      });
    }

    it('B1: the top-up Q&A is gone from the article and its FAQPage', () => {
      const a = getRepairArticle('generator-low-oil-pressure-shutdown')!;
      const ld = JSON.stringify(buildRepairArticleJsonLd(a, 'https://www.emersoneims.com/x'));
      for (const m of FOLLOWUP_MARKERS['lib/repair-centre/articles/generator-low-oil-pressure-shutdown.ts']) {
        expect(JSON.stringify(a)).not.toContain(m);
        expect(ld).not.toContain(m);
      }
      expect(a.faq.some((f) => /top it up/i.test(f.q + f.a))).toBe(false);
    });

    it('B2: /generator-oracle emits no FAQPage or HowTo from GeneratorOracleSEO, for any pageType', () => {
      for (const pageType of ['home', 'diagnostic', 'faq', 'guide'] as const) {
        const { container, unmount } = render(<GeneratorOracleSEO pageType={pageType} />);
        const html = container.innerHTML;
        expect(html, pageType).not.toContain('"@type":"FAQPage"');
        expect(html, pageType).not.toContain('"@type":"HowTo"');
        expect(html, pageType).not.toMatch(/fault code|repair guid|overheat/i);
        expect(html, pageType).toContain('"@type":"SoftwareApplication"');
        unmount();
      }
    });

    it('B3: /solutions/controls FAQPage no longer carries the battery threshold or reset-and-retry', () => {
      const { container } = render(<ControlsLayout>{null}</ControlsLayout>);
      const html = container.innerHTML;
      expect(html).toContain('"@type":"FAQPage"');
      for (const m of FOLLOWUP_MARKERS['app/solutions/controls/layout.tsx']) expect(html).not.toContain(m);
    });

    it('B3: the withdrawn fault-table actions show the notice text', () => {
      const text = src('app/solutions/controls/page.tsx');
      for (const code of ["'01'", "'02'", "'03'", "'06'", "'E014'", "'E015'", "'E016'"]) {
        const line = text.split('\n').find((l) => l.includes(`code: ${code},`))!;
        expect(line, code).toContain('action: CONTENT_SAFETY_WITHDRAWN_MESSAGE');
      }
      expect(CONTENT_SAFETY_WITHDRAWN_MESSAGE).toMatch(/qualified technician/);
    });
  });
}
