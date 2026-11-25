/**
 * Content-safety withdrawal 2026-11-25 — blog, /generators/maintenance,
 * /generators/workshop-services and the Plant Oracle (audit Group 4 part,
 * "Withdraw list (this part)" items 1-9, plus P-W2 and P-W3).
 *
 * Every MARKER below was present in exactly one source file under app/,
 * components/ or lib/ at 4c2a6ee5 and must now be absent from that file, from
 * the data the page renders and from the JSON-LD the page emits.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { getArticleBySlug } from '@/lib/data/blog-articles';
import { buildBlogArticleJsonLd } from '@/lib/blog/articleSchema';
import { CONTENT_SAFETY_WITHDRAWN_MESSAGE } from '@/lib/safety/contentWithdrawal';
import { WORKSHOP_EDUCATION } from '@/lib/workshop/workshopEducation';
import { OEM_FAULT_CODES } from '@/lib/plant-oracle/oemFaultCodes';

const ROOT = path.resolve(__dirname, '../../..');
const src = (rel: string) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

/** slug -> markers withdrawn from that article (content or faqs). */
export const BLOG_MARKERS: Record<string, string[]> = {
  'generator-maintenance-tips-kenya': [
    'Look for fuel leaks** around',
    'Listen for unusual sounds** during operation',
    '12.5V+ when off',
    '240V plus or minus 5%',
    '50Hz plus or minus 1Hz',
    'fluctuations greater than 10%',
  ],
  'generator-buying-guide-kenya': [
    'Listen for knocking sounds',
    'let it run under load',
    'Buying without load test',
  ],
  'generator-safety-tips-kenya': ['under 5 ohms', 'Check for smoke or sparks'],
  'generator-fire-safety-prevention': [
    'Tighten connections regularly',
    'Visual inspection for fuel leaks',
    'clean fuel and oil leaks immediately',
  ],
  'diy-generator-maintenance-home': ['Check for leaks while running', 'Call immediately if'],
};

/** source file -> markers withdrawn from it (JSX / TS data). */
export const FILE_MARKERS: Record<string, string[]> = {
  'lib/data/blog-articles.ts': Object.values(BLOG_MARKERS).flat(),
  'app/blog/generator-wont-start-5-fixes/page.tsx': [
    '0.7-0.8mm',
    'Wait 1-2 minutes for fuel',
    'Smell for fuel at the carburetor',
    'Spark Plug Carbon Buildup',
    'spark plug fires',
  ],
  'app/generators/maintenance/page.tsx': ["'Injection timing correction', 'Allow proper warm-up'"],
  'components/generators/GeneratorSynchronizationGuide.tsx': [
    '+0.1–0.2',
    'circulating-neutral problem',
    'Circulating neutral current',
  ],
  'lib/workshop/workshopEducation.ts': [
    'cylinder-leakage tests to confirm',
    'cylinder-leakage testing to confirm',
  ],
  'lib/plant-oracle/oemFaultCodes.ts': [
    '4.75 V or above',
    'voltage low, below 0.25 V',
    'Supply voltage abnormal, above 36 V',
    'Engine speed abnormal, below 100 rpm',
  ],
  'app/plant-equipment-oracle/page.tsx': ['Descriptions, causes and checks'],
};

export function registerBlogGeneratorsPlantTests(): void {
  describe('content-safety withdrawal: blog articles (data + JSON-LD)', () => {
    for (const [slug, markers] of Object.entries(BLOG_MARKERS)) {
      it(`${slug}: withdrawn text is absent from the article and its JSON-LD`, () => {
        const article = getArticleBySlug(slug);
        expect(article, slug).toBeTruthy();
        const data = JSON.stringify(article);
        const ld = JSON.stringify(buildBlogArticleJsonLd(article!));
        for (const m of markers) {
          expect(data, `${slug} data: ${m}`).not.toContain(m);
          expect(ld, `${slug} JSON-LD: ${m}`).not.toContain(m);
        }
        // The withdrawn block is replaced by the shared notice text.
        expect(article!.content).toContain(CONTENT_SAFETY_WITHDRAWN_MESSAGE);
        expect(article!.content).not.toContain('${');
      });
    }

    it('fire-safety FAQ[2] keeps a coherent answer and the FAQPage matches the visible FAQ', () => {
      const a = getArticleBySlug('generator-fire-safety-prevention')!;
      expect(a.faqs[2].answer).toMatch(/^Key prevention steps: maintain proper clearance around generator, never refuel/);
      const ld = buildBlogArticleJsonLd(a);
      const faq = ld.find((o) => (o as { '@type': string })['@type'] === 'FAQPage') as {
        mainEntity: { name: string; acceptedAnswer: { text: string } }[];
      };
      expect(faq.mainEntity.map((q) => [q.name, q.acceptedAnswer.text])).toEqual(
        a.faqs.map((f) => [f.question, f.answer]),
      );
    });

    it('blog page uses the shared JSON-LD builder', () => {
      const page = src('app/blog/[slug]/page.tsx');
      expect(page).toContain("from '@/lib/blog/articleSchema'");
      expect(page).not.toContain("'@type': 'FAQPage'");
    });
  });

  describe('content-safety withdrawal: source files no longer contain withdrawn text', () => {
    for (const [file, markers] of Object.entries(FILE_MARKERS)) {
      it(file, () => {
        const text = src(file);
        for (const m of markers) expect(text, `${file}: ${m}`).not.toContain(m);
      });
    }

    it('static won\'t-start blog shows the shared notice where blocks were withdrawn', () => {
      const text = src('app/blog/generator-wont-start-5-fixes/page.tsx');
      expect(text).toContain("from '@/components/safety/SafetyChecksWithdrawnNotice'");
      expect(text.match(/<SafetyChecksWithdrawnNotice /g)?.length).toBe(2);
      // No rendered list item or paragraph mentions spark plugs or a carburettor.
      expect(text).not.toMatch(/<(li|p|h2)[^>]*>[^<]*(spark plug|carburet)/i);
    });
  });

  describe('content-safety withdrawal: workshop and plant oracle data', () => {
    it('engine-overhauls no longer opens with a compression/leakage test before strip-down', () => {
      const e = WORKSHOP_EDUCATION.find((x) => x.id === 'engine-overhauls')!;
      expect(e).toBeTruthy();
      const all = JSON.stringify(e);
      expect(all).not.toMatch(/cylinder-leakage test/i);
      expect(e.repairSteps[0]).toMatch(/^Strip the engine and measure/);
    });

    it('six OEM records keep code + condition but lose the unsourced threshold', () => {
      const want: Record<string, string> = {
        'Hitachi 11304-3': 'Travel pilot pressure sensor voltage high',
        'Hitachi 11304-4': 'Travel pilot pressure sensor voltage low',
        'Hitachi 11307-3': 'Front attachment pilot pressure sensor voltage high',
        'Hitachi 11307-4': 'Front attachment pilot pressure sensor voltage low',
        'SANY E015': 'Supply voltage abnormal',
        'SANY E541': 'Engine speed abnormal',
      };
      for (const [key, desc] of Object.entries(want)) {
        const [brand, code] = key.split(' ');
        const rec = OEM_FAULT_CODES.find((r) => r.brand === brand && r.code === code);
        expect(rec, key).toBeTruthy();
        expect(rec!.description, key).toBe(desc);
      }
    });
  });
}
