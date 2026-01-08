'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

/**
 * 🎮 INTERACTIVE 3D PRODUCT CARD - GAMIFIED SELLING
 *
 * Interactive product cards that beg to be touched
 * Features:
 * - 3D tilt effect following mouse
 * - Parallax layers (image, badge, price float independently)
 * - Hover reveals hidden details
 * - "Add to Quote" with satisfying animation
 * - Stock indicators and trust badges
 * - Works on mobile with touch
 */

interface Product {
  id: string;
  name: string;
  power: string;
  price: string;
  image: string;
  badge?: string;
  stock: number;
  features: string[];
  inStock: boolean;
}

interface InteractiveProductCardProps {
  product: Product;
  onAddToQuote?: (product: Product) => void;
}

export default function InteractiveProductCard({
  product,
  onAddToQuote,
}: InteractiveProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [addedToQuote, setAddedToQuote] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse position for 3D tilt
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Transform mouse position to rotation
  const rotateX = useTransform(mouseY, [0, 1], [15, -15]);
  const rotateY = useTransform(mouseX, [0, 1], [-15, 15]);

  // Spring physics for smooth movement
  const springConfig = { stiffness: 300, damping: 30 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  // Parallax layers
  const imageY = useTransform(mouseY, [0, 1], [-20, 20]);
  const imageX = useTransform(mouseX, [0, 1], [-20, 20]);
  const badgeY = useTransform(mouseY, [0, 1], [-40, 40]);
  const priceY = useTransform(mouseY, [0, 1], [-30, 30]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    setIsHovered(false);
  };

  const handleAddToQuote = () => {
    setAddedToQuote(true);
    if (onAddToQuote) {
      onAddToQuote(product);
    }

    // Reset after animation
    setTimeout(() => setAddedToQuote(false), 2000);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative w-full max-w-sm mx-auto perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
      }}
    >
      <motion.div
        className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800"
        style={{
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Holographic shine effect */}
        <motion.div
          className="absolute inset-0 opacity-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
            backgroundSize: '200% 200%',
          }}
          animate={isHovered ? {
            opacity: 1,
            backgroundPosition: ['0% 0%', '100% 100%'],
          } : {}}
          transition={{ duration: 1.5, ease: 'linear' }}
        />

        {/* Product Image with Parallax */}
        <div className="relative h-64 overflow-hidden">
          <motion.div
            style={{
              x: imageX,
              y: imageY,
              z: 50,
            }}
            className="relative w-full h-full"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </motion.div>

          {/* Floating Badge */}
          {product.badge && (
            <motion.div
              className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black px-4 py-2 rounded-full font-bold text-sm shadow-lg"
              style={{
                y: badgeY,
                z: 100,
              }}
            >
              {product.badge}
            </motion.div>
          )}

          {/* Stock Indicator */}
          <motion.div
            className={`absolute top-4 left-4 px-3 py-1.5 rounded-full font-semibold text-xs shadow-lg backdrop-blur-sm ${
              product.inStock
                ? 'bg-green-500/80 text-white'
                : 'bg-red-500/80 text-white'
            }`}
            style={{ z: 100 }}
            animate={product.inStock ? {
              scale: [1, 1.05, 1],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {product.inStock ? `✓ ${product.stock} In Stock` : '⚠️ Low Stock'}
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6 relative" style={{ transform: 'translateZ(20px)' }}>
          {/* Product Name */}
          <h3 className="text-2xl font-bold text-white mb-2">
            {product.name}
          </h3>

          {/* Power Rating */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-amber-400 text-sm font-semibold">⚡ {product.power}</span>
            <span className="text-gray-500 text-xs">• Diesel</span>
            <span className="text-gray-500 text-xs">• Industrial</span>
          </div>

          {/* Features - Show on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-4 overflow-hidden"
              >
                <ul className="space-y-1">
                  {product.features.slice(0, 3).map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-gray-400 text-sm flex items-center gap-2"
                    >
                      <span className="text-green-400">✓</span>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Price and CTA */}
          <div className="flex items-center justify-between gap-4">
            {/* Price */}
            <motion.div
              style={{ y: priceY, z: 30 }}
            >
              <div className="text-sm text-gray-400">Starting from</div>
              <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text">
                {product.price}
              </div>
            </motion.div>

            {/* Add to Quote Button */}
            <motion.button
              onClick={handleAddToQuote}
              className={`px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${
                addedToQuote
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:shadow-xl'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={addedToQuote}
            >
              {addedToQuote ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Added!
                </span>
              ) : (
                'Get Quote'
              )}
            </motion.button>
          </div>

          {/* Trust Badge */}
          <motion.div
            className="mt-4 flex items-center gap-2 text-xs text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0.5 }}
          >
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Warranty Included • Free Installation Quote</span>
          </motion.div>
        </div>

        {/* Corner accent lines */}
        <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-amber-500/30 rounded-tl-2xl" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-amber-500/30 rounded-br-2xl" />
      </motion.div>
    </motion.div>
  );
}

/**
 * Sample usage data for generators
 */
export const sampleProducts: Product[] = [
  {
    id: 'gen-500',
    name: 'Cummins 500kVA',
    power: '500kVA / 400kW',
    price: 'KES 4.5M',
    image: '/images/tnpl-diesal-generator-1000x1000-1920x1080.webp',
    badge: 'BESTSELLER',
    stock: 5,
    features: [
      'Automatic Transfer Switch',
      '24/7 Remote Monitoring',
      'Fuel-Efficient Engine',
      'Soundproof Canopy',
    ],
    inStock: true,
  },
  {
    id: 'gen-250',
    name: 'Perkins 250kVA',
    power: '250kVA / 200kW',
    price: 'KES 2.8M',
    image: '/images/GEN 2-1920x1080.png',
    badge: 'HOT DEAL',
    stock: 3,
    features: [
      'UK Engineering',
      'Low Fuel Consumption',
      'Weather-Resistant',
      '2-Year Warranty',
    ],
    inStock: true,
  },
];
