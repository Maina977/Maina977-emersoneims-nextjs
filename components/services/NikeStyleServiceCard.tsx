'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import OptimizedImage from '@/components/media/OptimizedImage';

interface NikeStyleServiceCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
  stats?: { label: string; value: string }[];
  tags?: string[];
  index?: number;
}

export default function NikeStyleServiceCard({
  title,
  description,
  image,
  href,
  stats = [],
  tags = [],
  index = 0,
}: NikeStyleServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      className="group relative h-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <Link href={href} className="block h-full">
        <motion.div
          className="relative h-full bg-black rounded-2xl overflow-hidden border border-white/10"
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Image Layer */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <motion.div
              animate={{
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <OptimizedImage
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                hollywoodGrading={true}
              />
            </motion.div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            {/* Tags */}
            {tags.length > 0 && (
              <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content Layer */}
          <div className="p-6 md:p-8 space-y-4">
            {/* Title */}
            <motion.h3
              className="text-heading-2 font-display text-white"
              animate={{
                y: isHovered ? -2 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              {title}
            </motion.h3>

            {/* Description */}
            <p className="text-body text-text-secondary leading-relaxed">
              {description}
            </p>

            {/* Stats */}
            {stats.length > 0 && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                {stats.map((stat, i) => (
                  <div key={i}>
                    <div className="text-heading-3 font-display text-white">
                      {stat.value}
                    </div>
                    <div className="text-caption text-text-tertiary mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Arrow */}
            <motion.div
              className="flex items-center gap-2 text-text-secondary group-hover:text-white transition-colors"
              animate={{
                x: isHovered ? 4 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-body-small font-medium">Explore</span>
              <motion.svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                animate={{
                  x: isHovered ? 4 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <path
                  d="M6 12L10 8L6 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </motion.div>
          </div>

          {/* Hover Glow Effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(251, 191, 36, 0.1), transparent 70%)',
            }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}









