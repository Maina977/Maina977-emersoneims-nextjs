// app/swoosh-preview/page.tsx
// LOCAL PREVIEW ONLY — not linked anywhere, noindex. Lets us review the
// "basketball swoosh into the net" image reveal in isolation, sandwiched
// between dummy content blocks so we can confirm it never covers the
// content above or below it. Delete or promote into the homepage once approved.

import type { Metadata } from 'next';
import SwooshGallery, { SwooshGalleryItem } from '@/components/home/SwooshGallery';

export const metadata: Metadata = {
  title: 'Swoosh Gallery — Preview',
  robots: { index: false, follow: false },
};

// Same photos that currently "go round" on the live homepage RingGallery.
const ITEMS: SwooshGalleryItem[] = [
  { src: '/images/ST-AUSTIN-4K-CINEMATIC.jpg', title: 'St. Austin Academy — 50kVA Perkins', subtitle: 'Nairobi, Kenya' },
  { src: '/images/KIVUKONI-4K-CINEMATIC.jpg', title: 'Kivukoni School — 60kVA Cummins', subtitle: 'Nairobi, Kenya' },
  { src: '/images/BIGOT-FLOWERS-4K-CINEMATIC.jpg', title: 'Bigot Flowers — 300kVA Caterpillar', subtitle: 'Naivasha, Kenya' },
  { src: '/images/NTSA-4K-CINEMATIC.jpg', title: 'NTSA Headquarters — 300kVA Atlas Copco', subtitle: 'Nairobi, Kenya' },
  { src: '/images/SANERGY-FG-WILSON-4K-CINEMATIC.jpg', title: 'Sanergy — 250kVA FG Wilson', subtitle: 'Nairobi, Kenya' },
  { src: '/images/GREENHEART-KILIFI-4K-CINEMATIC.jpg', title: 'Greenheart Kilifi (Real Estate) — 44kVA Cummins', subtitle: 'Kilifi County, Kenya' },
  { src: '/images/voltka/voltka-vks44-hero-profile.webp', title: 'VOLTKA VKS44 — Cummins Powered', subtitle: 'New Fleet, Nairobi' },
  { src: '/images/voltka/voltka-warehouse-fleet.webp', title: 'Generator Fleet — Ready Stock', subtitle: 'Nairobi Warehouse' },
];

function DummyContentBlock({ label }: { label: string }) {
  return (
    <section className="py-20 bg-gradient-to-b from-black to-slate-900/40">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-amber-500 text-xs tracking-[0.3em] uppercase mb-3">{label}</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
          This represents your existing landing-page content
        </h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          The block you are reading sits directly {label === 'Section Above' ? 'above' : 'below'} the swoosh
          gallery. Scroll through it to confirm the animation stays inside its own stage and never overlaps,
          pushes, or hides any of this text. The basketball-style reveal lives in a bounded section between
          these two content blocks.
        </p>
        <p className="text-gray-400 leading-relaxed">
          Generators · Solar · UPS · Boreholes · Buildings — engineering-grade reliability for East Africa.
          Lorem-style filler stands in for the real content sections that surround the gallery on the homepage.
        </p>
      </div>
    </section>
  );
}

export default function SwooshPreviewPage() {
  return (
    <main className="bg-black min-h-screen">
      <div className="bg-amber-500/10 border-b border-amber-500/30 text-center py-3 px-4">
        <p className="text-amber-300 text-sm">
          PREVIEW — basketball &ldquo;swoosh into the net&rdquo; image reveal. Not deployed, not indexed.
        </p>
      </div>

      <DummyContentBlock label="Section Above" />

      <SwooshGallery items={ITEMS} />

      <DummyContentBlock label="Section Below" />
    </main>
  );
}
