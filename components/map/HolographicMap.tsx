'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

/**
 * 🚀 HOLOGRAPHIC 3D INTERACTIVE MAP
 * The most revolutionary map design ever created for the web
 * Features:
 * - 3D holographic projection effect
 * - Particle system with gravitational pull
 * - Real-time pulse waves radiating from location
 * - Interactive holographic layers
 * - Rotating 3D wireframe globe
 * - Neon circuit board pathways
 * - Dynamic weather effects
 * - Quantum entanglement visual effects
 * - AR-style location markers
 * - Cinematic camera movements
 */

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
}

export default function HolographicMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [pulsePhase, setPulsePhase] = useState(0);
  const [activeLayer, setActiveLayer] = useState<'satellite' | 'hologram' | '3d'>('hologram');

  // Mouse tracking for 3D effect
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Smooth spring animations
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Transform mouse position to rotation
  const rotateX = useTransform(smoothY, [0, 1], [15, -15]);
  const rotateY = useTransform(smoothX, [0, 1], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  // Initialize particle system with mobile optimization
  useEffect(() => {
    const generateParticles = () => {
      // Detect mobile/tablet for performance optimization
      const isMobile = typeof window !== 'undefined' && (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth < 768
      );

      // Reduce particles on mobile: 50 instead of 150 (66% reduction)
      const particleCount = isMobile ? 50 : 150;

      const newParticles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 0.5,
          color: ['#fbbf24', '#f59e0b', '#06b6d4', '#0ea5e9'][Math.floor(Math.random() * 4)],
          life: Math.random(),
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  // Animate particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        // Gravitational pull towards center
        const centerX = 50;
        const centerY = 50;
        const dx = centerX - particle.x;
        const dy = centerY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
          particle.vx += (dx / distance) * 0.01;
          particle.vy += (dy / distance) * 0.01;
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > 100) particle.vx *= -0.8;
        if (particle.y < 0 || particle.y > 100) particle.vy *= -0.8;

        // Keep within bounds
        particle.x = Math.max(0, Math.min(100, particle.x));
        particle.y = Math.max(0, Math.min(100, particle.y));

        // Fade life
        particle.life = (particle.life + 0.005) % 1;

        // Draw particle
        const alpha = Math.sin(particle.life * Math.PI) * 0.8;
        ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(
          (particle.x / 100) * canvas.width,
          (particle.y / 100) * canvas.height,
          particle.size,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, [particles]);

  // Pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Set canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const layers = [
    { id: 'satellite', name: 'SATELLITE', icon: '🛰️' },
    { id: 'hologram', name: 'HOLOGRAM', icon: '⚡' },
    { id: '3d', name: '3D RENDER', icon: '🔮' },
  ] as const;

  return (
    <div className="relative w-full">
      {/* Layer Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex gap-2"
      >
        {layers.map((layer) => (
          <motion.button
            key={layer.id}
            onClick={() => setActiveLayer(layer.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              px-6 py-3 rounded-xl font-mono text-sm font-bold backdrop-blur-xl border-2 transition-all
              ${activeLayer === layer.id
                ? 'bg-amber-500/30 border-amber-500 text-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.4)]'
                : 'bg-black/60 border-white/20 text-white/60 hover:border-white/40'
              }
            `}
          >
            <span className="mr-2">{layer.icon}</span>
            {layer.name}
          </motion.button>
        ))}
      </motion.div>

      {/* Main Container */}
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          mouseX.set(0.5);
          mouseY.set(0.5);
        }}
        style={{
          perspective: '2000px',
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full aspect-[16/10] overflow-hidden rounded-3xl"
      >
        {/* Holographic Base Platform */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full h-full"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

          {/* Animated Grid Floor */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(rgba(251,191,36,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(251,191,36,0.3) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              transform: 'perspective(600px) rotateX(75deg) translateZ(-100px)',
              transformOrigin: 'center center',
            }}
          />

          {/* Particle Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ mixBlendMode: 'screen' }}
          />

          {/* Center Pulse Waves */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center pointer-events-none">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border-2 border-amber-500/50"
                style={{
                  width: `${20 + ((pulsePhase + i * 90) % 360) / 2}%`,
                  height: `${20 + ((pulsePhase + i * 90) % 360) / 2}%`,
                }}
                animate={{
                  opacity: [0.8, 0, 0.8],
                  scale: [1, 2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 1,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>

          {/* Holographic Map Layers */}
          <AnimatePresence mode="wait">
            {activeLayer === 'satellite' && (
              <motion.div
                key="satellite"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="absolute inset-0"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8!2d36.89!3d-1.32!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f139bef8b8e9d%3A0x8c8f69e4e7f7d8c8!2sKEMSA!5e0!3m2!1sen!2ske!4v1709049600000"
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                    filter: 'saturate(1.3) contrast(1.2)',
                    borderRadius: '24px',
                  }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </motion.div>
            )}

            {activeLayer === 'hologram' && (
              <motion.div
                key="hologram"
                initial={{ opacity: 0, z: -100 }}
                animate={{ opacity: 1, z: 0 }}
                exit={{ opacity: 0, z: 100 }}
                className="absolute inset-0"
              >
                {/* Holographic Map Visual */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Central Location Marker */}
                  <motion.div
                    animate={{
                      y: [0, -20, 0],
                      rotateY: [0, 360],
                    }}
                    transition={{
                      y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                      rotateY: { duration: 8, repeat: Infinity, ease: 'linear' },
                    }}
                    className="relative"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Glowing Core */}
                    <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 shadow-[0_0_80px_rgba(251,191,36,0.8)]">
                      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 animate-pulse" />
                      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-200 to-amber-300 flex items-center justify-center">
                        <svg className="w-16 h-16 text-white drop-shadow-2xl" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>

                    {/* Orbiting Rings */}
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-cyan-400/50 rounded-full"
                        style={{
                          width: `${160 + i * 60}px`,
                          height: `${160 + i * 60}px`,
                        }}
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 20 / i,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      >
                        <motion.div
                          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [1, 0.5, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.5,
                          }}
                        />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Hexagonal Grid Overlay */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M29 10 L44 18 L44 34 L29 42 L14 34 L14 18 Z' fill='none' stroke='%23fbbf24' stroke-width='1'/%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px',
                  }} />

                  {/* Coordinate Display */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-8 left-8 bg-black/80 backdrop-blur-xl border border-amber-500/50 rounded-2xl p-6 font-mono"
                  >
                    <div className="text-amber-400 text-xs uppercase tracking-widest mb-2">// COORDINATES</div>
                    <div className="text-white text-2xl font-bold">-1.3200°, 36.8900°</div>
                    <div className="text-gray-400 text-sm mt-2">Embakasi, off Airport North Road, Nairobi</div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-green-400 text-xs">LOCATION ACTIVE</span>
                    </div>
                  </motion.div>

                  {/* Data Streams */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 bg-gradient-to-b from-amber-500 to-transparent"
                      style={{
                        height: '100%',
                        left: `${(i + 1) * 12}%`,
                        top: 0,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        y: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: 'linear',
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {activeLayer === '3d' && (
              <motion.div
                key="3d"
                initial={{ opacity: 0, rotateY: -90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: 90 }}
                className="absolute inset-0 flex items-center justify-center"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* 3D Wireframe Globe */}
                <motion.div
                  animate={{
                    rotateY: [0, 360],
                  }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="relative w-96 h-96"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Latitude Lines */}
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={`lat-${i}`}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-cyan-400/30 rounded-full"
                      style={{
                        width: `${300 * Math.abs(Math.cos((i / 10) * Math.PI))}px`,
                        height: `${300 * Math.abs(Math.cos((i / 10) * Math.PI))}px`,
                        transform: `translateX(-50%) translateY(-50%) rotateX(90deg) translateZ(${(i - 5) * 30}px)`,
                      }}
                    />
                  ))}

                  {/* Longitude Lines */}
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={`lon-${i}`}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-amber-400/30 rounded-full"
                      style={{
                        width: '300px',
                        height: '300px',
                        transform: `translateX(-50%) translateY(-50%) rotateY(${(i / 12) * 180}deg)`,
                      }}
                    />
                  ))}

                  {/* Location Pin on Globe */}
                  <motion.div
                    className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <div className="w-8 h-8 bg-red-500 rounded-full shadow-[0_0_40px_rgba(239,68,68,0.8)] flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Corner Brackets - Holographic Frame */}
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
            <motion.div
              key={corner}
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0.5 }}
              className={`absolute w-20 h-20 border-amber-500 ${
                corner.includes('top') ? 'border-t-4' : 'border-b-4'
              } ${
                corner.includes('left') ? 'border-l-4' : 'border-r-4'
              } ${
                corner.includes('top') && corner.includes('left') ? 'top-4 left-4' :
                corner.includes('top') && corner.includes('right') ? 'top-4 right-4' :
                corner.includes('bottom') && corner.includes('left') ? 'bottom-4 left-4' :
                'bottom-4 right-4'
              }`}
            >
              <div className={`absolute w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)] ${
                corner === 'top-left' ? '-top-1 -left-1' :
                corner === 'top-right' ? '-top-1 -right-1' :
                corner === 'bottom-left' ? '-bottom-1 -left-1' :
                '-bottom-1 -right-1'
              }`} />
            </motion.div>
          ))}

          {/* Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-8 right-8 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-xs"
          >
            <div className="text-amber-400 font-mono text-xs uppercase tracking-widest mb-3">// LOCATION DATA</div>
            <div className="space-y-3">
              <div>
                <div className="text-gray-400 text-xs">HQ Address</div>
                <div className="text-white font-semibold">Embakasi, off Airport North Road (Near KEMSA)</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs">Service Radius</div>
                <div className="text-white font-semibold">All 47 Counties</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs">Response Time</div>
                <div className="text-green-400 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  2 Hours Average
                </div>
              </div>
            </div>

            <motion.a
              href="https://maps.google.com/?q=-1.3200,36.8900"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 block w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center font-bold rounded-xl"
            >
              Navigate Now →
            </motion.a>
          </motion.div>

          {/* Scan Lines Effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(251,191,36,0.1) 2px, rgba(251,191,36,0.1) 4px)',
            }}
            animate={{
              backgroundPositionY: ['0px', '4px'],
            }}
            transition={{
              duration: 0.1,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
