'use client';

/**
 * About EmersonEIMS — Awwwards-grade editorial redesign
 *
 * Same story, same content — re-set in a cinematic, premium visual
 * language: GSAP ScrollTrigger reveals, a Three.js spiral project
 * gallery (pacomepertant-style), parallax hero, animated counters,
 * and an editorial timeline. Gallery imagery is pulled from real
 * EmersonEIMS projects (see /gallery).
 */

import { useEffect, useRef, useState, Suspense, lazy, ReactNode } from 'react';
import Image from 'next/image';
import OptimizedImage from "@/components/media/OptimizedImage";
import { useReducedMotion } from '@/hooks/useReducedMotion';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import PerformanceMonitor from '@/components/performance/PerformanceMonitor';
import { usePerformanceTier } from '@/components/performance/usePerformanceTier';
import B2BCommercialBand from '@/components/b2b/B2BCommercialBand';
import { B2B_PROFILES } from '@/lib/b2b/pageProfiles';
import SpiralGallery, { SpiralGalleryItem } from '@/components/about/SpiralGallery';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const CustomCursor = lazy(() => import('@/components/interactions/CustomCursor'));

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ==================== HIGH-CONTRAST COMPLIANCE LAYER (preserved) ====================
const ContrastComplianceLayer = () => {
  const [highContrast, setHighContrast] = useState(false);

  return (
    <>
      <style>{`
        @media (prefers-contrast: more) {
          .gold-text { text-shadow: 0 0 1px black, 0 0 2px black; }
          .gold-80 { text-shadow: 0 0 2px rgba(0,0,0,0.7); }
          .card { box-shadow: 0 0 20px rgba(0,0,0,0.8) inset; }
        }
        .hc-toggle {
          position: fixed; bottom: 20px; right: 20px; z-index: 9999;
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(0,0,0,0.8); border: 2px solid #FFD700; color: #FFD700;
          font-size: 20px; cursor: pointer; display: flex; align-items: center;
          justify-content: center; opacity: 0.3; transition: opacity 0.3s;
        }
        .hc-toggle:hover { opacity: 1; }
        *:focus { outline: 2px solid #FFC000 !important; outline-offset: 2px; }
      `}</style>
      <button
        className="hc-toggle"
        onClick={() => setHighContrast(!highContrast)}
        aria-label="Toggle high contrast mode"
        title="High contrast mode (WCAG AAA)"
      >
        {highContrast ? "◐" : "◑"}
      </button>
      <style>
        {highContrast ? `
          .gold-text { text-shadow: 0 0 3px black, 0 0 5px black !important; }
          .gold-80 { text-shadow: 0 0 3px rgba(0,0,0,0.9) !important; }
          .card { box-shadow: 0 0 25px rgba(0,0,0,0.9) inset !important; }
        ` : ''}
      </style>
    </>
  );
};

// ==================== GSAP REVEAL HELPER ====================
function Reveal({
  children,
  className = '',
  y = 60,
  stagger = 0,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  stagger?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !ref.current) return;
    const el = ref.current;
    const targets = stagger > 0 ? Array.from(el.children) : el;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          delay,
          stagger,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [prefersReducedMotion, y, stagger, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// ==================== ANIMATED COUNTER ====================
function Counter({ value, suffix = '', label }: { value: number; suffix?: string; label: string }) {
  const numRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = numRef.current;
    if (!el) return;
    if (prefersReducedMotion) {
      el.textContent = `${value}${suffix}`;
      return;
    }
    const obj = { n: 0 };
    const tween = gsap.to(obj, {
      n: value,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => {
        el.textContent = `${Math.round(obj.n)}${suffix}`;
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, suffix, prefersReducedMotion]);

  return (
    <div className="text-center">
      <span ref={numRef} className="block text-5xl md:text-6xl font-bold text-amber-400 tabular-nums">
        0{suffix}
      </span>
      <span className="mt-2 block text-xs md:text-sm tracking-[0.25em] uppercase text-gray-400">{label}</span>
    </div>
  );
}

// ==================== CINEMATIC HERO ====================
function AboutHero({ reducedMotion }: { reducedMotion: boolean }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || !heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-line',
        { yPercent: 110 },
        { yPercent: 0, duration: 1.3, stagger: 0.12, ease: 'power4.out', delay: 0.2 }
      );
      gsap.fromTo('.hero-fade', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, delay: 1, ease: 'power3.out' });
      if (bgRef.current) {
        gsap.fromTo(bgRef.current, { scale: 1.18 }, { scale: 1, duration: 2.4, ease: 'power2.out' });
        gsap.to(bgRef.current, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
        });
      }
    }, heroRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={heroRef} className="relative h-[100svh] min-h-[560px] overflow-hidden flex items-end">
      {/* Parallax background */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/solar power farms.png"
          alt="EmersonEIMS — Kenya's leading energy solutions provider"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/25" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.55)_100%)]" />

      <div className="relative z-10 eims-shell w-full pb-20 md:pb-28">
        <p className="hero-fade text-[11px] md:text-xs tracking-[0.45em] uppercase text-amber-400 mb-5">
          Est. 2013 — Nairobi, Kenya
        </p>
        <h1 className="text-[13vw] md:text-[7.5vw] font-bold leading-[0.95] text-white">
          <span className="block overflow-hidden"><span className="hero-line block">About</span></span>
          <span className="block overflow-hidden">
            <span className="hero-line block bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              EmersonEIMS
            </span>
          </span>
        </h1>
        <p className="hero-fade mt-6 max-w-2xl text-base md:text-xl text-gray-300 leading-relaxed">
          B2B power &amp; engineering partner for Kenyan industry, healthcare, telecom and commercial property
        </p>
        <div className="hero-fade mt-10 flex items-center gap-3 text-white/50">
          <span className="h-px w-14 bg-amber-400/60" />
          <span className="text-[10px] tracking-[0.4em] uppercase">Scroll — Our Story</span>
        </div>
      </div>
    </section>
  );
}

