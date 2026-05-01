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

const HEAVY_APP_ROUTES = new Set<string>([
  '/aquascan-pro-v3',
  '/solar-genius-pro',
  '/pro-building-suite',
  '/eims-pro',
  '/diagnostics',
]);

function prefetchForHref(href: string) {
  return !HEAVY_APP_ROUTES.has(href);
}

// ─────────────────────────────────────────────────────────────────────────────
// Mega Menu Data — every section trimmed to a single screen, no duplicates
// across menus. Maintenance Hubs live under SERVICES; AI tools under
// AI POWERHOUSE; case studies / coverage under RESOURCES.
// ─────────────────────────────────────────────────────────────────────────────
const MEGA_MENUS = {
  generators: {
    title: 'Generator Solutions',
    description: 'Sales, service & support — from spec to lifecycle',
    sections: [
      {
        title: 'Buy & Lease',
        items: [
          { href: '/generators', label: 'All Generators', icon: '⚡', desc: 'Full lineup' },
          { href: '/generators/used', label: 'Used Generators', icon: '♻️', desc: 'Certified pre-owned' },
          { href: '/generators/leasing', label: 'Leasing Programs', icon: '💰', desc: 'Flexible terms' },
          { href: '/generators/rental', label: 'Rental', icon: '📦', desc: '7.5kVA – 2MVA' },
          { href: '/brands', label: 'Brands', icon: '🏷️', desc: 'Cummins, Perkins, CAT' },
        ],
      },
      {
        title: 'Service & Parts',
        items: [
          { href: '/generators/installation', label: 'Installation', icon: '🔧', desc: '8-phase setup' },
          { href: '/generators/maintenance', label: 'Maintenance', icon: '🛠️', desc: 'Preventive & repair' },
          { href: '/generators/spare-parts', label: 'Spare Parts', icon: '🔩', desc: 'OEM & aftermarket' },
          { href: '/generator-parts', label: 'Parts Catalog', icon: '📦', desc: '1,560+ SKUs' },
          { href: '/generators/systems', label: 'Systems Guide', icon: '📚', desc: 'Educational hub' },
        ],
      },
      {
        title: 'Diagnostics & AI',
        items: [
          { href: '/generator-oracle', label: 'Generator Oracle™', icon: '🔮', desc: '400k+ fault codes', badge: 'AI' },
          { href: '/maintenance-hub/generators', label: 'Maintenance Hub', icon: '🏭', desc: 'Engine room HQ' },
          { href: '/generators/maintenance-companion', label: 'Repair Companion', icon: '🤖', desc: 'AI step-by-step' },
          { href: '/generator-problems', label: 'Common Problems', icon: '⚠️', desc: 'Diagnose & resolve' },
          { href: '/faults', label: 'Fault Code Library', icon: '📖', desc: '400,000+ codes' },
        ],
      },
    ],
    cta: { href: '/contact', label: 'Get a Quote', phone: '+254 768 860 665' },
  },
  solar: {
    title: 'Solar Solutions',
    description: 'Clean energy for homes, businesses & industries',
    sections: [
      {
        title: 'Systems & Design',
        items: [
          { href: '/solar', label: 'Solar Overview', icon: '☀️', desc: 'Complete solutions' },
          { href: '/solutions/solar', label: 'Commercial Solar', icon: '🏢', desc: 'Business & industrial' },
          { href: '/solar-design-studio', label: 'Design Studio', icon: '🎨', desc: 'Plan your system' },
          { href: '/solutions/solar-sizing', label: 'System Sizing', icon: '📐', desc: 'Right-size every kWh' },
        ],
      },
      {
        title: 'AI & Calculators',
        items: [
          { href: '/solar-genius-pro', label: 'Solar Genius Pro™', icon: '🧠', desc: '56 AI engines · <3 min quotes', badge: '#1' },
          { href: '/solar-genius-pro-tools', label: 'Solar Genius Tools', icon: '🛠️', desc: 'Pro toolkit' },
          { href: '/calculators', label: 'Power Calculators', icon: '🧮', desc: 'ROI, load, payback' },
        ],
      },
      {
        title: 'Service & Coverage',
        items: [
          { href: '/maintenance-hub/solar', label: 'Solar Maintenance Hub', icon: '🔆', desc: 'Diagnostics & repair' },
          { href: '/counties', label: '47 Counties', icon: '📍', desc: 'Nationwide service' },
          { href: '/locations', label: 'Service Locations', icon: '🗺️', desc: 'Find a branch' },
          { href: '/booking', label: 'Book a Site Visit', icon: '📅', desc: 'Schedule today' },
        ],
      },
    ],
    cta: { href: '/contact', label: 'Free Consultation', phone: '+254 782 914 717' },
  },
  aiPowerhouse: {
    title: 'AI Powerhouse',
    description: 'World-class AI tools for engineers and operators',
    sections: [
      {
        title: 'Live Workspaces',
        items: [
          { href: '/eims-pro', label: 'EIMS PRO', icon: '🏛️', desc: 'Live engineering workspace', badge: 'LIVE' },
          { href: '/solutions/building', label: 'Pro Building Suite™', icon: '📐', desc: 'AI architecture, structural & BOQ', badge: 'AI' },
          { href: '/diagnostics', label: 'Diagnostics Hub™', icon: '🔧', desc: '9-service Q&A & telemetry', badge: 'HOT' },
        ],
      },
      {
        title: 'Flagship AI Tools',
        items: [
          { href: '/generator-oracle', label: 'Generator Oracle™', icon: '🔮', desc: '400,000+ fault codes', badge: 'AI' },
          { href: '/solar-genius-pro', label: 'Solar Genius Pro™', icon: '☀️', desc: '56 AI engines · <3 min quotes', badge: '#1' },
          { href: '/aquascan-pro-v3', label: 'AquaScan Pro™', icon: '💧', desc: '26 AI engines · NASA + Google Earth', badge: '#1' },
        ],
      },
      {
        title: 'Hub & Capabilities',
        items: [
          { href: '/ai-tools', label: 'All AI Tools', icon: '🤖', desc: 'Central hub' },
          { href: '/ai-tools/capabilities', label: 'Capabilities Matrix', icon: '📊', desc: 'Accuracy tables', badge: 'NEW' },
          { href: '/troubleshooting', label: 'Troubleshooting Wizard', icon: '🧙', desc: 'Interactive solver' },
          { href: '/generator-oracle/tools', label: 'Oracle Tools', icon: '🧰', desc: 'Pro toolkit' },
        ],
      },
    ],
    cta: { href: '/contact', label: 'Get Started', phone: '+254 768 860 665' },
  },
  services: {
    title: 'Services & Maintenance',
    description: 'Complete power, electrical and mechanical services',
    sections: [
      {
        title: 'Power Solutions',
        items: [
          { href: '/solutions', label: 'All Solutions', icon: '💡', desc: 'View everything' },
          { href: '/solutions/generators', label: 'Generator Services', icon: '⚡', desc: 'Sales & service' },
          { href: '/solutions/ups', label: 'UPS Systems', icon: '🔋', desc: 'Backup power' },
          { href: '/solutions/controls', label: 'Controls & Automation', icon: '🎛️', desc: 'Industrial controls' },
          { href: '/solutions/motor-rewinding', label: 'Motor Rewinding', icon: '🔄', desc: 'Motor repair' },
          { href: '/solutions/borehole-pumps', label: 'Borehole Pumps', icon: '💧', desc: 'Water systems' },
          { href: '/solutions/ac', label: 'AC & Refrigeration', icon: '❄️', desc: 'Cooling' },
          { href: '/fabrication', label: 'Fabrication', icon: '🏭', desc: 'Custom metalwork' },
        ],
      },
      {
        title: 'Maintenance Hubs',
        items: [
          { href: '/maintenance-hub', label: 'Universal Hub', icon: '🛠️', desc: 'All equipment' },
          { href: '/maintenance-hub/generators', label: 'Generators', icon: '⚡', desc: 'Engine room HQ' },
          { href: '/maintenance-hub/solar', label: 'Solar', icon: '☀️', desc: 'PV diagnostics' },
          { href: '/maintenance-hub/motors', label: 'Motors', icon: '🔄', desc: 'Rewinding & service' },
          { href: '/maintenance-hub/hvac', label: 'HVAC', icon: '❄️', desc: 'AC & refrigeration' },
          { href: '/maintenance-hub/electrical', label: 'Electrical', icon: '🔌', desc: 'Power systems' },
          { href: '/maintenance-hub/borehole', label: 'Borehole', icon: '💧', desc: 'Pumps & water' },
          { href: '/maintenance-hub/welding', label: 'Welding', icon: '🔥', desc: 'Welding services' },
        ],
      },
      {
        title: 'Tools & Booking',
        items: [
          { href: '/calculators', label: 'Power Calculators', icon: '🧮', desc: 'ROI · load · solar', badge: 'ALL-IN-ONE' },
          { href: '/troubleshooting', label: 'Troubleshooting Wizard', icon: '🧙', desc: 'Interactive solver' },
          { href: '/booking', label: 'Book a Service', icon: '📅', desc: 'Schedule a visit' },
          { href: '/products', label: 'Products', icon: '🛒', desc: 'Catalog & pricing' },
          { href: '/sectors', label: 'Sectors We Serve', icon: '🏢', desc: 'Industry coverage' },
        ],
      },
    ],
    cta: { href: '/booking', label: 'Book Now', phone: '+254 782 914 717' },
  },
  resources: {
    title: 'Resources & Insights',
    description: 'Knowledge, stories, and nationwide coverage',
    sections: [
      {
        title: 'Knowledge',
        items: [
          { href: '/blog', label: 'Blog', icon: '📝', desc: 'Latest articles' },
          { href: '/knowledge-base', label: 'Knowledge Base', icon: '📚', desc: 'Guides & how-tos' },
          { href: '/technical-bible', label: 'Technical Bible', icon: '📖', desc: 'Deep reference' },
          { href: '/resources', label: 'Learning Hub', icon: '🎓', desc: 'All resources' },
          { href: '/faq', label: 'FAQ', icon: '❓', desc: 'Quick answers' },
        ],
      },
      {
        title: 'Showcase',
        items: [
          { href: '/case-studies', label: 'Case Studies', icon: '📊', desc: 'Real outcomes' },
          { href: '/case-study/hospital-blackout', label: 'Hospital Blackout', icon: '🏥', desc: 'Featured case' },
          { href: '/gallery', label: 'Gallery', icon: '🖼️', desc: 'Project photos' },
          { href: '/innovations', label: 'Innovations', icon: '💡', desc: 'R&D & breakthroughs' },
          { href: '/industries', label: 'Industries', icon: '🏭', desc: 'Sectors served' },
        ],
      },
      {
        title: 'Coverage & Careers',
        items: [
          { href: '/counties', label: '47 Counties', icon: '📍', desc: 'Kenya nationwide' },
          { href: '/locations', label: 'Service Locations', icon: '🗺️', desc: 'Branch finder' },
          { href: '/kenya', label: 'Kenya Hub', icon: '🇰🇪', desc: 'Country-wide' },
          { href: '/careers', label: 'Careers', icon: '💼', desc: 'Join the team' },
          { href: '/guides/emergency-response', label: 'Emergency Guide', icon: '🚨', desc: '24/7 response' },
        ],
      },
    ],
    cta: { href: '/contact', label: 'Talk to an Expert', phone: '+254 768 860 665' },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROFESSIONAL NAVBAR - 8 top-level items
// All AI tools live inside the AI POWERHOUSE mega menu (no duplicates).
// All site pages reachable through one of: GENERATORS, SOLAR, AI POWERHOUSE,
// SERVICES, RESOURCES, ABOUT, CONTACT.
// ═══════════════════════════════════════════════════════════════════════════════
const NAV_ITEMS = [
  { href: '/', label: 'HOME', type: 'link' },
  { key: 'generators', label: 'GENERATORS', type: 'mega' },
  { key: 'solar', label: 'SOLAR', type: 'mega' },
  { key: 'aiPowerhouse', label: 'AI POWERHOUSE', type: 'mega', featured: true },
  { key: 'services', label: 'SERVICES', type: 'mega' },
  { key: 'resources', label: 'RESOURCES', type: 'mega' },
  { href: '/about-us', label: 'ABOUT', type: 'link' },
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20'
            : 'bg-gradient-to-b from-black/85 via-black/60 to-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6 h-16 lg:h-[72px]">
            {/* Logo — slim, professional */}
            <Link
              href="/"
              aria-label="Emerson EiMS — Reliable Power. Without Limits."
              className="flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md"
            >
              <Image
                src="/images/logo-tagline.png"
                alt="EmersonEIMS — Reliable Power. Without Limits."
                width={240}
                height={60}
                priority
                sizes="(max-width: 640px) 120px, (max-width: 1024px) 150px, 180px"
                className="h-9 sm:h-10 lg:h-11 w-auto object-contain transition-opacity duration-200 hover:opacity-90"
              />
            </Link>

            {/* Desktop Navigation — clean, evenly spaced */}
            <div className="hidden lg:flex items-center flex-1 justify-end gap-1 xl:gap-2">
              {NAV_ITEMS.map((item) =>
                item.type === 'mega' && item.key ? (
                  <div
                    key={item.key}
                    className="relative"
                    onMouseEnter={() => handleMegaEnter(item.key!)}
                    onMouseLeave={handleMegaLeave}
                  >
                    <button
                      className={`relative px-3 xl:px-4 py-2 text-[11px] xl:text-[12px] font-semibold tracking-[0.08em] uppercase transition-colors duration-200 flex items-center gap-1.5 whitespace-nowrap rounded-md ${
                        activeMega === item.key
                          ? 'text-white'
                          : (item as { featured?: boolean }).featured
                            ? 'text-amber-300 hover:text-amber-200'
                            : 'text-white/75 hover:text-white'
                      }`}
                    >
                      {item.label}
                      {(item as { featured?: boolean }).featured && (
                        <span className="ml-0.5 inline-block w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                      )}
                      <svg
                        className={`w-3 h-3 transition-transform duration-200 ${activeMega === item.key ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                      <span
                        className={`absolute left-3 right-3 -bottom-px h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent transition-opacity duration-200 ${
                          activeMega === item.key ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </button>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href!}
                    prefetch={prefetchForHref(item.href!)}
                    className="px-3 xl:px-4 py-2 text-[11px] xl:text-[12px] font-semibold tracking-[0.08em] uppercase transition-colors duration-200 whitespace-nowrap rounded-md text-white/75 hover:text-white"
                  >
                    {item.label}
                  </Link>
                )
              )}

              {/* Divider + Language Switcher + CTA */}
              <div className="ml-2 pl-3 flex items-center gap-3 border-l border-white/10">
                <LanguageSwitcher />
                <a
                  href="tel:+254768860665"
                  className="px-4 py-2 text-[11px] xl:text-[12px] font-bold tracking-[0.08em] uppercase rounded-md bg-amber-500 text-black hover:bg-amber-400 transition-colors duration-200 whitespace-nowrap"
                >
                  Get Quote
                </a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden relative p-2 text-white/90 hover:text-white transition-colors rounded-md hover:bg-white/10"
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
                  className="w-6 h-0.5 bg-current block mb-1.5 origin-center transition-all rounded-full"
                />
                <motion.span
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                  }}
                  className="w-6 h-0.5 bg-current block mb-1.5 rounded-full"
                />
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -6 },
                  }}
                  className="w-6 h-0.5 bg-current block origin-center transition-all rounded-full"
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
              className="absolute left-0 right-0 bg-gray-950/98 backdrop-blur-xl border-b border-white/10 shadow-2xl"
              onMouseEnter={() => handleMegaEnter(activeMega)}
              onMouseLeave={handleMegaLeave}
            >
              <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                                  prefetch={prefetchForHref(item.href)}
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
                                      prefetch={prefetchForHref(subItem.href)}
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
                        prefetch={prefetchForHref(item.href!)}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-3 rounded-xl text-sm font-semibold tracking-wide uppercase text-white/80 hover:text-white hover:bg-white/5 transition-colors"
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
                    href="tel:+254768860665"
                    className="block w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold rounded-xl text-center"
                  >
                    📞 +254 768 860 665
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



