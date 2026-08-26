/**
 * Index of the plant & equipment fault-code references — /faults/plant
 *
 * Also the parent every brand page's breadcrumb points at, so it has to exist:
 * a breadcrumb to a URL that does not resolve is a broken trail in structured
 * data.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { BRAND_GROUPS, totalCodesCovered } from '@/lib/plant-oracle/brandGroups';

export const metadata: Metadata = {
  // 36 characters, leaving room for the 20-character template suffix.
  title: 'Plant & Equipment Fault Codes',
  description:
    'Complete fault-code lists for Bobcat, Kubota, John Deere, Volvo CE, Komatsu, SANY and JCB — every code with the manufacturer description. Free reference.',
  alternates: { canonical: 'https://www.emersoneims.com/faults/plant' },
};

export default function PlantFaultsIndex() {
  const total = totalCodesCovered();

  return (
    <main className="eims-section">
      <div className="eims-shell">
        <nav aria-label="Breadcrumb" className="text-xs text-white/50">
          <Link href="/" className="hover:text-amber-400">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/faults" className="hover:text-amber-400">Fault codes</Link>
        </nav>

        <p className="eims-kicker mt-8">Reference · plant &amp; earthmoving</p>
        <h1 className="eims-title">Plant and equipment fault codes</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/70">
          {total} codes across {BRAND_GROUPS.length} engine families, each with the
          manufacturer&rsquo;s own description, grouped by subsystem. Free to use, no sign-up.
        </p>
        <p className="mt-3 max-w-3xl text-sm text-white/50">
          These lists tell you what a controller measured. They do not replace the
          manufacturer&rsquo;s diagnostic procedure, and they are not a repair manual for your
          machine.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {BRAND_GROUPS.map((g) => (
            <Link
              key={g.slug}
              href={`/faults/plant/${g.slug}`}
              className="eims-card group p-7 transition hover:border-amber-400/40"
            >
              <h2 className="text-lg font-semibold text-white group-hover:text-amber-300">
                {g.brand}
              </h2>
              <p className="mt-2 text-sm text-white/60">{g.family}</p>
              <p className="mt-4 text-sm font-semibold text-amber-300">
                {g.codes.length} codes
                <span className="ml-2 font-normal text-white/40">· {g.codeShape}</span>
              </p>
            </Link>
          ))}
        </div>

        <section className="mt-14 border-t border-white/10 pt-10">
          <div className="flex flex-wrap gap-3">
            <Link href="/plant-equipment-oracle" className="eims-card px-5 py-3 text-sm text-white/80 hover:text-white">
              Search every code →
            </Link>
            <Link href="/faults" className="eims-card px-5 py-3 text-sm text-white/80 hover:text-white">
              Generator fault codes →
            </Link>
            <Link href="/repair-centre" className="eims-card px-5 py-3 text-sm text-white/80 hover:text-white">
              Repair guides →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
