// app/page.tsx - AWWWARDS SOTD: "EmersonEIMS - Power Redefined"
'use client';

import { Suspense, lazy, useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const MicroInteractions = lazy(() => import('@/components/interactions/MicroInteractions'));

export default function AwwwardsHomepage() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  
  return (
    <>
      <Suspense fallback={null}>
        <MicroInteractions intensity="high" theme="engineering" />
      </Suspense>
      
      <motion.div 
        ref={containerRef}
        className="relative bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        
        {/* HERO: FULL-SCREEN VIDEO */}
        <motion.section 
          className="relative h-screen overflow-hidden"
          style={{ scale: heroScale, opacity: heroOpacity }}
        >
          <video
            autoPlay loop muted playsInline
            onLoadedData={() => setVideoLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover scale-110"
            poster="/images/GEN%202-1920x1080.png"
          >
            <source src="/videos/FOR%20TRIALS%20IN%20KADENCE.mp4" type="video/mp4" />
          </video>
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(251,191,36,0.1),transparent_60%)]" />
          
          <motion.div
            className="relative z-20 h-full flex flex-col items-center justify-center px-6 sm:px-12 text-center"
            style={{ y: textY }}
          >
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: videoLoaded ? 1 : 0, y: 0, scale: 1 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="max-w-7xl"
            >
              <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[14rem] font-bold mb-8 leading-none tracking-tighter">
                <span className="block bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">
                  POWER
                </span>
                <span className="block text-amber-500 font-light">REDEFINED</span>
              </h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-2xl sm:text-3xl md:text-4xl text-gray-200 font-light mb-16 max-w-4xl mx-auto"
              >
                Premium Energy Solutions. Engineering-Grade Reliability. Built for East Africa.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                className="flex flex-col sm:flex-row gap-6 justify-center"
              >
                <Link 
                  href="/solution"
                  className="group px-12 py-6 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xl font-bold rounded-full hover:scale-105 transition-all duration-500"
                >
                  Explore Solutions
                </Link>
                <Link 
                  href="/contact"
                  className="px-12 py-6 border-2 border-white text-white text-xl font-bold rounded-full hover:bg-white hover:text-black transition-all duration-500"
                >
                  Get Started
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          >
            <div className="w-8 h-14 border-2 border-white/40 rounded-full flex justify-center pt-3">
              <div className="w-1.5 h-3 bg-white/60 rounded-full" />
            </div>
          </motion.div>
        </motion.section>

        {/* SECTION 1: TESLA-SIZED IMAGE - Generators */}
        <section className="relative py-40 bg-black">
          <div className="max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-24">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
            >
              <Image
                src="/images/GEN%202-1920x1080.png"
                alt="Power Generation"
                width={1920}
                height={1080}
                className="w-full h-[90vh] object-cover rounded-3xl"
                priority
              />
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: Apple-Style Text Block */}
        <section className="py-40 bg-black">
          <div className="max-w-6xl mx-auto px-6 sm:px-12">
            <motion.h2
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white text-center mb-16 leading-tight"
            >
              Engineering Excellence<br/>Meets Reliability
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl text-gray-300 text-center leading-relaxed font-light"
            >
              Over 15 years powering East Africa's critical infrastructure. From 20kVA residential systems to 2000kVA industrial installations. 98.7% uptime guaranteed.
            </motion.p>
          </div>
        </section>

        {/* SECTION 3: Split Layout - Solar */}
        <section className="py-40 bg-black">
          <div className="max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-24">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-none">
                  Solar<br/>Innovation
                </h2>
                <div className="w-20 h-1 bg-amber-500 mb-8" />
                <p className="text-xl sm:text-2xl text-gray-300 leading-relaxed">
                  Harnessing Kenya's 5.5-5.9 kWh/m²/day solar irradiance. Tier-1 panels. Tesla Powerwall integration. 3-4 year ROI.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                <Image
                  src="/images/solar%20power%20farms.png"
                  alt="Solar Power"
                  width={1920}
                  height={1280}
                  className="w-full h-[600px] object-cover rounded-3xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Full-Width Feature Image */}
        <section className="py-40 bg-black">
          <div className="max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="relative h-[85vh] rounded-3xl overflow-hidden"
            >
              <Image
                src="/images/solar%20changeover%20control.png"
                alt="Control Systems"
                width={1920}
                height={1280}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-12 lg:p-20">
                <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6">
                  Intelligent Control Systems
                </h2>
                <p className="text-2xl text-gray-200 max-w-3xl">
                  DeepSea & PowerWizard automation. Remote monitoring. Predictive maintenance. 24/7 support.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 5: Stats - Apple Style */}
        <section className="py-40 bg-black">
          <div className="max-w-7xl mx-auto px-6 sm:px-12">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-16">
              {[
                { num: '500+', label: 'Projects Delivered' },
                { num: '98.7%', label: 'System Uptime' },
                { num: '47', label: 'Counties Served' },
                { num: '15+', label: 'Years Experience' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-6xl sm:text-7xl font-bold text-amber-500 mb-4">{stat.num}</div>
                  <div className="text-xl text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-40 bg-gradient-to-b from-black to-amber-950/20">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-12"
            >
              Ready to Power Your Future?
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link 
                href="/contact"
                className="inline-block px-16 py-7 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-2xl font-bold rounded-full hover:scale-105 transition-all duration-500"
              >
                Get Your Free Consultation
              </Link>
            </motion.div>
          </div>
        </section>

      </motion.div>
    </>
  );
}
