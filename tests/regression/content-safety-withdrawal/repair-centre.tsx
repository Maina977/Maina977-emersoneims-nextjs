/**
 * Content-safety withdrawal 2026-11-25 — Repair Centre group (items 1-7 of the
 * /repair-centre withdraw list in CONTENT-SAFETY-CLASSIFICATION.md).
 *
 * For each C item: the offending text is absent from the article data (which
 * the page renders), from the JSON-LD built by buildRepairArticleJsonLd, and
 * from the page metadata (meta/OG/Twitter descriptions). Each withdrawn
 * section renders the shared SafetyChecksWithdrawnNotice.
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { getRepairArticle } from '@/lib/repair-centre';
import { buildRepairArticleJsonLd, repairArticleDescription } from '@/lib/repair-centre/schema';
import { CONTENT_SAFETY_WITHDRAWN_MESSAGE } from '@/lib/safety/contentWithdrawal';
import RepairArticleView from '@/components/repair-centre/RepairArticleView';

/** slug -> markers: each appeared in exactly one source file at 4c2a6ee5. */
export const REPAIR_CENTRE_MARKERS: Record<string, string[]> = {
  'generator-low-oil-pressure-shutdown': [
    'Fit a mechanical gauge to the main gallery',
    'Run only long enough to take the reading',
    'Five minutes with a mechanical gauge',
    'Measure oil temperature alongside pressure',
    'pressure logged cold and hot',
    'then re-test before going further',
    'then re-measure hot',
    'Does a mechanical gauge on the gallery confirm the low reading',
    'Replace a sender proven wrong by a mechanical gauge',
    'Prove it with a mechanical gauge first',
    'Confirm oil pressure with a mechanical gauge at idle',
    'The decisive instrument. It separates a mechanical fault',
  ],
  'generator-overheating': [
    'Thermally survey the core under load',
    'Around the canopy or in the plant room, set running',
    'Clean the core properly and re-test',
  ],
  'diesel-engine-abnormal-noise': [
    'With the engine running, from a safe position',
    'contribution is altered',
    'Bearing knock is deeper, heavier and rises with LOAD',
    'Confirm oil pressure is normal and there is no metallic content in the filter',
    'Actual oil pressure at normal running temperature',
    'Localise with a stethoscope before dismantling anything',
  ],
  'generator-starts-then-stops': [
    'Time the stop before touching anything',
    'go to that parameter and prove it independently',
    'Watch live data through a complete start-to-stop cycle',
    'If low oil pressure is independently confirmed, stop.',
    'This fault requires repeated starting',
    'Time it accurately and check the delay setting',
    'Is the run time repeatable to within a second or two',
    'Does an independent gauge confirm the reported oil pressure or temperature',
  ],
  'controller-alarm-interpretation': [
    'Where checking requires the set to run after a protective shutdown',
    'Measure the actual pressure with an independent gauge before touching the engine',
  ],
  'j1939-spn-fmi-explained': [
    'Where verification requires running after a protective shutdown',
    'Establish the physical condition first.',
    'Verify the reported value independently',
  ],
};

async function metadataText(slug: string): Promise<string> {
  const a = getRepairArticle(slug)!;
  const page = await import('@/app/repair-centre/[hub]/[slug]/page');
  const m = await page.generateMetadata({ params: Promise.resolve({ hub: a.hub, slug }) });
  return JSON.stringify(m);
}

export function registerRepairCentreTests(): void {
  describe('content-safety withdrawal: Repair Centre C articles', () => {
    for (const [slug, markers] of Object.entries(REPAIR_CENTRE_MARKERS)) {
      describe(slug, () => {
        const article = getRepairArticle(slug)!;

        it('is still published', () => {
          expect(article).toBeTruthy();
        });

        it('C text is absent from the article data, JSON-LD and metadata', async () => {
          const data = JSON.stringify(article);
          const ld = JSON.stringify(buildRepairArticleJsonLd(article));
          const meta = await metadataText(slug);
          for (const m of markers) {
            expect(data, `data: ${m}`).not.toContain(m);
            expect(ld, `json-ld: ${m}`).not.toContain(m);
            expect(meta, `metadata: ${m}`).not.toContain(m);
          }
        });

        it('renders the shared withdrawal notice and none of the C text', () => {
          const { container, getAllByTestId } = render(<RepairArticleView article={article} />);
          const notices = getAllByTestId('content-safety-withdrawn');
          expect(notices.length).toBe(article.safetyWithdrawn!.length);
          for (const n of notices) expect(n.textContent).toBe(CONTENT_SAFETY_WITHDRAWN_MESSAGE);
          const html = container.innerHTML;
          for (const m of markers) expect(html, m).not.toContain(m.replace(/'/g, '&#x27;'));
          for (const m of markers) expect(container.textContent, m).not.toContain(m);
        });

        it('diagnosis steps are numbered 1..n and every "Step N" pointer resolves', () => {
          const n = article.diagnosis.length;
          article.diagnosis.forEach((s, i) => expect(s.step).toBe(i + 1));
          for (const s of article.diagnosis) {
            for (const ref of s.next.match(/Step (\d+)/g) ?? []) {
              const k = Number(ref.slice(5));
              expect(k, `${slug} step ${s.step} -> ${ref}`).toBeGreaterThan(s.step);
              expect(k, `${slug} step ${s.step} -> ${ref}`).toBeLessThanOrEqual(n);
            }
          }
        });

        it('JSON-LD FAQPage matches the visible FAQ exactly', () => {
          const graph = buildRepairArticleJsonLd(article)['@graph'] as Array<Record<string, unknown>>;
          const faq = graph.find(g => g['@type'] === 'FAQPage') as { mainEntity: { name: string }[] } | undefined;
          expect(faq?.mainEntity.map(q => q.name) ?? []).toEqual(article.faq.map(f => f.q));
        });
      });
    }

    it('starts-then-stops meta description contains no timing/restart instruction', async () => {
      const a = getRepairArticle('generator-starts-then-stops')!;
      const d = repairArticleDescription(a);
      expect(d).not.toMatch(/time the stop|restart|re-run/i);
      const meta = await metadataText('generator-starts-then-stops');
      expect(meta).toContain(d);
    });

    it('abnormal-noise meta description keeps the STOP whole', () => {
      const a = getRepairArticle('diesel-engine-abnormal-noise')!;
      expect(repairArticleDescription(a)).toContain('stopped immediately');
    });

    it('articles without an override keep the 300-character directAnswer cut', () => {
      const a = getRepairArticle('generator-overheating')!;
      expect(a.metaDescription).toBeUndefined();
      expect(repairArticleDescription(a)).toBe(a.directAnswer.slice(0, 300));
    });
  });
}
