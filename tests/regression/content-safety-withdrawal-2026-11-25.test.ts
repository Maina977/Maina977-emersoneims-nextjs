/**
 * Content-safety withdrawal, 2026-11-25.
 *
 * Management rule: generator content the independent audit classed C
 * (CONTENT-SAFETY-CLASSIFICATION.md, oracle-content-audit-2026-11-25) is
 * withdrawn from the rendered page AND from any JSON-LD / metadata that
 * republishes it, until corrected and independently reviewed. A and B content
 * stays. Titles, URLs, canonicals, robots and sitemap entries do not change.
 *
 * Per-group checks live in ./content-safety-withdrawal/*. This file adds the
 * SEO-identity check against the snapshot taken at 4c2a6ee5 before any change.
 */
import { describe, it, expect } from 'vitest';
import snapshot from '../fixtures/content-safety-withdrawal-2026-11-25.routes.json';
import { collectRouteMeta, identityOf, type RouteMeta } from './content-safety-withdrawal/route-meta';
import { registerFaultsTests } from './content-safety-withdrawal/faults';
import { registerRepairCentreTests } from './content-safety-withdrawal/repair-centre';
import { registerTroubleshootingSolutionsTests } from './content-safety-withdrawal/troubleshooting-solutions';
import { registerServicesBibleKbTests } from './content-safety-withdrawal/services-bible-kb';
import { registerBlogGeneratorsPlantTests } from './content-safety-withdrawal/blog-generators-plant';
import { registerVerificationFollowupTests } from './content-safety-withdrawal/verification-followups';
import { CONTENT_SAFETY_WITHDRAWN_MESSAGE } from '@/lib/safety/contentWithdrawal';

describe('content-safety withdrawal 2026-11-25', () => {
  it('uses the agreed notice text', () => {
    expect(CONTENT_SAFETY_WITHDRAWN_MESSAGE).toBe(
      'These steps are temporarily withdrawn while safety checks are updated. Consult the OEM service manual for your model and a qualified technician.',
    );
  });

  describe('SEO identity of every affected route is unchanged', () => {
    let now: Record<string, RouteMeta>;
    it('collects current metadata', async () => {
      now = await collectRouteMeta();
      expect(Object.keys(now).sort()).toEqual(Object.keys(snapshot.routes).sort());
    }, 120000);

    it('titles, OG/Twitter titles, canonicals and robots match the pre-change snapshot', () => {
      for (const [route, before] of Object.entries(snapshot.routes as Record<string, RouteMeta>)) {
        expect(identityOf(now[route]), route).toEqual(identityOf(before));
      }
    });

    it('sitemap URLs match the pre-change snapshot', async () => {
      const sitemap = (await import('@/app/sitemap')).default;
      const urls = (await sitemap()).map((e) => e.url).sort();
      expect(urls).toEqual(snapshot.sitemapUrls);
    }, 120000);
  });

  registerFaultsTests();
  registerRepairCentreTests();
  registerTroubleshootingSolutionsTests();
  registerServicesBibleKbTests();
  registerBlogGeneratorsPlantTests();
  registerVerificationFollowupTests();
});
