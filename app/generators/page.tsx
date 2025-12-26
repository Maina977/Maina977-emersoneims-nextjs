'use client';

import { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionLead, GeneratorCalculator, MTBFChart, ErrorFrequencyChart } from "@/components/generators";
import { cumminsGenerators } from "@/app/lib/data/cumminsgenerators";
import { generatorServices } from "@/app/lib/data/generatorservices";
import OptimizedVideo from "@/components/media/OptimizedVideo";
import OptimizedImage from "@/components/media/OptimizedImage";
import HolographicLaser from '@/components/effects/HolographicLaser';
import ErrorBoundary from '@/components/error/ErrorBoundary';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SimpleThreeScene = lazy(() => import('@/components/webgl/SimpleThreeScene'));
const FloatingUFOs = lazy(() => import('@/components/webgl/FloatingUFOs'));
const InteractiveBlobs = lazy(() => import('@/components/webgl/InteractiveBlobs'));
const AbstractFloatingShapes = lazy(() => import('@/components/webgl/AbstractFloatingShapes'));
const ProductConfigurator = lazy(() => import('@/components/product/ProductConfigurator'));
const Product360Viewer = lazy(() => import('@/components/product/Product360Viewer'));
const ARPreview = lazy(() => import('@/components/ar/ARPreview'));

// 3D Generator Viewer Component
const Generator3DViewer = ({ generator }: { generator: typeof cumminsGenerators[0] }) => {
  const [isViewing, setIsViewing] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  return (
    <div className="relative">
      <motion.div
        className="relative h-64 bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseMove={(e) => {
          if (isViewing) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 360;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 360;
            setRotation({ x: y, y: x });
          }
        }}
        onMouseDown={() => setIsViewing(true)}
        onMouseUp={() => setIsViewing(false)}
        onMouseLeave={() => setIsViewing(false)}
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl">⚡</div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm p-3 rounded-lg">
          <p className="text-white text-sm text-center">Drag to rotate • Click for AR view</p>
        </div>
      </motion.div>
      <button
        onClick={() => {
          if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            window.open(`/ar/generator/${generator.model}`, '_blank');
          } else {
            alert('AR preview available on mobile devices. Scan QR code for AR experience.');
          }
        }}
        className="mt-4 w-full cta-button-primary"
      >
        📱 View in AR
      </button>
    </div>
  );
};

