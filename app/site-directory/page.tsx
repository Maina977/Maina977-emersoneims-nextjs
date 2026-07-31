import Link from 'next/link';
import type { Metadata } from 'next';
import { REPAIR_HUBS, REPAIR_ARTICLES } from '@/lib/repair-centre';
import { COUNTIES } from '@/lib/seo/kenyaLocations';
import { EAST_AFRICA_COUNTRIES } from '@/lib/data/east-africa-locations';
import { BLOG_ARTICLES } from '@/lib/data/blog-articles';
import sitemap from '@/app/sitemap';

/**
 * HTML site directory.
 *
 * WHY THIS EXISTS
 * ---------------
 * A live breadth-first crawl of www.emersoneims.com on 2026-07-31 started at the
 * homepage, followed only internal links, and compared what it reached against
 * sitemap.xml. 215 sitemap URLs were never reached by any path — entire sections
 * were listed for search engines while nothing on the site linked to them:
 *
 *   /sectors        13 of 13 orphaned   (nothing links to the index either)
 *   /uganda etc.    36 of 36 orphaned   (the whole East Africa expansion)
 *   /brands          1 of 1  orphaned
 *   /all-tools       1 of 1  orphaned
 *   /generators     53 of 61 orphaned   (/generators links only 15 of its own)
 *
 * The cause is structural: the primary navigation is a mega-menu whose panel is
 * rendered only when opened (`activeMega && ...` in TeslaStyleNavigation), so
 * every link inside it exists only after a click. A crawler receives the button
 * labels and no hrefs at all. The footer is the site's only server-rendered link
 * surface, and it did not carry these sections.
 *
 * This page is that missing surface: one server-rendered, JavaScript-free index
 * that links every section, built FROM the same registries app/sitemap.ts reads
 * so the two cannot drift apart. The "More pages" group at the end is computed
 * by subtracting everything named above from the sitemap itself, so a page can
 * never again be published, listed for search engines, and linked from nothing.
 *
 * It is a navigational index, not a doorway page — it contains no generated
 * prose, no keyword permutations and no content of its own beyond section
 * headings and the real titles of real pages.
 */

export const metadata: Metadata = {
  title: 'Site Directory | Every Page on EmersonEIMS',
  description:
    'Complete index of EmersonEIMS — services, repair guides, county coverage across Kenya, East Africa locations, sectors, tools and articles.',
  alternates: { canonical: 'https://www.emersoneims.com/site-directory' },
};

export const revalidate = 3600;

/**
 * Sector pages deliberately mirror app/sitemap.ts: only sectors with NO
 * /industries counterpart are listed, so two of our own pages never compete for
 * the same query. See the comment block in app/sitemap.ts for the reasoning.
 */
const SECTORS_WITHOUT_INDUSTRY_HUB = [
  'supermarkets',
  'restaurants',
  'quarries',
  'apartments',
  'homes',
  'farms',
  'ranches',
  'embassies',
  'consulates',
  'private-offices',
  'tourist-destinations',
  'masai-mara',
];

/**
 * Prefixes deliberately EXCLUDED from the computed "More pages" group, because
 * each already has a working index that a crawler can walk.
 *
 * /kenya and /locations are the two big geo matrices — 1,475 and 224 URLs.
 * /locations links all 47 counties, each county page links its towns, and each
 * town links its services; a crawl confirmed /locations/uasin-gishu links
 * /locations/eldoret. Enumerating ~1,700 further links here would bloat the page
 * for no discovery gain.
 */
const CRAWLABLE_FROM_OWN_INDEX = [
  '/kenya/',
  '/locations/',
  '/faults/',
  '/blog/',
  '/repair-centre/',
];

type L = { href: string; label: string };

const label = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

