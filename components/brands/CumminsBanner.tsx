'use client';

/**
 * CUMMINS AUTHORIZED DEALER BANNER
 * Prominent branding for Cummins/Voltka generators
 * 3 Years Warranty + 1 Year Free Service
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Wrench, Award, Zap, Phone, ArrowRight, CheckCircle } from 'lucide-react';

interface CumminsBannerProps {
  variant?: 'hero' | 'compact' | 'sidebar' | 'footer';
  showPricing?: boolean;
  showCTA?: boolean;
}

export default function CumminsBanner({
  variant = 'hero',
  showPricing = false,
  showCTA = true
}: CumminsBannerProps) {

  if (variant === 'hero') {
    return (
      <section className="relative bg-gradient-to-r from-red-900 via-red-800 to-red-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="text-white font-medium">Authorized Cummins Dealer</span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                CUMMINS Generators
              </h2>
              <p className="text-xl md:text-2xl text-red-200 mb-2">
                Powered by <span className="text-white font-bold">VOLTKA</span>
              </p>
              <p className="text-3xl md:text-4xl font-bold text-amber-400 mb-6">
                10KVA - 2000KVA
              </p>

              {/* Key Benefits */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <Shield className="w-6 h-6 text-green-400" />
                  <span className="text-white font-bold">3 Years Warranty</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <Wrench className="w-6 h-6 text-blue-400" />
                  <span className="text-white font-bold">1 Year Free Service</span>
                </div>
              </div>

              {/* CTA Buttons */}
              {showCTA && (
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <Link
                    href="/generators"
                    className="flex items-center gap-2 px-8 py-4 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-all"
                  >
                    View All Models <ArrowRight className="w-5 h-5" />
                  </Link>
                  <a
                    href="https://wa.me/254793573208?text=Hi,%20I'm%20interested%20in%20Cummins%20generators.%20Please%20send%20me%20a%20quote."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-400 transition-all"
                  >
                    <Phone className="w-5 h-5" /> Get Quote
                  </a>
                </div>
              )}
            </motion.div>

            {/* Right Content - Features */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: <Shield className="w-8 h-8" />, title: '3 Years Warranty', desc: 'Comprehensive coverage' },
                { icon: <Wrench className="w-8 h-8" />, title: '1 Year Free Service', desc: 'Included maintenance' },
                { icon: <Award className="w-8 h-8" />, title: 'Authorized Dealer', desc: 'Official Voltka partner' },
                { icon: <Zap className="w-8 h-8" />, title: '10-2000KVA', desc: 'All power needs' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all"
                >
                  <div className="text-amber-400 mb-3 flex justify-center">{item.icon}</div>
                  <h3 className="text-white font-bold mb-1">{item.title}</h3>
                  <p className="text-red-200 text-sm">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Pricing Preview */}
          {showPricing && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
            >
              {[
                { kva: '20KVA', price: 'KES 550K' },
                { kva: '50KVA', price: 'KES 1.1M' },
                { kva: '100KVA', price: 'KES 2M' },
                { kva: '250KVA', price: 'KES 4.2M' },
                { kva: '500KVA', price: 'KES 8M' },
                { kva: '1000KVA', price: 'KES 18M' },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-4 text-center">
                  <p className="text-white font-bold text-lg">{item.kva}</p>
                  <p className="text-amber-400 text-sm">From {item.price}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-r from-red-800 to-red-900 rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-lg">
              <Award className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">CUMMINS by VOLTKA</h3>
              <p className="text-red-200">Authorized Dealer | 10-2000KVA</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center px-4 py-2 bg-white/10 rounded-lg">
              <p className="text-amber-400 font-bold">3 Years</p>
              <p className="text-white text-sm">Warranty</p>
            </div>
            <div className="text-center px-4 py-2 bg-white/10 rounded-lg">
              <p className="text-green-400 font-bold">1 Year</p>
              <p className="text-white text-sm">Free Service</p>
            </div>
            {showCTA && (
              <Link
                href="/generators"
                className="px-6 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-all"
              >
                View Models
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="bg-gradient-to-b from-red-800 to-red-900 rounded-xl p-6 text-center">
        <Award className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">CUMMINS</h3>
        <p className="text-red-200 text-sm mb-4">Powered by VOLTKA</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-white text-sm">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Authorized Dealer</span>
          </div>
          <div className="flex items-center gap-2 text-white text-sm">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>3 Years Warranty</span>
          </div>
          <div className="flex items-center gap-2 text-white text-sm">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>1 Year Free Service</span>
          </div>
          <div className="flex items-center gap-2 text-white text-sm">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>10-2000KVA Range</span>
          </div>
        </div>

        <Link
          href="/generators"
          className="block w-full py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-all"
        >
          View Generators
        </Link>
      </div>
    );
  }

  // Footer variant
  return (
    <div className="bg-red-900/50 border border-red-700 rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Award className="w-6 h-6 text-amber-400" />
        <div>
          <p className="text-white font-bold">CUMMINS by VOLTKA</p>
          <p className="text-red-300 text-sm">3 Yrs Warranty + 1 Yr Free Service</p>
        </div>
      </div>
      <Link
        href="/generators"
        className="px-4 py-2 bg-amber-500 text-black font-bold rounded-lg text-sm hover:bg-amber-400 transition-all"
      >
        Learn More
      </Link>
    </div>
  );
}

// Floating Cummins Badge for corner display
export function CumminsBadge() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="fixed bottom-24 right-4 z-40"
    >
      <Link
        href="/generators"
        className="block bg-gradient-to-br from-red-700 to-red-900 p-3 rounded-xl shadow-lg hover:scale-105 transition-transform"
      >
        <div className="text-center">
          <p className="text-amber-400 font-bold text-xs">CUMMINS</p>
          <p className="text-white text-[10px]">3Yr Warranty</p>
        </div>
      </Link>
    </motion.div>
  );
}
