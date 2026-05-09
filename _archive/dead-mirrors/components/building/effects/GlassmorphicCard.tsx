'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy';
}

/**
 * GLASSMORPHISM CARD - Premium iOS/macOS Style
 * Frosted glass effect with backdrop blur and subtle animations
 */
export default function GlassmorphicCard({ 
  children, 
  className = '', 
  intensity = 'medium' 
}: GlassmorphicCardProps) {
  
  const intensityClasses = {
    light: 'bg-white/5 backdrop-blur-sm',
    medium: 'bg-white/10 backdrop-blur-md',
    heavy: 'bg-white/20 backdrop-blur-xl'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ 
        scale: 1.02,
        rotateY: 2,
        rotateX: -2,
        transition: { duration: 0.3 }
      }}
      className={`
        relative rounded-3xl 
        ${intensityClasses[intensity]}
        border border-white/20
        shadow-[0_8px_32px_0_rgba(251,191,36,0.15)]
        hover:shadow-[0_8px_32px_0_rgba(251,191,36,0.25)]
        transition-all duration-500
        ${className}
      `}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-cyan-500/20 rounded-3xl blur-xl" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Border glow */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-amber-500/50 via-white/30 to-cyan-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
    </motion.div>
  );
}
