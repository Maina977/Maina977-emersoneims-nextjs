'use client'

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import OptimizedImage from "@/components/media/OptimizedImage";
import { usePerformanceTier } from '@/components/performance/usePerformanceTier';
import { SectionLead } from "@/components/generators";
import HeroCinematicFX from '@/components/home/HeroCinematicFX';
import TeslaSlideGallery from '@/components/galleries/TeslaSlideGallery';
import {
  publishableStock,
  USED_MAKES,
  USED_WARRANTY_TERM,
  STOCK_LIST_FIELDS,
  type UsedGeneratorUnit,
} from '@/lib/inventory/usedGeneratorStock';
import { kes, REQUEST_CURRENT_PRICE } from '@/lib/pricing/voltkaConfirmedPrices';

/*
 * Re-audit 7 Nov 2026, item 4. This page used to show six brand cards with
 * invented price and running-hour ranges, model lists that are not real
 * products, and photos of new VOLTKA stock and customers' sets captioned as
 * pre-owned inventory. Units now come only from lib/inventory/usedGeneratorStock.ts,
 * one identifiable machine per entry. The slide images below are unchanged;
 * their captions now say what each photo actually shows.
 */
const USED_SLIDES = [
  { src: '/images/voltka/voltka-warehouse-fleet.webp', title: 'Our Nairobi Warehouse', subtitle: 'Used units change week to week. Ask for the current stock list', ctaHref: '/contact?type=used-stock-list', ctaLabel: 'Request Stock List' },
  { src: '/images/voltka/voltka-vks165-stock-forklift.webp', title: 'Stock Handling', subtitle: 'Delivery and installation are quoted per unit and site' },
  { src: '/images/enhanced/FG-WILSON-GENERATOR-4K-CINEMATIC.jpg', title: 'FG Wilson · Perkins', subtitle: 'Makes we buy, recondition, sell and service' },
  { src: '/images/desktop/generators/cummins-teal-canopy.jpg', title: 'Cummins Canopied Sets', subtitle: 'Inspect any unit before you buy' },
  { src: '/images/enhanced/NTSA- ATLAS COPCO GENERATOR-4K-CINEMATIC.jpg', title: 'Atlas Copco', subtitle: 'Industrial standby sets' },
  { src: '/images/desktop/overhaul/engine-bay-service.jpg', title: 'Pre-Sale Inspection', subtitle: 'Ask for the inspection and load-test report of the unit you are considering', ctaHref: '/contact?type=inspection', ctaLabel: 'Request an Inspection' },
];

