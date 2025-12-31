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

// Complete Navigation - All 9 Pages
const NAV_ITEMS = [
  { href: '/', label: 'HOME' },
  { href: '/about-us', label: 'ABOUT US' },
  { href: '/service', label: 'SERVICES' },
  { href: '/solution', label: 'SOLUTIONS' },
  { href: '/generators', label: 'GENERATORS' },
  { href: '/solar', label: 'SOLAR' },
  { href: '/brands', label: 'BRANDS' },
  { href: '/diagnostics', label: 'UNIVERSAL DIAGNOSTICS' },
  { href: '/diagnostic-suite', label: 'GENERATOR DIAGNOSTICS' },
  { href: '/contact', label: 'CONTACT US' },
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
          {/* Logo */}
          <Link
            href="/"
            aria-label="Emerson EiMS home"
            className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <div className="flex items-center gap-3 cursor-pointer transition-transform active:scale-[0.98] hover:scale-[1.02]">
              <Image
                src="/images/logo-tagline.png"
                alt="Emerson EIMS Logo"
                width={180}
                height={45}
                priority
                sizes="(max-width: 768px) 140px, 180px"
                className="h-9 w-auto object-contain"
              />
              <span className="text-[10px] sm:text-xs font-semibold text-white/80 leading-tight max-w-[150px] sm:max-w-none">
                Reliable Power. Without Limits.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - All 9 Pages */}
          <div className="hidden lg:flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3 py-2 text-xs font-medium transition-all duration-300 whitespace-nowrap text-white/70 hover:text-white rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            id={mobileMenuId}
            className="lg:hidden mt-6 space-y-1 max-h-[80vh] overflow-y-auto"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 rounded-lg transition-colors text-text-secondary hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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



