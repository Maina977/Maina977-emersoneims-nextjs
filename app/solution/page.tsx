'use client'

import { useState, useMemo, useEffect, useRef, Suspense, lazy } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from "next/link";
import OptimizedImage from "@/components/media/OptimizedImage";
import OptimizedVideo from "@/components/media/OptimizedVideo";
import AnimatedImage from "@/components/effects/AnimatedImage";
import HolographicLaser from "@/components/effects/HolographicLaser";
import { SectionLead } from "@/components/generators";
import CTAButton from "@/components/shared/CTAButton";
import { useReducedMotion } from '@/hooks/useReducedMotion';
import PerformanceMonitor from '@/components/performance/PerformanceMonitor';
import { usePerformanceTier } from '@/components/performance/usePerformanceTier';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SimpleThreeScene = lazy(() => import('@/components/webgl/SimpleThreeScene'));
const CustomCursor = lazy(() => import('@/components/interactions/CustomCursor'));

interface Solution {
  href: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  features: string[];
  image?: string;
}

const SOLUTIONS: Solution[] = [
  { 
    href: "/solution/generators", 
    label: "Diesel Generators", 
    description: "Comprehensive generator solutions from 20kVA to 2000kVA",
    icon: "?",
    color: "from-yellow-500 to-yellow-600",
    category: "Power Generation",
    features: ["Load testing", "Maintenance", "Installation", "24/7 support"],
    image: "/images/GEN%202-1920x1080.png"
  },
  { 
    href: "/service#opt", 
    label: "Controls (DeepSea & PowerWizard)", 
    description: "Advanced control systems for generator automation",
    icon: "???",
    color: "from-blue-500 to-blue-600",
    category: "Automation",
    features: ["Remote monitoring", "Auto-start", "Load management", "Alarm systems"],
    image: "/images/solar%20changeover%20control.png"
  },
  { 
    href: "/solution/solar", 
    label: "Solar Technical Issues", 
    description: "Expert diagnosis and resolution of solar system problems",
    icon: "??",
    color: "from-orange-500 to-orange-600",
    category: "Solar",
    features: ["Fault diagnosis", "Performance optimization", "Repairs", "Upgrades"],
    image: "/images/solar%20power%20farms.png"
  },
  { 
    href: "/solar", 
    label: "Solar Sizing", 
    description: "Precise solar system sizing for optimal performance",
    icon: "??",
    color: "from-green-500 to-green-600",
    category: "Solar",
    features: ["Load analysis", "System design", "ROI calculation", "Warranty"],
    image: "https://www.emersoneims.com/wp-content/uploads/2025/11/solar-sizing.jpg"
  },
  { 
    href: "/diagnostic-suite", 
    label: "Power Interruptions", 
    description: "Solutions for reliable power during grid outages",
    icon: "??",
    color: "from-red-500 to-red-600",
    category: "Power Quality",
    features: ["Backup systems", "UPS integration", "Generator backup", "Monitoring"],
    image: "https://www.emersoneims.com/wp-content/uploads/2025/11/power-quality.jpg"
  },
  { 
    href: "/service#hvac", 
    label: "AC Systems", 
    description: "Complete air conditioning solutions and maintenance",
    icon: "??",
    color: "from-cyan-500 to-cyan-600",
    category: "HVAC",
    features: ["Installation", "Maintenance", "Repairs", "Energy efficiency"],
    image: "https://www.emersoneims.com/wp-content/uploads/2025/11/ac-systems.jpg"
  },
  { 
    href: "/service#ups", 
    label: "UPS Systems", 
    description: "Uninterruptible power supply systems for critical loads",
    icon: "??",
    color: "from-purple-500 to-purple-600",
    category: "Power Quality",
    features: ["Battery backup", "Voltage regulation", "Surge protection", "Monitoring"],
    image: "https://www.emersoneims.com/wp-content/uploads/2025/11/ups-systems.jpg"
  },
  { 
    href: "/service#opt", 
    label: "Diesel Automation", 
    description: "Automated generator control and monitoring systems",
    icon: "??",
    color: "from-indigo-500 to-indigo-600",
    category: "Automation",
    features: ["Auto-start/stop", "Load sharing", "Remote control", "Data logging"],
    image: "https://www.emersoneims.com/wp-content/uploads/2025/11/automation.jpg"
  },
  { 
    href: "/service#water", 
    label: "Borehole Pumps", 
    description: "Water pumping solutions for residential and commercial use",
    icon: "??",
    color: "from-blue-400 to-blue-500",
    category: "Water Systems",
    features: ["Installation", "Maintenance", "Repairs", "Efficiency optimization"],
    image: "https://www.emersoneims.com/wp-content/uploads/2025/11/pumps.jpg"
  },
  { 
    href: "/service#incin", 
    label: "Incinerators", 
    description: "Waste management and incineration solutions",
    icon: "??",
    color: "from-orange-600 to-orange-700",
    category: "Waste Management",
    features: ["Installation", "Maintenance", "Compliance", "Efficiency"],
    image: "https://www.emersoneims.com/wp-content/uploads/2025/11/incinerators.jpg"
  },
  { 
    href: "/service#motor", 
    label: "Motors & Rewinding", 
    description: "Motor repair, rewinding, and maintenance services",
    icon: "??",
    color: "from-gray-500 to-gray-600",
    category: "Maintenance",
    features: ["Rewinding", "Repairs", "Maintenance", "Testing"],
    image: "https://www.emersoneims.com/wp-content/uploads/2025/11/motors.jpg"
  },
];

