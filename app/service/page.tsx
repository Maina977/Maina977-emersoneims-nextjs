'use client';

import React, { Suspense, useState, lazy, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import OptimizedImage from "@/components/media/OptimizedImage";

const SEOHead = lazy(() => import("@/components/contact/SEOHead"));
const ErrorBoundary = lazy(() => import("@/components/contact/ErrorBoundary"));
const AdaptivePerformanceMonitor = lazy(() => import("@/components/contact/AdaptivePerformanceMonitor"));
const DieselGenerators = lazy(() => import("@/app/components/service/DieselGenerators"));
const SolarEnergy = lazy(() => import("@/app/components/service/SolarEnergy"));
const HighVoltage = lazy(() => import("@/app/components/service/HighVoltage"));
const UPSSystems = lazy(() => import("@/app/components/service/UPSSystems"));
const MotorRewinding = lazy(() => import("@/app/components/service/MotorRewinding"));
const Fabrication = lazy(() => import("@/app/components/service/Fabrication"));
const WaterSystems = lazy(() => import("@/app/components/service/WaterSystems"));
const HVACSystems = lazy(() => import("@/app/components/service/HVACSystems"));
const Incinerators = lazy(() => import("@/app/components/service/Incinerators"));
const CrossServiceOptimizers = lazy(() => import("@/app/components/service/CrossServiceOptimizers"));

// Service Hero Section
const ServiceHero = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black"
      style={{ y }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(251,191,36,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(59,130,246,0.15),transparent_50%)]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.div
          style={{ opacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-blue-400 to-amber-400 bg-clip-text text-transparent animate-gradient">
            Premium Services
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Ten comprehensive service chapters. From diesel generators to solar systems, 
            we deliver engineering excellence across Kenya.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
              ⚡ Generators
            </span>
            <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
              ☀️ Solar
            </span>
            <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
              🔋 UPS
            </span>
            <span className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
              ⚙️ Automation
            </span>
          </div>
        </motion.div>
      </div>

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
  );
};

// Service Navigation Component
const ServiceNavigation = ({ onServiceSelect }: { onServiceSelect: (service: string) => void }) => {
  const services = [
    { id: 'diesel', name: 'Diesel Generators', icon: '⚡', color: 'from-yellow-500 to-yellow-600' },
    { id: 'solar', name: 'Solar Energy', icon: '☀️', color: 'from-blue-500 to-blue-600' },
    { id: 'hv', name: 'High Voltage', icon: '🔌', color: 'from-red-500 to-red-600' },
    { id: 'ups', name: 'UPS Systems', icon: '🔋', color: 'from-green-500 to-green-600' },
    { id: 'motor', name: 'Motor Rewinding', icon: '⚙️', color: 'from-purple-500 to-purple-600' },
    { id: 'fab', name: 'Fabrication', icon: '🔧', color: 'from-cyan-500 to-cyan-600' },
    { id: 'water', name: 'Water Systems', icon: '💧', color: 'from-blue-400 to-blue-500' },
    { id: 'hvac', name: 'HVAC Systems', icon: '❄️', color: 'from-indigo-500 to-indigo-600' },
    { id: 'incin', name: 'Incinerators', icon: '🔥', color: 'from-orange-500 to-orange-600' },
    { id: 'opt', name: 'Optimizers', icon: '📊', color: 'from-pink-500 to-pink-600' },
  ];

  return (
    <section className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => {
                onServiceSelect(service.id);
                document.getElementById(service.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`flex-shrink-0 px-6 py-3 rounded-lg bg-gradient-to-r ${service.color} text-white font-semibold hover:scale-105 transition-all whitespace-nowrap`}
            >
              <span className="mr-2">{service.icon}</span>
              {service.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

// Service Stats Component
const ServiceStats = () => {
  const stats = [
    { value: "10", label: "Service Categories", icon: "📋" },
    { value: "2,450+", label: "Projects Completed", icon: "🏗️" },
    { value: "98.7%", label: "Success Rate", icon: "✅" },
    { value: "24/7", label: "Support Available", icon: "🔄" },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center p-6 bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 hover:border-amber-500/50 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function ServicePage() {
  const [performanceTier, setPerformanceTier] = useState("high");
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Suspense fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white">Loading services...</p>
          </div>
        </div>
      }>
        <SEOHead
          title="EmersonEIMS Services | Generator Intelligence, Solar, UPS, HV Infrastructure & More"
          description="Ten premium service chapters. Calculators, charts, adaptive performance, and cinematic design that sells — built for Kenya and beyond."
          keywords="services, generators, solar, UPS, high voltage, infrastructure, Kenya, EmersonEIMS, engineering, maintenance"
        />
      </Suspense>

      <main ref={containerRef} role="main" className="bg-black text-white">
        {/* Hero Section */}
        <ServiceHero />

        {/* Service Navigation */}
        <ServiceNavigation onServiceSelect={(id) => {
          const element = document.getElementById(id);
          element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }} />

        {/* Service Stats */}
        <ServiceStats />

        {/* Service Sections */}
        <ErrorBoundary>
          <Suspense fallback={
            <div className="py-20 text-center">
              <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading service content...</p>
            </div>
          }>
            <div id="diesel">
              <DieselGenerators key="diesel" performanceTier={performanceTier} />
            </div>
            <div id="solar">
              <SolarEnergy key="solar" performanceTier={performanceTier} />
            </div>
            <div id="hv">
              <HighVoltage key="hv" performanceTier={performanceTier} />
            </div>
            <div id="ups">
              <UPSSystems key="ups" performanceTier={performanceTier} />
            </div>
            <div id="motor">
              <MotorRewinding key="motor" performanceTier={performanceTier} />
            </div>
            <div id="fab">
              <Fabrication key="fab" performanceTier={performanceTier} />
            </div>
            <div id="water">
              <WaterSystems key="water" performanceTier={performanceTier} />
            </div>
            <div id="hvac">
              <HVACSystems key="hvac" performanceTier={performanceTier} />
            </div>
            <div id="incin">
              <Incinerators key="incin" performanceTier={performanceTier} />
            </div>
            <div id="opt">
              <CrossServiceOptimizers key="opt" performanceTier={performanceTier} />
            </div>
            <AdaptivePerformanceMonitor onPerformanceChange={setPerformanceTier} />
          </Suspense>
        </ErrorBoundary>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-amber-900/20 via-black to-amber-900/20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Ready to Transform Your Energy Infrastructure?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Let our experts design the perfect solution for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold rounded-xl hover:from-amber-500 hover:to-amber-700 transition-all transform hover:scale-105"
              >
                Get Free Consultation
              </a>
              <a 
                href="/diagnostics" 
                className="px-8 py-4 border-2 border-amber-400 text-amber-400 font-bold rounded-xl hover:bg-amber-400/10 transition-all"
              >
                Try Diagnostics Tool
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
