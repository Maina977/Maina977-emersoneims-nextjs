'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import language switcher (client-only)
const LanguageSwitcher = dynamic(
  () => import('@/components/shared/LanguageSwitcher'),
  { ssr: false }
);

interface TeslaStyleNavigationProps {
  activeSection?: string;
}

// Mega Menu Data
const MEGA_MENUS = {
  generators: {
    title: 'Generator Solutions',
    description: 'Complete power solutions from sales to maintenance',
    sections: [
      {
        title: 'Products',
        items: [
          { href: '/generators', label: 'All Generators', icon: '⚡', desc: 'Browse our range' },
          { href: '/generators/used', label: 'Used Generators', icon: '♻️', desc: 'Quality pre-owned' },
        ],
      },
      {
        title: 'Services',
        items: [
          { href: '/generators/installation', label: 'Installation', icon: '🔧', desc: '8-phase professional setup' },
          { href: '/generators/maintenance', label: 'Maintenance', icon: '🛠️', desc: '32 common issues solved' },
          { href: '/generators/rental', label: 'Rental', icon: '📦', desc: '7.5kVA to 2MVA' },
        ],
      },
      {
        title: 'Support',
        items: [
          { href: '/generators/spare-parts', label: 'Spare Parts', icon: '🔩', desc: 'Genuine & OEM parts' },
          { href: '/fault-code-lookup', label: 'Fault Codes', icon: '🔍', desc: 'Troubleshooting guide' },
          { href: '/generators/case-studies', label: 'Case Studies', icon: '📋', desc: 'Success stories' },
        ],
      },
    ],
    cta: { href: '/contact', label: 'Get a Quote', phone: '0768 860 655' },
  },
  solar: {
    title: 'Solar Solutions',
    description: 'Clean energy for homes, businesses & industries',
    sections: [
      {
        title: 'Systems',
        items: [
          { href: '/solar', label: 'Solar Overview', icon: '☀️', desc: 'Complete solutions' },
          { href: '/solutions/solar', label: 'Commercial Solar', icon: '🏢', desc: 'Business & industrial' },
          { href: '/solutions/solar-sizing', label: 'System Sizing', icon: '📐', desc: 'Calculate your needs' },
        ],
      },
      {
        title: 'Coverage',
        items: [
          { href: '/counties', label: '47 Counties', icon: '📍', desc: 'Nationwide coverage' },
          { href: '/solar#calculator', label: 'ROI Calculator', icon: '💰', desc: 'See your savings' },
        ],
      },
    ],
    cta: { href: '/contact', label: 'Free Consultation', phone: '0782 914 717' },
  },
  diagnostics: {
    title: 'Diagnostic Tools',
    description: 'Advanced diagnostic systems for power equipment',
    sections: [
      {
        title: 'Diagnostic Tools',
        items: [
          { href: '/diagnostics', label: '9-Service Diagnostic', icon: '🔬', desc: 'Comprehensive service check' },
          { href: '/diagnostic-suite', label: 'Generator Diagnostic', icon: '⚡', desc: 'Real-time monitoring' },
          { href: '/troubleshooting', label: 'Troubleshooting Wizard', icon: '🧙', desc: 'Interactive problem solver' },
          { href: '/diagnostic-cockpit', label: 'Diagnostic Cockpit', icon: '🎛️', desc: 'Advanced control panel' },
        ],
      },
      {
        title: 'Support Tools',
        items: [
          { href: '/fault-code-lookup', label: 'Fault Code Lookup', icon: '🔍', desc: 'Error code database' },
          { href: '/knowledge-base', label: 'Knowledge Base', icon: '📚', desc: 'Guides & tutorials' },
          { href: '/faq', label: 'FAQ', icon: '❓', desc: 'Common questions answered' },
        ],
      },
    ],
    cta: { href: '/contact', label: 'Get Support', phone: '0768 860 655' },
  },
  services: {
    title: 'Our Services',
    description: 'Complete power and electrical solutions',
    sections: [
      {
        title: 'Power Solutions',
        items: [
          { href: '/solutions/generators', label: 'Generator Services', icon: '⚡', desc: 'Sales & maintenance' },
          { href: '/solutions/ups', label: 'UPS Systems', icon: '🔋', desc: 'Backup power' },
          { href: '/solutions/controls', label: 'Control Systems', icon: '🎛️', desc: 'Automation & controls' },
        ],
      },
      {
        title: 'Electrical Services',
        items: [
          { href: '/solutions/motor-rewinding', label: 'Motor Rewinding', icon: '🔄', desc: 'Motor repair' },
          { href: '/solutions/borehole-pumps', label: 'Borehole Pumps', icon: '💧', desc: 'Water solutions' },
          { href: '/fabrication', label: 'Fabrication', icon: '🏭', desc: 'Custom builds' },
        ],
      },
      {
        title: 'Customer Support',
        items: [
          { href: '/booking', label: 'Book a Service', icon: '📅', desc: 'Schedule appointment' },
          { href: '/gallery', label: 'Project Gallery', icon: '🖼️', desc: 'Our completed work' },
          { href: '/case-studies', label: 'Case Studies', icon: '📋', desc: 'Success stories' },
        ],
      },
    ],
    cta: { href: '/booking', label: 'Book Now', phone: '0782 914 717' },
  },
};

