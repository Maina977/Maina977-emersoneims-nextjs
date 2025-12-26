'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  submenu?: { href: string; label: string }[];
}

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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();
  const submenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apple-style consolidated navigation (5-6 items max)
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/service', label: 'Solutions', submenu: [
      { href: '/generators', label: 'Generators' },
      { href: '/solar', label: 'Solar Energy' },
      { href: '/diagnostics', label: 'Diagnostics' }
    ]},
    { href: '/about-us', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
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
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-12 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Image
                src="/logo.svg"
                alt="EmersonEIMS Logo"
                width={40}
                height={40}
                priority
              />
              <div className="text-lg font-display font-semibold text-white tracking-tight">
                EMERSON
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation - Apple-style minimal (5-6 items) */}
          <div className="hidden md:flex items-center gap-12">
            {navItems.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => item.submenu && setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  href={item.href}
                  aria-label={`Navigate to ${item.label} page`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  aria-haspopup={item.submenu ? 'true' : undefined}
                  className={`relative text-sm font-medium transition-all duration-300 ease-out group ${
                    isActive(item.href)
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {/* Minimal underline - Apple style */}
                  <span 
                    className={`absolute bottom-0 left-0 h-[1px] bg-white transition-all duration-500 ease-out ${
                      isActive(item.href) 
                        ? 'w-full opacity-100' 
                        : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                    }`}
                  />
                </Link>
                
                {/* Submenu dropdown - Premium animation */}
                {item.submenu && (
                  <AnimatePresence>
                    {hoveredItem === item.href && (
                      <motion.div
                        ref={submenuRef}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-black/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl py-2 z-50"
                      >
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}

            {/* Theme Toggle */}
            {onThemeToggle && (
              <button
                onClick={onThemeToggle}
                type="button"
                className="px-3 py-1.5 text-xs font-mono border border-white/20 rounded hover:border-white/40 transition-colors text-gray-400 hover:text-white"
                aria-label="Toggle theme between engineering and high contrast modes"
              >
                THEME
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
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
              className="md:hidden mt-6 space-y-1"
            >
              {navItems.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label={`Navigate to ${item.label} page`}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-white/10 text-text-primary'
                        : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                    }`}
                  >
                    {item.label}
                  </Link>
                  {/* Mobile Submenu */}
                  {item.submenu && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-text-tertiary hover:text-text-primary transition-colors"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {onThemeToggle && (
                <button
                  type="button"
                  onClick={onThemeToggle}
                  className="block w-full text-left px-4 py-3 rounded-lg text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors"
                  aria-label="Toggle theme between engineering and high contrast modes"
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




