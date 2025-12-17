'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import OptimizedImage from '@/components/media/OptimizedImage';

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
  features: string[];
  icon?: string;
  color?: string;
  index?: number;
}

export default function ServiceCard({
  title,
  description,
  image,
  href,
  features,
  icon = '⚡',
  color = 'from-amber-400 to-amber-600',
  index = 0,
}: ServiceCardProps) {
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
  };

  return (
    <Link href={href} prefetch>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="group relative h-full"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
      >
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 hover:border-amber-500/50 transition-all overflow-hidden h-full flex flex-col">
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <OptimizedImage
              src={image}
              alt={title}
              width={800}
              height={600}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            <div className={`absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-r ${color} flex items-center justify-center text-2xl shadow-lg`}>
              {icon}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
              {title}
            </h3>
            <p className="text-gray-400 mb-4 flex-1">{description}</p>
            
            {/* Features */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {features.slice(0, 3).map((feature) => (
                  <span
                    key={feature}
                    className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-700"
                  >
                    {feature}
                  </span>
                ))}
                {features.length > 3 && (
                  <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-700">
                    +{features.length - 3} more
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
      </motion.div>
    </Link>
  );
}

