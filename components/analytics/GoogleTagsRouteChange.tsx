'use client';

/**
 * Sends a GA4 page_view when an App Router navigation changes the path.
 *
 * WHY IT IS SEPARATE FROM GoogleTags.tsx
 * That file has to be a server component so its <script> tags land in the HTML
 * before hydration — see the long note there. Only this one small piece needs
 * to be a client component, so only this piece is.
 *
 * WHY IT IS NEEDED AT ALL
 * App Router navigations do not reload the document, so the page_view that
 * gtag sends on load fires once and never again. GA4 Enhanced Measurement can
 * catch history changes, but that is a checkbox inside the GA interface rather
 * than something this repository controls, so the event is sent explicitly.
 *
 * The first render is skipped: gtag('config') above already sends a page_view
 * for the landing page, and sending another here would count every entry
 * twice.
 *
 * usePathname and NOT useSearchParams. Reading search params this high in the
 * tree opts every page into client-side rendering unless wrapped in Suspense,
 * and the query string adds nothing to a page_view on this site.
 */

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function GoogleTagsRouteChange() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const w = window as unknown as { gtag?: (...a: unknown[]) => void };
    if (typeof w.gtag !== 'function') return;
    w.gtag('event', 'page_view', { page_path: pathname });
  }, [pathname]);

  return null;
}
