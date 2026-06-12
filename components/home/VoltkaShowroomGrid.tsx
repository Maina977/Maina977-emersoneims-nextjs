/**
 * VOLTKA SHOWROOM MOMENTS — Nike/Apple-style editorial image sections.
 * Server component (no JS shipped): a full-width night-delivery billboard,
 * a 2x2 quad of uniform 4:3 cards (ATS, genuine Cummins engine, Caterpillar
 * open-frame, Caterpillar canopy on a light studio tile) and a wide
 * switchgear/distribution banner. Additive — touches no existing sections.
 */

import Image from 'next/image';
import Link from 'next/link';

export function VoltkaBillboard() {
  return (
    <section
      className="relative bg-black content-auto overflow-hidden"
      aria-label="VOLTKA night delivery billboard"
    >
      <div className="relative h-[70svh] min-h-[480px] sm:h-[85vh]">
        <Image
          src="/images/voltka/voltka-vks44-night-delivery.webp"
          alt="VOLTKA Cummins VKS 44 generator delivered at night in Kenya, powered before the morning shift"
          fill
          sizes="100vw"
          quality={88}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-14 lg:p-20">
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.3em] text-amber-300 uppercase mb-4">
            24/7 Emergency Response
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.05] max-w-3xl">
            Blackout Tonight.
            <br />
            Powered by Morning.
          </h2>
          <p className="mt-4 text-sm sm:text-lg text-white/85 font-light max-w-xl">
            When a client calls at midnight, our crews deliver, install and
            commission overnight — anywhere in Kenya&apos;s 47 counties.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/contact?type=emergency"
              className="w-full sm:w-auto px-10 py-3 rounded-full bg-white text-black text-sm font-semibold text-center hover:bg-white/90 transition-colors duration-200 tap-scale touch-target"
            >
              Emergency Power in 48 Hours
            </Link>
            <a
              href="https://wa.me/254768860665?text=Hi%20EmersonEIMS%2C%20I%20need%20emergency%20generator%20delivery"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-3 rounded-full border border-white/60 text-white text-sm font-semibold text-center hover:bg-white/10 transition-colors duration-200 tap-scale touch-target"
            >
              WhatsApp the Duty Crew
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const CARDS = [
  {
    src: '/images/voltka/ats-changeover-card.webp',
    alt: 'Automatic transfer switch changeover panel commissioned and running on load at 401V across three phases',
    kicker: 'ATS & Changeovers',
    title: 'Commissioned. On Load. 401V.',
    copy: 'We wire the ATS, test the changeover and hand over a running system — not boxes.',
    href: '/generators',
    cta: 'See How We Install',
    light: false,
  },
  {
    src: '/images/voltka/voltka-cummins-engine-open-canopy.webp',
    alt: 'Genuine Cummins diesel engine and controller inside an open VOLTKA super silent canopy',
    kicker: 'Genuine Cummins Inside',
    title: 'The Engine Sells Itself.',
    copy: 'Genuine Cummins blocks, Fleetguard filtration, 3-year warranty. Inspect before you buy.',
    href: '/generators',
    cta: 'Explore the Range',
    light: false,
  },
  {
    src: '/images/voltka/cat-open-frame.webp',
    alt: 'Caterpillar open-frame diesel generator professionally installed in a plant room',
    kicker: 'Caterpillar · Open Frame',
    title: 'Plant-Room Power.',
    copy: 'Open-frame Caterpillar sets supplied, installed and serviced for industry.',
    href: '/generators',
    cta: 'View Industrial Sets',
    light: false,
  },
  {
    src: '/images/voltka/cat-canopy-studio.webp',
    alt: 'Caterpillar super silent canopied diesel generator studio shot',
    kicker: 'Caterpillar · Canopied',
    title: 'Silent. Weatherproof. CAT.',
    copy: 'Canopied Caterpillar sets for hospitals, hotels and commercial property.',
    href: '/generators',
    cta: 'Get a CAT Quote',
    light: true,
  },
];

export function VoltkaDuoGrid() {
  return (
    <section
      className="bg-black content-auto py-4 sm:py-6"
      aria-label="Generator and switchgear highlights"
    >
      <div className="px-4 sm:px-6 lg:px-8 max-w-full-content mx-auto">
        {/* 2x2 quad — every card the same 4:3 proportion */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {CARDS.map((card) => (
            <Link
              key={card.src}
              href={card.href}
              className="group relative block overflow-hidden rounded-2xl aspect-[4/3]"
            >
              <Image
                src={card.src}
                alt={card.alt}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                quality={85}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              {!card.light && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none" />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <p
                  className={`text-[11px] font-semibold tracking-[0.25em] uppercase mb-2 ${
                    card.light ? 'text-amber-600' : 'text-amber-300'
                  }`}
                >
                  {card.kicker}
                </p>
                <h3
                  className={`text-2xl sm:text-3xl font-bold tracking-tight leading-tight ${
                    card.light ? 'text-[#171a20]' : 'text-white'
                  }`}
                >
                  {card.title}
                </h3>
                <p
                  className={`mt-2 text-sm sm:text-base font-light max-w-md ${
                    card.light ? 'text-[#171a20]/75' : 'text-white/80'
                  }`}
                >
                  {card.copy}
                </p>
                <span
                  className={`inline-block mt-5 px-7 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 ${
                    card.light
                      ? 'bg-[#171a20] text-white group-hover:bg-[#171a20]/85'
                      : 'bg-white text-black group-hover:bg-white/90'
                  }`}
                >
                  {card.cta}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Wide switchgear / distribution banner — the December classic */}
        <Link
          href="/services"
          className="group relative block overflow-hidden rounded-2xl mt-4 sm:mt-6 aspect-[16/9] sm:aspect-[21/9]"
        >
          <Image
            src="/images/voltka/switchgear-distribution-room.webp"
            alt="Switchgear room with distribution boards, panels and changeover switches built and commissioned by EmersonEIMS"
            fill
            sizes="100vw"
            quality={85}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent pointer-events-none" />
          <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-12">
            <p className="text-[11px] font-semibold tracking-[0.25em] text-amber-300 uppercase mb-2">
              Switchgear · Distribution · Changeovers
            </p>
            <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight max-w-xl">
              Boards Built, Wired &amp; Commissioned In-House.
            </h3>
            <p className="mt-2 text-sm sm:text-base text-white/80 font-light max-w-lg">
              Distribution boards, panels and changeover switchgear — engineered
              to spec, tested on load before handover.
            </p>
            <span className="inline-block mt-5 px-7 py-2.5 rounded-full bg-white text-black text-sm font-semibold w-fit group-hover:bg-white/90 transition-colors duration-200">
              Explore Engineering Services
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
