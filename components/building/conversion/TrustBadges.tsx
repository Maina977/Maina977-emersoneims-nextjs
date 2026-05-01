'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TrustBadges - Trust Building Component
 *
 * Displays trust elements to increase conversions:
 * - Warranty badges
 * - Certification badges
 * - Customer stats
 * - Testimonial carousel
 *
 * Phone: +254768860665
 */

interface Badge {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
}

const badges: Badge[] = [
  {
    id: '3-year-warranty',
    icon: '🛡️',
    title: '3-Year Warranty',
    subtitle: 'Generator Warranty Available',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: '24-7-support',
    icon: '📞',
    title: '24/7 Support',
    subtitle: 'Call +254768860665',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'nationwide',
    icon: '📍',
    title: 'Nationwide Service',
    subtitle: 'Serving All Kenya',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    id: 'free-quote',
    icon: '💬',
    title: 'Free Consultation',
    subtitle: 'No Obligation Quote',
    color: 'from-green-500 to-emerald-500',
  },
];

interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  location: string;
  rating: number;
  text: string;
  image?: string;
}

// Real testimonials will be added here as customers provide feedback
// Contact us at +254768860665 to share your experience
const testimonials: Testimonial[] = [];

interface TrustBadgesProps {
  variant?: 'full' | 'compact' | 'badges-only' | 'testimonials-only';
  className?: string;
  showTestimonials?: boolean;
}

export default function TrustBadges({
  variant = 'full',
  className = '',
  showTestimonials = true,
}: TrustBadgesProps) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-rotate testimonials (only if there are real testimonials)
  useEffect(() => {
    if (!showTestimonials || testimonials.length === 0) return;

    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [showTestimonials]);

  if (variant === 'badges-only') {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ${className}`}>
        {badges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
          >
            <span className="text-3xl mb-2 block">{badge.icon}</span>
            <h4 className="font-bold text-white text-sm">{badge.title}</h4>
            <p className="text-slate-400 text-xs mt-1">{badge.subtitle}</p>
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap justify-center gap-4 ${className}`}>
        {badges.slice(0, 4).map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50"
          >
            <span className="text-xl">{badge.icon}</span>
            <span className="text-sm font-medium text-slate-300">{badge.title}</span>
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === 'testimonials-only') {
    // Don't render if no real testimonials
    if (testimonials.length === 0) return null;
    return (
      <div className={className}>
        <TestimonialCarousel
          testimonials={testimonials}
          current={currentTestimonial}
          setCurrent={setCurrentTestimonial}
        />
      </div>
    );
  }

  // Full variant
  return (
    <div className={`space-y-12 ${className}`}>
      {/* Trust Badges */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
          Why <span className="text-amber-400">Kenya Businesses</span> Choose Us
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`relative text-center p-6 rounded-xl border border-slate-700/50 bg-gradient-to-br ${badge.color} bg-opacity-10 overflow-hidden group`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
              <span className="relative text-4xl mb-3 block">{badge.icon}</span>
              <h4 className="relative font-bold text-white">{badge.title}</h4>
              <p className="relative text-slate-300 text-sm mt-1">{badge.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials - only show if real testimonials exist */}
      {showTestimonials && testimonials.length > 0 && (
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
            What Our <span className="text-amber-400">Customers Say</span>
          </h2>
          <TestimonialCarousel
            testimonials={testimonials}
            current={currentTestimonial}
            setCurrent={setCurrentTestimonial}
          />
        </div>
      )}
    </div>
  );
}

// Testimonial Carousel Component
function TestimonialCarousel({
  testimonials,
  current,
  setCurrent,
}: {
  testimonials: Testimonial[];
  current: number;
  setCurrent: (index: number) => void;
}) {
  const testimonial = testimonials[current];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 md:p-10 border border-slate-700/50">
        {/* Quote Icon */}
        <div className="absolute top-6 left-6 text-6xl text-amber-500/20">"</div>

        <AnimatePresence mode="wait">
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < testimonial.rating ? 'text-amber-400' : 'text-slate-600'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-lg md:text-xl text-white leading-relaxed mb-6">
              "{testimonial.text}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-xl">
                {testimonial.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-white">{testimonial.name}</p>
                <p className="text-slate-400 text-sm">
                  {testimonial.role}, {testimonial.company}
                </p>
                <p className="text-slate-500 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {testimonial.location}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === current
                  ? 'bg-amber-500 w-8'
                  : 'bg-slate-600 hover:bg-slate-500'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrent((current - 1 + testimonials.length) % testimonials.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-700/50 text-white hover:bg-slate-600/50 transition-colors hidden md:block"
          aria-label="Previous testimonial"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setCurrent((current + 1) % testimonials.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-700/50 text-white hover:bg-slate-600/50 transition-colors hidden md:block"
          aria-label="Next testimonial"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Export badges and testimonials for use elsewhere
export { badges, testimonials };

// Export a simple inline trust strip - only verifiable claims
export function TrustStrip({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm ${className}`}>
      <span className="flex items-center gap-1 text-slate-400">
        <span className="text-green-500">✓</span> 3-Year Warranty
      </span>
      <span className="flex items-center gap-1 text-slate-400">
        <span className="text-green-500">✓</span> 24/7 Support
      </span>
      <span className="flex items-center gap-1 text-slate-400">
        <span className="text-green-500">✓</span> Nationwide Service
      </span>
      <span className="flex items-center gap-1 text-slate-400">
        <span className="text-green-500">✓</span> Free Consultation
      </span>
    </div>
  );
}
