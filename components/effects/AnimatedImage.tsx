'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import OptimizedImage from '@/components/media/OptimizedImage';

interface AnimatedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  animationType?: 'pop' | 'shake' | 'rotate' | 'parallax' | '3d';
  intensity?: 'low' | 'medium' | 'high';
}

/**
 * Animated Image Component with Multiple Animation Types
 * Supports: popping, shaking, rotating, parallax, and 3D effects
 */
export default function AnimatedImage({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  animationType = 'parallax',
  intensity = 'medium',
}: AnimatedImageProps) {
  const [isInView, setIsInView] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ['start end', 'end start'],
  });

  const intensityMap = {
    low: { pop: 1.05, shake: 2, rotate: 5, parallax: 20 },
    medium: { pop: 1.1, shake: 5, rotate: 10, parallax: 50 },
    high: { pop: 1.2, shake: 10, rotate: 20, parallax: 100 },
  };

  const values = intensityMap[intensity];

  useEffect(() => {
    if (!imageRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(imageRef.current);
    return () => observer.disconnect();
  }, []);

  // GSAP animations
  useEffect(() => {
    if (!imageRef.current || !isInView) return;

    const img = imageRef.current.querySelector('img') || imageRef.current;

    switch (animationType) {
      case 'pop':
        gsap.fromTo(
          img,
          { scale: 0.8, opacity: 0 },
          {
            scale: values.pop,
            opacity: 1,
            duration: 0.8,
            ease: 'back.out(1.7)',
            yoyo: true,
            repeat: 1,
          }
        );
        break;
      case 'shake':
        gsap.to(img, {
          x: `+=${values.shake}`,
          y: `+=${values.shake}`,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: 'power2.inOut',
        });
        break;
      case 'rotate':
        gsap.to(img, {
          rotation: values.rotate,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
        break;
    }
  }, [isInView, animationType, values]);

  // Parallax transform
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    [-values.parallax, values.parallax]
  );
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);
  const parallaxScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  // 3D transform
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const getAnimationProps = () => {
    switch (animationType) {
      case 'parallax':
        return {
          style: { y: parallaxY, opacity: parallaxOpacity, scale: parallaxScale },
        };
      case '3d':
        return {
          style: {
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d' as const,
          },
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      ref={imageRef}
      className={`relative overflow-hidden ${className}`}
      whileHover={animationType === 'pop' ? { scale: values.pop } : {}}
      {...getAnimationProps()}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover"
        hollywoodGrading={true}
      />
      {animationType === '3d' && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-cyan-500/20 pointer-events-none" />
      )}
    </motion.div>
  );
}






