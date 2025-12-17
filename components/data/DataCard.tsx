'use client';

import { motion } from 'framer-motion';
import TabularNumber from '@/components/typography/TabularNumber';

interface DataCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

/**
 * Data Card Component
 * Features: Tabular numbers, soft shadows, depth
 */
export default function DataCard({ label, value, unit, trend, className = '' }: DataCardProps) {
  return (
    <motion.div
      className={`relative rounded-xl border border-white/10 bg-black/60 backdrop-blur-sm p-6 depth-2 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, boxShadow: 'var(--shadow-lg)' }}
      transition={{ duration: 0.3 }}
    >
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 data-grid-subtle opacity-30 pointer-events-none rounded-xl" />
      
      <div className="relative z-10">
        <div className="text-sm text-gray-400 font-manrope mb-2 uppercase tracking-wider">
          {label}
        </div>
        <div className="flex items-baseline gap-2">
          {typeof value === 'number' ? (
            <TabularNumber className="text-3xl font-bold text-cyan-300 font-mono">
              {value.toLocaleString()}
            </TabularNumber>
          ) : (
            <span className="text-3xl font-bold text-cyan-300 font-mono">{value}</span>
          )}
          {unit && (
            <span className="text-lg text-gray-400 font-manrope">{unit}</span>
          )}
        </div>
        {trend && (
          <div className={`mt-3 text-sm font-mono flex items-center gap-1 ${
            trend.isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <TabularNumber>{Math.abs(trend.value)}%</TabularNumber>
          </div>
        )}
      </div>
    </motion.div>
  );
}








