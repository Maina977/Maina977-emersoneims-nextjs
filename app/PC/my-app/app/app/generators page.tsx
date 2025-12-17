'use client';

import SectionLead from "@/componets/generators/SectionLead";
import GeneratorCalculator from "@/componets/generators/generatorscalculator";
import MTBFChart from "@/componets/generators/MTBFChart";
import ErrorFrequencyChart from "@/componets/generators/ErrorFrequencyChart";
import { cumminsGenerators } from "@/lib/data/cumminsgenerators";
import { generatorServices } from "@/lib/data/generatorservices";
import OptimizedVideo from "@/components/media/OptimizedVideo";

export default function GeneratorPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Video */}
      <section className="relative w-full h-screen overflow-hidden bg-black">
        <OptimizedVideo
          src="https://www.emersoneims.com/wp-content/uploads/2025/10/FOR-TRIALS-IN-KADENCE-2.mp4"
          poster="https://www.emersoneims.com/wp-content/uploads/2025/11/GEN-1-1-scaled.png"
          alt="Cummins Generator Warehouse"
          autoplay={true}
          loop={true}
          muted={true}
          playsInline={true}
          hollywoodGrading={true}
          priority={true}
          className="absolute inset-0 w-full h-full"
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
            <a href="/generator/services" className="sci-fi-button">View All Services</a>
          </div>
        </div>
      </section>
    </main>
  );
}
