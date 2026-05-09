// app/generators/case-studies/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Server-side redirect to the canonical /case-studies page.
//
// The previous /generators/case-studies page hard-coded named-client
// stories (St. Austin Academy, Kivukoni International, Bigot Flowers, NTSA,
// Greenheart Kilifi) with specific uptime / KSh-saved figures and lacked
// signed releases or source-document evidence — violating the project
// data policy. The single source of truth now lives in data/caseStudies.ts
// and is rendered by app/case-studies/page.tsx with PUBLISHED+evidence
// gating. This route is preserved (301-equivalent) so inbound links and
// historic indexing continue to resolve to verified content.
// ─────────────────────────────────────────────────────────────────────────────

import { permanentRedirect } from 'next/navigation';

export const dynamic = 'force-static';

export default function GeneratorCaseStudiesRedirect(): never {
  permanentRedirect('/case-studies');
}
