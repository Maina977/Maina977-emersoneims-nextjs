'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrollReveal from '@/components/gsap/ScrollReveal';

const stories = [
  {
    title: 'Our Engineering Philosophy',
    content: 'We believe in engineering excellence that transcends specifications. Every system we design is built with the understanding that reliability isn\'t just a feature—it\'s a promise to communities, businesses, and futures.',
    stat: '12+ Years',
    statLabel: 'Of Engineering Excellence',
  },
  {
    title: 'How We Build Reliability',
    content: 'From initial consultation to final installation, our process is meticulous. We don\'t just install equipment—we engineer solutions that adapt, evolve, and exceed expectations. Every component is tested, every connection verified, every system optimized.',
    stat: '500+',
    statLabel: 'Projects Delivered',
  },
  {
    title: 'Why East Africa Trusts Us',
    content: 'We understand the unique challenges of power infrastructure in East Africa. From grid instability to remote locations, we\'ve engineered solutions that work in the real world, not just on paper.',
    stat: '98.7%',
    statLabel: 'Uptime Guarantee',
  },
  {
    title: 'Our Impact',
    content: 'Every generator that powers a hospital, every solar array that lights a school, every system that keeps a business running—these aren\'t just installations. They\'re investments in progress, resilience, and hope.',
    stat: '2,450+',
    statLabel: 'Lives Impacted',
  },
];

export default function BrandStorytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);

  return (
    <section
      ref={containerRef}
      className="relative py-32 md:py-48 overflow-hidden"
    >
      <div className="container-wide container-spacing">
        <div className="space-y-section-xl">
          {stories.map((story, index) => (
            <ScrollReveal
              key={index}
              direction="up"
              delay={index * 0.1}
              className="relative"
            >
              <motion.div
                className="grid md:grid-cols-2 gap-12 md:gap-16 items-center"
                style={index % 2 === 0 ? { y } : undefined}
              >
                {/* Content */}
                <div className={`space-y-6 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <div className="space-y-4">
                    <h2 className="text-display-2 font-display text-white">
                      {story.title}
                    </h2>
                    <p className="text-body-large text-text-secondary leading-relaxed">
                      {story.content}
                    </p>
                  </div>
                  
                  {/* Stat */}
                  <div className="pt-6 border-t border-white/10">
                    <div className="text-hero font-display gradient-text-gold">
                      {story.stat}
                    </div>
                    <div className="text-body text-text-tertiary mt-2">
                      {story.statLabel}
                    </div>
                  </div>
                </div>

                {/* Visual Placeholder */}
                <div
                  className={`h-96 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 flex items-center justify-center ${
                    index % 2 === 1 ? 'md:order-1' : ''
                  }`}
                >
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-400/30" />
                    <p className="text-text-tertiary text-sm">
                      {story.title} Visual
                    </p>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
}

