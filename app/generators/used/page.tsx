'use client'

import { useState, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLead } from "@/components/generators";
import OptimizedImage from "@/components/media/OptimizedImage";
import { usePerformanceTier } from '@/components/performance/usePerformanceTier';

// Lazy load WebGL scene
const SimpleThreeScene = lazy(() => import('@/components/webgl/SimpleThreeScene'));

const usedGenerators = [
  {
    brand: "Cummins",
    kvaRange: "50–2000 kVA",
    warranty: "1 year comprehensive",
    priceRange: "KSh 800,000 – 15M",
    features: ["Fully serviced", "Load tested", "OEM parts", "6-month service history"],
    status: "In Stock",
    statusColor: "bg-green-500",
    images: [
      "/images/IMG-20250804-WA0006.jpg",
      "/images/GEN%202-1920x1080.png",
      "https://www.emersoneims.com/wp-content/uploads/2025/11/GEN-5-scaled.png",
    ],
  },
  {
    brand: "Perkins",
    kvaRange: "20–1000 kVA",
    warranty: "1 year engine & alternator",
    priceRange: "KSh 500,000 – 8M",
    features: ["Fuel efficient", "Low hours", "New filters", "Painted"],
    status: "Limited Stock",
    statusColor: "bg-yellow-500",
    images: [
      "https://www.emersoneims.com/wp-content/uploads/2025/11/GEN-5-scaled.png",
      "/images/IMG-20250804-WA0006.jpg",
    ],
  },
  {
    brand: "Caterpillar",
    kvaRange: "100–2000 kVA",
    warranty: "1 year comprehensive",
    priceRange: "KSh 1.2M – 20M",
    features: ["Heavy-duty", "Low hours", "Full service", "Canopy available"],
    status: "In Stock",
    statusColor: "bg-green-500",
    images: [
      "https://www.emersoneims.com/wp-content/uploads/2025/11/80-scaled.png",
      "/images/GEN%202-1920x1080.png",
    ],
  },
  {
    brand: "Volvo Penta",
    kvaRange: "50–1500 kVA",
    warranty: "1 year engine",
    priceRange: "KSh 700,000 – 12M",
    features: ["Low emissions", "Advanced controls", "Soundproofed", "Containerized"],
    status: "Available Soon",
    statusColor: "bg-blue-500",
    images: [
      "https://www.emersoneims.com/wp-content/uploads/2025/11/77.png",
      "https://www.emersoneims.com/wp-content/uploads/2025/11/GEN-5-scaled.png",
    ],
  },
  {
    brand: "SDMO",
    kvaRange: "30–1200 kVA",
    warranty: "1 year",
    priceRange: "KSh 400,000 – 10M",
    features: ["French engineered", "Robust design", "Easy maintenance", "Export ready"],
    status: "In Stock",
    statusColor: "bg-green-500",
    images: [
      "/images/GEN%202-1920x1080.png",
    ],
  },
  {
    brand: "Wei Chai",
    kvaRange: "50–1000 kVA",
    warranty: "6 months",
    priceRange: "KSh 300,000 – 6M",
    features: ["Cost effective", "Fully tested", "New batteries", "Serviced"],
    status: "In Stock",
    statusColor: "bg-green-500",
    images: [
      "https://www.emersoneims.com/wp-content/uploads/2025/11/GEN-5-scaled.png",
    ],
  },
];

