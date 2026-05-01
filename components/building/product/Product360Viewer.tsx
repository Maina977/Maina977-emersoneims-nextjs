'use client';

/**
 * 360° PRODUCT VIEWER
 * Interactive 360-degree product viewer with touch controls
 */

import { useState, useRef, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';

interface Product360ViewerProps {
  images: string[]; // Array of 360° images (36 images for smooth rotation)
  productName: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
}

export default function Product360Viewer({
  images,
  productName,
  autoRotate = false,
  rotationSpeed = 0.5,
}: Product360ViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const autoRotateRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
    }
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (autoRotate && !isDragging && !prefersReducedMotion) {
      autoRotateRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 100 / rotationSpeed);
      return () => {
        if (autoRotateRef.current) {
          clearInterval(autoRotateRef.current);
          autoRotateRef.current = null;
        }
      };
    }
  }, [autoRotate, isDragging, images.length, rotationSpeed, prefersReducedMotion]);

  const handleDragStart = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(true);
    setStartX(info.point.x);
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isDragging) return;
    
    const deltaX = info.point.x - startX;
    const sensitivity = 2;
    const newIndex = Math.round(
      (currentIndex + (deltaX / sensitivity)) % images.length
    );
    
    if (newIndex >= 0 && newIndex < images.length) {
      setCurrentIndex(newIndex);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  // Generate images if not provided (placeholder)
  const displayImages = images.length > 0 
    ? images 
    : Array.from({ length: 36 }, (_, i) => `/images/360/product-${i + 1}.jpg`);

  return (
    <div className="relative w-full h-[600px] bg-black rounded-2xl overflow-hidden border border-gray-800">
      <motion.div
        ref={containerRef}
        className="relative w-full h-full cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileDrag={{ cursor: 'grabbing' }}
      >
        {/* 360° Image */}
        <motion.img
          src={displayImages[currentIndex]}
          alt={`${productName} - View ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
          draggable={false}
        />

        {/* Loading placeholder if image fails */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-white text-center">
            <div className="text-4xl mb-4">⚡</div>
            <p>360° View</p>
            <p className="text-sm text-gray-400 mt-2">Drag or swipe to rotate</p>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/80 backdrop-blur-sm px-6 py-3 rounded-full">
        <button
          onClick={handlePrevious}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
          aria-label="Previous view"
        >
          ←
        </button>
        
        <div className="flex gap-1">
          {Array.from({ length: Math.min(displayImages.length, 12) }).map((_, i) => {
            const index = Math.floor((i / 12) * displayImages.length);
            return (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  Math.abs(currentIndex - index) < 3
                    ? 'bg-brand-gold w-4'
                    : 'bg-white/30'
                }`}
              />
            );
          })}
        </div>
        
        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
          aria-label="Next view"
        >
          →
        </button>
      </div>

      {/* Touch Instructions */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm">
        <p>👆 Drag to rotate</p>
        <p className="text-xs text-gray-400 mt-1">or use buttons</p>
      </div>

      {/* Fullscreen Button */}
      <button
        onClick={() => {
          if (containerRef.current?.requestFullscreen) {
            containerRef.current.requestFullscreen();
          }
        }}
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg text-white hover:bg-black/90 transition-all"
        aria-label="Fullscreen"
      >
        ⛶ Fullscreen
      </button>
    </div>
  );
}