function Group({ title, note, links }: { title: string; note?: string; links: L[] }) {
  if (links.length === 0) return null;
  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
      {note && <p className="text-sm text-slate-400 mb-3">{note}</p>}
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1.5 mt-3">
        {links.map(l => (
          <li key={l.href} className="text-sm leading-relaxed">
            <Link href={l.href} className="text-slate-300 hover:text-cyan-400 transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function SiteDirectoryPage() {
  const mainPages: L[] = [
    { href: '/', label: 'Home' },
    { href: '/about-us', label: 'About Us' },
    { href: '/services', label: 'All Services' },
    { href: '/generators', label: 'Generators' },
    { href: '/solar', label: 'Solar Power' },
    { href: '/industries', label: 'Industries Served' },
    { href: '/sectors', label: 'Sectors' },
    { href: '/brands', label: 'Brands We Work With' },
    { href: '/marketplace', label: 'Spare Parts Marketplace' },
    { href: '/case-studies', label: 'Case Studies' },
    { href: '/gallery', label: 'Project Gallery' },
    { href: '/careers', label: 'Careers' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/booking', label: 'Book a Service' },
  ];

  const toolPages: L[] = [
    { href: '/all-tools', label: 'All Tools' },
    { href: '/ai-tools', label: 'AI Tools' },
    { href: '/calculators', label: 'Power Calculators' },
    { href: '/generator-oracle', label: 'Generator Oracle' },
    { href: '/solar-genius-pro', label: 'Solar Genius Pro' },
    { href: '/aquascan-pro-v3', label: 'AquaScan Pro' },
    { href: '/pro-building-suite', label: 'Pro Building Suite' },
    { href: '/eims-pro', label: 'EIMS Pro Workspace' },
    { href: '/diagnostics', label: 'Diagnostics Hub' },
    { href: '/troubleshooting', label: 'Troubleshooting Wizard' },
    { href: '/faults', label: 'Fault Code Library' },
  ];

  const hubLinks: L[] = [
    { href: '/repair-centre', label: 'Repair Centre home' },
    ...REPAIR_HUBS.map(h => ({ href: `/repair-centre/${h.slug}`, label: h.title })),
  ];

  const articleLinks: L[] = REPAIR_ARTICLES.map(a => ({
    href: `/repair-centre/${a.hub}/${a.slug}`,
    label: a.header.title.split(' — ')[0],
  }));

  const kenyaLinks: L[] = [
    { href: '/kenya', label: 'Kenya — all counties' },
    { href: '/locations', label: 'All service locations' },
    ...COUNTIES.map(c => ({ href: `/kenya/${c.slug}`, label: c.name })),
  ];

  const eaCityLinks: L[] = EAST_AFRICA_COUNTRIES.flatMap(c =>
    c.cities.map(city => ({
      href: `/${c.slug}/${city.slug}`,
      label: `${city.name}, ${c.name}`,
    })),
  );
  const eaLinks: L[] = [{ href: '/east-africa', label: 'East Africa overview' }, ...eaCityLinks];

  const sectorLinks: L[] = SECTORS_WITHOUT_INDUSTRY_HUB.map(s => ({
    href: `/sectors/${s}`,
    label: label(s),
  }));

  const maintenanceLinks: L[] = [
    { href: '/maintenance-hub/generators', label: 'Generator Maintenance' },
    { href: '/maintenance-hub/solar', label: 'Solar Maintenance' },
    { href: '/maintenance-hub/hvac', label: 'HVAC Maintenance' },
    { href: '/maintenance-hub/borehole', label: 'Borehole Maintenance' },
    { href: '/maintenance-hub/electrical', label: 'Electrical Maintenance' },
    { href: '/maintenance-hub/motors', label: 'Motors Maintenance' },
    { href: '/maintenance-hub/incinerators', label: 'Incinerator Maintenance' },
    { href: '/maintenance-hub/fabrication', label: 'Fabrication & Welding' },
  ];

  const knowledgeLinks: L[] = [
    { href: '/blog', label: 'Blog index' },
    { href: '/knowledge-base', label: 'Knowledge Base' },
    { href: '/technical-bible', label: 'Technical Bible' },
    { href: '/resources', label: 'Resources & Learning Hub' },
    ...BLOG_ARTICLES.map(a => ({ href: `/blog/${a.slug}`, label: a.title })),
  ];

  const legalLinks: L[] = [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ];

  /*
   * Everything in the sitemap that nothing above already links by name. This is
   * what catches sections like /generators/leasing, /generators/systems and
   * /generators/case-studies — all published, all in the sitemap, and linked
   * from nowhere because /generators lists only 15 of its own 61 sub-pages.
   *
   * Reading the sitemap function directly (rather than a copy of its logic)
   * means a new page cannot be added to the sitemap without appearing here.
   */
  const named = new Set(
    [
      mainPages,
      toolPages,
      hubLinks,
      articleLinks,
      kenyaLinks,
      eaLinks,
      sectorLinks,
      maintenanceLinks,
      knowledgeLinks,
      legalLinks,
    ]
      .flat()
      .map(l => l.href),
  );

  let morePages: L[] = [];
  try {
    const entries = await sitemap();
    const seen = new Set<string>();
    morePages = entries
      .map(e => new URL(e.url).pathname.replace(/\/$/, '') || '/')
      .filter(p => {
        if (named.has(p) || seen.has(p)) return false;
        if (CRAWLABLE_FROM_OWN_INDEX.some(prefix => p.startsWith(prefix))) return false;
        seen.add(p);
        return true;
      })
      .sort()
      .map(p => ({ href: p, label: p }));
  } catch {
    // A directory missing its tail is far better than a page that fails to
    // render; every named group above is unaffected.
    morePages = [];
  }

  const total = named.size + morePages.length;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.emersoneims.com' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Site Directory',
        item: 'https://www.emersoneims.com/site-directory',
      },
    ],
  };

  return (
    <>
      <script
        id="site-directory-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <main className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-400 mb-6">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-cyan-400">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-300" aria-current="page">
                Site Directory
              </li>
            </ol>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">Site Directory</h1>
          <p className="text-slate-300 max-w-3xl leading-relaxed mb-10">
            Every section of EmersonEIMS in one place — {total.toLocaleString('en-GB')} pages listed
            below, plus the county and service indexes that lead to the rest. If you are looking for
            something and the menu is not helping, it is on this page.
          </p>

          <Group title="Main pages" links={mainPages} />

          <Group
            title="Engineering tools"
            note="Free calculators and diagnostic tools built by our engineers."
            links={toolPages}
          />

          <Group
            title="Repair Centre — categories"
            note={`${REPAIR_HUBS.length} equipment categories.`}
            links={hubLinks}
          />

          <Group
            title="Repair Centre — diagnosis guides"
            note={`${REPAIR_ARTICLES.length} free step-by-step guides.`}
            links={articleLinks}
          />

          <Group
            title="Kenya — county coverage"
            note={`All ${COUNTIES.length} counties. Each county page links on to the towns and services available there.`}
            links={kenyaLinks}
          />

          <Group
            title="East Africa"
            note={`${eaCityLinks.length} city pages across ${EAST_AFRICA_COUNTRIES.length} countries.`}
            links={eaLinks}
          />

          <Group title="Sectors we serve" links={sectorLinks} />

          <Group title="Maintenance hubs" links={maintenanceLinks} />

          <Group
            title="Knowledge & articles"
            note={`${BLOG_ARTICLES.length} articles.`}
            links={knowledgeLinks}
          />

          <Group
            title="More pages"
            note="Everything else we publish, taken straight from the sitemap."
            links={morePages}
          />

          <Group title="Legal" links={legalLinks} />
        </div>
      </main>
    </>
  );
}
