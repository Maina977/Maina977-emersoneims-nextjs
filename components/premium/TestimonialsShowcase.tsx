'use client';

/**
 * APPLE-LEVEL TESTIMONIALS SHOWCASE
 * Premium testimonials with cinematic animations
 */

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const testimonials = [
  {
    id: 1,
    name: "Dr. Sarah Kimani",
    title: "Chief Operations Officer",
    company: "Kenyatta National Hospital",
    image: "/testimonials/hospital-director.jpg",
    quote: "EmersonEIMS saved us from critical blackouts. Their emergency generator installation during our power crisis was executed flawlessly in 48 hours. 100% uptime for 3 years now.",
    impact: "24/7 Hospital Operations",
    rating: 5,
    logo: "/clients/knh-logo.svg"
  },
  {
    id: 2,
    name: "James Mwangi",
    title: "Facility Manager",
    company: "Nairobi International School",
    image: "/testimonials/school-manager.jpg",
    quote: "Their solar-hybrid solution cut our energy costs by 65%. The system paid for itself in 18 months. EmersonEIMS delivers on every promise.",
    impact: "65% Cost Reduction",
    rating: 5,
    logo: "/clients/nis-logo.svg"
  },
  {
    id: 3,
    name: "Grace Ochieng",
    title: "Operations Director",
    company: "Sian Flower Farm",
    image: "/testimonials/farm-director.jpg",
    quote: "Powering 15 hectares of greenhouses 24/7 is critical. EmersonEIMS's solution is so reliable, we've expanded to 3 more farms with them.",
    impact: "15 Hectares Powered",
    rating: 5,
    logo: "/clients/sian-logo.svg"
  },
  {
    id: 4,
    name: "Eng. David Mugo",
    title: "Technical Director",
    company: "National Transport Authority",
    image: "/testimonials/ntsa-engineer.jpg",
    quote: "Mission-critical infrastructure demands perfection. EmersonEIMS's diagnostic suite predicted a failure 3 weeks before it could happen. That's the level of service Kenya needs.",
    impact: "Zero Downtime",
    rating: 5,
    logo: "/clients/ntsa-logo.svg"
  },
  {
    id: 5,
    name: "Peter Kamau",
    title: "General Manager",
    company: "Bamburi Cement",
    image: "/testimonials/cement-gm.jpg",
    quote: "Industrial-grade power for 24/7 production. EmersonEIMS's 2.5MW system handles our heavy loads without breaking a sweat. True engineering excellence.",
    impact: "2.5MW Industrial Power",
    rating: 5,
    logo: "/clients/bamburi-logo.svg"
  },
  {
    id: 6,
    name: "Hotel Management",
    title: "Operations Director",
    company: "Lenchada Group of Hotels",
    image: "/testimonials/hotel-officer.jpg",
    quote: "Eco-friendly luxury demands smart energy. Their solar-battery-generator hybrid is elegant, silent, and 100% reliable. Our guests never know we run on backup.",
    impact: "Eco-Luxury Power",
    rating: 5,
    logo: "/clients/lenchada-logo.svg"
  }
];

export default function TestimonialsShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen py-32 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 2px 2px, rgba(14, 165, 233, 0.3) 1px, transparent 0)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 max-w-7xl mx-auto px-6"
      >
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-6">
              Trusted by Kenya's Leaders
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              From hospitals to industrial plants, EmersonEIMS powers the infrastructure that powers Kenya.
            </p>
          </motion.div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 h-full hover:border-cyan-400/50 transition-all duration-500">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/0 to-cyan-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-gray-300 text-lg mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Impact Badge */}
                  <div className="inline-block bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 mb-6">
                    <span className="text-cyan-400 font-semibold text-sm">
                      {testimonial.impact}
                    </span>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-700">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-2xl font-bold text-white">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.title}</div>
                      <div className="text-xs text-cyan-400">{testimonial.company}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '500+', label: 'Projects Completed' },
            { value: '99.9%', label: 'Uptime Guarantee' },
            { value: '24/7', label: 'Support Available' },
            { value: '47', label: 'Counties Served' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
