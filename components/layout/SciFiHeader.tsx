'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Awwwards-Winning Sci-Fi Header
 * Features: Holographic effects, animated grid, OKLCH colors, React Spring animations
 */

const NAV_ITEMS = [
  { href: '/', label: 'HOME' },
  { href: '/about-us', label: 'ABOUT US' },
  { href: '/service', label: 'SERVICES' },
  { href: '/solution', label: 'SOLUTIONS' },
  { href: '/generators', label: 'GENERATOR' },
  { href: '/solar', label: 'SOLAR' },
  { href: '/diagnostics', label: 'DIAGNOSTICS' },
  { href: '/diagnostic-suite', label: 'DIAGNOSTIC SUITE' },
  { href: '/contact', label: 'CONTACT' },
];

export default function SciFiHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 20]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <motion.header
      style={{
        background: isScrolled ? 'oklch(0 0 0 / 0.98)' : 'oklch(0 0 0 / 0.9)',
        backdropFilter: isScrolled ? 'blur(20px)' : 'blur(10px)',
        opacity: headerOpacity,
        boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.5)' : '0 2px 10px rgba(0, 0, 0, 0.3)',
      }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-cyan-500/30"
    >
      {/* Holographic Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(oklch(0.75 0.20 200 / 0.1) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.75 0.20 200 / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          animation: 'grid-move 20s linear infinite',
        }}
      />

      {/* Glowing Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_oklch(0.75_0.20_200)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center font-bold text-black text-xl group-hover:shadow-[0_0_20px_oklch(0.75_0.20_200)] transition-all">
                  E
                </div>
                <div className="absolute inset-0 rounded-lg bg-cyan-400/20 blur-xl group-hover:blur-2xl transition-all" />
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-bold font-mono text-cyan-300 tracking-wider">
                  EMERSON<span className="text-cyan-500">EIMS</span>
                </div>
                <div className="text-xs text-cyan-400/60 font-mono">ENERGY SYSTEMS</div>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <motion.div
                  key={item.href}
                  onHoverStart={() => setActiveHover(item.href)}
                  onHoverEnd={() => setActiveHover(null)}
                  className="relative"
                >
                  <Link
                    href={item.href}
                    className={`relative px-4 py-2 text-sm font-mono font-semibold transition-all ${
                      active
                        ? 'text-cyan-300'
                        : 'text-gray-400 hover:text-cyan-300'
                    }`}
                  >
                    {item.label}
                    {active && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-cyan-600"
                        layoutId="activeIndicator"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                  
                  {/* Hover Glow Effect */}
                  <AnimatePresence>
                    {activeHover === item.href && !active && (
                      <motion.div
                        className="absolute inset-0 bg-cyan-500/10 rounded blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-cyan-300 hover:text-cyan-400 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
              <motion.span
                className="h-0.5 bg-cyan-400 rounded"
                animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              />
              <motion.span
                className="h-0.5 bg-cyan-400 rounded"
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              />
              <motion.span
                className="h-0.5 bg-cyan-400 rounded"
                animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-cyan-500/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <nav className="px-4 py-6 space-y-2">
              {NAV_ITEMS.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg font-mono text-sm transition-all ${
                        active
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                          : 'text-gray-400 hover:bg-cyan-500/10 hover:text-cyan-300'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanning Line Effect */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: 'linear',
        }}
      />
    </motion.header>
  );
}


