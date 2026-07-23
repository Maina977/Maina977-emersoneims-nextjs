'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function FinancingCalculator() {
  const [price, setPrice] = useState(1050000);
  const [months, setMonths] = useState(24);

  // Realistic Kenya interest rates: KCB ~13%, Equity ~14%, Safaricom ~15%
  const interestRate = 0.14;
  const monthlyRate = interestRate / 12;

  // Calculate monthly payment using standard loan formula
  const monthlyPayment = (price * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  const totalCost = monthlyPayment * months;
  const totalInterest = totalCost - price;

  const popularPrices = [
    { model: 'VOLTKA VKS10', price: 320000 },
    { model: 'VOLTKA VKS22', price: 620000 },
    { model: 'VOLTKA VKS44', price: 1050000 },
    { model: 'CUMMINS C62D', price: 1580000 },
    { model: 'CUMMINS C125', price: 2890000 },
  ];

  const banks = [
    { name: 'KCB Bank', rate: '13%', time: '12-48 months', logo: '🏦' },
    { name: 'Equity Bank', rate: '14%', time: '12-48 months', logo: '🏦' },
    { name: 'Safaricom Money', rate: '15%', time: '6-36 months', logo: '📱' },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black to-slate-900/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            Flexible Payment Plans
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Generator Financing
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Starting at KES 15,000/month
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Finance your generator through KCB Bank, Equity Bank, or Safaricom Money. Flexible terms, fast approval, same-day dispatch.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calculator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-8">Calculate Your Monthly Payment</h3>

            {/* Model Selector */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Select Generator Model
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {popularPrices.map((gen) => (
                  <button
                    key={gen.model}
                    onClick={() => setPrice(gen.price)}
                    className={`p-3 rounded-lg text-xs font-bold text-center transition-all ${
                      price === gen.price
                        ? 'bg-cyan-500 text-white'
                        : 'bg-white/10 text-gray-300 border border-white/20 hover:border-cyan-500/50'
                    }`}
                  >
                    <div className="text-[10px] opacity-75">{gen.model.split(' ')[1]}</div>
                    <div className="font-bold">KES {(gen.price / 1000).toFixed(0)}K</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Loan Term Slider */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Loan Term: {months} months ({Math.round(months / 12)} years)
              </label>
              <input
                type="range"
                min="12"
                max="60"
                step="12"
                value={months}
                onChange={(e) => setMonths(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>12 months</span>
                <span>36 months</span>
                <span>60 months</span>
              </div>
            </div>

            {/* Results */}
            <div className="bg-black/40 rounded-xl p-6 mb-8 border border-cyan-500/10">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Generator Price</p>
                  <p className="text-2xl font-bold text-white">KES {(price / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Monthly Payment</p>
                  <p className="text-2xl font-bold text-cyan-400">KES {(monthlyPayment / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Total Interest</p>
                  <p className="text-2xl font-bold text-orange-400">KES {(totalInterest / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Total Cost</p>
                  <p className="text-2xl font-bold text-green-400">KES {(totalCost / 1000).toFixed(0)}K</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-sm text-gray-300">
                  <span className="text-cyan-300 font-semibold">Interest Rate:</span> 14% per annum (Equity Bank average)
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  <span className="text-cyan-300 font-semibold">Approval Time:</span> 24–48 hours · Deployment same-day
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-3">
              <button className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:scale-105 transition-all">
                Get Financing Pre-Approval
              </button>
              <p className="text-xs text-gray-400 text-center">
                No obligation · 30-second application
              </p>
            </div>
          </motion.div>

          {/* Financing Partners */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Financing Partners</h3>

              <div className="space-y-4 mb-8">
                {banks.map((bank, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-cyan-500/30 transition-all"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-2xl">{bank.logo}</span>
                      <div>
                        <p className="font-bold text-white">{bank.name}</p>
                        <p className="text-xs text-gray-400">{bank.time}</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-cyan-400 mt-2">{bank.rate}</p>
                    <button className="w-full mt-3 px-3 py-2 bg-cyan-500/20 text-cyan-300 text-sm font-bold rounded-lg hover:bg-cyan-500/30 transition-all">
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>

              {/* Benefits Card */}
              <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/20 rounded-xl p-6">
                <h4 className="text-green-400 font-bold mb-4">✓ Financing Benefits</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Zero down payment available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>24–48 hour approval</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>3-year warranty included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Free delivery & installation</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Trust Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 pt-12 border-t border-white/10 text-center"
        >
          <p className="text-gray-400 mb-4">
            Over 1,200 generators financed across Kenya. Trusted by hospitals, factories, and commercial properties.
          </p>
          <div className="flex justify-center gap-8 flex-wrap text-sm text-gray-500">
            <span>🏥 Hospitals</span>
            <span>🏭 Manufacturing</span>
            <span>📞 Telecom</span>
            <span>🏪 Retail</span>
            <span>🌾 Agriculture</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
