'use client';

import { ReactNode } from 'react';

interface RefinedTypographyProps {
  children: ReactNode;
  variant?: 'hero' | 'display' | 'heading' | 'subheading' | 'body' | 'caption' | 'label';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

/**
 * Apple-Level Refined Typography
 * Perfect font sizing, line heights, and spacing
 */
export default function RefinedTypography({
  children,
  variant = 'body',
  size = 'base',
  weight = 'normal',
  className = '',
  as,
}: RefinedTypographyProps) {
  const variantStyles = {
    hero: 'font-hero leading-hero tracking-tight',
    display: 'font-display leading-display tracking-tight',
    heading: 'font-display leading-tight tracking-tight',
    subheading: 'font-body leading-snug tracking-normal',
    body: 'font-body leading-body tracking-normal',
    caption: 'font-body leading-normal tracking-wide',
    label: 'font-body leading-tight tracking-wide uppercase text-xs',
  };

  const sizeStyles = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
  };

  const weightStyles = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
  };

  const Tag = as || (variant === 'hero' || variant === 'display' ? 'h1' : variant === 'heading' ? 'h2' : 'p');

  return (
    <Tag
      className={`${variantStyles[variant]} ${sizeStyles[size]} ${weightStyles[weight]} ${className}`}
    >
      {children}
    </Tag>
  );
}







