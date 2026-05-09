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
    name: "Meshack Ndata",
    role: "Procurement Manager",
    company: "St Austins Academy Nairobi",
    image: "/images/testimonials/client-1.jpg",
    quote: "EmersonEIMS delivered exceptional service for our academy. The 50kVA generator and UPS system ensures our students never face power interruptions during classes and exams.",
    rating: 5,
    project: "50kVA Generator + UPS System",
    savings: "Zero downtime during critical school activities"
  },
  {
    id: 2,
    name: "Eli Chovu",
    role: "Maintenance Manager",
    company: "Kivukoni School Kilifi",
    image: "/images/testimonials/client-2.jpg",
    quote: "The 60kVA generator installation was seamless. Their team's professionalism and technical expertise made the entire process smooth from start to finish.",
    rating: 5,
    project: "60kVA Generator Installation",
    savings: "Reliable power for coastal school operations"
  },
  {
    id: 3,
    name: "Jagtap KT",
    role: "Managing Director",
    company: "Bigot Flowers - Naivasha",
    image: "/images/testimonials/client-3.jpg",
    quote: "Running a flower farm requires consistent power. EmersonEIMS installed both 300kVA and 100kVA generators that keep our cold storage and operations running 24/7.",
    rating: 5,
    project: "300kVA + 100kVA Generator Systems",
    savings: "Continuous cold storage operation"
  },
  {
    id: 4,
    name: "Joshua Nyamai",
    role: "Maintenance Supervisor",
    company: "Afriherb Kenya Limited - Juja",
    image: "/images/testimonials/client-4.jpg",
    quote: "Our manufacturing facility demands uninterrupted power. The 300kVA installation from EmersonEIMS has been rock solid, supporting our production lines efficiently.",
    rating: 5,
    project: "300kVA Industrial Generator",
    savings: "Zero production losses"
  },
  {
    id: 5,
    name: "Collins Mwangi",
    role: "Project Manager",
    company: "AMH - Nairobi",
    image: "/images/testimonials/client-5.jpg",
    quote: "Professional service from consultation to installation. The 200kVA generator meets all our power requirements perfectly.",
    rating: 5,
    project: "200kVA Generator System",
    savings: "Reliable backup power solution"
  },
  {
    id: 6,
    name: "Diana Chumo",
    role: "Hospital Administrator",
    company: "Maua Methodist Hospital",
    image: "/images/testimonials/client-6.jpg",
    quote: "Hospital power is critical - there's no room for error. EmersonEIMS understands this. Our 200kVA generator ensures patients are never at risk from power outages.",
    rating: 5,
    project: "200kVA Hospital Power System",
    savings: "24/7 critical care power assured"
  },
  {
    id: 7,
    name: "Scholastica Akiru",
    role: "Logistics Manager",
    company: "FAO Somalia",
    image: "/images/testimonials/client-7.jpg",
    quote: "Working in challenging environments requires dependable partners. EmersonEIMS delivered and maintains our 100kVA system with excellent ongoing support.",
    rating: 5,
    project: "100kVA Generator for Operations",
    savings: "Reliable field operations support"
  },
  {
    id: 8,
    name: "Christine Awuor",
    role: "Project Manager",
    company: "Takaungu Regeneration Project - Kilifi",
    image: "/images/testimonials/client-8.jpg",
    quote: "The 44kVA generator powers our community development project efficiently. EmersonEIMS provided a solution perfectly sized for our needs and budget.",
    rating: 5,
    project: "44kVA Community Project Power",
    savings: "Sustainable project operations"
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
