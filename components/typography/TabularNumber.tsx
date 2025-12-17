'use client';

import { ReactNode } from 'react';

interface TabularNumberProps {
  children: ReactNode;
  className?: string;
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/**
 * Tabular Number Component
 * Displays numbers with tabular-nums for perfect alignment
 */
export default function TabularNumber({ 
  children, 
  className = '', 
  as: Component = 'span' 
}: TabularNumberProps) {
  return (
    <Component className={`tabular-nums ${className}`}>
      {children}
    </Component>
  );
}








