'use client';

import { ReactNode } from 'react';

interface AppleSpacingProps {
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
}

/**
 * Apple-Level Spacing Component
 * Ensures perfect whitespace and breathing room
 */
export default function AppleSpacing({
  children,
  size = 'md',
  className = '',
}: AppleSpacingProps) {
  const sizeClasses = {
    xs: 'py-4 md:py-8',
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-24',
    xl: 'py-24 md:py-32',
    '2xl': 'py-32 md:py-40',
    '3xl': 'py-40 md:py-56',
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
}





