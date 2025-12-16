'use client';

import { motion } from 'framer-motion';
import OptimizedImage from './OptimizedImage';

interface ProductPhotographyProps {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  priority?: boolean;
  className?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '21:9';
  overlay?: boolean;
}

export default function ProductPhotography({
  src,
  alt,
  title,
  description,
  priority = false,
  className = '',
  aspectRatio = '16:9',
  overlay = false,
}: ProductPhotographyProps) {
  const aspectRatios = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '21:9': 'aspect-[21/9]',
  };

  return (
    <motion.div
      className={`relative overflow-hidden ${aspectRatios[aspectRatio]} ${className}`}
      initial={{ opacity: 0, scale: 1.05 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Professional Product Image */}
      <OptimizedImage
        src={src}
        alt={alt}
        priority={priority}
        className="w-full h-full object-cover"
        hollywoodGrading={true}
        quality={95}
      />
      
      {/* Optional Overlay Gradient */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      )}
      
      {/* Optional Content Overlay */}
      {(title || description) && (
        <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
          {title && (
            <motion.h3
              className="text-heading-2 font-display text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {title}
            </motion.h3>
          )}
          {description && (
            <motion.p
              className="text-body-large text-white/90 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {description}
            </motion.p>
          )}
        </div>
      )}
      
      {/* Premium Border Glow Effect */}
      <div className="absolute inset-0 border border-white/10 pointer-events-none" />
    </motion.div>
  );
}









