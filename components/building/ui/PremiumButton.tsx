'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PremiumButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export default function PremiumButton({
  children,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
}: PremiumButtonProps) {
  const baseStyles = 'relative inline-flex items-center justify-center font-bold rounded-full overflow-hidden group transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]';
  
  const sizeStyles = {
    sm: 'px-6 py-2 text-sm',
    md: 'px-8 py-3 text-lg',
    lg: 'px-12 py-4 text-xl',
  };

  const variantStyles = {
    primary: 'text-black bg-gradient-to-r from-brand-gold to-yellow-500 shadow-lg hover:shadow-2xl hover:shadow-brand-gold/60',
    outline: 'text-brand-gold border-2 border-brand-gold hover:text-black hover:bg-gradient-to-r hover:from-brand-gold hover:to-yellow-500',
    ghost: 'text-amber-400 hover:text-brand-gold hover:bg-amber-500/10',
  };

  const buttonContent = (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      {variant === 'primary' && (
        <>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 opacity-0 group-hover:opacity-100"
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className="absolute inset-0 border-2 border-brand-gold/50 rounded-full opacity-0 group-hover:opacity-100"
            initial={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          />
        </>
      )}
      {variant === 'outline' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-brand-gold to-yellow-500 origin-left"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        />
      )}
    </motion.button>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        {buttonContent}
      </motion.a>
    );
  }

  return buttonContent;
}

