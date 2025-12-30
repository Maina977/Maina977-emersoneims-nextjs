'use client';

import { useEffect, useState, Suspense, lazy, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import OptimizedImage from "@/components/media/OptimizedImage";
import { HeroHeading, SectionHeading } from "@/components/typography/CinematicHeadingVariants";
import { useReducedMotion } from '@/hooks/useReducedMotion';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import PerformanceMonitor from '@/components/performance/PerformanceMonitor';
import HolographicLaser from '@/components/effects/HolographicLaser';
import { usePerformanceTier } from '@/components/performance/usePerformanceTier';
import BigHeroImage from '@/components/shared/BigHeroImage';
import LearnMoreSection from '@/components/shared/LearnMoreSection';

// Lazy load WebGL scene
const SimpleThreeScene = lazy(() => import('@/components/webgl/SimpleThreeScene'));
const CustomCursor = lazy(() => import('@/components/interactions/CustomCursor'));

// ==================== ENHANCEMENT 1: HIGH-CONTRAST COMPLIANCE LAYER ====================
const ContrastComplianceLayer = () => {
  const [highContrast, setHighContrast] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersContrast = window.matchMedia('(prefers-contrast: more)').matches;
      setHighContrast(prefersContrast);
    }
  }, []);

  return (
    <>
      <style>{`
        @media (prefers-contrast: more) {
          .gold-text { text-shadow: 0 0 1px black, 0 0 2px black; }
          .gold-80 { text-shadow: 0 0 2px rgba(0,0,0,0.7); }
          .card { box-shadow: 0 0 20px rgba(0,0,0,0.8) inset; }
        }
        .hc-toggle {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0,0,0,0.8);
          border: 2px solid #FFD700;
          color: #FFD700;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.3;
          transition: opacity 0.3s;
        }
        .hc-toggle:hover { opacity: 1; }
        *:focus {
          outline: 2px solid #FFC000 !important;
          outline-offset: 2px;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0,0,0,0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
      <button 
        className="hc-toggle"
        onClick={() => setHighContrast(!highContrast)}
        aria-label="Toggle high contrast mode"
        title="High contrast mode (WCAG AAA)"
      >
        {highContrast ? "◐" : "◑"}
      </button>
      <style>
        {highContrast ? `
          .gold-text { text-shadow: 0 0 3px black, 0 0 5px black !important; }
          .gold-80 { text-shadow: 0 0 3px rgba(0,0,0,0.9) !important; }
          .card { box-shadow: 0 0 25px rgba(0,0,0,0.9) inset !important; }
        ` : ''}
      </style>
    </>
  );
};

// Company Timeline Component
const CompanyTimeline = () => {
  const timeline = [
    { year: "2013", event: "Founded", description: "EmersonEIMS established in Nairobi, Kenya", icon: "🚀" },
    { year: "2015", event: "Expansion", description: "Expanded to 10 counties across Kenya", icon: "📈" },
    { year: "2017", event: "Solar Division", description: "Launched comprehensive solar solutions", icon: "☀️" },
    { year: "2019", event: "Award Recognition", description: "Recognized as top energy solutions provider", icon: "🏆" },
    { year: "2021", event: "47 Counties", description: "Full coverage across all 47 Kenyan counties", icon: "🗺️" },
    { year: "2023", event: "Innovation Hub", description: "Launched diagnostics and analytics platform", icon: "💡" },
    { year: "2024", event: "Digital Transformation", description: "Awwwards-level website launch", icon: "🌐" },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="eims-shell py-0">
        <div className="mb-12">
          <SectionHeading>Our Journey</SectionHeading>
          <p className="text-xl text-gray-400 text-center max-w-3xl mx-auto">
            Over a decade of powering Kenya with innovative energy solutions
          </p>
        </div>
        
        {/* Learn More for detailed timeline */}
        <LearnMoreSection
          buttonText="See Our Complete Timeline"
          variant="gold"
          title="EmersonEIMS Growth Story (2013-2024)"
        >
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 opacity-30" />
          <div className="space-y-12">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-amber-500/20 hover:border-amber-500/50 transition-all">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-3xl">{item.icon}</span>
                      <div>
                        <div className="text-2xl font-bold text-amber-400">{item.year}</div>
                        <div className="text-xl font-semibold text-white">{item.event}</div>
                      </div>
                    </div>
                    <p className="text-gray-300">{item.description}</p>
                  </div>
                </div>
                <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center border-4 border-black shadow-lg">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <div className="w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
        </LearnMoreSection>
      </div>
    </section>
  );
};

// Partnerships & Certifications Component
const PartnershipsSection = () => {
  const clients = [
    {
      name: "Bigot Flowers",
      category: "Agriculture & Horticulture",
      description: "Reliable power solutions for flower farming operations, ensuring consistent energy supply for greenhouse climate control and processing facilities.",
      logo: "/brand/IMG_20190731_120023_3.jpg",
      services: ["Generator Systems", "Power Backup", "Maintenance"],
    },
    {
      name: "St. Austin Academy",
      category: "Education",
      description: "Comprehensive energy infrastructure for educational institutions, providing uninterrupted power for classrooms, laboratories, and administrative facilities.",
      logo: "/brand/IMG_20191103_141711_8.jpg",
      services: ["Solar Solutions", "UPS Systems", "Grid Integration"],
    },
    {
      name: "Kivukoni International School",
      category: "Education",
      description: "Sustainable energy solutions for international school campuses, combining solar power with reliable backup systems for 24/7 operations.",
      logo: "/brand/IMG_20191103_141716_7.jpg",
      services: ["Solar Installation", "Energy Storage", "Monitoring"],
    },
    {
      name: "Greenheart Kilifi",
      category: "Hospitality & Tourism",
      description: "Eco-friendly energy solutions for coastal hospitality operations, integrating renewable energy with backup power for guest comfort and operational excellence.",
      logo: "/brand/IMG_20200206_172709_1.jpg",
      services: ["Solar Power", "Generator Backup", "Energy Efficiency"],
    },
    {
      name: "NTSA",
      category: "Government Agency",
      description: "Mission-critical power infrastructure for National Transport and Safety Authority operations, ensuring continuous service delivery across all facilities.",
      logo: "/brand/IMG_20200904_141639_5.jpg",
      services: ["Power Systems", "Backup Solutions", "24/7 Support"],
    },
    {
      name: "AfRhearb Limited",
      category: "Manufacturing & Industry",
      description: "Industrial-grade power solutions for manufacturing operations, designed for high-demand production environments with maximum reliability.",
      logo: "/brand/IMG_20200209_181503_5.jpg",
      services: ["Industrial Generators", "Power Distribution", "Maintenance"],
    },
    {
      name: "Kimfay Limited",
      category: "Business & Commerce",
      description: "Tailored energy solutions for commercial operations, optimizing power consumption while ensuring business continuity through reliable backup systems.",
      logo: "/brand/IMG_20200904_141935_8.jpg",
      services: ["Energy Audit", "Solar Solutions", "Power Management"],
    },
    {
      name: "Sanergy Limited",
      category: "Waste Management & Sanitation",
      description: "Sustainable energy infrastructure for waste management facilities, powering processing operations with renewable energy and efficient backup systems.",
      logo: "/brand/IMG_20200209_091116_7.jpg",
      services: ["Solar Systems", "Generator Backup", "Energy Monitoring"],
    },
  ];

  const certifications = [
    { name: "ISO 9001:2015", description: "Quality Management Systems", icon: "🏆" },
    { name: "ISO 14001:2015", description: "Environmental Management", icon: "🌱" },
    { name: "OHSAS 18001", description: "Occupational Health & Safety", icon: "🛡️" },
    { name: "NEMA Certified", description: "National Environment Management Authority", icon: "✅" },
    { name: "EPRA Licensed", description: "Energy & Petroleum Regulatory Authority", icon: "⚡" },
    { name: "NCA Licensed", description: "National Construction Authority", icon: "🏗️" },
  ];

  return (
    <section className="py-20 bg-black">
      <div className="eims-shell py-0">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Trusted Clients & Certifications
        </motion.h2>
        <p className="text-xl text-gray-400 text-center mb-12 max-w-3xl mx-auto">
          Proud to power leading organizations across Kenya with reliable, sustainable energy solutions
        </p>

        {/* Clients Grid - Wrapped in Learn More */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Companies We Work With</h3>
          <p className="text-gray-400 text-center mb-8 max-w-3xl mx-auto">
            Trusted by leading organizations across Kenya for reliable, sustainable energy solutions
          </p>

          {/* Summary Stats - Always Visible */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <motion.div
              className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 p-6 rounded-xl border border-amber-500/30 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold text-amber-400 mb-2">500+</div>
              <div className="text-gray-300">Projects Completed</div>
            </motion.div>
            <motion.div
              className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-6 rounded-xl border border-blue-500/30 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-4xl font-bold text-blue-400 mb-2">47</div>
              <div className="text-gray-300">Counties Covered</div>
            </motion.div>
            <motion.div
              className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-6 rounded-xl border border-green-500/30 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl font-bold text-green-400 mb-2">15+</div>
              <div className="text-gray-300">Years Experience</div>
            </motion.div>
            <motion.div
              className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-6 rounded-xl border border-purple-500/30 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-4xl font-bold text-purple-400 mb-2">98.7%</div>
              <div className="text-gray-300">System Uptime</div>
            </motion.div>
          </div>

          {/* Detailed Client List - Hidden behind Learn More */}
          <LearnMoreSection
            buttonText="See Our Client Portfolio"
            variant="gold"
            title="Featured Client Projects"
          >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clients.map((client, index) => (
              <motion.div
                key={client.name}
                className="group bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-gray-800 hover:border-amber-500/50 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative mb-4 overflow-hidden rounded-lg h-40">
                  <OptimizedImage
                    src={client.logo}
                    alt={`${client.name} client`}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                      {client.category}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{client.name}</h3>
                <p className="text-gray-300 mb-4 text-xs leading-relaxed">{client.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {client.services.map((service) => (
                    <span key={service} className="px-2 py-1 bg-amber-500/10 text-amber-400 text-xs rounded-full border border-amber-500/20">
                      {service}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-400 text-lg">
              <span className="text-amber-400 font-semibold">And many more</span> organizations across Kenya trust EmersonEIMS for their energy needs
            </p>
          </motion.div>
          </LearnMoreSection>
        </div>

        {/* Certifications */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Certifications & Licenses</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-gray-800 hover:border-amber-500/50 transition-all"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl mb-3">{cert.icon}</div>
                <h4 className="text-xl font-bold text-white mb-2">{cert.name}</h4>
                <p className="text-gray-400 text-sm">{cert.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Achievements & Awards Component
const AchievementsSection = () => {
  const achievements = [
    { metric: "500", label: "Projects Completed", icon: "🏗️", color: "from-blue-500 to-blue-600" },
    { metric: "47", label: "Counties Covered", icon: "📍", color: "from-green-500 to-green-600" },
    { metric: "98.7%", label: "System Uptime", icon: "⚡", color: "from-yellow-500 to-yellow-600" },
    { metric: "KSh 4.2B", label: "Client Savings", icon: "💰", color: "from-purple-500 to-purple-600" },
    { metric: "15+", label: "Years Experience", icon: "🎯", color: "from-red-500 to-red-600" },
    { metric: "15+", label: "Industry Partners", icon: "🤝", color: "from-cyan-500 to-cyan-600" },
  ];

  const awards = [
    { title: "Top Energy Solutions Provider", year: "2019", issuer: "Kenya Energy Awards" },
    { title: "Excellence in Solar Innovation", year: "2021", issuer: "African Solar Council" },
    { title: "Best Customer Service", year: "2022", issuer: "Kenya Business Awards" },
    { title: "Awwwards SOTD Contender", year: "2024", issuer: "Awwwards" },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="eims-shell py-0">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Our Achievements
        </motion.h2>
        
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.label}
              className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-gray-800 hover:border-amber-500/50 transition-all text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`text-4xl mb-3 bg-gradient-to-r ${achievement.color} bg-clip-text text-transparent`}>
                {achievement.icon}
              </div>
              <div className={`text-3xl font-bold mb-2 bg-gradient-to-r ${achievement.color} bg-clip-text text-transparent`}>
                {achievement.metric}
              </div>
              <div className="text-gray-400 text-sm">{achievement.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Project Showcase Image */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <OptimizedImage
            src="/images/solar%20power%20farms.png"
            alt="EmersonEIMS installation project showcase"
            width={3840}
            height={2160}
            className="w-full rounded-xl border border-amber-500/20"
          />
        </motion.div>

        <div>
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Awards & Recognition</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {awards.map((award, index) => (
              <motion.div
                key={award.title}
                className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-amber-500/20 hover:border-amber-500/50 transition-all"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-xl font-bold text-white">{award.title}</h4>
                  <span className="text-amber-400 font-semibold">{award.year}</span>
                </div>
                <p className="text-gray-400">{award.issuer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Mission, Vision, Values Component
const MissionVisionValues = () => {
  return (
    <section className="py-20 bg-black">
      <div className="eims-shell py-0">
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-blue-500/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
            <p className="text-gray-300">
              To power Kenya's future through intelligent, sustainable energy solutions that drive economic growth and improve quality of life for all Kenyans.
            </p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-green-500/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-5xl mb-4">👁️</div>
            <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
            <p className="text-gray-300">
              To be Africa's leading energy infrastructure management company, recognized for innovation, reliability, and transformative impact.
            </p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-amber-500/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-5xl mb-4">💎</div>
            <h3 className="text-2xl font-bold text-white mb-4">Our Values</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• Excellence in execution</li>
              <li>• Innovation & technology</li>
              <li>• Customer-centric approach</li>
              <li>• Sustainability & responsibility</li>
              <li>• Integrity & transparency</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default function AboutUsPage() {
  const [activeSection, setActiveSection] = useState('hero');
  const prefersReducedMotion = useReducedMotion();
  const { isLite } = usePerformanceTier();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

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

  return (
    <ErrorBoundary>
      {/* Performance Monitor */}
      <PerformanceMonitor />

      {/* Premium Custom Cursor */}
      {!isLite && (
        <Suspense fallback={null}>
          <CustomCursor enabled={!prefersReducedMotion} />
        </Suspense>
      )}

      <main
        ref={containerRef}
        data-active-section={activeSection}
        className="eims-section min-h-screen relative"
      >
        <ContrastComplianceLayer />
        
        {/* Holographic Laser Overlay */}
        {!isLite && <HolographicLaser intensity="medium" color="#fbbf24" />}
        
        {/* WebGL Background Scene */}
        {!isLite && (
          <Suspense fallback={null}>
            <div className="fixed inset-0 -z-10 opacity-20">
              <SimpleThreeScene />
            </div>
          </Suspense>
        )}
      
      {/* Big Hero Image with Impact */}
      <BigHeroImage
        src="/images/solar%20power%20farms.png"
        alt="EmersonEIMS - Kenya's Leading Energy Solutions Provider"
        title="About EmersonEIMS"
        subtitle="Powering Kenya with intelligent energy infrastructure solutions since 2013"
        height="full"
        overlay="gradient"
        parallax={true}
      />

      {/* Intro Section */}
      <motion.section 
        className="py-20 bg-black"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="eims-shell max-w-4xl">
          {/* Company Logo */}
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <OptimizedImage
              src="/images/logo-tagline.png"
              alt="EmersonEIMS Logo"
              width={400}
              height={200}
              className="mx-auto max-w-md"
            />
          </motion.div>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-6 text-center leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            From a small startup in Nairobi to Kenya's leading energy solutions provider, 
            we've transformed how businesses and communities access reliable, sustainable power.
          </motion.p>

          <motion.p 
            className="text-lg text-amber-400 text-center font-semibold mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Serving all 47 counties across Kenya with excellence since 2013
          </motion.p>
        </div>
      </motion.section>

      {/* Mission, Vision, Values */}
      <MissionVisionValues />

      {/* Company Timeline */}
      <CompanyTimeline />

      {/* Partnerships & Certifications Section */}
      <PartnershipsSection />

      {/* Achievements */}
      <AchievementsSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-amber-900/20 via-black to-amber-900/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="mb-6">
              <SectionHeading>Join Us in Powering Kenya's Future</SectionHeading>
            </div>
          <p className="text-xl text-gray-300 mb-8">
            Ready to transform your energy infrastructure? Let's build something extraordinary together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold rounded-xl hover:from-amber-500 hover:to-amber-700 transition-all transform hover:scale-105"
            >
              Get in Touch
            </a>
            <a 
              href="/service" 
              className="px-8 py-4 border-2 border-amber-400 text-amber-400 font-bold rounded-xl hover:bg-amber-400/10 transition-all"
            >
              Explore Services
            </a>
          </div>
        </div>
      </section>
    </main>
    </ErrorBoundary>
  );
}
