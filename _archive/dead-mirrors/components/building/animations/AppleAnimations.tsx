'use client';

import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

// Apple-style reveal animation
interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function RevealOnScroll({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 75 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 75 }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.22, 1, 0.36, 1] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Apple-style text reveal (word by word)
interface TextRevealProps {
  text: string;
  className?: string;
  highlightWords?: string[];
  highlightClassName?: string;
}

export function TextReveal({ 
  text, 
  className = '', 
  highlightWords = [],
  highlightClassName = 'text-amber-400'
}: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const words = text.split(' ');

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ 
            duration: 0.5, 
            delay: i * 0.05,
            ease: [0.22, 1, 0.36, 1]
          }}
          className={`inline-block mr-[0.25em] ${highlightWords.includes(word) ? highlightClassName : ''}`}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// Apple-style parallax image
interface ParallaxImageProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxImage({ children, speed = 0.5, className = '' }: ParallaxImageProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y: smoothY }}>
        {children}
      </motion.div>
    </div>
  );
}

// Apple-style scale on scroll
interface ScaleOnScrollProps {
  children: ReactNode;
  className?: string;
}

export function ScaleOnScroll({ children, className = '' }: ScaleOnScrollProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      style={{ scale: smoothScale, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Magnetic hover effect (like Apple buttons)
interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticButton({ children, className = '', strength = 0.3 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate(0, 0)';
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Counter animation
interface CounterProps {
  from?: number;
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function Counter({ 
  from = 0, 
  to, 
  suffix = '', 
  prefix = '',
  duration = 2,
  className = '' 
}: CounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
    >
      {prefix}
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      >
        {isInView && (
          <CounterAnimation from={from} to={to} duration={duration} />
        )}
      </motion.span>
      {suffix}
    </motion.span>
  );
}

function CounterAnimation({ from, to, duration }: { from: number; to: number; duration: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useMotionValueEvent(from, to, duration, (value) => {
    if (nodeRef.current) {
      nodeRef.current.textContent = Math.round(value).toLocaleString();
    }
  });

  return <span ref={nodeRef}>{from}</span>;
}

function useMotionValueEvent(from: number, to: number, duration: number, callback: (value: number) => void) {
  const ref = useRef({ startTime: 0, animationFrame: 0 });

  useRef(() => {
    const animate = (timestamp: number) => {
      if (!ref.current.startTime) ref.current.startTime = timestamp;
      const progress = Math.min((timestamp - ref.current.startTime) / (duration * 1000), 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      const value = from + (to - from) * easeProgress;
      callback(value);
      if (progress < 1) {
        ref.current.animationFrame = requestAnimationFrame(animate);
      }
    };
    ref.current.animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current.animationFrame);
  });
}

// Stagger children animation
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ children, className = '', staggerDelay = 0.1 }: StaggerContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Glow effect on hover
interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowCard({ children, className = '', glowColor = 'rgba(251, 191, 36, 0.4)' }: GlowCardProps) {
  return (
    <motion.div
      className={`relative group ${className}`}
      whileHover="hover"
      initial="rest"
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-2 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: glowColor }}
        variants={{
          rest: { opacity: 0 },
          hover: { opacity: 1 }
        }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

// Floating animation
interface FloatingProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  distance?: number;
}

export function Floating({ children, className = '', duration = 3, distance = 10 }: FloatingProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-distance, distance, -distance],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}
