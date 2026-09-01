'use client';

import { useState } from 'react';
import { formatKES } from '@/lib/format/currency';
import { monthlyRepayment } from '@/lib/finance/annuity';
import { GENERATOR_SIZES } from '@/lib/products/generatorSizes';

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

  /*
   * THE NEW-SET PRICE IS READ FROM GENERATOR_SIZES, NOT WRITTEN HERE.
   *
   * This was `const newGeneratorPrice = 1050000; // VKS44 price` — a hard-coded
   * figure. The VKS44 card on this same homepage reads its price from
   * GENERATOR_SIZES and renders "KES 950,000 - 1,150,000, published range".
   * 1,050,000 is the midpoint of that range, so the two agreed by coincidence
   * on the day it was typed and would silently disagree the first time the
   * published range moved — on one page, in two places, to the same buyer.
   *
   * There is no 44 kVA entry in GENERATOR_SIZES, so the nearest rating is used,
   * which is the same rule the VKS44 card applies (nearest is 50 kVA). The LOW
   * bound is taken rather than the midpoint: this drives a financing
   * illustration, and quoting the bottom of the published range is the figure
   * we can actually honour.
   */
  const nearestSize = GENERATOR_SIZES.reduce((best, s) =>
    Math.abs(s.kva - 44) < Math.abs(best.kva - 44) ? s : best
  );
  // 'KES 950,000 - 1,150,000' -> 950000. Falls back to 0 if the format changes,
  // which makes the section render a zero rather than a wrong number.
  const newGeneratorPrice =
    Number((nearestSize.priceRange.match(/[\d,]{6,}/) || ['0'])[0].replace(/,/g, '')) || 0;
  const financingGap = newGeneratorPrice - finalValue;

  /*
   * MONTHLY REPAYMENT — REWRITTEN 2026-08-31. The previous expression was:
   *
   *   (gap * 0.14 / 12 * Math.pow(1.14 / 12 + 1, 24)) / (Math.pow(1.14 / 12 + 1, 24) - 1)
   *
   * It used TWO DIFFERENT RATES in one formula. The leading coefficient used
   * 0.14/12, the correct monthly rate. The compounding base used 1.14/12 + 1,
   * which is 1.095 — a 9.5% MONTHLY rate, because it divides (1 + annual) by
   * 12 instead of dividing the annual rate alone.
   *
   * The effect was not cosmetic. On a KES 996,000 balance it returned
   * KES 13,104/month, and 13,104 x 24 = KES 314,496 — under a third of the
   * sum borrowed, before any interest. The correct payment is KES 47,821.
   * The page understated the monthly cost of a generator by roughly 3.6x, to
   * buyers deciding whether they could afford one.
   *
   * Below is the standard reducing-balance annuity, with the rate and term
   * named rather than repeated as literals, so the two can no longer drift
   * apart. INDICATIVE_ANNUAL_RATE is an illustration, not a quoted rate: no
   * lender, product or approved rate is evidenced anywhere in this repository,
   * which is why the figure is labelled as an illustration on the page and is
   * not presented as an offer of credit from EmersonEIMS.
   */
  const INDICATIVE_ANNUAL_RATE = 0.14;
  const FINANCE_TERM_MONTHS = 24;
  const repayment = monthlyRepayment({
    principal: financingGap,
    annualRate: INDICATIVE_ANNUAL_RATE,
    months: FINANCE_TERM_MONTHS,
  });

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-900/50 to-black border-t border-white/10 content-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 reveal">
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
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-2xl p-8 reveal">
            <h3 className="text-2xl font-bold text-white mb-8">Get Trade-In Value</h3>

            {/* Brand */}
            <div className="mb-8">
              {/* htmlFor/id: the label was adjacent but not associated, so the
                  control had no programmatic name and Lighthouse reported
                  "Form elements do not have associated labels" / "Select
                  elements do not have associated label elements". A sighted
                  user saw a label; a screen reader announced an unnamed combo
                  box. */}
              <label htmlFor="tradein-brand" className="block text-sm font-semibold text-gray-300 mb-3">
                Generator Brand
              </label>
              <select
                id="tradein-brand"
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
              <label htmlFor="tradein-model" className="block text-sm font-semibold text-gray-300 mb-3">
                Model
              </label>
              <select
                id="tradein-model"
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
              {/* formatKES, not toLocaleString(): this is a client component,
                  so a locale-aware formatter can render "5,000" on the server
                  and "5.000" in the browser, which React reports as a
                  hydration mismatch. formatKES is byte-identical on every
                  runtime. (It formats plain numbers too — the name refers to
                  where it is mostly used, not to a currency prefix.) */}
              <label htmlFor="tradein-hours" className="block text-sm font-semibold text-gray-300 mb-3">
                Operating Hours: {formatKES(hours)}
              </label>
              <input
                id="tradein-hours"
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
                  KES {formatKES(finalValue)}
                </span>
                {/*
                  A USD figure stood here, computed as finalValue / 13300. The
                  KES/USD rate is around 129, so the divisor was out by a factor
                  of roughly 100 and a KES 54,000 trade-in displayed as "USD $4".
                  There is no exchange-rate source in this repository, and the
                  brief forbids hard-coding one, so the conversion is removed
                  rather than replaced with another fixed number that would be
                  wrong the day it changed. The appraisal is quoted in KES,
                  which is the currency the transaction settles in.
                */}
              </div>
              <p className="text-xs text-gray-500">
                Based on condition, hours, and current market rates
              </p>
            </div>
          </div>

          {/* Upgrade Path */}
          <div className="reveal">
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/30 rounded-2xl p-8 mb-6">
              <h3 className="text-2xl font-bold text-white mb-6">Upgrade to New Generator</h3>

              <div className="space-y-4 mb-8">
                <div>
                  <p className="text-sm text-gray-400 mb-2">New VOLTKA VKS44 (44 kVA)</p>
                  <div className="text-3xl font-bold text-white">
                    KES {formatKES(newGeneratorPrice)}
                  </div>
                </div>

                <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />

                <div>
                  <p className="text-sm text-gray-400 mb-2">Your Trade-In Credit</p>
                  <div className="text-2xl font-bold text-green-400">
                    -KES {formatKES(finalValue)}
                  </div>
                </div>

                <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />

                <div className="bg-black/60 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Amount to Finance</p>
                  <div className="text-3xl font-bold text-cyan-400">
                    KES {formatKES(financingGap)}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Illustration only: {FINANCE_TERM_MONTHS} months on a reducing balance at{' '}
                    {(INDICATIVE_ANNUAL_RATE * 100).toFixed(0)}% a year is about KES{' '}
                    {formatKES(Math.round(repayment))}/month.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    This is not an offer of credit and not a quotation. EmersonEIMS does not lend —
                    financing is arranged with your own bank or asset financier, and your actual
                    rate, term and repayment come from them.
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/30 rounded-lg p-6">
                <h4 className="text-green-400 font-bold mb-4">Upgrade Benefits</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>New 2-year warranty</span>
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
          </div>
        </div>

        {/* Process */}
        <div className="mt-16 pt-12 border-t border-white/10 reveal">
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
        </div>
      </div>
    </section>
  );
}
