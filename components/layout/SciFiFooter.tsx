'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

/**
 * Awwwards-Winning Sci-Fi Footer
 * Features: Holographic effects, animated data streams, OKLCH colors, React Spring
 */

const FOOTER_SECTIONS = [
  {
    title: 'Products',
    links: [
      { href: '/generators', label: 'Generators' },
      { href: '/solar', label: 'Solar Systems' },
      { href: '/diagnostics', label: 'Diagnostics' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { href: '/solution', label: 'Engineering Solutions' },
      { href: '/service', label: 'Services' },
      { href: '/diagnostic-suite', label: 'Diagnostic Suite' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about-us', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
      { href: '/', label: 'Home' },
    ],
  },
];

const SOCIAL_LINKS = [
  { name: 'LinkedIn', href: '#', icon: '💼' },
  { name: 'Twitter', href: '#', icon: '🐦' },
  { name: 'Facebook', href: '#', icon: '📘' },
  { name: 'YouTube', href: '#', icon: '📺' },
];

export default function SciFiFooter() {
  // Use CSS animation for glow effect instead of react-spring

  return (
    <footer className="relative bg-black border-t border-cyan-500/20 overflow-hidden">
      {/* Holographic Grid Background */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(oklch(0.75 0.20 200 / 0.2) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.75 0.20 200 / 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
        }}
      />

      {/* Animated Data Streams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-full w-px bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"
            style={{
              left: `${20 + i * 20}%`,
            }}
            animate={{
              y: ['-100%', '100%'],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + i * 0.5,
              delay: i * 0.3,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://emersoneims.com/wp-content/uploads/2025/10/cropped-Emerson-EIMS-Logo-and-Tagline-PNG-Picsart-BackgroundRemover.png"
                  alt="EmersonEIMS Logo"
                  className="w-12 h-12 object-contain"
                  style={{
                    filter: 'drop-shadow(0 0 10px oklch(0.75 0.20 200 / 0.5))',
                  }}
                />
                <div>
                  <div className="text-xl font-bold font-mono text-cyan-300 tracking-wider">
                    EMERSON<span className="text-cyan-500">EIMS</span>
                  </div>
                  <div className="text-xs text-cyan-400/60 font-mono">ENERGY SYSTEMS</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                Powering Kenya with intelligent energy infrastructure solutions since 2013.
              </p>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-gray-900 border border-cyan-500/20 flex items-center justify-center text-lg hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer Sections */}
          {FOOTER_SECTIONS.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-cyan-300 font-bold font-mono text-sm mb-4 tracking-wider uppercase">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-cyan-300 text-sm font-mono transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-cyan-300 font-bold font-mono text-sm mb-4 tracking-wider uppercase">
              Contact
            </h3>
            <ul className="space-y-3 text-sm font-mono">
              <li className="text-gray-400">
                <span className="text-cyan-400">PHONE:</span>
                <div className="mt-1">
                  <a href="tel:+254768860655" className="hover:text-cyan-300 transition-colors">
                    +254 768 860 655
                  </a>
                </div>
                <div>
                  <a href="tel:+254782914717" className="hover:text-cyan-300 transition-colors">
                    +254 782 914 717
                  </a>
                </div>
              </li>
              <li className="text-gray-400">
                <span className="text-cyan-400">EMAIL:</span>
                <div className="mt-1">
                  <a href="mailto:info@emersoneims.com" className="hover:text-cyan-300 transition-colors break-all">
                    info@emersoneims.com
                  </a>
                </div>
              </li>
              <li className="text-gray-400">
                <span className="text-cyan-400">ADDRESS:</span>
                <div className="mt-1 text-xs leading-relaxed">
                  P.O. Box 387-00521<br />
                  Old North Airport Road<br />
                  Nairobi, Kenya
                </div>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="pt-8 border-t border-cyan-500/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm font-mono">
              © 2025 EmersonEIMS. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm font-mono">
              <Link href="/privacy" className="text-gray-500 hover:text-cyan-300 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-cyan-300 transition-colors">
                Terms
              </Link>
              <Link href="/sitemap" className="text-gray-500 hover:text-cyan-300 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-mono text-cyan-400/60">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>SYSTEM ONLINE</span>
            <span className="text-gray-600">•</span>
            <span>ALL SYSTEMS OPERATIONAL</span>
          </div>
        </motion.div>
      </div>

      {/* Glowing Bottom Border */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
        style={{
          boxShadow: '0 0 10px oklch(0.75 0.20 200)',
        }}
      />
    </footer>
  );
}

