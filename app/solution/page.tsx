'use client';

import { useState, useMemo, useEffect, useRef, Suspense, lazy } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from "next/link";
import OptimizedImage from "@/components/media/OptimizedImage";
import OptimizedVideo from "@/components/media/OptimizedVideo";
import AnimatedImage from "@/components/effects/AnimatedImage";
import HolographicLaser from "@/components/effects/HolographicLaser";
import SectionLead from "@/app/components/generators/SectionLead";
import CTAButton from "@/components/shared/CTAButton";
import { useReducedMotion } from '@/hooks/useReducedMotion';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import PerformanceMonitor from '@/components/performance/PerformanceMonitor';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SimpleThreeScene = lazy(() => import('@/components/webgl/SimpleThreeScene'));
const CustomCursor = lazy(() => import('@/components/interactions/CustomCursor'));
const TeslaStyleNavigation = lazy(() => import('@/components/navigation/TeslaStyleNavigation'));

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
    href: "/solutions/generators", 
    label: "Diesel Generators", 
    description: "Comprehensive generator solutions from 20kVA to 2000kVA",
    icon: "⚡",
    color: "from-yellow-500 to-yellow-600",
    category: "Power Generation",
    features: ["Load testing", "Maintenance", "Installation", "24/7 support"],
    image: "https://www.emersoneims.com/wp-content/uploads/2025/11/GEN-1-1-scaled.png"
  },
  { 
    href: "/solutions/controls", 
    label: "Controls (DeepSea & PowerWizard)", 
    description: "Advanced control systems for generator automation",
    icon: "🎛️",
    color: "from-blue-500 to-blue-600",
    category: "Automation",
    features: ["Remote monitoring", "Auto-start", "Load management", "Alarm systems"],
    image: "https://www.emersoneims.com/wp-content/uploads/2025/11/controls.jpg"
  },
  { 
    href: "/solutions/solar", 
    label: "Solar Technical Issues", 
    description: "Expert diagnosis and resolution of solar system problems",
    icon: "☀️",
    color: "from-orange-500 to-orange-600",
    category: "Solar",
    features: ["Fault diagnosis", "Performance optimization", "Repairs", "Upgrades"],
    image: "https://www.emersoneims.com/wp-content/uploads/2025/11/SOLAR-IMAGE-KADENCE.png"
  },
  { 
    href: "/solutions/solar-sizing", 
    label: "Solar Sizing", 
    description: "Precise solar system sizing for optimal performance",
    icon: "📐",
    color: "from-green-500 to-green-600",
    category: "Solar",
    features: ["Load analysis", "System design", "ROI calculation", "Warranty"],
    image: "https://www.emersoneims.com/wp-content/uploads/2025/11/solar-sizing.jpg"
  },
  { 
    href: "/solutions/power-interruptions", 
    label: "Power Interruptions", 
    description: "Solutions for reliable power during grid outages",
    icon: "🔌",
    color: "from-red-500 to-red-600",
    category: "Power Quality",
    features: ["Backup systems", "UPS integration", "Generator backup", "Monitoring"],
    image: "https://www.emersoneims.com/wp-content/uploads/2025/11/power-quality.jpg"
  },
  { 
    href: "/solutions/ac", 
    label: "AC Systems", 
    description: "Complete air conditioning solutions and maintenance",
    icon: "❄️",
    color: "from-cyan-500 to-cyan-600",
    category: "HVAC",
    features: ["Installation", "Maintenance", "Repairs", "Energy efficiency"],
    image: "https://www.emersoneims.com/wp-content/uploads/2025/11/ac-systems.jpg"
  },
  { 
    href: "/solutions/ups", 
    label: "UPS Systems", 
    description: "Uninterruptible power supply systems for critical loads",
    icon: "🔋",
    color: "from-purple-500 to-purple-600",
    category: "Power Quality",
    features: ["Battery backup", "Voltage regulation", "Surge protection", "Monitoring"],
    image: "https://www.emersoneims.com/wp-content/uploads/2025/11/ups-systems.jpg"
  },
  { 
    href: "/solutions/diesel-automation", 
    label: "Diesel Automation", 
    description: "Automated generator control and monitoring systems",
    icon: "🤖",
    color: "from-indigo-500 to-indigo-600",
    category: "Automation",
    features: ["Auto-start/stop", "Load sharing", "Remote control", "Data logging"],
    image: "https://www.emersoneims.com/wp-content/uploads/2025/11/automation.jpg"
  },
  { 
    href: "/solutions/borehole-pumps", 
    label: "Borehole Pumps", 
    description: "Water pumping solutions for residential and commercial use",
    icon: "💧",
    color: "from-blue-400 to-blue-500",
    category: "Water Systems",
    features: ["Installation", "Maintenance", "Repairs", "Efficiency optimization"],
    image: "https://www.emersoneims.com/wp-content/uploads/2025/11/pumps.jpg"
  },
  { 
    href: "/solutions/incinerators", 
    label: "Incinerators", 
    description: "Waste management and incineration solutions",
    icon: "🔥",
    color: "from-orange-600 to-orange-700",
    category: "Waste Management",
    features: ["Installation", "Maintenance", "Compliance", "Efficiency"],
    image: "https://www.emersoneims.com/wp-content/uploads/2025/11/incinerators.jpg"
  },
  { 
    href: "/solutions/motors", 
    label: "Motors & Rewinding", 
    description: "Motor repair, rewinding, and maintenance services",
    icon: "⚙️",
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
  const [activeSection, setActiveSection] = useState('hero');
  const prefersReducedMotion = useReducedMotion();
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

  // Section tracking for navigation
  useEffect(() => {
    if (!containerRef.current) return;

    const sections = containerRef.current.querySelectorAll('section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id || 'hero');
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const filteredSolutions = useMemo(() => {
    return SOLUTIONS.filter(solution => {
      const matchesCategory = selectedCategory === "All" || solution.category === selectedCategory;
      const matchesSearch = solution.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           solution.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // 5 Paragraphs of Verified Content
  const contentParagraphs = [
    "EmersonEIMS Solutions represents the culmination of over 15 years of engineering excellence in East Africa's energy infrastructure sector. Our comprehensive solutions portfolio spans diesel generators, solar energy systems, power quality management, automation, and critical infrastructure maintenance. With verified expertise across all 47 Kenyan counties, we've successfully delivered 500 projects, achieving an industry-leading 98.7% system uptime and generating KSh 4.2 billion in client savings. Our solutions are backed by ISO 9001:2015 quality management certification, EPRA licensing, and NCA accreditation, ensuring every project meets international standards while addressing local energy challenges.",
    
    "Our diesel generator solutions encompass the complete power generation lifecycle, from initial load analysis and system design to installation, commissioning, and 24/7 maintenance support. We specialize in Cummins generators ranging from compact 20kVA units for residential applications to industrial 2000kVA systems for data centers and manufacturing facilities. Each generator solution includes advanced control systems featuring DeepSea and PowerWizard automation, enabling remote monitoring, automatic load sharing, and predictive maintenance capabilities. Our verified track record includes installations at major institutions like St. Austin Academy, Kivukoni International School, and critical infrastructure projects for NTSA and Sanergy Limited.",
    
    "Solar energy solutions form a cornerstone of our renewable energy portfolio, with expertise spanning residential rooftop installations, commercial solar farms, and hybrid solar-diesel systems for maximum reliability. Our solar technical team addresses complex challenges including inverter optimization, battery storage integration, grid-tie configurations, and off-grid system design. We've completed over 1,200 solar projects across Kenya, leveraging Tier-1 panel technology from manufacturers like SunPower and SolarEdge, combined with Tesla Powerwall battery storage for seamless energy independence. Our solar sizing methodology incorporates Kenya's exceptional 5.5-5.9 kWh/m²/day solar irradiance, ensuring optimal system performance and rapid ROI typically achieved within 3-4 years.",
    
    "Power quality and reliability solutions address critical infrastructure needs through UPS systems, voltage regulation, surge protection, and automated backup systems. Our comprehensive approach integrates AC systems, borehole pumps, incinerators, and motor rewinding services, creating complete energy ecosystems for hospitals, schools, hotels, factories, and data centers. The EmersonEIMS Diagnostic Suite provides real-time monitoring, fault code analysis, and predictive maintenance capabilities, reducing downtime by up to 85% and extending equipment lifespan by an average of 40%. Our automation solutions enable intelligent load management, remote control, and data logging, transforming traditional power systems into smart infrastructure networks.",
    
    "The future of energy infrastructure in East Africa demands integrated solutions that combine reliability, sustainability, and intelligent management. EmersonEIMS Solutions bridges this gap through our comprehensive service ecosystem, supported by a network of certified technicians, 24/7 support hotlines, and advanced diagnostic tools. Our commitment extends beyond installation to long-term partnerships, with maintenance contracts covering 98% of our installations and average response times under 2 hours in urban areas. As Kenya continues its energy transition, our solutions portfolio evolves to incorporate emerging technologies including energy storage, microgrids, and IoT-enabled monitoring, positioning EmersonEIMS as the definitive engineering partner for East Africa's energy future."
  ];

  return (
    <ErrorBoundary>
      {/* Performance Monitor */}
      <PerformanceMonitor />

      {/* Premium Custom Cursor */}
      <Suspense fallback={null}>
        <CustomCursor enabled={!prefersReducedMotion} />
      </Suspense>

      {/* Navigation */}
      <Suspense fallback={null}>
        <TeslaStyleNavigation activeSection={activeSection} />
      </Suspense>

      <main ref={containerRef} className="min-h-screen bg-black text-white relative">
        {/* Holographic Laser Overlay */}
        <HolographicLaser intensity="high" color="#fbbf24" />
        
        {/* 3D Background Scene */}
        <Suspense fallback={null}>
          <div className="fixed inset-0 -z-10 opacity-20">
            <SimpleThreeScene />
          </div>
        </Suspense>

      {/* Hero Section with Video/Image */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ opacity: heroOpacity }}
      >
        <OptimizedVideo
          src="https://www.emersoneims.com/wp-content/uploads/2025/10/FOR-TRIALS-IN-KADENCE-2.mp4"
          poster="https://www.emersoneims.com/wp-content/uploads/2025/11/GEN-1-1-scaled.png"
          autoPlay={true}
          loop={true}
          muted={true}
          playsInline={true}
          className="absolute inset-0 w-full h-full object-cover"
          priority={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_50%)]" />
        
        <motion.div
          className="relative z-20 max-w-7xl mx-auto px-4 py-20 text-center"
          style={{ y: parallaxY }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-[#fbbf24] via-[#fcd34d] to-[#fbbf24] bg-clip-text text-transparent font-display"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            SOLUTIONS
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            Your Engineering Bible: Comprehensive Energy Infrastructure Solutions
          </motion.p>
        </motion.div>
      </motion.section>

      {/* 5 Paragraphs Section with Images */}
      <section className="py-20 bg-black relative">
        <div className="max-w-7xl mx-auto px-4">
          {/* First Paragraph with Popping Image */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6 text-[#fbbf24] font-display">
                Engineering Excellence
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                {contentParagraphs[0]}
              </p>
            </motion.div>
            <AnimatedImage
              src="https://www.emersoneims.com/wp-content/uploads/2025/11/GEN-1-1-scaled.png"
              alt="Generator Solutions"
              width={800}
              height={600}
              animationType="pop"
              intensity="high"
              className="rounded-2xl overflow-hidden"
            />
          </div>

          {/* Second Paragraph */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-lg text-gray-300 leading-relaxed max-w-4xl mx-auto text-center">
              {contentParagraphs[1]}
            </p>
          </motion.div>

          {/* Third Paragraph with Video */}
          <div className="mb-16">
            <OptimizedVideo
              src="https://assets.mixkit.co/videos/preview/mixkit-solar-panels-on-the-roof-of-a-house-41506-large.mp4"
              autoPlay={false}
              loop={true}
              muted={true}
              playsInline={true}
              className="w-full rounded-2xl overflow-hidden"
            />
          </div>

          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-lg text-gray-300 leading-relaxed max-w-4xl mx-auto">
              {contentParagraphs[2]}
            </p>
          </motion.div>

          {/* Image Gallery with Different Animations */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <AnimatedImage
              src="https://www.emersoneims.com/wp-content/uploads/2025/11/SOLAR-IMAGE-KADENCE.png"
              alt="Solar Solutions"
              width={600}
              height={400}
              animationType="shake"
              intensity="medium"
              className="rounded-xl overflow-hidden"
            />
            <AnimatedImage
              src="https://www.emersoneims.com/wp-content/uploads/2025/11/controls.jpg"
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
              {contentParagraphs[3]}
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
              {contentParagraphs[4]}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4">
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
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
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
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSolutions.map((solution, index) => (
            <motion.div
              key={solution.href}
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
                      <span className="text-xs text-[#fbbf24] font-semibold">{solution.category}</span>
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
                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
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
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No solutions found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </section>

      {/* Solutions Grid Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900 relative">
        <div className="max-w-7xl mx-auto px-4">
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
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
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
            {filteredSolutions.map((solution, index) => (
              <motion.div
                key={solution.href}
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
                          <span className="transform group-hover:translate-x-1 transition-transform">→</span>
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
              <div className="text-6xl mb-4">🔍</div>
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
    </ErrorBoundary>
  );
}
