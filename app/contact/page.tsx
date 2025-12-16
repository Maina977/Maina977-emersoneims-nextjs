'use client';

import React, { Suspense, lazy, useState, useEffect, useMemo, useRef } from "react";
import { useScroll } from "framer-motion";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEOHead from "@/components/contact/SEOHead";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import PerformanceMonitor from "@/components/performance/PerformanceMonitor";
import AdaptivePerformanceMonitor from "@/components/contact/AdaptivePerformanceMonitor";
import InteractiveMap from "@/components/contact/InteractiveMap";
import LiveChat from "@/components/contact/LiveChat";
import HolographicLaser from '@/components/effects/HolographicLaser';
import { useReducedMotion } from '@/hooks/useReducedMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Lazy-load only heavy or non-critical sections
const HeroSection = lazy(() => import("@/components/contact/HeroSection"));
const CallUs = lazy(() => import("@/components/contact/CallUs"));
const EmailUs = lazy(() => import("@/components/contact/EmailUs"));
const VisitUs = lazy(() => import("@/components/contact/VisitUs"));
const Gallery = lazy(() => import("@/components/contact/Gallery"));
const ContactForm = lazy(() => import("@/components/contact/ContactForm"));
const CountiesGrid = lazy(() => import("@/components/contact/CountiesGrid"));
const SimpleThreeScene = lazy(() => import('@/components/webgl/SimpleThreeScene'));
const CustomCursor = lazy(() => import('@/components/interactions/CustomCursor'));
const TeslaStyleNavigation = lazy(() => import('@/components/navigation/TeslaStyleNavigation'));

// 🔍 Smart tier initializer (runs once, client-side only)
const getInitialPerformanceTier = () => {
  if (typeof window === "undefined") return "high"; // SSR safe

  const isLowEnd =
    ((navigator as any).deviceMemory && (navigator as any).deviceMemory < 4) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.matchMedia("(max-width: 768px)").matches;

  return isLowEnd ? "low" : "high";
};

// 📊 Optional: Send performance tier + load metrics to analytics
const usePerformanceTelemetry = (tier: string) => {
  useEffect(() => {
    // Example: send to GA4, PostHog, or internal dashboard
    if (process.env.NODE_ENV === "production") {
      (window as any).gtag?.("event", "performance_tier_set", { tier });
    }
  }, [tier]);
};

