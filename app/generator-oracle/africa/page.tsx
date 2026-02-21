'use client';

/**
 * Generator Oracle - Africa Landing Page
 * Marketing page targeting all African generator technicians
 * SEO-optimized for pan-African reach
 *
 * DISCLAIMER: Generator Oracle is an independently developed diagnostic tool.
 * NOT affiliated with, endorsed by, or sponsored by any controller manufacturer.
 * All brand names are trademarks of their respective owners.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// African countries with generator markets
const AFRICAN_REGIONS = {
  eastAfrica: {
    name: 'East Africa',
    countries: [
      { code: 'KE', name: 'Kenya', cities: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'] },
      { code: 'TZ', name: 'Tanzania', cities: ['Dar es Salaam', 'Arusha', 'Mwanza', 'Dodoma', 'Zanzibar'] },
      { code: 'UG', name: 'Uganda', cities: ['Kampala', 'Entebbe', 'Jinja', 'Mbarara', 'Gulu'] },
      { code: 'RW', name: 'Rwanda', cities: ['Kigali', 'Butare', 'Gisenyi', 'Ruhengeri'] },
      { code: 'ET', name: 'Ethiopia', cities: ['Addis Ababa', 'Dire Dawa', 'Mekelle', 'Gondar'] },
    ],
  },
  westAfrica: {
    name: 'West Africa',
    countries: [
      { code: 'NG', name: 'Nigeria', cities: ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan'] },
      { code: 'GH', name: 'Ghana', cities: ['Accra', 'Kumasi', 'Tamale', 'Takoradi'] },
      { code: 'SN', name: 'Senegal', cities: ['Dakar', 'Thies', 'Saint-Louis'] },
      { code: 'CI', name: 'Ivory Coast', cities: ['Abidjan', 'Yamoussoukro', 'Bouake'] },
    ],
  },
  southernAfrica: {
    name: 'Southern Africa',
    countries: [
      { code: 'ZA', name: 'South Africa', cities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria'] },
      { code: 'ZM', name: 'Zambia', cities: ['Lusaka', 'Kitwe', 'Ndola', 'Livingstone'] },
      { code: 'ZW', name: 'Zimbabwe', cities: ['Harare', 'Bulawayo', 'Mutare'] },
      { code: 'BW', name: 'Botswana', cities: ['Gaborone', 'Francistown', 'Maun'] },
    ],
  },
  northAfrica: {
    name: 'North Africa',
    countries: [
      { code: 'EG', name: 'Egypt', cities: ['Cairo', 'Alexandria', 'Giza', 'Sharm El Sheikh'] },
      { code: 'MA', name: 'Morocco', cities: ['Casablanca', 'Marrakech', 'Rabat', 'Fez'] },
    ],
  },
};

const STATISTICS = [
  { value: '230,000+', label: 'Fault Codes', icon: '🔍' },
  { value: '9', label: 'Compatible Types', icon: '🎛️' },
  { value: '7', label: 'Languages', icon: '🌍' },
  { value: '100%', label: 'Offline Capable', icon: '📱' },
];

const LANGUAGES_SUPPORTED = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

// Compatible controller types (not affiliated with manufacturers)
const COMPATIBLE_CONTROLLERS = [
  { name: 'Compatible with DSE', models: 'Works with DSE 4520, 7320, 8610 series', color: '#0066cc' },
  { name: 'Compatible with ComAp', models: 'Works with InteliLite, InteliGen series', color: '#ff6600' },
  { name: 'Compatible with Woodward', models: 'Works with EasyGen, LS, GCP series', color: '#006633' },
  { name: 'Compatible with SmartGen', models: 'Works with HGM series controllers', color: '#cc0000' },
  { name: 'Compatible with PowerWizard', models: 'Works with PW 1.0, 1.1, 2.0 series', color: '#ffcc00' },
  { name: 'Compatible with Datakom', models: 'Works with DKG, D-500, D-700 series', color: '#0891B2' },
  { name: 'Compatible with Lovato', models: 'Works with RGK, ATL series', color: '#EA580C' },
  { name: 'Compatible with Siemens', models: 'Works with SICAM, SIPROTEC series', color: '#009999' },
  { name: 'Compatible with ENKO', models: 'Works with GCU, AMF series', color: '#7C3AED' },
];

const TESTIMONIALS = [
  {
    quote: "Generator Oracle saved us hours of troubleshooting. The fault codes are accurate and the reset procedures work!",
    author: "James Ochieng",
    role: "Senior Technician",
    location: "Nairobi, Kenya",
    flag: "🇰🇪",
  },
  {
    quote: "Finally, a tool that works offline! I can diagnose generators even in remote areas with no internet.",
    author: "Emmanuel Mwangi",
    role: "Field Engineer",
    location: "Arusha, Tanzania",
    flag: "🇹🇿",
  },
  {
    quote: "The Swahili translation is perfect. My entire team can use it without language barriers.",
    author: "Grace Nakato",
    role: "Maintenance Manager",
    location: "Kampala, Uganda",
    flag: "🇺🇬",
  },
  {
    quote: "230,000+ fault codes in one app! I've used it for DSE, ComAp, and Woodward controllers - all accurate.",
    author: "Ahmed Hassan",
    role: "Power Systems Engineer",
    location: "Lagos, Nigeria",
    flag: "🇳🇬",
  },
];

export default function AfricaLandingPage() {
  const [activeRegion, setActiveRegion] = useState<string>('eastAfrica');
  const [activeTechIndex, setActiveTechIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Africa Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full mb-6"
          >
            <span className="text-2xl">🌍</span>
            <span className="text-amber-400 font-bold">SERVING ALL OF AFRICA</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span className="text-white">The #1 Generator Diagnostic Tool</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400">
              For African Technicians
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-3xl mx-auto mb-8"
          >
            230,000+ fault codes, compatible with 9 controller types, 7 languages including Swahili, Arabic & French.
            Works 100% offline - perfect for remote African locations.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <Link
              href="/generator-oracle"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2"
            >
              <span className="text-xl">🔮</span>
              Try Generator Oracle FREE
            </Link>
            <Link
              href="/generator-oracle/purchase"
              className="px-8 py-4 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-700 transition-all border border-slate-600"
            >
              View Pricing - KES 20,000/year
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {STATISTICS.map((stat, idx) => (
              <div
                key={stat.label}
                className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Languages Section */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Available in 7 Languages
          </h2>
          <p className="text-slate-400 text-center mb-8 max-w-2xl mx-auto">
            Generator Oracle speaks your language. Whether you're in Kenya, Nigeria, Morocco, or anywhere in Africa,
            use the diagnostic tool in your preferred language.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {LANGUAGES_SUPPORTED.map((lang) => (
              <div
                key={lang.code}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg"
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="text-white">{lang.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compatible Controller Types */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Compatible with All Major Controller Types
          </h2>
          <p className="text-slate-400 text-center mb-8 max-w-2xl mx-auto">
            Comprehensive fault code database compatible with every controller used in African generators.
            <span className="block text-xs text-slate-500 mt-2">
              *Generator Oracle is independently developed and not affiliated with any manufacturer.
            </span>
          </p>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {COMPATIBLE_CONTROLLERS.map((brand) => (
              <div
                key={brand.name}
                className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl text-center hover:border-cyan-500/50 transition-all"
              >
                <div
                  className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: brand.color }}
                >
                  {brand.name.charAt(0)}
                </div>
                <div className="text-white font-medium mb-1">{brand.name}</div>
                <div className="text-slate-500 text-xs">{brand.models}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* African Regions */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Serving Technicians Across Africa
          </h2>
          <p className="text-slate-400 text-center mb-8 max-w-2xl mx-auto">
            From Cairo to Cape Town, Lagos to Nairobi - Generator Oracle is the trusted diagnostic tool
            for generator technicians across the continent.
          </p>

          {/* Region Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {Object.entries(AFRICAN_REGIONS).map(([key, region]) => (
              <button
                key={key}
                onClick={() => setActiveRegion(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeRegion === key
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {region.name}
              </button>
            ))}
          </div>

          {/* Countries Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {AFRICAN_REGIONS[activeRegion as keyof typeof AFRICAN_REGIONS].countries.map((country) => (
              <div
                key={country.code}
                className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">
                    {country.code === 'KE' ? '🇰🇪' :
                     country.code === 'TZ' ? '🇹🇿' :
                     country.code === 'UG' ? '🇺🇬' :
                     country.code === 'RW' ? '🇷🇼' :
                     country.code === 'ET' ? '🇪🇹' :
                     country.code === 'NG' ? '🇳🇬' :
                     country.code === 'GH' ? '🇬🇭' :
                     country.code === 'ZA' ? '🇿🇦' :
                     country.code === 'EG' ? '🇪🇬' :
                     country.code === 'MA' ? '🇲🇦' : '🌍'}
                  </span>
                  <span className="text-white font-bold">{country.name}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {country.cities.map((city) => (
                    <span
                      key={city}
                      className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Africa Needs Generator Oracle */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Built for African Conditions
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Generator Oracle was designed specifically for the challenges African technicians face.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-slate-900/50 border border-slate-700 rounded-xl">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-white mb-2">100% Offline</h3>
              <p className="text-slate-400">
                Works without internet - perfect for remote sites, rural areas, and places with poor connectivity.
              </p>
            </div>
            <div className="text-center p-6 bg-slate-900/50 border border-slate-700 rounded-xl">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-2">Instant Diagnostics</h3>
              <p className="text-slate-400">
                Get fault codes, causes, and solutions in seconds. No waiting, no guesswork.
              </p>
            </div>
            <div className="text-center p-6 bg-slate-900/50 border border-slate-700 rounded-xl">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-white mb-2">Affordable</h3>
              <p className="text-slate-400">
                Just KES 20,000/year (~$154 USD). Pays for itself after diagnosing just one fault.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Trusted by African Technicians
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Hear from generator professionals across the continent who use Generator Oracle daily.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl"
              >
                <div className="text-cyan-400 text-4xl mb-4">"</div>
                <p className="text-slate-300 mb-4 text-sm">{testimonial.quote}</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{testimonial.flag}</span>
                  <div>
                    <div className="text-white font-medium text-sm">{testimonial.author}</div>
                    <div className="text-slate-500 text-xs">{testimonial.role}</div>
                    <div className="text-slate-500 text-xs">{testimonial.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-link to Maintenance Hub */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">
              Also Check Out: Maintenance Hub
            </h2>
            <p className="text-slate-400 mb-6">
              The complete generator maintenance companion with AI-powered failure prediction,
              interactive schematics, spare parts catalog, and more.
            </p>
            <Link
              href="/generators/maintenance-companion"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all"
            >
              <span>🛠️</span>
              Explore Maintenance Hub
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Diagnose Generators Like a Pro?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Join thousands of African technicians using Generator Oracle.
            Free trial available until March 2026!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/generator-oracle"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/25"
            >
              Start Free Trial Now
            </Link>
            <a
              href="https://wa.me/254782914717?text=Hi,%20I'm%20interested%20in%20Generator%20Oracle%20for%20my%20team%20in%20Africa"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-green-500/20 text-green-400 font-bold rounded-xl hover:bg-green-500/30 transition-all border border-green-500/30"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-500 text-sm">
            Generator Oracle is a product of Emerson Industrial Maintenance Services Limited.
            Serving generator technicians across Africa since 2010.
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <Link href="/generator-oracle" className="text-cyan-400 hover:text-cyan-300">
              Generator Oracle
            </Link>
            <Link href="/generators/maintenance-companion" className="text-cyan-400 hover:text-cyan-300">
              Maintenance Hub
            </Link>
            <Link href="/contact" className="text-cyan-400 hover:text-cyan-300">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
