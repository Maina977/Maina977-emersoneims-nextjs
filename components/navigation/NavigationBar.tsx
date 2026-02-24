'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface DropdownItem {
  label: string;
  href: string;
  description?: string;
  icon?: string;
  badge?: string;
}

interface NavItem {
  id: string;
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', href: '/' },
    {
      id: 'services',
      label: 'Services',
      dropdown: [
        { label: 'All Services', href: '/services', description: 'View all our services', icon: '🔧' },
        { label: 'Universal Maintenance Hub', href: '/maintenance-hub', description: 'Complete maintenance center for all equipment', icon: '🛠️', badge: 'NEW' },
        { label: 'Generator Services', href: '/solutions/generators', description: 'Installation, repair & maintenance', icon: '⚡' },
        { label: 'Motor Rewinding', href: '/solutions/motor-rewinding', description: 'Professional motor services', icon: '🔄' },
        { label: 'UPS Systems', href: '/solutions/ups', description: 'Backup power solutions', icon: '🔋' },
        { label: 'Borehole Pumps', href: '/solutions/borehole-pumps', description: 'Water pumping systems', icon: '💧' },
        { label: 'AC & Refrigeration', href: '/solutions/ac', description: 'Cooling systems', icon: '❄️' },
        { label: 'Controls & Automation', href: '/solutions/controls', description: 'Industrial automation', icon: '🎛️' },
      ]
    },
    {
      id: 'solar',
      label: 'Solar',
      dropdown: [
        { label: 'Solar Solutions', href: '/solutions/solar', description: 'Complete solar power systems', icon: '☀️' },
        { label: 'Solar Maintenance Hub', href: '/maintenance-hub/solar', description: 'Complete solar maintenance center with weather, sizing, troubleshooting', icon: '🔆', badge: 'COMPREHENSIVE' },
        { label: 'Solar Sizing Calculator', href: '/solutions/solar-sizing', description: 'Calculate your solar system needs', icon: '📐' },
      ]
    },
    {
      id: 'generator-oracle',
      label: 'Generator Oracle',
      dropdown: [
        { label: 'Generator Oracle', href: '/generator-oracle', description: 'Complete diagnostic suite with 400,000+ fault codes, simulator, wiring diagrams', icon: '🔮', badge: 'AI-POWERED' },
        { label: 'Africa Landing', href: '/generator-oracle/africa', description: 'Optimized for African technicians', icon: '🌍' },
        { label: 'Fault Code Lookup', href: '/fault-code-lookup', description: 'Quick error code search', icon: '🔍' },
        { label: 'Diagnostic Suite', href: '/diagnostic-suite', description: 'Full diagnostic experience', icon: '📊' },
      ]
    },
    {
      id: 'generators',
      label: 'Generators',
      dropdown: [
        { label: 'Generator Sales', href: '/generators', description: 'New & used generators', icon: '🏭' },
        { label: 'Spare Parts', href: '/generators/spare-parts', description: '1,560+ genuine parts', icon: '🔩' },
        { label: 'Maintenance', href: '/generators/maintenance', description: 'Service & repair', icon: '🔧' },
        { label: 'Installation', href: '/generators/installation', description: 'Professional installation', icon: '📦' },
        { label: 'Rental', href: '/generators/rental', description: 'Short & long term rental', icon: '📋' },
        { label: 'Generator Maintenance Hub', href: '/maintenance-hub/general', description: 'Complete generator maintenance center', icon: '🛠️' },
      ]
    },
    { id: 'calculators', label: 'Calculators', href: '/calculators' },
    { id: 'innovations', label: 'Innovations', href: '/innovations' },
    { id: 'case-studies', label: 'Case Studies', href: '/case-studies' },
    { id: 'contact', label: 'Contact', href: '/contact' },
  ];

  const handleDropdownToggle = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-xl'
          : 'bg-gradient-to-b from-gray-900/90 to-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              EMERSON EIMS
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
            {navItems.map((item) => (
              <div key={item.id} className="relative">
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => handleDropdownToggle(item.id)}
                      className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                        openDropdown === item.id || activeSection === item.id
                          ? 'text-amber-400 bg-amber-500/10'
                          : 'text-gray-300 hover:text-amber-300 hover:bg-gray-800/50'
                      }`}
                    >
                      {item.label}
                      <svg
                        className={`w-4 h-4 transition-transform ${openDropdown === item.id ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {openDropdown === item.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-72 bg-gray-900/98 backdrop-blur-xl rounded-xl border border-gray-700 shadow-2xl overflow-hidden z-50"
                        >
                          <div className="p-2">
                            {item.dropdown.map((dropItem, idx) => (
                              <Link
                                key={idx}
                                href={dropItem.href}
                                onClick={() => setOpenDropdown(null)}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800/70 transition-colors group"
                              >
                                <span className="text-2xl">{dropItem.icon}</span>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-white font-medium group-hover:text-amber-400 transition-colors">
                                      {dropItem.label}
                                    </span>
                                    {dropItem.badge && (
                                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 rounded-full">
                                        {dropItem.badge}
                                      </span>
                                    )}
                                  </div>
                                  {dropItem.description && (
                                    <p className="text-xs text-gray-400 mt-0.5">{dropItem.description}</p>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href={item.href || '/'}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === item.id
                        ? 'text-amber-400 bg-amber-500/10'
                        : 'text-gray-300 hover:text-amber-300 hover:bg-gray-800/50'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Theme Toggle */}
            {onThemeToggle && (
              <button
                onClick={onThemeToggle}
                className="ml-2 px-3 py-2 text-xs font-mono border border-gray-700 rounded-lg hover:border-amber-500 transition-colors text-gray-300 hover:text-amber-400"
                aria-label="Toggle theme"
              >
                THEME
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-400 hover:text-amber-400 p-2"
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 pb-4 space-y-2 max-h-[80vh] overflow-y-auto"
            >
              {navItems.map((item) => (
                <div key={item.id}>
                  {item.dropdown ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => handleDropdownToggle(item.id)}
                        className="flex items-center justify-between w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-800/50 rounded-lg"
                      >
                        <span className="font-medium">{item.label}</span>
                        <svg
                          className={`w-4 h-4 transition-transform ${openDropdown === item.id ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      <AnimatePresence>
                        {openDropdown === item.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 space-y-1"
                          >
                            {item.dropdown.map((dropItem, idx) => (
                              <Link
                                key={idx}
                                href={dropItem.href}
                                onClick={() => {
                                  setOpenDropdown(null);
                                  setIsMobileMenuOpen(false);
                                }}
                                className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-amber-400 hover:bg-gray-800/30 rounded-lg"
                              >
                                <span>{dropItem.icon}</span>
                                <div>
                                  <span className="text-sm">{dropItem.label}</span>
                                  {dropItem.badge && (
                                    <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 rounded-full">
                                      {dropItem.badge}
                                    </span>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href || '/'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-gray-300 hover:text-amber-400 hover:bg-gray-800/50 rounded-lg font-medium"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              {onThemeToggle && (
                <button
                  onClick={onThemeToggle}
                  className="w-full px-4 py-3 text-left text-gray-400 hover:bg-gray-800/50 hover:text-amber-300 rounded-lg"
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
