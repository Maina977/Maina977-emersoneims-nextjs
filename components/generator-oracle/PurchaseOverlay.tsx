'use client';

/**
 * PurchaseOverlay - Shown when user doesn't have a valid license
 * Displays product features, pricing, and payment instructions
 *
 * DISCLAIMER: Generator Oracle is an independently developed diagnostic tool.
 * NOT affiliated with, endorsed by, or sponsored by any controller manufacturer.
 *
 * PRICING: KES 20,000/year (from March 2nd, 2026)
 * FREE until March 1st, 2026
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { type License } from '@/lib/generator-oracle/licensing';

// Pricing configuration
const PRICING = {
  amount: 20000,
  currency: 'KES',
  period: 'year',
  usdEquivalent: 154, // Approximate USD equivalent
};

interface PurchaseOverlayProps {
  onActivateClick: () => void;
  pendingLicense?: License;
  statusReason?: string;
}

const FEATURES = [
  {
    icon: '🔍',
    title: '250,000+ Fault Codes',
    desc: 'Comprehensive database covering all major error codes',
  },
  {
    icon: '⚡',
    title: 'Compatible with 10 Controller Types',
    desc: 'Works with DSE, ComAp, Woodward, SmartGen, PowerWizard, Datakom, Lovato, Siemens, ENKO & Volvo Penta VODIA controllers',
  },
  {
    icon: '🔄',
    title: 'Reset Pathways',
    desc: 'Step-by-step instructions to clear every fault',
  },
  {
    icon: '📱',
    title: 'Works Offline',
    desc: 'Install as app - works without internet',
  },
  {
    icon: '🌍',
    title: '7 Languages',
    desc: 'English, Swahili, French, Arabic & more',
  },
  {
    icon: '📊',
    title: 'Annual Updates',
    desc: 'Regular database updates with new codes',
  },
];

// Business Details
const BUSINESS_INFO = {
  company: 'Emerson Industrial Maintenance Services Limited',
  phone: '0782914717',
  whatsapp: '+254782914717',
};

const PAYMENT_METHODS = {
  mpesa: {
    name: 'M-Pesa',
    icon: '📱',
    // For M-Pesa, customer can send to Till or Paybill
    // Using direct send to number for simplicity
    sendTo: '0782914717',
    instructions: 'Go to M-Pesa > Send Money > Enter Number > Amount: 20,000',
    note: 'Or use Buy Goods Till if available',
  },
  bank: {
    name: 'Bank Transfer',
    icon: '🏦',
    bank: 'Equity Bank',
    branch: 'Embakasi Branch',
    accountName: 'Emerson Industrial Maintenance Services Limited',
    accountNumber: '1320285133753',
  },
};

export default function PurchaseOverlay({
  onActivateClick,
  pendingLicense,
  statusReason,
}: PurchaseOverlayProps) {
  const [selectedPayment, setSelectedPayment] = useState<'mpesa' | 'bank'>('mpesa');

  // Show pending verification state
  if (pendingLicense?.status === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-slate-900/90 border border-amber-500/30 rounded-2xl p-8 text-center"
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-4xl">⏳</span>
          </motion.div>

          <h2 className="text-2xl font-bold text-white mb-2">Payment Verification Pending</h2>
          <p className="text-amber-400 mb-6">
            Your payment is being verified. This usually takes 1-24 hours.
          </p>

          <div className="bg-slate-800/50 rounded-lg p-4 mb-6 text-left">
            <div className="text-sm text-slate-400 mb-2">Submitted Details:</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="text-slate-300">{pendingLicense.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="text-slate-300">{pendingLicense.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Submitted:</span>
                <span className="text-slate-300">
                  {new Date(pendingLicense.activatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <p className="text-slate-400 text-sm mb-6">
            Once verified, your license key will be sent via SMS/WhatsApp.
          </p>

          <div className="flex gap-3">
            <a
              href="https://wa.me/254768860665?text=Hi,%20I'm%20checking%20on%20my%20Generator%20Oracle%20payment%20verification"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 bg-green-500/20 text-green-400 rounded-lg font-medium hover:bg-green-500/30 transition-all border border-green-500/30"
            >
              📞 Contact Support
            </a>
            <button
              onClick={onActivateClick}
              className="flex-1 py-3 bg-cyan-500/20 text-cyan-400 rounded-lg font-medium hover:bg-cyan-500/30 transition-all border border-cyan-500/30"
            >
              🔑 Enter License Key
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full mb-6"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-amber-400 font-medium">🔒 Premium Professional Tool</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400">
              Generator Oracle
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-4">
            The Ultimate Diagnostic Tool for Generator Technicians
          </p>

          {statusReason && (
            <p className="text-amber-400 text-sm bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2 inline-block">
              {statusReason}
            </p>
          )}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">What's Included</h2>

            <div className="grid gap-4">
              {FEATURES.map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-slate-900/50 border border-slate-700 rounded-xl hover:border-cyan-500/30 transition-all"
                >
                  <span className="text-3xl">{feature.icon}</span>
                  <div>
                    <h3 className="text-white font-medium">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Supported Controllers */}
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
              <h3 className="text-cyan-400 font-medium mb-3">Supported Controllers</h3>
              <div className="flex flex-wrap gap-2">
                {['DSE 4520', 'DSE 7320', 'InteliLite', 'InteliGen', 'EasyGen 3000', 'HGM6120', 'HGM9320', 'PowerWizard 1.1'].map(model => (
                  <span
                    key={model}
                    className="px-3 py-1 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-300"
                  >
                    {model}
                  </span>
                ))}
                <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-sm text-cyan-400">
                  +50 more...
                </span>
              </div>
            </div>
          </motion.div>

          {/* Purchase Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Price Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-amber-500/50 rounded-2xl p-6 mb-6 relative overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl" />

              <div className="relative">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-white">KES 20,000</span>
                  <span className="text-slate-400">/year</span>
                </div>
                <p className="text-amber-400 font-medium mb-4">~ USD $154 | Annual Subscription</p>

                <ul className="space-y-2 mb-6">
                  {['Full access to all 230,000+ fault codes', 'Unlimited searches & diagnoses', 'Offline mobile app access', 'All future updates included'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-slate-300 text-sm">
                      <span className="text-green-400">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Payment Method Selector */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setSelectedPayment('mpesa')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      selectedPayment === 'mpesa'
                        ? 'bg-green-500/20 text-green-400 border-2 border-green-500'
                        : 'bg-slate-800 text-slate-400 border border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    📱 M-Pesa
                  </button>
                  <button
                    onClick={() => setSelectedPayment('bank')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      selectedPayment === 'bank'
                        ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-500'
                        : 'bg-slate-800 text-slate-400 border border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    🏦 Bank
                  </button>
                </div>

                {/* Payment Instructions */}
                <div className="bg-slate-950/50 rounded-lg p-4 mb-4">
                  {selectedPayment === 'mpesa' ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Send to:</span>
                        <span className="text-white font-mono font-bold">{PAYMENT_METHODS.mpesa.sendTo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Amount:</span>
                        <span className="text-amber-400 font-mono font-bold">KES 20,000</span>
                      </div>
                      <div className="pt-2 border-t border-slate-700 text-sm text-slate-400">
                        {PAYMENT_METHODS.mpesa.instructions}
                      </div>
                      <div className="text-xs text-slate-500">
                        Save your M-Pesa confirmation code (e.g., QJK4XXXXX)
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Bank:</span>
                        <span className="text-white font-bold">{PAYMENT_METHODS.bank.bank}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Branch:</span>
                        <span className="text-white">{PAYMENT_METHODS.bank.branch}</span>
                      </div>
                      <div className="flex justify-between flex-wrap">
                        <span className="text-slate-400">Account Name:</span>
                        <span className="text-white text-sm">{PAYMENT_METHODS.bank.accountName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Account No:</span>
                        <span className="text-white font-mono font-bold">{PAYMENT_METHODS.bank.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Amount:</span>
                        <span className="text-amber-400 font-mono font-bold">KES 20,000</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <Link
                  href="/generator-oracle/purchase"
                  className="block w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl text-center hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/25 mb-3"
                >
                  Complete Purchase
                </Link>

                <button
                  onClick={onActivateClick}
                  className="w-full py-3 bg-slate-800 text-cyan-400 font-medium rounded-xl hover:bg-slate-700 transition-all border border-cyan-500/30"
                >
                  🔑 I Already Have a License Key
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                <span className="text-2xl block mb-1">🔒</span>
                <span className="text-xs text-slate-400">Secure Payment</span>
              </div>
              <div className="text-center p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                <span className="text-2xl block mb-1">✓</span>
                <span className="text-xs text-slate-400">Instant Delivery</span>
              </div>
              <div className="text-center p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                <span className="text-2xl block mb-1">📞</span>
                <span className="text-xs text-slate-400">24/7 Support</span>
              </div>
            </div>

            {/* Contact */}
            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm mb-2">Questions? Contact us:</p>
              <div className="flex justify-center gap-4">
                <a
                  href={`https://wa.me/${BUSINESS_INFO.whatsapp.replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300"
                >
                  WhatsApp
                </a>
                <a
                  href={`tel:+254${BUSINESS_INFO.phone.substring(1)}`}
                  className="text-blue-400 hover:text-blue-300"
                >
                  {BUSINESS_INFO.phone}
                </a>
                <a
                  href="mailto:support@emersoneims.com"
                  className="text-purple-400 hover:text-purple-300"
                >
                  Email
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer with Trademark Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center space-y-4"
        >
          <p className="text-slate-500 text-sm">
            © 2025 EmersonEIMS. Generator Oracle is a product of Emerson EIMS.
          </p>
          <p className="text-slate-600 text-xs max-w-2xl mx-auto leading-relaxed">
            <strong>Disclaimer:</strong> This software is an independent diagnostic assistant.
            Compatible with controllers from leading manufacturers. DeepSea, ComAp, Woodward,
            SmartGen, and Caterpillar PowerWizard are trademarks of their respective owners.
            This tool is independently developed and not affiliated with or endorsed by these companies.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