// Generator Comparison Tool
const GeneratorComparison = () => {
  const [selectedGenerators, setSelectedGenerators] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleGenerator = (model: string) => {
    setSelectedGenerators(prev =>
      prev.includes(model)
        ? prev.filter(m => m !== model)
        : prev.length < 3
          ? [...prev, model]
          : prev
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">Compare Generators</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-600 transition-all"
        >
          {isOpen ? 'Hide' : 'Compare'}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {cumminsGenerators.slice(0, 6).map((gen) => (
              <button
                key={gen.model}
                onClick={() => toggleGenerator(gen.model)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedGenerators.includes(gen.model)
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="text-white font-semibold">{gen.model}</div>
                <div className="text-gray-400 text-sm">{gen.kva} kVA</div>
              </button>
            ))}
          </div>

          {selectedGenerators.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3">Specification</th>
                    {selectedGenerators.map((model) => {
                      const gen = cumminsGenerators.find(g => g.model === model);
                      return <th key={model} className="text-left p-3">{gen?.model}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-800">
                    <td className="p-3 text-gray-400">Power Output</td>
                    {selectedGenerators.map((model) => {
                      const gen = cumminsGenerators.find(g => g.model === model);
                      return <td key={model} className="p-3">{gen?.kva} kVA</td>;
                    })}
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="p-3 text-gray-400">Phase</td>
                    {selectedGenerators.map((model) => {
                      const gen = cumminsGenerators.find(g => g.model === model);
                      return <td key={model} className="p-3">{gen?.phase}</td>;
                    })}
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="p-3 text-gray-400">Engine</td>
                    {selectedGenerators.map((model) => {
                      const gen = cumminsGenerators.find(g => g.model === model);
                      return <td key={model} className="p-3">{gen?.engine}</td>;
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default function GeneratorPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

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

  return (
    <main ref={containerRef} className="min-h-screen bg-black relative">
      {/* Holographic Laser Overlay */}
      <HolographicLaser intensity="medium" color="#fbbf24" />
      
      {/* 3D Background Scene with Floating UFOs */}
      <Suspense fallback={null}>
        <div className="fixed inset-0 -z-10 opacity-20">
          <ErrorBoundary fallback={null}>
            <FloatingUFOs className="w-full h-full" interactive={false} />
          </ErrorBoundary>
        </div>
      </Suspense>
      {/* Enhanced Hero Video */}
      <motion.section
        className="relative w-full h-screen overflow-hidden bg-black"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <OptimizedVideo
          src="https://www.emersoneims.com/wp-content/uploads/2025/10/FOR-TRIALS-IN-KADENCE-2.mp4"
          poster="https://www.emersoneims.com/wp-content/uploads/2025/11/GEN-1-1-scaled.png"
          autoPlay={true}
          loop={true}
          muted={true}
          playsInline={true}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
        
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-display text-brand-gold drop-shadow-glow mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Cummins Generators
          </motion.h1>
          <motion.p
            className="mt-4 max-w-3xl text-white/90 text-xl md:text-2xl font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            From 20kVA to 2000kVA, verified specs, Hollywood‑grade visuals, and engineering mastery.
            <br />
            <span className="text-[#fbbf24]">3D View • AR Preview • Real-time Monitoring</span>
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <a href="#models" className="cta-button-primary">Explore Models →</a>
            <a href="#comparison" className="cta-button-secondary">Compare Generators →</a>
            <a href="/contact" className="cta-button-secondary">Get Quote →</a>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </motion.div>
      </motion.section>

      {/* Interactive Blobs Section */}
      <section className="relative py-20 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Suspense fallback={null}>
            <ErrorBoundary fallback={null}>
              <InteractiveBlobs className="w-full h-full" />
            </ErrorBoundary>
          </Suspense>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <SectionLead
            title="Gravity-Defying Technology"
            subtitle="Experience our cutting-edge generator technology in 3D"
            centered
          />
        </div>
      </section>

      {/* 3D Viewer Section */}
      <section id="3d-viewer" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <SectionLead
            title="Interactive 3D Generator Viewer"
            subtitle="Explore generators in 3D with AR preview capability"
            centered
          />
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cumminsGenerators.slice(0, 3).map((gen) => (
              <motion.div
                key={gen.model}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 p-6"
              >
                <h3 className="text-2xl font-bold text-[#fbbf24] mb-4 font-display">{gen.model}</h3>
                <Generator3DViewer generator={gen} />
                <div className="mt-4 space-y-2">
                  <p className="text-white"><span className="text-gray-400">Power:</span> {gen.kva} kVA</p>
                  <p className="text-white"><span className="text-gray-400">Phase:</span> {gen.phase}</p>
                  <p className="text-white"><span className="text-gray-400">Engine:</span> {gen.engine}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Tool */}
      <section id="comparison" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <GeneratorComparison />
        </div>
      </section>

      {/* Calculator & Charts Section */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLead
            title="Generator ROI Analysis"
            subtitle="Calculate your costs and compare reliability metrics"
            centered
          />
          
          <div className="mt-12 grid lg:grid-cols-2 gap-8">
            <GeneratorCalculator />
            <div className="space-y-8">
              <MTBFChart />
              <ErrorFrequencyChart />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Models Preview */}
      <section id="models" className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLead
            title="Popular Models"
            subtitle="From compact 20kVA to industrial 2000kVA"
            centered
          />
          
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cumminsGenerators.slice(0, 8).map((gen, index) => (
              <motion.div
                key={gen.model}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 border border-gray-700 hover:border-brand-gold transition-all hover:shadow-2xl hover:shadow-amber-500/20"
              >
                <div className="relative h-48 mb-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-50 group-hover:opacity-100 transition-opacity">
                    ⚡
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-amber-500 text-black text-xs font-bold rounded">
                    {gen.kva} kVA
                  </div>
                </div>
                <h3 className="text-xl font-bold text-brand-gold mb-2">{gen.model}</h3>
                <p className="text-white/80 text-sm mb-1">{gen.phase} Phase</p>
                <p className="text-white/60 text-xs mb-4">{gen.engine}</p>
                <div className="flex gap-2">
                  <a
                    href={`/generators/${gen.model.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex-1 text-center px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-600 transition-all text-sm"
                  >
                    View Details
                  </a>
                  <button
                    onClick={() => {
                      if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                        window.open(`/ar/generator/${gen.model}`, '_blank');
                      }
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm"
                    title="AR Preview (Mobile)"
                  >
                    📱
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Spare Parts Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLead
            title="Genuine Spare Parts"
            subtitle="Premium quality parts for optimal generator performance"
            centered
          />
          
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <OptimizedImage
              src="https://emersoneims.com/wp-content/uploads/2025/10/SPARES_300dpi.-fotor-enhance-20250821225707-1-1920x1080-1.webp"
              alt="Generator spare parts inventory - EmersonEIMS"
              width={1920}
              height={1080}
              className="w-full rounded-xl border border-amber-500/20"
            />
          </motion.div>
        </div>
      </section>

      {/* Abstract Floating Shapes Section */}
      <section className="relative py-20 bg-gradient-to-b from-gray-900 via-black to-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <Suspense fallback={null}>
            <ErrorBoundary fallback={null}>
              <AbstractFloatingShapes className="w-full h-full" interactive={true} />
            </ErrorBoundary>
          </Suspense>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <SectionLead
            title="Advanced Engineering"
            subtitle="Precision-crafted generators with unmatched reliability"
            centered
          />
        </div>
      </section>

      {/* Services Preview */}
      <section id="services" className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLead
            title="Our Services"
            subtitle="End-to-end generator solutions"
            centered
          />
          
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatorServices.slice(0, 6).map((service: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-gradient-to-br from-black to-gray-900 rounded-xl p-6 border border-gray-800 hover:border-[#fbbf24] transition-all hover:shadow-xl hover:shadow-[#fbbf24]/20"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{service}</h3>
                <p className="text-gray-400 text-sm">Professional service with 24/7 support</p>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <a href="/service" className="cta-button-primary" aria-label="View all generator services">
              <span>View All Services →</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#fbbf24]/10 via-black to-[#fbbf24]/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent font-display">
            Ready to Power Your Business?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get a free consultation and quote for your generator needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="cta-button-primary">
              <span>Get Free Consultation →</span>
            </a>
            <a href="/diagnostics" className="cta-button-secondary">
              <span>Try Diagnostics Tool →</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
