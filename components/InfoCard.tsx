'use client';

import { motion } from 'framer-motion';

interface InfoItem {
  label: string;
  detail: string;
}

interface InfoCardProps {
  title: string;
  items: InfoItem[];
  variant?: 'default' | 'premium' | 'glow' | 'gradient';
  icon?: React.ReactNode;
}

export default function InfoCard({ title, items, variant = 'premium', icon }: InfoCardProps) {
  // Variant styles
  const variantStyles = {
    default: 'border-white/10 bg-black/60',
    premium: 'border-white/10 bg-gradient-to-br from-black/80 via-gray-900/60 to-black/80 hover:border-amber-500/30',
    glow: 'border-amber-500/20 bg-black/70 shadow-[0_0_30px_rgba(251,191,36,0.1)] hover:shadow-[0_0_50px_rgba(251,191,36,0.2)]',
    gradient: 'border-transparent bg-gradient-to-br from-gray-900 via-black to-gray-900 hover:from-gray-800',
  };

  return (
    <motion.div 
      className={`
        relative p-6 rounded-2xl border backdrop-blur-sm overflow-hidden
        ${variantStyles[variant]}
        transition-all duration-500 ease-out
        group cursor-default
      `}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -5, 
        scale: 1.02,
        transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
      }}
    >
      {/* Animated gradient border effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-[-2px] rounded-2xl bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-amber-500/20 animate-pulse" />
      </div>
      
      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-2xl"
        initial={{ x: '-100%', opacity: 0 }}
        whileHover={{ x: '100%', opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-amber-500/30 rounded-tl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cyan-500/30 rounded-br-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-5">
          {icon && (
            <motion.div 
              className="text-amber-500"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              {icon}
            </motion.div>
          )}
          <h3 className="text-xl font-semibold text-transparent bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text group-hover:from-amber-300 group-hover:to-amber-500 transition-all duration-300">
            {title}
          </h3>
        </div>
        
        <ul className="space-y-4">
          {items.map((item, index) => (
            <motion.li 
              key={index}
              className="relative pl-4 border-l-2 border-white/10 group-hover:border-amber-500/50 transition-colors duration-300"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="font-medium text-white mb-1 group-hover:text-amber-100 transition-colors duration-300">
                {item.label}
              </div>
              <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300 leading-relaxed">
                {item.detail}
              </div>
              
              {/* Subtle dot indicator */}
              <div className="absolute left-[-5px] top-1 w-2 h-2 bg-amber-500/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.li>
          ))}
        </ul>
      </div>
      
      {/* Background glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-cyan-500/0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
    </motion.div>
  );
}