// Image Gallery Component
const ImageGallery = ({ images, brand }: { images: string[]; brand: string }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <>
      <div className="mt-6 space-y-4">
        <div className="relative h-64 rounded-lg overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute inset-0"
            >
              <div onClick={() => setIsLightboxOpen(true)} className="cursor-pointer">
                <OptimizedImage
                  src={images[selectedImage]}
                  alt={`${brand} generator - Image ${selectedImage + 1}`}
                  width={800}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </AnimatePresence>
          {images.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/80 text-white p-2 rounded-full hover:bg-black transition-all"
                aria-label="Previous image"
              >
                {'\u2190'}
              </button>
              <button
                onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/80 text-white p-2 rounded-full hover:bg-black transition-all"
                aria-label="Next image"
              >
                {'\u2192'}
              </button>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative h-16 rounded overflow-hidden border-2 transition-all ${
                  selectedImage === index ? 'border-amber-500' : 'border-transparent'
                }`}
              >
                <OptimizedImage
                  src={img}
                  alt={`${brand} thumbnail ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.div
              className="relative max-w-7xl max-h-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <OptimizedImage
                src={images[selectedImage]}
                alt={`${brand} generator - Full view`}
                width={1200}
                height={800}
                className="max-w-full max-h-[90vh] object-contain"
              />
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 bg-black/80 text-white p-3 rounded-full hover:bg-black transition-all"
                aria-label="Close lightbox"
              >
                {'\u2715'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Virtual Tour Component
const VirtualTour = ({ brand }: { brand: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="mt-6 bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-white">Virtual Inspection Tour</h4>
        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full border border-blue-500/30">
          🎥 Available
        </span>
      </div>
      <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {isPlaying ? (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white">Loading virtual tour...</p>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={() => setIsPlaying(true)}
                className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center text-3xl hover:bg-amber-600 transition-all transform hover:scale-110"
                aria-label="Start virtual tour"
              >
                {'\u25B6'}
              </button>
              <p className="text-white mt-4">Click to start 360° inspection</p>
            </div>
          )}
        </div>
      </div>
      <p className="text-gray-400 text-sm mt-4">
        Interactive 360° virtual tour showing all angles and components of the {brand} generator
      </p>
    </div>
  );
};

type UsedGeneratorFilters = {
  brand: string;
  priceRange: string;
  kvaRange: string;
  status: string;
};

// Advanced Filter Component
const AdvancedFilters = ({
  onFilterChange,
}: {
  onFilterChange: (filters: UsedGeneratorFilters) => void;
}) => {
  const [filters, setFilters] = useState<UsedGeneratorFilters>({
    brand: '',
    priceRange: '',
    kvaRange: '',
    status: '',
  });

  const handleFilterChange = (key: keyof UsedGeneratorFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-xl font-bold text-white mb-4">Advanced Filters</h3>
      <div className="grid md:grid-cols-4 gap-4">
        <div>
          <label className="block text-gray-400 text-sm mb-2">Brand</label>
          <select
            value={filters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          >
            <option value="">All Brands</option>
            <option value="Cummins">Cummins</option>
            <option value="Perkins">Perkins</option>
            <option value="Caterpillar">Caterpillar</option>
            <option value="Volvo Penta">Volvo Penta</option>
            <option value="SDMO">SDMO</option>
            <option value="Wei Chai">Wei Chai</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">Price Range</label>
          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          >
            <option value="">All Prices</option>
            <option value="0-500000">Under KSh 500K</option>
            <option value="500000-2000000">KSh 500K - 2M</option>
            <option value="2000000-5000000">KSh 2M - 5M</option>
            <option value="5000000+">Above KSh 5M</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">Power Range</label>
          <select
            value={filters.kvaRange}
            onChange={(e) => handleFilterChange('kvaRange', e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          >
            <option value="">All Sizes</option>
            <option value="0-100">Under 100 kVA</option>
            <option value="100-500">100-500 kVA</option>
            <option value="500-1000">500-1000 kVA</option>
            <option value="1000+">Above 1000 kVA</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          >
            <option value="">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Limited Stock">Limited Stock</option>
            <option value="Available Soon">Available Soon</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default function UsedGeneratorsPage() {
  const [filteredGenerators, setFilteredGenerators] = useState(usedGenerators);
  const { isLite } = usePerformanceTier();

  const handleFilterChange = (newFilters: UsedGeneratorFilters) => {
    let filtered = [...usedGenerators];

    if (newFilters.brand) {
      filtered = filtered.filter(g => g.brand === newFilters.brand);
    }
    if (newFilters.status) {
      filtered = filtered.filter(g => g.status === newFilters.status);
    }

    setFilteredGenerators(filtered);
  };

  return (
    <main className="eims-section min-h-screen relative bg-gradient-to-b from-black to-gray-900">
      {/* WebGL Background Scene */}
      {!isLite && (
        <Suspense fallback={null}>
          <div className="fixed inset-0 -z-10 opacity-15">
            <SimpleThreeScene />
          </div>
        </Suspense>
      )}
      
      <div className="eims-shell relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <SectionLead
            title="Used Generators"
            subtitle="Fully serviced, tested, and warrantied generators from leading global brands."
            centered
          />
        </motion.div>

        {/* Advanced Filters */}
        <AdvancedFilters onFilterChange={handleFilterChange} />

        {/* Warning Banner */}
        <motion.div
          className="mt-8 bg-yellow-900/30 border border-yellow-700 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center">
            <svg className="w-8 h-8 text-yellow-500 mr-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-lg font-bold text-white">Important Notice</h3>
              <p className="text-white/70">All used generators undergo comprehensive 21-point inspection and load testing. Prices vary based on condition and hours.</p>
            </div>
          </div>
        </motion.div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGenerators.map((gen, index) => (
            <motion.article
              key={gen.brand}
              className="p-6 rounded-xl border border-gray-800 bg-gradient-to-br from-black to-gray-900 hover:border-amber-500/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-white">{gen.brand}</h2>
                <span className={`${gen.statusColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                  {gen.status}
                </span>
              </div>
              
              <p className="text-brand-gold font-semibold">{gen.kvaRange}</p>
              <p className="text-white/80 mt-2">Warranty: {gen.warranty}</p>
              <p className="text-white font-bold mt-2">{gen.priceRange}</p>
              
              {/* Image Gallery */}
              {gen.images && gen.images.length > 0 && (
                <ImageGallery images={gen.images} brand={gen.brand} />
              )}
              
              {/* Virtual Tour */}
              <VirtualTour brand={gen.brand} />
              
              <ul className="mt-6 space-y-2">
                {gen.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-white/80">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a 
                  href="/contact" 
                  className="sci-fi-button flex-1 text-center py-3"
                  aria-label={`Request quote for ${gen.brand} used generator`}
                >
                  Request Quote
                </a>
                <a 
                  href={`/specs/used/${gen.brand.toLowerCase()}`}
                  className="sci-fi-outline flex-1 text-center py-3"
                  aria-label={`View detailed specifications for ${gen.brand} used generator`}
                >
                  View Details
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredGenerators.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4" aria-hidden="true">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No generators found</h3>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        )}

        {/* Inspection Process */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-10">Our 21-Point Inspection Process</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { number: 1, title: "Mechanical Inspection", description: "Engine compression test, turbo inspection, coolant system check, and vibration analysis.", color: "bg-blue-500" },
              { number: 2, title: "Electrical Testing", description: "Alternator output test, AVR function, controller diagnostics, and insulation resistance.", color: "bg-green-500" },
              { number: 3, title: "Load Bank Testing", description: "Full load test for 4+ hours, thermal imaging, voltage stability, and harmonic analysis.", color: "bg-purple-500" },
            ].map((item, index) => (
              <motion.div
                key={item.number}
                className="p-8 rounded-xl border border-gray-700 bg-gradient-to-br from-black to-gray-900"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-white text-xl font-bold mb-4`}>
                  {item.number}
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-4 text-white/70">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trade-In Section */}
        <motion.div
          className="mt-20 bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-10 rounded-2xl border border-blue-500/20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Trade-In Your Old Generator</h3>
            <p className="text-white/70 max-w-2xl mx-auto mb-8">
              Get credit towards a new Cummins generator when you trade in your old unit. Free collection and valuation.
            </p>
            <a 
              href="/generator/contact?type=tradein" 
              className="inline-block sci-fi-button px-10 py-4"
            >
              Get Trade-In Value
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