export default function ContactPage() {
  const [performanceTier, setPerformanceTier] = useState("high");
  const [activeSection, setActiveSection] = useState('hero');
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Initialize tier after hydration
  useEffect(() => {
    setPerformanceTier(getInitialPerformanceTier());
  }, []);

  usePerformanceTelemetry(performanceTier);

  // GSAP ScrollTrigger animations
  useEffect(() => {
    if (!containerRef.current) return;

    const sections = containerRef.current.querySelectorAll('section');
    
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Section tracking for navigation
  useEffect(() => {
    if (!containerRef.current) return;

    const sections = containerRef.current.querySelectorAll('section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id || 'hero');
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // ✅ Pre-render critical above-the-fold content instantly
  return (
    <ErrorBoundary>
      {/* Performance Monitor */}
      <PerformanceMonitor />

      {/* Premium Custom Cursor */}
      <Suspense fallback={null}>
        <CustomCursor enabled={!prefersReducedMotion} />
      </Suspense>

      {/* Navigation */}
      <Suspense fallback={null}>
        <TeslaStyleNavigation activeSection={activeSection} />
      </Suspense>

      <SEOHead
        title="Contact EmersonEIMS | Powering Kenya with Intelligence"
        description="Reach EmersonEIMS via phone, email, or visit. A cinematic, sci‑fi contact experience spanning all 47 counties."
        keywords="contact, Kenya, EmersonEIMS, 47 counties, support, inquiry, sci-fi UI"
        canonical="/contact"
        openGraph={{
          type: "website",
          locale: "en_KE",
          url: "https://emersoneims.com/contact",
          siteName: "EmersonEIMS",
          images: [
            {
              url: "/og/contact-og.jpg",
              width: 1200,
              height: 630,
              alt: "EmersonEIMS Contact Experience — Nairobi Skyline with Data Streams",
            },
          ],
        }}
      />
      <main
        ref={containerRef}
        id="main-content"
        role="main"
        aria-label="Contact page content"
        className={`performance-tier-${performanceTier} relative`}
      >
        {/* Holographic Laser Overlay */}
        <HolographicLaser intensity="medium" color="#fbbf24" />
        
        {/* 3D Background Scene */}
        <Suspense fallback={null}>
          <div className="fixed inset-0 -z-10 opacity-15">
            <SimpleThreeScene />
          </div>
        </Suspense>
        {/* 💡 Hero is critical — load synchronously or with highest priority */}
        <ErrorBoundary
          fallback={
            <section aria-live="polite" className="fallback hero-fallback">
              <h2>Hero section temporarily unavailable.</h2>
            </section>
          }
        >
          <Suspense
            fallback={
              <section
                aria-live="polite"
                aria-busy="true"
                className="skeleton hero-skeleton"
                role="status"
              >
                <h1 className="visually-hidden">Loading hero content…</h1>
              </section>
            }
          >
            <HeroSection performanceTier={performanceTier} />
          </Suspense>
        </ErrorBoundary>

        {/* 📞 Non-critical: lazy-load with granular fallbacks */}
        <section aria-labelledby="contact-methods-heading">
          <h2 id="contact-methods-heading" className="sr-only">
            Contact Methods
          </h2>

          <ErrorBoundary
            fallback={
              <div aria-live="polite" className="fallback">
                Call information temporarily unavailable.
              </div>
            }
          >
            <Suspense
              fallback={
                <div
                  aria-live="polite"
                  aria-busy="true"
                  className="skeleton call-skeleton"
                  role="status"
                >
                  <span className="visually-hidden">Loading call details…</span>
                </div>
              }
            >
              <CallUs performanceTier={performanceTier} />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary
            fallback={
              <div aria-live="polite" className="fallback">
                Email information temporarily unavailable.
              </div>
            }
          >
            <Suspense
              fallback={
                <div
                  aria-live="polite"
                  aria-busy="true"
                  className="skeleton email-skeleton"
                  role="status"
                >
                  <span className="visually-hidden">Loading email details…</span>
                </div>
              }
            >
              <EmailUs performanceTier={performanceTier} />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary
            fallback={
              <div aria-live="polite" className="fallback">
                Visit information temporarily unavailable.
              </div>
            }
          >
            <Suspense
              fallback={
                <div
                  aria-live="polite"
                  aria-busy="true"
                  className="skeleton visit-skeleton"
                  role="status"
                >
                  <span className="visually-hidden">Loading visit details…</span>
                </div>
              }
            >
              <VisitUs performanceTier={performanceTier} />
            </Suspense>
          </ErrorBoundary>
        </section>

        {/* 🖼️ Gallery: high-risk (media-heavy), isolate */}
        <ErrorBoundary
          fallback={
            <section aria-live="assertive" className="fallback gallery-fallback">
              <p>
                Gallery failed to load. <a href="#contact-form">Jump to contact form</a>.
              </p>
            </section>
          }
        >
          <Suspense
            fallback={
              <section
                aria-live="polite"
                aria-busy="true"
                className="skeleton gallery-skeleton"
                role="status"
              >
                <h3 className="visually-hidden">Loading county visuals…</h3>
              </section>
            }
          >
            <Gallery performanceTier={performanceTier} />
          </Suspense>
        </ErrorBoundary>

        {/* 📝 Form: critical UX — keep robust */}
        <ErrorBoundary
          fallback={
            <section
              aria-live="assertive"
              className="fallback form-fallback"
              tabIndex={-1}
              ref={(el) => { if (el) el.focus(); }}
            >
              <h3>Form unavailable. Please email us directly at <a href="mailto:info@emersoneims.com">info@emersoneims.com</a>.</h3>
            </section>
          }
        >
          <Suspense
            fallback={
              <section
                aria-live="polite"
                aria-busy="true"
                className="skeleton form-skeleton"
                role="status"
              >
                <h3 className="visually-hidden">Preparing contact form…</h3>
              </section>
            }
          >
            <ContactForm performanceTier={performanceTier} />
          </Suspense>
        </ErrorBoundary>

        {/* 🗺️ CountiesGrid: data-rich — isolate errors */}
        <ErrorBoundary
          fallback={
            <section aria-live="polite" className="fallback counties-fallback">
              <p>County map unavailable. <a href="/counties">View counties list</a>.</p>
            </section>
          }
        >
          <Suspense
            fallback={
              <section
                aria-live="polite"
                aria-busy="true"
                className="skeleton counties-skeleton"
                role="status"
              >
                <h3 className="visually-hidden">Loading county coverage map…</h3>
              </section>
            }
          >
            <CountiesGrid performanceTier={performanceTier} />
          </Suspense>
        </ErrorBoundary>

        {/* 🗺️ Interactive Map */}
        <ErrorBoundary
          fallback={
            <section aria-live="polite" className="fallback">
              <p>Interactive map temporarily unavailable.</p>
            </section>
          }
        >
          <Suspense fallback={
            <section aria-live="polite" aria-busy="true" className="skeleton" role="status">
              <h3 className="visually-hidden">Loading interactive map…</h3>
            </section>
          }>
            <InteractiveMap />
          </Suspense>
        </ErrorBoundary>

        {/* 📈 Monitor — place at bottom to avoid layout shift */}
        <AdaptivePerformanceMonitor
          onPerformanceChange={(newTier: string) => {
            if (newTier !== performanceTier) {
              console.info(`[Performance] Tier changed: ${performanceTier} → ${newTier}`);
              setPerformanceTier(newTier);
            }
          }}
        />

        {/* 💬 Live Chat */}
        <LiveChat />
      </main>
    </ErrorBoundary>
  );
}

