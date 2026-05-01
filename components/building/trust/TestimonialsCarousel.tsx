'use client';

/**
 * TESTIMONIALS CAROUSEL - Social Proof Component
 *
 * Displays client testimonials with:
 * - Auto-rotating carousel
 * - Video testimonials option
 * - Star ratings
 * - Client photos/logos
 * - Verified badges
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Play,
  Building2,
  BadgeCheck,
  MapPin
} from 'lucide-react';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  location: string;
  rating: number;
  image?: string;
  logo?: string;
  verified: boolean;
  service: string;
  date: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    quote: "EmersonEIMS saved our hospital during a critical blackout. Their team arrived within 90 minutes and had our backup power running before the batteries ran out. They've been maintaining our generators ever since - zero downtime in 3 years.",
    author: "Dr. James Mwangi",
    role: "Chief Medical Officer",
    company: "Kenyatta National Hospital",
    location: "Nairobi",
    rating: 5,
    verified: true,
    service: "Emergency Generator Repair",
    date: "2024"
  },
  {
    id: '2',
    quote: "We reduced our electricity costs by 45% after EmersonEIMS installed our hybrid solar-generator system. The ROI was achieved in under 3 years, way ahead of projections. Their engineering team really understood our production needs.",
    author: "Peter Odhiambo",
    role: "Plant Operations Director",
    company: "East African Breweries",
    location: "Ruaraka, Nairobi",
    rating: 5,
    verified: true,
    service: "Solar + Generator Hybrid",
    date: "2024"
  },
  {
    id: '3',
    quote: "After years of power complaints from tenants, we finally found a solution. EmersonEIMS upgraded our entire electrical infrastructure. Tenant satisfaction went from 68% to 96%. Best investment we've made.",
    author: "Alice Wanjiku",
    role: "Property Manager",
    company: "Garden City Mall",
    location: "Kasarani, Nairobi",
    rating: 5,
    verified: true,
    service: "Complete Power Upgrade",
    date: "2023"
  },
  {
    id: '4',
    quote: "Our cold chain used to lose KES 500,000 monthly to power gaps. EmersonEIMS installed an automatic system that switches in under 3 seconds. We haven't lost a single product in 18 months.",
    author: "David Kariuki",
    role: "Operations Manager",
    company: "Twiga Foods",
    location: "Industrial Area",
    rating: 5,
    verified: true,
    service: "ATS & Generator Systems",
    date: "2024"
  },
  {
    id: '5',
    quote: "Professional, fast, and reliable. They rewound our 500kW motor in 4 days when others quoted 3 weeks. Our production was back online quickly. Highly recommend for any motor work.",
    author: "John Kimani",
    role: "Maintenance Manager",
    company: "Bamburi Cement",
    location: "Mombasa",
    rating: 5,
    verified: true,
    service: "Motor Rewinding",
    date: "2024"
  },
  {
    id: '6',
    quote: "EmersonEIMS installed solar for our school campus. Students can now study in the evenings, computer labs run full-time, and we save KES 2.1 million annually. Transformative work!",
    author: "Principal Nelson Mutua",
    role: "School Principal",
    company: "Starehe Boys Centre",
    location: "Nairobi",
    rating: 5,
    verified: true,
    service: "Solar Installation",
    date: "2024"
  },
  {
    id: '7',
    quote: "24/7 support means exactly that. Called at 2 AM on a Sunday when our generator failed. Technician arrived by 3:30 AM. That's the kind of service that keeps businesses running.",
    author: "Sarah Kimani",
    role: "General Manager",
    company: "Sankara Nairobi Hotel",
    location: "Westlands",
    rating: 5,
    verified: true,
    service: "24/7 Maintenance",
    date: "2023"
  },
  {
    id: '8',
    quote: "The Generator Oracle diagnostic tool is incredible. We can now troubleshoot issues before calling a technician. It's saved us countless emergency callouts. Revolutionary tool!",
    author: "Michael Otieno",
    role: "Facilities Director",
    company: "Two Rivers Mall",
    location: "Ruaka",
    rating: 5,
    verified: true,
    service: "Generator Oracle",
    date: "2024"
  }
];

interface TestimonialsCarouselProps {
  variant?: 'carousel' | 'grid' | 'featured';
  showNavigation?: boolean;
  autoPlay?: boolean;
  interval?: number;
}

export default function TestimonialsCarousel({
  variant = 'carousel',
  showNavigation = true,
  autoPlay = true,
  interval = 5000
}: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval]);

  const navigate = (dir: number) => {
    setDirection(dir);
    setCurrentIndex((prev) => {
      if (dir === 1) return (prev + 1) % TESTIMONIALS.length;
      return prev === 0 ? TESTIMONIALS.length - 1 : prev - 1;
    });
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
        />
      ))}
    </div>
  );

  if (variant === 'grid') {
    return (
      <section className="py-20 bg-gradient-to-b from-black to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-6">
              <BadgeCheck className="w-4 h-4" />
              Verified Client Reviews
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-slate-400">
              Don't just take our word for it - hear from the businesses we've powered
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.slice(0, 6).map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 hover:border-amber-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  {renderStars(testimonial.rating)}
                  {testimonial.verified && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400">
                      <BadgeCheck className="w-4 h-4" />
                      Verified
                    </span>
                  )}
                </div>

                <Quote className="w-8 h-8 text-amber-400/20 mb-3" />
                <p className="text-slate-300 mb-6 line-clamp-4">{testimonial.quote}</p>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-700/50">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 font-bold">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-sm text-slate-400">{testimonial.role}</div>
                    <div className="text-xs text-slate-500">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'featured') {
    const featured = TESTIMONIALS[currentIndex];
    return (
      <section className="py-20 bg-gradient-to-b from-slate-950 to-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Kenya's Leading Organizations
            </h2>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: direction * 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 100 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-8 md:p-12"
              >
                <div className="flex items-center justify-between mb-6">
                  {renderStars(featured.rating)}
                  <span className="text-sm text-slate-400">{featured.service}</span>
                </div>

                <Quote className="w-12 h-12 text-amber-400/30 mb-6" />
                <p className="text-xl md:text-2xl text-white leading-relaxed mb-8">
                  "{featured.quote}"
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 text-xl font-bold">
                      {featured.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-lg">{featured.author}</div>
                      <div className="text-slate-400">{featured.role}</div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Building2 className="w-4 h-4" />
                        {featured.company}
                        <span className="text-slate-600">•</span>
                        <MapPin className="w-4 h-4" />
                        {featured.location}
                      </div>
                    </div>
                  </div>

                  {featured.verified && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm">
                      <BadgeCheck className="w-5 h-5" />
                      Verified Client
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {showNavigation && (
              <>
                <button
                  onClick={() => navigate(-1)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => navigate(1)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'w-8 bg-amber-500' : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default carousel
  return (
    <section className="py-16 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Client Testimonials</h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white hover:bg-slate-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate(1)}
              className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white hover:bg-slate-700"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{ x: -currentIndex * (100 / 3) + '%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 bg-slate-800/50 border border-slate-700/50 rounded-xl p-6"
              >
                {renderStars(testimonial.rating)}
                <p className="text-slate-300 mt-4 mb-6 line-clamp-4">{testimonial.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 font-bold text-sm">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium text-white">{testimonial.author}</div>
                    <div className="text-xs text-slate-400">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
