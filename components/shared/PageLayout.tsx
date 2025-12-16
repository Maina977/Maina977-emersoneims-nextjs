'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import OptimizedImage from '@/components/media/OptimizedImage';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  heroImage?: string;
  className?: string;
}

/**
 * Universal Page Layout Component
 * Ensures consistent structure, fonts, and golden yellow accents across all pages
 */
export default function PageLayout({
  children,
  title,
  subtitle,
  heroImage,
  className = '',
}: PageLayoutProps) {
  return (
    <main className={`min-h-screen bg-black text-white ${className}`}>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_50%)]" />
        
        {/* Hero Image Overlay */}
        {heroImage && (
          <div className="absolute inset-0 opacity-20">
            <OptimizedImage
              src={heroImage}
              alt={title}
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
              hollywoodGrading={true}
            />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#fbbf24] via-[#fcd34d] to-[#fbbf24] bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Decorative Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent" />
      </section>

      {/* Page Content */}
      <div className="relative z-10">
        {children}
      </div>
    </main>
  );
}







