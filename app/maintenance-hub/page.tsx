'use client';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * UNIVERSAL COMMAND BRIDGE - SCI-FI COCKPIT INTERFACE
 * World's Most Comprehensive Maintenance Hub
 * Central command center for all maintenance services
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICE CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════
const SERVICES = [
  {
    id: 'generators',
    name: 'Generator Oracle',
    icon: '⚡',
    description: 'World\'s most comprehensive generator diagnostic platform with 230,000+ fault codes, AI-powered diagnostics, and expert repair guides for all major controller brands.',
    href: '/maintenance-hub/generators',
    stats: { value: '230K+', label: 'Fault Codes' },
    color: 'amber',
    glowColor: 'rgba(251, 191, 36, 0.5)',
    features: ['DSE/ComAp/Woodward', '5-Tab Diagnosis System', 'Kenya Case Studies', 'Real Costs in KES'],
  },
  {
    id: 'solar',
    name: 'Solar Bible',
    icon: '☀️',
    description: 'Kenya\'s most comprehensive solar energy guide with all 47 counties, advanced calculator, installation guides, and complete FAQ covering residential to industrial.',
    href: '/maintenance-hub/solar',
    stats: { value: '47', label: 'Counties' },
    color: 'cyan',
    glowColor: 'rgba(34, 211, 238, 0.5)',
    features: ['Solar Calculator', '12 Property Types', '5-Phase Install Guide', '30+ FAQs'],
  },
  {
    id: 'general',
    name: 'Services Bible',
    icon: '🔧',
    description: 'Complete maintenance services guide covering borehole drilling, motor rewinding, AC installation, electrical work, welding, and plumbing across all 47 counties.',
    href: '/maintenance-hub/general',
    stats: { value: '6', label: 'Categories' },
    color: 'green',
    glowColor: 'rgba(34, 197, 94, 0.5)',
    features: ['Borehole & Pumps', 'Motor Rewinding', 'AC & Refrigeration', 'Electrical & Welding'],
  },
  {
    id: 'motors',
    name: 'Motor Control',
    icon: '⚙️',
    description: 'Professional electric motor rewinding, VFD installation, bearing replacement, and shaft repair for motors from 0.25 HP to 500 HP.',
    href: '/maintenance-hub/general?cat=motors',
    stats: { value: '500HP', label: 'Max Capacity' },
    color: 'purple',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    features: ['Rewinding', 'VFD/Inverters', 'Bearing Analysis', 'Shaft Repair'],
  },
  {
    id: 'hvac',
    name: 'AC & Refrigeration',
    icon: '❄️',
    description: 'Complete AC installation, repair, and cold room services. Split ACs, ducted systems, VRF/VRV, chillers, and walk-in freezers.',
    href: '/maintenance-hub/general?cat=ac',
    stats: { value: '3,500+', label: 'Installations' },
    color: 'blue',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    features: ['Split AC', 'Ducted Systems', 'VRF/VRV', 'Cold Rooms'],
  },
  {
    id: 'electrical',
    name: 'Electrical Systems',
    icon: '⚡',
    description: 'Industrial electrical installations, power factor correction, earthing systems, lightning protection, and solar power installations.',
    href: '/maintenance-hub/general?cat=electrical',
    stats: { value: '11kV', label: 'Max Capacity' },
    color: 'yellow',
    glowColor: 'rgba(234, 179, 8, 0.5)',
    features: ['Power Distribution', 'PFC', 'Earthing', 'Lightning Protection'],
  },
  {
    id: 'pumps',
    name: 'Borehole & Pumps',
    icon: '💧',
    description: 'Complete borehole drilling up to 500m, submersible pump installation, solar-powered pumping systems, and pump repairs.',
    href: '/maintenance-hub/general?cat=borehole',
    stats: { value: '500m', label: 'Max Depth' },
    color: 'teal',
    glowColor: 'rgba(20, 184, 166, 0.5)',
    features: ['Borehole Drilling', 'Submersible Pumps', 'Solar Pumping', 'Repairs'],
  },
  {
    id: 'welding',
    name: 'Welding & Fabrication',
    icon: '🔥',
    description: 'Professional welding and metal fabrication - structural steel, gates, grills, tanks, and custom fabrication projects.',
    href: '/maintenance-hub/general?cat=welding',
    stats: { value: '50mm', label: 'Max Steel' },
    color: 'red',
    glowColor: 'rgba(239, 68, 68, 0.5)',
    features: ['Structural Steel', 'Gates & Grills', 'Tank Fabrication', 'On-site Welding'],
  },
  {
    id: 'plumbing',
    name: 'Plumbing Systems',
    icon: '🚿',
    description: 'Complete plumbing solutions - water supply, drainage, hot water systems, and water treatment for residential to industrial.',
    href: '/maintenance-hub/general?cat=plumbing',
    stats: { value: '2,800+', label: 'Projects' },
    color: 'indigo',
    glowColor: 'rgba(99, 102, 241, 0.5)',
    features: ['Water Supply', 'Drainage', 'Hot Water', 'Treatment'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATED ORBITAL RINGS
// ═══════════════════════════════════════════════════════════════════════════════
const OrbitalRings = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-20">
    {[300, 450, 600].map((size, i) => (
      <motion.div
        key={size}
        className="absolute rounded-full border border-cyan-500/30"
        style={{ width: size, height: size }}
        animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
        transition={{ duration: 60 + i * 20, repeat: Infinity, ease: "linear" }}
      >
        {/* Orbital markers */}
        {[...Array(4)].map((_, j) => (
          <div
            key={j}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${j * 90}deg) translateY(-${size/2}px) translateX(-50%)`,
            }}
          />
        ))}
      </motion.div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// HOLOGRAPHIC GRID BACKGROUND
// ═══════════════════════════════════════════════════════════════════════════════
const HolographicGrid = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Perspective grid */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `
          linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        transform: 'perspective(500px) rotateX(60deg)',
        transformOrigin: 'center top',
      }}
    />
    {/* Radial glow */}
    <div className="absolute inset-0 bg-gradient-radial from-cyan-500/10 via-transparent to-transparent" />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATED SCANLINE EFFECT
// ═══════════════════════════════════════════════════════════════════════════════
const ScanlineEffect = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <motion.div
      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
      animate={{ top: ['0%', '100%'] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      style={{ boxShadow: '0 0 30px 10px rgba(34, 211, 238, 0.3)' }}
    />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM STATUS PANEL
// ═══════════════════════════════════════════════════════════════════════════════
const SystemStatusPanel = () => {
  const [systemStats, setSystemStats] = useState({
    uptime: '99.97%',
    activeServices: 9,
    faultCodes: 230000,
    lastUpdate: new Date(),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        lastUpdate: new Date(),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/30">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-cyan-400 text-sm font-bold">SYSTEM STATUS: ONLINE</span>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-slate-400">Uptime</span>
          <div className="text-white font-mono text-lg">{systemStats.uptime}</div>
        </div>
        <div>
          <span className="text-slate-400">Active Services</span>
          <div className="text-white font-mono text-lg">{systemStats.activeServices}</div>
        </div>
        <div>
          <span className="text-slate-400">Fault Database</span>
          <div className="text-white font-mono text-lg">{systemStats.faultCodes.toLocaleString()}</div>
        </div>
        <div>
          <span className="text-slate-400">Last Sync</span>
          <div className="text-white font-mono text-lg">
            {systemStats.lastUpdate.toLocaleTimeString('en-US', { hour12: false })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// HEXAGON SERVICE CARD
// ═══════════════════════════════════════════════════════════════════════════════
const ServiceCard = ({ service, index }: { service: typeof SERVICES[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', glow: 'shadow-green-500/20' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
    red: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', glow: 'shadow-red-500/20' },
    teal: { bg: 'bg-teal-500/10', border: 'border-teal-500/30', text: 'text-teal-400', glow: 'shadow-teal-500/20' },
    indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-400', glow: 'shadow-indigo-500/20' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
  };

  const colors = colorMap[service.color] || colorMap.cyan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={service.href}>
        <motion.div
          className={`relative ${colors.bg} ${colors.border} border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 overflow-hidden`}
          whileHover={{ scale: 1.02, y: -5 }}
          style={{
            boxShadow: isHovered ? `0 20px 40px ${service.glowColor}` : 'none',
          }}
        >
          {/* Corner decorations */}
          <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 ${colors.border} rounded-tl-xl`} />
          <div className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 ${colors.border} rounded-tr-xl`} />
          <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 ${colors.border} rounded-bl-xl`} />
          <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 ${colors.border} rounded-br-xl`} />

          {/* Hover glow effect */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"
              />
            )}
          </AnimatePresence>

          {/* Content */}
          <div className="relative z-10">
            {/* Icon and stats */}
            <div className="flex items-start justify-between mb-4">
              <div className={`text-5xl ${isHovered ? 'animate-bounce' : ''}`}>
                {service.icon}
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${colors.text}`}>{service.stats.value}</div>
                <div className="text-slate-400 text-xs">{service.stats.label}</div>
              </div>
            </div>

            {/* Title and description */}
            <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
            <p className="text-slate-400 text-sm mb-4 line-clamp-2">{service.description}</p>

            {/* Features */}
            <div className="flex flex-wrap gap-2">
              {service.features.map((feature, i) => (
                <span
                  key={i}
                  className={`px-2 py-1 ${colors.bg} ${colors.border} border rounded-md text-xs ${colors.text}`}
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* Arrow indicator */}
            <motion.div
              className={`absolute bottom-4 right-4 ${colors.text}`}
              animate={{ x: isHovered ? 5 : 0 }}
            >
              →
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// QUICK ACCESS TERMINAL
// ═══════════════════════════════════════════════════════════════════════════════
const QuickAccessTerminal = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/30">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-cyan-400">⌘</span>
        <span className="text-cyan-400 text-sm font-bold">QUICK ACCESS TERMINAL</span>
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder="Search fault codes, services, procedures..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onBlur={() => setTimeout(() => setIsExpanded(false), 200)}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
          Press /
        </span>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            <div className="text-xs text-slate-400 mb-2">QUICK COMMANDS</div>
            <div className="flex flex-wrap gap-2">
              {['fault:F01', 'brand:growatt', 'service:solar', 'status:critical'].map((cmd) => (
                <button
                  key={cmd}
                  className="px-3 py-1 bg-slate-800/50 border border-slate-700 rounded-md text-xs text-cyan-400 hover:border-cyan-500 transition-colors font-mono"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LIVE ACTIVITY FEED
// ═══════════════════════════════════════════════════════════════════════════════
const LiveActivityFeed = () => {
  const activities = [
    { time: '12:45:32', type: 'lookup', message: 'Fault F03 lookup - Growatt SPF5000ES', color: 'cyan' },
    { time: '12:44:18', type: 'alert', message: 'Critical alert cleared - Site #247', color: 'green' },
    { time: '12:43:55', type: 'service', message: 'Solar system commissioned - Nakuru', color: 'amber' },
    { time: '12:42:01', type: 'lookup', message: 'Battery fault E05 - Pylontech US3000C', color: 'cyan' },
    { time: '12:41:22', type: 'alert', message: 'Generator maintenance due - Site #189', color: 'amber' },
  ];

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/30">
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          className="w-2 h-2 bg-red-500 rounded-full"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <span className="text-cyan-400 text-sm font-bold">LIVE ACTIVITY FEED</span>
      </div>
      <div className="space-y-3 max-h-48 overflow-auto">
        {activities.map((activity, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-3 text-sm"
          >
            <span className="text-slate-500 font-mono text-xs whitespace-nowrap">{activity.time}</span>
            <span className={`text-${activity.color}-400`}>●</span>
            <span className="text-slate-300">{activity.message}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMMAND BRIDGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function UniversalCommandBridge() {
  const [systemTime, setSystemTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 relative overflow-hidden">
      {/* Background effects */}
      <HolographicGrid />
      <OrbitalRings />
      <ScanlineEffect />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                className="w-3 h-3 bg-cyan-400 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-cyan-400 text-sm font-bold tracking-wider">EMERSON EIMS</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-2">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                UNIVERSAL
              </span>
              <br />
              <span className="text-white">COMMAND BRIDGE</span>
            </h1>
            <p className="text-slate-400 text-lg">
              World's Most Comprehensive Maintenance Hub • 230,000+ Fault Codes • All 47 Kenya Counties
            </p>
          </div>

          {/* System clock */}
          <div className="mt-6 md:mt-0 bg-slate-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6">
            <div className="text-center">
              <div className="text-cyan-400 text-xs tracking-wider mb-1">SYSTEM TIME</div>
              <div className="text-4xl font-mono text-white font-bold">
                {systemTime.toLocaleTimeString('en-US', { hour12: false })}
              </div>
              <div className="text-slate-400 text-sm mt-1">
                {systemTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { value: '230,000+', label: 'Fault Codes Database', color: 'cyan' },
            { value: '47', label: 'Counties Covered', color: 'green' },
            { value: '15,000+', label: 'Projects Completed', color: 'amber' },
            { value: '24/7', label: 'Emergency Support', color: 'purple' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 text-center"
            >
              <div className={`text-3xl font-bold text-${stat.color}-400`}>{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left sidebar */}
          <div className="space-y-6">
            <SystemStatusPanel />
            <QuickAccessTerminal />
            <LiveActivityFeed />
          </div>

          {/* Service cards */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-cyan-400">◆</span>
                SERVICE COMMAND CENTERS
              </h2>
              <span className="text-slate-400 text-sm">{SERVICES.length} Active</span>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {SERVICES.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 bg-slate-900/80 backdrop-blur-sm border border-cyan-500/20 rounded-full px-6 py-3">
            <motion.div
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-slate-400 text-sm">All systems operational</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 text-sm">COMMAND BRIDGE v3.0</span>
          </div>
          <p className="text-slate-500 text-xs mt-4">
            © 2024 Emerson EIMS • World's Most Comprehensive Maintenance Platform
          </p>
        </motion.div>
      </div>

      {/* CSS for radial gradient */}
      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-from) 0%, var(--tw-gradient-via) 50%, var(--tw-gradient-to) 100%);
        }
      `}</style>
    </div>
  );
}
