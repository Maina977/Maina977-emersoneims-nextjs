// app/swoosh-x/page.tsx — FRESH preview URL (the service worker hasn't cached
// this path, so it always serves current code). LOCAL PREVIEW ONLY, noindex.

import type { Metadata } from 'next';
import SwooshGallery, { SwooshGalleryItem } from '@/components/home/SwooshGallery';
import FreshBoot from '@/components/home/FreshBoot';

export const metadata: Metadata = {
  title: 'Swoosh Gallery — Preview X',
  robots: { index: false, follow: false },
};

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

function DummyContentBlock({ where }: { where: 'above' | 'below' }) {
  return (
    <section className="py-20 bg-gradient-to-b from-black to-slate-900/40">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-amber-500 text-xs tracking-[0.3em] uppercase mb-3">Section {where === 'above' ? 'Above' : 'Below'}</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">This stands in for your existing landing-page content</h2>
        <p className="text-gray-300 leading-relaxed">The block sits directly {where} the swoosh gallery so you can confirm the animation stays inside its own stage and never overlaps this text.</p>
      </div>
    </section>
  );
}

export default function SwooshXPage() {
  return (
    <main className="bg-black min-h-screen">
      <FreshBoot />
      <div className="bg-amber-500/10 border-b border-amber-500/30 text-center py-3 px-4">
        <p className="text-amber-300 text-sm">PREVIEW X — photo-swoosh reveal. Not deployed, not indexed.</p>
      </div>
      <DummyContentBlock where="above" />
      <SwooshGallery items={ITEMS} />
      <DummyContentBlock where="below" />
    </main>
  );
}
