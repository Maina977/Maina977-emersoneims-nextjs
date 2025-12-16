'use client';

/**
 * VIDEO TESTIMONIALS COMPONENT
 * Customer video testimonials with playback
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OptimizedVideo from '@/components/media/OptimizedVideo';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  videoUrl: string;
  thumbnail: string;
  quote: string;
  rating: number;
}

interface VideoTestimonialsProps {
  testimonials: Testimonial[];
}

export default function VideoTestimonials({ testimonials }: VideoTestimonialsProps) {
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  return (
    <div className="w-full">
      <h2 className="text-4xl font-bold text-white mb-8 text-center">
        What Our Customers Say
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <motion.div
            key={testimonial.id}
            className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-brand-gold/50 transition-all cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={() => setSelectedTestimonial(testimonial)}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-black">
              <img
                src={testimonial.thumbnail}
                alt={testimonial.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-all">
                <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center">
                  <span className="text-2xl">▶</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < testimonial.rating ? 'text-brand-gold' : 'text-gray-600'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-white mb-4 line-clamp-3">{testimonial.quote}</p>
              <div>
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-gray-400">
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedTestimonial && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTestimonial(null)}
          >
            <motion.div
              className="bg-gray-900 rounded-2xl p-8 max-w-4xl w-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedTestimonial(null)}
                className="float-right text-white text-2xl hover:text-gray-400 mb-4"
              >
                ✕
              </button>
              
              <OptimizedVideo
                src={selectedTestimonial.videoUrl}
                autoPlay
                controls
                className="w-full rounded-lg"
              />
              
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {selectedTestimonial.name}
                </h3>
                <p className="text-gray-400">
                  {selectedTestimonial.role}, {selectedTestimonial.company}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


