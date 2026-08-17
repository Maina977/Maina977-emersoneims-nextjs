import Link from 'next/link';
import PlantOracleSearch from '@/components/plant-oracle/PlantOracleSearch';
import { getCoverage, getStats, DECLARED_GAPS } from '@/lib/plant-oracle/coverage';
import { getJ1939Stats } from '@/lib/plant-oracle/j1939';
import { getSpaceCoverage, CODE_SPACES } from '@/lib/plant-oracle/codeSpaces';

/**
 * Plant & Equipment Oracle.
 *
 * A sibling to Generator Oracle rather than an extension of it: the same
 * verified data serves both, but a buyer searching "excavator fault code" and
 * one searching "generator fault code" are different people, and one page
 * cannot rank well for both.
 *
 * SERVER-RENDERED ON PURPOSE. The coverage table, the engine-plate guidance
 * and the brand list are in the HTML, so a crawler sees real content and a
 * technician on a poor connection can read the page before the search island
 * hydrates. The AI tools on this site were previously indexed but unrankable
 * for exactly this reason — client apps with no body text.
 */

export const revalidate = 86400;

/** Deterministic thousands separator — never toLocaleString(). */
function fmt(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function PlantEquipmentOraclePage() {
  const coverage = getCoverage();
  const stats = getStats();
  const brands = coverage.map((c) => c.brand);
  const j = getJ1939Stats();
  const sp = getSpaceCoverage();

  return (
    <div className="eims-section min-h-screen pt-24 pb-12">
      <div className="eims-shell py-0">

        <nav className="mb-8 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-gray-400">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li>/</li>
            <li><Link href="/ai-tools" className="hover:text-white">Tools</Link></li>
            <li>/</li>
            <li className="text-white">Plant &amp; Equipment Oracle</li>
          </ol>
        </nav>

        <div className="mb-12">
          <div className="inline-block px-4 py-1 rounded-full bg-amber-400/10 text-amber-400 text-sm mb-4">
            Free &middot; no signup
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
            Plant &amp; machinery fault codes
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mb-4">
            Diesel engine fault codes for excavators, loaders, rollers,
            telehandlers, compressors and drill rigs — the same engines that
            power them power gensets, and the codes are the same.
          </p>
          <p className="text-gray-500 max-w-3xl">
            {fmt(stats.codes)} curated codes across {stats.brands} brands —
            {fmt(stats.engineCodes)} engine-brand and {fmt(stats.oemCodes)}{' '}
            machine-maker.
            Every one is checked. Plus a SAE J1939 decoder — {j.spns} verified
            SPNs and all {j.fmis} defined FMIs — so a machine we hold no table for still
            decodes from the standard. We publish no invented codes and no
            invented fixes.
          </p>
        </div>

        <div className="mb-16">
          <PlantOracleSearch brands={brands} totalCodes={stats.codes} totalBrands={stats.brands} />
        </div>

        {/* ---------- engine plate guidance ---------- */}
        <section className="mb-16" aria-labelledby="plate-heading">
          <h2 id="plate-heading" className="text-2xl md:text-3xl font-bold mb-4">
            Start at the engine plate, not the machine badge
          </h2>
          <div className="max-w-3xl space-y-4 text-gray-300">
            <p>
              A fault code comes from the engine ECM, so it belongs to the
              <strong> engine</strong>, not to the paint on the bodywork. The same
              Perkins 1104 sits in machines wearing several different badges, and
              two machines from one manufacturer can carry completely different
              engines depending on year and market.
            </p>
            <p>
              So we do not ask what the machine is. Find the engine data plate —
              usually on the rocker cover, the block above the starter, or the
              timing case — and read the make and model from it. Search that,
              plus the number on the display. It is the answer that is always
              right for the machine in front of you.
            </p>
            <p className="text-sm text-gray-500 border-t border-white/10 pt-4">
              Fault code numbers are industry-standard identifiers used for
              identification only. Descriptions, causes and checks are written in
              our own words as statements of engineering fact — nothing here is
              transcribed from a manufacturer service manual. This tool is not
              affiliated with or endorsed by any manufacturer, and all brand and
              model names are the property of their owners. For official
              documentation, always use the manufacturer&apos;s manual for the
              specific engine.
            </p>
          </div>
        </section>

        {/* ---------- coverage ---------- */}
        <section className="mb-16" aria-labelledby="coverage-heading">
          <h2 id="coverage-heading" className="text-2xl md:text-3xl font-bold mb-4">
            Exactly what we cover
          </h2>
          <p className="text-gray-400 max-w-3xl mb-6">
            Most fault-code sites imply they cover everything and return nothing.
            Here is the real list, with counts — and where to read the name you
            should search. Engine-brand codes are found from the data plate on
            the engine; machine-maker codes are found from the badge on the
            bodywork.
          </p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/15">
                  <th className="py-2 pr-4 text-sm uppercase tracking-wider text-gray-500 font-semibold">Brand</th>
                  <th className="py-2 pr-4 text-sm uppercase tracking-wider text-gray-500 font-semibold">Look it up by</th>
                  <th className="py-2 pr-4 text-sm uppercase tracking-wider text-gray-500 font-semibold text-right">Codes</th>
                  <th className="py-2 text-sm uppercase tracking-wider text-gray-500 font-semibold">Families covered</th>
                </tr>
              </thead>
              <tbody>
                {coverage.map((c) => (
                  <tr key={c.brand} className="border-b border-white/5">
                    <td className="py-3 pr-4 font-semibold text-white whitespace-nowrap">{c.brand}</td>
                    <td className="py-3 pr-4 text-sm whitespace-nowrap">
                      <span
                        className={
                          c.kind === 'engine'
                            ? 'text-cyan-300/90'
                            : 'text-amber-300/90'
                        }
                      >
                        {c.kind === 'engine' ? 'Engine plate' : 'Machine badge'}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right font-mono text-amber-300">{c.codes}</td>
                    <td className="py-3 text-sm text-gray-400">{c.families.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              No manufacturer table for these — but they still decode
            </h3>
            <p className="text-gray-400 mb-3">
              We hold no maker-specific fault table for:
            </p>
            <p className="text-gray-300 mb-4">{DECLARED_GAPS.join(' · ')}</p>
            <p className="text-gray-300 mb-3">
              That does not always leave you stuck. Where the machine has an
              electronically controlled engine, it will almost certainly speak{' '}
              <strong>SAE J1939</strong>, in which a fault is an SPN saying which
              parameter is at fault and an FMI saying how it failed — and both
              mean the same thing on a John Deere as on a Cummins. Smaller and
              older machines from these makers are often mechanically governed
              with no diagnostic bus at all, and will show no code to decode.
              We hold{' '}
              {j.spns} verified SPNs and all {j.fmis} defined FMIs, so the
              decoder above reads those machines from the standard rather than
              guessing at them.
            </p>
            <p className="text-sm text-gray-500">
              Two honest limits. Manufacturer-proprietary SPNs sit outside the
              standard ranges, differ between makers, and are not included — the
              decoder says so rather than offering a near match. And many of
              these machines run engines we cover outright (Perkins, Cummins,
              Deutz, Weichai), so check the engine plate first. If you have the
              workshop manual for anything on this list, send it and we will add
              it properly.
            </p>
          </div>
        </section>

        {/* ---------- published code spaces ---------- */}
        <section className="mb-16" aria-labelledby="spaces-heading">
          <h2 id="spaces-heading" className="text-2xl md:text-3xl font-bold mb-4">
            Codes we do not hold, that we can still read
          </h2>
          <div className="max-w-3xl space-y-4 text-gray-300 mb-6">
            <p>
              A curated entry is the best answer, but it is not the only useful
              one. Fault codes are not random — they sit in published,
              structured spaces, and the shape of a code tells you which system
              raised it and often what kind of fault it is.
            </p>
            <p>
              Type a code we hold no record for and the tool will still say what
              it recognises. <strong>P0217</strong> is not in our Kubota table,
              but it is an SAE J2012 powertrain code in the fuel-and-air-metering
              group, and that is published fact rather than guesswork.
            </p>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/15">
                  <th className="py-2 pr-4 text-sm uppercase tracking-wider text-gray-500 font-semibold">Code space</th>
                  <th className="py-2 pr-4 text-sm uppercase tracking-wider text-gray-500 font-semibold">Used by</th>
                  <th className="py-2 text-sm uppercase tracking-wider text-gray-500 font-semibold text-right">Numbers</th>
                </tr>
              </thead>
              <tbody>
                {CODE_SPACES.map((c) => (
                  <tr key={c.label} className="border-b border-white/5">
                    <td className="py-3 pr-4 font-semibold text-white">{c.label}</td>
                    <td className="py-3 pr-4 text-sm text-gray-400">{c.brands.join(', ')}</td>
                    <td className="py-3 text-right font-mono text-amber-300">
                      {c.size === null ? 'unbounded' : fmt(c.size)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-gray-500 max-w-3xl">
            {fmt(sp.numbersCovered)} code numbers sit inside the{' '}
            {sp.boundedSpaces} spaces whose bounds are published.{' '}
            <strong className="text-gray-400">
              This is structural coverage, not a count of faults we hold
            </strong>{' '}
            — nothing is pre-generated into records, and a classification is
            always shown separately from a verified answer. The other{' '}
            {sp.unboundedSpaces} spaces have no published bound, so no number is
            claimed for them rather than one being estimated.
          </p>
        </section>

        {/* ---------- CTA ---------- */}
        <section className="mb-8">
          <div className="rounded-2xl border border-amber-500/20 bg-white/5 p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Code found, machine still down?
            </h2>
            <p className="text-gray-400 max-w-2xl mb-6">
              A code tells you what the ECM detected, not always what failed. Our
              mobile workshop covers all 47 counties and carries diagnostic
              equipment for engine, ECU and hydraulic faults.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-block bg-amber-500 text-black px-8 py-4 rounded-full font-bold hover:bg-amber-400 transition-colors"
              >
                Request a diagnostic visit
              </Link>
              <a
                href="tel:+254768860665"
                className="inline-block bg-white/10 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-colors border border-white/20"
              >
                Call +254 768 860 665
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
