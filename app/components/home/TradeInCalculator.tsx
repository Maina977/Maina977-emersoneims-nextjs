'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function TradeInCalculator() {
  const [brand, setBrand] = useState('Cummins');
  const [model, setModel] = useState('4BT3.9');
  const [hours, setHours] = useState(5000);
  const [condition, setCondition] = useState('fair');

  const brands = [
    { name: 'Cummins', models: ['4BT3.9', '6BT5.9', 'C240', 'C300', 'C500'] },
    { name: 'Perkins', models: ['1103A-33TG1', '1106A-70TAG2', '1106D-E66TA', '2506C-E15TAG2'] },
    { name: 'Caterpillar', models: ['C2.2', 'C4.2', 'C6.6', 'C13', 'C18'] },
    { name: 'FG Wilson', models: ['P26-4S', 'P33-4S', 'P44-5S', 'P66-5S', 'P88-5'] },
    { name: 'Atlas Copco', models: ['QAS 30', 'QAS 45', 'QAS 100', 'QAS 200', 'QAS 300'] },
  ];

  const tradeInValues = {
    Cummins: {
      '4BT3.9': { excellent: 450000, good: 320000, fair: 180000, poor: 80000 },
      '6BT5.9': { excellent: 620000, good: 420000, fair: 250000, poor: 120000 },
      'C240': { excellent: 850000, good: 620000, fair: 380000, poor: 180000 },
      'C300': { excellent: 1200000, good: 850000, fair: 520000, poor: 250000 },
      'C500': { excellent: 1850000, good: 1320000, fair: 820000, poor: 400000 },
    },
    Perkins: {
      '1103A-33TG1': { excellent: 380000, good: 280000, fair: 160000, poor: 70000 },
      '1106A-70TAG2': { excellent: 550000, good: 380000, fair: 220000, poor: 100000 },
      '1106D-E66TA': { excellent: 720000, good: 500000, fair: 300000, poor: 140000 },
      '2506C-E15TAG2': { excellent: 1100000, good: 780000, fair: 480000, poor: 220000 },
    },
    Caterpillar: {
      'C2.2': { excellent: 280000, good: 200000, fair: 120000, poor: 50000 },
      'C4.2': { excellent: 420000, good: 300000, fair: 180000, poor: 80000 },
      'C6.6': { excellent: 680000, good: 480000, fair: 290000, poor: 130000 },
      'C13': { excellent: 1050000, good: 750000, fair: 460000, poor: 220000 },
      'C18': { excellent: 1450000, good: 1050000, fair: 650000, poor: 310000 },
    },
    'FG Wilson': {
      'P26-4S': { excellent: 350000, good: 250000, fair: 150000, poor: 70000 },
      'P33-4S': { excellent: 480000, good: 340000, fair: 200000, poor: 90000 },
      'P44-5S': { excellent: 650000, good: 460000, fair: 280000, poor: 130000 },
      'P66-5S': { excellent: 900000, good: 640000, fair: 390000, poor: 180000 },
      'P88-5': { excellent: 1200000, good: 850000, fair: 520000, poor: 240000 },
    },
    'Atlas Copco': {
      'QAS 30': { excellent: 320000, good: 230000, fair: 140000, poor: 60000 },
      'QAS 45': { excellent: 480000, good: 340000, fair: 200000, poor: 90000 },
      'QAS 100': { excellent: 800000, good: 570000, fair: 350000, poor: 160000 },
      'QAS 200': { excellent: 1300000, good: 920000, fair: 560000, poor: 260000 },
      'QAS 300': { excellent: 1850000, good: 1320000, fair: 810000, poor: 380000 },
    },
  } as const;

  const currentBrand = brands.find(b => b.name === brand);
  const tradeInValue = tradeInValues[brand as keyof typeof tradeInValues]?.[model as keyof typeof tradeInValues[keyof typeof tradeInValues]];
  const value = tradeInValue?.[condition as keyof typeof tradeInValue] || 0;

  // Depreciation curve: 10% per 1000 hours for first 10k hours, then 5% per 1000
  const depreciationHours = Math.min(hours, 10000);
  const extraHours = Math.max(0, hours - 10000);
  const depreciation = (depreciationHours * 0.1) + (extraHours * 0.05);
  const finalValue = Math.max(value * (1 - depreciation / 100), value * 0.3);

  const newGeneratorPrice = 1050000; // VKS44 price
  const financingGap = newGeneratorPrice - finalValue;

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-900/50 to-black border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            Trade-In Appraisal
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What is Your Generator Worth?
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Instant Trade-In Valuation
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Upgrade your old generator to a new Cummins or FG Wilson. We buy your existing unit and credit the value toward your purchase. No hassle, fair pricing.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-8">Get Trade-In Value</h3>

            {/* Brand */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Generator Brand
              </label>
              <select
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  setModel(brands.find(b => b.name === e.target.value)?.models[0] || '');
                }}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-semibold hover:border-purple-500/50 focus:border-purple-500 transition-all"
              >
                {brands.map(b => (
                  <option key={b.name} value={b.name} className="bg-slate-900">{b.name}</option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-semibold hover:border-purple-500/50 focus:border-purple-500 transition-all"
              >
                {currentBrand?.models.map(m => (
                  <option key={m} value={m} className="bg-slate-900">{m}</option>
                ))}
              </select>
            </div>

            {/* Operating Hours */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Operating Hours: {hours.toLocaleString()}
              </label>
              <input
                type="range"
                min="100"
                max="30000"
                step="100"
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>100 hrs</span>
                <span>15,000 hrs</span>
                <span>30,000 hrs</span>
              </div>
            </div>

            {/* Condition */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Condition
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['excellent', 'good', 'fair', 'poor'].map(c => (
                  <button
                    key={c}
                    onClick={() => setCondition(c)}
                    className={`py-3 rounded-lg font-bold text-sm transition-all ${
                      condition === c
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-gray-300 border border-white/20 hover:border-purple-500/50'
                    }`}
                  >
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Trade-In Value Display */}
            <div className="bg-black/40 rounded-xl p-6 border border-purple-500/10">
              <p className="text-sm text-gray-400 mb-2">Estimated Trade-In Value</p>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-bold text-purple-400">
                  KES {finalValue.toLocaleString('en-KE', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-sm text-gray-400">(USD ${(finalValue / 13300).toLocaleString('en-US', { maximumFractionDigits: 0 })})</span>
              </div>
              <p className="text-xs text-gray-500">
                Based on condition, hours, and current market rates
              </p>
            </div>
          </motion.div>

          {/* Upgrade Path */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/30 rounded-2xl p-8 mb-6">
              <h3 className="text-2xl font-bold text-white mb-6">Upgrade to New Generator</h3>

              <div className="space-y-4 mb-8">
                <div>
                  <p className="text-sm text-gray-400 mb-2">New VOLTKA VKS44 (44 kVA)</p>
                  <div className="text-3xl font-bold text-white">
                    KES {newGeneratorPrice.toLocaleString('en-KE', { maximumFractionDigits: 0 })}
                  </div>
                </div>

                <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />

                <div>
                  <p className="text-sm text-gray-400 mb-2">Your Trade-In Credit</p>
                  <div className="text-2xl font-bold text-green-400">
                    -KES {finalValue.toLocaleString('en-KE', { maximumFractionDigits: 0 })}
                  </div>
                </div>

                <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />

                <div className="bg-black/60 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Amount to Finance</p>
                  <div className="text-3xl font-bold text-cyan-400">
                    KES {financingGap.toLocaleString('en-KE', { maximumFractionDigits: 0 })}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    At 14% interest, 24 months = KES {((financingGap * 0.14 / 12 * Math.pow(1.14 / 12 + 1, 24)) / (Math.pow(1.14 / 12 + 1, 24) - 1)).toLocaleString('en-KE', { maximumFractionDigits: 0 })}/month
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/30 rounded-lg p-6">
                <h4 className="text-green-400 font-bold mb-4">Upgrade Benefits</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>New 3-year warranty</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>40-50% better fuel efficiency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Quieter operation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Lower maintenance costs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>We handle old unit pickup & disposal</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-3">
              <button className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-lg hover:scale-105 transition-all">
                Get Trade-In Approval
              </button>
              <p className="text-xs text-gray-400 text-center">
                Instant valuation · No obligation · Free pickup
              </p>
            </div>
          </motion.div>
        </div>

        {/* Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 pt-12 border-t border-white/10"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-12">Simple Trade-In Process</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Quote', desc: 'Get instant trade-in valuation' },
              { step: '2', title: 'Inspect', desc: 'We inspect your generator' },
              { step: '3', title: 'Finance', desc: 'Approve financing on balance' },
              { step: '4', title: 'Deliver', desc: 'New gen installed, old picked up' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full">
                  <span className="font-bold text-white">{item.step}</span>
                </div>
                <h4 className="font-bold text-white mb-2">{item.title}</h4>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