// ==================== STORY / INTRO (content preserved) ====================
function StorySection() {
  return (
    <section className="relative py-28 md:py-36 bg-black overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] rounded-full bg-amber-500/5 blur-3xl" />
      <div className="eims-shell py-0 relative">
        <Reveal className="text-center mb-12">
          <OptimizedImage
            src="/images/Emerson EIMS Logo and Tagline PNG-Picsart-BackgroundRemover.png"
            alt="EmersonEIMS Logo"
            width={400}
            height={200}
            className="mx-auto max-w-xs md:max-w-md"
          />
        </Reveal>

        <Reveal>
          <p className="mx-auto max-w-4xl text-center text-2xl md:text-4xl font-light leading-snug text-gray-200">
            From a small startup in Nairobi to{' '}
            <span className="text-amber-400 font-medium">Kenya&apos;s leading energy solutions provider</span>,
            we&apos;ve transformed how businesses and communities access reliable, sustainable power.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-8 text-center text-sm md:text-base tracking-[0.3em] uppercase text-amber-400/90">
            Serving all 47 counties across Kenya with excellence since 2013
          </p>
        </Reveal>

        {/* Numbers — borrowed from our project gallery */}
        <Reveal className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6 border-y border-white/10 py-12" stagger={0.12}>
          <Counter value={500} suffix="+" label="Projects Completed" />
          <Counter value={47} label="Counties Served" />
          <Counter value={98} suffix="%" label="Client Satisfaction" />
          <Counter value={15} suffix="+" label="Years Experience" />
        </Reveal>
      </div>
    </section>
  );
}

