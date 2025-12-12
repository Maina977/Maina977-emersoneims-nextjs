'use client';

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import OptimizedImage from "@/components/media/OptimizedImage";
import SectionLead from "@/app/components/generators/SectionLead";

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

  const filteredSolutions = useMemo(() => {
    return SOLUTIONS.filter(solution => {
      const matchesCategory = selectedCategory === "All" || solution.category === selectedCategory;
      const matchesSearch = solution.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           solution.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_50%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Solutions: Your Engineering Bible
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Authoritative guides for diesel generators, controls, solar, power quality, AC, UPS, automation, pumps, incinerators, and motors.
          </motion.p>
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
                      ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-black'
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
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 hover:border-amber-500/50 transition-all overflow-hidden h-full flex flex-col">
                  {/* Image */}
                  {solution.image && (
                    <div className="relative h-48 overflow-hidden">
                      <OptimizedImage
                        src={solution.image}
                        alt={solution.label}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        hollywoodGrading={true}
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
                      <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
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
                      <span className={`text-amber-400 font-semibold group-hover:text-amber-300 transition-colors flex items-center gap-2`}>
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-amber-900/20 via-black to-amber-900/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Need Expert Guidance?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Our engineering team is ready to help you find the perfect solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/solutions/contact"
              prefetch
              className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold rounded-xl hover:from-amber-500 hover:to-amber-700 transition-all transform hover:scale-105"
            >
              Talk to an Expert
            </Link>
            <Link
              href="/calculator"
              prefetch
              className="px-8 py-4 border-2 border-amber-400 text-amber-400 font-bold rounded-xl hover:bg-amber-400/10 transition-all"
            >
              Solar Calculator
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
