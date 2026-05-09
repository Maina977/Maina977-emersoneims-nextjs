'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Search, Filter, Grid, List, ShoppingCart, X, Plus, Minus,
  ChevronDown, Star, Truck, Shield, Clock, Heart, Eye,
  ArrowUpDown, SlidersHorizontal, Package, CheckCircle, Tag
} from 'lucide-react';
import sparePartsDatabase from '@/app/data/spare-parts-database-COMPLETE.json';
import MpesaCheckout from './MpesaCheckout';

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCT IMAGE MAPPING - Real images for each part category
// Using actual images from /public/images/ folder
// ═══════════════════════════════════════════════════════════════════════════════
const PART_IMAGES: Record<string, string[]> = {
  // Filters - Perkins filter images
  'oil filter': ['/images/PERKINS FILTER 2 (1).webp', '/images/Perkins-4000-Parts.webp', '/images/PERKINS-ENGINE-PARTS.jpg'],
  'fuel filter': ['/images/PERKINS FILTER 2 (1).webp', '/images/Perkins-4000-Parts.webp'],
  'air filter': ['/images/PERKINS-ENGINE-PARTS.jpg', '/images/Perkins-4000-Parts.webp'],
  'hydraulic filter': ['/images/PERKINS FILTER 2 (1).webp'],
  'filter': ['/images/PERKINS FILTER 2 (1).webp', '/images/Perkins-4000-Parts.webp', '/images/PERKINS-ENGINE-PARTS.jpg'],

  // Engine Parts
  'injector': ['/images/PERKINS-ENGINE-PARTS.jpg', '/images/Perkins-4000-Parts.webp'],
  'piston': ['/images/PERKINS-ENGINE-PARTS.jpg'],
  'gasket': ['/images/PERKINS-ENGINE-PARTS.jpg', '/images/Perkins-4000-Parts.webp'],
  'bearing': ['/images/PERKINS-ENGINE-PARTS.jpg'],
  'valve': ['/images/PERKINS-ENGINE-PARTS.jpg'],
  'engine': ['/images/PERKINS-ENGINE-PARTS.jpg', '/images/Perkins-4000-Parts.webp'],

  // Electrical & Controls
  'starter': ['/images/motor-diagnostics-testing.png', '/images/electric-motor-repair.png'],
  'alternator': ['/images/motor-diagnostics-testing.png', '/images/electric-motor-repair.png'],
  'motor': ['/images/motor-rewinding-workshop.png', '/images/motor-diagnostics-testing.png', '/images/electric-motor-repair.png'],
  'controller': ['/images/custom-control-panel.png', '/images/switchgear-panel.png'],
  'ecm': ['/images/custom-control-panel.png', '/images/switchgear-panel.png'],
  'panel': ['/images/custom-control-panel.png', '/images/switchgear-panel.png', '/images/ups-control-panel.png'],
  'avr': ['/images/custom-control-panel.png'],
  'governor': ['/images/custom-control-panel.png'],

  // Battery & UPS
  'battery': ['/images/ups-battery-bank.png', '/images/ups-power-protection-system.png'],
  'ups': ['/images/ups-battery-bank.png', '/images/ups-control-panel.png', '/images/ups-rack-mount.png', '/images/ups-power-protection-system.png'],
  'charger': ['/images/ups-battery-bank.png'],

  // Pumps
  'pump': ['/images/water-pump-system.png', '/images/borehole-pump-installation.png', '/images/solar-water-pumping.png'],
  'water pump': ['/images/water-pump-system.png', '/images/borehole-pump-installation.png'],
  'borehole': ['/images/borehole-pump-installation.png', '/images/water-pump-system.png'],

  // Solar
  'solar': ['/images/solar power farms.png', '/images/solar for flower farms.png', '/images/solar-water-pumping.png'],
  'inverter': ['/images/solar changeover control.png', '/images/ups-control-panel.png'],
  'charge controller': ['/images/solar changeover control.png'],
  'mppt': ['/images/solar changeover control.png'],

  // Generators
  'generator': ['/images/FG-WILSON-GENERATOR.jpg', '/images/GREENHEART KILIFI GENERATOR.jpg', '/images/tnpl-diesal-generator-1000x1000.webp'],
  'canopy': ['/images/generator-canopy-fabrication.png'],
  'enclosure': ['/images/generator-canopy-fabrication.png'],

  // Brand-specific fallbacks
  'cummins': ['/images/KIVUKONI SCHOOL CUMMINS GENERATOR .webp', '/images/FG-WILSON-GENERATOR.jpg'],
  'perkins': ['/images/PERKINS FILTER 2 (1).webp', '/images/PERKINS-ENGINE-PARTS.jpg', '/images/ST AUSTINS ACADEMY 50KVA PERKINS ENGINE.jpg'],
  'caterpillar': ['/images/FG-WILSON-GENERATOR.jpg', '/images/NTSA- ATLAS COPCO GENERATOR.jpg'],
  'fg wilson': ['/images/FG-WILSON-GENERATOR.jpg'],
  'atlas copco': ['/images/NTSA- ATLAS COPCO GENERATOR.jpg'],
  'fleetguard': ['/images/PERKINS FILTER 2 (1).webp', '/images/Perkins-4000-Parts.webp'],
};

