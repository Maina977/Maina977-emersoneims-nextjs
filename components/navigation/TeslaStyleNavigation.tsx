'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import language switcher (client-only)
// LanguageSwitcher import removed 2026-07-31 — the component is no longer
// rendered anywhere in this navigation. The file itself is retained for a
// future, real localisation effort.

interface TeslaStyleNavigationProps {
  activeSection?: string;
}

const HEAVY_APP_ROUTES = new Set<string>([
  '/aquascan-pro-v3',
  '/aquascan-pro-v3/reports',
  '/aquascan-pro-v3/compare',
  '/solar-genius-pro',
  '/solar-genius-pro/solar-dashboard',
  '/solar-genius-pro/design-studio',
  '/solar-genius-pro/fault-codes',
  '/solar-genius-pro/calculator-advanced',
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
  // HOME carries the company pages beneath it (owner decision 2026-07-31).
  // Following the pattern every other menu here uses, the FIRST item is the
  // page the top-level label refers to — so Home is still one click away — and
  // ABOUT and WHY US move off the top-level bar into this menu, which also
  // returns two slots to a bar that had none to spare.
  home: {
    title: 'EmersonEIMS',
    description: 'Who we are, why clients stay, and where we work',
    sections: [
      {
        title: 'The Company',
        items: [
          { href: '/', label: 'Home', icon: '🏠', desc: 'Front page' },
          { href: '/about-us', label: 'About Us', icon: '🏢', desc: 'Who we are and what we do' },
          { href: '/why-emersoneims', label: 'Why EmersonEIMS', icon: '⭐', desc: 'What sets our engineering apart' },
          { href: '/careers', label: 'Careers', icon: '💼', desc: 'Work with our engineers' },
        ],
      },
      {
        title: 'Proof of Work',
        items: [
          { href: '/case-studies', label: 'Case Studies', icon: '📈', desc: 'Projects we have delivered' },
          { href: '/gallery', label: 'Gallery', icon: '📷', desc: 'Site and workshop photography' },
          { href: '/certification', label: 'Training & Certification', icon: '🎓', desc: 'Technical training programmes' },
          { href: '/faq', label: 'FAQ', icon: '❓', desc: 'Common questions answered' },
        ],
      },
    ],
    cta: { href: '/contact', label: 'Talk to an Engineer', phone: '+254 768 860 665' },
  },
  // Every hub in lib/repair-centre/index.ts appears here. If a hub is added
  // there and not here, it is reachable only from /repair-centre itself.
  repairCentre: {
    title: 'Repair Centre',
    description: 'Free fault-diagnosis and repair guides written by our engineers',
    sections: [
      {
        title: 'Power Generation',
        items: [
          { href: '/repair-centre', label: 'All Guides', icon: '🛠️', desc: '15 categories · 39 guides' },
          { href: '/repair-centre/generators', label: 'Generator Repair', icon: '⚡', desc: 'Starting, shutdown & output faults' },
          { href: '/repair-centre/engine-systems', label: 'Engine Mechanical', icon: '⚙️', desc: 'Noise, bearings, oil pressure' },
          { href: '/repair-centre/fuel-systems', label: 'Fuel & Combustion', icon: '⛽', desc: 'Smoke, contamination, wet stacking' },
          { href: '/repair-centre/controllers', label: 'Controller Diagnostics', icon: '🎛️', desc: 'DSE, ComAp, SmartGen & more' },
          { href: '/repair-centre/fault-codes', label: 'Fault Codes', icon: '🔢', desc: 'J1939 SPN & FMI explained' },
        ],
      },
      {
        title: 'Backup & Renewable',
        items: [
          { href: '/repair-centre/inverters', label: 'Inverter Repair', icon: '🔌', desc: 'Output, charging & power stage' },
          { href: '/repair-centre/ups', label: 'UPS Repair', icon: '🔋', desc: 'Bypass, battery & autonomy' },
          { href: '/repair-centre/solar', label: 'Solar PV Diagnosis', icon: '☀️', desc: 'Yield loss, strings & DC bus' },
          { href: '/repair-centre/ats-changeover', label: 'ATS & Changeover', icon: '🔁', desc: 'Transfer and return faults' },
        ],
      },
      {
        title: 'Electrical & Electronics',
        items: [
          { href: '/repair-centre/motors', label: 'Motor Diagnosis', icon: '🌀', desc: 'Windings, single-phasing, overload' },
          { href: '/repair-centre/pumps', label: 'Pump Diagnosis', icon: '💧', desc: 'Borehole delivery & control' },
          { href: '/repair-centre/industrial-electronics', label: 'Drives & Electronics', icon: '📟', desc: 'VFD trips and DC bus' },
          { href: '/repair-centre/pcb-motherboards', label: 'PCB & Board Repair', icon: '🔬', desc: 'Shorted rails, component testing' },
        ],
      },
      {
        title: 'Method & Safety',
        items: [
          { href: '/repair-centre/safety', label: 'Safe Isolation', icon: '🛡️', desc: 'Proving dead, lockout, stored energy' },
          { href: '/repair-centre/testing-tools', label: 'Test Instruments', icon: '📏', desc: 'Measurement errors that mislead' },
        ],
      },
    ],
    cta: { href: '/contact', label: 'Talk to an Engineer', phone: '+254 768 860 665' },
  },
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
          { href: '/generators/workshop-services', label: 'Workshop Repairs & Fabrication', icon: '🏭', desc: 'Rebuilds & custom steel' },
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
          { href: '/faults', label: 'Fault Code Library', icon: '📖', desc: '57,600+ codes' },
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
          { href: '/solar-genius-pro/design-studio', label: 'AI Design Studio', icon: '🎨', desc: 'Leaflet map · real irradiance', badge: 'NEW' },
          { href: '/solutions/solar-sizing', label: 'System Sizing', icon: '📐', desc: 'Right-size every kWh' },
        ],
      },
      {
        title: 'Solar Genius Pro Suite',
        items: [
          { href: '/solar-genius-pro', label: 'Solar Genius Pro™', icon: '🧠', desc: '56 AI engines · <3 min quotes', badge: '#1' },
          { href: '/solar-genius-pro/solar-dashboard', label: 'Site & System Dashboard', icon: '📡', desc: 'NASA + OSM live data', badge: 'NEW' },
          { href: '/solar-genius-pro/calculator-advanced', label: 'Solar System Calculator', icon: '⚡', desc: 'Size, cost & payback', badge: 'NEW' },
          { href: '/solar-genius-pro/fault-codes', label: 'Fault Codes AI', icon: '🔍', desc: '1,200+ inverter codes', badge: 'NEW' },
          { href: '/calculators', label: 'Power Calculators', icon: '🧮', desc: 'ROI, load, payback' },
        ],
      },
      {
        title: 'Service & Coverage',
        items: [
          { href: '/resources/solar-ups-hub', label: 'Solar / UPS Hub', icon: '🔆', desc: 'Workspace + simulators' },
          { href: '/hub/ups-lab', label: 'UPS Lab', icon: '🔋', desc: 'Battery + load tests' },
          { href: '/maintenance-hub/solar', label: 'Solar Maintenance Hub', icon: '🛠️', desc: 'Diagnostics & repair' },
          { href: '/counties', label: '47 Counties', icon: '📍', desc: 'Nationwide service' },
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
          { href: '/generator-oracle', label: 'Generator Oracle™', icon: '🔮', desc: '57,600+ verified fault codes', badge: 'AI' },
          { href: '/solar-genius-pro', label: 'Solar Genius Pro™', icon: '☀️', desc: '56 AI engines · <3 min quotes', badge: '#1' },
          { href: '/aquascan-pro-v3', label: 'AquaScan Pro™', icon: '💧', desc: '26 AI engines · NASA + Google Earth', badge: '#1' },
        ],
      },
      {
        title: 'AquaScan Pro Suite',
        items: [
          { href: '/aquascan-pro-v3', label: 'Borehole Analyzer', icon: '🔬', desc: 'AI-powered site analysis' },
          { href: '/aquascan-pro-v3/reports', label: 'Reports & Downloads', icon: '📄', desc: 'View & export reports', badge: 'NEW' },
          { href: '/aquascan-pro-v3/compare', label: 'Site Comparison', icon: '⚖️', desc: 'Compare up to 3 sites', badge: 'NEW' },
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
    description: '9 core services — every sub-page lives at /services/<slug>',
    sections: [
      {
        title: 'Generators & Power',
        items: [
          { href: '/services', label: 'All Services', icon: '💡', desc: 'Browse everything' },
          { href: '/services/cummins-generators', label: 'Cummins Generators', icon: '⚡', desc: 'Sales · 3-Yr warranty', badge: '3-YR' },
          { href: '/services/generator-repairs', label: 'Generator Repairs', icon: '🔧', desc: 'Service & overhaul' },
          { href: '/services/ats-changeover', label: 'ATS / Changeover', icon: '🔁', desc: 'Auto transfer switches' },
        ],
      },
      {
        title: 'Renewable & Electrical',
        items: [
          { href: '/services/solar-energy', label: 'Solar Energy', icon: '☀️', desc: 'PV · hybrid · storage' },
          { href: '/services/ups-systems', label: 'UPS Systems', icon: '🔋', desc: 'Backup power' },
          { href: '/services/distribution-boards', label: 'Distribution Boards', icon: '🔌', desc: 'LV/MV switchgear' },
          { href: '/services/motor-rewinding', label: 'Motor Rewinding', icon: '🔄', desc: 'Motor repair' },
        ],
      },
      {
        title: 'HVAC · Water · Waste',
        items: [
          { href: '/services/ac-installation', label: 'AC Installation', icon: '❄️', desc: 'HVAC & refrigeration' },
          { href: '/services/borehole-pumps', label: 'Borehole Pumps', icon: '💧', desc: 'Water systems' },
          { href: '/services/hospital-incinerators', label: 'Hospital Incinerators', icon: '🔥', desc: 'Medical waste' },
          { href: '/calculators', label: 'Power Calculators', icon: '🧮', desc: 'Sizing · ROI · load', badge: 'TOOLS' },
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
        // Repair Centre — technical fault-diagnosis guides. Added as a
        // first-class Resources section so the articles are reachable through
        // normal navigation rather than only via search or the sitemap.
        title: 'Repair Centre',
        items: [
          { href: '/repair-centre', label: 'Repair Centre', icon: '🛠️', desc: 'Fault diagnosis & repair guides' },
          { href: '/repair-centre/generators', label: 'Generator Repair', icon: '⚡', desc: 'Starting, shutdown & output faults' },
          { href: '/repair-centre/inverters', label: 'Inverter Repair', icon: '🔌', desc: 'Output, charging & thermal faults' },
          { href: '/repair-centre/ups', label: 'UPS Repair', icon: '🔋', desc: 'Bypass, battery & autonomy faults' },
          { href: '/repair-centre/controllers', label: 'Controller Diagnostics', icon: '🎛️', desc: 'DSE, ComAp, SmartGen & more' },
        ],
      },
      {
        // SURFACED: the Solar / UPS Hub workspace was previously orphaned from
        // the navbar (only the Quick Access band on /resources linked it).
        // Hub pages now live as a first-class section in the Resources mega.
        title: 'Solar / UPS Hub',
        items: [
          { href: '/resources/solar-ups-hub', label: 'Solar / UPS Hub', icon: '🔆', desc: 'Workspace overview' },
          { href: '/hub/simulator', label: 'UPS Simulator', icon: '🧪', desc: 'Sizing & runtime' },
          { href: '/hub/ups-lab', label: 'UPS Lab', icon: '🔋', desc: 'Battery + load tests' },
          { href: '/hub/verifier', label: 'Spec Verifier', icon: '✅', desc: 'Verify nameplate vs spec' },
          { href: '/hub/quote-audit', label: 'Quote Audit', icon: '🧾', desc: 'Vendor quote sanity check' },
          { href: '/hub/diagnostics', label: 'Hub Diagnostics', icon: '🔧', desc: 'Diagnostic workspace' },
        ],
      },
      {
        title: 'Knowledge & Learning',
        items: [
          { href: '/blog', label: 'Blog', icon: '📝', desc: 'Latest articles' },
          { href: '/knowledge-base', label: 'Knowledge Base', icon: '📚', desc: 'Guides & how-tos' },
          { href: '/technical-bible', label: 'Technical Bible', icon: '📖', desc: 'Deep reference' },
          { href: '/resources', label: 'Learning Hub', icon: '🎓', desc: 'All resources' },
          { href: '/faq', label: 'FAQ', icon: '❓', desc: 'Quick answers' },
          { href: '/certification', label: 'Certification Program', icon: '🏆', desc: '3-tier training', badge: 'NEW' },
        ],
      },
      {
        title: 'Video & Podcast',
        items: [
          { href: '/videos/youtube-episodes', label: 'YouTube Episodes', icon: '📺', desc: 'Technical deep dives', badge: 'NEW' },
          { href: '/podcasts/episodes', label: 'Power Infrastructure Podcast', icon: '🎙️', desc: 'Industry conversations', badge: 'NEW' },
          { href: '/media', label: 'Media Hub', icon: '🎬', desc: 'All video content' },
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
        title: 'Coverage & Marketplace',
        items: [
          { href: '/counties', label: '47 Counties', icon: '📍', desc: 'Kenya nationwide' },
          { href: '/locations', label: 'Service Locations', icon: '🗺️', desc: 'Branch finder' },
          { href: '/marketplace', label: 'Partner Marketplace', icon: '🤝', desc: '50+ vetted partners', badge: 'NEW' },
          { href: '/kenya', label: 'Kenya Hub', icon: '🇰🇪', desc: 'Country-wide' },
          { href: '/guides/emergency-response', label: 'Emergency Guide', icon: '🚨', desc: '24/7 response' },
        ],
      },
      {
        title: 'Careers',
        items: [
          { href: '/careers', label: 'Careers', icon: '💼', desc: 'Join the team' },
          { href: '/certification', label: 'Professional Training', icon: '📚', desc: 'Get certified' },
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
  // ORDER IS COMMERCIAL PRIORITY, and it is load-bearing.
  //
  // Priority+ collapses from the END of this list, so whatever sits last is what
  // disappears into MORE first. The header container caps at 1440px, so eleven
  // items never all fit on the bar at any realistic laptop width — the question
  // was never whether something collapses, only WHAT.
  //
  // Measured before this reorder: at 1366px the bar was showing ABOUT and WHY US
  // while hiding GENERATORS and SOLAR. Those two are core commercial categories
  // and must never be the ones that go.
  //
  // The items that stay visible at every realistic width are the ones that sell.
  //
  // HOME is first by owner decision (2026-07-31). It was briefly removed on the
  // reasoning that the logo already links to / — that is the usual convention, but
  // the owner wants it explicit and that is the call that stands. It costs roughly
  // one slot on the bar, which Priority+ absorbs into MORE from the bottom of this
  // list rather than by dropping anything.
  { key: 'home', label: 'HOME', type: 'mega' },
  { key: 'repairCentre', label: 'REPAIR CENTRE', type: 'mega', featured: true },
  { key: 'services', label: 'SERVICES', type: 'mega' },
  { key: 'generators', label: 'GENERATORS', type: 'mega' },
  { key: 'solar', label: 'SOLAR', type: 'mega' },
  { key: 'aiPowerhouse', label: 'AI SOLUTIONS', type: 'mega', featured: true },
  // INDUSTRIES — direct link to the live B2B sector hub at /industries.
  // (A parallel /solutions/<sector> system was retired to avoid duplicating it.)
  { href: '/industries', label: 'INDUSTRIES', type: 'link' },
  { key: 'resources', label: 'RESOURCES', type: 'mega' },
  // Below here are the items that may fall into MORE. CONTACT is deliberately
  // last: the pinned GET QUOTE button next to it goes to the same conversion
  // path and is never allowed to overflow, so nothing is lost by CONTACT
  // collapsing.
  // ABOUT and WHY US now live inside the HOME menu above.
  // PHASE 4 removed from the bar 2026-07-31. It had TWO visitors in the whole
  // analytics history against 43 for /about-us and 20 for /industries, and its
  // content is an internal roadmap — "Five Pillars", "Strategic Goals",
  // "Establish EmersonEIMS as the market leader". "PHASE 4" means nothing to a
  // technician looking for a generator repair, and it was holding a top-level
  // slot with a NEW badge on a bar where commercial categories were being
  // pushed into MORE. The page still exists at /phase-4.
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

  // ── Priority+ overflow ────────────────────────────────────────────────────
  // Adding REPAIR CENTRE to the bar pushed RESOURCES, PHASE 4 and CONTACT off
  // screen at 1366px — the most common laptop width — and CONTACT is the worst
  // item to lose. A horizontal scrollbar was considered and rejected: users do
  // not discover horizontally-scrolled nav items, so it hides rather than solves,
  // and it reads as an unfinished layout.
  //
  // Instead the bar measures itself and moves whatever does not fit into a MORE
  // menu. Nothing is ever lost at any width, and adding a future nav item cannot
  // silently drop an existing one.
  const navRowRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tailRef = useRef<HTMLDivElement | null>(null);
  const itemWidths = useRef<number[]>([]);
  const [visibleCount, setVisibleCount] = useState(NAV_ITEMS.length);
  const [overflowOpen, setOverflowOpen] = useState(false);

  useEffect(() => {
    const row = navRowRef.current;
    if (!row) return;

    // Cache widths: once an item collapses into MORE its offsetWidth reads 0, so
    // a naive re-measure on resize would compute nonsense. Measure each item once
    // while it is laid out, keep the width, and recompute from the cache after.
    const widths = itemWidths.current;

    const measure = () => {
      for (let i = 0; i < NAV_ITEMS.length; i++) {
        const w = itemRefs.current[i]?.offsetWidth ?? 0;
        if (w > 0) widths[i] = w;
      }
      const rowWidth = row.clientWidth;
      const tailWidth = tailRef.current?.offsetWidth ?? 0;
      const MORE_WIDTH = 92; // width reserved for the MORE control
      let used = 0;
      let fit = 0;
      for (let i = 0; i < NAV_ITEMS.length; i++) {
        const w = widths[i] ?? 0;
        // A width we have not captured yet must NOT be treated as fitting for
        // free — doing so inflated the count until the bar overflowed and pushed
        // MORE itself out of reach. Bail and let the next frame measure instead.
        if (!w) return;
        // Reserve room for MORE only while items still remain after this one.
        const reserve = i < NAV_ITEMS.length - 1 ? MORE_WIDTH : 0;
        if (used + w + tailWidth + reserve > rowWidth) break;
        used += w;
        fit++;
      }
      setVisibleCount(prev => (prev === fit ? prev : fit));
    };

    // Widths are only readable once the row has laid out, and on a slow first
    // paint some are still zero. Keep measuring across a few frames until every
    // item has reported a width, then let ResizeObserver take over.
    let frames = 0;
    const settle = () => {
      measure();
      const allKnown = NAV_ITEMS.every((_, i) => (widths[i] ?? 0) > 0);
      if (!allKnown && frames++ < 30) requestAnimationFrame(settle);
    };
    settle();

    const ro = new ResizeObserver(measure);
    ro.observe(row);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);
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
      {/* Desktop mega-menu backdrop — dims the rest of the page so dropdown
          contents stay readable instead of bleeding into page content */}
      <AnimatePresence>
        {activeMega && (
          <motion.div
            key="mega-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm hidden lg:block"
            onMouseEnter={() => setActiveMega(null)}
          />
        )}
      </AnimatePresence>

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
            {/* min-w-0 is load-bearing. A flex child defaults to min-width:auto, so it
                refuses to shrink below its content and instead overflows its PARENT.
                Measured on the live site at a 1366px viewport this row reported
                clientWidth 1701 — wider than the screen — so the overflow logic
                correctly concluded everything fitted and MORE never appeared.
                With min-w-0 the row shrinks to the width actually available and the
                measurement becomes true. */}
            <div ref={navRowRef} className="hidden lg:flex items-center flex-1 min-w-0 justify-end gap-1 xl:gap-2">
              {NAV_ITEMS.map((item) =>
                item.type === 'mega' && item.key ? (
                  <div
                    key={item.key}
                    ref={el => { itemRefs.current[NAV_ITEMS.indexOf(item)] = el; }}
                    className={`relative ${NAV_ITEMS.indexOf(item) < visibleCount ? '' : 'hidden'}`}
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
                  <div
                    key={item.href}
                    ref={el => { itemRefs.current[NAV_ITEMS.indexOf(item)] = el; }}
                    className={NAV_ITEMS.indexOf(item) < visibleCount ? '' : 'hidden'}
                  >
                  <Link
                    href={item.href!}
                    prefetch={prefetchForHref(item.href!)}
                    className="px-3 xl:px-4 py-2 text-[11px] xl:text-[12px] font-semibold tracking-[0.08em] uppercase transition-colors duration-200 whitespace-nowrap rounded-md text-white/75 hover:text-white"
                  >
                    {item.label}
                  </Link>
                  </div>
                )
              )}

              {/* Priority+ overflow. Only appears when the bar genuinely runs out
                  of room, so nothing is ever dropped at any viewport width. */}
              {visibleCount < NAV_ITEMS.length && (
                <div
                  className="relative"
                  onMouseEnter={() => setOverflowOpen(true)}
                  onMouseLeave={() => setOverflowOpen(false)}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={overflowOpen}
                    onClick={() => setOverflowOpen(v => !v)}
                    className={`relative px-3 xl:px-4 py-2 text-[11px] xl:text-[12px] font-semibold tracking-[0.08em] uppercase transition-colors duration-200 flex items-center gap-1.5 whitespace-nowrap rounded-md ${overflowOpen ? 'text-white' : 'text-white/75 hover:text-white'}`}
                  >
                    More
                    <svg className={`w-3 h-3 transition-transform duration-200 ${overflowOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className={`absolute left-3 right-3 -bottom-px h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent transition-opacity duration-200 ${overflowOpen ? 'opacity-100' : 'opacity-0'}`} />
                  </button>

                  <AnimatePresence>
                    {overflowOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.16 }}
                        className="absolute right-0 top-full mt-1 min-w-[220px] rounded-xl bg-gray-950 border border-amber-500/20 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.9)] py-2 z-50"
                      >
                        {NAV_ITEMS.slice(visibleCount).map(over =>
                          over.type === 'mega' && over.key ? (
                            <button
                              key={over.key}
                              onClick={() => { setOverflowOpen(false); handleMegaEnter(over.key!); }}
                              className="w-full text-left px-4 py-2.5 text-[12px] font-semibold tracking-[0.08em] uppercase text-white/75 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              {over.label}
                            </button>
                          ) : (
                            <Link
                              key={over.href}
                              href={over.href!}
                              prefetch={prefetchForHref(over.href!)}
                              onClick={() => setOverflowOpen(false)}
                              className="block px-4 py-2.5 text-[12px] font-semibold tracking-[0.08em] uppercase text-white/75 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              {over.label}
                            </Link>
                          )
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Pinned CTA — measured as a reserved tail and never allowed to
                  overflow into MORE.

                  LANGUAGE SWITCHER REMOVED 2026-07-31. It offered eleven languages
                  and delivered none of them. Only nine strings were ever translated
                  — all of them nav labels — and the component that consumed them,
                  SciFiHeader, is not imported by any route. The navigation that is
                  actually rendered site-wide, this file, calls useTranslation zero
                  times. Selecting Kiswahili, French, Arabic, Amharic or Somali
                  changed nothing whatsoever on screen.

                  Advertising a capability the site does not have is worse than not
                  offering it, particularly to the engineers and institutions this
                  site is written for. components/shared/LanguageSwitcher.tsx is left
                  in place so a real localisation effort can use it — but it must not
                  be shown again until the site is genuinely translated.

                  GET QUOTE was href="tel:..." on a DESKTOP-ONLY bar, where a tel:
                  link does nothing useful. A button promising a quote that silently
                  does nothing is the same class of problem. It now goes to /contact,
                  which carries the working enquiry form, WhatsApp and the phone
                  number — a real quote path. */}
              <div ref={tailRef} className="ml-2 pl-3 flex items-center gap-3 border-l border-white/10">
                <Link
                  href="/contact"
                  prefetch={prefetchForHref('/contact')}
                  className="px-4 py-2 text-[11px] xl:text-[12px] font-bold tracking-[0.08em] uppercase rounded-md bg-amber-500 text-black hover:bg-amber-400 transition-colors duration-200 whitespace-nowrap"
                >
                  Get Quote
                </Link>
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
              className="absolute left-0 right-0 bg-gray-950 border-b border-amber-500/20 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.9)] z-50"
              onMouseEnter={() => handleMegaEnter(activeMega)}
              onMouseLeave={handleMegaLeave}
            >
              <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {(() => {
                  const menu = MEGA_MENUS[activeMega as keyof typeof MEGA_MENUS];
                  // Adaptive column count: one column per section + one for the CTA.
                  // Resources now has 4 sections (added Solar / UPS Hub) so the grid
                  // must scale to 5 columns; Tailwind needs literal class names.
                  const colsClass =
                    menu.sections.length >= 4
                      ? 'grid lg:grid-cols-5 gap-8'
                      : 'grid lg:grid-cols-4 gap-8';
                  return (
                    <div className={colsClass}>
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

                {/* Mobile language switcher removed for the same reason as the desktop
                    one — see the note in the desktop tail. It promised eleven
                    languages and delivered none. */}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}



