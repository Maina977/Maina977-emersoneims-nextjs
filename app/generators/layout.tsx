import type { Metadata } from "next";

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/generators' },
  /*
   * TITLE LENGTH — do not append "| EmersonEIMS" here.
   * The root layout applies the template "%s | EmersonEIMS Kenya", so anything
   * added here is on top of that. The previous title ended in "| EmersonEIMS"
   * and rendered as "... | EmersonEIMS | EmersonEIMS Kenya" — 107 characters
   * with the brand twice, which Google truncates at roughly 60 and which reads
   * as keyword stuffing. Keep this field to ~45 characters.
   */
  /*
   * "VOLTKA Cummins", not "Cummins & VOLTKA".
   * They are not two competing brands. Per lib/brands/cumminsData.ts the
   * relationship is brandName: 'Cummins', supplier: 'Voltka' — Cummins sets
   * supplied through Voltka, sold and serviced by EmersonEIMS. The ampersand
   * implied a choice between two makes and split the keyword; the real
   * flagship line is named VOLTKA Cummins (VKS 44 through VKS 275).
   */
  title: "VOLTKA Cummins Generators | 10-3000kVA",
  /*
   * KEEP THIS UNDER ~155 CHARACTERS.
   * The previous version ran to 260 and Google cut it mid-sentence, which
   * wasted the part that actually sells: the warranty and the price range.
   * Lead with the numbers a buyer is searching for.
   */
  /*
   * "from KES 350,000" corrected to 280,000. GENERATOR_SIZES — the source this
   * site renders its price tables from — opens at "KES 280,000 – 350,000" for
   * the 10 kVA set, so the old figure quoted the TOP of the entry band as the
   * starting price. It also disagreed with the homepage, which reads its
   * opening price from the same data and shows 280,000: two different entry
   * prices for the same range on one website. Overstating the floor by 70,000
   * loses the click before the buyer ever sees the page.
   */
  // 2026-11-05: owner-confirmed VOLTKA prices only (100-750 kVA, prime,
  // ex-warehouse, excl. VAT). "from KES 280,000" removed: not confirmed, and
  // "from 2.1M" alone would imply nothing smaller is sold.
  description: "New VOLTKA generators, 10-3000kVA, open or silent. 100-750kVA KES 2.1M-9.1M (prime, ex-warehouse, excl. VAT); other sizes on request.",
  // NOTE: keywords meta tag removed - Google ignores it since 2009
  openGraph: {
    title: 'Cummins & Voltka Generators Kenya | 10-3000kVA',
    description: 'New VOLTKA generators with a 2-year warranty and 1 year free servicing. Used sets of other makes, servicing and repairs across all 47 counties.',
    type: 'website',
    url: 'https://www.emersoneims.com/generators',
    siteName: 'EmersonEIMS',
    images: [
      {
        url: 'https://www.emersoneims.com/images/desktop/generators/cummins-teal-canopy.jpg',
        width: 1200,
        height: 630,
        alt: 'Cummins Generator Kenya - EmersonEIMS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cummins Generators Kenya',
    description: 'Buy NEW Cummins generators in Kenya, 10kVA-3000kVA. Supplied, installed and commissioned.',
  },
  /*
   * NO `alternates.canonical` HERE — a layout's metadata is inherited by every
   * page beneath it, so this hard-coded value made /generators/used,
   * /generators/leasing, /generators/systems, /generators/case-studies and
   * /generators/maintenance-companion all canonicalise to /generators and lose
   * their own ranking. Those are commercial pages. The root layout emits a
   * correct self-referential canonical from `x-pathname`.
   */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function GeneratorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /*
   * NO JSON-LD HERE (moved 2026-11-05). A layout's markup is inherited by every
   * child route, so the /generators WebPage, breadcrumb and the VOLTKA price
   * offer were being stamped onto /generators/sizes/10-kva, /generators/used
   * and a dozen other pages, telling Google a 10 kVA page offered 2.1M-9.1M.
   * It now lives in ./generatorsJsonLd.ts and only app/generators/page.tsx
   * renders it.
   */
  return <>{children}</>;
}


