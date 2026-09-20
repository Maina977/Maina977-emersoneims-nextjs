/**
 * DIRECTORY-BASED BLOG ARTICLES — the index entry for articles that render
 * from their own app/blog/<slug>/page.tsx rather than from BLOG_ARTICLES.
 *
 * WHY THIS FILE EXISTS
 * The blog grew two ways at once. BLOG_ARTICLES in blog-articles.ts holds
 * article bodies that app/blog/[slug] renders; separately, thirteen articles
 * were written as their own page.tsx directories. Only the first kind was ever
 * listed on /blog or emitted into the sitemap, so the thirteen below were
 * live, indexable and completely unreachable: absent from sitemap.xml, unlinked
 * from /blog, unlinked from the homepage. Audited 2026-09-20 against
 * production — every one returned HTTP 200 with a correct self-referential
 * canonical, and none could be found by a crawler or a reader.
 *
 * They are real articles. "Why Your Generator Won't Start" is the query a
 * facility manager types at 2am; it had no route in from anywhere.
 *
 * WHY IT IS NOT JUST ADDED TO BLOG_ARTICLES
 * app/blog/[slug] builds generateStaticParams from BLOG_ARTICLES. Adding these
 * slugs there would declare a dynamic route for paths that already have static
 * routes — Next resolves the static one and the dynamic entry silently never
 * renders. Keeping the listing metadata separate from the body registry says
 * what is actually true: these render themselves, and this file only tells the
 * index and the sitemap that they exist.
 *
 * NO BODY TEXT IS DUPLICATED HERE. Title, excerpt and date are for the card on
 * /blog; the article itself stays in its page.tsx and is the single source.
 * When one is edited, only its own file changes.
 *
 * FOUR ARTICLES ARE DELIBERATELY ABSENT. generator-roi, hvac-sizing-kenya-
 * climate, generator-fuel-efficiency-reduce-costs and solar-roi-kenya-real-
 * numbers each duplicated the intent of a longer article already in
 * BLOG_ARTICLES and already indexed. Wiring both in would have had the site
 * compete with itself for one query. They are 301 redirects in next.config.ts
 * instead, pointing at the deeper version — see the block there for the
 * word counts each decision was made on.
 */

export interface DirectoryArticle {
  /** Path segment under /blog. Must match the directory name exactly. */
  slug: string;
  title: string;
  /** Card text on /blog. */
  excerpt: string;
  /** ISO date, matching the "Published:" line rendered in the article. */
  date: string;
  readTime: string;
  category: string;
}

export const DIRECTORY_ARTICLES: readonly DirectoryArticle[] = [
  {
    slug: 'generator-wont-start-5-fixes',
    title: "Why Your Generator Won't Start: 5 Common Causes & Quick Fixes",
    excerpt:
      "Generator won't start? Battery, fuel, fuel solenoid, starter and compression — the five causes behind most no-starts, what to check yourself, and when to call a technician.",
    date: '2026-07-24',
    readTime: '6 min read',
    category: 'Troubleshooting',
  },
  {
    slug: 'ups-vs-generator-which-is-right',
    title: 'UPS vs Generator: Which Backup Power Is Right for You?',
    excerpt:
      'Cost, runtime and use case compared. When a UPS is enough, when you need a generator, and when the answer is both.',
    date: '2026-07-24',
    readTime: '7 min read',
    category: 'Buying Guide',
  },
  {
    slug: 'solar-generator-hybrid-integration',
    title: 'Solar + Generator Hybrid Integration: Best of Both Worlds',
    excerpt:
      'How hybrid solar, generator and battery systems work together, when they pay for themselves, and what they cost in Kenya.',
    date: '2026-07-24',
    readTime: '10 min read',
    category: 'Solar',
  },
  {
    slug: 'maintenance-contracts-roi',
    title: 'Generator Maintenance Contracts: Real ROI Analysis',
    excerpt:
      'Preventive maintenance against emergency repair, with the cost analysis and payback periods behind why contracts save money.',
    date: '2026-07-24',
    readTime: '7 min read',
    category: 'Maintenance',
  },
  {
    slug: 'three-phase-power-explained',
    title: 'Three-Phase Power Explained for Business Owners',
    excerpt:
      'Single-phase against three-phase, why industrial facilities need it, and how it maps onto Kenyan power standards.',
    date: '2026-07-24',
    readTime: '6 min read',
    category: 'Electrical',
  },
  {
    slug: 'motor-rewinding-repair-vs-replace',
    title: 'Motor Rewinding: When to Repair vs Replace',
    excerpt:
      'An electric motor has failed. A decision framework and cost analysis for choosing between a rewind and a new motor.',
    date: '2026-07-24',
    readTime: '5 min read',
    category: 'Electrical',
  },
  {
    slug: 'high-voltage-systems-industrial-power',
    title: 'High-Voltage Systems: Industrial Power Solutions',
    excerpt:
      'Working at 11kV and 33kV: industrial applications, safety, maintenance and distribution for large facilities.',
    date: '2026-07-24',
    readTime: '6 min read',
    category: 'Electrical',
  },
  {
    slug: 'electrical-load-management',
    title: 'Electrical Load Management: Lower Your Bills',
    excerpt:
      'Load scheduling, demand factor and peak shaving — how smart load management takes 15–25% off an electricity bill.',
    date: '2026-07-24',
    readTime: '5 min read',
    category: 'Cost Savings',
  },
  {
    slug: 'emergency-response-plan',
    title: 'Emergency Response Plan: Before Power Fails',
    excerpt:
      'Procedures, communication and recovery steps to put in place before an outage, so downtime and losses stay small.',
    date: '2026-07-24',
    readTime: '6 min read',
    category: 'Safety',
  },
  {
    slug: 'borehole-drilling-avoid-dry-holes',
    title: 'Borehole Drilling: How to Avoid Dry Holes in Kenya',
    excerpt:
      'Site selection, aquifer mapping, drilling success rates by county and yield prediction — how to avoid paying for a dry hole.',
    date: '2026-07-24',
    readTime: '9 min read',
    category: 'Water',
  },
  {
    slug: 'water-pump-maintenance-5-checks',
    title: 'Water Pump Maintenance: 5 Critical Checks',
    excerpt:
      'A borehole pump checklist: the monthly checks, the seasonal care, and the signs that mean you should call a technician.',
    date: '2026-07-24',
    readTime: '5 min read',
    category: 'Water',
  },
  {
    slug: 'incinerator-systems-waste-management',
    title: 'Medical Incinerator Systems: Waste Management Solutions',
    excerpt:
      'Incinerators for hospitals and clinics: disposal compliance, maintenance and the environmental standards that apply.',
    date: '2026-07-24',
    readTime: '6 min read',
    category: 'Healthcare',
  },
  {
    slug: 'grid-reliability-africa',
    title: 'Grid Reliability Across Africa: The Hidden Cost of Downtime',
    excerpt:
      'Published data on sub-Saharan grid reliability, what unplanned outages actually cost a business, and where backup power pays.',
    date: '2026-07-24',
    readTime: '10 min read',
    category: 'Infrastructure',
  },
];

export const DIRECTORY_ARTICLE_SLUGS: readonly string[] = DIRECTORY_ARTICLES.map(
  (a) => a.slug,
);
