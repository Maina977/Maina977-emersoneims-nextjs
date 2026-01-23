'use client';

import { useEffect, useState, Suspense, lazy, useRef } from "react";
import { motion, useScroll } from "framer-motion";
import OptimizedImage from "@/components/media/OptimizedImage";
import { SectionHeading } from "@/components/typography/CinematicHeadingVariants";
import { useReducedMotion } from '@/hooks/useReducedMotion';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import PerformanceMonitor from '@/components/performance/PerformanceMonitor';
import HolographicLaser from '@/components/effects/HolographicLaser';
import { usePerformanceTier } from '@/components/performance/usePerformanceTier';
import BigHeroImage from '@/components/shared/BigHeroImage';
import LearnMoreSection from '@/components/shared/LearnMoreSection';

// Lazy load WebGL scene
const SimpleThreeScene = lazy(() => import('@/components/webgl/SimpleThreeScene'));
const CustomCursor = lazy(() => import('@/components/interactions/CustomCursor'));

// ==================== ENHANCEMENT 1: HIGH-CONTRAST COMPLIANCE LAYER ====================
const ContrastComplianceLayer = () => {
  const [highContrast, setHighContrast] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersContrast = window.matchMedia('(prefers-contrast: more)').matches;
      setHighContrast(prefersContrast);
    }
  }, []);

  return (
    <>
      <style>{`
        @media (prefers-contrast: more) {
          .gold-text { text-shadow: 0 0 1px black, 0 0 2px black; }
          .gold-80 { text-shadow: 0 0 2px rgba(0,0,0,0.7); }
          .card { box-shadow: 0 0 20px rgba(0,0,0,0.8) inset; }
        }
        .hc-toggle {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0,0,0,0.8);
          border: 2px solid #FFD700;
          color: #FFD700;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.3;
          transition: opacity 0.3s;
        }
        .hc-toggle:hover { opacity: 1; }
        *:focus {
          outline: 2px solid #FFC000 !important;
          outline-offset: 2px;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0,0,0,0);
          white-space: nowrap;
          border: 0;
        }
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

// Company Timeline Component
const CompanyTimeline = () => {
  const timeline = [
    { year: "2013", event: "Founded", description: "EmersonEIMS established in Nairobi, Kenya", icon: "🚀" },
    { year: "2015", event: "Expansion", description: "Expanded to 10 counties across Kenya", icon: "📈" },
    { year: "2017", event: "Solar Division", description: "Launched comprehensive solar solutions", icon: "☀️" },
    { year: "2019", event: "Award Recognition", description: "Recognized as top energy solutions provider", icon: "🏆" },
    { year: "2021", event: "47 Counties", description: "Full coverage across all 47 Kenyan counties", icon: "🗺️" },
    { year: "2023", event: "Innovation Hub", description: "Launched diagnostics and analytics platform", icon: "💡" },
    { year: "2024", event: "Digital Transformation", description: "Awwwards-level website launch", icon: "🌐" },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="eims-shell py-0">
        <div className="mb-12">
          <SectionHeading>Our Journey</SectionHeading>
          <p className="text-xl text-gray-400 text-center max-w-3xl mx-auto">
            Over a decade of powering Kenya with innovative energy solutions
          </p>
        </div>
        
        {/* Learn More for detailed timeline */}
        <LearnMoreSection
          buttonText="See Our Complete Timeline"
          variant="gold"
          title="EmersonEIMS Growth Story (2013-2024)"
        >
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 opacity-30" />
          <div className="space-y-12">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-amber-500/20 hover:border-amber-500/50 transition-all">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-3xl">{item.icon}</span>
                      <div>
                        <div className="text-2xl font-bold text-amber-400">{item.year}</div>
                        <div className="text-xl font-semibold text-white">{item.event}</div>
                      </div>
                    </div>
                    <p className="text-gray-300">{item.description}</p>
                  </div>
                </div>
                <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center border-4 border-black shadow-lg">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <div className="w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
        </LearnMoreSection>
      </div>
    </section>
  );
};

// Video Showcase Component
const VideoShowcase = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="eims-shell py-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            See Our Work in Action
          </motion.h2>
          <p className="text-xl text-gray-400 text-center mb-12 max-w-3xl mx-auto">
            Real projects, real results. Watch how we deliver power solutions across Kenya.
          </p>

          <div className="relative max-w-5xl mx-auto">
            {/* Video Container with Premium Border */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/20 hover:border-amber-500/40 transition-all duration-500 shadow-2xl group">
              {/* Gradient Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
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

            {/* Video Caption */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-gray-400">
                <span className="text-amber-400 font-semibold">EmersonEIMS</span> - Delivering reliable power solutions that keep Kenya moving forward
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Generator Brands Component - All brands we sell and service (new and used)
const GeneratorBrands = () => {
  const brands = [
    { name: 'Cummins', description: 'Premium American engines, 20-2000 kVA', category: 'New & Used', color: 'red' },
    { name: 'Perkins', description: 'British reliability, industrial workhorses', category: 'New & Used', color: 'blue' },
    { name: 'Caterpillar', description: 'Heavy-duty construction & mining', category: 'New & Used', color: 'yellow' },
    { name: 'FG Wilson', description: 'Global leader in power generation', category: 'New & Used', color: 'green' },
    { name: 'Volvo Penta', description: 'Swedish engineering excellence', category: 'New & Used', color: 'cyan' },
    { name: 'John Deere', description: 'Agricultural & industrial power', category: 'New & Used', color: 'green' },
    { name: 'Kohler', description: 'Residential & commercial solutions', category: 'New & Used', color: 'purple' },
    { name: 'MTU', description: 'German precision engineering', category: 'New & Used', color: 'blue' },
    { name: 'Yanmar', description: 'Japanese compact diesel specialists', category: 'New & Used', color: 'red' },
    { name: 'VOLTKA/Aksa', description: 'Cost-effective Turkish quality', category: 'New', color: 'amber' },
    { name: 'Doosan', description: 'Korean industrial power solutions', category: 'New & Used', color: 'orange' },
    { name: 'Generac', description: 'Standby & portable generators', category: 'New & Used', color: 'green' },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="eims-shell py-0">
        <div className="text-center mb-12">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Generator Brands We Sell & Service
          </motion.h2>
          <motion.p
            className="text-xl text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            We supply and service all major generator brands - both NEW and quality USED units. 
            12+ years of expertise across every manufacturer.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-amber-500/50 transition-all cursor-pointer group"
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center group-hover:from-amber-400/40 group-hover:to-amber-600/40 transition-all">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-bold text-white text-sm mb-1">{brand.name}</h3>
                <p className="text-[10px] text-gray-500 mb-2 line-clamp-2">{brand.description}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  brand.category === 'New' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {brand.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/generators" 
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold rounded-xl hover:from-amber-500 hover:to-amber-700 transition-all"
            >
              View New Generators
            </a>
            <a 
              href="/generators/used" 
              className="px-6 py-3 border-2 border-amber-400 text-amber-400 font-bold rounded-xl hover:bg-amber-400/10 transition-all"
            >
              Browse Used Inventory
            </a>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            Can&apos;t find your brand? We service ALL generator makes and models. Call +254 727 631 316
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// Mission, Vision, Values Component
const MissionVisionValues = () => {
  return (
    <section className="py-20 bg-black">
      <div className="eims-shell py-0">
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-blue-500/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
            <p className="text-gray-300">
              To power Kenya's future through intelligent, sustainable energy solutions that drive economic growth and improve quality of life for all Kenyans.
            </p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-green-500/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-5xl mb-4">👁️</div>
            <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
            <p className="text-gray-300">
              To be Africa's leading energy infrastructure management company, recognized for innovation, reliability, and transformative impact.
            </p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-amber-500/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-5xl mb-4">💎</div>
            <h3 className="text-2xl font-bold text-white mb-4">Our Values</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• Excellence in execution</li>
              <li>• Innovation & technology</li>
              <li>• Customer-centric approach</li>
              <li>• Sustainability & responsibility</li>
              <li>• Integrity & transparency</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default function AboutUsPage() {
  const [activeSection, setActiveSection] = useState('hero');
  const prefersReducedMotion = useReducedMotion();
  const { isLite } = usePerformanceTier();
  const containerRef = useRef<HTMLDivElement>(null);
  useScroll({ target: containerRef }); // Track scroll for future animations

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

  return (
    <ErrorBoundary>
      {/* Performance Monitor */}
      <PerformanceMonitor />

      {/* Premium Custom Cursor */}
      {!isLite && (
        <Suspense fallback={null}>
          <CustomCursor enabled={!prefersReducedMotion} />
        </Suspense>
      )}

      <main
        ref={containerRef}
        data-active-section={activeSection}
        className="eims-section min-h-screen relative"
      >
        {/* VideoObject Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'VideoObject',
              name: 'EmersonEIMS - Our Work in Action Kenya',
              description: 'Real projects, real results. Watch how Emerson EiMS delivers power solutions across Kenya. Over a decade of powering Kenya with generators, solar, and energy infrastructure.',
              thumbnailUrl: 'https://www.emersoneims.com/images/solar%20power%20farms.png',
              uploadDate: '2024-01-01',
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
        
        {/* Holographic Laser Overlay */}
        {!isLite && <HolographicLaser intensity="medium" color="#fbbf24" />}
        
        {/* WebGL Background Scene */}
        {!isLite && (
          <Suspense fallback={null}>
            <div className="fixed inset-0 -z-10 opacity-20">
              <SimpleThreeScene />
            </div>
          </Suspense>
        )}
      
      {/* Big Hero Image with Impact */}
      <BigHeroImage
        src="/images/solar%20power%20farms.png"
        alt="EmersonEIMS - Kenya's Leading Energy Solutions Provider"
        title="About EmersonEIMS"
        subtitle="Powering Kenya with intelligent energy infrastructure solutions since 2013"
        height="full"
        overlay="gradient"
        parallax={true}
      />

      {/* Intro Section */}
      <motion.section 
        className="py-20 bg-black"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="eims-shell max-w-4xl">
          {/* Company Logo */}
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <OptimizedImage
              src="/images/Emerson EIMS Logo and Tagline PNG-Picsart-BackgroundRemover.png"
              alt="EmersonEIMS Logo"
              width={400}
              height={200}
              className="mx-auto max-w-md"
            />
          </motion.div>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-6 text-center leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            From a small startup in Nairobi to Kenya's leading energy solutions provider, 
            we've transformed how businesses and communities access reliable, sustainable power.
          </motion.p>

          <motion.p 
            className="text-lg text-amber-400 text-center font-semibold mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Serving all 47 counties across Kenya with excellence since 2013
          </motion.p>
        </div>
      </motion.section>

      {/* Mission, Vision, Values */}
      <MissionVisionValues />

      {/* Generator Brands We Sell & Service */}
      <GeneratorBrands />

      {/* Company Timeline */}
      <CompanyTimeline />

      {/* Video Showcase */}
      <VideoShowcase />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-amber-900/20 via-black to-amber-900/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="mb-6">
              <SectionHeading>Join Us in Powering Kenya's Future</SectionHeading>
            </div>
          <p className="text-xl text-gray-300 mb-8">
            Ready to transform your energy infrastructure? Let's build something extraordinary together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold rounded-xl hover:from-amber-500 hover:to-amber-700 transition-all transform hover:scale-105"
            >
              Get in Touch
            </a>
            <a
              href="/services"
              className="px-8 py-4 border-2 border-amber-400 text-amber-400 font-bold rounded-xl hover:bg-amber-400/10 transition-all"
            >
              Explore Services
            </a>
          </div>
        </div>
      </section>
    </main>
    </ErrorBoundary>
  );
}
