'use client';

import { useEffect, useRef } from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';

interface PowerJourneyProps {
  scrollProgress: MotionValue<number>;
  prefersReducedMotion?: boolean;
  onSectionEnter?: (section: string) => void;
}

export default function PowerJourney({ 
  scrollProgress, 
  prefersReducedMotion = false,
  onSectionEnter 
}: PowerJourneyProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Transform scroll progress for horizontal scroll effect
  const x = useTransform(scrollProgress, [0, 1], ['0%', '-50%']);

  useEffect(() => {
    // Call onSectionEnter when component mounts or scroll changes
    if (onSectionEnter) {
      onSectionEnter('journey');
    }
  }, [onSectionEnter]);

  const steps = [
    { 
      title: 'Blackout', 
      desc: 'Grid fails. Critical systems on the line. Seconds count.', 
      icon: '⚡',
      color: 'from-red-500 to-orange-500'
    },
    { 
      title: 'Intelligence Activates', 
      desc: 'Self‑diagnosis, auto‑start, prioritized loads in under 2s.', 
      icon: '🧠',
      color: 'from-amber-400 to-amber-600'
    },
    { 
      title: 'Hybrid Harmony', 
      desc: 'Solar + diesel + storage orchestrated for true zero downtime.', 
      icon: '🔁',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      title: 'Optimal Performance',
      desc: 'Continuous monitoring and adaptive optimization.',
      icon: '✨',
      color: 'from-green-400 to-emerald-500'
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="power-journey-section py-20 overflow-x-hidden bg-black relative"
      aria-label="Power Journey Narrative"
    >
      <div className="sticky top-0 h-screen flex items-center">
        <motion.div
          className="flex gap-8 px-5vw"
          style={{ x: prefersReducedMotion ? undefined : x }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ 
                delay: prefersReducedMotion ? 0 : i * 0.1, 
                duration: prefersReducedMotion ? 0 : 0.6 
              }}
              className="flex-shrink-0 w-[80vw] md:w-[60vw] lg:w-[40vw]"
            >
              <div className="relative p-8 rounded-2xl bg-gray-900/60 backdrop-blur border-2 border-gray-800 hover:border-amber-500/50 transition-colors">
                {/* Gradient overlay */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-10`} />
                
                <div className="relative z-10">
                  <div className="text-6xl mb-6 text-center" aria-hidden="true">
                    {step.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 text-lg text-center leading-relaxed">
                    {step.desc}
                  </p>
                  
                  {/* Step indicator */}
                  <div className="mt-6 flex justify-center gap-2">
                    {steps.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          idx === i ? 'bg-amber-500' : 'bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      {!prefersReducedMotion && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm font-mono">
          Scroll horizontally →
        </div>
      )}
    </section>
  );
}

