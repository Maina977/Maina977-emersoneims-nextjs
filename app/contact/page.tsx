'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';
import HolographicMap from '@/components/map/HolographicMap';

// ═══════════════════════════════════════════════════════════════════════════════
// 🚀 SCI-FI PREMIUM CONTACT PAGE - AWWWARD SOTD WORTHY
// ═══════════════════════════════════════════════════════════════════════════════

// Particle System for background
function ParticleField() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-amber-500/30"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

// Animated Grid Background
function CyberGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Perspective Grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            linear-gradient(90deg, rgba(251,191,36,0.1) 1px, transparent 1px),
            linear-gradient(rgba(251,191,36,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'center top',
        }}
      />
      
      {/* Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.15)_0%,transparent_70%)]" />
      
      {/* Scan Lines */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        }}
        animate={{ backgroundPositionY: ['0px', '4px'] }}
        transition={{ duration: 0.1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

// Holographic Card Component
function HoloCard({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0.5, y: 0.5 })}
      className={`relative group ${className}`}
      style={{ perspective: '1000px' }}
    >
      {/* Holographic Border */}
      <div 
        className="absolute -inset-[1px] rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(${mousePos.x * 360}deg, #fbbf24, #f59e0b, #ea580c, #fbbf24)`,
          filter: 'blur(1px)',
        }}
      />
      
      {/* Card Content */}
      <div 
        className="relative bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
        style={{
          transform: `rotateY(${(mousePos.x - 0.5) * 5}deg) rotateX(${(mousePos.y - 0.5) * -5}deg)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Holographic Sheen */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(251,191,36,0.3), transparent 50%)`,
          }}
        />
        {children}
      </div>
    </motion.div>
  );
}

// Glitch Text Effect
function GlitchText({ children, className = '' }: { children: string; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <span 
        className="absolute top-0 left-0 text-cyan-400 opacity-70 animate-pulse"
        style={{ clipPath: 'inset(0 0 50% 0)', transform: 'translate(-2px, -1px)' }}
        aria-hidden="true"
      >
        {children}
      </span>
      <span 
        className="absolute top-0 left-0 text-red-400 opacity-70 animate-pulse"
        style={{ clipPath: 'inset(50% 0 0 0)', transform: 'translate(2px, 1px)' }}
        aria-hidden="true"
      >
        {children}
      </span>
    </span>
  );
}

