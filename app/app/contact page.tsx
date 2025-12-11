'use client';

import React, { Suspense, lazy, useState, useEffect, useMemo } from "react";
// import { HelmetProvider } from "react-helmet-async"; // Removed - not needed in Next.js
import SEOHead from "../componets/contact us/SEOHead";
import ErrorBoundary from "../componets/contact us/ErrorBoundary";
import AdaptivePerformanceMonitor from "../componets/contact us/AdaptivePerformanceMonitor";

// Lazy-load only heavy or non-critical sections
const HeroSection = lazy(() => import("../componets/contact us/HeroSection"));
const CallUs = lazy(() => import("../componets/contact us/CallUs"));
const EmailUs = lazy(() => import("../componets/contact us/EmailUs"));
const VisitUs = lazy(() => import("../componets/contact us/VisitUs"));
const Gallery = lazy(() => import("../componets/contact us/Gallery"));
const ContactForm = lazy(() => import("../componets/contact us/ContactForm"));
const CountiesGrid = lazy(() => import("../componets/contact us/CountiesGrid"));

// 🔍 Smart tier initializer (runs once, client-side only)
const getInitialPerformanceTier = () => {
  if (typeof window === "undefined") return "high"; // SSR safe

  const isLowEnd =
    (navigator.deviceMemory && navigator.deviceMemory < 4) ||
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
      window.gtag?.("event", "performance_tier_set", { tier });
    }
  }, [tier]);
};

export default function ContactPage() {
  const [performanceTier, setPerformanceTier] = useState("high");

  // Initialize tier after hydration
  useEffect(() => {
    setPerformanceTier(getInitialPerformanceTier());
  }, []);

  usePerformanceTelemetry(performanceTier);

  // ✅ Pre-render critical above-the-fold content instantly
  return (
    <>
      <SEOHead
        title="Contact EmersonEIMS | Powering Kenya with Intelligence"
        description="Reach EmersonEIMS via phone, email, or visit. A cinematic, sci‑fi contact experience spanning all 47 counties."
        canonical="/contact"
        openGraph={{
          type: "website",
          locale: "en_KE",
          url: "https://emersoneims.co.ke/contact",
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
        id="main-content"
        role="main"
        aria-label="Contact page content"
        className={`performance-tier-${performanceTier}`}
      >
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
              <h3>Form unavailable. Please email us directly at <a href="mailto:hello@emersoneims.co.ke">hello@emersoneims.co.ke</a>.</h3>
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

        {/* 📈 Monitor — place at bottom to avoid layout shift */}
        <AdaptivePerformanceMonitor
          onPerformanceChange={(newTier: string) => {
            if (newTier !== performanceTier) {
              console.info(`[Performance] Tier changed: ${performanceTier} → ${newTier}`);
              setPerformanceTier(newTier);
            }
          }}
        />
      </main>
    </>
  );
}