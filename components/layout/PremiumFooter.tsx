import Link from 'next/link';

const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/emersoneims' },
  { label: 'Twitter', href: 'https://twitter.com/emersoneims' },
  { label: 'Facebook', href: 'https://www.facebook.com/emersoneims' },
] as const;

const FOOTER_LINKS = {
  company: [
    { label: 'About Us', href: '/about-us' },
    { label: 'Services', href: '/service' },
    { label: 'Solutions', href: '/solution' },
    { label: 'Brands', href: '/brands' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact Us', href: '/contact' },
  ],
  solutions: [
    { label: 'Generators', href: '/generators' },
    { label: 'Solar Energy', href: '/solar' },
    { label: 'Universal Diagnostics', href: '/diagnostics' },
    { label: 'Diagnostic Suite', href: '/diagnostic-suite' },
    { label: 'Diagnostic Q&A', href: '/diagnostic-qa' },
    { label: 'All 47 Counties', href: '/counties' },
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
          <nav aria-label="Footer" className="lg:col-span-4 lg:col-start-6 grid grid-cols-1 sm:grid-cols-2 gap-12 lg:gap-8">
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
              <h4 className="text-sm font-mono text-brand-gold mb-6 tracking-wider uppercase">Solutions</h4>
              <ul className="space-y-4">
                {FOOTER_LINKS.solutions.map((link) => (
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
                  P.O. Box 387-00521, Old North Airport Road
                </li>
                <li>
                  <span className="block text-white mb-1">Email</span>
                  <a
                    href="mailto:info@emersoneims.com"
                    className="hover:text-brand-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
                  >
                    info@emersoneims.com
                  </a>
                </li>
                <li>
                  <span className="block text-white mb-1">Phone</span>
                  <div className="space-y-1">
                    <a
                      href="tel:+254768860655"
                      className="hover:text-brand-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
                    >
                      +254 768 860 655
                    </a>
                    <div>
                      <a
                        href="tel:+254782914717"
                        className="hover:text-brand-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
                      >
                        +254 782 914 717
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
          <p className="text-xs text-gray-500">
            © {currentYear} Emerson EiMS. All rights reserved.
          </p>
          <div className="flex gap-6">
            {FOOTER_LINKS.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-gray-500 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
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
