'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface NavigationBarProps {
  activeSection?: string;
  onThemeToggle?: () => void;
}

export default function NavigationBar({ 
  activeSection = 'hero',
  onThemeToggle 
}: NavigationBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home', href: '/' },
    { id: 'fault-lookup', label: 'Fault Code Lookup', href: '/fault-code-lookup' },
    { id: 'diagnostic', label: 'Generator Diagnostics', href: '/diagnostic-suite' },
    { id: 'cases', label: 'Case Studies', href: '/case-studies' },
    { id: 'calculators', label: 'Calculators', href: '/calculators' },
    { id: 'innovations', label: 'Innovations', href: '/innovations' },
    { id: 'services', label: 'Services', href: '/#services' },
    { id: 'contact', label: 'Contact', href: '/contact' },
  ];

  const navigateToSection = (item: { id: string; href?: string }) => {
    if (item.href) {
      window.location.href = item.href;
    } else {
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-5vw py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="text-xl font-bold text-amber-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            EMERSON EIMS
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              item.href ? (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'text-amber-400'
                      : 'text-gray-400 hover:text-amber-300'
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={() => navigateToSection(item)}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'text-amber-400'
                      : 'text-gray-400 hover:text-amber-300'
                  }`}
                >
                  {item.label}
                </button>
              )
            ))}

            {/* Theme Toggle */}
            {onThemeToggle && (
              <button
                onClick={onThemeToggle}
                className="px-4 py-2 text-xs font-mono border border-gray-700 rounded hover:border-amber-500 transition-colors text-gray-300 hover:text-amber-400"
                aria-label="Toggle theme"
              >
                THEME
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-400 hover:text-amber-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4 space-y-2"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateToSection(item)}
                  className={`block w-full text-left px-4 py-2 rounded transition-colors ${
                    activeSection === item.id
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-amber-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {onThemeToggle && (
                <button
                  onClick={onThemeToggle}
                  className="block w-full text-left px-4 py-2 rounded text-gray-400 hover:bg-gray-800 hover:text-amber-300 transition-colors"
                >
                  Toggle Theme
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

