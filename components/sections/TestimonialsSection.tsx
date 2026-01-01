'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  quote: string;
  rating: number;
  project: string;
  savings?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Dr. James Mwangi",
    role: "Facilities Director",
    company: "Nairobi Hospital",
    image: "/images/testimonials/hospital-director.jpg",
    quote: "EmersonEIMS transformed our power infrastructure. Zero downtime in critical care units since installation. Their diagnostic system caught a potential failure 3 days before it would have happened.",
    rating: 5,
    project: "500kVA Generator + UPS System",
    savings: "KES 12M saved in prevented downtime"
  },
  {
    id: 2,
    name: "Sarah Odhiambo",
    role: "Operations Manager",
    company: "Bidco Africa",
    image: "/images/testimonials/factory-manager.jpg",
    quote: "The 24/7 monitoring and instant fault detection has been a game-changer. Production uptime increased from 94% to 99.7%. Best investment we've made.",
    rating: 5,
    project: "2000kVA Industrial Power System",
    savings: "KES 45M annual savings"
  },
  {
    id: 3,
    name: "Peter Kimani",
    role: "CEO",
    company: "Safari Hotels Group",
    image: "/images/testimonials/hotel-ceo.jpg",
    quote: "From Mombasa to Nairobi, EmersonEIMS powers all our properties. The solar-generator hybrid reduced our energy costs by 40%. Guests never experience power issues.",
    rating: 5,
    project: "Hybrid Solar + Generator across 8 properties",
    savings: "40% energy cost reduction"
  },
  {
    id: 4,
    name: "Grace Wanjiku",
    role: "Managing Director",
    company: "Wanjiku Farms Ltd",
    image: "/images/testimonials/farm-director.jpg",
    quote: "Our cold storage facilities run 24/7 without interruption. The remote monitoring means I can check system status from anywhere. Truly world-class service.",
    rating: 5,
    project: "Agricultural Cold Storage Power System",
    savings: "Zero crop losses since 2023"
  },
  {
    id: 5,
    name: "Mohammed Ali",
    role: "Technical Director",
    company: "Mombasa Port Authority",
    image: "/images/testimonials/port-director.jpg",
    quote: "Critical port operations require 100% uptime. EmersonEIMS delivered and maintains our entire power infrastructure. The diagnostic cockpit is phenomenal.",
    rating: 5,
    project: "Multi-site Port Power Infrastructure",
    savings: "99.97% uptime achieved"
  }
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section className="py-24 sm:py-32 bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.08),transparent_60%)]" />
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
        backgroundSize: '48px 48px',
      }} />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-amber-500 text-sm uppercase tracking-[0.3em] mb-4 block font-medium">
            Client Success Stories
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Trusted by
            <span className="text-transparent bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text"> Industry Leaders</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            From hospitals to factories, hotels to farms — see why East Africa&apos;s top organizations choose EmersonEIMS.
          </p>
        </motion.div>

        {/* Main testimonial display */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Quote side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* Quote mark */}
                <div className="absolute -top-8 -left-4 text-8xl text-amber-500/20 font-serif">&ldquo;</div>
                
                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className={`text-2xl ${i < activeTestimonial.rating ? 'text-amber-400' : 'text-gray-600'}`}
                    >
                      ★
                    </motion.span>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-xl sm:text-2xl lg:text-3xl text-white font-light leading-relaxed mb-8">
                  &ldquo;{activeTestimonial.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-cyan-500/20 flex items-center justify-center text-2xl border border-amber-500/30">
                    {activeTestimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-lg">{activeTestimonial.name}</div>
                    <div className="text-gray-400 text-sm">{activeTestimonial.role}</div>
                    <div className="text-amber-400 text-sm font-medium">{activeTestimonial.company}</div>
                  </div>
                </div>

                {/* Project details */}
                <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Project</div>
                      <div className="text-white font-medium">{activeTestimonial.project}</div>
                    </div>
                    {activeTestimonial.savings && (
                      <div className="text-right">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Impact</div>
                        <div className="text-amber-400 font-bold">{activeTestimonial.savings}</div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Navigation side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {testimonials.map((testimonial, index) => (
              <motion.button
                key={testimonial.id}
                onClick={() => {
                  setActiveIndex(index);
                  setIsAutoPlaying(false);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                  index === activeIndex
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/10'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                    index === activeIndex
                      ? 'bg-amber-500 text-black'
                      : 'bg-white/10 text-white'
                  }`}>
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium truncate ${index === activeIndex ? 'text-white' : 'text-gray-400'}`}>
                      {testimonial.name}
                    </div>
                    <div className={`text-sm truncate ${index === activeIndex ? 'text-amber-400' : 'text-gray-500'}`}>
                      {testimonial.company}
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-amber-400 text-xs">★</span>
                    ))}
                  </div>
                </div>
              </motion.button>
            ))}

            {/* Auto-play indicator */}
            <div className="flex items-center justify-center gap-2 pt-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeIndex ? 'w-8 bg-amber-500' : 'w-1.5 bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 p-8 rounded-2xl bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10 border border-amber-500/20"
        >
          {[
            { value: '4.9/5', label: 'Average Rating', icon: '⭐' },
            { value: '500+', label: 'Projects Completed', icon: '✅' },
            { value: '98.7%', label: 'Client Retention', icon: '🤝' },
            { value: '24/7', label: 'Support Available', icon: '📞' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl sm:text-3xl font-bold text-amber-400">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
