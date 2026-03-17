'use client';

/**
 * CUMMINS AUTHORIZED DEALER BANNER
 * Sci-Fi Black Design with Neon Accents, 3D Effects & Hover Animations
 * 3 Years Warranty + 1 Year Free Service
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Wrench, Award, Zap, Phone, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

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
      <section className="relative bg-black overflow-hidden py-8 md:py-12">
        {/* Animated Grid Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-amber-500/5" />
        </div>

        {/* Floating Orbs */}
        <motion.div
          animate={{ y: [-20, 20, -20], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [20, -20, 20], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-4">
          {/* Main 3D Container */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
            style={{ perspective: '1000px' }}
          >
            {/* Outer Glow Frame */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-amber-500 to-cyan-500 rounded-[2rem] blur-sm opacity-50 group-hover:opacity-75 transition-all duration-500" />

            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-[2rem] border border-white/10 overflow-hidden"
              style={{
                boxShadow: `
                  0 0 30px rgba(0, 255, 255, 0.15),
                  0 0 60px rgba(0, 255, 255, 0.1),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1),
                  0 25px 50px -12px rgba(0, 0, 0, 0.8)
                `
              }}
            >
              {/* Inner Gradient Border */}
              <div className="absolute inset-0 rounded-[2rem] border-2 border-transparent bg-clip-border"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,255,255,0.2), transparent, rgba(245,158,11,0.2))',
                  WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude'
                }}
              />

              <div className="relative p-8 md:p-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Left Content */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-center lg:text-left"
                  >
                    {/* Authorized Badge */}
                    <motion.div
                      whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)' }}
                      className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 backdrop-blur-xl rounded-full border border-cyan-500/30 mb-8"
                      style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)' }}
                    >
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                      <span className="text-cyan-300 font-semibold tracking-wide">AUTHORIZED CUMMINS DEALER</span>
                    </motion.div>

                    {/* Main Heading */}
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4">
                      <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
                        style={{ textShadow: '0 0 40px rgba(255,255,255,0.3)' }}
                      >
                        CUMMINS
                      </span>
                      <br />
                      <span className="text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                        Generators
                      </span>
                    </h2>

                    <p className="text-xl md:text-2xl text-gray-400 mb-2">
                      Powered by <span className="text-white font-bold">VOLTKA</span>
                    </p>

                    {/* Power Range Badge */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500/20 to-amber-500/10 rounded-2xl border border-amber-500/30 mb-8"
                      style={{ boxShadow: '0 0 25px rgba(245, 158, 11, 0.2)' }}
                    >
                      <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                        10KVA - 2000KVA
                      </p>
                    </motion.div>

                    {/* Key Benefits - 3D Cards */}
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                      <motion.div
                        whileHover={{ scale: 1.05, y: -5, boxShadow: '0 20px 40px rgba(34, 197, 94, 0.3)' }}
                        className="flex items-center gap-3 px-5 py-3 bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-xl rounded-2xl border border-green-500/30 cursor-pointer"
                        style={{ boxShadow: '0 10px 30px rgba(34, 197, 94, 0.15)' }}
                      >
                        <div className="p-2 bg-green-500/20 rounded-xl">
                          <Shield className="w-6 h-6 text-green-400" />
                        </div>
                        <span className="text-white font-bold">3 Years Warranty</span>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05, y: -5, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)' }}
                        className="flex items-center gap-3 px-5 py-3 bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl rounded-2xl border border-blue-500/30 cursor-pointer"
                        style={{ boxShadow: '0 10px 30px rgba(59, 130, 246, 0.15)' }}
                      >
                        <div className="p-2 bg-blue-500/20 rounded-xl">
                          <Wrench className="w-6 h-6 text-blue-400" />
                        </div>
                        <span className="text-white font-bold">1 Year Free Service</span>
                      </motion.div>
                    </div>

                    {/* CTA Buttons */}
                    {showCTA && (
                      <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                          <Link
                            href="/generators"
                            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold rounded-2xl transition-all duration-300"
                            style={{ boxShadow: '0 0 30px rgba(245, 158, 11, 0.4), 0 10px 30px rgba(245, 158, 11, 0.2)' }}
                          >
                            View All Models
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                          <a
                            href="https://wa.me/254793573208?text=Hi,%20I'm%20interested%20in%20Cummins%20generators.%20Please%20send%20me%20a%20quote."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-2xl transition-all duration-300"
                            style={{ boxShadow: '0 0 30px rgba(34, 197, 94, 0.4), 0 10px 30px rgba(34, 197, 94, 0.2)' }}
                          >
                            <Phone className="w-5 h-5" /> Get Quote
                          </a>
                        </motion.div>
                      </div>
                    )}
                  </motion.div>

                  {/* Right Content - 3D Feature Cards */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    {[
                      { icon: <Shield className="w-8 h-8" />, title: '3 Years Warranty', desc: 'Comprehensive coverage', color: 'green', glow: 'rgba(34, 197, 94, 0.3)' },
                      { icon: <Wrench className="w-8 h-8" />, title: '1 Year Free Service', desc: 'Included maintenance', color: 'blue', glow: 'rgba(59, 130, 246, 0.3)' },
                      { icon: <Award className="w-8 h-8" />, title: 'Authorized Dealer', desc: 'Official Voltka partner', color: 'amber', glow: 'rgba(245, 158, 11, 0.3)' },
                      { icon: <Zap className="w-8 h-8" />, title: '10-2000KVA', desc: 'All power needs', color: 'cyan', glow: 'rgba(0, 255, 255, 0.3)' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        whileHover={{
                          scale: 1.05,
                          y: -10,
                          rotateY: 5,
                          rotateX: 5,
                        }}
                        className={`relative group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/10 cursor-pointer overflow-hidden`}
                        style={{
                          boxShadow: `0 10px 40px ${item.glow}`,
                          transformStyle: 'preserve-3d'
                        }}
                      >
                        {/* Hover Glow Effect */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                          style={{ boxShadow: `inset 0 0 30px ${item.glow}` }}
                        />

                        {/* Neon Border on Hover */}
                        <div
                          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            border: `2px solid ${item.color === 'green' ? '#22c55e' : item.color === 'blue' ? '#3b82f6' : item.color === 'amber' ? '#f59e0b' : '#06b6d4'}`,
                            boxShadow: `0 0 20px ${item.glow}`
                          }}
                        />

                        <div className={`relative z-10 ${
                          item.color === 'green' ? 'text-green-400' :
                          item.color === 'blue' ? 'text-blue-400' :
                          item.color === 'amber' ? 'text-amber-400' : 'text-cyan-400'
                        } mb-4 flex justify-center`}>
                          <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors">
                            {item.icon}
                          </div>
                        </div>
                        <h3 className="relative z-10 text-white font-bold mb-1 group-hover:text-white transition-colors">{item.title}</h3>
                        <p className="relative z-10 text-gray-400 text-sm group-hover:text-gray-300 transition-colors">{item.desc}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Pricing Preview - Sci-Fi Grid */}
                {showPricing && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
                  >
                    {[
                      { kva: '20KVA', price: 'KES 1.1M' },
                      { kva: '50KVA', price: 'KES 1.6M' },
                      { kva: '100KVA', price: 'KES 2.3M' },
                      { kva: '250KVA', price: 'KES 5.5M' },
                      { kva: '500KVA', price: 'KES 9.5M' },
                      { kva: '1000KVA', price: 'KES 22M' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur rounded-2xl p-4 text-center border border-white/5 cursor-pointer overflow-hidden"
                        style={{ boxShadow: '0 5px 20px rgba(0,0,0,0.3)' }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                        <p className="relative text-white font-bold text-lg group-hover:text-cyan-300 transition-colors">{item.kva}</p>
                        <p className="relative text-amber-400 text-sm font-semibold">From {item.price}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-3xl p-6 border border-white/10 overflow-hidden"
        style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.1), 0 20px 40px rgba(0,0,0,0.5)' }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-4 bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-2xl border border-cyan-500/30"
              style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)' }}
            >
              <Award className="w-8 h-8 text-cyan-400" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-white">CUMMINS by VOLTKA</h3>
              <p className="text-gray-400">Authorized Dealer | 10-2000KVA</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(34, 197, 94, 0.4)' }}
              className="text-center px-5 py-3 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-2xl border border-green-500/30"
            >
              <p className="text-green-400 font-bold">3 Years</p>
              <p className="text-white text-sm">Warranty</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(59, 130, 246, 0.4)' }}
              className="text-center px-5 py-3 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl border border-blue-500/30"
            >
              <p className="text-blue-400 font-bold">1 Year</p>
              <p className="text-white text-sm">Free Service</p>
            </motion.div>
            {showCTA && (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  href="/generators"
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold rounded-2xl"
                  style={{ boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)' }}
                >
                  View Models
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative bg-gradient-to-b from-gray-900 via-black to-gray-900 rounded-3xl p-6 text-center border border-white/10 overflow-hidden"
        style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.1), 0 20px 40px rgba(0,0,0,0.5)' }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,255,0.1),transparent_50%)]" />

        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-4 right-4 w-20 h-20 border border-cyan-500/20 rounded-full"
        />

        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500/20 to-amber-500/20 rounded-2xl flex items-center justify-center border border-cyan-500/30"
            style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.3)' }}
          >
            <Award className="w-10 h-10 text-amber-400" />
          </motion.div>

          <h3 className="text-2xl font-bold text-white mb-1">CUMMINS</h3>
          <p className="text-gray-400 text-sm mb-6">Powered by VOLTKA</p>

          <div className="space-y-3 mb-6">
            {[
              { text: 'Authorized Dealer', icon: <CheckCircle className="w-4 h-4" /> },
              { text: '3 Years Warranty', icon: <CheckCircle className="w-4 h-4" /> },
              { text: '1 Year Free Service', icon: <CheckCircle className="w-4 h-4" /> },
              { text: '10-2000KVA Range', icon: <CheckCircle className="w-4 h-4" /> },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 5 }}
                className="flex items-center gap-3 text-white text-sm justify-center"
              >
                <span className="text-green-400">{item.icon}</span>
                <span>{item.text}</span>
              </motion.div>
            ))}
          </div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              href="/generators"
              className="block w-full py-4 bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold rounded-2xl"
              style={{ boxShadow: '0 0 25px rgba(245, 158, 11, 0.4)' }}
            >
              View Generators
            </Link>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Footer variant
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="relative bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between overflow-hidden"
      style={{ boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)' }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />

      <div className="relative flex items-center gap-4">
        <div className="p-2 bg-cyan-500/20 rounded-xl border border-cyan-500/30">
          <Award className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <p className="text-white font-bold">CUMMINS by VOLTKA</p>
          <p className="text-gray-400 text-sm">3 Yrs Warranty + 1 Yr Free Service</p>
        </div>
      </div>
      <motion.div whileHover={{ scale: 1.05 }}>
        <Link
          href="/generators"
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold rounded-xl text-sm"
          style={{ boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)' }}
        >
          Learn More
        </Link>
      </motion.div>
    </motion.div>
  );
}

// Floating Cummins Badge - Sci-Fi Style
export function CumminsBadge() {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className="fixed bottom-24 right-4 z-40"
    >
      <motion.div
        whileHover={{ scale: 1.15, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          href="/generators"
          className="block bg-gradient-to-br from-gray-900 to-black p-4 rounded-2xl border border-cyan-500/30 overflow-hidden"
          style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.3), 0 10px 30px rgba(0,0,0,0.5)' }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_70%)]" />
          <div className="relative text-center">
            <p className="text-amber-400 font-bold text-sm">CUMMINS</p>
            <p className="text-cyan-400 text-[10px]">3Yr Warranty</p>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
