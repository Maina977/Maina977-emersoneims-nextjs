import type { Metadata } from 'next';

/*
 * Metadata for /plant-equipment-oracle.
 *
 * Title leads with the job and stays under 45 characters, because the root
 * layout appends " | EmersonEIMS Kenya" (20 more) and anything longer is
 * truncated in the search result.
 *
 * No canonical here — a canonical in a layout is inherited by every child
 * route and has silently de-indexed pages on this site before. The root layout
 * emits a correct self-referential one.
 */
export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/plant-equipment-oracle' },
  title: 'Plant & Machinery Fault Codes — Free',
  description:
    'Look up diesel engine fault codes for excavators, loaders, rollers and compressors in Kenya: Perkins, Cummins, Caterpillar, Deutz, Doosan, Weichai and more. Manufacturer-curated codes, free, no signup.',
  keywords: [
    'plant equipment fault codes Kenya',
    'excavator fault codes',
    'Perkins engine fault codes',
    'Cummins fault codes Kenya',
    'Caterpillar fault codes',
    'Deutz fault codes',
    'heavy machinery diagnostics Kenya',
    'ECM ECU diagnostics Kenya',
  ],
  robots: { index: true, follow: true },
  category: 'engineering',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
