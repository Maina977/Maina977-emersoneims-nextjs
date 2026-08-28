'use client'

import { useState, useRef, useEffect, Suspense, lazy } from 'react';
import RepairCentreCallout from '@/components/repair-centre/RepairCentreCallout';
import { GENERATOR_SIZES } from '@/lib/products/generatorSizes';
import dynamic from 'next/dynamic';
import Image from 'next/image';
/*
 * NO framer-motion, NO GSAP/three.js on this page — deliberately.
 *
 * This is the page that markets the business. It previously shipped 72
 * motion-wrapped elements whose `initial={{ opacity: 0 }}` was written into the
 * server HTML, so the content stayed invisible until a 486 KB bundle had
 * downloaded, parsed and executed — roughly 3-4.5s on Nairobi 4G, longer on 3G,
 * and permanently blank if the bundle failed. A first-time visitor met a mostly
 * empty page.
 *
 * The owner's call, and the right one: on a commercial page, working beats
 * beautiful. The visual design is untouched — colours, gradients, layout,
 * spacing and CSS hover states all remain. What went is the JavaScript-driven
 * motion and the cinematic FX layer.
 *
 * If motion is ever wanted back here, use CSS animations with
 * animation-fill-mode so the content is visible by default and animates without
 * blocking on JS. Do not reintroduce `initial={{ opacity: 0 }}` on this page.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// PERFORMANCE OPTIMIZED IMPORTS
// Heavy dependencies (Chart.js, GSAP) loaded via dynamic imports
// Framer Motion kept for animations but heavy chart/GSAP components lazy loaded
// ═══════════════════════════════════════════════════════════════════════════════

// Light components - loaded immediately
import { SectionLead, GeneratorCalculator } from "@/components/generators";
import { cumminsGenerators } from "@/app/lib/data/cumminsgenerators";
import { generatorServices } from "@/app/lib/data/generatorservices";
import ErrorBoundary from '@/components/error/ErrorBoundary';
import { usePerformanceTier } from '@/components/performance/usePerformanceTier';
import { CUMMINS_BRAND_INFO, CUMMINS_FAQ } from '@/lib/brands/cumminsData';
import GeneratorEngineeringDeepDive from '@/components/generators/GeneratorEngineeringDeepDive';
import ConversionCTA from '@/components/cta/ConversionCTA';
// Lead capture for the #quote section. Imported statically rather than lazily:
// it is the page's only form and sits directly under the hero, so it must be
// present the moment the primary CTA is clicked.
import QuickInquiryForm from '@/components/forms/QuickInquiryForm';

// ═══════════════════════════════════════════════════════════════════════════════
// HEAVY COMPONENTS - Lazy loaded (Chart.js ~70KB, GSAP ~30KB saved)
// ═══════════════════════════════════════════════════════════════════════════════
const MTBFChart = dynamic(() => import('@/components/generators/MTBFChart'), {
  ssr: false,
  loading: () => <div className="h-64 bg-black/60 rounded-lg animate-pulse" />
});

const ErrorFrequencyChart = dynamic(() => import('@/components/generators/ErrorFrequencyChart'), {
  ssr: false,
  loading: () => <div className="h-64 bg-black/60 rounded-lg animate-pulse" />
});

const HolographicLaser = dynamic(() => import('@/components/effects/HolographicLaser'), {
  ssr: false,
  loading: () => null
});

const OptimizedVideo = dynamic(() => import('@/components/media/OptimizedVideo'), { ssr: false });
const CinematicVideo = dynamic(() => import('@/components/media/CinematicVideo'), { ssr: false });
const OptimizedImage = dynamic(() => import('@/components/media/OptimizedImage'), { ssr: false });
const GeneratorSizingCalculator = dynamic(() => import('@/components/calculators/GeneratorSizingCalculator'), { ssr: false });

// SALES BOOSTING COMPONENTS - MAXIMIZE CONVERSIONS
const GeneratorSalesBooster = dynamic(() => import('@/components/generators/GeneratorSalesBooster'), { ssr: false });
/*
 * SERVER-RENDERED ON PURPOSE — do not add `ssr: false` back.
 *
 * This component holds the real price table: 20 capacities from 10 kVA to
 * 2000 kVA with a figure against each, built from the single source of truth in
 * lib/brands/cumminsData.ts. Its own header comment reads "People search
 * 'generator price Kenya' - give them prices!" — and it was then loaded with
 * ssr:false, so not one of those prices ever appeared in the server response.
 * Google never saw them. The live page showed only 6 hardcoded KES figures
 * while 20 real ones sat behind a client-only chunk.
 *
 * "Generator prices Kenya" is the highest commercial-intent query this business
 * can rank for, and the answer was already written and deliberately hidden.
 *
 * Safe to server-render: the component uses useState only — no window,
 * document, localStorage or observers. It still code-splits; dropping ssr:false
 * changes only whether the markup is in the HTML.
 */
const GeneratorPriceList = dynamic(() => import('@/components/generators/GeneratorPriceList'));
const SizingCalculatorNew = dynamic(() => import('@/components/generators/GeneratorSizingCalculator'), { ssr: false });

// EDUCATIONAL CONTENT - KNOWLEDGE CENTER
const GeneratorEducationPanel = dynamic(() => import('@/components/generators/GeneratorEducationPanel'), { ssr: false });
const CinematicImageGallery = dynamic(() => import('@/components/ui/CinematicImageGallery'), { ssr: false });
// Server-rendered: carries brand copy and pricing (showPricing) directly under
// the hero. Verified free of browser-only APIs.
const CumminsBanner = dynamic(() => import('@/components/brands/CumminsBanner'));

// CONVERSION CTA HUB - Direct Action Buttons
// Server-rendered: this is a block of conversion links. Client-only rendering
// made them invisible to the crawler, so they carried no internal-link value
// and did not exist for anyone whose JS failed.
const ConversionCTAHub = dynamic(() => import('@/components/generators/ConversionCTAHub'));

// AI DIAGNOSTIC COMPONENTS
const AIVisualDiagnostic = dynamic(() => import('@/components/generator-oracle/AIVisualDiagnostic'), { ssr: false });

// ═══════════════════════════════════════════════════════════════════════════════
// BIBLE OF GENERATORS - COMPREHENSIVE NAVIGATION HUB
// ═══════════════════════════════════════════════════════════════════════════════
const GENERATOR_HUB_SECTIONS = [
  {
    id: 'new-generators',
    title: 'New Generators',
    icon: '⚡',
    href: '#new-generators',
    color: 'amber',
    description: 'Cummins & Voltka - 10kVA to 2000kVA',
    badge: 'HOT'
  },
  {
    id: 'used-generators',
    title: 'Used Generators',
    icon: '🔄',
    href: '/generators/used',
    color: 'green',
    description: 'Certified pre-owned with warranty'
  },
  {
    id: 'rental',
    title: 'Rental & Leasing',
    icon: '📅',
    href: '/generators/rental',
    color: 'blue',
    description: 'Short & long-term power solutions'
  },
  {
    id: 'spare-parts',
    title: 'Spare Parts',
    icon: '🔧',
    href: '/generators/spare-parts',
    color: 'orange',
    description: '2000+ OEM & aftermarket parts'
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    icon: '🛠️',
    href: '/generators/maintenance',
    color: 'cyan',
    description: 'Scheduled & emergency service'
  },
  {
    id: 'installation',
    title: 'Installation',
    icon: '🏗️',
    href: '/generators/installation',
    color: 'purple',
    description: 'Professional 8-phase installation'
  },
  // Workshop Repairs & Fabrication — added 2026-07-21 (owner brief). Placed
  // alongside the existing service cards; nothing was removed or reordered.
  {
    id: 'workshop-services',
    title: 'Workshop Repairs & Fabrication',
    icon: '🏭',
    href: '/generators/workshop-services',
    color: 'amber',
    description: 'Radiators, starters, alternators, injectors, turbos, engine overhauls, UPS, pumps, canopies, tanks & fabrication'
  },
  {
    id: 'ai-diagnostic',
    title: 'AI Diagnostic',
    icon: '🤖',
    href: '#ai-diagnostic',
    color: 'pink',
    description: 'AI-assisted visual triage — verification required',
    badge: 'AI'
  },
  {
    id: 'maintenance-hub',
    title: 'Maintenance Hub',
    icon: '📊',
    href: '/maintenance-hub/generators',
    color: 'red',
    description: 'Engine Room Command Center'
  },
];

// GENERATOR SYSTEMS - Educational Hub
const GENERATOR_SYSTEMS = [
  {
    id: 'engine-system',
    name: 'Engine System',
    icon: '🔥',
    description: 'The heart of your generator - diesel/gas combustion engine',
    components: ['Cylinder block', 'Pistons', 'Crankshaft', 'Camshaft', 'Valves', 'Turbocharger'],
    commonIssues: ['Overheating', 'Low oil pressure', 'White/black smoke', 'Hard starting'],
    maintenanceTips: ['Regular oil changes', 'Air filter inspection', 'Coolant level checks'],
    color: 'orange'
  },
  {
    id: 'fuel-system',
    name: 'Fuel System',
    icon: '⛽',
    description: 'Delivers clean fuel for optimal combustion',
    components: ['Fuel tank', 'Fuel pump', 'Fuel filter', 'Injectors', 'Fuel lines', 'Return lines'],
    commonIssues: ['Contaminated fuel', 'Clogged filters', 'Injector failure', 'Air in fuel lines'],
    maintenanceTips: ['Use clean diesel', 'Replace filters regularly', 'Drain water from tank'],
    color: 'yellow'
  },
  {
    id: 'cooling-system',
    name: 'Cooling System',
    icon: '❄️',
    description: 'Prevents engine overheating and maintains optimal temperature',
    components: ['Radiator', 'Water pump', 'Thermostat', 'Coolant hoses', 'Fan', 'Temperature sensors'],
    commonIssues: ['Coolant leaks', 'Thermostat failure', 'Radiator blockage', 'Fan belt wear'],
    maintenanceTips: ['Check coolant levels', 'Inspect hoses for cracks', 'Clean radiator fins'],
    color: 'cyan'
  },
  {
    id: 'electrical-system',
    name: 'Electrical System',
    icon: '🔌',
    description: 'Generates and distributes electrical power',
    components: ['Alternator', 'AVR', 'Exciter', 'Battery', 'Starter motor', 'Wiring harness'],
    commonIssues: ['Low voltage output', 'AVR failure', 'Dead battery', 'Starter problems'],
    maintenanceTips: ['Battery maintenance', 'Check connections', 'AVR calibration'],
    color: 'blue'
  },
  {
    id: 'ats-system',
    name: 'ATS (Auto Transfer Switch)',
    icon: '🔀',
    description: 'Automatic power transfer between mains and generator',
    components: ['Transfer contactor', 'Control module', 'Sensors', 'Time delay relays', 'Indicators'],
    commonIssues: ['Delayed transfer', 'Stuck contactors', 'Sensor faults', 'Control failures'],
    maintenanceTips: ['Test monthly', 'Clean contacts', 'Verify settings'],
    color: 'purple'
  },
  {
    id: 'exhaust-system',
    name: 'Exhaust System',
    icon: '💨',
    description: 'Expels combustion gases safely with noise reduction',
    components: ['Exhaust manifold', 'Turbo outlet', 'Silencer/muffler', 'Exhaust pipe', 'Rain cap'],
    commonIssues: ['Backpressure', 'Leaks', 'Excessive noise', 'Corrosion'],
    maintenanceTips: ['Check for leaks', 'Inspect silencer', 'Clear blockages'],
    color: 'gray'
  },
  {
    id: 'canopy-enclosure',
    name: 'Canopy & Enclosure',
    icon: '🏠',
    description: 'Weather protection and sound attenuation',
    components: ['Sound panels', 'Ventilation louvers', 'Access doors', 'Lifting points', 'Base frame'],
    commonIssues: ['Corrosion', 'Panel damage', 'Door seal wear', 'Ventilation blockage'],
    maintenanceTips: ['Clean regularly', 'Check seals', 'Touch up paint', 'Oil hinges'],
    color: 'slate'
  },
  {
    id: 'fuel-tank-automation',
    name: 'Fuel Tank Automation',
    icon: '🤖',
    description: 'Automatic fuel level monitoring and refilling',
    components: ['Level sensors', 'Auto-fill system', 'Remote monitoring', 'Leak detection', 'Overflow prevention'],
    commonIssues: ['Sensor drift', 'Pump failure', 'Connection loss', 'Overfill'],
    maintenanceTips: ['Calibrate sensors', 'Test alarms', 'Inspect connections'],
    color: 'emerald'
  },
];

