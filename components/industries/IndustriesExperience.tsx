'use client';

/**
 * IndustriesExperience — Apple-grade industries showcase
 *
 * Cinematic scroll experience for /industries: WebGL particle hero,
 * huge typography with staggered reveals, parallax industry cards
 * with real project photography, a pinned horizontal "services rail"
 * (GSAP ScrollTrigger) showing every EmersonEIMS service, and animated
 * proof counters. All original page content is preserved — this is a
 * visual re-set, not a rewrite.
 */

import { useEffect, useRef, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ——— Data contracts (lightweight, serializable from server page) ———
export interface IndustryCardData {
  slug: string;
  name: string;
  icon: string;
  heroSubtitle: string;
  marketSize: string;
}

interface IndustriesExperienceProps {
  industries: IndustryCardData[];
  stats: {
    totalHotelsTarget: string;
    totalHospitalsTarget: string;
    totalSchoolsTarget: string;
    totalCountiesCovered: number;
  };
}

// Real EmersonEIMS project photography per industry
const INDUSTRY_IMAGES: Record<string, string> = {
  'hotels-hospitality': '/images/voltka/voltka-warehouse-fleet.webp',
  'hospitals-healthcare': '/images/ups-power-protection-system.png',
  'schools-universities': '/images/ST-AUSTIN-4K-CINEMATIC.jpg',
  'banks-financial': '/images/ups-battery-bank.png',
  'manufacturing-industries': '/images/SANERGY-FG-WILSON-4K-CINEMATIC.jpg',
  'flower-farms': '/images/BIGOT-FLOWERS-4K-CINEMATIC.jpg',
  'real-estate-construction': '/images/GREENHEART-KILIFI-4K-CINEMATIC.jpg',
  'churches-religious': '/images/GEN 2-1920x1080.png',
  'government-ngos': '/images/NTSA-4K-CINEMATIC.jpg',
};
const FALLBACK_INDUSTRY_IMAGE = '/images/voltka/voltka-warehouse-fleet.webp';

// Every service, with its field photograph — for the horizontal rail
const SERVICES = [
  { label: 'Generators', caption: 'Sales, installation & ATS changeover — 20 to 2000 kVA', image: '/images/voltka/voltka-vks44-hero-profile.webp' },
  { label: 'Solar', caption: 'Grid-tie, hybrid & off-grid solar for farms and industry', image: '/images/solar power farms.png' },
  { label: 'UPS Systems', caption: 'Enterprise UPS with N+1 redundancy for critical loads', image: '/images/ups-power-protection-system.png' },
  { label: 'Switchgear', caption: 'Medium-voltage switchgear & distribution panels', image: '/images/switchgear-panel.png' },
  { label: 'Controls & ATS', caption: 'Automatic changeover and intelligent control panels', image: '/images/voltka/ats-changeover-panel-4k.webp' },
  { label: 'Maintenance', caption: 'Genuine Perkins, Cummins & CAT parts and servicing', image: '/images/PERKINS-ENGINE-PARTS.jpg' },
  { label: 'Transformers', caption: '11kV/415V transformer installation & commissioning', image: '/images/high-voltage-transformer.png' },
  { label: 'Fabrication', caption: 'Steel fabrication — canopies, frames & structures', image: '/images/steel-fabrication-workshop.png' },
  { label: 'Incinerators', caption: 'NEMA-compliant industrial & medical incinerators', image: '/images/industrial-incinerator.png' },
  { label: 'HVAC', caption: 'Commercial air conditioning & industrial cooling', image: '/images/hvac-commercial-system.png' },
  { label: 'Motor Rewinding', caption: 'Rewinding, diagnostics & load testing — all sizes', image: '/images/motor-rewinding-workshop.png' },
  { label: 'Water & Pumps', caption: 'Borehole pumps, treatment plants & distribution', image: '/images/borehole-pump-installation.png' },
];

const WHATSAPP_ICON = (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ——— GSAP reveal helper ———
function Reveal({
  children,
  className = '',
  y = 60,
  stagger = 0,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  stagger?: number;
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
          stagger,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [prefersReducedMotion, y, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// ——— Animated counter (handles "16,245+" style strings) ———
function StatCounter({ value, label }: { value: string | number; label: string }) {
  const numRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const display = typeof value === 'number' ? String(value) : value;
  const numeric = parseInt(display.replace(/[^0-9]/g, ''), 10);
  const suffix = display.includes('+') ? '+' : '';
  const animatable = !Number.isNaN(numeric) && /^[\d,+]+$/.test(display.trim());

  useEffect(() => {
    const el = numRef.current;
    if (!el || !animatable) return;
    if (prefersReducedMotion) {
      el.textContent = display;
      return;
    }
    const obj = { n: 0 };
    const tween = gsap.to(obj, {
      n: numeric,
      duration: 2.2,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => {
        el.textContent = `${Math.round(obj.n).toLocaleString()}${suffix}`;
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [numeric, suffix, display, animatable, prefersReducedMotion]);

  return (
    <div className="text-center">
      <span ref={numRef} className="block text-4xl md:text-5xl font-bold text-cyan-300 tabular-nums">
        {animatable ? `0${suffix}` : display}
      </span>
      <span className="mt-2 block text-[11px] md:text-xs tracking-[0.25em] uppercase text-slate-400">{label}</span>
    </div>
  );
}

// ——— WebGL particle field (plain three.js) ———
function ParticleField() {
  const hostRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    if (!host || prefersReducedMotion) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance' });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(host.clientWidth, host.clientHeight);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, host.clientWidth / host.clientHeight, 0.1, 50);
    camera.position.z = 9;

    const COUNT = 900;
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      speeds[i] = 0.12 + Math.random() * 0.5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x67e8f9,
      size: 0.035,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let raf = 0;
    const render = () => {
      const dt = clock.getDelta();
      const pos = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        pos[i * 3 + 1] += speeds[i] * dt;
        if (pos[i * 3 + 1] > 8) pos[i * 3 + 1] = -8;
      }
      geo.attributes.position.needsUpdate = true;
      points.rotation.y += dt * 0.03;
      camera.position.x += (pointer.x * 0.8 - camera.position.x) * 0.03;
      camera.position.y += (-pointer.y * 0.5 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement);
    };
  }, [prefersReducedMotion]);

  return <div ref={hostRef} className="absolute inset-0" aria-hidden="true" />;
}

// ——— Hero ———
function IndustriesHero({ stats }: { stats: IndustriesExperienceProps['stats'] }) {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ind-hero-line',
        { yPercent: 110 },
        { yPercent: 0, duration: 1.3, stagger: 0.12, ease: 'power4.out', delay: 0.15 }
      );
      gsap.fromTo('.ind-hero-fade', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1, stagger: 0.12, delay: 0.9, ease: 'power3.out' });
      if (bgRef.current) {
        gsap.fromTo(bgRef.current, { scale: 1.15 }, { scale: 1, duration: 2.6, ease: 'power2.out' });
        gsap.to(bgRef.current, {
          yPercent: 16,
          ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
        });
      }
    }, heroRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={heroRef} className="relative min-h-[100svh] overflow-hidden flex flex-col justify-end">
      {/* Parallax photographic backdrop */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/voltka/switchgear-distribution-room.webp"
          alt="EmersonEIMS switchgear distribution room"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
      <ParticleField />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 md:px-8 pb-16 md:pb-24 pt-36">
        <p className="ind-hero-fade text-[11px] md:text-xs tracking-[0.45em] uppercase text-cyan-300 mb-5">
          Industry Solutions — B2B Power
        </p>
        <h1 className="text-[12vw] md:text-[6.5vw] font-bold leading-[0.95] text-white">
          <span className="block overflow-hidden"><span className="ind-hero-line block">Power, engineered</span></span>
          <span className="block overflow-hidden">
            <span className="ind-hero-line block bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              for your industry.
            </span>
          </span>
        </h1>

        <p className="ind-hero-fade mt-7 max-w-2xl text-base md:text-xl text-slate-300 leading-relaxed">
          We don&apos;t believe in one-size-fits-all. Every industry has unique power challenges.
          That&apos;s why we&apos;ve developed specialized solutions for each sector — from hospital ICUs
          to flower farm cold rooms.
        </p>

        <div className="ind-hero-fade mt-9 flex flex-wrap gap-4">
          <a
            href="tel:+254768860665"
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
          >
            Call: +254 768 860 665
          </a>
          <a
            href="https://wa.me/254768860665?text=Hi%20EmersonEIMS%2C%20I%20need%20power%20solutions%20for%20my%20business.%20Please%20contact%20me."
            className="px-8 py-4 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-all flex items-center gap-2"
          >
            {WHATSAPP_ICON}
            WhatsApp Us
          </a>
        </div>

        {/* Market stats (preserved) */}
        <div className="ind-hero-fade mt-14 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-10">
          <StatCounter value={stats.totalHotelsTarget} label="Hotels in Kenya" />
          <StatCounter value={stats.totalHospitalsTarget} label="Hospitals & Clinics" />
          <StatCounter value={stats.totalSchoolsTarget} label="Schools & Universities" />
          <StatCounter value={stats.totalCountiesCovered} label="Counties Covered" />
        </div>
      </div>
    </section>
  );
}

// ——— Industry card with internal image parallax ———
function IndustryCard({ industry, featured }: { industry: IndustryCardData; featured?: boolean }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const image = INDUSTRY_IMAGES[industry.slug] || FALLBACK_INDUSTRY_IMAGE;

  useEffect(() => {
    if (prefersReducedMotion || !cardRef.current || !imgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgRef.current,
        { yPercent: -10, scale: 1.18 },
        {
          yPercent: 8,
          scale: 1.08,
          ease: 'none',
          scrollTrigger: { trigger: cardRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );
    }, cardRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <Link
      ref={cardRef}
      href={`/industries/${industry.slug}`}
      className={`group relative block overflow-hidden rounded-3xl border border-white/10 bg-slate-900 transition-colors duration-500 hover:border-cyan-400/50 ${
        featured ? 'md:col-span-2 aspect-[16/10] md:aspect-[21/9]' : 'aspect-[16/11]'
      }`}
    >
      <div ref={imgRef} className="absolute inset-0 will-change-transform">
        <Image
          src={image}
          alt={`${industry.name} — EmersonEIMS power solutions`}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes={featured ? '(max-width: 768px) 100vw, 90vw' : '(max-width: 768px) 100vw, 45vw'}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      <div className="absolute inset-0 bg-cyan-500/0 transition-colors duration-500 group-hover:bg-cyan-500/10" />

      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl md:text-4xl drop-shadow">{industry.icon}</span>
          <span className="text-[10px] md:text-xs text-cyan-300 bg-cyan-400/10 border border-cyan-400/25 px-3 py-1 rounded-full tracking-wide">
            {industry.marketSize}
          </span>
        </div>
        <h3 className={`font-bold text-white group-hover:text-cyan-300 transition-colors ${featured ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
          {industry.name}
        </h3>
        <p className="mt-2 max-w-xl text-sm md:text-base text-slate-300/90 line-clamp-2">
          {industry.heroSubtitle}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-300">
          Learn more
          <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
        </span>
      </div>
    </Link>
  );
}

// ——— Pinned horizontal services rail ———
function ServicesRail() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current || !trackRef.current) return;
    const track = trackRef.current;
    const ctx = gsap.context(() => {
      const getDistance = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-slate-950 py-16 md:py-0 md:min-h-screen md:flex md:flex-col md:justify-center">
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 mb-10 md:mb-14">
        <Reveal>
          <p className="text-[11px] tracking-[0.4em] uppercase text-cyan-300 mb-3">All Services — In Pictures</p>
          <h2 className="text-4xl md:text-6xl font-bold text-white">
            Every service. <span className="text-slate-500">One partner.</span>
          </h2>
        </Reveal>
      </div>

      <div
        ref={trackRef}
        className={`flex gap-5 md:gap-7 px-4 md:px-8 will-change-transform ${
          prefersReducedMotion ? 'overflow-x-auto pb-4' : ''
        }`}
      >
        {SERVICES.map((service, i) => (
          <figure
            key={service.label}
            className="group relative w-[78vw] sm:w-[52vw] md:w-[34vw] lg:w-[26vw] shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-slate-900"
          >
            <div className="relative aspect-[4/5]">
              <Image
                src={service.image}
                alt={`${service.label} — EmersonEIMS`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 78vw, 30vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
            </div>
            <figcaption className="absolute inset-x-0 bottom-0 p-6">
              <span className="text-[10px] tracking-[0.3em] uppercase text-cyan-300/80">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-1 text-2xl md:text-3xl font-bold text-white">{service.label}</h3>
              <p className="mt-1.5 text-sm text-slate-300/90">{service.caption}</p>
            </figcaption>
          </figure>
        ))}

        {/* End card */}
        <div className="relative w-[78vw] sm:w-[52vw] md:w-[34vw] lg:w-[26vw] shrink-0 rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-cyan-900/30 to-slate-900 flex flex-col items-center justify-center text-center p-10 aspect-[4/5] md:aspect-auto">
          <p className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Need it powered?<br />
            <span className="text-cyan-300">We build it.</span>
          </p>
          <Link
            href="/services"
            className="mt-8 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
          >
            Explore All Services
          </Link>
        </div>
      </div>

      <p className="mt-10 text-center text-[10px] tracking-[0.35em] uppercase text-white/30 hidden md:block">
        Keep scrolling
      </p>
    </section>
  );
}

// ——— Main experience ———
export default function IndustriesExperience({ industries, stats }: IndustriesExperienceProps) {
  return (
    <div className="bg-slate-950">
      <IndustriesHero stats={stats} />

      {/* Choose Your Industry (content preserved, Apple-style cards) */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <Reveal className="mb-14 md:mb-20">
            <p className="text-[11px] tracking-[0.4em] uppercase text-cyan-300 mb-3">Nine Sectors. One Standard.</p>
            <h2 className="text-4xl md:text-6xl font-bold text-white max-w-3xl leading-tight">
              Choose your industry.
            </h2>
            <p className="mt-5 text-slate-400 max-w-2xl text-lg">
              Click on your industry to see tailored solutions, case studies, and pricing specific to your sector.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-5 md:gap-7">
            {industries.map((industry, i) => (
              <Reveal key={industry.slug} y={70} className={i === 0 ? 'md:col-span-2' : ''}>
                <IndustryCard industry={industry} featured={i === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Horizontal services rail */}
      <ServicesRail />

      {/* Why Industry-Specific (content preserved) */}
      <section className="py-24 md:py-32 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <Reveal className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Why Industry-Specific Solutions Matter
            </h2>
          </Reveal>

          <Reveal className="grid md:grid-cols-3 gap-5" stagger={0.15}>
            {[
              {
                no: '01',
                title: 'Right-Sized Solutions',
                body: 'A hospital needs different power specs than a hotel. We understand the critical loads, response times, and redundancy requirements for each industry.',
              },
              {
                no: '02',
                title: 'Budget-Appropriate',
                body: 'Schools and churches operate on different budgets than banks and factories. We offer financing options and refurbished units to match your financial reality.',
              },
              {
                no: '03',
                title: 'Compliance Ready',
                body: 'Healthcare regulations, CBK requirements, export certifications - we provide documentation that satisfies industry-specific compliance needs.',
              },
            ].map((item) => (
              <div
                key={item.no}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-8 md:p-10 transition-colors duration-500 hover:border-cyan-400/40"
              >
                <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-cyan-400/20 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
                <span className="text-xs tracking-[0.35em] text-cyan-300/70">{item.no}</span>
                <h3 className="mt-4 mb-4 text-2xl font-bold text-white">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Trust badges (content preserved, animated) */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">Trusted Across All Sectors</h2>
          </Reveal>
          <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-10 border-y border-white/10 py-12" stagger={0.12}>
            <StatCounter value={3} label="Year Warranty" />
            <StatCounter value="1,500+" label="Installations" />
            <StatCounter value={47} label="Counties" />
            <StatCounter value="24/7" label="Support" />
          </Reveal>
        </div>
      </section>

      {/* CTA (content preserved) */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/30 to-blue-900/30" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[48rem] h-[48rem] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Not sure which solution fits?
            </h2>
            <p className="mt-6 text-slate-300 text-lg md:text-xl max-w-2xl mx-auto">
              Our power experts will assess your specific needs and recommend the perfect solution.
              Free consultation, free site survey, no obligation.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="tel:+254768860665"
                className="px-10 py-4 bg-white text-slate-900 font-semibold rounded-full hover:bg-slate-100 transition-all"
              >
                Call: +254 768 860 665
              </a>
              <a
                href="https://wa.me/254768860665?text=Hi%20EmersonEIMS%2C%20I%20need%20help%20choosing%20the%20right%20power%20solution%20for%20my%20business.%20Please%20advise."
                className="px-10 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all flex items-center gap-2"
              >
                {WHATSAPP_ICON}
                Chat on WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
