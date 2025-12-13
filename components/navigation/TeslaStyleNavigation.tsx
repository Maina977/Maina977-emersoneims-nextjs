'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TeslaStyleNavigationProps {
  activeSection?: string;
}

// Tesla-style: Product-first navigation
const PRODUCTS = [
  { href: '/generators', label: 'Generators', tag: 'Power' },
  { href: '/solar', label: 'Solar', tag: 'Renewable' },
  { href: '/diagnostics', label: 'Diagnostics', tag: 'Intelligent' },
];

const COMPANY = [
  { href: '/about-us', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function TeslaStyleNavigation({
  activeSection = 'hero',
}: TeslaStyleNavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              className="text-lg font-display font-semibold text-white tracking-tight"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              EMERSON
            </motion.div>
          </Link>

          {/* Desktop Navigation - Product First */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Products Section */}
            <div className="flex items-center gap-1 mr-8">
              {PRODUCTS.map((product) => (
                <Link
                  key={product.href}
                  href={product.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive(product.href)
                      ? 'text-white'
                      : 'text-text-secondary hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{product.label}</span>
                  {isActive(product.href) && (
                    <motion.div
                      className="absolute inset-0 bg-white/5 rounded-lg"
                      layoutId="activeTab"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Separator */}
            <div className="w-px h-6 bg-white/10 mx-4" />

            {/* Company Section */}
            <div className="flex items-center gap-1">
              {COMPANY.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-white'
                      : 'text-text-secondary hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden text-text-secondary hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-6 space-y-1"
            >
              <div className="text-xs text-text-tertiary uppercase tracking-wider mb-3 px-2">
                Products
              </div>
              {PRODUCTS.map((product) => (
                <Link
                  key={product.href}
                  href={product.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-colors ${
                    isActive(product.href)
                      ? 'bg-white/10 text-white'
                      : 'text-text-secondary hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{product.label}</span>
                    <span className="text-xs text-text-tertiary">{product.tag}</span>
                  </div>
                </Link>
              ))}
              <div className="text-xs text-text-tertiary uppercase tracking-wider mt-6 mb-3 px-2">
                Company
              </div>
              {COMPANY.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-white/10 text-white'
                      : 'text-text-secondary hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