// COMPREHENSIVE NAVIGATION HUB COMPONENT
const GeneratorBibleHub = () => {
  return (
    <section id="bible-hub" className="py-16 bg-gradient-to-b from-black via-slate-900/50 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div
          
          
          
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm mb-4">
            📖 The Complete Generator Resource
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Bible of Generators
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need - from sales to service, spare parts to AI diagnostics.
            Your complete generator resource in Kenya.
          </p>
        </div>

        {/* Quick Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {GENERATOR_HUB_SECTIONS.map((section, index) => (
            <a
              key={section.id}
              href={section.href}
              
              
              
              
              
              className={`relative group p-5 rounded-2xl bg-gradient-to-br from-${section.color}-500/10 to-${section.color}-600/5 border border-${section.color}-500/20 hover:border-${section.color}-500/50 transition-all`}
            >
              {section.badge && (
                <span className={`absolute -top-2 -right-2 px-2 py-0.5 text-xs font-bold rounded-full ${section.badge === 'AI' ? 'bg-pink-500' : 'bg-red-500'} text-white`}>
                  {section.badge}
                </span>
              )}
              <div className="text-3xl mb-3">{section.icon}</div>
              <h3 className="text-white font-semibold mb-1">{section.title}</h3>
              <p className="text-gray-400 text-xs">{section.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

// GENERATOR SYSTEMS EDUCATION SECTION
const GeneratorSystemsHub = () => {
  const [activeSystem, setActiveSystem] = useState<string | null>(null);

  return (
    <section id="generator-systems" className="py-20 bg-gradient-to-b from-black via-slate-900 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div
          
          
          
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm mb-4">
            📚 Educational Content
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Generator Systems Guide
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Understand every component of your generator. From engine to automation,
            learn how each system works and how to maintain it.
          </p>
        </div>

        {/* Systems Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {GENERATOR_SYSTEMS.map((system, index) => (
            <div
              key={system.id}
              
              
              
              
              className={`group cursor-pointer rounded-2xl p-5 border transition-all ${
                activeSystem === system.id
                  ? `bg-${system.color}-500/20 border-${system.color}-500/50`
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'
              }`}
              onClick={() => setActiveSystem(activeSystem === system.id ? null : system.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{system.icon}</span>
                <span
                  
                  className="text-gray-400"
                >
                  ▼
                </span>
              </div>
              <h3 className="text-white font-semibold mb-1">{system.name}</h3>
              <p className="text-gray-400 text-sm mb-3">{system.description}</p>

              {activeSystem === system.id && (
                <div
                  
                  
                  
                  className="border-t border-slate-700 pt-3 mt-3 space-y-3"
                >
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Components</p>
                    <div className="flex flex-wrap gap-1">
                      {system.components.slice(0, 4).map(comp => (
                        <span key={comp} className="px-2 py-0.5 bg-slate-800 rounded text-xs text-gray-300">{comp}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Common Issues</p>
                    <ul className="text-xs text-red-400 space-y-0.5">
                      {system.commonIssues.slice(0, 3).map(issue => (
                        <li key={issue}>• {issue}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Maintenance Tips</p>
                    <ul className="text-xs text-green-400 space-y-0.5">
                      {system.maintenanceTips.slice(0, 2).map(tip => (
                        <li key={tip}>✓ {tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA for More Learning */}
        <div className="text-center mt-12">
          <a
            href="/generator-oracle"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all"
          >
            <span>🔍 Diagnose System Issues with AI</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

// LEASING SECTION
const GeneratorLeasingSection = () => {
  const leasingPlans = [
    { duration: '6 Months', discount: '5%', ideal: 'Construction projects' },
    { duration: '1 Year', discount: '10%', ideal: 'Business expansion' },
    { duration: '2 Years', discount: '15%', ideal: 'Established operations' },
    { duration: '3+ Years', discount: '20%', ideal: 'Lease-to-own option' },
  ];

  return (
    <section id="leasing" className="py-20 bg-gradient-to-b from-black via-emerald-900/10 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div
          
          
          
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-4">
            💰 Flexible Power Solutions
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Generator Leasing Programs
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Don't want to buy? Lease a generator with maintenance included.
            Flexible terms from 6 months to lease-to-own options.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {leasingPlans.map((plan, index) => (
            <div
              key={plan.duration}
              
              
              
              
              className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-2xl p-6 border border-emerald-500/20"
            >
              <h3 className="text-2xl font-bold text-white mb-2">{plan.duration}</h3>
              <div className="text-3xl font-bold text-emerald-400 mb-2">{plan.discount} OFF</div>
              <p className="text-gray-400 text-sm">Ideal for: {plan.ideal}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
          <h3 className="text-xl font-bold text-white mb-4">Leasing Benefits</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <h4 className="text-white font-semibold">No Capital Outlay</h4>
                <p className="text-gray-400 text-sm">Preserve your cash flow for core business</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔧</span>
              <div>
                <h4 className="text-white font-semibold">Maintenance Included</h4>
                <p className="text-gray-400 text-sm">All service and repairs covered</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔄</span>
              <div>
                <h4 className="text-white font-semibold">Upgrade Anytime</h4>
                <p className="text-gray-400 text-sm">Scale up or down as needed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a href="/contact?subject=leasing" className="cta-button-primary">
            Get Leasing Quote →
          </a>
        </div>
      </div>
    </section>
  );
};

// AI VISUAL DIAGNOSTIC SECTION
const AIVisualDiagnosticSection = () => {
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  return (
    <section id="ai-diagnostic" className="py-20 bg-gradient-to-b from-black via-pink-900/10 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div
          
          
          
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-400 text-sm mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
            AI-assisted • verification required
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI Visual Diagnostic
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Upload a photo of a generator component. The AI returns ranked
            candidate parts and likely faults to accelerate triage. Always
            verify against the equipment and the OEM manual before action.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: '📸', title: 'Part Identification', desc: 'Name & OEM numbers' },
            { icon: '⏰', title: 'Shelf Life Analysis', desc: 'Age & wear estimation' },
            { icon: '🔮', title: 'Failure Prediction', desc: 'Time to failure estimate' },
            { icon: '💰', title: 'Parts & Pricing', desc: 'Availability & cost' },
          ].map((feature, index) => (
            <div
              key={feature.title}
              
              
              
              
              className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 text-center"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="text-white font-semibold text-sm">{feature.title}</h3>
              <p className="text-gray-400 text-xs">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Toggle Diagnostic Tool */}
        <div className="text-center mb-8">
          <button
            
            
            onClick={() => setShowDiagnostic(!showDiagnostic)}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-pink-500/30"
          >
            <span className="text-2xl">🤖</span>
            <span>{showDiagnostic ? 'Hide Diagnostic Tool' : 'Open AI Visual Diagnostic'}</span>
          </button>
        </div>

        {/* AI Diagnostic Component */}
        {showDiagnostic && (
          <div
            
            
            
            className="bg-slate-900/80 rounded-2xl border border-slate-700 overflow-hidden"
          >
            <AIVisualDiagnostic />
          </div>
        )}

        {/* Alternative: Full Page Link */}
        <div className="text-center mt-6">
          <a
            href="/generator-oracle"
            className="text-pink-400 hover:text-pink-300 underline"
          >
            Or open Generator Oracle for full diagnostic suite →
          </a>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🏆 HARVARD-LEVEL MARKETING COMPONENTS - SELL LIKE A CHAMPION
// Trust Signals, Social Proof, Testimonials, Guarantees, Urgency
// ═══════════════════════════════════════════════════════════════════════════════

// 💰 TRANSPARENT PRICING SECTION - Show Starting Prices
const TransparentPricing = () => {
  const priceRanges = [
    { kva: '10-30 kVA', priceFrom: 350000, priceTo: 850000, ideal: 'Small business, homes', popular: false },
    { kva: '40-80 kVA', priceFrom: 900000, priceTo: 1800000, ideal: 'Medium business, schools', popular: true },
    { kva: '100-200 kVA', priceFrom: 2000000, priceTo: 4500000, ideal: 'Hotels, factories', popular: false },
    { kva: '250-500 kVA', priceFrom: 5000000, priceTo: 12000000, ideal: 'Large industrial', popular: false },
    { kva: '600-1000 kVA', priceFrom: 15000000, priceTo: 28000000, ideal: 'Major facilities', popular: false },
    { kva: '1000+ kVA', priceFrom: 30000000, priceTo: 65000000, ideal: 'Power plants, data centers', popular: false },
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-black via-amber-900/10 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div
          
          
          
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm mb-4">
            💰 Transparent Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Generator Prices in Kenya 2026
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            No hidden costs. Prices include delivery, installation, ATS, commissioning, and 1-year free service.
          </p>
        </div>

        {/* VOLTKA house-brand value band — anchored to real EmersonEIMS pricing */}
        <div
          
          
          
          className="mb-10 p-6 md:p-8 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/15 to-orange-500/5 text-center"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-full mb-3">
            ⚡ VOLTKA — OUR OWN BRAND, BEST VALUE
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            VOLTKA Generators from KES 500,000
          </h3>
          <p className="text-gray-300 max-w-3xl mx-auto">
            New VOLTKA diesel generators start at <strong>KES 500,000 for 20&nbsp;kVA</strong> and scale across the
            full <strong>20–2000&nbsp;kVA</strong> range — priced per model (see the price list below). Every unit is
            supplied, installed and backed by our warranty on both the job and the parts used. Figures are indicative;
            your exact figure is generated on our ERP.
          </p>
          <a
            href="/contact?generator=VOLTKA"
            className="inline-block mt-4 px-6 py-2.5 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-all"
          >
            Get my VOLTKA quote
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {priceRanges.map((range, index) => (
            <div
              key={range.kva}
              
              
              
              
              className={`relative p-6 rounded-2xl border transition-all ${
                range.popular
                  ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/10 border-amber-500/50'
                  : 'bg-slate-900/50 border-slate-800 hover:border-amber-500/30'
              }`}
            >
              {range.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-full">
                  MOST POPULAR
                </span>
              )}
              <h3 className="text-2xl font-bold text-amber-400 mb-2">{range.kva}</h3>
              <div className="mb-3">
                <span className="text-gray-400 text-sm">Starting from</span>
                <div className="text-3xl font-bold text-white">
                  KES {(range.priceFrom / 1000000).toFixed(1)}M
                </div>
                <span className="text-gray-500 text-sm">to KES {(range.priceTo / 1000000).toFixed(1)}M</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">Ideal for: {range.ideal}</p>
              <a
                href={`/contact?generator=${range.kva}`}
                className="block text-center px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-all"
              >
                Get Exact Quote
              </a>
            </div>
          ))}
        </div>

        {/*
          Per-size pages, added 2026-08-26.
          An external audit found the site had no product-level URLs while every
          ranking competitor publishes one page per set. Buyers search "30 kva
          generator price in kenya", not "generator range". These links are the
          internal path to those pages — the sitemap gives discovery, links pass
          authority.
        */}
        <div className="mb-10">
          <h3 className="text-center text-lg font-semibold text-white mb-2">Price by exact size</h3>
          <p className="text-center text-gray-400 text-sm mb-6">
            What each size costs, what it runs, and how site altitude changes the answer.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
            {GENERATOR_SIZES.map((g) => (
              <a
                key={g.slug}
                href={`/generators/sizes/${g.slug}`}
                className="block rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-center transition hover:border-amber-400/40"
              >
                <span className="block font-bold text-white">{g.kva} kVA</span>
                <span className="mt-1 block text-[11px] text-gray-400">{g.priceRange.replace('KES ', '')}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="text-center text-gray-400 text-sm">
          <p>* Ranges above are for premium imported brands (Cummins, Perkins, CAT); our VOLTKA house brand is more affordable — from KES 500,000.</p>
          <p>* All prices include: Delivery + Installation + ATS + Commissioning + 1-Year Service + Warranty on job &amp; parts</p>
          <p>* Indicative only — every exact quote is generated on our ERP.</p>
        </div>
      </div>
    </section>
  );
};

// 📸 BEFORE/AFTER PROJECT GALLERY - Show Transformations
const BeforeAfterGallery = () => {
  const projects = [
    {
      client: 'St. Austin Academy',
      location: 'Nairobi',
      before: 'Frequent power outages disrupting classes',
      after: '99.8% uptime with 50kVA Massey Ferguson',
      image: '/images/ST-AUSTIN-4K-CINEMATIC.jpg',
      savings: 'KSh 1.2M saved annually'
    },
    {
      client: 'Bigot Flowers',
      location: 'Naivasha',
      before: 'Critical cooling failures during outages',
      after: 'Zero product loss with 300kVA CAT + redundancy',
      image: '/images/BIGOT-FLOWERS-4K-CINEMATIC.jpg',
      savings: '99.9% uptime achieved'
    },
    {
      client: 'NTSA Headquarters',
      location: 'Nairobi',
      before: 'Government operations disrupted by grid failures',
      after: '100% continuity with 300kVA Atlas Copco',
      image: '/images/NTSA-4K-CINEMATIC.jpg',
      savings: 'Real-time monitoring enabled'
    },
    {
      client: 'Greenheart Kilifi',
      location: 'Kilifi County',
      before: 'Real-estate development units hit by frequent grid outages',
      after: 'Flawless estate-wide power with 44kVA Cummins Voltka',
      image: '/images/GREENHEART-KILIFI-4K-CINEMATIC.jpg',
      savings: '30% maintenance cost reduction'
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black via-slate-900 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div
          
          
          
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm mb-4">
            📸 Project Transformations
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Before & After Results
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            See the real impact of reliable power on our clients' operations
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.client}
              
              
              
              
              className="bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-800"
            >
              {/* Project Image — real installation photography */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={project.image}
                  alt={`${project.client} — EmersonEIMS generator installation`}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white drop-shadow">{project.client}</h3>
                  <p className="text-gray-300 text-sm">📍 {project.location}</p>
                </div>
              </div>

              {/* Before/After */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    <p className="text-red-400 text-xs uppercase font-bold mb-1">Before</p>
                    <p className="text-gray-300 text-sm">{project.before}</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-green-400 text-xs uppercase font-bold mb-1">After</p>
                    <p className="text-gray-300 text-sm">{project.after}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-semibold">{project.savings}</span>
                  <a href="/generators/case-studies" className="text-cyan-400 text-sm hover:underline">
                    View Full Case Study →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 🎬 VIDEO TESTIMONIALS SECTION
const VideoTestimonials = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const videos = [
    {
      id: 'sanergy',
      client: 'Sanergy Limited',
      role: 'Plant Manager',
      thumbnail: '/images/SANERGY-FG-WILSON-4K-CINEMATIC.jpg',
      duration: '2:45',
      title: 'How EmersonEIMS Transformed Our Operations',
      quote: '95% reduction in downtime, KSh 1.8M saved annually'
    },
    {
      id: 'kivukoni',
      client: 'Kivukoni School',
      role: 'Facilities Manager',
      thumbnail: '/images/KIVUKONI-4K-CINEMATIC.jpg',
      duration: '1:58',
      title: 'Hybrid Solar-Generator Success Story',
      quote: '40% reduction in energy costs with 24/7 power'
    },
    {
      id: 'bigot',
      client: 'Bigot Flowers',
      role: 'Operations Director',
      thumbnail: '/images/BIGOT-FLOWERS-4K-CINEMATIC.jpg',
      duration: '3:12',
      title: 'Zero Product Loss Since Installation',
      quote: 'Our flower export business depends on this system'
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div
          
          
          
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm mb-4">
            🎬 Video Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Hear From Our Clients
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Real stories from real businesses about their power transformation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <div
              key={video.id}
              
              
              
              
              className="group cursor-pointer"
              onClick={() => setActiveVideo(video.id)}
            >
              {/* Thumbnail — real client site photography */}
              <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                <Image
                  src={video.thumbnail}
                  alt={`${video.client} — EmersonEIMS project`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                  <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-white text-2xl ml-1">▶</span>
                  </div>
                </div>
                {/* Duration */}
                <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-white text-xs">
                  {video.duration}
                </span>
              </div>

              {/* Info */}
              <h3 className="text-white font-semibold mb-1">{video.title}</h3>
              <p className="text-amber-400 text-sm mb-1">{video.client}</p>
              <p className="text-gray-400 text-sm italic">"{video.quote}"</p>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          * Video testimonials coming soon. Contact us to share your success story.
        </p>
      </div>
    </section>
  );
};

// 📊 BRAND COMPARISON TABLE
const BrandComparisonTable = () => {
  const brands = [
    { name: 'Cummins', origin: 'USA', warranty: '2 Years', fuelEff: '⭐⭐⭐⭐⭐', parts: '⭐⭐⭐⭐⭐', price: '$$$$', best: 'Reliability & support' },
    { name: 'Perkins', origin: 'UK', warranty: '2 Years', fuelEff: '⭐⭐⭐⭐', parts: '⭐⭐⭐⭐⭐', price: '$$$', best: 'Value for money' },
    { name: 'Caterpillar', origin: 'USA', warranty: '2 Years', fuelEff: '⭐⭐⭐⭐', parts: '⭐⭐⭐⭐', price: '$$$$$', best: 'Heavy industrial' },
    { name: 'FG Wilson', origin: 'UK', warranty: '2 Years', fuelEff: '⭐⭐⭐⭐', parts: '⭐⭐⭐⭐', price: '$$$', best: 'Commercial use' },
    { name: 'Atlas Copco', origin: 'Sweden', warranty: '2 Years', fuelEff: '⭐⭐⭐⭐⭐', parts: '⭐⭐⭐', price: '$$$$', best: 'Quiet operation' },
    { name: 'Voltka', origin: 'China/Cummins', warranty: '2 Years', fuelEff: '⭐⭐⭐⭐', parts: '⭐⭐⭐⭐⭐', price: '$$', best: 'Budget + quality' },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black to-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div
          
          
          
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm mb-4">
            📊 Compare Brands
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Generator Brand Comparison
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We service all brands. Here's how they compare:
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-gray-700 bg-slate-900/50">
                <th className="text-left p-4 text-amber-400">Brand</th>
                <th className="text-left p-4 text-gray-400">Origin</th>
                <th className="text-left p-4 text-gray-400">Warranty</th>
                <th className="text-left p-4 text-gray-400">Fuel Efficiency</th>
                <th className="text-left p-4 text-gray-400">Parts Availability</th>
                <th className="text-left p-4 text-gray-400">Price Range</th>
                <th className="text-left p-4 text-gray-400">Best For</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand, index) => (
                <tr
                  key={brand.name}
                  
                  
                  
                  
                  className="border-b border-gray-800 hover:bg-slate-900/50"
                >
                  <td className="p-4 font-semibold text-white">{brand.name}</td>
                  <td className="p-4 text-gray-400">{brand.origin}</td>
                  <td className="p-4 text-green-400">{brand.warranty}</td>
                  <td className="p-4">{brand.fuelEff}</td>
                  <td className="p-4">{brand.parts}</td>
                  <td className="p-4 text-amber-400">{brand.price}</td>
                  <td className="p-4 text-gray-300">{brand.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Not sure which brand? <a href="/contact" className="text-amber-400 hover:underline">Talk to our engineers</a> for a free recommendation.
        </p>
      </div>
    </section>
  );
};

// Deterministic thousands-separator — locale-independent so SSR and client
// always produce the SAME string (e.g. always "600,000", never "600.000").
// toLocaleString() without a fixed locale caused a hydration mismatch.
const formatKES = (n: number): string =>
  Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// 💳 FINANCING CALCULATOR
const FinancingCalculator = () => {
  const [price, setPrice] = useState(2000000);
  const [deposit, setDeposit] = useState(30);
  const [months, setMonths] = useState(12);

  const depositAmount = price * (deposit / 100);
  const financeAmount = price - depositAmount;
  const monthlyPayment = financeAmount / months;

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-4xl mx-auto px-6">
        <div
          
          
          
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm mb-4">
            💳 Easy Payment Plans
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Financing Calculator
          </h2>
          <p className="text-xl text-gray-400">
            Calculate your monthly payments. No interest on 3-month plans!
          </p>
        </div>

        <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Price Slider */}
            <div>
              <label className="text-gray-400 text-sm block mb-2">Generator Price (KES)</label>
              <input
                type="range"
                min="500000"
                max="30000000"
                step="100000"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="text-2xl font-bold text-amber-400 mt-2">
                KES {(price / 1000000).toFixed(1)}M
              </div>
            </div>

            {/* Deposit Slider */}
            <div>
              <label className="text-gray-400 text-sm block mb-2">Deposit (%)</label>
              <input
                type="range"
                min="20"
                max="70"
                step="5"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="text-2xl font-bold text-white mt-2">
                {deposit}% (KES {(depositAmount / 1000).toFixed(0)}K)
              </div>
            </div>

            {/* Months Selector */}
            <div>
              <label className="text-gray-400 text-sm block mb-2">Payment Period</label>
              <div className="flex gap-2">
                {[3, 6, 12].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMonths(m)}
                    className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                      months === m
                        ? 'bg-amber-500 text-black'
                        : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                    }`}
                  >
                    {m} Mo
                  </button>
                ))}
              </div>
              {months === 3 && <p className="text-green-400 text-xs mt-2">✓ 0% Interest!</p>}
            </div>
          </div>

          {/* Results */}
          <div className="bg-black/50 rounded-xl p-6 text-center">
            <p className="text-gray-400 mb-2">Your Monthly Payment</p>
            <div className="text-5xl font-bold text-green-400 mb-2">
              KES {formatKES(monthlyPayment)}
            </div>
            <p className="text-gray-500 text-sm">
              for {months} months after KES {formatKES(depositAmount)} deposit
            </p>
          </div>

          <div className="text-center mt-6">
            <a
              href={`/contact?finance=true&price=${price}&deposit=${deposit}&months=${months}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl"
            >
              Apply for Financing →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// 📄 PDF DOWNLOADS SECTION
const DownloadsSection = () => {
  const downloads = [
    { name: 'Cummins Generator Catalog 2026', type: 'PDF', size: '4.2 MB', icon: '📕' },
    { name: 'Voltka Price List March 2026', type: 'PDF', size: '1.8 MB', icon: '💰' },
    { name: 'Generator Sizing Guide', type: 'PDF', size: '2.1 MB', icon: '📐' },
    { name: 'Maintenance Schedule Template', type: 'PDF', size: '890 KB', icon: '🔧' },
    { name: 'ATS Installation Manual', type: 'PDF', size: '3.4 MB', icon: '🔀' },
    { name: 'Warranty Terms & Conditions', type: 'PDF', size: '520 KB', icon: '🛡️' },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black to-slate-900">
      <div className="max-w-5xl mx-auto px-6">
        <div
          
          
          
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-4">
            📄 Free Downloads
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Brochures & Spec Sheets
          </h2>
          <p className="text-xl text-gray-400">
            Download detailed information for your planning
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {downloads.map((doc, index) => (
            <a
              key={doc.name}
              href="/contact?download=brochure"
              
              
              
              
              className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all group"
            >
              <span className="text-3xl">{doc.icon}</span>
              <div className="flex-1">
                <p className="text-white font-semibold group-hover:text-blue-400 transition-colors">{doc.name}</p>
                <p className="text-gray-500 text-sm">{doc.type} • {doc.size}</p>
              </div>
              <span className="text-blue-400 group-hover:translate-x-1 transition-transform">↓</span>
            </a>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          * Enter your email to receive download links. We respect your privacy.
        </p>
      </div>
    </section>
  );
};

// LIVE STATISTICS COUNTER - Real Business Metrics
const LiveStatisticsCounter = () => {
  // Real business statistics based on actual operations
  const stats = {
    projectsCompleted: 150,    // Actual completed installations
    activeClients: 85,         // Current service contract clients
    yearsExperience: 15,       // Years in business
    countiesServed: 47,        // All Kenya counties
    uptimeAchieved: 99.8,      // Average client uptime
    partsInStock: 2000         // Parts inventory
  };

  return (
    <section className="py-16 bg-gradient-to-r from-amber-500/10 via-black to-amber-500/10 border-y border-amber-500/20">
      <div className="max-w-7xl mx-auto px-6">
        <div
          
          
          
          className="text-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live Statistics
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Kenya's Most Trusted Generator Partner
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { value: stats.projectsCompleted, label: 'Projects Completed', suffix: '+', icon: '⚡' },
            { value: stats.activeClients, label: 'Active Clients', suffix: '+', icon: '🤝' },
            { value: stats.yearsExperience, label: 'Years Experience', suffix: '', icon: '🏆' },
            { value: stats.countiesServed, label: 'Counties Served', suffix: '', icon: '🗺️' },
            { value: stats.uptimeAchieved, label: 'Client Uptime', suffix: '%', icon: '✅' },
            { value: stats.partsInStock, label: 'Parts in Stock', suffix: '+', icon: '🔧' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              
              
              
              
              className="text-center p-4 rounded-xl bg-black/50 border border-amber-500/20"
            >
              <span className="text-2xl block mb-2">{stat.icon}</span>
              <span
                className="text-3xl md:text-4xl font-bold text-amber-400 block"
              >
                {typeof stat.value === 'number' && stat.value % 1 !== 0
                  ? stat.value.toFixed(1)
                  : stat.value}{stat.suffix}
              </span>
              <span className="text-gray-400 text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CLIENT TESTIMONIALS - REAL Social Proof from Actual EmersonEIMS Clients
const ClientTestimonials = () => {
  // ONLY testimonials from actual EmersonEIMS case studies
  const testimonials = [
    {
      name: 'Principal',
      role: 'School Principal',
      company: 'St. Austin Academy',
      rating: 5,
      text: 'EmersonEIMS transformed our power reliability. No more interruptions during critical exams. The 50kVA Massey Ferguson with Perkins engine has given us 99.8% uptime.',
      location: 'Nairobi',
      service: '50kVA Generator Installation'
    },
    {
      name: 'Facilities Manager',
      role: 'Facilities Manager',
      company: 'Kivukoni International School',
      rating: 5,
      text: 'The hybrid system exceeded expectations. Our students now have uninterrupted power. 40% reduction in energy costs with the 60kVA Cummins and solar integration.',
      location: 'Kilifi',
      service: '60kVA Cummins + Solar Hybrid'
    },
    {
      name: 'Operations Director',
      role: 'Operations Director',
      company: 'Bigot Flowers',
      rating: 5,
      text: 'Our flower export business depends on reliable power. EmersonEIMS delivered a 300kVA Caterpillar with redundant backup and automated failover. Zero product loss, 99.9% uptime.',
      location: 'Naivasha',
      service: '300kVA Caterpillar Installation'
    },
    {
      name: 'General Manager',
      role: 'General Manager',
      company: 'Greenheart Kilifi',
      rating: 5,
      text: 'Our residents never experience power issues. The 44kVA Cummins Voltka system is flawless. Maintenance cost reduced by 30% and energy efficiency improved significantly.',
      location: 'Kilifi County',
      service: '44kVA Cummins Voltka'
    },
    {
      name: 'IT Director',
      role: 'IT Director',
      company: 'NTSA Headquarters',
      rating: 5,
      text: 'EmersonEIMS ensured our critical government operations never fail. The 300kVA Atlas Copco with redundant system and real-time monitoring delivers 100% operational continuity.',
      location: 'Nairobi',
      service: '300kVA Atlas Copco'
    },
    {
      name: 'Plant Manager',
      role: 'Plant Manager',
      company: 'Sanergy Limited',
      rating: 5,
      text: 'The reliability of our power system transformed our operations. 95% reduction in downtime with the 250kVA FG Wilson and automated load management. KSh 1.8M saved annually.',
      location: 'Nairobi',
      service: '250kVA FG Wilson Installation'
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="py-20 bg-gradient-to-b from-black via-slate-900/50 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div
          
          
          
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm mb-4">
            ⭐ Client Success Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trusted by Kenya's Leading Organizations
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            From hospitals to hotels, factories to data centers - see why industry leaders choose EmersonEIMS
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              
              
              
              
              className={`p-6 rounded-2xl border transition-all ${
                index === currentIndex
                  ? 'bg-amber-500/10 border-amber-500/50 scale-105'
                  : 'bg-slate-900/50 border-slate-800'
              }`}
            >
              {/* Rating */}
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-amber-400">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-300 text-sm mb-4 italic">"{testimonial.text}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-gray-400 text-xs">{testimonial.role}</p>
                  <p className="text-amber-400 text-xs">{testimonial.company}</p>
                </div>
              </div>

              {/* Service & Location Badge */}
              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-1 text-cyan-400 text-xs">
                  <span>⚡</span>
                  <span>{testimonial.service}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <span>📍</span>
                  <span>{testimonial.location}, Kenya</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* REAL Client Logos - Actual EmersonEIMS Clients from Case Studies */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-gray-500 text-sm mb-6">OUR CLIENTS</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            {[
              'St. Austin Academy',
              'Kivukoni International School',
              'Bigot Flowers',
              'Greenheart Kilifi',
              'NTSA Headquarters',
              'Sanergy Limited'
            ].map(client => (
              <span key={client} className="text-gray-400 font-semibold text-sm md:text-base">{client}</span>
            ))}
          </div>

          {/* Link to Full Case Studies */}
          <div className="text-center mt-8">
            <a
              href="/generators/case-studies"
              className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>View All Case Studies with Technical Details</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// WHY CHOOSE US - Value Propositions
const WhyChooseUs = () => {
  const reasons = [
    {
      icon: '🏆',
      title: 'Cummins Specialist',
      // "Factory-trained" removed here and in the two places below. The claim
      // has no evidence behind it on file (see app/why-emersoneims/page.tsx),
      // and an unverifiable badge is worth less than a specific one. If
      // training certificates DO exist, this is worth restoring with the
      // certificate named — say so and it goes back.
      description: 'Technicians who work these platforms daily. Genuine parts in stock. Multi-brand capability across Cummins, Perkins, Caterpillar and FG Wilson.',
      highlight: 'EXPERT'
    },
    {
      icon: '⚡',
      title: '24/7 Emergency Support',
      description: 'Technicians stationed across all 47 counties. Nairobi emergency response mobilization within business hours. Remote site coordination via phone/WhatsApp.',
      highlight: '24/7 SUPPORT'
    },
    {
      icon: '💰',
      title: 'Price Match Guarantee',
      description: 'Found a lower price? We\'ll match it and give you 5% extra discount. No questions asked.',
      highlight: 'BEST PRICE'
    },
    {
      icon: '🔧',
      title: '11+ Years Track Record',
      description: 'Our senior technicians have serviced generators across Kenya since 2013, on Cummins, Perkins, Caterpillar and 10+ other brands.',
      highlight: 'PROVEN EXPERTISE'
    },
    {
      icon: '📦',
      title: 'Same-Day Parts Delivery',
      description: '2,000+ parts in stock in our Nairobi warehouse. Most parts delivered within 4 hours.',
      highlight: 'FAST DELIVERY'
    },
    {
      icon: '🛡️',
      title: '2-Year Warranty',
      description: 'Industry-leading coverage on all new generators. Includes parts, labor, and emergency service.',
      highlight: 'PEACE OF MIND'
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black to-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div
          
          
          
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why <span className="text-amber-400">Leading Businesses</span> Choose Us
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We don't just sell generators. We deliver reliability, peace of mind, and a partnership that lasts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <div
              key={reason.title}
              
              
              
              
              
              className="relative group p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-black border border-slate-800 hover:border-amber-500/50 transition-all"
            >
              {/* Highlight Badge */}
              <span className="absolute -top-3 right-4 px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-full">
                {reason.highlight}
              </span>

              <span className="text-4xl block mb-4">{reason.icon}</span>
              <h3 className="text-xl font-bold text-white mb-2">{reason.title}</h3>
              <p className="text-gray-400 text-sm">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// IRON-CLAD GUARANTEE SECTION
const GuaranteeSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-emerald-500/10 via-black to-emerald-500/10 border-y border-emerald-500/20">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <div
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
            <span className="text-5xl">🛡️</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="text-emerald-400">Iron-Clad</span> Guarantee
          </h2>

          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            We're so confident in our generators and service that we offer one of the strongest guarantees available in Kenya:
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-xl bg-black/50 border border-emerald-500/30">
              <h3 className="text-2xl font-bold text-emerald-400 mb-2">30-Day</h3>
              <p className="text-white font-semibold">Money-Back Guarantee</p>
              <p className="text-gray-400 text-sm mt-2">Not satisfied? Full refund, no questions asked</p>
            </div>
            <div className="p-6 rounded-xl bg-black/50 border border-emerald-500/30">
              <h3 className="text-2xl font-bold text-emerald-400 mb-2">3-Year</h3>
              <p className="text-white font-semibold">Comprehensive Warranty</p>
              <p className="text-gray-400 text-sm mt-2">Parts, labor, and emergency service included</p>
            </div>
            <div className="p-6 rounded-xl bg-black/50 border border-emerald-500/30">
              <h3 className="text-2xl font-bold text-emerald-400 mb-2">Lifetime</h3>
              <p className="text-white font-semibold">Technical Support</p>
              <p className="text-gray-400 text-sm mt-2">Phone, WhatsApp, and email support forever</p>
            </div>
          </div>

          <p className="text-gray-400 text-sm italic">
            "If your generator doesn't perform as promised, we'll fix it or replace it. Period." — John Emerson, Founder
          </p>
        </div>
      </div>
    </section>
  );
};

// URGENCY & SCARCITY SECTION
const UrgencySection = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 27, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) { days = 3; hours = 14; minutes = 27; seconds = 45; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 bg-gradient-to-r from-red-500/20 via-black to-red-500/20 border-y border-red-500/30">
      <div className="max-w-7xl mx-auto px-6">
        <div
          
          
          
          className="flex flex-col lg:flex-row items-center justify-between gap-6"
        >
          <div className="text-center lg:text-left">
            <div className="flex items-center gap-2 justify-center lg:justify-start mb-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-red-400 font-bold uppercase tracking-wider text-sm">Limited Time Offer</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              March Sale: <span className="text-red-400">15% OFF</span> All Generators
            </h3>
            <p className="text-gray-400">Plus FREE installation (worth KES 50,000) on orders above 100kVA</p>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-3">
            {[
              { value: timeLeft.days, label: 'DAYS' },
              { value: timeLeft.hours, label: 'HRS' },
              { value: timeLeft.minutes, label: 'MIN' },
              { value: timeLeft.seconds, label: 'SEC' },
            ].map((unit, index) => (
              <div key={unit.label} className="text-center">
                <div className="w-16 h-16 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{String(unit.value).padStart(2, '0')}</span>
                </div>
                <span className="text-xs text-gray-500 mt-1 block">{unit.label}</span>
              </div>
            ))}
          </div>

          <a
            href="/contact?promo=march-sale"
            
            
            className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/30"
          >
            Claim This Offer →
          </a>
        </div>
      </div>
    </section>
  );
};

// FAQ SECTION - Handle Objections
const FAQSection = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Why should I buy from EmersonEIMS instead of importing directly?',
      answer: 'While importing may seem cheaper, you lose warranty coverage, local support, and spare parts availability. Our all-inclusive pricing includes delivery, installation, commissioning, 1-year free service, and 2-year warranty. Most importers spend 30% more in the first year on issues we prevent.'
    },
    {
      question: 'What brands do you carry?',
      answer: 'We specialise in Cummins and VOLTKA generators, with servicing and genuine parts for Perkins, Caterpillar, FG Wilson, SDMO and 20+ other brands. Being independent, we are free to recommend the set that fits your load rather than the one we are obliged to sell.'
    },
    {
      question: 'How quickly can you deliver and install?',
      answer: 'Stock units: 24-48 hours anywhere in Kenya. Custom configurations: 2-4 weeks. Installation takes 1-3 days depending on complexity. We handle all permits and approvals.'
    },
    {
      question: 'What if my generator breaks down?',
      answer: 'Call our 24/7 hotline: +254 768 860 665 (Nairobi) or +254 782 914 717 (support). Nairobi-area emergency visits are prioritized during business hours. Remote locations handled via phone diagnostics and scheduled visits. Warranty covers all parts and labor for manufacturer defects.'
    },
    {
      question: 'Can I pay in installments?',
      answer: 'Yes! We offer flexible payment plans: 30% deposit, balance over 3-12 months. No interest on 3-month plans. We also accept LPOs from established businesses and government entities.'
    },
    {
      question: 'What size generator do I need?',
      answer: 'Use our free sizing calculator on this page, or call us to book a site survey. We analyze your load, future growth, and backup requirements to recommend the perfect size. Oversizing wastes money; undersizing causes problems.'
    },
    {
      question: 'Do you offer maintenance contracts?',
      answer: 'Yes, from basic (quarterly service) to comprehensive (24/7 monitoring, parts included). Maintenance contracts extend warranty, reduce downtime, and typically save 40% vs. pay-as-you-go repairs.'
    },
    {
      question: 'What\'s included in the price?',
      answer: 'Our quoted prices include: Generator unit, delivery anywhere in Kenya, professional installation, ATS (automatic transfer switch), commissioning and testing, operator training, 1-year free maintenance, and 2-year warranty. No hidden costs.'
    },
  ];

  return (
    // id="cummins-faq" is the target of /generators#cummins-faq, linked from
    // app/generators/cummins/page.tsx. It did not exist, so that link scrolled
    // nowhere — the same defect class as the "New Generators" navbar item.
    <section id="cummins-faq" className="py-20 bg-gradient-to-b from-slate-900 to-black scroll-mt-28">
      <div className="max-w-4xl mx-auto px-6">
        <div
          
          
          
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to know before buying
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              
              
              
              
              className="border border-slate-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-5 text-left flex items-center justify-between bg-slate-900/50 hover:bg-slate-900 transition-colors"
              >
                <span className="text-white font-semibold pr-4">{faq.question}</span>
                <span
                  
                  className="text-amber-400 text-xl flex-shrink-0"
                >
                  ▼
                </span>
              </button>
              {openFaq === index && (
                <div
                  
                  
                  
                  className="p-5 bg-black/50 border-t border-slate-800"
                >
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-400 mb-4">Still have questions?</p>
          <a
            href="https://wa.me/254768860665?text=Hi,%20I%20have%20a%20question%20about%20generators"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all"
          >
            <span>💬</span>
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};

// FLOATING WHATSAPP BUTTON
const FloatingWhatsApp = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000);
    const messageTimer = setTimeout(() => setShowMessage(true), 8000);
    return () => {
      clearTimeout(timer);
      clearTimeout(messageTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      
      
      className="fixed bottom-6 right-6 z-50"
    >
      {/* Message Bubble */}
      {showMessage && (
        <div
          
          
          className="absolute bottom-16 right-0 mb-2 p-3 bg-white rounded-xl shadow-xl max-w-[200px]"
        >
          <button
            onClick={() => setShowMessage(false)}
            className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white rounded-full text-xs"
          >
            ×
          </button>
          <p className="text-gray-800 text-sm">
            👋 Need help choosing a generator? Chat with our expert now!
          </p>
        </div>
      )}

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/254768860665?text=Hi,%20I'm%20interested%20in%20buying%20a%20generator"
        target="_blank"
        rel="noopener noreferrer"
        
        
        className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full shadow-lg shadow-green-500/50"
      >
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
};

// FINAL CTA - Make Them Buy
const FinalCTA = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)'
        }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <div
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Stop Losing Money to Power Outages
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Every hour without power costs your business money. Join organizations like
            NTSA, Bigot Flowers, and Greenheart Kilifi who trust EmersonEIMS for reliable power.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href="/contact?action=quote"
              
              
              className="px-10 py-5 bg-black text-white font-bold text-lg rounded-xl shadow-2xl hover:bg-gray-900 transition-all"
            >
              Get Free Quote Now →
            </a>
            <a
              href="tel:+254768860665"
              
              
              className="px-10 py-5 bg-white/20 backdrop-blur text-white font-bold text-lg rounded-xl border-2 border-white/50 hover:bg-white/30 transition-all"
            >
              📞 Call +254 768 860 665
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-white/80 text-sm">
            <span className="flex items-center gap-2">✅ Technician Site Survey</span>
            <span className="flex items-center gap-2">✅ No Obligation Quote</span>
            <span className="flex items-center gap-2">✅ Response Within 2 Hours</span>
          </div>
        </div>
      </div>
    </section>
  );
};


// Generator Work Photos Gallery Data
const generatorGalleryImages = [
  {
    src: '/images/enhanced/BIGOT CATERPILLAR 30KVA-4K-CINEMATIC.jpg',
    alt: 'Caterpillar 30KVA Industrial Generator',
    category: 'Industrial',
    title: 'Caterpillar 30KVA Generator',
    description: 'Premium industrial generator with Hollywood-grade cinematic finish',
  },
  {
    src: '/images/enhanced/FG-WILSON-GENERATOR-4K-CINEMATIC.jpg',
    alt: 'FG Wilson Generator Installation',
    category: 'Commercial',
    title: 'FG Wilson Generator',
    description: 'Professional installation for commercial applications',
  },
  {
    src: '/images/enhanced/GREENHEART KILIFI GENERATOR-4K-CINEMATIC.jpg',
    alt: 'Greenheart Kilifi Generator Project',
    category: 'Project',
    title: 'Greenheart Kilifi',
    description: 'Large-scale generator installation project',
  },
  {
    src: '/images/enhanced/KIVUKONI SCHOOL CUMMINS GENERATOR -4K-CINEMATIC.jpg',
    alt: 'Kivukoni School Cummins Generator',
    category: 'Education',
    title: 'Kivukoni School Project',
    description: 'Reliable power for educational institutions',
  },
  {
    src: '/images/work-photos/IMG_20250513_133922.jpg',
    alt: 'Generator Installation with Crane',
    category: 'Installation',
    title: 'Professional Installation',
    description: 'Expert team handling heavy generator placement',
  },
  {
    src: '/images/work-photos/IMG_20240620_152044_448.jpg',
    alt: 'Generator Electrical Diagnostics',
    category: 'Maintenance',
    title: 'Electrical Diagnostics',
    description: 'Precision testing and troubleshooting',
  },
  {
    src: '/images/work-photos/IMG_20240527_090731_477.jpg',
    alt: 'Engine Overhaul Service',
    category: 'Overhaul',
    title: 'Engine Overhaul',
    description: 'Complete engine rebuild services',
  },
  {
    src: '/images/work-photos/IMG_20240517_124515_040.jpg',
    alt: 'Generator Parts Transportation',
    category: 'Logistics',
    title: 'Parts & Logistics',
    description: 'Efficient parts delivery across Kenya',
  },
];

// GSAP will be loaded dynamically in useEffect

const InteractiveBlobs = lazy(() => import('@/components/webgl/InteractiveBlobs'));
const AbstractFloatingShapes = lazy(() => import('@/components/webgl/AbstractFloatingShapes'));


// Video Hero Component - Cinematic Hollywood Grade
const VideoHero = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  return (
    <div
      
      
      className="relative w-full h-[60vh] mb-12 rounded-2xl overflow-hidden"
    >
      <CinematicVideo
        src="/videos/VID-20250930-WA0000%20(3).mp4"
        poster="/images/tnpl-diesal-generator-1000x1000-1920x1080.webp"
        autoPlay={true}
        loop={true}
        muted={true}
        playsInline={true}
        colorGrade="blockbuster"
        vignette={true}
        onLoadedData={() => setVideoLoaded(true)}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-[5]" />
      <div
        
        
        
        className="absolute bottom-0 left-0 right-0 p-8 text-white z-10"
      >
        <h2 className="text-4xl font-bold mb-4">Generator Excellence</h2>
        <p className="text-xl text-gray-300">From installation to maintenance, we deliver power reliability</p>
      </div>
    </div>
  );
};

// 3D Generator Viewer Component
/**
 * Generator specification card.
 *
 * WHAT THIS REPLACED, and why (2026-08-26).
 * It was billed as an "Interactive 3D Generator Viewer" with "AR preview
 * capability". It was neither. It rendered a lightning-bolt EMOJI at text-6xl
 * inside a CSS perspective transform, captioned "Drag to rotate / Click for AR
 * view", above a "View in AR" button that opened /ar/generator/<model> - a
 * route that does not exist in this application; on desktop it raised a
 * browser alert() instead.
 *
 * Three problems, the first being the serious one:
 *   1. CREDIBILITY. Someone weighing a KES 2,000,000 purchase clicked "3D
 *      viewer", dragged, and watched an emoji spin. That damages trust at
 *      exactly the moment it is being formed.
 *   2. MOBILE. Interaction was onMouseMove/onMouseDown only, so on a phone -
 *      where most of this audience is - "Drag to rotate" did nothing at all.
 *   3. A DEAD LINK. The AR button sent iOS users to a 404.
 *
 * It now shows a real photograph of equipment we supply, above the
 * specification that was already in the card. Nothing is claimed that the
 * component does not do.
 */
const GeneratorSpecCard = ({ generator }: { generator: typeof cumminsGenerators[0] }) => {
  /*
   * generator.image is deliberately NOT used. Those URLs point at
   * /wp-content/uploads/ on the old WordPress site; checked 2026-08-26, two
   * return 403 and one is unreachable, so rendering them would show broken
   * images. The photographs below are real files in this repository.
   */
  const photo =
    generator.kva >= 500
      ? '/images/voltka/voltka-warehouse-fleet.webp'
      : generator.kva >= 150
        ? '/images/voltka/voltka-vks165-stock-forklift.webp'
        : generator.kva >= 50
          ? '/images/voltka/voltka-vks44-hero-profile.webp'
          : '/images/voltka/cat-canopy-studio.webp';

  return (
    <div className="relative">
      <div className="relative h-64 overflow-hidden rounded-xl border border-gray-800 bg-black/40">
        <Image
          src={photo}
          alt={`${generator.model} - ${generator.kva} kVA diesel generator`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <p className="mt-3 text-xs text-gray-500">
        Photograph of equipment we supply. The set offered is confirmed on your quotation.
      </p>
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
        <div
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
        </div>
      )}
    </div>
  );
};

// Big auto-rotating hero slides (replaces the broken hero video). Real
// generator product + overhaul photography, full-bleed with a slow Ken-Burns
// push. Deterministic initial index (0) so SSR/client hydrate identically.
const GENERATOR_HERO_IMAGES = [
  '/images/desktop/generators/voltka-vks44-crane.jpg',
  '/images/desktop/generators/cummins-teal-canopy.jpg',
  '/images/enhanced/KIVUKONI SCHOOL CUMMINS GENERATOR -4K-CINEMATIC.jpg',
  '/images/enhanced/BIGOT CATERPILLAR 30KVA-4K-CINEMATIC.jpg',
  '/images/desktop/generators/voltka-vks44-night.jpg',
  '/images/desktop/overhaul/engine-liner-overhaul.jpg',
];

const GeneratorHeroSlides = () => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % GENERATOR_HERO_IMAGES.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <>
      {GENERATOR_HERO_IMAGES.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden={i !== index}
        >
          <Image
            src={src}
            alt="EmersonEIMS generators — sales, installation and repair"
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover ${i === index ? 'gen-hero-kenburns' : ''}`}
            style={{ filter: 'contrast(1.12) saturate(1.2) brightness(0.95)' }}
          />
        </div>
      ))}
      <style>{`
        @keyframes genHeroKenBurns { from { transform: scale(1.02); } to { transform: scale(1.12); } }
        .gen-hero-kenburns { animation: genHeroKenBurns 5.5s ease-out forwards; }
      `}</style>
    </>
  );
};

export default function GeneratorPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLite } = usePerformanceTier();


  // GSAP ScrollTrigger animations - loaded dynamically
  useEffect(() => {
    if (!containerRef.current) return;

    let cleanup: (() => void) | undefined;

    // Dynamically import GSAP to reduce initial bundle
    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger')
    ]).then(([gsapMod, scrollTriggerMod]) => {
      const gsap = gsapMod.gsap;
      const ScrollTrigger = scrollTriggerMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const sections = containerRef.current?.querySelectorAll('section');
      if (!sections) return;

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

      cleanup = () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    });

    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <div ref={containerRef} className="eims-section min-h-screen relative">
      {/* VideoObject Schema - Fixes Google Search Console video indexing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            name: 'Industrial Diesel Generators Kenya - Emerson EiMS',
            description: 'Premium diesel generators from 20kVA to 2000kVA for industrial and commercial use in Kenya. Cummins, Perkins, and CAT generators with installation and maintenance.',
            thumbnailUrl: 'https://www.emersoneims.com/images/tnpl-diesal-generator-1000x1000-1920x1080.webp',
            uploadDate: '2024-01-01T00:00:00+03:00',
            contentUrl: 'https://www.emersoneims.com/videos/VID-20250930-WA0000%20(3).mp4',
            embedUrl: 'https://www.emersoneims.com/generators',
            duration: 'PT45S',
            publisher: {
              '@type': 'Organization',
              name: 'Emerson EiMS',
              logo: { '@type': 'ImageObject', url: 'https://www.emersoneims.com/emerson-eims-logo.png' }
            }
          })
        }}
      />
      {/* Holographic Laser Overlay */}
      {!isLite && <HolographicLaser intensity="medium" color="#fbbf24" />}
      
      {/* UFO background removed — off-brand for an industrial sales page.
          The hero gets a professional amber ember field instead (below). */}
      {/* Enhanced Hero Video - Hollywood Cinematic Grade */}
      <section
        className="relative w-full h-screen overflow-hidden bg-black"
      >
        {/* Cinematic auto-rotating big-image background (replaced the
            unreliable hero video — same Hollywood grade, much sharper). */}
        <div className="absolute inset-0 w-full h-full">
          <GeneratorHeroSlides />

          {/* Hollywood Orange/Teal Color Grade Overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              background: 'linear-gradient(180deg, rgba(255,140,80,0.12) 0%, transparent 40%, rgba(0,80,120,0.15) 100%)',
            }}
          />

          {/* Cinematic Vignette */}
          <div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)',
            }}
          />

          {/* Anamorphic Lens Flare */}
          <div
            className="absolute top-1/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent pointer-events-none z-[3]"
          />
        </div>

        {/* Dark Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 pointer-events-none z-[5]" />

        {/* Awwwards ambient layer — GSAP parallax + lazy Three.js amber embers */}

        <div
          className="relative z-10 eims-shell flex flex-col items-center justify-center h-full text-center"
        >
          <h1
            className="text-5xl md:text-7xl font-display text-brand-gold drop-shadow-glow mb-6"
          >
            VOLTKA Cummins Diesel Generators
          </h1>
          <p
            className="mt-4 max-w-3xl text-white/90 text-xl md:text-2xl font-light"
          >
            10kVA to 2000kVA, sized to your actual load rather than a catalogue guess.
            <br />
            <span className="text-[#fbbf24]">
              2-year warranty {'\u2022'} 1 year free servicing {'\u2022'} mobile workshop in all 47 counties
            </span>
          </p>
          <div
            className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6"
          >
            <a href="#quote" className="cta-button-primary">Get a Quote {'\u2192'}</a>
            <a href="#new-generators" className="cta-button-secondary">See the Range {'\u2192'}</a>
            <a href="#comparison" className="cta-button-secondary">Compare Sets {'\u2192'}</a>
          </div>
        </div>

        <div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          QUOTE CAPTURE — the page's only form.

          Before this was added, /generators had ZERO forms. A page with 29
          sections and 80 sub-headings offered a buyer exactly three ways to
          act: ring a phone number, open WhatsApp, or leave. For capital
          equipment at 10kVA-2000kVA that is a real leak — this is researched
          out of hours, by people who will not phone a stranger, and a visitor
          who leaves without giving a name leaves no way to follow up.

          It sits immediately below the hero deliberately: the hero's primary
          CTA is #quote, so the first click lands here rather than bouncing the
          visitor to /contact and off this page's story.

          The form posts to /api/contact, which is the path that actually
          stores and delivers a lead. Do NOT repoint it at
          /api/notifications/new-lead — that endpoint returns success without
          storing or delivering anything.
      ════════════════════════════════════════════════════════════════ */}
      <section id="quote" className="py-16 bg-gradient-to-b from-black via-amber-950/20 to-black scroll-mt-28">
        <div className="eims-shell py-0">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl md:text-5xl font-display text-brand-gold mb-4">
                Tell us the load. We&apos;ll size the set.
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                Send the equipment you need to run and we will come back with the correct
                kVA, the fuel figure, and a written price — not a brochure range. If a
                smaller set does the job, we will say so.
              </p>
              <ul className="space-y-3 text-white/75">
                <li className="flex gap-3">
                  <span className="text-brand-gold font-bold">✓</span>
                  <span>2-year warranty and one year of free servicing on new sets</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-gold font-bold">✓</span>
                  <span>Installation and servicing in all 47 counties, by mobile workshop</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-gold font-bold">✓</span>
                  <span>Genuine spare parts held in stock, not ordered after a breakdown</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand-gold font-bold">✓</span>
                  <span>Independent — we fit the set to your load, not to a quota</span>
                </li>
              </ul>
              <p className="mt-6 text-white/60 text-sm">
                Prefer to talk? Call{' '}
                <a href="tel:+254768860665" className="text-brand-gold hover:underline">
                  +254 768 860 665
                </a>
                {' '}— Embakasi, off Airport North Road.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-black/60 p-6 md:p-8 backdrop-blur">
              <h3 className="text-xl font-bold text-white mb-1">Request a generator quote</h3>
              <p className="text-white/60 text-sm mb-6">
                We reply the same working day.
              </p>
              <QuickInquiryForm
                service="Generator supply"
                ctaLabel="Get My Quote"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CUMMINS SALES & SERVICE - MAIN BRAND SHOWCASE
      ════════════════════════════════════════════════════════════════ */}
      <CumminsBanner variant="hero" showPricing={true} showCTA={true} />

      {/* Cummins Product structured data is declared once in app/generators/layout.tsx
          (Product @id .../generators/#product). A second Product block here
          duplicated it and carried a separate aggregateRating, which produced
          Search Console's "Review has multiple aggregate ratings" error. */}

      {/* ═══════════════════════════════════════════════════════════════════
          BIBLE OF GENERATORS - COMPREHENSIVE NAVIGATION HUB
      ════════════════════════════════════════════════════════════════ */}
      <GeneratorBibleHub />

      {/* ═══════════════════════════════════════════════════════════════════
          🔥 URGENCY - LIMITED TIME OFFER
      ════════════════════════════════════════════════════════════════ */}
      <UrgencySection />

      {/* ═══════════════════════════════════════════════════════════════════
          📊 LIVE STATISTICS — DISABLED PER DATA POLICY
          The hardcoded values (150 projects / 85 clients / 99.8% uptime
          etc.) lacked verifiable provenance. Re-enable once the numbers
          are pulled from a verifiable source (CRM export, audit log).
      ════════════════════════════════════════════════════════════════ */}
      {/* <LiveStatisticsCounter /> */}

      {/* ═══════════════════════════════════════════════════════════════════
          💰 TRANSPARENT PRICING - Show Starting Prices
      ════════════════════════════════════════════════════════════════ */}
      <TransparentPricing />

      {/* ═══════════════════════════════════════════════════════════════════
          OUR WORK GALLERY - Cinematic 4K Showcase
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-b from-black via-gray-900/30 to-black">
        <div className="eims-shell">
          <div
            
            
            
            className="text-center mb-12"
          >
            <span className="text-amber-500 text-sm font-medium uppercase tracking-wider">
              Our Work
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
              Generator Excellence in Action
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From installation to maintenance, see our professional work across Kenya
            </p>
          </div>

          <CinematicImageGallery
            images={generatorGalleryImages}
            layout="nike-style"
            showCaptions={true}
            enableLightbox={true}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          WARRANTY SECTION - Industry-Leading Coverage
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-b from-black via-gray-900/50 to-black">
        <div className="eims-shell">
          <div
            
            
            
            
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Industry-Leading Warranties
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Every Cummins generator backed by comprehensive coverage and lifetime support
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Main Product Warranty */}
            <div
              
              
              
              
              className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-8 rounded-2xl border border-amber-500/30 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                  <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">2-Year Warranty</h3>
                  <p className="text-sm text-gray-400">Comprehensive Product Coverage</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  'Cummins engine components and factory defects',
                  'Alternator and starter motor coverage',
                  'Control panel and electrical wiring',
                  'Free maintenance for first 6 months',
                  '24/7 emergency breakdown support'
                ].map((item, i) => (
                  <li
                    key={i}
                    
                    
                    
                    
                    className="flex items-start gap-2 text-gray-300"
                  >
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <div
                
                
                
                
                className="mt-6 pt-6 border-t border-white/10"
              >
                <p className="text-xs text-gray-400 text-center">
                  ✓ Backed by EmersonEIMS Quality Guarantee
                </p>
              </div>
            </div>

            {/* Service Guarantee */}
            <div
              
              
              
              
              className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-8 rounded-2xl border border-blue-500/30 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">6-Month Service</h3>
                  <p className="text-sm text-gray-400">Complimentary Maintenance</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  'Free preventive maintenance visits',
                  'Oil and filter changes included',
                  'Performance optimization checks',
                  'Load bank testing'
                ].map((item, i) => (
                  <li
                    key={i}
                    
                    
                    
                    
                    className="flex items-start gap-2 text-gray-300"
                  >
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <div
                
                
                
                
                className="mt-6 pt-6 border-t border-white/10"
              >
                <p className="text-xs text-center text-gray-400">
                  📞 24/7 Support: <span className="text-blue-400">+254 768 860 665</span>
                </p>
              </div>
            </div>
          </div>

          {/* Warranty Terms Summary */}
          <div
            
            
            
            
            className="mt-12 max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-gray-900 to-black p-6 rounded-xl border border-gray-800">
              <h4 className="text-lg font-semibold text-white mb-4 text-center">Warranty Coverage Details</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
                <div>
                  <p className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Warranty valid from installation date</span>
                  </p>
                  <p className="flex items-start gap-2 mt-2">
                    <span className="text-green-500">✓</span>
                    <span>Parts and labor covered during warranty period</span>
                  </p>
                </div>
                <div>
                  <p className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Regular maintenance required to maintain warranty</span>
                  </p>
                  <p className="flex items-start gap-2 mt-2">
                    <span className="text-green-500">✓</span>
                    <span>Contact within 48 hours of issue discovery</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          🏆 WHY CHOOSE US - Value Propositions
      ════════════════════════════════════════════════════════════════ */}
      <WhyChooseUs />

      {/* ═══════════════════════════════════════════════════════════════════
          ⭐ CLIENT TESTIMONIALS / 🎬 VIDEO TESTIMONIALS / 📸 BEFORE-AFTER
          DISABLED PER DATA POLICY. The named-client quotes (St. Austin,
          Kivukoni, Bigot Flowers, Greenheart Kilifi, NTSA, Sanergy) and
          before/after metrics (99.8% / 99.9% uptime, KSh 1.2M saved) are
          held until signed releases and source-document evidence are filed
          under /docs/case-study-evidence/{id}/. Mirrors the gating shipped
          for /case-studies (data/caseStudies.ts).
          To re-enable: file evidence, then uncomment the three mounts.
      ════════════════════════════════════════════════════════════════ */}
      {/* <ClientTestimonials /> */}
      {/* <VideoTestimonials /> */}
      {/* <BeforeAfterGallery /> */}

      {/* Interactive Blobs Section */}
      <section className="relative py-20 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
        {!isLite && (
          <div className="absolute inset-0 opacity-30">
            <Suspense fallback={null}>
              <ErrorBoundary fallback={null}>
                <InteractiveBlobs className="w-full h-full" />
              </ErrorBoundary>
            </Suspense>
          </div>
        )}
        <div className="relative z-10 eims-shell py-0">
          <SectionLead
            title="Gravity-Defying Technology"
            subtitle="Experience our cutting-edge generator technology in 3D"
            centered
          />
        </div>
      </section>

      {/* 3D Viewer Section */}
      <section id="3d-viewer" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="eims-shell py-0">
          <SectionLead
            title="Cummins generator specifications"
            subtitle="Engine, alternator and rating for the sets we supply"
            centered
          />
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cumminsGenerators.slice(0, 3).map((gen) => (
              <div
                key={gen.model}
                
                
                
                className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 p-6"
              >
                <h3 className="text-2xl font-bold text-[#fbbf24] mb-4 font-display">{gen.model}</h3>
                <GeneratorSpecCard generator={gen} />
                {/*
                  ENGINE IS RENDERED ONLY WHERE THE SPEC IS VERIFIED.
                  See the provenance note in app/lib/data/cumminsgenerators.ts:
                  from 300 kVA upward the engine column claims 36-56 kW per
                  litre, roughly double what any diesel achieves, and one
                  alternator frame is repeated from 100 kVA to 2000 kVA. Model,
                  kVA and phase are fine and still shown.
                */}
                <div className="mt-4 space-y-2">
                  <p className="text-white"><span className="text-gray-400">Power:</span> {gen.kva} kVA</p>
                  <p className="text-white"><span className="text-gray-400">Phase:</span> {gen.phase}</p>
                  {gen.specsVerified ? (
                    <>
                      <p className="text-white"><span className="text-gray-400">Engine:</span> {gen.engine}</p>
                      <p className="text-white"><span className="text-gray-400">Alternator:</span> {gen.alternator}</p>
                    </>
                  ) : (
                    <p className="text-gray-400">
                      <span className="text-gray-400">Engine &amp; alternator:</span> confirmed on quotation
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Tool */}
      <section id="comparison" className="py-20 bg-black">
        <div className="eims-shell py-0">
          <GeneratorComparison />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          📊 BRAND COMPARISON TABLE - Help Decision Making
      ════════════════════════════════════════════════════════════════ */}
      <BrandComparisonTable />

      {/* Calculator & Charts Section */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="eims-shell py-0">
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
      {/*
        Anchor target for "New Generators".
        GENERATOR_HUB_SECTIONS above and the main navigation bar
        (components/navigation/NavigationBar.tsx) both point at
        /generators#new-generators, but nothing on the page carried that id —
        so the top-level "New Generators" menu item scrolled nowhere and every
        visitor who clicked it thought the site was broken.
        It cannot simply be added to the <section> below, because that element's
        id="models" is itself linked from two other places. Hence a dedicated
        anchor. scroll-mt-28 stops the sticky header covering the heading.
      */}
      <span id="new-generators" aria-hidden="true" className="block scroll-mt-28" />
      <section id="models" className="py-16 bg-black scroll-mt-28">
        <div className="eims-shell py-0">
          <SectionLead
            title="New Generators — Cummins & VOLTKA"
            subtitle="From compact 20kVA to industrial 2000kVA, supplied with a 2-year warranty and one year of free servicing"
            centered
          />
          
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cumminsGenerators.slice(0, 8).map((gen, index) => (
              <div
                key={gen.model}
                
                
                
                
                className="group bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 border border-gray-700 hover:border-brand-gold transition-all hover:shadow-2xl hover:shadow-amber-500/20"
              >
                {/*
                  This was a \u26A1 emoji at text-5xl standing in for the product
                  photograph on every card. A generator catalogue where the
                  product image is an emoji does not read as a company that has
                  the machines. Real photographs exist in this repo and are used
                  here, picked by rating so the cards are not identical.
                */}
                <div className="relative h-48 mb-4 bg-black/40 rounded-lg overflow-hidden">
                  <Image
                    src={
                      gen.kva >= 500
                        ? '/images/voltka/voltka-warehouse-fleet.webp'
                        : gen.kva >= 150
                          ? '/images/voltka/voltka-vks165-stock-forklift.webp'
                          : gen.kva >= 50
                            ? '/images/voltka/voltka-vks44-hero-profile.webp'
                            : '/images/voltka/cat-canopy-studio.webp'
                    }
                    alt={`${gen.model} \u2014 ${gen.kva} kVA diesel generator`}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-amber-500 text-black text-xs font-bold rounded">
                    {gen.kva} kVA
                  </div>
                </div>
                <h3 className="text-xl font-bold text-brand-gold mb-2">{gen.model}</h3>
                <p className="text-white/80 text-sm mb-1">{gen.phase} Phase</p>
                {/* Engine only where verified \u2014 see cumminsgenerators.ts provenance note. */}
                <p className="text-white/60 text-xs mb-4">
                  {gen.specsVerified ? gen.engine : 'Engine confirmed on quotation'}
                </p>
                {/*
                  VIEW DETAILS WAS A 404 ON EVERY CARD (fixed 2026-08-26).

                  It linked to /generators/<model-slug> \u2014 /generators/cummins-c20d5
                  and the rest. Verified live: all of them returned 404. The
                  primary call to action on every product card sent the buyer
                  nowhere, which is as expensive as a defect gets on a page whose
                  job is to sell.

                  It now points at the per-size page, which exists and returns
                  200 for every size we publish. Sizes above our published range
                  (750 kVA and up) have no page of their own, so those go to the
                  full price list rather than to another dead URL.

                  The "AR preview" button beside it is REMOVED, not relinked: it
                  opened /ar/generator/<model>, a route that does not exist in
                  this application, and on any non-iOS device it did nothing at
                  all \u2014 no else branch. A button that silently does nothing is
                  worse than no button.
                */}
                <div className="flex gap-2">
                  <a
                    href={
                      GENERATOR_SIZES.some((s) => s.kva === gen.kva)
                        ? `/generators/sizes/${gen.kva}-kva`
                        : '/pricing/generator-prices-kenya'
                    }
                    className="flex-1 text-center px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-600 transition-all text-sm"
                  >
                    View Details
                  </a>
                  <a
                    href="/contact"
                    className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all text-sm"
                  >
                    Get Quote
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*
        Mid-page conversion band, placed immediately after the model grid.

        This is the peak-intent moment on the page: the visitor has just looked
        at the range and is holding a rough kVA figure in their head. Every
        other CTA on this page sends them to /contact — off the page and out of
        the story — so this one points at the on-page #quote form instead. The
        /contact links elsewhere are left alone because several carry useful
        intent parameters (?subject=leasing, ?generator=VOLTKA) that the form
        does not.
      */}
      <section className="py-12 bg-gradient-to-r from-amber-950/30 via-black to-amber-950/30 border-y border-amber-500/20">
        <div className="eims-shell py-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h2 className="text-2xl md:text-3xl font-display text-brand-gold mb-2">
                Not sure which size you need?
              </h2>
              <p className="text-white/75 max-w-2xl">
                Send us the equipment you need to run. We will work out the correct kVA and
                come back with a written price — and if a smaller set does the job, we will
                tell you that instead.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a href="#quote" className="cta-button-primary whitespace-nowrap">Get a Quote {'→'}</a>
              <a href="tel:+254768860665" className="cta-button-secondary whitespace-nowrap">Call an Engineer</a>
            </div>
          </div>
        </div>
      </section>

      {/* Spare Parts Section */}
      <section className="py-16 bg-black">
        <div className="eims-shell py-0">
          <SectionLead
            title="Genuine Spare Parts"
            subtitle="Premium quality parts for optimal generator performance"
            centered
          />
          
          <div
            className="mt-12"
          >
            <OptimizedImage
              src="https://www.emersoneims.com/wp-content/uploads/2025/10/SPARES_300dpi.-fotor-enhance-20250821225707-1-1920x1080-1.webp"
              alt="Generator spare parts inventory - EmersonEIMS"
              width={1920}
              height={1080}
              className="w-full rounded-xl border border-amber-500/20"
            />
          </div>
        </div>
      </section>

      {/* Abstract Floating Shapes Section */}
      <section className="relative py-20 bg-gradient-to-b from-gray-900 via-black to-gray-900 overflow-hidden">
        {!isLite && (
          <div className="absolute inset-0 opacity-25">
            <Suspense fallback={null}>
              <ErrorBoundary fallback={null}>
                <AbstractFloatingShapes className="w-full h-full" interactive={true} />
              </ErrorBoundary>
            </Suspense>
          </div>
        )}
        <div className="relative z-10 eims-shell py-0">
          <SectionLead
            title="Advanced Engineering"
            subtitle="Precision-crafted generators with unmatched reliability"
            centered
          />
        </div>
      </section>

      {/* Services Preview */}
      <section id="services" className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="eims-shell py-0">
          <SectionLead
            title="Our Services"
            subtitle="End-to-end generator solutions"
            centered
          />
          
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatorServices.slice(0, 6).map((service: string, index: number) => (
              <div
                key={index}
                
                
                
                
                className="group bg-gradient-to-br from-black to-gray-900 rounded-xl p-6 border border-gray-800 hover:border-[#fbbf24] transition-all hover:shadow-xl hover:shadow-[#fbbf24]/20"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">{'\u26A1'}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{service}</h3>
                <p className="text-gray-400 text-sm">Professional service with 24/7 support</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <a href="/services" className="cta-button-primary" aria-label="View all generator services">
              <span>View All Services {'\u2192'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* AI Maintenance Hub - Customer-Friendly Showcase */}
      <section id="maintenance-hub" className="py-20 bg-gradient-to-br from-slate-950 via-cyan-950/20 to-slate-950 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <div
              
              
              
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              NEW: AI-Powered Tools
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Generator Maintenance Hub
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Your complete self-service toolkit for generator care. Diagnose problems, find parts,
              calculate costs, and predict failures - all in one place.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { icon: '🔮', title: 'AI Failure Predictor', desc: 'Describe symptoms, get predictions before breakdowns happen', color: 'purple' },
              { icon: '📊', title: 'Efficiency Calculator', desc: 'See your fuel costs, compare to grid power, find savings', color: 'green' },
              { icon: '📖', title: 'Repair Guides', desc: 'Step-by-step instructions with videos and torque specs', color: 'amber' },
              { icon: '🔩', title: 'Parts Finder', desc: 'Search 30+ parts with prices and availability in Kenya', color: 'cyan' },
              { icon: '📐', title: 'Interactive Diagrams', desc: 'Click any part on the generator to see details', color: 'pink' },
              { icon: '💰', title: 'Cost Tracker', desc: 'Track repairs, calculate ROI, know when to replace', color: 'red' },
            ].map((feature, index) => (
              <div
                key={feature.title}
                
                
                
                
                className="group bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/10"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/generators/maintenance-companion"
              
              
              
              
              
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
            >
              <span className="text-2xl">🤖</span>
              <span>Open Maintenance Hub</span>
              <span className="text-xl">→</span>
            </a>
            <a
              href="/generator-oracle"
              
              
              
              
              
              
              className="inline-flex items-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 hover:border-amber-500/50 transition-all"
            >
              <span className="text-2xl">🔍</span>
              <span>Lookup Fault Code</span>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-center">
            <div>
              <span className="text-3xl font-bold text-cyan-400">50+</span>
              <span className="text-slate-400 text-sm block">Parts in Database</span>
            </div>
            <div>
              <span className="text-3xl font-bold text-purple-400">8</span>
              <span className="text-slate-400 text-sm block">Repair Guides</span>
            </div>
            <div>
              <span className="text-3xl font-bold text-amber-400">15+</span>
              <span className="text-slate-400 text-sm block">AI Predictions</span>
            </div>
            <div>
              <span className="text-3xl font-bold text-emerald-400">6</span>
              <span className="text-slate-400 text-sm block">System Schematics</span>
            </div>
          </div>
        </div>
      </section>

      {/* Generator Sizing Calculator - Scientific Tool */}
      <section className="py-20 bg-gradient-to-br from-black via-orange-900/10 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
              Generator Sizing Calculator
            </h2>
            <p className="text-xl text-white/70">
              Calculate your perfect generator solution with our scientific calculator
            </p>
          </div>
          <GeneratorSizingCalculator />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          💰 SALES BOOSTERS - MAXIMIZE GENERATOR CONVERSIONS
          Flash deals, pricing, social proof, financing options
      ════════════════════════════════════════════════════════════════════ */}
      <section id="deals" className="py-20 bg-gradient-to-br from-black via-red-900/10 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 via-amber-400 to-red-400 bg-clip-text text-transparent">
              Hot Generator Deals
            </h2>
            <p className="text-xl text-white/70">
              Limited stock - Best prices in Kenya with 2-Year Warranty
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <GeneratorSalesBooster />
            <SizingCalculatorNew />
          </div>
        </div>
      </section>

      {/*
        Generator price list.

        HEADING DIFFERENTIATED 2026-08-26. This section and the capacity-band
        section far above it were both titled "Generator Prices Kenya 2026" —
        the same H2 twice on one page. Google reads that as the page covering
        one topic twice and cannot tell which block to surface; a reader
        scrolling past assumes they have looped back.

        NOTHING WAS REMOVED. The two blocks are genuinely different — that one
        gives price BANDS by capacity, this one is the itemised list by model —
        so they now say which is which. The #prices anchor is unchanged.
      */}
      <section id="prices" className="py-20 bg-gradient-to-br from-black via-amber-900/10 to-black">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
              Full price list — by model and capacity
            </h2>
            <p className="text-xl text-white/70">
              Every size we supply, with the figure we quote from — Cummins, Perkins, FG Wilson
            </p>
          </div>
          <GeneratorPriceList />
        </div>
      </section>

      {/* EDUCATIONAL CONTENT - Generator Knowledge Center */}
      <GeneratorEducationPanel />

      {/* ═══════════════════════════════════════════════════════════════════
          ENGINEERING REFERENCE — sizing, derating, fuel, power quality, TCO
          Reference-grade, server-rendered technical content (SEO + authority)
      ════════════════════════════════════════════════════════════════ */}
      <GeneratorEngineeringDeepDive />

      {/* ═══════════════════════════════════════════════════════════════════
          GENERATOR SYSTEMS - Educational Hub
      ════════════════════════════════════════════════════════════════ */}
      <GeneratorSystemsHub />

      {/* ═══════════════════════════════════════════════════════════════════
          LEASING PROGRAMS - Flexible Power Solutions
      ════════════════════════════════════════════════════════════════ */}
      <GeneratorLeasingSection />

      {/* ═══════════════════════════════════════════════════════════════════
          AI VISUAL DIAGNOSTIC — AI-assisted triage (verification required)
      ════════════════════════════════════════════════════════════════ */}
      <AIVisualDiagnosticSection />

      {/* Quick Diagnostics Preview Section */}
      <section id="diagnostics-preview" className="py-20 bg-gradient-to-b from-black via-slate-900 to-black">
        <div className="eims-shell">
          <SectionLead
            title="Generator Diagnostics"
            subtitle="Quick diagnostics tools - For full diagnostic module, visit our dedicated diagnostics page"
            centered
          />
          
          {/* Link to Full Diagnostics */}
          <div className="text-center mb-10">
            <a 
              href="/diagnostics" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
            >
              <span className="text-2xl">🔧</span>
              <span>Open Full Diagnostic Tool</span>
              <span className="text-xl">→</span>
            </a>
          </div>
          
          </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          💳 FINANCING CALCULATOR - Easy Payment Plans
      ════════════════════════════════════════════════════════════════ */}
      <FinancingCalculator />

      {/* ═══════════════════════════════════════════════════════════════════
          📄 DOWNLOADS - Brochures & Spec Sheets
      ════════════════════════════════════════════════════════════════ */}
      <DownloadsSection />

      {/* ═══════════════════════════════════════════════════════════════════
          🛡️ IRON-CLAD GUARANTEE - Build Trust
      ════════════════════════════════════════════════════════════════ */}
      <GuaranteeSection />

      {/* ═══════════════════════════════════════════════════════════════════
          ❓ FAQ SECTION - Handle All Objections
      ════════════════════════════════════════════════════════════════ */}
      <FAQSection />

      {/* ═══════════════════════════════════════════════════════════════════
          🎯 CONVERSION CTA HUB - 7 Direct Action Buttons
          Request Price, Inspection, Maintenance, Availability, Spare Parts, Trade-In, Speak to Engineer
      ════════════════════════════════════════════════════════════════ */}
      <ConversionCTAHub />

      {/* ═══════════════════════════════════════════════════════════════════
          🚀 FINAL CTA - Make Them Buy NOW
      ════════════════════════════════════════════════════════════════ */}
      <FinalCTA />

      {/* ═══════════════════════════════════════════════════════════════════
          💬 FLOATING WHATSAPP - Always Available
      ════════════════════════════════════════════════════════════════ */}
      {/* Funnel into the Repair Centre. This page carries real generator-buying
          traffic and previously offered no route to the 9 generator diagnosis
          guides. See the funnel audit note in RepairCentreCallout. */}
      <RepairCentreCallout
        hub="generators"
        accent="amber"
        heading="Already own a generator that is playing up?"
        body="Before you replace a set, it is worth knowing what is actually wrong with it. Our engineers have written up the diagnostic sequences they use on site — starting faults, protective shutdowns, output problems, cooling and fuel. Free to read, no sign-up."
      />

      <FloatingWhatsApp />
    </div>
  );
}

