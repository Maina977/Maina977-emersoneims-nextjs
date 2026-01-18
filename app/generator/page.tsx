import SectionLead from "../components/generators/SectionLead";
import GeneratorCalculator from "../components/generators/generatorscalculator";
import MTBFChart from "../components/generators/MTBFChart";
import ErrorFrequencyChart from "../components/generators/ErrorFrequencyChart";
import { cumminsGenerators } from "../lib/data/cumminsgenerators";
import { generatorServices } from "../lib/data/generatorservices";

export const metadata = {
  title: "Cummins Generators — Powering Kenya | EmersonEIMS",
  description: "From 20kVA to 2000kVA, verified specs, Hollywood‑grade visuals, and engineering mastery.",
};

export default function GeneratorPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Video */}
      <section className="relative w-full h-screen overflow-hidden bg-black">
        <video
          className="absolute inset-0 w-full h-full object-cover cinematic"
          src="/videos/Solution(1).mp4"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/GEN 2-1920x1080.png"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-5xl md:text-7xl font-display text-brand-gold drop-shadow-glow animate-pulse">
            Cummins Generators — Powering Kenya
          </h1>
          <p className="mt-6 max-w-2xl text-white/80 text-lg">
            From 20kVA to 2000kVA, verified specs, Hollywood‑grade visuals, and engineering mastery.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6">
            <a href="#models" className="sci-fi-button">Explore Models</a>
            <a href="#services" className="sci-fi-outline">Our Services</a>
          </div>
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

      {/* Quick Models Preview */}
      <section id="models" className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLead
            title="Popular Models"
            subtitle="From compact 20kVA to industrial 2000kVA"
            centered
          />
          
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cumminsGenerators.slice(0, 4).map((gen) => (
              <div key={gen.model} className="bg-gray-900/50 rounded-lg p-6 border border-gray-700 hover:border-brand-gold transition-colors">
                <h3 className="text-xl font-bold text-brand-gold">{gen.model}</h3>
                <p className="text-white/80 mt-2">{gen.kva} kVA • {gen.phase}</p>
                <p className="text-white/60 text-sm mt-2">{gen.engine}</p>
                <a href="/generator/models" className="inline-block mt-4 text-brand-gold hover:text-yellow-400">
                  View Details →
                </a>
              </div>
            ))}
          </div>
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
              <div key={index} className="bg-black/50 rounded-lg p-6 border border-gray-800 hover:border-blue-500 transition-colors">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                  <span className="text-xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-white">{service}</h3>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <a href="/services" className="sci-fi-button">View All Services</a>
          </div>
        </div>
      </section>

      {/* Spare Parts Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLead
            title="OEM Spare Parts"
            subtitle="Genuine parts for Cummins, Perkins, Caterpillar, Volvo Penta — backed by warranty"
            centered
          />
          
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group p-6 rounded-xl border border-gray-800 bg-gray-900/50 hover:bg-gray-900 hover:border-brand-gold transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-2xl mb-4">
                📦
              </div>
              <h3 className="text-xl font-bold text-white mb-2">OEM Parts</h3>
              <p className="text-white/70 text-sm">Genuine factory parts for all major brands</p>
              <ul className="mt-4 space-y-2 text-sm text-white/60">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-brand-gold mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Alternators & AVR
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-brand-gold mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Controllers (DSE, ComAp)
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-brand-gold mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Starter motors & batteries
                </li>
              </ul>
            </div>

            <div className="group p-6 rounded-xl border border-gray-800 bg-gray-900/50 hover:bg-gray-900 hover:border-brand-gold transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl mb-4">
                ⚙️
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Engine Parts</h3>
              <p className="text-white/70 text-sm">Critical engine components & consumables</p>
              <ul className="mt-4 space-y-2 text-sm text-white/60">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-brand-gold mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Oil & fuel filters
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-brand-gold mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Injectors & pumps
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-brand-gold mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Gaskets & seals
                </li>
              </ul>
            </div>

            <div className="group p-6 rounded-xl border border-gray-800 bg-gray-900/50 hover:bg-gray-900 hover:border-brand-gold transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-2xl mb-4">
                🚚
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Fast Delivery</h3>
              <p className="text-white/70 text-sm">Same-day delivery across Nairobi & counties</p>
              <ul className="mt-4 space-y-2 text-sm text-white/60">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-brand-gold mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Same-day Nairobi
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-brand-gold mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Next-day counties
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-brand-gold mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Technical support included
                </li>
              </ul>
            </div>

            <div className="group p-6 rounded-xl border border-gray-800 bg-gray-900/50 hover:bg-gray-900 hover:border-brand-gold transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-2xl mb-4">
                ✅
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Warranty</h3>
              <p className="text-white/70 text-sm">All parts backed by manufacturer warranty</p>
              <ul className="mt-4 space-y-2 text-sm text-white/60">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-brand-gold mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  12-month warranty
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-brand-gold mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Free installation advice
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-brand-gold mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Authenticity guarantee
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <a href="/contact" className="sci-fi-button">Order Spare Parts</a>
          </div>
        </div>
      </section>

      {/* Maintenance Plans Section */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLead
            title="Maintenance Plans"
            subtitle="Scheduled servicing to maximize uptime and extend generator lifespan"
            centered
          />
          
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="p-8 rounded-xl border border-gray-700 bg-black/30 text-center hover:border-gray-600 transition-colors">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-6">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Basic Plan</h3>
              <p className="text-sm text-white/60 mb-6">Essential maintenance for small generators</p>
              <p className="text-4xl font-bold text-brand-gold mb-2">
                KSh 50,000<span className="text-lg text-white/60">/year</span>
              </p>
              <ul className="mt-8 space-y-3 text-left">
                <li className="flex items-start text-white/70">
                  <svg className="w-5 h-5 text-brand-gold mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  2 Scheduled Services/year
                </li>
                <li className="flex items-start text-white/70">
                  <svg className="w-5 h-5 text-brand-gold mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Oil & filter changes
                </li>
                <li className="flex items-start text-white/70">
                  <svg className="w-5 h-5 text-brand-gold mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Remote monitoring
                </li>
                <li className="flex items-start text-white/70">
                  <svg className="w-5 h-5 text-brand-gold mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Email support
                </li>
              </ul>
              <a href="/contact" className="mt-8 block sci-fi-outline w-full py-3">
                Select Plan
              </a>
            </div>
            
            {/* Professional Plan - Popular */}
            <div className="p-8 rounded-xl border-2 border-brand-gold bg-black/50 text-center relative transform scale-105 shadow-2xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-brand-gold text-black px-6 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
                  Most Popular
                </span>
              </div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 mb-6 mt-2">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Professional Plan</h3>
              <p className="text-sm text-white/60 mb-6">Comprehensive care for critical power</p>
              <p className="text-4xl font-bold text-brand-gold mb-2">
                KSh 120,000<span className="text-lg text-white/60">/year</span>
              </p>
              <ul className="mt-8 space-y-3 text-left">
                <li className="flex items-start text-white">
                  <svg className="w-5 h-5 text-brand-gold mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  4 Scheduled Services/year
                </li>
                <li className="flex items-start text-white">
                  <svg className="w-5 h-5 text-brand-gold mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  24/7 Remote monitoring
                </li>
                <li className="flex items-start text-white">
                  <svg className="w-5 h-5 text-brand-gold mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Priority phone support
                </li>
                <li className="flex items-start text-white">
                  <svg className="w-5 h-5 text-brand-gold mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  10% Discount on parts
                </li>
                <li className="flex items-start text-white">
                  <svg className="w-5 h-5 text-brand-gold mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Predictive maintenance
                </li>
              </ul>
              <a href="/contact" className="mt-8 block sci-fi-button w-full py-3">
                Select Plan
              </a>
            </div>
            
            {/* Enterprise Plan */}
            <div className="p-8 rounded-xl border border-gray-700 bg-black/30 text-center hover:border-gray-600 transition-colors">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-6">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise Plan</h3>
              <p className="text-sm text-white/60 mb-6">Dedicated support for mission-critical facilities</p>
              <p className="text-4xl font-bold text-brand-gold mb-2">
                Custom
              </p>
              <ul className="mt-8 space-y-3 text-left">
                <li className="flex items-start text-white/70">
                  <svg className="w-5 h-5 text-brand-gold mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Unlimited services
                </li>
                <li className="flex items-start text-white/70">
                  <svg className="w-5 h-5 text-brand-gold mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Dedicated engineer
                </li>
                <li className="flex items-start text-white/70">
                  <svg className="w-5 h-5 text-brand-gold mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  2-hour response SLA
                </li>
                <li className="flex items-start text-white/70">
                  <svg className="w-5 h-5 text-brand-gold mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  20% Discount on parts
                </li>
                <li className="flex items-start text-white/70">
                  <svg className="w-5 h-5 text-brand-gold mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  MTBF tracking & reports
                </li>
              </ul>
              <a href="/contact" className="mt-8 block sci-fi-outline w-full py-3">
                Contact Sales
              </a>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/10 mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">MTBF Tracking</h4>
              <p className="text-sm text-white/60">
                Mean Time Between Failures analysis to predict maintenance needs
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-500/10 mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Predictive Maintenance</h4>
              <p className="text-sm text-white/60">
                AI-powered analytics detect issues before they cause downtime
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/10 mb-4">
                <span className="text-3xl">📱</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Mobile App</h4>
              <p className="text-sm text-white/60">
                Real-time notifications and service history at your fingertips
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
