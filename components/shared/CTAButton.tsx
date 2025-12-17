'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface CTAButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullWidth?: boolean;
}

/**
 * Universal CTA Button Component
 * Consistent golden yellow styling across all pages
 */
export default function CTAButton({
  href,
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
}: CTAButtonProps) {
  const baseStyles = 'relative inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 overflow-hidden group';
  
  const sizeStyles = {
    sm: 'px-6 py-2.5 text-sm',
    md: 'px-8 py-3.5 text-base',
    lg: 'px-10 py-4.5 text-lg',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:from-[#fcd34d] hover:to-[#fbbf24] shadow-lg shadow-[#fbbf24]/30 hover:shadow-[#fbbf24]/50',
    secondary: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white hover:from-[#fbbf24] hover:to-[#f59e0b] shadow-lg shadow-[#f59e0b]/30 hover:shadow-[#f59e0b]/50',
    outline: 'border-2 border-[#fbbf24] text-[#fbbf24] hover:bg-[#fbbf24] hover:text-black',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  const buttonContent = (
    <motion.span
      className="relative z-10 flex items-center gap-2"
      whileHover={{ x: 2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
    </motion.span>
  );

  const buttonClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`;

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={buttonClasses}>
      {buttonContent}
    </button>
  );
}









