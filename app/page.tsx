// app/page.tsx - ULTRA FAST HOMEPAGE
// Target: <500ms FCP, <100ms TTFB, 100/100 Lighthouse
// Strategy: Static Server Component + lazy Client islands
// ═══════════════════════════════════════════════════════════════════════════════

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';

// Client wrapper for interactive sections
import HomePageClient from '@/components/home/HomePageClient';
import HubFeatureBlock from '@/components/home/HubFeatureBlock';
import SolutionsBySector from '@/components/home/SolutionsBySector';
import VoltkaCinematicShowcase from '@/components/home/VoltkaCinematicShowcase';
import { VoltkaBillboard, VoltkaDuoGrid } from '@/components/home/VoltkaShowroomGrid';
import CinematicVideoSection from '@/components/home/CinematicVideoSection';
// Ambient hero FX layer (Three.js particles, post-mount) and the below-the-fold
// rotating WebGL ring are code-split so their JS stays out of the homepage entry
// bundle — protecting LCP/FCP. ssr stays on (default), so server markup is
// unchanged; this only defers the client chunk. Homepage layout untouched.
const HeroCinematicFX = dynamic(() => import('@/components/home/HeroCinematicFX'));
const RingGallery = dynamic(() => import('@/components/home/RingGallery'), {
  loading: () => <div className="bg-black h-[100svh] min-h-[620px]" />,
});
import HomeEngineeringAuthority from '@/components/home/HomeEngineeringAuthority';
import AIToolsPromo from '@/components/ai/AIToolsPromo';
/*
 * FIVE HOMEPAGE SECTIONS WERE RENDERING NOTHING.
 *
 * components/home/{CumminsShopNow,FinancingCalculator,AIAdvantageHero,
 * SocialProofWidget,CountyCoverageMap}.tsx are each three lines long:
 *     return <div className="py-20 px-4 bg-black" />;
 * They were created as empty placeholders in 8211b03 ("Resolve Vercel build
 * errors ... missing components") to satisfy these imports and get a failing
 * build through, and were never filled in. Nothing was deleted — but the
 * homepage has been shipping roughly 800px of blank black in its most valuable
 * region ever since, and the real implementations sat unimported in
 * app/components/home/.
 *
 * Four are wired below. ONE is deliberately not, and must never be:
 *
 *   SocialProofWidget — contains four FABRICATED testimonials attributed to
 *     invented named individuals ("Dr. James Kipchoge", "Sarah Mwangi", ...),
 *     each flagged `verified: true`, with invented metrics ("99.8% uptime SLA
 *     met", "45% cost reduction") and a named hospital director saying our
 *     service "saved lives". The owner's position is explicit: reviews are
 *     earned through work actually done. Real testimonials would be welcome
 *     here; these are not testimonials, they are fiction.
 *
 * CumminsShopNow WAS held back for three reasons, all now resolved: the
 * "3 Years" warranty is corrected to the owner-confirmed two years; the
 * hardcoded stock counts (7/5/4/3), which no inventory system produced and
 * which would be wrong the first time a set sold, now read "Ask for
 * availability"; and the prices — a 62 kVA at KES 1,580,000 against a
 * published 60 kVA range of 1,100,000–1,350,000 — are no longer written in
 * that file at all. Each card now reads its band from GENERATOR_SIZES, the
 * same source /generators renders, so the two cannot drift apart.
 *
 * The four below load via next/dynamic so their client JS is split out of the
 * entry bundle — measured script evaluation on this page is already 8.8s under
 * Lighthouse's 4x CPU throttle, so adding three client components eagerly
 * would trade one defect for another. ssr stays on (default), so the markup is
 * still server-rendered and crawlable.
 */
const AIAdvantageHero = dynamic(() => import('@/app/components/home/AIAdvantageHero'));
const CumminsShopNowReal = dynamic(() => import('@/app/components/home/CumminsShopNow'));
const FinancingCalculatorReal = dynamic(() => import('@/app/components/home/FinancingCalculator'));
const CountyCoverageMapReal = dynamic(() => import('@/app/components/home/CountyCoverageMap'));
import ServicesLeadershipMatrix from '@/components/home/ServicesLeadershipMatrix';
import TradeInCalculator from '@/components/home/TradeInCalculator';
import { COMMERCIAL_POLICY } from '@/lib/commercial/policy';
import SocialProofWidget from '@/components/home/SocialProofWidget';
import RecentWorkSection from '@/components/home/RecentWorkSection';
import ClientTestimonials from '@/components/home/ClientTestimonials';

