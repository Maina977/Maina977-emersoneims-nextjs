'use client';

import { motion } from 'framer-motion';
import ConversionCTA from './ConversionCTA';

interface ServiceCTASectionProps {
  title: string;
  subtitle: string;
  primaryService: string;
  primaryLabel: string;
  secondaryServices?: { label: string; service: string }[];
  backgroundColor?: string;
  icon?: string;
}

export default function ServiceCTASection({
  title,
  subtitle,
  primaryService,
  primaryLabel,
  secondaryServices = [],
  backgroundColor = 'from-amber-900/50 to-orange-900/50',
  icon = '🚀'
}: ServiceCTASectionProps) {
  return (
    <section className={`py-16 bg-gradient-to-r ${backgroundColor} border-y border-amber-500/20`}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-4xl mb-4">{icon}</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {title}
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>

          {/* Main CTA */}
          <div className="mb-6">
            <ConversionCTA
              label={primaryLabel}
              service={primaryService}
              style="primary"
              size="lg"
            />
          </div>

          {/* Secondary CTAs if provided */}
          {secondaryServices.length > 0 && (
            <>
              <p className="text-white/60 text-sm mb-4">Or choose a different option:</p>
              <div className="flex flex-wrap gap-3 justify-center">
                {secondaryServices.map(svc => (
                  <ConversionCTA
                    key={svc.service}
                    label={svc.label}
                    service={svc.service}
                    style="secondary"
                    size="sm"
                  />
                ))}
              </div>
            </>
          )}

          {/* Direct Contact Option */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-white/60 text-sm mb-3">Need to speak directly?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:+254768860665"
                className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-all"
              >
                📞 +254 768 860 665
              </a>
              <a
                href="https://wa.me/254768860665?text=Hello%20EmersonEIMS%2C%20I%20would%20like%20to%20ask%20about%20your%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-all"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
