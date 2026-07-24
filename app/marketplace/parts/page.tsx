'use client';

/**
 * EMERSONEIMS PARTS MARKETPLACE
 * Amazon-style parts e-commerce with 15,452+ items
 * 30-day return policy, M-Pesa payment, real-time inventory
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import ConversionCTA from '@/components/cta/ConversionCTA';

export default function PartsMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'newest' | 'rating'>('price-low');
  const [cart, setCart] = useState<number>(0);

  // Mock data - will be populated from CSV
  const mockParts = [
    {
      id: '1',
      code: 'ABR-1',
      name: 'Cutting disc 4.5" × 1.6mm metal (100 pack)',
      category: 'Abrasives',
      price: 1153,
      cost: 795,
      image: '/images/parts/abrasives-1.jpg',
      inStock: true,
      quantity: 12,
      rating: 4.5,
      reviews: 28,
      margin: 31
    },
    {
      id: '2',
      code: 'ENG-102',
      name: 'Fuel Filter Diesel - Cummins 3318644',
      category: 'Filters',
      price: 3450,
      cost: 1890,
      image: '/images/parts/fuel-filter.jpg',
      inStock: true,
      quantity: 45,
      rating: 4.8,
      reviews: 156,
      margin: 45
    },
    {
      id: '3',
      code: 'BRG-045',
      name: 'Roller Bearing 6205ZZ',
      category: 'Bearings',
      price: 2800,
      cost: 1200,
      image: '/images/parts/bearing.jpg',
      inStock: true,
      quantity: 67,
      rating: 4.6,
      reviews: 89,
      margin: 57
    },
  ];

  const categories = ['All', 'Abrasives', 'Bearings', 'Filters', 'Engine Parts', 'Electrical', 'Fasteners', 'Other'];

  // Filter logic
  const filteredParts = useMemo(() => {
    let filtered = mockParts;

    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    return filtered;
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-black border-b border-amber-500/20 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Parts Marketplace</h1>
              <p className="text-gray-400">15,452+ genuine OEM and aftermarket parts in stock</p>
            </div>
            <button className="relative px-6 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition">
              🛒 Cart ({cart})
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search parts by name, code, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
            />
            <button className="px-6 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition">
              🔍 Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-1"
          >
            <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-800 sticky top-6">
              <h3 className="text-lg font-bold text-white mb-4">Filters</h3>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase">Category</h4>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat === 'All' ? null : cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition ${
                        (selectedCategory === cat || (!selectedCategory && cat === 'All'))
                          ? 'bg-amber-500 text-black font-semibold'
                          : 'text-gray-400 hover:bg-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6 pb-6 border-b border-slate-700">
                <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase">Price Range</h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex justify-between items-center">
                    <span>KES {priceRange[0].toLocaleString()}</span>
                    <span>-</span>
                    <span>KES {priceRange[1].toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Stock Filter */}
              <div className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer">
                <input type="checkbox" id="stock" defaultChecked className="rounded" />
                <label htmlFor="stock" className="text-sm">Show in stock only</label>
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
              <p className="text-gray-400">
                Showing <span className="text-amber-400 font-bold">{filteredParts.length}</span> of {mockParts.length} parts
              </p>
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
                >
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewType('grid')}
                    className={`p-2 rounded transition ${viewType === 'grid' ? 'bg-amber-500 text-black' : 'bg-slate-800 text-gray-400'}`}
                  >
                    ⊞
                  </button>
                  <button
                    onClick={() => setViewType('list')}
                    className={`p-2 rounded transition ${viewType === 'list' ? 'bg-amber-500 text-black' : 'bg-slate-800 text-gray-400'}`}
                  >
                    ≡
                  </button>
                </div>
              </div>
            </div>

            {/* Parts Grid */}
            <div className={viewType === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredParts.map((part, index) => (
                <motion.div
                  key={part.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden hover:border-amber-500/50 transition"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-slate-800 to-black overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 bg-slate-700 rounded-lg flex items-center justify-center text-3xl">
                        ⚙️
                      </div>
                    </div>
                    {part.inStock && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                        In Stock
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">{part.code}</p>
                    <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2">{part.name}</h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-400">{part.rating.toFixed(1)}</span>
                      <span className="text-xs text-gray-600">({part.reviews})</span>
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                      <p className="text-2xl font-bold text-amber-400">KES {part.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">
                        Cost: KES {part.cost.toLocaleString()} | Margin: {part.margin}%
                      </p>
                    </div>

                    {/* Stock */}
                    <p className="text-xs text-gray-400 mb-3">{part.quantity} units available</p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCart(cart + 1)}
                        className="flex-1 px-3 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition text-sm"
                      >
                        Add to Cart
                      </button>
                      <button className="px-3 py-2 bg-slate-800 text-gray-400 rounded-lg hover:bg-slate-700 transition">
                        ♡
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredParts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No parts found matching your criteria</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                  className="mt-4 px-6 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Return Policy Section */}
      <section className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-y border-green-500/20 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Our 30-Day Return Guarantee</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-lg font-bold text-white mb-2">Risk-Free Purchases</h3>
              <p className="text-gray-400 text-sm">All parts come with a 30-day money-back guarantee if you're not satisfied with the quality or condition.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-lg font-bold text-white mb-2">Easy Returns</h3>
              <p className="text-gray-400 text-sm">Simply contact us within 30 days for a full refund or replacement. No questions asked.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-lg font-bold text-white mb-2">Fast Refunds</h3>
              <p className="text-gray-400 text-sm">Refunds processed within 5-7 business days of receiving returned items to your M-Pesa wallet.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <ConversionCTA
        label="Need a Custom Quote for Bulk Orders?"
        service="Bulk Parts Quote"
        style="primary"
        size="lg"
        icon="📦"
      />
    </main>
  );
}
