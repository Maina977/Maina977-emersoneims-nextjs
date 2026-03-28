'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Building2, Zap, Sun, Droplets, Cpu, Brain, Sparkles, ArrowRight,
  CheckCircle2, Globe, Clock, Award, TrendingUp, Shield, Star,
  Wrench, Search, BarChart3, FileText, Calculator, Layers
} from 'lucide-react';

// AI Tool Card Component
interface AIToolCardProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  stats: { label: string; value: string }[];
  icon: React.ReactNode;
  href: string;
  gradient: string;
  badge?: string;
  isPrimary?: boolean;
}

function AIToolCard({ title, subtitle, description, features, stats, icon, href, gradient, badge, isPrimary }: AIToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative overflow-hidden rounded-2xl border ${
        isPrimary
          ? 'border-amber-500/50 bg-gradient-to-br from-amber-900/20 via-gray-900 to-gray-900'
          : 'border-gray-700/50 bg-gray-900/80'
      } backdrop-blur-sm`}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute top-4 right-4 z-10">
          <span className={`px-3 py-1 text-xs font-bold rounded-full ${
            badge === '#1 WORLDWIDE'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            {badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className={`p-6 bg-gradient-to-r ${gradient}`}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <p className="text-white/80 text-sm">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <p className="text-gray-300">{description}</p>

        {/* Features */}
        <div className="space-y-2">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-gray-300">{feature}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-700/50">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-lg font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link href={href}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              isPrimary
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400'
                : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600'
            }`}
          >
            Launch Tool
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

export default function AIToolsPage() {
  const aiTools = [
    {
      title: 'Pro Building Suite',
      subtitle: 'AI Architecture + Structural + Quantity Surveying',
      description: 'The world\'s most powerful AI construction platform. Complete architectural design, structural engineering analysis, and professional BOQ generation in under 3 minutes.',
      features: [
        'AI Architect CAD - Floor plans, elevations, sections',
        'AI Structural Engineer - Load analysis, foundation design',
        'AI Quantity Surveyor - 134+ item BOQ, quotations',
        '195+ countries with real-time pricing',
        'Beats Autodesk Revit ($5,090/yr)',
      ],
      stats: [
        { label: 'Accuracy', value: '99.8%' },
        { label: 'Countries', value: '195+' },
        { label: 'Time', value: '<3min' },
      ],
      icon: <Building2 className="w-8 h-8 text-white" />,
      href: '/solutions/building',
      gradient: 'from-indigo-600 via-purple-600 to-violet-600',
      badge: '#1 WORLDWIDE',
      isPrimary: true,
    },
    {
      title: 'Generator Oracle',
      subtitle: 'AI-Powered Diagnostic System',
      description: 'The most comprehensive generator diagnostic platform with 400,000+ fault codes, interactive wiring diagrams, and AI-powered troubleshooting.',
      features: [
        '400,000+ fault codes database',
        'Interactive wiring diagrams',
        'Generator simulator with controls',
        'Step-by-step repair guides',
        'Cummins, Perkins, CAT, Kohler support',
      ],
      stats: [
        { label: 'Fault Codes', value: '400K+' },
        { label: 'Accuracy', value: '99.9%' },
        { label: 'Brands', value: '50+' },
      ],
      icon: <Zap className="w-8 h-8 text-white" />,
      href: '/generator-oracle',
      gradient: 'from-amber-600 via-orange-600 to-red-600',
      badge: 'AI-POWERED',
    },
    {
      title: 'Solar Genius Pro',
      subtitle: 'AI Solar Design & Optimization',
      description: 'Advanced AI-powered solar system design, sizing calculator, and optimization engine. Perfect installations every time.',
      features: [
        'AI system sizing & optimization',
        'Panel placement optimization',
        'Battery & inverter selection',
        'ROI & payback calculations',
        'Weather-adjusted performance',
      ],
      stats: [
        { label: 'Accuracy', value: '98.5%' },
        { label: 'ROI Boost', value: '+25%' },
        { label: 'Time Saved', value: '90%' },
      ],
      icon: <Sun className="w-8 h-8 text-white" />,
      href: '/solutions/solar',
      gradient: 'from-yellow-500 via-orange-500 to-amber-600',
      badge: 'AI',
    },
    {
      title: 'AquaScan Pro',
      subtitle: 'AI Water System Diagnostics',
      description: 'Intelligent borehole and water pump diagnostic system with predictive maintenance and optimization recommendations.',
      features: [
        'Pump performance analysis',
        'Water quality predictions',
        'Predictive maintenance alerts',
        'Energy optimization',
        'Flow rate optimization',
      ],
      stats: [
        { label: 'Uptime', value: '99.5%' },
        { label: 'Energy Save', value: '30%' },
        { label: 'Accuracy', value: '97%' },
      ],
      icon: <Droplets className="w-8 h-8 text-white" />,
      href: '/solutions/borehole-pumps',
      gradient: 'from-cyan-600 via-blue-600 to-indigo-600',
      badge: 'AI',
    },
  ];

  const additionalTools = [
    {
      title: 'Fault Code Lookup',
      description: 'Search 400,000+ error codes instantly',
      icon: <Search className="w-6 h-6" />,
      href: '/fault-code-lookup',
    },
    {
      title: 'Diagnostic Suite',
      description: 'Complete diagnostic experience',
      icon: <BarChart3 className="w-6 h-6" />,
      href: '/diagnostic-suite',
    },
    {
      title: 'Solar Sizing Calculator',
      description: 'AI-powered system sizing',
      icon: <Calculator className="w-6 h-6" />,
      href: '/solutions/solar-sizing',
    },
    {
      title: 'Generator Oracle Africa',
      description: 'Optimized for African technicians',
      icon: <Globe className="w-6 h-6" />,
      href: '/generator-oracle/africa',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-amber-500/20 rounded-full border border-purple-500/30 mb-6"
          >
            <Brain className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-medium">Powered by 75+ AI Engines</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white mb-6"
          >
            AI Tools{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Suite
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
          >
            The world&apos;s most advanced AI-powered tools for construction, power generation,
            solar energy, and water systems. Industry-leading accuracy. Lightning-fast results.
          </motion.p>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            {[
              { icon: <Cpu className="w-5 h-5" />, value: '75+', label: 'AI Engines' },
              { icon: <Globe className="w-5 h-5" />, value: '195+', label: 'Countries' },
              { icon: <TrendingUp className="w-5 h-5" />, value: '99.8%', label: 'Accuracy' },
              { icon: <Clock className="w-5 h-5" />, value: '<3min', label: 'Report Time' },
              { icon: <Award className="w-5 h-5" />, value: '#1', label: 'Worldwide' },
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <span className="text-amber-400">{stat.icon}</span>
                <span className="text-white font-bold">{stat.value}</span>
                <span className="text-gray-400 text-sm">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main AI Tools Grid */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {aiTools.map((tool, idx) => (
              <AIToolCard key={idx} {...tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Additional Tools */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Additional AI Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {additionalTools.map((tool, idx) => (
              <Link key={idx} href={tool.href}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-amber-500/50 transition-all text-center"
                >
                  <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 text-amber-400">
                    {tool.icon}
                  </div>
                  <h3 className="text-white font-semibold mb-1">{tool.title}</h3>
                  <p className="text-gray-400 text-xs">{tool.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/50 p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Why Our AI Tools Beat The Competition
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-4 text-gray-400">Feature</th>
                    <th className="text-center py-4 px-4 text-amber-400 font-bold">EmersonEIMS AI</th>
                    <th className="text-center py-4 px-4 text-gray-500">Autodesk</th>
                    <th className="text-center py-4 px-4 text-gray-500">Others</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['AI-Powered', 'Yes (75 engines)', 'No', 'Limited'],
                    ['Report Time', '<3 minutes', '4-8 hours', '3-5 hours'],
                    ['Accuracy', '99.8%', '85%', '75-88%'],
                    ['Countries', '195+', '~20', '~10'],
                    ['All-in-One', 'Yes', 'No (3+ tools)', 'No'],
                    ['Annual Cost', 'INCLUDED', '$5,090+', '$2,000+'],
                  ].map(([feature, us, autodesk, others], idx) => (
                    <tr key={idx} className="border-b border-gray-800">
                      <td className="py-4 px-4 text-gray-300">{feature}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
                          {us}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center text-gray-500">{autodesk}</td>
                      <td className="py-4 px-4 text-center text-gray-500">{others}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-2xl p-8 md:p-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to Experience the Future?
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals using our AI tools to work faster,
              smarter, and more accurately than ever before.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/solutions/building">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Try Pro Building Suite
                </motion.button>
              </Link>
              <Link href="/generator-oracle">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/20 transition-colors"
                >
                  Try Generator Oracle
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