// Get product image based on part name/category
function getPartImage(part: Part): string {
  // Check if part has media images
  if (part.media?.images && part.media.images.length > 0) {
    return part.media.images[0];
  }

  // Search by part name keywords
  const nameLower = part.name.toLowerCase();
  const categoryLower = part.category?.toLowerCase() || '';
  const brandLower = part.brand?.toLowerCase() || '';

  // Find matching image
  for (const [keyword, images] of Object.entries(PART_IMAGES)) {
    if (nameLower.includes(keyword) || categoryLower.includes(keyword)) {
      // Return a consistent image based on part number hash
      const index = part.partNo.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % images.length;
      return images[index];
    }
  }

  // Try brand-based image
  for (const [keyword, images] of Object.entries(PART_IMAGES)) {
    if (brandLower.includes(keyword)) {
      return images[0];
    }
  }

  // Generate dynamic placeholder with part info
  return `/api/placeholder-part?name=${encodeURIComponent(part.name)}&brand=${encodeURIComponent(part.brand)}&partNo=${encodeURIComponent(part.partNo)}`;
}

/**
 * ENHANCED SPARE PARTS E-COMMERCE MODULE
 *
 * Features:
 * - 2000+ parts database
 * - Amazon/Alibaba-style shopping experience
 * - Full shopping cart with quantities
 * - M-Pesa payment integration
 * - Advanced filtering & sorting
 * - Product quick view
 * - Wishlist functionality
 * - SEO optimized
 */

interface Part {
  partNo: string;
  name: string;
  brand: string;
  category: string;
  compatibility?: string[];
  specifications: Record<string, any>;
  pricing: {
    currency: string;
    retailPrice: number;
    bulkPrice?: number;
    minimumOrder?: number;
  };
  inventory: {
    stock: string;
    quantity: number;
    location: string;
    leadTime?: string;
    reorderPoint?: number;
  };
  warranty?: string;
  tags: string[];
  media?: {
    images?: string[];
    datasheet?: string;
  };
  certifications?: string[];
}

interface CartItem extends Part {
  quantity: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

type SortOption = 'featured' | 'price-low' | 'price-high' | 'name-asc' | 'name-desc' | 'stock';

export default function SparePartsModule() {
  // State
  const [activeCategory, setActiveCategory] = useState<string>('generators');
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [stockOnly, setStockOnly] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewPart, setQuickViewPart] = useState<Part | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  // Get category and subcategories
  const categoryData = useMemo(() => {
    return sparePartsDatabase.categories.find(c => c.id === activeCategory);
  }, [activeCategory]);