// ==================== MISSION / VISION / VALUES (content preserved) ====================
function MissionVisionValues() {
  const cards = [
    {
      no: '01',
      title: 'Our Mission',
      accent: 'from-blue-400/40',
      body: (
        <p className="text-gray-300 leading-relaxed">
          To power Kenya&apos;s future through intelligent, sustainable energy solutions that drive economic growth and improve quality of life for all Kenyans.
        </p>
      ),
    },
    {
      no: '02',
      title: 'Our Vision',
      accent: 'from-emerald-400/40',
      body: (
        <p className="text-gray-300 leading-relaxed">
          To be a trusted B2B power and engineering partner across Kenya and East Africa, recognised for engineering integrity, reliability and measurable client outcomes.
        </p>
      ),
    },
    {
      no: '03',
      title: 'Our Values',
      accent: 'from-amber-400/40',
      body: (
        <ul className="text-gray-300 space-y-2.5 leading-relaxed">
          <li>— Excellence in execution</li>
          <li>— Innovation &amp; technology</li>
          <li>— Customer-centric approach</li>
          <li>— Sustainability &amp; responsibility</li>
          <li>— Integrity &amp; transparency</li>
        </ul>
      ),
    },
  ];

  return (
    <section className="py-28 bg-black">
      <div className="eims-shell py-0">
        <Reveal className="mb-16">
          <p className="text-[11px] tracking-[0.4em] uppercase text-amber-400/90 mb-3">What Drives Us</p>
          <h2 className="text-4xl md:text-6xl font-bold text-white">Mission. Vision. Values.</h2>
        </Reveal>

        <Reveal className="grid md:grid-cols-3 gap-5" stagger={0.15}>
          {cards.map((card) => (
            <div
              key={card.no}
              className="card group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-8 md:p-10 transition-colors duration-500 hover:border-amber-400/40"
            >
              <div className={`pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-to-br ${card.accent} to-transparent opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100`} />
              <span className="text-xs tracking-[0.35em] text-amber-400/70">{card.no}</span>
              <h3 className="mt-4 mb-5 text-2xl md:text-3xl font-bold text-white">{card.title}</h3>
              {card.body}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

// ==================== GENERATOR BRANDS (content preserved) ====================
function GeneratorBrands() {
  const brands = [
    { name: 'Cummins', description: 'Premium American engines, 20-2000 kVA', category: 'New & Used' },
    { name: 'Perkins', description: 'British reliability, industrial workhorses', category: 'New & Used' },
    { name: 'Caterpillar', description: 'Heavy-duty construction & mining', category: 'New & Used' },
    { name: 'FG Wilson', description: 'Global leader in power generation', category: 'New & Used' },
    { name: 'Volvo Penta', description: 'Swedish engineering excellence', category: 'New & Used' },
    { name: 'John Deere', description: 'Agricultural & industrial power', category: 'New & Used' },
    { name: 'Kohler', description: 'Residential & commercial solutions', category: 'New & Used' },
    { name: 'MTU', description: 'German precision engineering', category: 'New & Used' },
    { name: 'Yanmar', description: 'Japanese compact diesel specialists', category: 'New & Used' },
    { name: 'VOLTKA/Aksa', description: 'Cost-effective Turkish quality', category: 'New' },
    { name: 'Doosan', description: 'Korean industrial power solutions', category: 'New & Used' },
    { name: 'Generac', description: 'Standby & portable generators', category: 'New & Used' },
  ];

  return (
    <section className="py-28 bg-gradient-to-b from-black via-gray-950 to-black">
      <div className="eims-shell py-0">
        <Reveal className="mb-16 md:flex md:items-end md:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.4em] uppercase text-amber-400/90 mb-3">Every Major Manufacturer</p>
            <h2 className="text-4xl md:text-6xl font-bold text-white max-w-3xl">
              Generator Brands We Sell &amp; Service
            </h2>
          </div>
          <p className="mt-6 md:mt-0 max-w-sm text-gray-400">
            We supply and service all major generator brands — both NEW and quality USED units. 12+ years of expertise across every manufacturer.
          </p>
        </Reveal>

        <Reveal className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 border-t border-l border-white/10" stagger={0.05}>
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="group relative border-b border-r border-white/10 p-6 md:p-8 transition-colors duration-500 hover:bg-amber-400/[0.06]"
            >
              <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                {brand.name}
              </h3>
              <p className="mt-2 text-xs md:text-sm text-gray-500 leading-relaxed">{brand.description}</p>
              <span
                className={`mt-4 inline-block rounded-full px-2.5 py-0.5 text-[10px] tracking-wider uppercase ${
                  brand.category === 'New' ? 'bg-green-500/15 text-green-400' : 'bg-amber-500/15 text-amber-400'
                }`}
              >
                {brand.category}
              </span>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-14 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/generators"
              className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold rounded-full hover:from-amber-300 hover:to-amber-500 transition-all"
            >
              View New Generators
            </a>
            <a
              href="/generators/used"
              className="px-8 py-4 border border-amber-400/60 text-amber-300 font-bold rounded-full hover:bg-amber-400/10 transition-all"
            >
              Browse Used Inventory
            </a>
          </div>
          <p className="text-gray-500 text-sm mt-5">
            Can&apos;t find your brand? We service ALL generator makes and models. Call +254 727 631 316
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ==================== COMPANY TIMELINE (content preserved, editorial) ====================
function CompanyTimeline({ reducedMotion }: { reducedMotion: boolean }) {
  const timeline = [
    { year: "2013", event: "Founded", description: "EmersonEIMS established in Nairobi, Kenya" },
    { year: "2015", event: "Expansion", description: "Expanded to 10 counties across Kenya" },
    { year: "2017", event: "Solar Division", description: "Launched comprehensive solar solutions" },
    { year: "2019", event: "Award Recognition", description: "Recognized as top energy solutions provider" },
    { year: "2021", event: "47 Counties", description: "Full coverage across all 47 Kenyan counties" },
    { year: "2023", event: "Innovation Hub", description: "Launched diagnostics and analytics platform" },
    { year: "2024", event: "Digital Transformation", description: "Awwwards-level website launch" },
  ];

  const lineRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || !lineRef.current || !wrapRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top',
          ease: 'none',
          scrollTrigger: { trigger: wrapRef.current, start: 'top 75%', end: 'bottom 60%', scrub: true },
        }
      );
    }, wrapRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="py-28 bg-black">
      <div className="eims-shell py-0">
        <Reveal className="mb-20 text-center">
          <p className="text-[11px] tracking-[0.4em] uppercase text-amber-400/90 mb-3">2013 — Today</p>
          <h2 className="text-4xl md:text-6xl font-bold text-white">Our Journey</h2>
          <p className="mt-5 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Over a decade of powering Kenya with innovative energy solutions
          </p>
        </Reveal>

        <div ref={wrapRef} className="relative max-w-4xl mx-auto">
          {/* Scroll-drawn spine */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-white/10">
            <div ref={lineRef} className="h-full w-full bg-gradient-to-b from-amber-300 to-amber-600" />
          </div>

          <div className="space-y-14 md:space-y-20">
            {timeline.map((item, index) => (
              <Reveal key={item.year} y={50}>
                <div className={`relative flex pl-12 md:pl-0 ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
                  <span className="absolute left-4 md:left-1/2 top-2 -translate-x-1/2 h-3 w-3 rounded-full bg-amber-400 ring-4 ring-amber-400/20" />
                  <div className={`md:w-[44%] ${index % 2 === 0 ? 'md:text-right md:pr-4' : 'md:text-left md:pl-4'}`}>
                    <span className="text-5xl md:text-6xl font-bold text-white/10 leading-none select-none">
                      {item.year}
                    </span>
                    <h3 className="mt-1 text-xl md:text-2xl font-bold text-amber-300">{item.event}</h3>
                    <p className="mt-2 text-gray-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== VIDEO SHOWCASE (content preserved) ====================
function VideoShowcase() {
  return (
    <section className="py-28 bg-gradient-to-b from-black via-gray-950 to-black">
      <div className="eims-shell py-0">
        <Reveal className="text-center mb-14">
          <p className="text-[11px] tracking-[0.4em] uppercase text-amber-400/90 mb-3">On Site</p>
          <h2 className="text-4xl md:text-6xl font-bold text-white">See Our Work in Action</h2>
          <p className="mt-5 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Real projects, real results. Watch how we deliver power solutions across Kenya.
          </p>
        </Reveal>

        <Reveal className="relative max-w-5xl mx-auto" y={80}>
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_40px_120px_-20px_rgba(251,191,36,0.15)] group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <video
              controls
              preload="metadata"
              className="w-full aspect-video object-cover"
              poster="/images/solar%20power%20farms.png"
            >
              <source src="/videos/FOR TRIALS IN KADENCE.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="mt-6 text-center text-gray-400">
            <span className="text-amber-400 font-semibold">EmersonEIMS</span> — Delivering reliable power solutions that keep Kenya moving forward
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ==================== PAGE ====================
export default function AboutUsPage() {
  const prefersReducedMotion = useReducedMotion();
  const { isLite } = usePerformanceTier();
  const reducedMotion = prefersReducedMotion || isLite;

  // Real EmersonEIMS projects — borrowed from /gallery
  const spiralItems: SpiralGalleryItem[] = [
    { src: '/images/ST-AUSTIN-4K-CINEMATIC.jpg', title: 'St. Austin Academy — 50kVA Perkins', subtitle: 'Nairobi, Kenya' },
    { src: '/images/KIVUKONI-4K-CINEMATIC.jpg', title: 'Kivukoni School — 60kVA Cummins', subtitle: 'Nairobi, Kenya' },
    { src: '/images/BIGOT-FLOWERS-4K-CINEMATIC.jpg', title: 'Bigot Flowers — 300kVA Caterpillar', subtitle: 'Naivasha, Kenya' },
    { src: '/images/NTSA-4K-CINEMATIC.jpg', title: 'NTSA Headquarters — 300kVA Atlas Copco', subtitle: 'Nairobi, Kenya' },
    { src: '/images/SANERGY-FG-WILSON-4K-CINEMATIC.jpg', title: 'Sanergy — 250kVA FG Wilson', subtitle: 'Nairobi, Kenya' },
    { src: '/images/GREENHEART-KILIFI-4K-CINEMATIC.jpg', title: 'Greenheart Resort — 44kVA Cummins', subtitle: 'Kilifi, Kenya' },
    { src: '/images/voltka/voltka-vks44-hero-profile.webp', title: 'VOLTKA VKS44 — Cummins Powered', subtitle: 'New Fleet, Nairobi' },
    { src: '/images/voltka/voltka-warehouse-fleet.webp', title: 'Generator Fleet — Ready Stock', subtitle: 'Nairobi Warehouse' },
    { src: '/images/solar power farms.png', title: 'Solar Power Farms', subtitle: 'Turkana, Kenya' },
    { src: '/images/switchgear-panel.png', title: 'Medium-Voltage Switchgear', subtitle: 'Athi River, Kenya' },
    { src: '/images/steel-fabrication-workshop.png', title: 'Steel Fabrication Workshop', subtitle: 'Nairobi, Kenya' },
    { src: '/images/ups-power-protection-system.png', title: 'Enterprise UPS — N+1 Redundancy', subtitle: 'Nairobi CBD' },
  ];

  return (
    <ErrorBoundary>
      <PerformanceMonitor />

      {!isLite && (
        <Suspense fallback={null}>
          <CustomCursor enabled={!prefersReducedMotion} />
        </Suspense>
      )}

      <main className="eims-section min-h-screen relative bg-black">
        {/* VideoObject Schema for SEO (preserved) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'VideoObject',
              name: 'EmersonEIMS - Our Work in Action Kenya',
              description: 'Real projects, real results. Watch how EmersonEIMS delivers B2B power solutions across Kenya — generators, solar, UPS and engineering.',
              thumbnailUrl: 'https://www.emersoneims.com/images/solar%20power%20farms.png',
              uploadDate: '2024-01-01T00:00:00+03:00',
              contentUrl: 'https://www.emersoneims.com/videos/FOR%20TRIALS%20IN%20KADENCE.mp4',
              embedUrl: 'https://www.emersoneims.com/about-us',
              duration: 'PT45S',
              publisher: {
                '@type': 'Organization',
                name: 'Emerson EiMS',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://www.emersoneims.com/images/Emerson%20EIMS%20Logo%20and%20Tagline%20PNG-Picsart-BackgroundRemover.png',
                  width: 400,
                  height: 200
                }
              },
              potentialAction: {
                '@type': 'WatchAction',
                target: 'https://www.emersoneims.com/about-us'
              }
            })
          }}
        />

        <ContrastComplianceLayer />

        {/* Cinematic hero */}
        <AboutHero reducedMotion={reducedMotion} />

        {/* Three.js + GSAP spiral project gallery — our story, told in pictures.
            Only OS-level reduced-motion (not the perf tier) disables the spiral. */}
        <SpiralGallery
          items={spiralItems}
          eyebrow="Our Story — In Pictures"
          heading="Our Work in Pictures"
          reducedMotion={prefersReducedMotion}
        />

        {/* Story + numbers */}
        <StorySection />

        {/* B2B Commercial Band (preserved) */}
        <div className="eims-shell py-0">
          <B2BCommercialBand profile={B2B_PROFILES.aboutUs} />
        </div>

        {/* Mission, Vision, Values */}
        <MissionVisionValues />

        {/* Generator Brands We Sell & Service */}
        <GeneratorBrands />

        {/* Company Timeline */}
        <CompanyTimeline reducedMotion={reducedMotion} />

        {/* Video Showcase */}
        <VideoShowcase />

        {/* CTA Section (content preserved) */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/25 via-black to-amber-900/25" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] rounded-full bg-amber-500/10 blur-3xl" />
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <Reveal>
              <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Join Us in Powering{' '}
                <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Kenya&apos;s Future
                </span>
              </h2>
              <p className="mt-6 text-xl text-gray-300">
                Ready to upgrade your power and engineering systems? Let&apos;s scope it together.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="px-10 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold rounded-full hover:from-amber-300 hover:to-amber-500 transition-all transform hover:scale-105"
                >
                  Get in Touch
                </a>
                <a
                  href="/services"
                  className="px-10 py-4 border border-amber-400/60 text-amber-300 font-bold rounded-full hover:bg-amber-400/10 transition-all"
                >
                  Explore Services
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </ErrorBoundary>
  );
}
