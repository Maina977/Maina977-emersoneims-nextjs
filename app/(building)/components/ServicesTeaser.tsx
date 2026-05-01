// /components/sections/ServicesTeaser.tsx
'use client';

import { motion } from 'framer-motion';
import { EngineIcon, SolarIcon, UPSIcon } from '@/components/ui/Icons';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Schema.org JSON-LD for rich results (Service)
const ServiceSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'YourEnergyCo',
        url: 'https://yourenergyco.com',
        sameAs: [],
        serviceArea: { '@type': 'Country', name: 'United States' },
        offers: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Cummins Generator Sales',
              description: 'Prime, standby, and hybrid-ready generator sets with DeepSea/PowerWizard controls.',
              serviceType: 'Power Generation'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Solar Energy Solutions',
              description: 'Grid-tied, hybrid, and off-grid solar systems with intelligent load orchestration.',
              serviceType: 'Renewable Energy'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'UPS & Power Quality',
              description: 'Clean, uninterrupted power: sizing, runtime, and harmonics mitigation.',
              serviceType: 'Power Protection'
            }
          }
        ]
      })
    }}
  />
);

export default function ServicesTeaser() {
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = Boolean(prefersReducedMotion);

  const items = [
    {
      title: 'Cummins Generator Sales',
      desc: 'Prime, standby & hybrid-ready sets — with DeepSea/PowerWizard intelligence.',
      href: '/generators',
      icon: <EngineIcon reducedMotion={shouldReduceMotion} />,
      benefit: 'Reliability that outlasts the grid.',
    },
    {
      title: 'Solar Energy Solutions',
      desc: 'Grid-tied, hybrid & off-grid systems — solar that learns your rhythm.',
      href: '/solar',
      icon: <SolarIcon reducedMotion={shouldReduceMotion} />,
      benefit: 'Energy independence, engineered.',
    },
    {
      title: 'UPS & Power Quality',
      desc: 'Clean, uninterrupted power — harmonics tamed, uptime guaranteed.',
      href: '/solutions/ups',
      icon: <UPSIcon reducedMotion={shouldReduceMotion} />,
      benefit: 'Zero flicker. Zero compromise.',
    },
  ];

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="py-28 px-4 bg-gradient-to-b from-gray-950 via-black to-gray-950 overflow-hidden relative"
    >
      {/* Subtle animated grid background (Tesla/Awwwards style) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            `linear-gradient(rgba(255,215,100,0.1) 1px, transparent 1px),
             linear-gradient(90deg, rgba(255,215,100,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          animation: shouldReduceMotion ? 'none' : 'gridDrift 120s linear infinite',
        }}
      />

      <style jsx>{`
        @keyframes gridDrift {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto relative">
        <ServiceSchema />

        <motion.h2
          id="services-heading"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: 'easeOut' }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 tracking-tight"
        >
          Discover Our{' '}
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
            Core Services
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: shouldReduceMotion ? 0 : 0.6 }}
          className="text-gray-400 text-lg max-w-3xl mx-auto text-center mb-16"
        >
          Engineered for resilience. Designed for tomorrow.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((card, i) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              whileInView={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: {
                  delay: i * 0.12,
                  duration: shouldReduceMotion ? 0 : 0.7,
                  ease: [0.16, 1, 0.3, 1] // Apple-style ease-out-elastic-lite
                }
              }}
              viewport={{ once: true }}
              className="group relative p-7 bg-gray-900/40 backdrop-blur-sm border border-gray-800/60 rounded-2xl overflow-hidden transition-all duration-500"
              aria-labelledby={`card-title-${i}`}
              aria-describedby={`card-desc-${i}`}
            >
              {/* Depth glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10">
                <div className="mb-5 transition-transform duration-500 group-hover:scale-105">
                  {card.icon}
                </div>
                <h3
                  id={`card-title-${i}`}
                  className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors"
                >
                  {card.title}
                </h3>
                <p id={`card-desc-${i}`} className="text-gray-400 mb-3">
                  {card.desc}
                </p>
                <p className="text-sm text-amber-400/80 italic mb-5">
                  {card.benefit}
                </p>

                {/* Sci-Fi CTA */}
                <motion.a
                  href={card.href}
                  aria-label={`${card.title} — ${card.benefit}`}
                  className="inline-flex items-center gap-2 text-amber-400 font-semibold group/link"
                  whileHover={!shouldReduceMotion ? { x: 6 } : {}}
                  whileTap={!shouldReduceMotion ? { scale: 0.96 } : {}}
                  transition={!shouldReduceMotion ? { type: 'spring', stiffness: 500, damping: 25 } : {}}
                >
                  <span>Explore</span>
                  <motion.svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    initial={{ x: 0, rotate: 0 }}
                    whileHover={!shouldReduceMotion ? { x: 4, rotate: 15 } : {}}
                    whileTap={!shouldReduceMotion ? { scale: 0.8 } : {}}
                    transition={!shouldReduceMotion ? { type: 'spring', stiffness: 600, damping: 20 } : {}}
                  >
                    <path
                      d="M5 12h12M12 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Animated trail on hover */}
                    <motion.path
                      d="M5 12 Q10 8,15 12 Q10 16,5 12"
                      stroke="currentColor"
                      strokeWidth="1"
                      fill="none"
                      strokeDasharray="0 20"
                      initial={{ strokeDasharray: '0 20' }}
                      whileHover={!shouldReduceMotion ? { strokeDasharray: '20 0' } : {}}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                      className="text-amber-400/50"
                    />
                  </motion.svg>
                </motion.a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
