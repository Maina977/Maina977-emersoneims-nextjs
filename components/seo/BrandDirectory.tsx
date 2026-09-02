import Link from 'next/link';
import { GENERATOR_BRANDS } from '@/lib/data/generator-brands';

/**
 * The seventeen /brands/<brand> pages were UNREACHABLE.
 *
 * Measured on 2026-09-02 by building the internal link graph of all 1,425
 * sitemap URLs: /brands is linked from 1,425 pages (it is in the main nav) and
 * linked to NONE of its own brand pages. They were also absent from the
 * sitemap. So seventeen pages of roughly 940 words each had no crawl path at
 * all — not one inbound link, not one sitemap entry. A brand index that does
 * not list its brands is the whole defect in one sentence.
 *
 * Rendered from app/brands/layout.tsx, so it appears on the index AND on every
 * brand page. That is deliberate: it turns seventeen dead ends into a mesh
 * where any brand is one click from any other. It is a navigational block, not
 * content — kept compact for exactly that reason.
 */
export default function BrandDirectory() {
  return (
    <nav
      aria-label="Generator brands we supply and service"
      className="mx-auto max-w-4xl px-6 py-14 text-slate-300"
    >
      <h2 className="text-2xl font-bold text-white">Generator brands we supply and service</h2>
      <p className="mt-4 leading-relaxed">
        EmersonEIMS sells, installs, services and supplies genuine parts for the engine
        brands below. We are not an authorised dealer for any of them; we are an
        independent engineering company that works on all of them.
      </p>
      <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {GENERATOR_BRANDS.map((brand) => (
          <li key={brand.slug}>
            <Link
              href={`/brands/${brand.slug}`}
              className="font-semibold text-cyan-400 underline"
            >
              {brand.name} generators
            </Link>
            <span className="text-slate-400"> — {brand.powerRange}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
