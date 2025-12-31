'use client';

import { motion } from 'framer-motion';
import OptimizedImage from '@/components/media/OptimizedImage';
import { useState } from 'react';

// Generator parts categories
const partsCategories = [
  {
    name: 'Engine Parts',
    icon: '⚙️',
    description: 'Pistons, rings, bearings, gaskets, fuel injectors',
    brands: ['Cummins', 'Perkins', 'Caterpillar', 'Volvo Penta', 'FG Wilson'],
    image: '/images/tnpl-diesal-generator-1000x1000-1920x1080.webp'
  },
  {
    name: 'Filters',
    icon: '🔧',
    description: 'Oil filters, fuel filters, air filters, coolant filters',
    brands: ['Fleetguard', 'Donaldson', 'Baldwin', 'Mann Filter'],
    image: '/images/Generators/Generator Parts & Accessories.png'
  },
  {
    name: 'Electrical & Controls',
    icon: '⚡',
    description: 'AVR, controllers, starters, alternators, sensors',
    brands: ['DeepSea', 'PowerWizard', 'ComAp', 'Stamford', 'Leroy Somer'],
    image: '/images/Controllers/deepsea-controller-system-1920x1080.webp'
  },
  {
    name: 'Cooling System',
    icon: '❄️',
    description: 'Radiators, fans, thermostats, water pumps, coolant',
    brands: ['OEM', 'Aftermarket'],
    image: '/images/solar power farms.png'
  },
  {
    name: 'Fuel System',
    icon: '⛽',
    description: 'Fuel pumps, injectors, filters, hoses, tanks',
    brands: ['Bosch', 'Delphi', 'Denso'],
    image: '/images/tnpl-diesal-generator-1000x1000-1920x1080.webp'
  },
  {
    name: 'Exhaust & Silencers',
    icon: '💨',
    description: 'Silencers, flex pipes, clamps, gaskets',
    brands: ['Custom Fabrication Available'],
    image: '/images/Generators/Generator Parts & Accessories.png'
  }
];

// Featured parts
const featuredParts = [
  {
    name: 'DeepSea 7320 Controller',
    category: 'Controls',
    price: 'KSh 45,000',
    inStock: true,
    description: 'Auto start controller with display'
  },
  {
    name: 'Cummins Oil Filter (Fleetguard LF9009)',
    category: 'Filters',
    price: 'KSh 2,500',
    inStock: true,
    description: 'Genuine Fleetguard for Cummins engines'
  },
  {
    name: 'Stamford AVR MX341',
    category: 'Electrical',
    price: 'KSh 28,000',
    inStock: true,
    description: 'Automatic voltage regulator'
  },
  {
    name: 'Fuel Filter Water Separator',
    category: 'Filters',
    price: 'KSh 3,800',
    inStock: true,
    description: 'Universal fit - removes water from fuel'
  },
  {
    name: 'Engine Gasket Kit (Complete)',
    category: 'Engine Parts',
    price: 'KSh 12,000',
    inStock: true,
    description: 'Full gasket set for overhauls'
  },
  {
    name: 'Battery Charger Module 12V/24V',
    category: 'Electrical',
    price: 'KSh 8,500',
    inStock: true,
    description: 'Maintains battery charge'
  }
];

export default function GeneratorPartsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(245, 158, 11, 0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="eims-shell relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
              Generator Parts Kenya
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Genuine spare parts for ALL brands. Same-day delivery in Nairobi.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-6 py-3">
                <span className="text-amber-400 font-semibold">✓ OEM & Aftermarket</span>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-6 py-3">
                <span className="text-cyan-400 font-semibold">✓ 47 Counties Covered</span>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-6 py-3">
                <span className="text-green-400 font-semibold">✓ Warranty Included</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Parts Categories Grid */}
      <section className="py-20 bg-black">
        <div className="eims-shell">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-4"
          >
            Parts Categories
          </motion.h2>
          <p className="text-center text-gray-400 text-lg mb-12 max-w-3xl mx-auto">
            Complete inventory for Cummins, Perkins, CAT, Volvo, FG Wilson, and more
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partsCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-900 to-black border border-amber-500/20 rounded-2xl p-6 hover:border-amber-500/40 transition-all group"
              >
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-amber-400">{category.name}</h3>
                <p className="text-gray-400 mb-4">{category.description}</p>
                <div className="flex flex-wrap gap-2">
                  {category.brands.map(brand => (
                    <span key={brand} className="text-xs bg-white/5 px-3 py-1 rounded-full text-gray-300">
                      {brand}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Parts */}
      <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="eims-shell">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-4"
          >
            Popular Parts
          </motion.h2>
          <p className="text-center text-gray-400 text-lg mb-12">
            Frequently ordered spare parts - In stock and ready to ship
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredParts.map((part, index) => (
              <motion.div
                key={part.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-black border-2 border-amber-500/20 rounded-xl p-6 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/20 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full">
                    {part.category}
                  </span>
                  {part.inStock && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                      In Stock
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{part.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{part.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-amber-400">{part.price}</span>
                  <button className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-6 py-2 rounded-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition-all">
                    Order Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Buy Parts from EmersonEIMS */}
      <section className="py-20 bg-black">
        <div className="eims-shell">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Why Buy Parts from Us?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '✓', title: 'Genuine Parts', desc: 'OEM and certified aftermarket only' },
              { icon: '🚚', title: 'Same-Day Nairobi', desc: 'Order before 2pm, delivered same day' },
              { icon: '📦', title: 'All Brands', desc: 'Cummins, Perkins, CAT, Volvo, FG Wilson' },
              { icon: '🛡️', title: 'Warranty', desc: '3-12 months on all parts' },
              { icon: '💰', title: 'Best Prices', desc: 'Competitive rates, bulk discounts' },
              { icon: '📞', title: '24/7 Support', desc: 'Parts helpline always available' },
              { icon: '🔧', title: 'Free Installation', desc: 'Buy + install service available' },
              { icon: '🇰🇪', title: '47 Counties', desc: 'Nationwide delivery within 48hrs' }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-amber-400">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="eims-shell text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-8"
          >
            Serving All 47 Kenya Counties
          </motion.h2>
          <p className="text-gray-400 text-lg mb-8 max-w-3xl mx-auto">
            Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, Thika, Malindi, Kitale, and 39 more counties
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Same-Day Nairobi', 'Next-Day Mombasa', 'Express to Kisumu', '48hr Nationwide'].map(badge => (
              <span key={badge} className="bg-amber-500/10 border border-amber-500/30 px-6 py-3 rounded-lg text-amber-400 font-semibold">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="eims-shell">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-amber-500/10 to-cyan-500/10 border-2 border-amber-500/30 rounded-3xl p-12 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Need a Part? We Have It.
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Call us with your generator model and part number. We'll source it for you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+254XXXXXXXXX"
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-amber-600 hover:to-amber-700 transition-all"
              >
                📞 Call Parts Hotline
              </a>
              <a
                href="https://wa.me/254XXXXXXXXX"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all"
              >
                💬 WhatsApp Order
              </a>
              <a
                href="/contact"
                className="bg-white/10 border-2 border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
              >
                📧 Email Quote Request
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
