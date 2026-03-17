'use client';

/**
 * CINEMATIC IMAGE GALLERY
 * Hollywood-style 4K image display with cinematic color grading
 * Nike.com inspired design with 3D effects and stylish layouts
 */

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play, Maximize2 } from 'lucide-react';

export interface GalleryImage {
  src: string;
  alt: string;
  category?: string;
  title?: string;
  description?: string;
  isVideo?: boolean;
}

interface CinematicImageGalleryProps {
  images: GalleryImage[];
  layout?: 'grid' | 'masonry' | 'carousel' | 'hero' | 'nike-style';
  columns?: 2 | 3 | 4;
  showCaptions?: boolean;
  enableLightbox?: boolean;
  className?: string;
}

export default function CinematicImageGallery({
  images,
  layout = 'grid',
  columns = 3,
  showCaptions = true,
  enableLightbox = true,
  className = '',
}: CinematicImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    if (enableLightbox) {
      setSelectedIndex(index);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    document.body.style.overflow = 'auto';
  };

  const goNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const goPrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  // Nike-style layout with featured image and grid
  if (layout === 'nike-style') {
    return (
      <>
        <div className={`space-y-4 ${className}`}>
          {/* Featured Hero Image */}
          {images[0] && (
            <motion.div
              className="relative aspect-[21/9] rounded-3xl overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(0)}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={images[0].src}
                alt={images[0].alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 cinematic-filter"
                sizes="100vw"
                priority
              />
              {/* Cinematic Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-blue-500/10 mix-blend-overlay" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-2xl"
                >
                  {images[0].category && (
                    <span className="inline-block px-3 py-1 bg-amber-500/90 text-white text-sm font-medium rounded-full mb-3">
                      {images[0].category}
                    </span>
                  )}
                  {images[0].title && (
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                      {images[0].title}
                    </h3>
                  )}
                  {images[0].description && (
                    <p className="text-white/80 text-lg">{images[0].description}</p>
                  )}
                </motion.div>
              </div>

              {/* Expand Icon */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-2 bg-black/50 rounded-full backdrop-blur-sm">
                  <Maximize2 className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Grid of remaining images */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.slice(1, 5).map((image, idx) => (
              <motion.div
                key={idx + 1}
                className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(idx + 1)}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ duration: 0.3 }}
                onHoverStart={() => setHoveredIndex(idx + 1)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-110 cinematic-filter"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {/* 3D Shadow Effect */}
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_-50px_50px_-30px_rgba(0,0,0,0.5)]" />

                {/* Hover Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: hoveredIndex === idx + 1 ? 0.8 : 0.3 }}
                />

                {/* Video Indicator */}
                {image.isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                  </div>
                )}

                {showCaptions && image.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold text-sm drop-shadow-lg">{image.title}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Additional rows for more images */}
          {images.length > 5 && (
            <div className="grid grid-cols-3 gap-4">
              {images.slice(5).map((image, idx) => (
                <motion.div
                  key={idx + 5}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => openLightbox(idx + 5)}
                  whileHover={{ scale: 1.02 }}
                  style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1000px',
                  }}
                >
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ rotateY: 5, rotateX: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover cinematic-filter"
                      sizes="33vw"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Lightbox */}
        <Lightbox
          images={images}
          selectedIndex={selectedIndex}
          onClose={closeLightbox}
          onNext={goNext}
          onPrev={goPrev}
        />
      </>
    );
  }

  // Hero layout - single large image with cinematic effects
  if (layout === 'hero') {
    return (
      <>
        <div className={`relative ${className}`}>
          <motion.div
            className="relative aspect-[21/9] md:aspect-[3/1] rounded-3xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            {images[0] && (
              <>
                <Image
                  src={images[0].src}
                  alt={images[0].alt}
                  fill
                  className="object-cover cinematic-filter"
                  sizes="100vw"
                  priority
                />
                {/* Hollywood Color Grading Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-900/30 via-transparent to-blue-900/30 mix-blend-color" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                {/* Cinematic Vignette */}
                <div className="absolute inset-0 shadow-[inset_0_0_150px_50px_rgba(0,0,0,0.4)]" />
              </>
            )}
          </motion.div>
        </div>
      </>
    );
  }

  // Carousel layout
  if (layout === 'carousel') {
    return (
      <>
        <div className={`relative ${className}`}>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {images.map((image, idx) => (
              <motion.div
                key={idx}
                className="relative flex-shrink-0 w-80 aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer snap-center"
                onClick={() => openLightbox(idx)}
                whileHover={{ scale: 1.02, y: -10 }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover cinematic-filter"
                  sizes="320px"
                />
                {/* Rounded corners with shadow */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {showCaptions && (
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {image.category && (
                      <span className="text-amber-400 text-xs font-medium uppercase tracking-wider">
                        {image.category}
                      </span>
                    )}
                    {image.title && (
                      <h4 className="text-white font-bold mt-1">{image.title}</h4>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <Lightbox
          images={images}
          selectedIndex={selectedIndex}
          onClose={closeLightbox}
          onNext={goNext}
          onPrev={goPrev}
        />
      </>
    );
  }

  // Masonry layout
  if (layout === 'masonry') {
    return (
      <>
        <div className={`columns-2 md:columns-3 lg:columns-${columns} gap-4 ${className}`}>
          {images.map((image, idx) => (
            <motion.div
              key={idx}
              className="relative mb-4 break-inside-avoid rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(idx)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={600}
                height={idx % 3 === 0 ? 800 : idx % 3 === 1 ? 600 : 500}
                className="w-full h-auto object-cover cinematic-filter"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {showCaptions && image.title && (
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-semibold">{image.title}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <Lightbox
          images={images}
          selectedIndex={selectedIndex}
          onClose={closeLightbox}
          onNext={goNext}
          onPrev={goPrev}
        />
      </>
    );
  }

  // Default grid layout
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  };

  return (
    <>
      <div className={`grid ${gridCols[columns]} gap-4 md:gap-6 ${className}`}>
        {images.map((image, idx) => (
          <motion.div
            key={idx}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group"
            onClick={() => openLightbox(idx)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            whileHover={{
              scale: 1.03,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110 cinematic-filter"
              sizes={`(max-width: 640px) 100vw, (max-width: 1024px) 50vw, ${100 / columns}vw`}
            />

            {/* Cinematic Color Grading */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-blue-500/10 mix-blend-overlay opacity-50" />

            {/* 3D Depth Effect */}
            <div className="absolute inset-0 shadow-[inset_0_-80px_60px_-60px_rgba(0,0,0,0.6)]" />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Video Play Button */}
            {image.isVideo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30"
                  whileHover={{ scale: 1.1 }}
                >
                  <Play className="w-10 h-10 text-white fill-white ml-1" />
                </motion.div>
              </div>
            )}

            {/* Caption */}
            {showCaptions && (
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                {image.category && (
                  <span className="inline-block px-2 py-0.5 bg-amber-500/80 text-white text-xs font-medium rounded mb-1">
                    {image.category}
                  </span>
                )}
                {image.title && (
                  <h4 className="text-white font-bold text-lg drop-shadow-lg">{image.title}</h4>
                )}
                {image.description && (
                  <p className="text-white/80 text-sm mt-1">{image.description}</p>
                )}
              </div>
            )}

            {/* Corner Accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>

      <Lightbox
        images={images}
        selectedIndex={selectedIndex}
        onClose={closeLightbox}
        onNext={goNext}
        onPrev={goPrev}
      />
    </>
  );
}

// Lightbox Component
function Lightbox({
  images,
  selectedIndex,
  onClose,
  onNext,
  onPrev,
}: {
  images: GalleryImage[];
  selectedIndex: number | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  if (selectedIndex === null) return null;

  const currentImage = images[selectedIndex];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Navigation */}
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 z-10 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 z-10 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>

        {/* Image */}
        <motion.div
          className="relative max-w-[90vw] max-h-[85vh]"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {currentImage.isVideo ? (
            <video
              src={currentImage.src}
              controls
              autoPlay
              className="max-w-full max-h-[85vh] rounded-lg"
            />
          ) : (
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              width={1920}
              height={1080}
              className="max-w-full max-h-[85vh] object-contain rounded-lg cinematic-filter"
              priority
            />
          )}

          {/* Caption */}
          {(currentImage.title || currentImage.description) && (
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
              {currentImage.title && (
                <h3 className="text-white text-2xl font-bold">{currentImage.title}</h3>
              )}
              {currentImage.description && (
                <p className="text-white/80 mt-2">{currentImage.description}</p>
              )}
            </div>
          )}
        </motion.div>

        {/* Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
          {selectedIndex + 1} / {images.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