// Typing Animation
function TypeWriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  useEffect(() => {
    const cursorInterval = setInterval(() => setShowCursor(prev => !prev), 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className="font-mono">
      {displayText}
      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} text-amber-400`}>|</span>
    </span>
  );
}

// Animated Counter
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}{suffix}</span>;
}

// Main Contact Form with Sci-Fi styling
function SciFiContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    urgency: 'normal',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const services = [
    'Diesel Generators',
    'Solar Energy Systems',
    'UPS & Power Protection',
    'HVAC & Air Conditioning',
    'Motor Rewinding',
    'Borehole & Water Systems',
    'High Voltage Infrastructure',
    'Steel Fabrication',
    'Incinerators',
    'Other Services',
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitStatus('success');
    
    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitStatus('idle');
      setFormData({ name: '', email: '', phone: '', service: '', message: '', urgency: 'normal' });
    }, 3000);
  };

  const inputClasses = (field: string) => `
    w-full bg-black/50 border-2 rounded-xl px-5 py-4 text-white placeholder-gray-500
    transition-all duration-300 outline-none backdrop-blur-sm
    ${focusedField === field 
      ? 'border-amber-500 shadow-[0_0_20px_rgba(251,191,36,0.3)]' 
      : 'border-white/10 hover:border-white/30'}
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name & Email Row */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="relative">
          <label className="block text-xs text-amber-400 uppercase tracking-wider mb-2 font-mono">
            // IDENTIFICATION
          </label>
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            className={inputClasses('name')}
            required
          />
          {focusedField === 'name' && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-amber-500 to-orange-500"
            />
          )}
        </div>
        
        <div className="relative">
          <label className="block text-xs text-amber-400 uppercase tracking-wider mb-2 font-mono">
            // COMM_LINK
          </label>
          <input
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            className={inputClasses('email')}
            required
          />
        </div>
      </div>

      {/* Phone & Service Row */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs text-amber-400 uppercase tracking-wider mb-2 font-mono">
            // DIRECT_LINE
          </label>
          <input
            type="tel"
            placeholder="+254 7XX XXX XXX"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            onFocus={() => setFocusedField('phone')}
            onBlur={() => setFocusedField(null)}
            className={inputClasses('phone')}
          />
        </div>
        
        <div>
          <label className="block text-xs text-amber-400 uppercase tracking-wider mb-2 font-mono">
            // SERVICE_TYPE
          </label>
          <select
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            onFocus={() => setFocusedField('service')}
            onBlur={() => setFocusedField(null)}
            className={`${inputClasses('service')} appearance-none cursor-pointer`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23fbbf24'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '1.5rem',
            }}
            required
          >
            <option value="">Select Service...</option>
            {services.map((service) => (
              <option key={service} value={service} className="bg-black text-white">
                {service}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Urgency Level */}
      <div>
        <label className="block text-xs text-amber-400 uppercase tracking-wider mb-3 font-mono">
          // PRIORITY_LEVEL
        </label>
        <div className="flex gap-4">
          {[
            { value: 'low', label: 'Standard', color: 'green' },
            { value: 'normal', label: 'Priority', color: 'amber' },
            { value: 'high', label: 'Emergency', color: 'red' },
          ].map((level) => (
            <motion.button
              key={level.value}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFormData({ ...formData, urgency: level.value })}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-300 font-mono text-sm ${
                formData.urgency === level.value
                  ? level.color === 'green' 
                    ? 'border-green-500 bg-green-500/20 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                    : level.color === 'amber'
                    ? 'border-amber-500 bg-amber-500/20 text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                    : 'border-red-500 bg-red-500/20 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                  : 'border-white/10 text-gray-400 hover:border-white/30'
              }`}
            >
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                level.color === 'green' ? 'bg-green-500' : level.color === 'amber' ? 'bg-amber-500' : 'bg-red-500'
              } ${formData.urgency === level.value ? 'animate-pulse' : ''}`} />
              {level.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs text-amber-400 uppercase tracking-wider mb-2 font-mono">
          // TRANSMISSION_DATA
        </label>
        <textarea
          placeholder="Describe your power requirements..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          onFocus={() => setFocusedField('message')}
          onBlur={() => setFocusedField(null)}
          rows={5}
          className={`${inputClasses('message')} resize-none`}
          required
        />
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting || submitStatus === 'success'}
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        className={`
          relative w-full py-5 rounded-xl font-bold text-lg overflow-hidden
          transition-all duration-500 group
          ${submitStatus === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white'}
        `}
      >
        {/* Animated Background */}
        {!isSubmitting && submitStatus !== 'success' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        )}
        
        <span className="relative z-10 flex items-center justify-center gap-3">
          {isSubmitting ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
              />
              TRANSMITTING...
            </>
          ) : submitStatus === 'success' ? (
            <>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              TRANSMISSION SUCCESSFUL
            </>
          ) : (
            <>
              INITIATE TRANSMISSION
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </span>
      </motion.button>
    </form>
  );
}

// Contact Method Card
function ContactMethodCard({ 
  icon, 
  title, 
  value, 
  subtext, 
  href, 
  delay,
  gradient 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  subtext: string;
  href: string;
  delay: number;
  gradient: string;
}) {
  return (
    <HoloCard delay={delay} className="h-full">
      <a href={href} className="block p-8 h-full">
        {/* Icon with glow */}
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-lg`}>
          {icon}
        </div>
        
        {/* Content */}
        <div className="space-y-2">
          <p className="text-xs text-amber-400 uppercase tracking-wider font-mono">// {title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-gray-400 text-sm">{subtext}</p>
        </div>
        
        {/* Hover indicator */}
        <motion.div 
          className="mt-6 flex items-center gap-2 text-amber-400 text-sm font-medium"
          whileHover={{ x: 5 }}
        >
          Connect Now
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </motion.div>
      </a>
    </HoloCard>
  );
}

// Stats Display
function StatsDisplay() {
  const stats = [
    { value: 47, suffix: '', label: 'Counties Covered' },
    { value: 24, suffix: '/7', label: 'Emergency Support' },
    { value: 2, suffix: 'hr', label: 'Response Time' },
    { value: 500, suffix: '+', label: 'Projects Completed' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
        >
          <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
          </div>
          <div className="text-gray-400 text-sm mt-2 font-mono uppercase tracking-wider">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

// Revolutionary Location Map Section
function LocationSection() {
  return (
    <section className="relative py-20 bg-gradient-to-b from-black via-gray-900/50 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-amber-400 font-mono text-sm mb-4">// HOLOGRAPHIC_NAVIGATION_SYSTEM</p>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Experience The Future
            </span>
            <br />
            <span className="text-white">of Location Mapping</span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg">
            Interact with our revolutionary 3D holographic map system. Switch between satellite, hologram,
            and 3D render modes to explore our headquarters location in ways never before seen on the web.
          </p>
        </motion.div>

        {/* Revolutionary Holographic Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <HolographicMap />
        </motion.div>

        {/* Additional Location Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <HoloCard delay={0.1}>
            <div className="p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-xs text-amber-400 uppercase tracking-wider font-mono mb-2">// ADDRESS</p>
              <p className="text-white font-semibold text-lg mb-1">Embakasi, Nairobi</p>
              <p className="text-gray-400 text-sm">Old North Airport Road</p>
              <p className="text-gray-400 text-sm">P.O. Box 387-00521</p>
            </div>
          </HoloCard>

          <HoloCard delay={0.2}>
            <div className="p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs text-amber-400 uppercase tracking-wider font-mono mb-2">// HOURS</p>
              <p className="text-white font-semibold mb-1">Mon-Fri: 8AM-6PM</p>
              <p className="text-gray-400 text-sm mb-2">Sat: 9AM-2PM</p>
              <p className="text-red-400 font-medium text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                24/7 Emergency
              </p>
            </div>
          </HoloCard>

          <HoloCard delay={0.3}>
            <div className="p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs text-amber-400 uppercase tracking-wider font-mono mb-2">// COVERAGE</p>
              <p className="text-white font-semibold mb-1">All 47 Counties</p>
              <p className="text-gray-400 text-sm mb-2">Kenya-Wide Service</p>
              <p className="text-green-400 font-medium text-sm">2hr Response Time</p>
            </div>
          </HoloCard>
        </div>
      </div>
    </section>
  );
}

// Main Page Component
export default function SciFiContactPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <main className="bg-black min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Animated Background */}
        <CyberGrid />
        <ParticleField />
        
        {/* Main Hero Content */}
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-6xl mx-auto"
        >
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/50 border border-amber-500/30 backdrop-blur-sm mb-8"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 font-mono text-sm">SYSTEMS ONLINE</span>
            <span className="text-gray-500">|</span>
            <span className="text-amber-400 font-mono text-sm">READY TO CONNECT</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6"
          >
            <GlitchText className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              CONTACT
            </GlitchText>
            <br />
            <span className="text-white">COMMAND CENTER</span>
          </motion.h1>

          {/* Subtitle with typing effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-400 mb-12 h-8"
          >
            <TypeWriter text="Initiating secure communication channel..." delay={800} />
          </motion.div>

          {/* Quick Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a href="tel:+254782914717">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(251,191,36,0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl flex items-center gap-3 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                EMERGENCY LINE
              </motion.button>
            </a>
            <a href="#contact-form">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white/20 text-white font-bold rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                SEND MESSAGE
              </motion.button>
            </a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-xs text-gray-500 uppercase tracking-widest font-mono">Scroll Down</span>
              <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
                <motion.div 
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-3 bg-amber-500 rounded-full" 
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <StatsDisplay />
        </div>
      </section>

      {/* Contact Methods Grid */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-amber-400 font-mono text-sm mb-4">// COMMUNICATION_CHANNELS</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Choose Your Connection</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <ContactMethodCard
              icon={<svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
              title="VOICE_LINK"
              value="+254782914717"
              subtext="Direct line to our operations center. Available 24/7 for emergencies."
              href="tel:+254782914717"
              delay={0}
              gradient="from-green-500 to-emerald-600"
            />
            <ContactMethodCard
              icon={<svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
              title="DATA_LINK"
              value="info@emersoneims.com"
              subtext="Secure encrypted channel for project inquiries and documentation."
              href="mailto:info@emersoneims.com"
              delay={0.1}
              gradient="from-blue-500 to-cyan-600"
            />
            <ContactMethodCard
              icon={<svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>}
              title="INSTANT_LINK"
              value="WhatsApp"
              subtext="Quick response channel for urgent queries and real-time support."
              href="https://wa.me/254768860665"
              delay={0.2}
              gradient="from-green-600 to-green-700"
            />
          </div>
          
          {/* QR Code Quick Connect */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <p className="text-amber-400 font-mono text-sm mb-4">// SCAN_TO_CONNECT</p>
            <div className="inline-flex flex-wrap justify-center items-center gap-6 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
              {/* WhatsApp QR */}
              <div className="text-center">
                <div className="bg-white p-2 rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https%3A%2F%2Fwa.me%2F254768860665%3Ftext%3DHello%2520EmersonEIMS&color=22c55e&format=png"
                    alt="Scan to WhatsApp"
                    width={120}
                    height={120}
                    className="block"
                  />
                </div>
                <p className="text-green-400 text-sm mt-2 font-mono">💬 WhatsApp</p>
              </div>
              {/* Website QR */}
              <div className="text-center">
                <div className="bg-white p-2 rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https%3A%2F%2Fwww.emersoneims.com&color=f59e0b&format=png"
                    alt="Scan to visit website"
                    width={120}
                    height={120}
                    className="block"
                  />
                </div>
                <p className="text-amber-400 text-sm mt-2 font-mono">🌐 Website</p>
              </div>
              {/* Facebook QR */}
              <div className="text-center">
                <div className="bg-white p-2 rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100089864898337&color=1877f2&format=png"
                    alt="Scan to visit Facebook"
                    width={120}
                    height={120}
                    className="block"
                  />
                </div>
                <p className="text-blue-500 text-sm mt-2 font-mono">📘 Facebook</p>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-3">Scan with your phone camera to connect instantly</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="relative py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Column - Info */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-amber-400 font-mono text-sm mb-4">// TRANSMISSION_FORM</p>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Send a <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Transmission</span>
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Our command center receives your message instantly. Expect a response 
                  within 2 hours during business hours, or immediately for emergencies.
                </p>
              </motion.div>

              {/* Response Time Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-400 font-mono text-sm">Emergency: Immediate Response</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <span className="w-3 h-3 bg-amber-500 rounded-full" />
                  <span className="text-amber-400 font-mono text-sm">Priority: Within 2 Hours</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <span className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-blue-400 font-mono text-sm">Standard: Within 24 Hours</span>
                </div>
              </motion.div>

              {/* Trust Signals */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Secure & Encrypted
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  No Spam, Ever
                </div>
              </motion.div>
            </div>

            {/* Right Column - Form */}
            <HoloCard>
              <div className="p-8 md:p-10">
                <SciFiContactForm />
              </div>
            </HoloCard>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <LocationSection />

      {/* Final CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-red-600/20" />
        <CyberGrid />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <p className="text-amber-400 font-mono text-sm mb-4">// FINAL_TRANSMISSION</p>
            <h2 className="text-4xl md:text-6xl font-bold text-white">
              Power Problems?
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                We&apos;re Your Solution.
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From emergency generator repairs to complete solar installations, 
              we&apos;ve got Kenya covered. Connect with us today.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a href="tel:+254768860665">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(251,191,36,0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-bold rounded-xl text-lg shadow-2xl flex items-center gap-3"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now: +254 768 860 665
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
