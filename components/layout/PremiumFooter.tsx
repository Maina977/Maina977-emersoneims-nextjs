import Link from 'next/link';
import { TEAM_EMAILS } from '@/lib/contact/emails';

/**
 * Regression-pinned strings (tests/regression/site-invariants.test.ts test 6):
 * canonical email: info@emersoneims.com
 * primary phones:  +254768860665, +254782914717
 * The footer surfaces all entries from TEAM_EMAILS — `info@emersoneims.com`
 * is the first entry and is rendered visibly. Phones are rendered inline below.
 */

const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/emersoneims' },
  { label: 'Twitter', href: 'https://twitter.com/emersoneims' },
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100089864898337' },
] as const;

const FOOTER_LINKS = {
  company: [
    { label: 'About Us', href: '/about-us' },
    { label: 'All Services', href: '/services' },
    { label: 'Book a Service', href: '/booking' },
    { label: 'Project Gallery', href: '/gallery' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Industries Served', href: '/industries' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact Us', href: '/contact' },
  ],
  // Comprehensive B2B service inventory — every entry is a working route.
  // Sourced from lib/services/allServices.ts (canonical /services/<slug>) plus
  // /solutions/<slug> deep-dive pages. Keep groups <= 8 entries for scannability.
  servicesPower: [
    { label: 'Cummins Generators (3-yr warranty)', href: '/services/cummins-generators' },
    { label: 'Generator Repairs & Maintenance', href: '/services/generator-repairs' },
    { label: 'ATS / Changeovers', href: '/services/ats-changeover' },
    { label: 'Generator Sales', href: '/generators' },
    { label: 'Generator Rental', href: '/generators/rental' },
    { label: 'Generator Installation', href: '/generators/installation' },
    { label: 'Generator Spare Parts', href: '/generators/spare-parts' },
    // Workshop Repairs & Fabrication (added 2026-07-21). The page had only ONE
    // crawlable inbound link (/generators) because the nav mega-menu renders
    // client-side and crawlers never see it. The footer gives every page a
    // server-rendered link, which is what brief section 10 asked for.
    { label: 'Workshop Repairs & Fabrication', href: '/generators/workshop-services' },
    { label: 'Power Interruption Solutions', href: '/solutions/power-interruptions' },
  ],
  servicesRenewable: [
    { label: 'Solar Energy Solutions', href: '/services/solar-energy' },
    { label: 'Commercial / Industrial Solar', href: '/solutions/solar' },
    { label: 'Solar System Sizing', href: '/solutions/solar-sizing' },
    { label: 'Solar Genius Pro™', href: '/solar-genius-pro' },
    { label: 'UPS Systems', href: '/services/ups-systems' },
    { label: 'UPS Lab', href: '/hub/ups-lab' },
    { label: 'Solar / UPS Hub', href: '/resources/solar-ups-hub' },
    { label: 'Borehole Pumps', href: '/services/borehole-pumps' },
  ],
  servicesElectrical: [
    { label: 'Distribution Boards & Panels', href: '/services/distribution-boards' },
    { label: 'Motor Rewinding', href: '/services/motor-rewinding' },
    { label: 'Motors & Drives', href: '/solutions/motors' },
    { label: 'High-Voltage Systems', href: '/solutions/high-voltage' },
    { label: 'Diesel Automation', href: '/solutions/diesel-automation' },
    { label: 'Industrial Controls', href: '/solutions/controls' },
    { label: 'Steel Fabrication', href: '/solutions/fabrication' },
    { label: 'AC / HVAC Installation', href: '/services/ac-installation' },
  ],
  servicesSpecialised: [
    { label: 'Hospital Incinerators', href: '/services/hospital-incinerators' },
    { label: 'Incinerator Construction Guide', href: '/solutions/incinerators' },
    { label: 'Building Engineering Suite', href: '/solutions/building' },
    { label: 'EIMS PRO Workspace', href: '/eims-pro' },
    { label: 'AquaScan Pro™', href: '/aquascan-pro-v3' },
    { label: 'Generator Oracle™', href: '/generator-oracle' },
    { label: 'Diagnostics Hub', href: '/diagnostics' },
    { label: 'Troubleshooting Wizard', href: '/troubleshooting' },
  ],
  maintenanceHubs: [
    { label: 'Generator Maintenance', href: '/maintenance-hub/generators' },
    { label: 'Solar Maintenance', href: '/maintenance-hub/solar' },
    { label: 'HVAC Maintenance', href: '/maintenance-hub/hvac' },
    { label: 'Borehole Maintenance', href: '/maintenance-hub/borehole' },
    { label: 'Electrical Maintenance', href: '/maintenance-hub/electrical' },
    { label: 'Motors Maintenance', href: '/maintenance-hub/motors' },
    { label: 'Incinerator Maintenance', href: '/maintenance-hub/incinerators' },
    { label: 'Fabrication & Welding', href: '/maintenance-hub/fabrication' },
  ],
  resources: [
    { label: 'Resources & Learning Hub', href: '/resources' },
    { label: 'Knowledge Base', href: '/knowledge-base' },
    { label: 'Technical Bible', href: '/technical-bible' },
    { label: 'Power Calculators', href: '/calculators' },
    { label: 'Fault Code Database', href: '/faults' },
    { label: 'Blog & Articles', href: '/blog' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Emergency Response Guide', href: '/guides/emergency-response' },
  ],
  serviceAreas: [
    { label: 'All Kenya — 47 Counties', href: '/kenya' },
    { label: 'Nairobi', href: '/kenya/nairobi' },
    { label: 'Mombasa', href: '/kenya/mombasa' },
    { label: 'Kisumu', href: '/kenya/kisumu' },
    { label: 'Nakuru', href: '/kenya/nakuru' },
    { label: 'Kiambu', href: '/kenya/kiambu' },
    { label: 'All Service Locations', href: '/locations' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
} as const;

export default function PremiumFooter() {
  const currentYear = new Date().getFullYear();
  const buildId =
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.VERCEL_DEPLOYMENT_ID ||
    process.env.NEXT_PUBLIC_BUILD_ID ||
    'local';
  const buildShort = typeof buildId === 'string' ? buildId.slice(0, 8) : 'local';

  return (
    <footer className="bg-black text-white pt-24 pb-12 border-t border-white/10 relative overflow-hidden">
      {/* Background Elements */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-30 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -top-40 -right-40 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"
      />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* ═══════════════════════════════════════════════════════════════════
            SERVICES DIRECTORY — full B2B service inventory.
            Every link below resolves to a working route. Sourced from
            lib/services/allServices.ts and the /solutions/* deep dives so
            buyers reach the right page in one click.
        ═══════════════════════════════════════════════════════════════════ */}
        <nav aria-label="Services directory" className="mb-20 pb-16 border-b border-white/10">
          <div className="flex items-baseline justify-between mb-10">
            <h3 className="text-xs font-mono text-brand-gold tracking-[0.3em] uppercase">
              Services Directory
            </h3>
            <Link
              href="/services"
              className="text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
            >
              View all services →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { title: 'Power & Generators', items: FOOTER_LINKS.servicesPower },
              { title: 'Renewable & UPS', items: FOOTER_LINKS.servicesRenewable },
              { title: 'Electrical & HVAC', items: FOOTER_LINKS.servicesElectrical },
              { title: 'Specialised & AI Suites', items: FOOTER_LINKS.servicesSpecialised },
            ].map((group) => (
              <div key={group.title}>
                <h4 className="text-sm font-mono text-brand-gold mb-5 tracking-wider uppercase">
                  {group.title}
                </h4>
                <ul className="space-y-3">
                  {group.items.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-12 pt-12 border-t border-white/5">
            {[
              { title: 'Maintenance Hubs', items: FOOTER_LINKS.maintenanceHubs },
              { title: 'Resources & Tools', items: FOOTER_LINKS.resources },
              { title: 'Service Areas', items: FOOTER_LINKS.serviceAreas },
            ].map((group) => (
              <div key={group.title}>
                <h4 className="text-sm font-mono text-brand-gold mb-5 tracking-wider uppercase">
                  {group.title}
                </h4>
                <ul className="space-y-3">
                  {group.items.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <Link
              href="/"
              aria-label="Emerson EiMS home"
              className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-3xl font-display font-bold tracking-tighter text-white">EMERSON</span>
                  <span className="text-sm font-mono text-brand-gold tracking-[0.3em]">EiMS</span>
                </div>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              Engineering-grade reliability for East Africa's critical infrastructure.
              Power systems built to perform.
            </p>
            <ul className="flex gap-4" aria-label="Social links">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    <span className="sr-only">{social.label}</span>
                    <span className="text-xs">{'\u2197'}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Columns */}
          <nav aria-label="Footer" className="lg:col-span-5 lg:col-start-6 grid grid-cols-1 sm:grid-cols-2 gap-12 lg:gap-6">
            <div>
              <h4 className="text-sm font-mono text-brand-gold mb-6 tracking-wider uppercase">Company</h4>
              <ul className="space-y-4">
                {FOOTER_LINKS.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-mono text-brand-gold mb-6 tracking-wider uppercase">Quick Links</h4>
              <ul className="space-y-4">
                {[
                  { label: 'Generator Sales', href: '/generators' },
                  { label: 'Solar Energy', href: '/solar' },
                  { label: 'Diagnostic Suite', href: '/diagnostics' },
                  { label: 'Solar / UPS Hub', href: '/resources/solar-ups-hub' },
                  { label: 'Generator Oracle', href: '/generator-oracle' },
                  { label: 'Knowledge Base', href: '/knowledge-base' },
                  { label: 'FAQ', href: '/faq' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="lg:col-span-3">
            <h4 className="text-sm font-mono text-brand-gold mb-6 tracking-wider uppercase">Contact</h4>
            <address className="not-italic">
              <ul className="space-y-4 text-sm text-gray-400">
                <li>
                  <span className="block text-white mb-1">Nairobi HQ</span>
                  Embakasi, off Airport North Road, Nairobi<br />
                  (Near KEMSA Head Office)
                </li>
                <li>
                  <span className="block text-white mb-1">Department Emails</span>
                  <ul className="space-y-2">
                    {TEAM_EMAILS.map((entry) => (
                      <li key={entry.address}>
                        <a
                          href={`mailto:${entry.address}`}
                          aria-label={`${entry.label} \u2014 ${entry.address}`}
                          className="block hover:text-brand-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
                        >
                          <span className="block text-xs text-gray-400 uppercase tracking-wider">
                            {entry.label}
                          </span>
                          <span className="block text-sm">{entry.address}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <span className="block text-white mb-1">Phone</span>
                  <div className="space-y-1">
                    <a
                      href="tel:+254782914717"
                      className="hover:text-brand-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
                    >
                      +254782914717
                    </a>
                    <div>
                      <a
                        href="tel:+254768860665"
                        className="hover:text-brand-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
                      >
                        +254768860665
                      </a>
                    </div>
                  </div>
                </li>
              </ul>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <p className="text-xs text-gray-400">
              © {currentYear} Emerson EiMS. All rights reserved.
            </p>
            <span className="ml-3 px-2 py-1 rounded bg-brand-gold/10 text-xs font-semibold text-brand-gold border border-brand-gold/30" title="Protected by Generator Oracle / EmersonEIMS">
              PROTECTED BY GENERATOR ORACLE / EMERSONEIMS
            </span>
          </div>
          <div className="flex gap-6">
            {FOOTER_LINKS.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-gray-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="text-xs text-gray-600 font-mono">
            ENGINEERED IN NAIROBI, KENYA
          </div>
        </div>
      </div>
    </footer>
  );
}
