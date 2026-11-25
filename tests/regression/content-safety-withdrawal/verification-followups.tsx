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

/** Second follow-up (coordinator, 2026-11-25): items the previous round flagged. */
export const FOLLOWUP2_MARKERS: Record<string, string[]> = {
  'lib/repair-centre/articles/generator-low-oil-pressure-shutdown.ts': [
    'Pressure is fine when cold and low when hot',
    'An engine with worn clearances therefore shows the fault hot first',
  ],
  'components/seo/ToolSeoContent.tsx': [
    'Look up a controller alarm or J1939 engine code',
    'how to clear the alarm',
    'Alarm lookup for DeepSea, ComAp',
    'points you to the matching diagnostic guide and alarm',
    'Older mechanical engines have no engine codes; for those, use the symptom guides',
  ],
  'app/generator-oracle/layout.tsx': [
    'Free generator fault-code lookup',
    'Reset steps. Engineer escalation.',
    'with reset steps and Kenya engineer escalation',
    'explained by Kenya generator engineers. Free to use.',
  ],
  'lib/solutions/generatorsSchema.ts': [
    'How often should I service my generator?',
    'What size generator do I need for my home?',
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

    it('B3 + follow-up: /solutions/controls emits no FAQPage (none visible on the page)', () => {
      const { container } = render(<ControlsLayout>{null}</ControlsLayout>);
      const html = container.innerHTML;
      expect(html).not.toContain('"@type":"FAQPage"');
      expect(html).toContain('"@type":"Service"');
      for (const m of FOLLOWUP_MARKERS['app/solutions/controls/layout.tsx']) expect(html).not.toContain(m);
    });

    it('follow-up: the cold/hot oil-pressure Q&A is gone from the article and its FAQPage', () => {
      const a = getRepairArticle('generator-low-oil-pressure-shutdown')!;
      const ld = JSON.stringify(buildRepairArticleJsonLd(a, 'https://www.emersoneims.com/x'));
      for (const m of FOLLOWUP2_MARKERS['lib/repair-centre/articles/generator-low-oil-pressure-shutdown.ts']) {
        expect(JSON.stringify(a)).not.toContain(m);
        expect(ld).not.toContain(m);
      }
    });

    it('follow-up: /generator-oracle visible copy and its FAQPage describe only what the page offers', async () => {
      const ToolSeoContent = (await import('@/components/seo/ToolSeoContent')).default;
      const { container } = render(<ToolSeoContent tool="generator-oracle" />);
      const html = container.innerHTML;
      for (const m of FOLLOWUP2_MARKERS['components/seo/ToolSeoContent.tsx']) expect(html).not.toContain(m);
      expect(html).toContain('Guided Diagnosis');
      // Visible FAQ and FAQPage are built from the same data: every answer in
      // the markup is on the page.
      const script = container.querySelector('script[type="application/ld+json"]')!;
      const ld = JSON.parse(script.textContent!) as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
      const visible = container.textContent!.replace(script.textContent!, '');
      for (const q of ld.mainEntity) {
        expect(visible).toContain(q.name);
        expect(visible).toContain(q.acceptedAnswer.text);
      }
      const layoutSrc = src('app/generator-oracle/layout.tsx');
      for (const m of FOLLOWUP2_MARKERS['app/generator-oracle/layout.tsx']) expect(layoutSrc).not.toContain(m);
    });

    it('follow-up: /solutions/generators emits no FAQPage', async () => {
      const { buildGeneratorSolutionsJsonLd } = await import('@/lib/solutions/generatorsSchema');
      expect(JSON.stringify(buildGeneratorSolutionsJsonLd())).not.toContain('FAQPage');
      for (const m of FOLLOWUP2_MARKERS['lib/solutions/generatorsSchema.ts']) {
        expect(src('lib/solutions/generatorsSchema.ts')).not.toContain(m);
      }
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
