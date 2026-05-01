'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 🌀 MORPHING TEXT WITH GLITCH EFFECTS - AWWWARDS SOTD
 *
 * Advanced text animation that morphs between different words
 * Features:
 * - Letter-by-letter morphing animation
 * - Glitch effects during transitions
 * - RGB split effect
 * - Scramble animation
 * - Cyberpunk aesthetic
 *
 * Perfect for hero sections and attention-grabbing headlines
 */

interface MorphingTextProps {
  words: string[];
  interval?: number; // milliseconds between word changes
  className?: string;
  glitchIntensity?: number; // 0-1, how intense the glitch effect
}

export default function MorphingText({
  words,
  interval = 3000,
  className = '',
  glitchIntensity = 0.5,
}: MorphingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsGlitching(true);

      // Glitch for a brief moment before changing
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
        setIsGlitching(false);
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  const currentWord = words[currentIndex];

  return (
    <div className={`relative inline-block ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={{
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
          }}
          exit={{
            opacity: 0,
            y: -20,
            rotateX: 90,
            transition: { duration: 0.3 }
          }}
          className="relative"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Main text */}
          <span className={`relative inline-block ${isGlitching ? 'glitch' : ''}`}>
            {currentWord.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="inline-block"
                style={{
                  textShadow: isGlitching
                    ? `${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0 rgba(255,0,0,${glitchIntensity}),
                       ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0 rgba(0,255,255,${glitchIntensity})`
                    : 'none',
                }}
              >
                {char}
              </motion.span>
            ))}
          </span>

          {/* Glitch layers */}
          {isGlitching && (
            <>
              {/* Red channel */}
              <span
                className="absolute inset-0 text-red-500 opacity-70"
                style={{
                  transform: `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`,
                  mixBlendMode: 'screen',
                }}
              >
                {currentWord}
              </span>

              {/* Cyan channel */}
              <span
                className="absolute inset-0 text-cyan-500 opacity-70"
                style={{
                  transform: `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`,
                  mixBlendMode: 'screen',
                }}
              >
                {currentWord}
              </span>

              {/* Scan lines */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 4px)',
                }}
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/**
 * 💥 GLITCH TEXT - Single word with continuous glitch effect
 */
interface GlitchTextProps {
  children: string;
  className?: string;
  intensity?: number;
}

export function GlitchText({ children, className = '', intensity = 0.3 }: GlitchTextProps) {
  const [glitchOffset, setGlitchOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.95) { // 5% chance to glitch
        setGlitchOffset({
          x: (Math.random() - 0.5) * 6,
          y: (Math.random() - 0.5) * 6,
        });

        // Reset after brief moment
        setTimeout(() => {
          setGlitchOffset({ x: 0, y: 0 });
        }, 100);
      }
    }, 100);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <span className={`relative inline-block ${className}`}>
      {/* Main text */}
      <span className="relative z-10">{children}</span>

      {/* Glitch shadows - Red */}
      <span
        className="absolute inset-0 text-red-500 pointer-events-none"
        style={{
          transform: `translate(${glitchOffset.x}px, ${glitchOffset.y}px)`,
          opacity: intensity,
          mixBlendMode: 'screen',
          clipPath: glitchOffset.x !== 0 ? `polygon(0 ${Math.random() * 100}%, 100% ${Math.random() * 100}%, 100% ${Math.random() * 100}%, 0 ${Math.random() * 100}%)` : 'none',
        }}
      >
        {children}
      </span>

      {/* Glitch shadows - Cyan */}
      <span
        className="absolute inset-0 text-cyan-500 pointer-events-none"
        style={{
          transform: `translate(${-glitchOffset.x}px, ${-glitchOffset.y}px)`,
          opacity: intensity,
          mixBlendMode: 'screen',
          clipPath: glitchOffset.x !== 0 ? `polygon(0 ${Math.random() * 100}%, 100% ${Math.random() * 100}%, 100% ${Math.random() * 100}%, 0 ${Math.random() * 100}%)` : 'none',
        }}
      >
        {children}
      </span>
    </span>
  );
}

/**
 * ⚡ SCRAMBLE TEXT - Text that scrambles before revealing
 */
interface ScrambleTextProps {
  children: string;
  className?: string;
  scrambleDuration?: number; // milliseconds
  trigger?: boolean; // When true, scrambles and reveals
}

export function ScrambleText({
  children,
  className = '',
  scrambleDuration = 1000,
  trigger = false
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(children);
  const [isScrambling, setIsScrambling] = useState(false);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

  useEffect(() => {
    if (!trigger) return;

    setIsScrambling(true);
    const targetText = children;
    const scrambleSteps = 20;
    let currentStep = 0;

    const scrambleInterval = setInterval(() => {
      if (currentStep >= scrambleSteps) {
        setDisplayText(targetText);
        setIsScrambling(false);
        clearInterval(scrambleInterval);
        return;
      }

      // Gradually reveal correct letters
      const revealIndex = Math.floor((currentStep / scrambleSteps) * targetText.length);
      const scrambledText = targetText
        .split('')
        .map((char, index) => {
          if (index < revealIndex) {
            return char; // Already revealed
          } else if (char === ' ') {
            return ' '; // Keep spaces
          } else {
            return chars[Math.floor(Math.random() * chars.length)]; // Scramble
          }
        })
        .join('');

      setDisplayText(scrambledText);
      currentStep++;
    }, scrambleDuration / scrambleSteps);

    return () => clearInterval(scrambleInterval);
  }, [trigger, children, scrambleDuration]);

  return (
    <span className={`font-mono ${className} ${isScrambling ? 'animate-pulse' : ''}`}>
      {displayText}
    </span>
  );
}
