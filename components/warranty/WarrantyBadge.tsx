'use client';

import { motion } from 'framer-motion';
import { Shield, Check, Award, Clock } from 'lucide-react';

/**
 * 🛡️ WARRANTY BADGE COMPONENT
 *
 * Revolutionary warranty display that communicates trust and professionalism
 * Apple-level design with clear, prominent warranty information
 *
 * Usage:
 * <WarrantyBadge
 *   duration="2 Years"
 *   coverage={["Engine components", "Alternator", "Free maintenance"]}
 *   type="product"
 * />
 */

interface WarrantyBadgeProps {
  duration: string;
  coverage: string[];
  type: 'product' | 'service' | 'parts';
  highlight?: boolean;
  className?: string;
}

export function WarrantyBadge({
  duration,
  coverage,
  type,
  highlight = false,
  className = ''
}: WarrantyBadgeProps) {
  const typeConfig = {
    product: {
      icon: Shield,
      label: 'Product Warranty',
      gradient: 'from-amber-500/10 to-orange-500/10',
      border: 'border-amber-500/30',
      iconColor: 'text-amber-500',
      highlight: 'from-amber-500/20 to-orange-500/20 border-amber-500/50'
    },
    service: {
      icon: Award,
      label: 'Service Guarantee',
      gradient: 'from-blue-500/10 to-cyan-500/10',
      border: 'border-blue-500/30',
      iconColor: 'text-blue-500',
      highlight: 'from-blue-500/20 to-cyan-500/20 border-blue-500/50'
    },
    parts: {
      icon: Clock,
      label: 'Parts Coverage',
      gradient: 'from-green-500/10 to-emerald-500/10',
      border: 'border-green-500/30',
      iconColor: 'text-green-500',
      highlight: 'from-green-500/20 to-emerald-500/20 border-green-500/50'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      className={`
        warranty-card
        bg-gradient-to-br
        ${highlight ? config.highlight : config.gradient}
        p-6
        rounded-2xl
        border
        ${highlight ? config.border.replace('/30', '/50') : config.border}
        backdrop-blur-sm
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          className={`
            p-2
            rounded-xl
            bg-gradient-to-br
            ${config.gradient}
            border
            ${config.border}
          `}
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </motion.div>
        <div>
          <h4 className="text-xl font-bold text-white">
            {duration} Warranty
          </h4>
          <p className="text-sm text-gray-400">
            {config.label}
          </p>
        </div>
      </div>

      {/* Coverage List */}
      <ul className="space-y-2">
        {coverage.map((item, i) => (
          <motion.li
            key={i}
            className="flex items-start gap-2 text-gray-300"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
            <span className="text-sm leading-relaxed">{item}</span>
          </motion.li>
        ))}
      </ul>

      {/* Trust Indicator */}
      {highlight && (
        <motion.div
          className="mt-4 pt-4 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-gray-400 text-center">
            ✓ Backed by EmersonEIMS Quality Guarantee
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

/**
 * WARRANTY SECTION COMPONENT
 *
 * Full-width warranty showcase section with Apple-level spacing
 * Displays multiple warranty badges in a responsive grid
 */

interface WarrantySectionProps {
  title?: string;
  subtitle?: string;
  warranties: Array<{
    duration: string;
    coverage: string[];
    type: 'product' | 'service' | 'parts';
    highlight?: boolean;
  }>;
}

export function WarrantySection({
  title = "Industry-Leading Warranties",
  subtitle = "Every product and service backed by comprehensive coverage",
  warranties
}: WarrantySectionProps) {
  return (
    <section className="section-apple bg-gradient-to-b from-black via-gray-900/50 to-black">
      <div className="container-apple">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="heading-section mb-4">
            {title}
          </h2>
          <p className="body-large max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Warranty Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {warranties.map((warranty, index) => (
            <WarrantyBadge
              key={index}
              duration={warranty.duration}
              coverage={warranty.coverage}
              type={warranty.type}
              highlight={warranty.highlight}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * COMPACT WARRANTY BADGE
 *
 * Smaller, inline version for embedding within product cards
 */

interface CompactWarrantyProps {
  duration: string;
  type?: 'product' | 'service' | 'parts';
}

export function CompactWarranty({ duration, type = 'product' }: CompactWarrantyProps) {
  const typeConfig = {
    product: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    service: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    parts: { color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/30' }
  };

  const config = typeConfig[type];

  return (
    <motion.div
      className={`
        inline-flex
        items-center
        gap-2
        px-3
        py-1.5
        rounded-full
        ${config.bg}
        border
        ${config.border}
      `}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      <Shield className={`w-3.5 h-3.5 ${config.color}`} />
      <span className={`text-sm font-medium ${config.color}`}>
        {duration} Warranty
      </span>
    </motion.div>
  );
}