const CATEGORIES = ["All", "Power Generation", "Solar", "Automation", "Power Quality", "HVAC", "Water Systems", "Waste Management", "Maintenance"];

export default function SolutionsHome() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const prefersReducedMotion = useReducedMotion();
  const { isLite } = usePerformanceTier();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // GSAP ScrollTrigger animations
  useEffect(() => {
    if (!containerRef.current) return;

    const sections = containerRef.current.querySelectorAll('section');
    
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const filteredSolutions = useMemo(() => {
    return SOLUTIONS.filter(solution => {
      const matchesCategory = selectedCategory === "All" || solution.category === selectedCategory;
      const matchesSearch = solution.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           solution.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

	const uniqueSolutions = useMemo(() => {
		return filteredSolutions.filter(
			(solution, index, self) => index === self.findIndex((s) => s.href === solution.href)
		);
	}, [filteredSolutions]);

  // 5 Paragraphs of Verified Content

  return (
    <main ref={containerRef} className="eims-section min-h-screen relative">
      {/* Performance Monitor */}
      <PerformanceMonitor />

      {/* Premium Custom Cursor */}
      {!isLite && (
        <Suspense fallback={null}>
          <CustomCursor enabled={!prefersReducedMotion} />
        </Suspense>
      )}

      <main ref={containerRef} className="eims-section min-h-screen relative">
        {/* Holographic Laser Overlay */}
        {!isLite && <HolographicLaser intensity="high" color="#fbbf24" />}
        
        {/* 3D Background Scene */}
        {!isLite && (
          <Suspense fallback={null}>
            <div className="fixed inset-0 -z-10 opacity-20">
              <SimpleThreeScene />
            </div>
          </Suspense>
        )}

      {/* AWWWARDS HERO: Full-screen Video with Apple Spacing */}
      <motion.section 
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{ opacity: heroOpacity }}
      >
        <OptimizedVideo
          src="/videos/Solution(1).mp4"
          poster="/images/GEN%202-1920x1080.png"
          autoPlay={!prefersReducedMotion && !isLite}
          loop={true}
          muted={true}
          playsInline={true}
          className="absolute inset-0 w-full h-full object-cover scale-105"
          priority={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(251,191,36,0.15),transparent_70%)]" />
        
        <motion.div
          className="relative z-20 px-6 sm:px-12 lg:px-24 text-center max-w-[1400px] mx-auto"
          style={{ y: parallaxY }}
        >
          <motion.h1
            className="text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] font-bold mb-12 bg-gradient-to-r from-[#fbbf24] via-white to-[#fbbf24] bg-clip-text text-transparent font-display tracking-tighter leading-none"
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            SOLUTIONS
          </motion.h1>
          <motion.p
            className="text-2xl sm:text-3xl md:text-4xl text-gray-200 mb-12 max-w-5xl mx-auto font-light leading-relaxed"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Your Engineering Bible: Comprehensive Energy Infrastructure Solutions
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link 
              href="#solutions" 
              className="px-12 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-lg font-bold rounded-full hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-300"
            >
              Explore Solutions
            </Link>
            <Link 
              href="/contact" 
              className="px-12 py-5 bg-transparent border-2 border-white text-white text-lg font-bold rounded-full hover:bg-white hover:text-black transition-all duration-300"
            >
              Get Started
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Scroll indicator - Apple style */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ opacity: { delay: 1.5 }, y: { repeat: Infinity, duration: 2 } }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </motion.section>

      {/* CONTENT SECTION: Apple Spacing + Tesla Images */}
      <section id="solutions" className="py-32 bg-black relative overflow-hidden">
        {/* Spacer - Apple style */}
        <div className="h-24" />
        
        <div className="max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-24">
          {/* First: Full-width Tesla-sized Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-40"
          >
            <OptimizedImage
              src="/images/GEN%202-1920x1080.png"
              alt="Generator Solutions - Engineering Excellence"
              width={1920}
              height={1080}
              className="w-full h-[70vh] sm:h-[80vh] lg:h-[90vh] object-cover rounded-3xl shadow-2xl"
              priority
            />
          </motion.div>

          {/* Engineering Excellence - Split Layout */}
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center mb-48">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white font-display leading-none tracking-tight">
                Engineering<br/>Excellence
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-600" />
              <p className="text-xl sm:text-2xl text-gray-300 leading-relaxed font-light">
                {CONTENT_PARAGRAPHS[0]}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <OptimizedImage
                src="/images/solar%20power%20farms.png"
                alt="Solar Power Farms - Renewable Energy"
                width={1920}
                height={1280}
                className="w-full h-[600px] object-cover rounded-3xl shadow-2xl hover:scale-[1.02] transition-transform duration-700"
              />
            </motion.div>
          </div>

          {/* Apple Spacer */}
          <div className="h-32" />

          {/* Full-width Text Block - Apple Typography */}
          <motion.div
            className="mb-48 max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
          >
            <p className="text-3xl sm:text-4xl lg:text-5xl text-white leading-relaxed font-light text-center">
              {CONTENT_PARAGRAPHS[1]}
            </p>
          </motion.div>

          {/* Solar Solutions - Reverse Layout */}
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center mb-48">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:order-2"
            >
              <OptimizedImage
                src="/images/solar%20changeover%20control.png"
                alt="Solar Control Systems"
                width={1920}
                height={1280}
                className="w-full h-[600px] object-cover rounded-3xl shadow-2xl hover:scale-[1.02] transition-transform duration-700"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8 lg:order-1"
            >
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white font-display leading-none tracking-tight">
                Solar<br/>Innovation
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-600" />
              <p className="text-xl sm:text-2xl text-gray-300 leading-relaxed font-light">
                {CONTENT_PARAGRAPHS[2]}
              </p>
            </motion.div>
          </div>

          {/* Apple Spacer */}
          <div className="h-32" />

          {/* Power Quality Text */}
          <motion.div
            className="mb-48 max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
          >
            <h3 className="text-5xl sm:text-6xl font-bold text-center text-amber-400 mb-12 font-display">
              Power Quality & Reliability
            </h3>
            <p className="text-2xl sm:text-3xl text-gray-300 leading-relaxed font-light text-center">
              {CONTENT_PARAGRAPHS[3]}
            </p>
          </motion.div>

          {/* Future Vision - Full Width Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-32"
          >
            <div className="relative rounded-3xl overflow-hidden h-[80vh]">
              <OptimizedImage
                src="https://www.emersoneims.com/wp-content/uploads/2025/11/power-quality.jpg"
                alt="Future of Energy Infrastructure"
                width={3840}
                height={2160}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-12 lg:p-20">
                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 font-display">
                  The Future of Energy
                </h2>
                <p className="text-2xl sm:text-3xl text-gray-200 max-w-4xl font-light leading-relaxed">
                  {CONTENT_PARAGRAPHS[4]}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Final Spacer */}
        <div className="h-32" />
      </section>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <AnimatedImage
              src="/images/solar%20power%20farms.png"
              alt="Solar Solutions"
              width={3840}
              height={2160}
              animationType="shake"
              intensity="medium"
              className="rounded-xl overflow-hidden"
            />
            <AnimatedImage
              src="/images/solar%20changeover%20control.png"
              alt="Control Systems"
              width={600}
              height={400}
              animationType="rotate"
              intensity="medium"
              className="rounded-xl overflow-hidden"
            />
            <AnimatedImage
              src="https://www.emersoneims.com/wp-content/uploads/2025/11/ups-systems.jpg"
              alt="UPS Systems"
              width={600}
              height={400}
              animationType="parallax"
              intensity="medium"
              className="rounded-xl overflow-hidden"
            />
          </div>

          {/* Fourth Paragraph */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-lg text-gray-300 leading-relaxed max-w-4xl mx-auto">
              {CONTENT_PARAGRAPHS[3]}
            </p>
          </motion.div>

          {/* 3D Image Section */}
          <div className="mb-16">
            <AnimatedImage
              src="https://www.emersoneims.com/wp-content/uploads/2025/11/automation.jpg"
              alt="Automation Solutions"
              width={1200}
              height={800}
              animationType="3d"
              intensity="high"
              className="rounded-2xl overflow-hidden"
            />
          </div>

          {/* Fifth Paragraph */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-lg text-gray-300 leading-relaxed max-w-4xl mx-auto">
              {CONTENT_PARAGRAPHS[4]}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 py-6">
        <div className="eims-shell py-0">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search solutions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">??</span>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black'
                      : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="eims-shell py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {uniqueSolutions.map((solution, index) => (
            <motion.div
              key={`${solution.href}-${index}-${solution.label}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={solution.href}
                prefetch
                className="group block h-full"
              >
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 hover:border-[#fbbf24]/50 transition-all overflow-hidden h-full flex flex-col">
                  {/* Image */}
                  {solution.image && (
                    <div className="relative h-48 overflow-hidden">
                      <OptimizedImage
                        src={solution.image}
                        alt={solution.label}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className={`absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-r ${solution.color} flex items-center justify-center text-2xl shadow-lg`}>
                        {solution.icon}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-3xl bg-gradient-to-r ${solution.color} bg-clip-text text-transparent`}>
                        {solution.icon}
                      </span>
                      <h3 className="text-xl font-bold text-white group-hover:text-[#fbbf24] transition-colors font-display">
                        {solution.label}
                      </h3>
                    </div>
                    
                    <p className="text-gray-400 mb-4 flex-1">{solution.description}</p>
                    
                    <div className="mb-4">
                      <span className="text-xs text-amber-400 font-semibold">{solution.category}</span>
                    </div>

                    {/* Features */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {solution.features.slice(0, 3).map((feature) => (
                          <span
                            key={feature}
                            className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-700"
                          >
                            {feature}
                          </span>
                        ))}
                        {solution.features.length > 3 && (
                          <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-700">
                            +{solution.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-auto pt-4 border-t border-gray-800">
                      <span className={`text-[#fbbf24] font-semibold group-hover:text-[#fcd34d] transition-colors flex items-center gap-2`}>
                        Learn More
                        <span className="transform group-hover:translate-x-1 transition-transform">{'\u2192'}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredSolutions.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">{'\uD83D\uDD0D'}</div>
            <h3 className="text-2xl font-bold text-white mb-2">No solutions found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </section>

      {/* Solutions Grid Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900 relative">
        <div className="eims-shell py-0">
          <SectionLead
            title="Comprehensive Solutions Portfolio"
            subtitle="Explore our complete range of energy infrastructure solutions"
            centered
          />
          
          {/* Search and Filter Section */}
          <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 py-6 mb-8 rounded-lg">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 w-full md:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search solutions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">{'\uD83D\uDD0D'}</span>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black'
                        : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Solutions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {uniqueSolutions.map((solution, index) => (
              <motion.div
                key={`${solution.href}-${index}-${solution.label}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={solution.href}
                  prefetch
                  className="group block h-full"
                >
                  <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 hover:border-[#fbbf24]/50 transition-all overflow-hidden h-full flex flex-col">
                    {solution.image && (
                      <div className="relative h-48 overflow-hidden">
                        <AnimatedImage
                          src={solution.image}
                          alt={solution.label}
                          width={600}
                          height={400}
                          animationType="parallax"
                          intensity="medium"
                          className="w-full h-full object-cover"
                        />
                        <div className={`absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-r ${solution.color} flex items-center justify-center text-2xl shadow-lg`}>
                          {solution.icon}
                        </div>
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`text-3xl bg-gradient-to-r ${solution.color} bg-clip-text text-transparent`}>
                          {solution.icon}
                        </span>
                        <h3 className="text-xl font-bold text-white group-hover:text-[#fbbf24] transition-colors font-display">
                          {solution.label}
                        </h3>
                      </div>
                      <p className="text-gray-400 mb-4 flex-1">{solution.description}</p>
                      <div className="mb-4">
                        <span className="text-xs text-[#fbbf24] font-semibold">{solution.category}</span>
                      </div>
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {solution.features.slice(0, 3).map((feature) => (
                            <span
                              key={feature}
                              className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-700"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-auto pt-4 border-t border-gray-800">
                        <span className={`text-[#fbbf24] font-semibold group-hover:text-[#fcd34d] transition-colors flex items-center gap-2`}>
                          Learn More
                            <span className="transform group-hover:translate-x-1 transition-transform">{'\u2192'}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredSolutions.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">{'\uD83D\uDD0D'}</div>
              <h3 className="text-2xl font-bold text-white mb-2">No solutions found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#fbbf24]/10 via-black to-[#fbbf24]/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent font-display"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to Transform Your Energy Infrastructure?
          </motion.h2>
          <p className="text-xl text-gray-300 mb-8">
            Our engineering team is ready to help you find the perfect solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="/contact" variant="primary" size="lg">
              Talk to an Expert
            </CTAButton>
            <CTAButton href="/solar" variant="secondary" size="lg">
              Solar Calculator
            </CTAButton>
          </div>
        </div>
      </section>
    </main>
  );
}