// Image Gallery Component
const ImageGallery = ({ images, brand }: { images: string[]; brand: string }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <>
      <div className="mt-6 space-y-4">
        <div className="relative h-64 rounded-lg overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute inset-0"
            >
              <div onClick={() => setIsLightboxOpen(true)} className="cursor-pointer">
                <OptimizedImage
                  src={images[selectedImage]}
                  alt={`${brand} generator - Image ${selectedImage + 1}`}
                  width={800}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </AnimatePresence>
          {images.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/80 text-white p-2 rounded-full hover:bg-black transition-all"
                aria-label="Previous image"
              >
                {'\u2190'}
              </button>
              <button
                onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/80 text-white p-2 rounded-full hover:bg-black transition-all"
                aria-label="Next image"
              >
                {'\u2192'}
              </button>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative h-16 rounded overflow-hidden border-2 transition-all ${
                  selectedImage === index ? 'border-amber-500' : 'border-transparent'
                }`}
              >
                <OptimizedImage
                  src={img}
                  alt={`${brand} thumbnail ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.div
              className="relative max-w-7xl max-h-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <OptimizedImage
                src={images[selectedImage]}
                alt={`${brand} generator - Full view`}
                width={1200}
                height={800}
                className="max-w-full max-h-[90vh] object-contain"
              />
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 bg-black/80 text-white p-3 rounded-full hover:bg-black transition-all"
                aria-label="Close lightbox"
              >
                {'\u2715'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

function UnitCard({ unit }: { unit: UsedGeneratorUnit }) {
  return (
    <article className="p-6 rounded-xl border border-gray-800 bg-gradient-to-br from-black to-gray-900">
      <div className="flex justify-between items-start gap-3 mb-2">
        <h3 className="text-xl font-bold text-white">{unit.make} {unit.model}</h3>
        <span className="text-xs text-white/60 font-mono">{unit.stockId}</span>
      </div>
      <p className="text-brand-gold font-semibold">{unit.kvaPrime} kVA prime · {unit.phase === 'three' ? 'three-phase' : 'single-phase'} · {unit.enclosure}</p>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-white/80">
        <dt className="text-white/50">Engine hours</dt><dd>{unit.engineHours.toLocaleString('en-US')} (read {unit.hoursReadOn})</dd>
        {unit.yearOfManufacture ? (<><dt className="text-white/50">Year</dt><dd>{unit.yearOfManufacture}</dd></>) : null}
        <dt className="text-white/50">Location</dt><dd>{unit.location}</dd>
        <dt className="text-white/50">Price</dt><dd>{unit.priceKes ? `${kes(unit.priceKes)} excl. VAT` : REQUEST_CURRENT_PRICE}</dd>
        <dt className="text-white/50">Load test</dt>
        <dd>{unit.testRecord ? `${unit.testRecord.loadPercent}% for ${unit.testRecord.durationHours} h on ${unit.testRecord.date} (report ${unit.testRecord.reportRef})` : 'Not yet tested; ask before you buy'}</dd>
        <dt className="text-white/50">Warranty</dt><dd>{USED_WARRANTY_TERM}: {unit.warrantyCoverage}</dd>
      </dl>
      {unit.conditionNotes ? <p className="mt-3 text-sm text-white/60">{unit.conditionNotes}</p> : null}
      <ImageGallery images={unit.photos} brand={`${unit.make} ${unit.model} (${unit.stockId})`} />
      <a href={`/contact?type=used-generator&unit=${encodeURIComponent(unit.stockId)}`} className="sci-fi-button block text-center py-3 mt-6">
        Ask about {unit.stockId}
      </a>
    </article>
  );
}

export default function UsedGeneratorsPage() {
  const stock = publishableStock();
  const { isLite } = usePerformanceTier();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div className="min-h-screen bg-black">
      {/* Cinematic Hero Section with Hollywood Color Grading */}
      <section ref={heroRef} className="relative h-[85vh] min-h-[600px] overflow-hidden">
        {/* Background Image with Cinematic Scale */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: heroScale }}
        >
          <Image
            src="/images/78.png"
            alt="Quality Used Generators Kenya"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />

          {/* Hollywood Cinematic Color Grading Overlays */}
          {/* Teal/Gold Color Grade - Value & Quality Theme */}
          <div className="absolute inset-0 mix-blend-color" style={{ background: 'linear-gradient(135deg, rgba(0, 70, 90, 0.3) 0%, rgba(200, 150, 50, 0.2) 100%)' }} />

          {/* Deep Contrast Enhancement */}
          <div className="absolute inset-0 mix-blend-overlay" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.7) 100%)' }} />

          {/* Blue Shadow Tint - Cinematic Shadows */}
          <div className="absolute inset-0 mix-blend-multiply" style={{ background: 'linear-gradient(to bottom, rgba(10, 25, 45, 0.5) 0%, rgba(30, 25, 15, 0.4) 100%)' }} />

          {/* Warm Gold Highlight Push */}
          <div className="absolute inset-0 mix-blend-soft-light" style={{ background: 'radial-gradient(ellipse at 35% 25%, rgba(255, 200, 100, 0.3) 0%, transparent 60%)' }} />

          {/* Film Grain Texture */}
          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Vignette Effect */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)' }} />

          {/* Cinematic Letterbox Gradient - Top */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />

          {/* Cinematic Letterbox Gradient - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/90 to-transparent" />
        </motion.div>

        {/* Animated Value Shimmer Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.1, 0] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
          style={{ background: 'linear-gradient(45deg, transparent 40%, rgba(255, 200, 100, 0.12) 50%, transparent 60%)' }}
        />

        {/* Hero Content */}
        <motion.div
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6"
          style={{ opacity: heroOpacity, y: textY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="max-w-5xl"
          >
            {/* Cinematic Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
            >
              <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-white/90 tracking-wider uppercase">Used Generators · Unit by Unit</span>
            </motion.div>

            {/* Main Title with Cinematic Typography */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">
                Quality Used
              </span>
              <span className="block bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                Generators
              </span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-lg md:text-xl lg:text-2xl text-gray-200/90 max-w-3xl mx-auto leading-relaxed mb-8"
            >
              2-Year Warranty • Each Unit&apos;s Hours, Price &amp; Test Report on Request • Inspect Before You Buy
            </motion.p>

            {/* Decorative Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 1 }}
              className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-yellow-500 to-transparent"
            />
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-xs text-white/50 uppercase tracking-widest">How It Works</span>
              <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
                <motion.div
                  animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-yellow-500 rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Cinematic Anamorphic Lens Flare */}
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent blur-sm" />

        {/* Awwwards ambient layer — GSAP parallax + lazy Three.js amber embers */}
        {!isLite && <HeroCinematicFX />}
      </section>

      {/* Slide images unchanged; captions describe what each photo shows. */}
      <TeslaSlideGallery slides={USED_SLIDES} eyebrow="Used Generators — How We Sell Them" />

      {/* Main Content */}
      <div className="eims-shell relative z-10 py-16">
        <SectionLead
          title="Used Generators"
          subtitle="Every used set we sell is a specific machine with its own stock number, hours, price and warranty terms."
          centered
        />

        <section aria-labelledby="stock-heading" className="mt-12">
          <h2 id="stock-heading" className="text-3xl font-bold text-white text-center mb-6">Current Stock</h2>
          {stock.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stock.map((u) => <UnitCard key={u.stockId} unit={u} />)}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto p-8 rounded-xl border border-amber-500/30 bg-amber-950/20">
              <p className="text-white/90 text-lg">
                Used stock changes from week to week, so we do not publish a fixed list that would be out of date.
                Ask for the current list and we will send, for each unit:
              </p>
              <ul className="mt-4 space-y-2 text-white/80">
                {STOCK_LIST_FIELDS.map((f) => (
                  <li key={f} className="flex gap-2"><span className="text-green-500" aria-hidden="true">✓</span>{f}</li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a href="/contact?type=used-stock-list" className="sci-fi-button flex-1 text-center py-3">Request the current stock list</a>
                <a href="https://wa.me/254768860665?text=Hello%20EmersonEIMS%2C%20please%20send%20your%20current%20used-generator%20stock%20list." className="sci-fi-outline flex-1 text-center py-3" rel="noopener noreferrer" target="_blank">Ask on WhatsApp</a>
              </div>
            </div>
          )}
        </section>

        <section aria-labelledby="warranty-heading" className="mt-16 max-w-3xl mx-auto">
          <h2 id="warranty-heading" className="text-2xl font-bold text-white mb-4">Warranty on Used Generators</h2>
          <p className="text-white/80">
            Every generator we sell, new or used, carries a {USED_WARRANTY_TERM} warranty. On a used set, what that warranty
            covers depends on the condition of that machine, so the cover for each unit is written on its own quotation and
            invoice. Cover depends on the set being serviced at the stated intervals, with the service record kept.
          </p>
        </section>

        <section aria-labelledby="checks-heading" className="mt-16">
          <h2 id="checks-heading" className="text-3xl font-bold text-white text-center mb-4">What to Ask For Before Buying Any Used Generator</h2>
          <p className="text-center text-white/60 max-w-3xl mx-auto mb-10">From us or anyone else. A seller who cannot show these for the exact unit is asking you to take the condition on trust.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: 1, title: 'Engine condition', text: 'Hour-meter reading checked against the service record, a compression or blow-by check, oil analysis if available, and no coolant in the oil.' },
              { n: 2, title: 'Electrical condition', text: 'Alternator insulation resistance (megger) reading, AVR and controller function, and the protection settings on the breaker.' },
              { n: 3, title: 'Load test', text: 'A load-bank test at a stated percentage of the prime rating for a stated time, with voltage, frequency and temperatures recorded on a dated report.' },
            ].map((c) => (
              <div key={c.n} className="p-8 rounded-xl border border-gray-700 bg-gradient-to-br from-black to-gray-900">
                <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center text-white text-xl font-bold mb-4">{c.n}</div>
                <h3 className="text-xl font-bold text-white">{c.title}</h3>
                <p className="mt-4 text-white/70">{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="makes-heading" className="mt-16 text-center">
          <h2 id="makes-heading" className="text-2xl font-bold text-white mb-4">Makes We Buy, Recondition, Sell Used and Service</h2>
          <p className="text-white/60 mb-6">New generators: we sell VOLTKA only. <Link href="/generators" className="text-amber-400 underline">See new VOLTKA sets and prices</Link>.</p>
          <ul className="flex flex-wrap justify-center gap-3">
            {USED_MAKES.map((m) => (
              <li key={m.name}><Link href={m.href} className="inline-block px-4 py-2 rounded-full border border-white/20 text-white/90 hover:border-amber-500">{m.name}</Link></li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
