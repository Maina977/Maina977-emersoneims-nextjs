'use client';

import { motion } from 'framer-motion';
import QuickInquiryModal from '@/components/forms/QuickInquiryModal';

interface ConversionCTAProps {
  label: string;
  icon?: string;
  service?: string;
  style?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function ConversionCTA({
  label,
  icon = '→',
  service = '',
  style = 'primary',
  size = 'md'
}: ConversionCTAProps) {
  const button = (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`inline-flex items-center gap-2 font-bold rounded-lg transition-all ${
        size === 'sm' ? 'px-4 py-2 text-sm' :
        size === 'lg' ? 'px-8 py-4 text-lg' :
        'px-6 py-3 text-base'
      } ${
        style === 'primary' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/30' :
        style === 'secondary' ? 'bg-slate-800 text-white border border-amber-500/50 hover:bg-slate-700 hover:border-amber-500' :
        'text-amber-400 hover:text-amber-300 underline'
      }`}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {label}
    </motion.button>
  );

  return (
    <QuickInquiryModal
      trigger={button}
      service={service}
      ctaLabel={label}
      title={label}
    />
  );
}
