'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Leasing plans data
const LEASING_PLANS = [
  {
    id: 'short-term',
    name: 'Short-Term Lease',
    duration: '3-6 Months',
    discount: '5%',
    idealFor: ['Construction projects', 'Events', 'Emergency backup'],
    features: ['Flexible terms', 'Quick deployment', 'Basic maintenance included'],
    color: 'amber'
  },
  {
    id: 'standard',
    name: 'Standard Lease',
    duration: '1 Year',
    discount: '10%',
    idealFor: ['Business expansion', 'Seasonal operations', 'Factory setup'],
    features: ['Monthly payments', 'Full maintenance', 'Priority support'],
    color: 'blue',
    popular: true
  },
  {
    id: 'long-term',
    name: 'Long-Term Lease',
    duration: '2 Years',
    discount: '15%',
    idealFor: ['Established operations', 'Manufacturing', 'Data centers'],
    features: ['Lowest monthly cost', 'Comprehensive maintenance', 'Upgrade options'],
    color: 'purple'
  },
  {
    id: 'lease-to-own',
    name: 'Lease-to-Own',
    duration: '3+ Years',
    discount: '20%',
    idealFor: ['Long-term investment', 'Capital preservation', 'Asset building'],
    features: ['Ownership at end', 'Tax benefits', 'Full service history'],
    color: 'emerald'
  }
];

// Available generators for leasing
const LEASING_FLEET = [
  { kva: '20-30', brand: 'Cummins/Voltka', monthlyFrom: 35000, available: 12 },
  { kva: '50-100', brand: 'Cummins/Voltka', monthlyFrom: 65000, available: 8 },
  { kva: '150-250', brand: 'Cummins/Perkins', monthlyFrom: 120000, available: 6 },
  { kva: '300-500', brand: 'Cummins/CAT', monthlyFrom: 200000, available: 4 },
  { kva: '600-1000', brand: 'Cummins/CAT', monthlyFrom: 350000, available: 3 },
  { kva: '1000-2000', brand: 'Cummins/CAT', monthlyFrom: 550000, available: 2 },
];

// Benefits of leasing
const LEASING_BENEFITS = [
  {
    icon: '💰',
    title: 'No Capital Outlay',
    description: 'Preserve your cash flow for core business operations. No large upfront investment required.'
  },
  {
    icon: '🔧',
    title: 'Maintenance Included',
    description: 'All scheduled maintenance, repairs, and parts replacement covered in your lease.'
  },
  {
    icon: '📈',
    title: 'Tax Benefits',
    description: 'Lease payments are often fully deductible as operating expenses. Consult your accountant.'
  },
  {
    icon: '🔄',
    title: 'Flexible Upgrades',
    description: 'Scale up or down as your power needs change. Upgrade to newer models during lease.'
  },
  {
    icon: '📊',
    title: 'Predictable Costs',
    description: 'Fixed monthly payments make budgeting easier. No surprise repair bills.'
  },
  {
    icon: '🚀',
    title: 'Fast Deployment',
    description: 'Get your generator installed within 48-72 hours of approval. No waiting for procurement.'
  }
];

export default function GeneratorLeasingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedKva, setSelectedKva] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-6">
              💰 Flexible Power Solutions
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Generator <span className="text-emerald-400">Leasing</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Power your business without the capital investment. Flexible leasing terms from
              3 months to lease-to-own options. All maintenance included.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#plans" className="cta-button-primary">
                View Leasing Plans
              </a>
              <a href="/contact?subject=leasing" className="cta-button-secondary">
                Get Custom Quote
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Lease a Generator?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Leasing offers significant advantages over purchasing, especially for growing businesses.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LEASING_BENEFITS.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/30 transition-all"
              >
                <span className="text-4xl mb-4 block">{benefit.icon}</span>
                <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leasing Plans */}
      <section id="plans" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Leasing Plans
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose the plan that fits your business needs. All plans include maintenance and support.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEASING_PLANS.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative cursor-pointer rounded-2xl p-6 border transition-all ${
                  selectedPlan === plan.id
                    ? 'bg-emerald-500/20 border-emerald-500'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'
                } ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-emerald-400 mb-2">{plan.duration}</div>
                <div className="text-lg text-amber-400 mb-4">{plan.discount} Discount</div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 uppercase mb-2">Ideal For</p>
                  <ul className="space-y-1">
                    {plan.idealFor.map(item => (
                      <li key={item} className="text-sm text-gray-300">• {item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase mb-2">Features</p>
                  <ul className="space-y-1">
                    {plan.features.map(feature => (
                      <li key={feature} className="text-sm text-green-400">✓ {feature}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Fleet */}
      <section className="py-16 bg-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Available Leasing Fleet
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Generators ready for immediate deployment across Kenya.
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-gray-400">Capacity</th>
                  <th className="text-left p-4 text-gray-400">Brand</th>
                  <th className="text-left p-4 text-gray-400">Monthly From</th>
                  <th className="text-left p-4 text-gray-400">Available Units</th>
                  <th className="text-left p-4 text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {LEASING_FLEET.map((gen) => (
                  <motion.tr
                    key={gen.kva}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="border-b border-gray-800 hover:bg-slate-900/50"
                  >
                    <td className="p-4 font-semibold text-amber-400">{gen.kva} kVA</td>
                    <td className="p-4">{gen.brand}</td>
                    <td className="p-4 text-emerald-400">KES {gen.monthlyFrom.toLocaleString()}/mo</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${gen.available > 5 ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {gen.available} units
                      </span>
                    </td>
                    <td className="p-4">
                      <a
                        href={`/contact?subject=lease&kva=${gen.kva}`}
                        className="px-4 py-2 bg-emerald-500 text-black font-semibold rounded-lg hover:bg-emerald-400 transition-all text-sm"
                      >
                        Get Quote
                      </a>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How Leasing Works
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Consultation', desc: 'Discuss your power requirements with our team' },
              { step: '02', title: 'Quote & Approval', desc: 'Receive customized quote and credit approval' },
              { step: '03', title: 'Installation', desc: 'Professional installation within 48-72 hours' },
              { step: '04', title: 'Ongoing Support', desc: 'Maintenance and 24/7 support included' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-emerald-500/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Power Your Business?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Get a customized leasing quote today. Our team will help you find the perfect solution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/contact?subject=leasing" className="cta-button-primary">
              Request Leasing Quote
            </a>
            <a href="tel:+254768860665" className="cta-button-secondary">
              Call +254 768 860 665
            </a>
          </div>
        </div>
      </section>

      {/* Back to Generators */}
      <div className="py-8 text-center">
        <Link href="/generators" className="text-amber-400 hover:text-amber-300 underline">
          ← Back to Generators Bible
        </Link>
      </div>
    </main>
  );
}
