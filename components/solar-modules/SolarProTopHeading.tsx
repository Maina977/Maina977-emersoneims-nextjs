'use client';

import { usePathname } from 'next/navigation';

/**
 * The one <h1> for /solar-genius-pro and its sub-pages, ABOVE the tool
 * (2026-10-20 audit: on a phone the only h1 sat ~3,300 px down, in the SEO
 * block under the calculator). The SEO block below now renders an <h2>.
 */
const TITLES: Record<string, string> = {
  '/solar-genius-pro': 'SolarGenius Pro: Solar System Sizing for Kenya',
  '/solar-genius-pro/calculator-advanced': 'Advanced Solar Calculator',
  '/solar-genius-pro/design-studio': 'Solar Design Studio',
  '/solar-genius-pro/fault-codes': 'Solar Inverter and Battery Fault Codes',
  '/solar-genius-pro/solar-dashboard': 'Solar System Dashboard',
};

export default function SolarProTopHeading() {
  const path = (usePathname() || '/solar-genius-pro').replace(/\/$/, '') || '/solar-genius-pro';
  const title = TITLES[path] ?? TITLES['/solar-genius-pro'];
  return (
    <div className="mx-auto max-w-7xl px-4 pt-4">
      <h1 className="text-lg font-bold text-white sm:text-xl">{title}</h1>
      <p className="text-xs text-slate-400">
        Free estimate from NASA sun-hours and typical Kenyan prices; a site survey gives the quotation.
      </p>
    </div>
  );
}
