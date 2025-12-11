'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

/**
 * Emotional Narrative Component
 * Nike-level storytelling with emotional impact
 */
export default function EmotionalNarrative() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const narratives = [
    {
      id: 1,
      title: "Powering Dreams, One Generator at a Time",
      story: "In the heart of Nairobi, a hospital was losing lives to blackouts. We installed a Cummins generator in 48 hours. Today, they've had zero surgery interruptions in two years. This isn't just equipment—it's hope.",
      emotion: "Impact",
      icon: "❤️",
    },
    {
      id: 2,
      title: "Solar That Transforms Lives",
      story: "A flower farm in Naivasha was losing 30% of their harvest. With our solar solution, spoilage dropped to 2%. Export revenue increased by 60%. This is more than energy—it's transformation.",
      emotion: "Transformation",
      icon: "🌱",
    },
    {
      id: 3,
      title: "Engineering Excellence, Kenyan Pride",
      story: "For over a decade, we've been the silent force behind Kenya's growth. From data centers to farms, we power the infrastructure that powers progress. We're not just engineers—we're nation builders.",
      emotion: "Pride",
      icon: "🇰🇪",
    },
  ];

  return (
    <section ref={ref} className="py-32 px-5vw bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="font-hero text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">
            Stories That Power Kenya
          </h2>
          <p className="font-body text-xl text-gray-400 max-w-3xl mx-auto">
            Behind every generator, every solar panel, every solution—there's a story of transformation, hope, and progress.
          </p>
        </motion.div>

        <div className="space-y-24">
          {narratives.map((narrative, index) => (
            <motion.div
              key={narrative.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}
            >
              <div className="flex-1">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.3, type: 'spring' }}
                  className="text-6xl mb-6"
                >
                  {narrative.icon}
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                  className="font-display text-3xl md:text-4xl font-bold text-white mb-6"
                >
                  {narrative.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                  className="font-body text-lg md:text-xl text-gray-300 leading-relaxed"
                >
                  {narrative.story}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.7 }}
                  className="mt-6"
                >
                  <span className="inline-block px-4 py-2 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium border border-amber-500/30">
                    {narrative.emotion}
                  </span>
                </motion.div>
              </div>
              <div className="flex-1 h-64 md:h-96 bg-gradient-to-br from-amber-500/10 to-transparent rounded-2xl border border-amber-500/20 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 + 0.6 }}
                  className="text-9xl opacity-20"
                >
                  {narrative.icon}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

