'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedImage from '@/components/effects/AnimatedImage';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServiceOverviewProps {
  title: string;
  description: string;
  image: string;
  features: string[];
  benefits: string[];
  stats?: { label: string; value: string }[];
}

export default function ServiceOverview({
  title,
  description,
  image,
  features,
  benefits,
  stats = [],
}: ServiceOverviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="space-y-12"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Hero Image */}
      <div className="relative h-96 rounded-2xl overflow-hidden">
        <AnimatedImage
          src={image}
          alt={title}
          width={1920}
          height={1080}
          animationType="parallax"
          intensity="high"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
          <p className="text-xl text-gray-300 max-w-3xl">{description}</p>
        </div>
      </div>

      {/* Stats */}
      {stats.length > 0 && (
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 border border-gray-800 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-3xl font-bold text-amber-400 mb-2">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Features & Benefits */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Key Features</h2>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-3 text-gray-300"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-amber-400 mt-1">✓</span>
                {feature}
              </motion.li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Benefits</h2>
          <ul className="space-y-3">
            {benefits.map((benefit, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-3 text-gray-300"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-green-400 mt-1">✓</span>
                {benefit}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

