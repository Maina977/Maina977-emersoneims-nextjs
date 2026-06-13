// ═══════════════════════════════════════════════════════════════════════════════
// WavesGallery — images flow horizontally while each tile bobs vertically with a
// staggered phase, so the row reads as a travelling WAVE (no spiral, no rotation).
// Pure CSS animation, server-rendered (images are in the initial HTML for SEO),
// pauses on hover and respects prefers-reduced-motion.
// ═══════════════════════════════════════════════════════════════════════════════

import Image from 'next/image';

export interface WaveItem {
  src: string;
  caption: string;
}

interface WavesGalleryProps {
  items: WaveItem[];
  eyebrow?: string;
  heading?: string;
  subheading?: string;
}

export default function WavesGallery({
  items,
  eyebrow = 'Real workshop & field repairs',
  heading = 'Generator Repairs in Motion',
  subheading,
}: WavesGalleryProps) {
  // Duplicate the list so the horizontal scroll loops seamlessly.
  const loop = [...items, ...items];

  return (
    <section className="relative py-16 bg-gradient-to-b from-black via-slate-950 to-black overflow-hidden" aria-label={heading}>
      <div className="max-w-7xl mx-auto px-6 text-center mb-10">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-orange-400/90 mb-3">{eyebrow}</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">{heading}</h2>
        {subheading && <p className="mt-3 text-white/65 max-w-2xl mx-auto">{subheading}</p>}
      </div>

      <div className="waves-viewport">
        <ul className="waves-track" role="list">
          {loop.map((it, i) => (
            <li
              key={i}
              className="wave-item"
              style={{ animationDelay: `${-(i % items.length) * 0.45}s` }}
              aria-hidden={i >= items.length ? true : undefined}
            >
              <figure className="wave-card">
                <Image
                  src={it.src}
                  alt={it.caption}
                  width={360}
                  height={260}
                  className="wave-img"
                  sizes="360px"
                  loading="lazy"
                />
                <figcaption className="wave-cap">{it.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      {/* SEO: a plain, always-in-DOM list of what each repair shows */}
      <p className="sr-only">
        EmersonEIMS generator repair gallery: {items.map((it) => it.caption).join('; ')}.
      </p>

      <style>{`
        .waves-viewport {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 28px 0;
          -webkit-mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent);
          mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent);
        }
        .waves-track {
          display: flex;
          gap: 22px;
          width: max-content;
          padding: 0 22px;
          margin: 0;
          list-style: none;
          will-change: transform;
        }
        .wave-item { flex: 0 0 auto; }
        .wave-card {
          position: relative;
          width: 360px;
          max-width: 72vw;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(251,146,60,0.25);
          box-shadow: 0 18px 40px -18px rgba(0,0,0,0.8);
          background: #0a0a0a;
        }
        .wave-img {
          display: block;
          width: 100%;
          height: auto;
          aspect-ratio: 360 / 260;
          object-fit: cover;
        }
        .wave-cap {
          position: absolute;
          inset-inline: 0;
          bottom: 0;
          padding: 14px 14px 12px;
          font-size: 13px;
          line-height: 1.35;
          color: #fff;
          background: linear-gradient(to top, rgba(0,0,0,0.88), rgba(0,0,0,0.0));
        }
        @media (prefers-reduced-motion: no-preference) {
          .waves-track { animation: waveScroll 70s linear infinite; }
          .wave-item { animation: waveBob 4.2s ease-in-out infinite; }
          .waves-viewport:hover .waves-track,
          .waves-viewport:hover .wave-item { animation-play-state: paused; }
        }
        @keyframes waveScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes waveBob { 0%, 100% { transform: translateY(-16px); } 50% { transform: translateY(16px); } }
      `}</style>
    </section>
  );
}
