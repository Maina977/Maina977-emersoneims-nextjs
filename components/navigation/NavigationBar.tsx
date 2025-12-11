'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about-us', label: 'About Us' },
    { href: '/service', label: 'Services' },
    { href: '/solution', label: 'Solutions' },
    { href: '/solar', label: 'Solar' },
    { href: '/generators', label: 'Generator' },
    { href: '/diagnostics', label: 'Diagnostics' },
    { href: '/contact', label: 'Contact Us' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
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
          <Link href="/">
            <motion.div
              className="text-xl font-display font-bold text-amber-500 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              EMERSON EIMS
            </motion.div>
          </Link>

          {/* Desktop Navigation - Premium Micro-interactions */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-sm font-medium transition-all duration-300 ease-out group ${
                  isActive(item.href)
                    ? 'text-amber-400'
                    : 'text-gray-400 hover:text-amber-300'
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                {/* Underline animation - Apple/Nike level */}
                <span 
                  className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500 ease-out ${
                    isActive(item.href) 
                      ? 'w-full opacity-100' 
                      : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                  }`}
                />
                {/* Glow effect on hover */}
                <span 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300 bg-gradient-to-r from-amber-400 to-amber-600"
                />
              </Link>
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
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block w-full text-left px-4 py-2 rounded transition-colors ${
                    isActive(item.href)
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-amber-300'
                  }`}
                >
                  {item.label}
                </Link>
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