  // Get all parts from active category
  const allParts = useMemo((): Part[] => {
    if (!categoryData) return [];

    const parts: Part[] = [];
    categoryData.subcategories.forEach(sub => {
      if (!activeSubcategory || sub.id === activeSubcategory) {
        sub.parts.forEach(part => {
          parts.push(part as Part);
        });
      }
    });
    return parts;
  }, [categoryData, activeSubcategory]);

  // Get unique brands
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    allParts.forEach(part => brands.add(part.brand));
    return Array.from(brands).sort();
  }, [allParts]);

  // Filter and search parts
  const filteredParts = useMemo(() => {
    let filtered = [...allParts];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(part =>
        part.name.toLowerCase().includes(query) ||
        part.partNo.toLowerCase().includes(query) ||
        part.brand.toLowerCase().includes(query) ||
        part.category.toLowerCase().includes(query) ||
        part.tags.some(tag => tag.includes(query)) ||
        (part.compatibility && part.compatibility.some(comp => comp.toLowerCase().includes(query)))
      );
    }

    // Price filter
    filtered = filtered.filter(part =>
      part.pricing.retailPrice >= priceRange[0] &&
      part.pricing.retailPrice <= priceRange[1]
    );

    // Stock filter
    if (stockOnly) {
      filtered = filtered.filter(part => part.inventory.stock === 'In Stock');
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(part => selectedBrands.includes(part.brand));
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.pricing.retailPrice - b.pricing.retailPrice);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.pricing.retailPrice - a.pricing.retailPrice);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'stock':
        filtered.sort((a, b) => {
          if (a.inventory.stock === 'In Stock' && b.inventory.stock !== 'In Stock') return -1;
          if (a.inventory.stock !== 'In Stock' && b.inventory.stock === 'In Stock') return 1;
          return 0;
        });
        break;
      default:
        // Featured - keep original order
        break;
    }

    return filtered;
  }, [allParts, searchQuery, priceRange, stockOnly, selectedBrands, sortBy]);

  // Pagination
  const paginatedParts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredParts.slice(start, end);
  }, [filteredParts, currentPage]);

  const totalPages = Math.ceil(filteredParts.length / itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, priceRange, stockOnly, selectedBrands, sortBy, activeCategory, activeSubcategory]);

  // Cart functions
  const addToCart = useCallback((part: Part, qty: number = 1) => {
    setCart(prev => {
      const existing = prev.find(p => p.partNo === part.partNo);
      if (existing) {
        return prev.map(p =>
          p.partNo === part.partNo
            ? { ...p, quantity: p.quantity + qty }
            : p
        );
      }
      return [...prev, { ...part, quantity: qty }];
    });
  }, []);

  const removeFromCart = useCallback((partNo: string) => {
    setCart(prev => prev.filter(p => p.partNo !== partNo));
  }, []);

  const updateCartQuantity = useCallback((partNo: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(partNo);
      return;
    }
    setCart(prev => prev.map(p =>
      p.partNo === partNo ? { ...p, quantity: qty } : p
    ));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    setCartOpen(false);
  }, []);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.pricing.retailPrice * item.quantity), 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Wishlist functions
  const toggleWishlist = useCallback((partNo: string) => {
    setWishlist(prev =>
      prev.includes(partNo)
        ? prev.filter(p => p !== partNo)
        : [...prev, partNo]
    );
  }, []);

  const isInWishlist = useCallback((partNo: string) => {
    return wishlist.includes(partNo);
  }, [wishlist]);

  const isInCart = useCallback((partNo: string) => {
    return cart.some(p => p.partNo === partNo);
  }, [cart]);

  return (
    <div className="relative min-h-screen bg-black">
      {/* Background Grid */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,217,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Header Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
            <Package className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{sparePartsDatabase.totalParts}+</p>
            <p className="text-gray-400 text-sm">Parts Available</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
            <Truck className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">Same Day</p>
            <p className="text-gray-400 text-sm">Delivery in Nairobi</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
            <Shield className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">Genuine</p>
            <p className="text-gray-400 text-sm">OEM Parts</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
            <Tag className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">M-Pesa</p>
            <p className="text-gray-400 text-sm">Secure Payment</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {sparePartsDatabase.categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setActiveSubcategory(null);
              }}
              className={`
                relative px-5 py-2.5 rounded-xl font-semibold text-sm
                transition-all duration-300
                ${activeCategory === category.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg mr-2">{category.icon}</span>
              {category.name}
            </motion.button>
          ))}
        </div>

        {/* Subcategory Pills */}
        {categoryData && categoryData.subcategories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveSubcategory(null)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                !activeSubcategory
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              All ({allParts.length})
            </button>
            {categoryData.subcategories.map(sub => {
              const count = sub.parts.length;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubcategory(sub.id)}
                  className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                    activeSubcategory === sub.id
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {sub.name.split(' - ')[0]} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Search and Filters Bar */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by part number, name, brand, or compatibility..."
                className="w-full pl-12 pr-4 py-3.5 bg-gray-900/80 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex gap-3">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none px-4 py-3.5 pr-10 bg-gray-900 border border-gray-800 rounded-xl text-white focus:border-cyan-500 focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A-Z</option>
                  <option value="name-desc">Name: Z-A</option>
                  <option value="stock">In Stock First</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3.5 rounded-xl border transition-all flex items-center gap-2 ${
                  showFilters
                    ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                    : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden md:inline">Filters</span>
              </button>

              {/* View Toggle */}
              <div className="flex border border-gray-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3.5 ${viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3.5 ${viewMode === 'list' ? 'bg-cyan-500 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Price Range (KES)</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                          placeholder="Min"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                          placeholder="Max"
                        />
                      </div>
                    </div>

                    {/* Stock Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Availability</label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={stockOnly}
                          onChange={(e) => setStockOnly(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
                        />
                        <span className="text-white">In Stock Only</span>
                      </label>
                    </div>

                    {/* Brand Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Brands</label>
                      <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                        {availableBrands.slice(0, 10).map(brand => (
                          <button
                            key={brand}
                            onClick={() => {
                              setSelectedBrands(prev =>
                                prev.includes(brand)
                                  ? prev.filter(b => b !== brand)
                                  : [...prev, brand]
                              );
                            }}
                            className={`px-3 py-1 rounded-full text-xs transition-all ${
                              selectedBrands.includes(brand)
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                : 'bg-gray-800 text-gray-400 hover:text-white'
                            }`}
                          >
                            {brand}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {(priceRange[0] > 0 || priceRange[1] < 500000 || stockOnly || selectedBrands.length > 0) && (
                    <button
                      onClick={() => {
                        setPriceRange([0, 500000]);
                        setStockOnly(false);
                        setSelectedBrands([]);
                      }}
                      className="mt-4 px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Count */}
          <div className="mt-4 flex justify-between items-center text-sm">
            <p className="text-gray-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredParts.length)} of {filteredParts.length} parts
            </p>
            {cart.length > 0 && (
              <button
                onClick={() => setCartOpen(true)}
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
              >
                <ShoppingCart className="w-4 h-4" />
                {cartItemCount} items in cart
              </button>
            )}
          </div>
        </div>

        {/* Parts Grid/List */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {paginatedParts.map((part, index) => (
                <motion.div
                  key={part.partNo}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onMouseEnter={() => setHoveredPart(part.partNo)}
                  onMouseLeave={() => setHoveredPart(null)}
                  className="group relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                    <Image
                      src={getPartImage(part)}
                      alt={part.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      onError={(e) => {
                        // Fallback to dynamic placeholder on error
                        const target = e.target as HTMLImageElement;
                        target.src = `/api/placeholder-part?name=${encodeURIComponent(part.name)}&brand=${encodeURIComponent(part.brand)}&partNo=${encodeURIComponent(part.partNo)}`;
                      }}
                    />
                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {/* Quick Actions */}
                    <div className={`absolute top-3 right-3 flex gap-2 transition-opacity ${hoveredPart === part.partNo ? 'opacity-100' : 'opacity-0'}`}>
                      <button
                        onClick={() => toggleWishlist(part.partNo)}
                        className={`p-2 rounded-full ${isInWishlist(part.partNo) ? 'bg-red-500 text-white' : 'bg-gray-800/80 text-gray-400 hover:text-white'}`}
                      >
                        <Heart className={`w-4 h-4 ${isInWishlist(part.partNo) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => setQuickViewPart(part)}
                        className="p-2 rounded-full bg-gray-800/80 text-gray-400 hover:text-white"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Stock Badge */}
                    <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold ${
                      part.inventory.stock === 'In Stock'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {part.inventory.stock}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <p className="text-cyan-400 text-xs font-semibold">{part.brand}</p>
                    <p className="text-gray-500 text-xs mb-1">{part.partNo}</p>
                    <h3 className="text-white font-semibold mb-2 line-clamp-2 min-h-[2.5rem]">{part.name}</h3>

                    {/* Compatibility */}
                    {part.compatibility && part.compatibility.length > 0 && (
                      <p className="text-gray-500 text-xs mb-3 line-clamp-1">
                        Fits: {part.compatibility.slice(0, 2).join(', ')}
                        {part.compatibility.length > 2 && ` +${part.compatibility.length - 2}`}
                      </p>
                    )}

                    {/* Price */}
                    <div className="flex items-end justify-between mb-3">
                      <div>
                        <p className="text-xl font-bold text-cyan-400">
                          KES {part.pricing.retailPrice.toLocaleString()}
                        </p>
                        {part.pricing.bulkPrice && (
                          <p className="text-xs text-gray-500">
                            Bulk: KES {part.pricing.bulkPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                      {part.warranty && (
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          {part.warranty}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart */}
                    {isInCart(part.partNo) ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartQuantity(part.partNo, (cart.find(c => c.partNo === part.partNo)?.quantity || 1) - 1)}
                          className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
                        >
                          <Minus className="w-4 h-4 text-white" />
                        </button>
                        <span className="flex-1 text-center text-white font-semibold">
                          {cart.find(c => c.partNo === part.partNo)?.quantity || 0}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(part.partNo, (cart.find(c => c.partNo === part.partNo)?.quantity || 0) + 1)}
                          className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(part)}
                        className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* List View */
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {paginatedParts.map((part, index) => (
                <motion.div
                  key={part.partNo}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-cyan-500/50 transition-all"
                >
                  <div className="flex gap-4 items-center">
                    {/* Image */}
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-800 rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-600" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-semibold truncate">{part.name}</h3>
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              part.inventory.stock === 'In Stock'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-orange-500/20 text-orange-400'
                            }`}>
                              {part.inventory.stock}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm">
                            {part.brand} • {part.partNo}
                          </p>
                          {part.compatibility && (
                            <p className="text-gray-500 text-xs mt-1">
                              Compatible: {part.compatibility.slice(0, 4).join(', ')}
                            </p>
                          )}
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-xl font-bold text-cyan-400">
                            KES {part.pricing.retailPrice.toLocaleString()}
                          </p>
                          {part.inventory.leadTime && (
                            <p className="text-xs text-gray-500">{part.inventory.leadTime}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleWishlist(part.partNo)}
                        className={`p-2 rounded-lg ${isInWishlist(part.partNo) ? 'text-red-400' : 'text-gray-400 hover:text-white'}`}
                      >
                        <Heart className={`w-5 h-5 ${isInWishlist(part.partNo) ? 'fill-current' : ''}`} />
                      </button>
                      {isInCart(part.partNo) ? (
                        <div className="flex items-center gap-1 bg-gray-800 rounded-lg px-2">
                          <button
                            onClick={() => updateCartQuantity(part.partNo, (cart.find(c => c.partNo === part.partNo)?.quantity || 1) - 1)}
                            className="p-1.5"
                          >
                            <Minus className="w-4 h-4 text-white" />
                          </button>
                          <span className="w-8 text-center text-white font-semibold">
                            {cart.find(c => c.partNo === part.partNo)?.quantity || 0}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(part.partNo, (cart.find(c => c.partNo === part.partNo)?.quantity || 0) + 1)}
                            className="p-1.5"
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(part)}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results */}
        {filteredParts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No parts found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setPriceRange([0, 500000]);
                setStockOnly(false);
                setSelectedBrands([]);
              }}
              className="px-6 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg ${
                    currentPage === page
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-full shadow-2xl shadow-green-500/30"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {cartItemCount}
          </span>
        </motion.button>
      )}

      {/* Cart Sidebar */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-gray-900 border-l border-gray-800 z-50 flex flex-col"
            >
              {/* Cart Header */}
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Shopping Cart
                    <span className="text-sm font-normal text-gray-400">({cartItemCount} items)</span>
                  </h2>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-800"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.map((item) => (
                  <div key={item.partNo} className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{item.name}</h4>
                        <p className="text-gray-400 text-sm">{item.partNo} • {item.brand}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.partNo)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartQuantity(item.partNo, item.quantity - 1)}
                          className="p-1.5 bg-gray-700 rounded-lg hover:bg-gray-600"
                        >
                          <Minus className="w-4 h-4 text-white" />
                        </button>
                        <span className="w-10 text-center text-white font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.partNo, item.quantity + 1)}
                          className="p-1.5 bg-gray-700 rounded-lg hover:bg-gray-600"
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      <p className="text-cyan-400 font-bold">
                        KES {(item.pricing.retailPrice * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Footer */}
              <div className="p-6 border-t border-gray-800 bg-gray-900">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-xl font-bold text-white">KES {cartTotal.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => {
                    setCartOpen(false);
                    setCheckoutOpen(true);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  <img
                    src="/images/mpesa-logo.png"
                    alt=""
                    className="w-6 h-6 object-contain"
                    onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                  />
                  Checkout with M-Pesa
                </button>
                <button
                  onClick={clearCart}
                  className="w-full py-2 mt-2 text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewPart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setQuickViewPart(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl z-50 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-cyan-400 font-semibold">{quickViewPart.brand}</p>
                    <h3 className="text-2xl font-bold text-white">{quickViewPart.name}</h3>
                    <p className="text-gray-400">{quickViewPart.partNo}</p>
                  </div>
                  <button
                    onClick={() => setQuickViewPart(null)}
                    className="p-2 rounded-lg hover:bg-gray-800"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Specifications */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Specifications</h4>
                    <div className="space-y-2">
                      {Object.entries(quickViewPart.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-400">{key}</span>
                          <span className="text-white">{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Compatibility */}
                  {quickViewPart.compatibility && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-3">Compatible Models</h4>
                      <div className="flex flex-wrap gap-2">
                        {quickViewPart.compatibility.map((model, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                            {model}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-cyan-400">
                      KES {quickViewPart.pricing.retailPrice.toLocaleString()}
                    </p>
                    <p className={`text-sm ${quickViewPart.inventory.stock === 'In Stock' ? 'text-green-400' : 'text-orange-400'}`}>
                      {quickViewPart.inventory.stock} • {quickViewPart.inventory.leadTime}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(quickViewPart);
                      setQuickViewPart(null);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* M-Pesa Checkout Modal */}
      <MpesaCheckout
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cart.map(item => ({
          partNo: item.partNo,
          name: item.name,
          brand: item.brand,
          quantity: item.quantity,
          price: item.pricing.retailPrice
        }))}
        cartTotal={cartTotal}
        onClearCart={clearCart}
      />
    </div>
  );
}