// Complete Navigation - Enhanced with Mega Menus - ALL PAGES VISIBLE
const NAV_ITEMS = [
  { href: '/', label: 'HOME', type: 'link' },
  { href: '/about-us', label: 'ABOUT', type: 'link' },
  { key: 'generators', label: 'GENERATORS', type: 'mega' },
  { key: 'solar', label: 'SOLAR', type: 'mega' },
  { href: '/solutions', label: 'SOLUTIONS', type: 'link' },
  { key: 'services', label: 'SERVICES', type: 'mega' },
  { href: '/brands', label: 'BRANDS', type: 'link' },
  { key: 'diagnostics', label: '🔬 DIAGNOSTICS', type: 'mega', highlight: true },
  { href: '/gallery', label: 'GALLERY', type: 'link' },
  { href: '/contact', label: 'CONTACT', type: 'link' },
];

export default function TeslaStyleNavigation({
  activeSection = 'hero',
}: TeslaStyleNavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const megaTimeout = useRef<NodeJS.Timeout | null>(null);
  const mobileMenuId = 'tesla-primary-mobile-menu';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      if (activeMega) setActiveMega(null);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeMega]);

  // Close menu on Escape + prevent background scroll while open
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setActiveMega(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  const handleMegaEnter = (key: string) => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setActiveMega(key);
  };

  const handleMegaLeave = () => {
    megaTimeout.current = setTimeout(() => setActiveMega(null), 150);
  };

  return (
    <>
      <nav
        data-active-section={activeSection}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20'
            : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              aria-label="Emerson EiMS home"
              className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 group"
            >
              <div className="relative flex items-center gap-3 cursor-pointer transition-all duration-500 group-hover:scale-[1.02]">
                <div className="absolute -inset-3 bg-gradient-to-r from-amber-500/40 via-amber-400/50 to-amber-500/40 blur-2xl opacity-70 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
                
                <div className="relative">
                  <div className="absolute -inset-[2px] bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative bg-white rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 shadow-2xl shadow-amber-500/30 group-hover:shadow-amber-400/50 transition-all duration-500">
                    <Image
                      src="/images/Emerson EIMS Logo and Tagline PNG-Picsart-BackgroundRemover.png"
                      alt="EmersonEIMS - Kenya's #1 Power Solutions"
                      width={320}
                      height={80}
                      priority
                      sizes="(max-width: 768px) 200px, 320px"
                      className="h-12 sm:h-16 lg:h-20 w-full object-contain"
                    />
                  </div>
                </div>
                
                <div className="hidden lg:flex flex-col -space-y-0.5">
                  <span className="text-[10px] font-black tracking-wider bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 bg-clip-text text-transparent uppercase">
                    Reliable Power
                  </span>
                  <span className="text-[10px] font-black tracking-wider bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-300 bg-clip-text text-transparent uppercase">
                    Without Limits
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) =>
                item.type === 'mega' && item.key ? (
                  <div
                    key={item.key}
                    className="relative"
                    onMouseEnter={() => handleMegaEnter(item.key!)}
                    onMouseLeave={handleMegaLeave}
                  >
                    <button
                      className={`px-3 py-2 text-[11px] font-semibold transition-all duration-300 rounded-lg flex items-center gap-1 ${
                        item.highlight 
                          ? activeMega === item.key
                            ? 'text-amber-300 bg-amber-500/20 border border-amber-400/50'
                            : 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/30'
                          : activeMega === item.key
                            ? 'text-amber-400 bg-amber-500/10'
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item.label}
                      <svg
                        className={`w-3 h-3 transition-transform duration-300 ${activeMega === item.key ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href!}
                    className={`px-3 py-2 text-[11px] font-semibold transition-all duration-300 whitespace-nowrap rounded-lg ${
                      item.highlight
                        ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/30'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
              
              <div className="ml-2 pl-2 border-l border-white/10">
                <LanguageSwitcher />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden relative p-2 text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls={mobileMenuId}
            >
              <motion.div
                animate={isMenuOpen ? 'open' : 'closed'}
                className="w-6 h-6 flex flex-col justify-center items-center"
              >
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 6 },
                  }}
                  className="w-5 h-0.5 bg-current block mb-1.5 origin-center transition-all"
                />
                <motion.span
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                  }}
                  className="w-5 h-0.5 bg-current block mb-1.5"
                />
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -6 },
                  }}
                  className="w-5 h-0.5 bg-current block origin-center transition-all"
                />
              </motion.div>
            </button>
          </div>
        </div>

        {/* Mega Menu Dropdowns */}
        <AnimatePresence>
          {activeMega && MEGA_MENUS[activeMega as keyof typeof MEGA_MENUS] && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 bg-gray-900/98 backdrop-blur-xl border-b border-white/10 shadow-2xl"
              onMouseEnter={() => handleMegaEnter(activeMega)}
              onMouseLeave={handleMegaLeave}
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
                {(() => {
                  const menu = MEGA_MENUS[activeMega as keyof typeof MEGA_MENUS];
                  return (
                    <div className="grid lg:grid-cols-4 gap-8">
                      {/* Menu Sections */}
                      {menu.sections.map((section) => (
                        <div key={section.title}>
                          <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-4">
                            {section.title}
                          </h3>
                          <ul className="space-y-2">
                            {section.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-300"
                                  onClick={() => setActiveMega(null)}
                                >
                                  <span className="text-2xl">{item.icon}</span>
                                  <div>
                                    <div className="font-semibold text-white group-hover:text-amber-400 transition-colors">
                                      {item.label}
                                    </div>
                                    <div className="text-xs text-white/50">{item.desc}</div>
                                  </div>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      
                      {/* CTA Section */}
                      <div className="lg:border-l lg:border-white/10 lg:pl-8">
                        <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-4">
                          Get Started
                        </h3>
                        <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-2xl p-6 border border-amber-500/20">
                          <h4 className="text-lg font-bold text-white mb-2">{menu.title}</h4>
                          <p className="text-sm text-white/70 mb-4">{menu.description}</p>
                          <Link
                            href={menu.cta.href}
                            className="block w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold rounded-xl text-center hover:from-amber-500 hover:to-amber-600 transition-all transform hover:scale-[1.02] shadow-lg shadow-amber-500/30"
                            onClick={() => setActiveMega(null)}
                          >
                            {menu.cta.label}
                          </Link>
                          <a
                            href={`tel:${menu.cta.phone.replace(/\s/g, '')}`}
                            className="block mt-3 text-center text-amber-400 hover:text-amber-300 transition-colors"
                          >
                            📞 {menu.cta.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              id={mobileMenuId}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-gray-900 z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Mobile Header */}
                <div className="flex items-center justify-between mb-8">
                  <span className="text-lg font-bold text-white">Menu</span>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Mobile Nav Items */}
                <nav className="space-y-2">
                  {NAV_ITEMS.map((item) =>
                    item.type === 'mega' && item.key ? (
                      <div key={item.key}>
                        <button
                          onClick={() => setMobileSubmenu(mobileSubmenu === item.key ? null : item.key!)}
                          className="w-full flex items-center justify-between px-4 py-3 text-white/80 hover:text-white rounded-xl hover:bg-white/5 transition-all"
                        >
                          <span className="font-semibold">{item.label}</span>
                          <motion.svg
                            animate={{ rotate: mobileSubmenu === item.key ? 180 : 0 }}
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </motion.svg>
                        </button>
                        
                        <AnimatePresence>
                          {mobileSubmenu === item.key && MEGA_MENUS[item.key as keyof typeof MEGA_MENUS] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 py-2 space-y-1">
                                {MEGA_MENUS[item.key as keyof typeof MEGA_MENUS].sections.map((section) =>
                                  section.items.map((subItem) => (
                                    <Link
                                      key={subItem.href}
                                      href={subItem.href}
                                      onClick={() => setIsMenuOpen(false)}
                                      className="flex items-center gap-3 px-4 py-2.5 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                                    >
                                      <span className="text-lg">{subItem.icon}</span>
                                      <span className="text-sm">{subItem.label}</span>
                                    </Link>
                                  ))
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href!}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-4 py-3 rounded-xl transition-all ${
                          item.highlight
                            ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30 font-semibold'
                            : 'text-white/80 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {item.label}
                      </Link>
                    )
                  )}
                </nav>

                {/* Mobile CTA */}
                <div className="mt-8 p-4 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-2xl border border-amber-500/20">
                  <h4 className="font-bold text-white mb-2">Need Help?</h4>
                  <p className="text-sm text-white/60 mb-4">Call us for immediate assistance</p>
                  <a
                    href="tel:0768860655"
                    className="block w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold rounded-xl text-center"
                  >
                    📞 0768 860 655
                  </a>
                </div>

                {/* Mobile Language */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <LanguageSwitcher />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}