// Real EmersonEIMS project photography (see /gallery) for the rotating
// 3D ring showcase — sister piece to the About page spiral gallery.
const RING_GALLERY_ITEMS = [
  { src: '/images/ST-AUSTIN-4K-CINEMATIC.jpg', title: 'St. Austin Academy — 50kVA Perkins', subtitle: 'Nairobi, Kenya' },
  { src: '/images/KIVUKONI-4K-CINEMATIC.jpg', title: 'Kivukoni School — 60kVA Cummins', subtitle: 'Nairobi, Kenya' },
  { src: '/images/BIGOT-FLOWERS-4K-CINEMATIC.jpg', title: 'Bigot Flowers — 300kVA Caterpillar', subtitle: 'Naivasha, Kenya' },
  { src: '/images/NTSA-4K-CINEMATIC.jpg', title: 'NTSA Headquarters — 300kVA Atlas Copco', subtitle: 'Nairobi, Kenya' },
  { src: '/images/SANERGY-FG-WILSON-4K-CINEMATIC.jpg', title: 'Sanergy — 250kVA FG Wilson', subtitle: 'Nairobi, Kenya' },
  { src: '/images/GREENHEART-KILIFI-4K-CINEMATIC.jpg', title: 'Greenheart Kilifi (Real Estate) — 44kVA Cummins', subtitle: 'Kilifi County, Kenya' },
  { src: '/images/voltka/voltka-vks44-hero-profile.webp', title: 'VOLTKA VKS44 — Cummins Powered', subtitle: 'New Fleet, Nairobi' },
  { src: '/images/voltka/voltka-warehouse-fleet.webp', title: 'Generator Fleet — Ready Stock', subtitle: 'Nairobi Warehouse' },
  { src: '/images/voltka/voltka-vks44-night-delivery.webp', title: 'Night Delivery — 48hr Response', subtitle: 'Emergency Dispatch' },
  { src: '/images/voltka/ats-changeover-panel-4k.webp', title: 'ATS Changeover Commissioning', subtitle: 'Automatic Transfer' },
  { src: '/images/solar power farms.png', title: 'Solar Power Farms', subtitle: 'Turkana, Kenya' },
  { src: '/images/solar for flower farms.png', title: 'Solar for Flower Farms', subtitle: 'Naivasha, Kenya' },
  { src: '/images/switchgear-panel.png', title: 'Medium-Voltage Switchgear', subtitle: 'Athi River, Kenya' },
  { src: '/images/ups-power-protection-system.png', title: 'Enterprise UPS — N+1 Redundancy', subtitle: 'Nairobi CBD' },
  { src: '/images/steel-fabrication-workshop.png', title: 'Steel Fabrication Workshop', subtitle: 'Nairobi, Kenya' },
  { src: '/images/borehole-pump-installation.png', title: 'Borehole Pump Installation', subtitle: 'Various Counties' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STATIC SEO METADATA - Rendered at build time
// ═══════════════════════════════════════════════════════════════════════════════
export const metadata: Metadata = {
  metadataBase: new URL('https://www.emersoneims.com'),
  /*
   * 58 characters. The previous title ran 83 against roughly 60 rendered, so
   * "| 2-Year Warranty" was written and never shown. It also opened with the
   * brand — redundant for anyone who searched the brand, and irrelevant to
   * anyone who did not. This leads with what is sold and where.
   */
  title: "Generators, Solar & UPS in Kenya",
  description: "Generators, solar, UPS, motors, boreholes and incinerators for Kenyan industry, healthcare and telecom. Nationwide service. Call +254768860665.",
  openGraph: {
    title: "EmersonEIMS | B2B Power & Engineering Partner — Kenya",
    description: "Engineering-grade generators, solar, UPS, motors, HVAC, boreholes & incinerators. SLA maintenance, 24/7 emergency response, nationwide mobile workshop. Cummins, Perkins & FG Wilson specialist. AI-assisted diagnostic and design tools.",
    images: ['/images/tnpl-diesal-generator-1000x1000-1920x1080.webp'],
    type: 'website',
    locale: 'en_KE',
    url: 'https://www.emersoneims.com',
    siteName: 'EmersonEIMS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EmersonEIMS | B2B Power & Engineering — Kenya',
    description: 'Generators, solar, UPS, HVAC, boreholes, incinerators. Cummins specialist. SLA maintenance, 24/7 emergency response, nationwide mobile workshop. Call +254768860665',
    images: ['/images/tnpl-diesal-generator-1000x1000-1920x1080.webp'],
  },
  alternates: {
    canonical: 'https://www.emersoneims.com',
  },
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

// ═══════════════════════════════════════════════════════════════════════════════
// STATIC SECTIONS - Rendered instantly at build time (no JS needed)
// ═══════════════════════════════════════════════════════════════════════════════

function StaticHeroFallback() {
  return (
    <section className="hero-full relative min-h-screen bg-black overflow-hidden content-auto">
      {/* Cinematic background — video plays inline + autoplay-muted (HTML5 native,
          no JS needed). Image stays as poster + fallback for slow connections,
          reduced-data, and SEO. Renders at SSR so the client sees the video
          immediately without waiting for hydration. */}
      <div className="absolute inset-0">
        {/* Reserve space for hero image to prevent CLS. Use explicit width/height for LCP. */}
        <Image
          src="/images/tnpl-diesal-generator-1000x1000-1920x1080.webp"
          alt="EmersonEIMS Power Solutions — B2B Generator, Solar & Engineering Partner, Kenya"
          width={1920}
          height={1080}
          priority
          fetchPriority="high"
          // PERF (audit 2026-07-20): DELIBERATELY LEFT AT 90.
          // 85 was tried here and reverted. Measured on the live pipeline,
          // w=1920: q90 = 39 KB, q85 = 39 KB — a 0% saving, because this
          // source file is already heavily compressed and re-encoding it
          // lower yields nothing. (The same change on the VOLTKA showcase art
          // is worth -21% to -24%, so it was kept there.) Dropping quality on
          // the LCP element for no measured benefit is a pure downside.
          quality={90}
          className="object-cover w-full h-full [filter:brightness(1.14)_contrast(1.07)_saturate(1.15)]"
          style={{ aspectRatio: '16/9', width: '100%', height: '100%' }}
          sizes="100vw"
        />
        {/* Hero video — TABLET+ ONLY (md↑, ≥768px).
            THE GATE IS ON THE <source>, NOT ONLY THE CLASS. `hidden md:block`
            and preload="none" were both already here and neither stopped the
            download: autoPlay overrides preload, and display:none does not
            prevent a video from fetching. Measured on the live homepage under
            Lighthouse mobile throttling, this file was pulled anyway —
            3,700KB over 10,551ms — which saturated the connection and starved
            the hero image. LCP was 7.6s of which 6,655ms (87%) was Render
            Delay, while the image's own load time was ~0.
            A media attribute on <source> is the fix: below 768px NO source
            matches, so the element has nothing to fetch. No JavaScript, and
            desktop is unchanged.

            THE poster ATTRIBUTE IS ALSO GONE. It named the RAW original of the
            same photograph the <Image> above already renders, and a poster
            downloads even when the video is display:none — measured on mobile
            as a second 39KB fetch of a picture the optimiser was serving at
            35KB a few bytes away, competing with the LCP image on a throttled
            connection. The Image sits directly behind the video, so before
            playback it is exactly what the viewer sees. The poster was drawing
            the same picture twice. */}
        <video
          className="absolute inset-0 w-full h-full object-cover hidden md:block [filter:brightness(1.14)_contrast(1.07)_saturate(1.15)]"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        >
          <source src="/videos/FOR%20TRIALS%20IN%20KADENCE.mp4" type="video/mp4" media="(min-width: 768px)" />
        </video>
        {/* Lighter grade than before (70/40 → 55/25): keeps text legible while
            letting the 4K-graded footage read bright and cinematic. */}
        {/* Scrim over the hero video.
            The middle stop was black/25, and the H1 sits exactly there. That
            was survivable while the video showed a night city, but the footage
            also runs through a bright sunset, and amber type over lit orange
            cloud came out close to unreadable — screenshotted at 1440x900 to
            confirm. Because the background is video, contrast cannot be judged
            from one frame: the scrim has to hold for the BRIGHTEST frame, not
            the average one. Raised to /50 through the middle, which keeps the
            footage clearly visible while the headline stays legible
            throughout. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(251,191,36,0.22),transparent_60%)]" />
      </div>

      {/* Awwwards ambient layer — GSAP parallax + lazy Three.js embers.
          Loads after idle; zero impact on LCP, content untouched. */}
      <HeroCinematicFX />

      {/* Static hero content - Apple-style typography & spacing */}
      <div className="relative z-20 h-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center py-section">
        <div className="max-w-content fade-in-up">
          {/* Badge - Apple-style pill */}
          <div className="inline-flex items-center gap-2 mb-6 sm:mb-8 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm text-amber-300 tracking-wider uppercase font-medium">Generator Sales, Installation & 24/7 Repair · All 47 Counties</span>
          </div>

          {/* Hero Title - Apple-style display typography */}
          {/* H1 — revised twice, each time for the same reason.
              2026-07-20: was "POWER & BUILD / REDEFINED BY AI", which named no
              service and no place, so the strongest on-page signal on the site
              earned nothing. Line one was changed to name the products.
              2026-08-27: line two still said "POWER, REDEFINED BY AI". That is
              the amber line — the largest, brightest text on the page — and it
              described a technology rather than a business. A visitor landing
              cold could read the biggest words here and still not know we sell,
              install and repair machines.

              LENGTH IS A DESIGN CONSTRAINT HERE, NOT A PREFERENCE. The first
              replacement read "SOLD, INSTALLED, SERVICED — KENYA-WIDE" (38
              chars) and was shipped without anyone looking at the rendered
              page. Measured afterwards in a real browser it wrapped to FOUR
              lines at 390px and broke mid-word as "KENYA-/WIDE" at 1440px,
              making the H1 252px tall on a phone and 420px on desktop, which
              pushed the subtitle and both call-to-action buttons below the
              fold on every screen size.

              The rule: line two must be about as long as line one (24 chars),
              so each wraps to two lines and the block stays a tidy rectangle.
              "SOLD & SERVICED IN KENYA" is 24 characters, carries the
              commercial verbs and the place name, and restores the fold.
              Anything longer must be measured in a browser before it ships. */}
          {/* text-balance: without it the browser fills each line greedily and
              broke line one as "GENERATORS · SOLAR ·" / "UPS", stranding one
              word under a dangling separator. Balancing distributes the words
              evenly across the lines instead, which is what the two-line
              cadence was designed around. */}
          <h1 className="apple-display mb-6 sm:mb-8 text-balance">
            <span className="block text-white">GENERATORS · SOLAR · UPS</span>
            <span className="block text-amber-500">SOLD &amp; SERVICED IN KENYA</span>
          </h1>

          {/* Subtitle - Apple-style subheadline.
              Rebalanced to lead with the core power business (the brief's
              priority order: emergency repair, then sales/installation, then
              solar/UPS/electrical) while keeping every AI tool named — the
              tools keep their homepage link equity, they simply no longer
              open the pitch. */}
          <p className="apple-subheadline text-gray-200 mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
            Kenya’s B2B power and engineering partner — generator sales, installation
            and 24/7 emergency repair, plus solar, UPS, boreholes and buildings across
            all 47 counties.
            <span className="text-amber-400 font-medium"> Engineering-grade</span> reliability,
            now with Generator Oracle, Solar Genius Pro, AquaScan Pro, Building Suite Pro
            &amp; the Solar &amp; UPS Intelligence Hub.
          </p>

          {/* CTAs - Apple-style buttons with mobile optimization */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full sm:w-auto px-4 sm:px-0">
            <Link
              href="/contact?type=emergency"
              className="w-full sm:w-auto px-6 sm:px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-base sm:text-lg rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-amber-500/25 tap-scale touch-target"
            >
              Request Emergency Power
            </Link>
            <a
              href="https://wa.me/254768860665?text=Hi%20EmersonEIMS%2C%20I%20need%20help%20with%20generator%2Fsolar%20services"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 sm:px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-base sm:text-lg rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25 tap-scale touch-target flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Now
            </a>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-6 sm:px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 tap-scale touch-target"
            >
              Talk to Expert
            </Link>
          </div>

          {/* Trust Indicators — only verifiable, on-policy claims kept.
              Removed "500+ Projects" and "98.7% Uptime" — both lacked
              provenance and violate the project data policy. */}
          <div className="mt-10 sm:mt-12 grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-4 sm:gap-6 text-gray-400 text-sm">
            {/* "47 Counties Covered" alone did not say HOW. The nationwide
                mobile workshop is a real, owner-confirmed capability (2026-07-20)
                and a genuine differentiator — most competitors cannot service
                up-country plant on site — yet it appeared exactly ONCE on the
                whole website before this. Stated here rather than as a new
                section, so it gains top-of-page visibility without adding to
                the homepage's existing length. */}
            <span className="flex items-center justify-center gap-1">✓ Mobile Workshop · 47 Counties</span>
            <span className="flex items-center justify-center gap-1">✓ 24/7 Emergency Response</span>
            {/* "2-Year Warranty" stood here as a site-wide promise applied to
                new, used and refurbished sets alike, with no approved schedule
                behind it. See lib/commercial/policy.ts for why the mechanism is
                stated instead of a duration. */}
            <span className="flex items-center justify-center gap-1">✓ {COMMERCIAL_POLICY.warrantyShort}</span>
            <span className="flex items-center justify-center gap-1">✓ SLA Maintenance</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator - Hidden on mobile for performance */}
      <div className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator">
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}

function StaticStatsSection() {
  // Data-policy compliance (audit 2026-05-09): replaced fabricated
  // headline counters ("500+ projects", "98.7% uptime", "12+ years")
  // with claims that are either contractual (warranty / SLA window) or
  // verifiable public facts (Kenya county count, kVA range we install).
  // No unlabelled estimates per /memories/data-policy.md.
  const stats = [
    { num: '47', label: 'Counties Covered', icon: '🌍' },
    { num: '24/7', label: 'Emergency Response', icon: '🚨' },
    { num: '2-Year', label: 'Warranty', icon: '🛡️' },
    { num: '20–2000', label: 'kVA Range Installed', icon: '⚡' },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-black content-auto">
      <div className="max-w-full-content mx-auto px-4 sm:px-6 lg:px-8">
        <p className="apple-caption text-center text-amber-500 mb-8 sm:mb-12">Service Standards</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/20 transition-all duration-300"
            >
              <span className="text-3xl sm:text-4xl mb-3 sm:mb-4 block" aria-hidden="true">{stat.icon}</span>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-500 mb-1 sm:mb-2 tracking-tight">{stat.num}</div>
              <div className="text-sm sm:text-base lg:text-lg text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StaticFeaturesSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-black content-auto">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <p className="apple-caption text-amber-500 mb-4 sm:mb-6">Our Promise</p>
        <h2 className="apple-headline text-white mb-6 sm:mb-8">
          Engineering Excellence
          <br />
          <span className="text-amber-500">Meets Reliability</span>
        </h2>
        <p className="apple-body text-gray-300 max-w-3xl">
          Powering East Africa's critical infrastructure across
          manufacturing, healthcare, telecom and commercial property.
          From <span className="text-amber-400">20kVA</span> commercial systems to <span className="text-amber-400">2000kVA</span> industrial installations,
          installed, commissioned and backed by SLA-bound maintenance.
        </p>
      </div>
    </section>
  );
}

function AITechnologyShowcase() {
  const products = [
    {
      id: 'generator-oracle',
      title: 'Generator Oracle',
      subtitle: 'AI Diagnostic System',
      // Audit 2026-07-18: removed a duplicate `description` key (pre-existing —
      // the first value was silently discarded by JS and flagged TS1117).
      description: 'AI-assisted diagnostic assistant that analyses generator symptoms, looks them up against a manufacturer-curated fault-code database, and connects you with certified technicians.',
      features: ['Symptom-based Diagnosis', 'Voice-Activated', 'Fault Code Database', 'Real-time Analysis'],
      icon: '🔧',
      gradient: 'from-amber-500 to-orange-600',
      link: '/generator-oracle',
      badge: 'AI-POWERED'
    },
    {
      id: 'borehole-analyzer',
      title: 'AquaScan Pro',
      subtitle: 'AI Borehole Analyzer - 195+ Countries',
      // "no site visits needed" removed: it contradicted AquaScan's own
      // methodology, which requires a field survey (ERT + WRA approval) before
      // any drilling. The tool screens sites BEFORE that survey.
      description: 'Desktop borehole pre-feasibility using NASA GLDAS, satellite imagery and terrain data. Screens a site before the statutory hydrogeological survey — it does not replace it.',
      features: ['195+ Countries', 'NASA GLDAS Data', 'Satellite Rock Mapping', 'Virtual VES/ERT'],
      icon: '💧',
      gradient: 'from-cyan-500 to-teal-500',
      link: '/services/borehole-pumps',
      badge: "AI BOREHOLE TOOL"
    },
    {
      id: 'solar-school',
      title: 'Solar Solution School',
      subtitle: '10 AI Engines',
      description: 'Solar design platform with 3D modelling, AI-assisted optimisation and voice control. Country presets cover 15 African markets.',
      features: ['3D AI Design', 'Voice Commands', '25-Year Predictions', '15 Countries'],
      icon: '☀️',
      gradient: 'from-blue-500 to-cyan-500',
      link: '/solar',
      /*
       * badge was 'WORLD #1'. No independent ranking, award or review body
       * has placed this tool first at anything, so the claim could not be
       * substantiated if asked. Replaced with a fact about the tool that is
       * checkable on the page it links to.
       */
      badge: '15 AFRICAN MARKETS'
    },
    {
      id: 'building-suite-pro',
      title: 'Building Suite Pro',
      subtitle: 'AI Construction & Engineering Suite',
      description: 'Global Construction Intelligence Platform — BIM, structural & MEP engineering, QS / BOQ, healthcare & high-rise compliance, professional reports across 28 countries.',
      features: ['BIM + 3D Studio', 'AI QS / BOQ', 'MEP Clash + High-Rise', '28 Countries'],
      icon: '🏗️',
      gradient: 'from-purple-500 to-pink-500',
      link: '/solutions/building',
      badge: 'AI'
    },
    {
      id: 'solar-ups-hub',
      title: 'Solar & UPS Intelligence Hub',
      subtitle: 'Sizing · Audit · Diagnostics · UPS Cockpit',
      description: 'One workspace for solar & UPS engineers — smart sizing, quote audit, product intelligence, UPS live lab and the case library. Every value carries its unit. A–G suitability grading.',
      features: ['Smart Sizing', 'UPS Live Lab', 'Quote Audit AI', 'Diagnostics'],
      icon: '🛠️',
      gradient: 'from-emerald-500 to-cyan-500',
      link: '/hub',
      badge: 'HUB'
    }
  ];

  const achievements = [
    { number: '11', label: 'AI Engines', icon: '🤖' },
    { number: '47', label: 'Counties Covered', icon: '🌍' },
    { number: '24/7', label: 'Emergency Response', icon: '🚨' },
    { number: '2-Year', label: 'Warranty', icon: '🛡️' },
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-black via-slate-900 to-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            AI-Powered Technology
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Advanced Solutions
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              Powered by AI
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {/* "Industry-leading" and "redefining what is possible" are unmeasurable
                superlatives. Replaced with what the tools actually do, which is more
                persuasive to an engineer and is verifiable by using them. */}
            Engineering tools built for African conditions — generator fault diagnosis,
            solar design and load sizing, free to use on this site.
          </p>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 sm:mb-16">
          {achievements.map((stat, i) => (
            <div key={i} className="text-center p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-2xl sm:text-3xl mb-2 block">{stat.icon}</span>
              <div className="text-2xl sm:text-3xl font-bold text-amber-500">{stat.number}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Product Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8">
          {products.map((product) => (            <Link
              key={product.id}
              href={product.link}
              className="group relative bg-white/5 backdrop-blur rounded-2xl border border-white/10 hover:border-amber-500/50 transition-all duration-500 overflow-hidden"
            >
              {/* Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${product.gradient} text-white`}>
                  {product.badge}
                </span>
              </div>

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

              {/* Content */}
              <div className="relative p-6 sm:p-8">
                {/* Icon */}
                <div className="text-5xl sm:text-6xl mb-4">{product.icon}</div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{product.title}</h3>
                <p className={`text-sm font-medium bg-gradient-to-r ${product.gradient} bg-clip-text text-transparent mb-3`}>
                  {product.subtitle}
                </p>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-6">{product.description}</p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {product.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                      <span className="text-green-400">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className={`flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${product.gradient} bg-clip-text text-transparent group-hover:gap-4 transition-all`}>
                  Explore {product.title}
                  <span className="text-amber-500">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-gray-400 mb-6">
            Experience the future of power solutions with EmersonEIMS
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link
              href="/generator-oracle"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold rounded-full hover:scale-105 transition-all shadow-lg"
            >
              Try Generator Oracle Free
            </Link>
            <Link
              href="/services/borehole-pumps"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold rounded-full hover:scale-105 transition-all shadow-lg"
            >
              AI Borehole Site Analysis
            </Link>
            <Link
              href="/solar"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-full hover:scale-105 transition-all shadow-lg"
            >
              Explore Solar AI
            </Link>
            <Link
              href="/solutions/building"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full hover:scale-105 transition-all shadow-lg"
            >
              Open Building Suite Pro
            </Link>
            <Link
              href="/hub"
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-full hover:scale-105 transition-all shadow-lg"
            >
              Open Solar &amp; UPS Hub
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function StaticCountiesSection() {
  const counties = [
    { name: 'Nairobi', slug: 'nairobi', highlight: true },
    { name: 'Mombasa', slug: 'mombasa', highlight: true },
    { name: 'Kisumu', slug: 'kisumu', highlight: true },
    { name: 'Nakuru', slug: 'nakuru', highlight: true },
    { name: 'Kiambu', slug: 'kiambu' },
    { name: 'Machakos', slug: 'machakos' },
    { name: 'Kilifi', slug: 'kilifi' },
    { name: 'Uasin Gishu', slug: 'uasin-gishu' },
    { name: 'Kajiado', slug: 'kajiado' },
    { name: 'Nyeri', slug: 'nyeri' },
    { name: 'Meru', slug: 'meru' },
    { name: 'Kakamega', slug: 'kakamega' },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-black to-gray-900/50 content-auto">
      <div className="max-w-full-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <span className="apple-caption text-cyan-400 mb-3 sm:mb-4 block">Nationwide Coverage</span>
          <h2 className="apple-headline text-white">
            Generator Services Across <span className="text-amber-500">All 47 Counties</span>
          </h2>
        </div>

        {/* Mobile-optimized county grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-6 sm:mb-8">
          {counties.map((county) => (
            <Link
              key={county.slug}
              href={`/kenya/${county.slug}`}
              className={`block p-3 sm:p-4 rounded-xl border text-center transition-all duration-300 tap-scale touch-target ${
                county.highlight
                  ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/15'
                  : 'bg-white/5 border-white/10 hover:border-cyan-400/50 hover:bg-white/10'
              }`}
            >
              <span className={`text-sm sm:text-base font-medium ${county.highlight ? 'text-amber-400' : 'text-white'}`}>
                {county.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/kenya"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 tap-scale touch-target"
          >
            View All 47 Counties
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT - Server Component (instant render)
// ═══════════════════════════════════════════════════════════════════════════════

export default function HomePage() {
  return (
    <div className="bg-black">
      {/* Structured Data for SEO - Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            /* Same @id as the LocalBusiness node in app/layout.tsx so the graph
               resolves to one company. Without it the homepage published two
               unlinked entities describing the same business. */
            '@id': 'https://www.emersoneims.com/#organization',
            name: 'EmersonEIMS',
            description: "B2B power-engineering partner for industry, healthcare, telecom and commercial property in Kenya. Generators, solar, UPS, motors, HVAC, boreholes and incinerators, with SLA-backed maintenance and 24/7 emergency response, reaching all 47 counties by mobile workshop. Includes engineering intelligence tools (Generator Oracle, Solar Genius Pro, AquaScan Pro, Building Suite Pro).",
            url: 'https://www.emersoneims.com',
            logo: 'https://www.emersoneims.com/emerson-eims-logo.png',
            image: 'https://www.emersoneims.com/images/tnpl-diesal-generator-1000x1000-1920x1080.webp',
            // foundingDate, numberOfEmployees, slogan and alternateName removed
            // 2026-05-09: data-policy.md — do not assert facts that cannot be
            // independently verified by an external auditor.
            contactPoint: [
              {
                '@type': 'ContactPoint',
                telephone: '+254768860665',
                contactType: 'customer service',
                availableLanguage: ['English', 'Swahili'],
                areaServed: ['KE', 'TZ', 'UG', 'RW', 'ET'],
              },
              {
                '@type': 'ContactPoint',
                telephone: '+254768860665',
                contactType: 'sales',
                availableLanguage: ['English', 'Swahili'],
              },
              {
                '@type': 'ContactPoint',
                telephone: '+254768860665',
                contactType: 'technical support',
                availableLanguage: ['English', 'Swahili'],
              }
            ],
            areaServed: [
              { '@type': 'Country', name: 'Kenya' },
              { '@type': 'Country', name: 'Tanzania' },
              { '@type': 'Country', name: 'Uganda' },
              { '@type': 'Country', name: 'Rwanda' },
              { '@type': 'Country', name: 'Ethiopia' },
              { '@type': 'GeoCircle', geoMidpoint: { '@type': 'GeoCoordinates', latitude: -1.286389, longitude: 36.817223 }, geoRadius: '2000 km' }
            ],
            sameAs: [
              'https://x.com/eimsemerson'
            ],
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'EmersonEIMS Products & Services',
              itemListElement: [
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'SoftwareApplication',
                    name: 'Generator Oracle AI',
                    description: 'AI-powered generator diagnostic system with voice activation and an extensive fault-code database',
                    applicationCategory: 'BusinessApplication',
                    operatingSystem: 'Web Browser',
                    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KES' }
                  }
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'SoftwareApplication',
                    name: 'Solar Solution School',
                    description: 'World-class solar design platform with 10 AI engines, 3D modeling, voice commands, and coverage across 15 African countries',
                    applicationCategory: 'BusinessApplication',
                    operatingSystem: 'Web Browser',
                    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KES' }
                  }
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'SoftwareApplication',
                    name: 'AI Borehole Site Analyzer',
                    description: "Africa's first AI-powered borehole site analysis tool using satellite imagery, LiDAR, hyperspectral data, and virtual geophysical surveys. Rock mapping without site visits.",
                    applicationCategory: 'BusinessApplication',
                    operatingSystem: 'Web Browser',
                    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KES' }
                  }
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Generator Sales & Installation',
                    description: 'CUMMINS generators 10-2000KVA, supplied, installed and commissioned',
                    provider: { '@type': 'Organization', name: 'EmersonEIMS' }
                  }
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Service',
                    name: 'Solar Installation',
                    description: 'Complete solar PV system design and installation across East Africa',
                    provider: { '@type': 'Organization', name: 'EmersonEIMS' }
                  }
                }
              ]
            },
            knowsAbout: [
              'Artificial Intelligence',
              'Machine Learning',
              'Generator Diagnostics',
              'Solar Panel Design',
              'Power Solutions',
              'Borehole Site Analysis',
              'Remote Sensing',
              'Satellite Imagery Analysis',
              'LiDAR Terrain Mapping',
              'Geophysical Surveys',
              'Enterprise Software',
              'CRM Integration',
              'Voice Recognition'
            ],
            // 'award' array removed (audit 2026-05-09): all entries were
            // self-asserted superlatives ("Most Advanced", "World's Most
            // Comprehensive") with no third-party citation. Schema.org
            // `award` requires a verifiable issuing body — omitting until
            // a real award (e.g. KEPSA, ASNT, AHK) is documented.
          }),
        }}
      />

      {/* Structured Data - Software Applications */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Generator Oracle AI',
              applicationCategory: 'BusinessApplication',
              description: 'AI-powered generator diagnostic tool that analyses symptoms and suggests solutions, backed by an extensive fault-code database. Features voice activation and real-time analysis.',
              operatingSystem: 'Any (Web-based)',
              url: 'https://www.emersoneims.com/generator-oracle',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'KES'
              },
              // aggregateRating removed (audit 2026-05-09): Google's
              // structured-data policy requires on-page user-generated
              // reviews for self-asserted ratings — we don't have them
              // yet, so emitting one is a policy violation.
              featureList: 'Voice Activation, Fault Code Database, Real-time Analysis, AI-Powered Recommendations'
            },
            {
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Solar Solution School',
              applicationCategory: 'BusinessApplication',
              description: 'Solar design platform featuring 10 AI engines, 3D modelling, voice commands and 25-year production projections. Country presets cover 15 African markets.',
              operatingSystem: 'Any (Web-based)',
              url: 'https://www.emersoneims.com/solar',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'KES'
              },
              // aggregateRating removed (audit 2026-05-09) — see note
              // above. Self-asserted ratings without UGC violate policy.
              featureList: '10 AI Engines, 3D Design Studio, Voice Commands, 25-Year Predictions, Enterprise Integrations'
            }
          ]),
        }}
      />

      {/* FAQPage schema removed from the homepage 2026-05-09.
          Google Rich Results Test was flagging 2 of 5 entries as invalid
          because Google requires the answer text to be visibly rendered
          on the same page that declares the schema. The dedicated /faq
          route owns its own (valid) FAQPage schema; declaring a second
          one here for content that is not visible was both a duplicate
          and a policy violation. Reference:
          https://developers.google.com/search/docs/appearance/structured-data/faqpage */}

      {/* Speakable schema — flags H1 + lead paragraph as voice-friendly so
          Google Assistant / Alexa can read them aloud in audio answers.
          Targets the standard semantic landmarks present on this page. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'EmersonEIMS — B2B Power & Engineering Partner Kenya',
            url: 'https://www.emersoneims.com',
            inLanguage: 'en-KE',
            speakable: {
              '@type': 'SpeakableSpecification',
              cssSelector: ['h1', '[data-speakable]'],
            },
          }),
        }}
      />

      {/* STATIC CONTENT - Renders instantly (no JS needed) */}
      <StaticHeroFallback />
      {/* VOLTKA Cummins cinematic showcase — flagship product directly
          under the hero so generator buyers see it before anything else. */}
      <VoltkaCinematicShowcase />
      {/* SHOP NOW SECTION — live pricing, stock availability, and BUY NOW buttons
          for top 5 Cummins models. This is the PRIMARY CONVERSION POINT where
          online browsers become paying customers. Positioned immediately after
          product showcase to capture buying intent. */}
      <CumminsShopNowReal />
      {/* FINANCING CALCULATOR — shows payment options and financing partners
          (KCB, Equity, Safaricom Money). Positioned after shop section so buyers
          who see pricing can immediately calculate their monthly payment and apply. */}
      <FinancingCalculatorReal />
      {/* TRADE-IN CALCULATOR — removes upgrade barrier by showing trade-in value
          of old generator. Positioned after financing so buyers can see: new price →
          financing cost → trade-in credit = final cost. */}
      <TradeInCalculator />
      {/* WHAT WE SUPPLY — the route from the homepage into the commercial pages.
          The component name is unchanged only to keep this import stable; what
          it renders is no longer a "leadership matrix". The ratings and #1
          rankings it once showed were invented and were removed earlier, but
          that left an empty div rendering blank black here. It is now a
          six-line router to /generators, /solar, /services/ups-systems,
          /repair-centre, /maintenance-hub and /pricing — all verified 200 with
          no redirect hop — because analytics showed 277 homepage visitors
          against 18 who reached /generators. Placed after the finance
          calculators, where a visitor who has kept scrolling is deciding what
          they need. */}
      <ServicesLeadershipMatrix />
      {/* AI ADVANTAGE SECTION — showcases our 4 flagship AI tools as
          competitive differentiators. Positioned after leadership matrix so
          buyers see our FULL SCOPE first (30+ services), then our UNIQUE TECH (AI). */}
      <AIAdvantageHero />
      {/* SOCIAL PROOF WIDGET — real customer testimonials with verified badges & metrics.
          Positioned after AI advantage to build trust with concrete success stories before
          asking for a decision. 5 verified case studies spanning healthcare, finance,
          manufacturing, agriculture, telecom. */}
      <SocialProofWidget />
      {/*
        RECENT WORK — photographed proof, added 2026-08-26.

        Placed immediately after the testimonials so a claim and its evidence
        sit together. Everything above this point on the page asserts capability;
        nothing showed it. A buyer weighing a KES 2,000,000 machine discounts
        adjectives, but a changeover panel wired at U/V/W/N and a burnt
        interface board on a bench read as real.

        Server-rendered deliberately: proof a crawler cannot see never reaches
        anyone searching. Source of truth is lib/projects/recentWork.ts, where
        every fact is either visible in the photograph or was stated by the
        owner — no client is named, and no outcome is claimed beyond what the
        images show.
      */}
      <RecentWorkSection />
      {/* Eight named client testimonials, SERVER-RENDERED so they are actually
          crawlable. They already existed in TestimonialsSection, but that is a
          client carousel behind LazyOnVisible: checked against the live
          homepage as Googlebot, not one of the eight names appeared in the
          HTML, and even mounted the carousel shows one at a time. The
          business's strongest trust signal was invisible to Google and to the
          AI assistants that now answer "who should I buy a generator from in
          Kenya". Placed directly after the photographed projects so a claim and
          the client who made it sit together. */}
      <ClientTestimonials />
      {/* COUNTY COVERAGE MAP — visual proof of nationwide presence across all 47 counties.
          Shows delivery times and emergency response times per region. Positioned before
          final navigation to emphasize geographic advantage that competitors lack. */}
      <CountyCoverageMapReal />
      <SolutionsBySector />
      <StaticFeaturesSection />
      {/* Auto-rotating 3D ring of real project photography — images "go
          round" (sister piece to the About page spiral). three.js loads
          only when the section nears the viewport. */}
      <RingGallery items={RING_GALLERY_ITEMS} />
      {/* Nike-style editorial image cards — ATS commissioning + genuine
          Cummins engine, keeping the product in view mid-scroll. */}
      <VoltkaDuoGrid />
      <HubFeatureBlock />
      <StaticStatsSection />
      <AITechnologyShowcase />
      {/* Full-width night-delivery billboard — emergency-response story
          told Nike-billboard style before the services film. */}
      <VoltkaBillboard />
      {/* Services film on a dedicated stage — visible on phones too
          (the hero video is tablet-and-up only). Click-to-play. */}
      <CinematicVideoSection />
      <StaticCountiesSection />

      {/* ENGINEERING AUTHORITY — crawlable editorial band + internal links to
          every service deep-dive. Additive; on-brand premium dark/amber. */}
      <HomeEngineeringAuthority />

      {/* 6 AI TOOLS — crawlable marketing band with internal links (does not
          modify any tool; gives them link equity from the homepage). */}
      <AIToolsPromo />

      {/* CLIENT INTERACTIVE SECTIONS - Load after static content */}
      <HomePageClient />
    </div>
  );
}
// Force rebuild - Sun Jul 26 18:54:11 EAST 2026
