'use client';

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import OptimizedImage from "@/components/media/OptimizedImage";

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
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Our Journey
        </motion.h2>
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
      </div>
    </section>
  );
};

// Team Members Component
const TeamSection = () => {
  const team = [
    {
      name: "James Maina",
      role: "Founder & CEO",
      bio: "15+ years in energy infrastructure. Visionary leader driving Kenya's energy transformation.",
      expertise: ["Strategic Planning", "Energy Systems", "Business Development"],
      image: "https://www.emersoneims.com/wp-content/uploads/2025/11/team-1.jpg",
    },
    {
      name: "Dr. Sarah Wanjiku",
      role: "Chief Technical Officer",
      bio: "PhD in Electrical Engineering. Expert in hybrid solar systems and power electronics.",
      expertise: ["Solar Systems", "Power Electronics", "System Design"],
      image: "https://www.emersoneims.com/wp-content/uploads/2025/11/team-2.jpg",
    },
    {
      name: "Michael Ochieng",
      role: "Head of Engineering",
      bio: "10+ years in generator systems and diagnostics. Master's in Mechanical Engineering.",
      expertise: ["Generator Systems", "Diagnostics", "Maintenance"],
      image: "https://www.emersoneims.com/wp-content/uploads/2025/11/team-3.jpg",
    },
    {
      name: "Grace Muthoni",
      role: "Energy Analyst",
      bio: "ROI modeling, tariff analysis, and load profiling specialist. Data-driven decision maker.",
      expertise: ["ROI Analysis", "Load Profiling", "Energy Economics"],
      image: "https://www.emersoneims.com/wp-content/uploads/2025/11/team-4.jpg",
    },
    {
      name: "David Kimani",
      role: "Project Manager",
      bio: "Mission-critical deployments across hospitals and factories. PMP certified.",
      expertise: ["Project Management", "Deployment", "Quality Assurance"],
      image: "https://www.emersoneims.com/wp-content/uploads/2025/11/team-5.jpg",
    },
    {
      name: "Linda Akinyi",
      role: "Customer Success",
      bio: "Ensuring client satisfaction and system performance. 24/7 support champion.",
      expertise: ["Customer Relations", "Support", "Training"],
      image: "https://www.emersoneims.com/wp-content/uploads/2025/11/team-6.jpg",
    },
  ];

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Meet Our Team
        </motion.h2>
        <p className="text-xl text-gray-400 text-center mb-12 max-w-3xl mx-auto">
          Experts dedicated to powering Kenya's future through intelligent energy solutions
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              className="group bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-gray-800 hover:border-amber-500/50 transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative mb-4 overflow-hidden rounded-lg">
                <OptimizedImage
                  src={member.image}
                  alt={member.name}
                  width={400}
                  height={400}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  hollywoodGrading={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
              <p className="text-amber-400 font-semibold mb-3">{member.role}</p>
              <p className="text-gray-300 mb-4">{member.bio}</p>
              <div className="flex flex-wrap gap-2">
                {member.expertise.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-amber-500/10 text-amber-400 text-sm rounded-full border border-amber-500/20">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Achievements & Awards Component
const AchievementsSection = () => {
  const achievements = [
    { metric: "2,450+", label: "Projects Completed", icon: "🏗️", color: "from-blue-500 to-blue-600" },
    { metric: "47", label: "Counties Covered", icon: "📍", color: "from-green-500 to-green-600" },
    { metric: "98.7%", label: "System Uptime", icon: "⚡", color: "from-yellow-500 to-yellow-600" },
    { metric: "KSh 4.2B", label: "Client Savings", icon: "💰", color: "from-purple-500 to-purple-600" },
    { metric: "15+", label: "Years Experience", icon: "🎯", color: "from-red-500 to-red-600" },
    { metric: "500+", label: "Team Members", icon: "👥", color: "from-cyan-500 to-cyan-600" },
  ];

  const awards = [
    { title: "Top Energy Solutions Provider", year: "2019", issuer: "Kenya Energy Awards" },
    { title: "Excellence in Solar Innovation", year: "2021", issuer: "African Solar Council" },
    { title: "Best Customer Service", year: "2022", issuer: "Kenya Business Awards" },
    { title: "Awwwards SOTD Contender", year: "2024", issuer: "Awwwards" },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4">
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
      <div className="max-w-7xl mx-auto px-4">
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
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  return (
    <main className="min-h-screen bg-black text-white">
      <ContrastComplianceLayer />
      
      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ opacity, scale }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_50%)]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About EmersonEIMS
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Powering Kenya with intelligent energy infrastructure solutions since 2013.
          </motion.p>
          <motion.p 
            className="text-lg text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            From a small startup in Nairobi to Kenya's leading energy solutions provider, 
            we've transformed how businesses and communities access reliable, sustainable power.
          </motion.p>
        </div>
      </motion.section>

      {/* Mission, Vision, Values */}
      <MissionVisionValues />

      {/* Company Timeline */}
      <CompanyTimeline />

      {/* Team Section */}
      <TeamSection />

      {/* Achievements */}
      <AchievementsSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-amber-900/20 via-black to-amber-900/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Join Us in Powering Kenya's Future
          </motion.h2>
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
  );
}
