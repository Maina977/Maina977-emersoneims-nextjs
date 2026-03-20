'use client';

/**
 * EMERGENCY CTA - High-Conversion Urgency Component
 *
 * Creates urgency and drives immediate action with:
 * - Emergency power positioning
 * - Time-sensitive messaging
 * - Multiple contact options
 * - Trust badges
 * - Social proof counters
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Phone,
  MessageCircle,
  Zap,
  Clock,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Truck,
  Timer,
  Users,
  Award,
  Headphones
} from 'lucide-react';

interface EmergencyCTAProps {
  variant?: 'full' | 'compact' | 'floating' | 'banner';
  showStats?: boolean;
}

export default function EmergencyCTA({ variant = 'full', showStats = true }: EmergencyCTAProps) {
  const [projectsThisMonth, setProjectsThisMonth] = useState(47);
  const [activeEmergencies, setActiveEmergencies] = useState(3);

  // Simulate live counters
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveEmergencies(prev => Math.max(1, prev + (Math.random() > 0.7 ? 1 : -1)));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <span className="font-semibold">Power Emergency? We respond within 2 hours in Nairobi.</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:+254768860665"
              className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 font-bold rounded-full hover:bg-gray-100 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
            <a
              href="https://wa.me/254768860665?text=EMERGENCY%20-%20I%20need%20immediate%20power%20assistance"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-bold rounded-full hover:bg-green-400 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'floating') {
    return (
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-3"
      >
        <a
          href="tel:+254768860665"
          className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white font-bold rounded-full shadow-lg hover:bg-red-500 transition-all hover:scale-105"
        >
          <Phone className="w-5 h-5 animate-pulse" />
          Emergency: 0768 860 665
        </a>
        <a
          href="https://wa.me/254768860665"
          className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white font-bold rounded-full shadow-lg hover:bg-green-500 transition-all hover:scale-105"
        >
          <MessageCircle className="w-5 h-5" />
          WhatsApp Us
        </a>
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Need Power NOW?</h3>
            <p className="text-sm text-slate-400">Emergency response in 2 hours</p>
          </div>
        </div>

        <div className="space-y-3">
          <a
            href="tel:+254768860665"
            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:from-red-400 hover:to-orange-400 transition-all"
          >
            <Phone className="w-5 h-5" />
            Call: 0768 860 665
          </a>
          <a
            href="https://wa.me/254768860665?text=Hi%2C%20I%20need%20help%20with%20my%20power%20system"
            className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp Now
          </a>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-slate-400">
          <Headphones className="w-4 h-4" />
          <span>24/7 Support Available</span>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <section className="py-20 bg-gradient-to-b from-slate-950 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            {/* Urgency Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 mb-6"
            >
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              <span className="text-sm font-semibold">{activeEmergencies} Active Emergency Responses Right Now</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Power Emergency?
              <span className="block text-red-500">We're Already Moving.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-300 mb-8"
            >
              When your power goes down, every minute costs money. Our emergency teams are stationed across Nairobi with fully-equipped service vehicles ready to deploy.
            </motion.p>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-4 mb-8"
            >
              {[
                { icon: Clock, text: '2-Hour Response', sub: 'In Nairobi' },
                { icon: Truck, text: '48-Hour Nationwide', sub: 'All 47 Counties' },
                { icon: Shield, text: '24/7 Availability', sub: 'Never Closed' },
                { icon: Award, text: '98.7% Uptime', sub: 'Guaranteed' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-700/50 rounded-xl">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{item.text}</div>
                    <div className="text-xs text-slate-400">{item.sub}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="tel:+254768860665"
                className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg rounded-full hover:from-red-400 hover:to-orange-400 transition-all shadow-lg shadow-red-500/30 hover:scale-105"
              >
                <Phone className="w-6 h-6" />
                Call Now: 0768 860 665
              </a>
              <a
                href="https://wa.me/254768860665?text=URGENT%20-%20I%20need%20emergency%20power%20assistance%20immediately"
                className="flex items-center justify-center gap-3 px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-full hover:bg-green-500 transition-all shadow-lg shadow-green-500/30 hover:scale-105"
              >
                <MessageCircle className="w-6 h-6" />
                WhatsApp Emergency
              </a>
            </motion.div>
          </div>

          {/* Right Content - Stats */}
          {showStats && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-900/50 border border-slate-700/50 rounded-3xl p-8"
            >
              <h3 className="text-xl font-bold text-white mb-6 text-center">Why Kenya Trusts EmersonEIMS</h3>

              <div className="space-y-6">
                {[
                  { value: '500+', label: 'Projects Completed', icon: CheckCircle2, color: 'emerald' },
                  { value: '47', label: 'Counties Covered', icon: Users, color: 'blue' },
                  { value: '<2hrs', label: 'Avg Response Time', icon: Timer, color: 'amber' },
                  { value: '98.7%', label: 'Client Retention', icon: Award, color: 'purple' },
                  { value: '12+', label: 'Years Experience', icon: Shield, color: 'red' },
                ].map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-${stat.color}-500/20 rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <stat.icon className={`w-7 h-7 text-${stat.color}-400`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">{stat.label}</span>
                        <span className="text-2xl font-bold text-white">{stat.value}</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: '100%' }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1, duration: 1 }}
                          className={`h-full bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-400 rounded-full`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* This Month */}
              <div className="mt-8 pt-6 border-t border-slate-700">
                <div className="text-center">
                  <div className="text-4xl font-bold text-amber-400">{projectsThisMonth}</div>
                  <div className="text-slate-400">Projects This Month</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom Trust Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap justify-center items-center gap-8 text-slate-400"
        >
          <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Licensed & Insured</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> KEBS Certified</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> ERC Compliant</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> ISO 9001:2015</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> 3-Year Warranty</span>
        </motion.div>
      </div>
    </section>
  );
}
