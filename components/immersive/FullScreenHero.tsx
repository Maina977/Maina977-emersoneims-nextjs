'use client';

/**
 * FULL-SCREEN IMMERSIVE HERO
 * World-class hero section with WebGL background and 3D elements
 */

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh, SphereGeometry } from 'three';
import { OrbitControls, PerspectiveCamera, Environment, Lightformer } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface HeroParticleProps {
  position: [number, number, number];
  speed: number;
}

function HeroParticle({ position, speed }: HeroParticleProps) {
  const meshRef = useRef<Mesh>(null);
  const timeOffset = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    meshRef.current.position.y = position[1] + Math.sin(time * speed + timeOffset.current) * 2;
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.01;
    
    const scale = 1 + Math.sin(time * 2 + timeOffset.current) * 0.2;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <primitive object={new SphereGeometry(0.1, 8, 8)} />
      <meshStandardMaterial
        color="#fbbf24"
        emissive="#fbbf24"
        emissiveIntensity={0.8}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

function HeroScene() {
  const prefersReducedMotion = useReducedMotion();
  
  const particles = Array.from({ length: 50 }, () => ({
    position: [
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
    ] as [number, number, number],
    speed: 0.5 + Math.random() * 0.5,
  }));

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#fbbf24" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4a90e2" />
      
      {!prefersReducedMotion && particles.map((p, i) => (
        <HeroParticle key={i} {...p} />
      ))}
      
      <Environment resolution={64}>
        <Lightformer intensity={1.2} position={[0, 5, -10]} scale={[20, 20, 1]} color="#fbbf24" />
        <Lightformer intensity={1.0} position={[0, -5, -10]} scale={[20, 20, 1]} color="#00ffff" />
      </Environment>
    </>
  );
}

interface FullScreenHeroProps {
  title: string;
  subtitle: string;
  videoSrc?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function FullScreenHero({
  title,
  subtitle,
  videoSrc,
  ctaText = 'Get Started',
  ctaLink = '/contact',
}: FullScreenHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  return (
    <motion.section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
      style={{ opacity, scale }}
    >
      {/* WebGL Background */}
      <div className="absolute inset-0 -z-10">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} />
          <HeroScene />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Video Background (optional) */}
      {videoSrc && (
        <div className="absolute inset-0 -z-10">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-30"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4"
        style={{ y }}
      >
        <motion.h1
          className="text-7xl md:text-9xl font-display text-brand-gold mb-6 drop-shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {title}
        </motion.h1>
        <motion.p
          className="text-xl md:text-3xl text-white/90 mb-12 max-w-4xl font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {subtitle}
        </motion.p>
        <motion.a
          href={ctaLink}
          className="cta-button-primary text-lg px-12 py-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {ctaText} →
        </motion.a>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
        </div>
      </motion.div>
    </motion.section>
  );
}

