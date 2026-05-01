'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * ServiceCTA - Powerful Call-to-Action Component
 *
 * A conversion-focused CTA component with:
 * - WhatsApp integration with pre-filled messages
 * - Click-to-call functionality
 * - Urgency messaging
 * - Trust badges
 *
 * Phone: +254768860665
 */

interface ServiceCTAProps {
  service?: string;
  location?: string;
  urgencyText?: string;
  showTrustBadges?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'hero';
}

const PHONE_NUMBER = '+254768860665';
const WHATSAPP_NUMBER = '254768860665';

const trustBadges = [
  { icon: '✓', text: '3-Year Warranty' },
  { icon: '✓', text: '24/7 Emergency Support' },
  { icon: '✓', text: 'Nationwide Service' },
  { icon: '✓', text: 'Free Consultation' },
];

export default function ServiceCTA({
  service = 'power solutions',
  location = 'Kenya',
  urgencyText = 'Limited Time: 3-Year Warranty on All Cummins Generators',
  showTrustBadges = true,
  className = '',
  variant = 'default',
}: ServiceCTAProps) {
  const [isHovered, setIsHovered] = useState<'whatsapp' | 'call' | null>(null);

  const whatsappMessage = encodeURIComponent(
    `Hello EmersonEIMS! I'm interested in ${service}${location !== 'Kenya' ? ` in ${location}` : ''}. Please send me a FREE quote and more information. Thank you!`
  );

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;
  const callUrl = `tel:${PHONE_NUMBER}`;

  if (variant === 'compact') {
    return (
      <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Get FREE Quote
        </a>
        <a
          href={callUrl}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call Now
        </a>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 border border-slate-700/50 ${className}`}>
      {/* Urgency Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg p-3 mb-6 text-center"
      >
        <p className="text-amber-400 font-semibold flex items-center justify-center gap-2 text-sm md:text-base">
          <span className="animate-pulse">⚡</span>
          {urgencyText}
          <span className="animate-pulse">⚡</span>
        </p>
      </motion.div>

      {/* Main CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* WhatsApp Button */}
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 relative overflow-hidden group"
          onMouseEnter={() => setIsHovered('whatsapp')}
          onMouseLeave={() => setIsHovered(null)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 group-hover:from-green-400 group-hover:to-green-500 transition-all rounded-xl" />
          <div className="relative flex items-center justify-center gap-3 px-6 py-4 text-white font-bold">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <div className="flex flex-col items-start">
              <span className="text-lg">Get FREE Quote Now</span>
              <span className="text-xs opacity-80">Reply in under 5 minutes</span>
            </div>
          </div>
          {isHovered === 'whatsapp' && (
            <motion.div
              className="absolute inset-0 bg-white/10"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </motion.a>

        {/* Call Button */}
        <motion.a
          href={callUrl}
          className="flex-1 relative overflow-hidden group"
          onMouseEnter={() => setIsHovered('call')}
          onMouseLeave={() => setIsHovered(null)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:from-blue-400 group-hover:to-blue-500 transition-all rounded-xl" />
          <div className="relative flex items-center justify-center gap-3 px-6 py-4 text-white font-bold">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <div className="flex flex-col items-start">
              <span className="text-lg">Call Now</span>
              <span className="text-xs opacity-80">{PHONE_NUMBER}</span>
            </div>
          </div>
          {isHovered === 'call' && (
            <motion.div
              className="absolute inset-0 bg-white/10"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </motion.a>
      </div>

      {/* Phone Number Display */}
      <div className="text-center mb-6">
        <p className="text-slate-400 text-sm mb-1">Or call us directly:</p>
        <a
          href={callUrl}
          className="text-2xl md:text-3xl font-bold text-white hover:text-amber-400 transition-colors"
        >
          {PHONE_NUMBER}
        </a>
      </div>

      {/* Trust Badges */}
      {showTrustBadges && (
        <div className="grid grid-cols-2 gap-3">
          {trustBadges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/50 rounded-lg px-3 py-2"
            >
              <span className="text-green-500 font-bold">{badge.icon}</span>
              <span>{badge.text}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// Export a Hero variant for landing pages
export function HeroServiceCTA({
  service = 'power solutions',
  location = 'Kenya',
}: {
  service?: string;
  location?: string;
}) {
  const whatsappMessage = encodeURIComponent(
    `Hello EmersonEIMS! I need ${service}${location !== 'Kenya' ? ` in ${location}` : ''}. Please call me back with a FREE quote!`
  );

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Main CTA */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
        <motion.a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Get FREE Quote Now
        </motion.a>
        <motion.a
          href={`tel:${PHONE_NUMBER}`}
          className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call: {PHONE_NUMBER}
        </motion.a>
      </div>

      {/* Urgency Text */}
      <motion.p
        className="text-amber-400 font-semibold text-center"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Limited Time: 3-Year Warranty + FREE Installation Consultation
      </motion.p>

      {/* Trust Indicators */}
      <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
        <span className="flex items-center gap-1">
          <span className="text-green-500">✓</span> 3-Year Warranty
        </span>
        <span className="flex items-center gap-1">
          <span className="text-green-500">✓</span> 24/7 Support
        </span>
        <span className="flex items-center gap-1">
          <span className="text-green-500">✓</span> Nationwide Service
        </span>
        <span className="flex items-center gap-1">
          <span className="text-green-500">✓</span> Free Consultation
        </span>
      </div>
    </div>
  );
}
