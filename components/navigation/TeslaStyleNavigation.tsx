'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamically import language switcher (client-only)
const LanguageSwitcher = dynamic(
  () => import('@/components/shared/LanguageSwitcher'),
  { ssr: false }
);

interface TeslaStyleNavigationProps {
  activeSection?: string;
}

// Complete Navigation - All Main Pages with Clear Diagnostics
const NAV_ITEMS = [
  { href: '/', label: 'HOME' },
  { href: '/about-us', label: 'ABOUT US' },
  { href: '/service', label: 'SERVICES' },
  { href: '/solutions', label: 'SOLUTIONS' },
  { href: '/generators', label: 'GENERATORS' },
  { href: '/solar', label: 'SOLAR' },
  { href: '/brands', label: 'BRANDS' },
  { href: '/diagnostics', label: '🔬 9-SERVICE DIAGNOSTIC', highlight: true },
  { href: '/diagnostic-suite', label: '⚡ GENERATOR DIAGNOSTIC', highlight: true },
  { href: '/contact', label: 'CONTACT' },
];

export default function TeslaStyleNavigation({
  activeSection = 'hero',
}: TeslaStyleNavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuId = 'tesla-primary-mobile-menu';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on Escape + prevent background scroll while open
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isMenuOpen) return;
      if (e.key === 'Escape') setIsMenuOpen(false);
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

  return (
    <nav
      data-active-section={activeSection}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          {/* ═══════════════════════════════════════════════════════════════
              SIGNATURE LOGO - EmersonEIMS Brand Identity
              Premium visibility, unmistakable presence
              ═══════════════════════════════════════════════════════════════ */}
          <Link
            href="/"
            aria-label="Emerson EiMS home"
            className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black group"
          >
            <div className="relative flex items-center gap-3 cursor-pointer transition-all duration-500 group-hover:scale-[1.02]">
              {/* SIGNATURE GLOW - Triple layer for maximum impact */}
              <div className="absolute -inset-3 bg-gradient-to-r from-amber-500/40 via-amber-400/50 to-amber-500/40 blur-2xl opacity-70 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 via-transparent to-cyan-500/20 blur-xl opacity-50 group-hover:opacity-80 transition-all duration-500"></div>
              
              {/* LOGO CONTAINER - Premium frame with golden accent */}
              <div className="relative">
                {/* Golden border glow */}
                <div className="absolute -inset-[2px] bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* White background for logo visibility */}
                <div className="relative bg-white rounded-xl px-4 py-2.5 shadow-2xl shadow-amber-500/30 group-hover:shadow-amber-400/50 transition-all duration-500">
                  <Image
                    src="/images/logo-tagline.png"
                    alt="EmersonEIMS - Kenya's #1 Power Solutions"
                    width={180}
                    height={50}
                    priority
                    sizes="(max-width: 768px) 140px, 180px"
                    className="h-10 sm:h-12 w-auto object-contain"
                  />
                </div>
              </div>
              
              {/* SIGNATURE TAGLINE - Premium gradient text */}
              <div className="hidden md:flex flex-col -space-y-0.5">
                <span className="text-[11px] font-black tracking-wider bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 bg-clip-text text-transparent uppercase">
                  Reliable Power
                </span>
                <span className="text-[11px] font-black tracking-wider bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-300 bg-clip-text text-transparent uppercase">
                  Without Limits
                </span>
                <span className="text-[8px] text-white/40 tracking-widest mt-1">
                  KENYA&apos;S #1 POWER SOLUTIONS
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Clean with Highlighted Diagnostics */}
          <div className="hidden lg:flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-2.5 py-2 text-[11px] font-semibold transition-all duration-300 whitespace-nowrap rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 ${
                  'highlight' in item && item.highlight
                    ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/30 hover:border-amber-400/50'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
            
            {/* Language Switcher */}
            <div className="ml-2 pl-2 border-l border-white/10">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden text-text-secondary hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls={mobileMenuId}
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

        {/* Mobile Menu - Enhanced with Highlighted Diagnostics */}
        {isMenuOpen && (
          <div
            id={mobileMenuId}
            className="lg:hidden mt-6 space-y-1 max-h-[80vh] overflow-y-auto pb-6"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 ${
                  'highlight' in item && item.highlight
                    ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30 font-semibold'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Language Switcher */}
            <div className="px-4 py-3 border-t border-white/10 mt-4">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}



