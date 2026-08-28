'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Part } from '@/lib/parts/partsInventoryParser';

export default function PartsMarketplace() {
  const [parts, setParts] = useState<Part[]>([]);
  const [totalParts, setTotalParts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'rating'>('name');
  const [cart, setCart] = useState<Map<string, number>>(new Map());
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const categories = ['All', 'Abrasives', 'Bearings', 'Belts & Chains', 'Electrical', 'Engine Parts', 'Fasteners', 'Filters', 'Fluids', 'Gaskets & Seals', 'Hydraulics', 'Motors', 'Pumps', 'Valves', 'Other'];

  useEffect(() => {
    fetchParts();
  }, [searchQuery, selectedCategory, priceRange, sortBy, page]);

  const fetchParts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      params.append('minPrice', priceRange[0].toString());
      params.append('maxPrice', priceRange[1].toString());
      params.append('sort', sortBy);
      params.append('page', page.toString());
      params.append('limit', pageSize.toString());

      const response = await fetch(`/api/parts/search?${params}`);
      const data = await response.json();
      setParts(data.parts || []);
      setTotalParts(data.total || 0);
    } catch (error) {
      console.error('Failed to load parts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (partId: string) => {
    setCart(prev => {
      const newCart = new Map(prev);
      newCart.set(partId, (newCart.get(partId) || 0) + 1);
      return newCart;
    });
  };

  const cartCount = Array.from(cart.values()).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-gradient-to-r from-slate-900 to-black border-b border-amber-500/20 py-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Parts Marketplace</h1>
              <p className="text-gray-400">15,452+ genuine OEM and aftermarket parts</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="relative px-6 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition"
            >
              🛒 Cart ({cartCount})
            </motion.button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search parts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none transition"
            />
            <button className="px-6 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition">
              🔍
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-1">
            <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-800 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-4">Filters</h3>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase">Category</h4>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                        selectedCategory === cat
                          ? 'bg-amber-500 text-black font-semibold'
                          : 'text-gray-400 hover:bg-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-slate-700">
                <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase">Price</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>KES {priceRange[0].toLocaleString()}</span>
                    <span>KES {priceRange[1].toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setPriceRange([0, 100000]);
                  setPage(1);
                }}
                className="w-full px-4 py-2 bg-slate-800 text-gray-400 rounded-lg hover:bg-slate-700 transition text-sm"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>

          <div className="md:col-span-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-800">
              <p className="text-gray-400 text-sm">
                Showing <span className="text-amber-400 font-bold">{parts.length}</span> of <span className="text-amber-400 font-bold">{totalParts}</span> parts
              </p>
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
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

            {loading && (
              <div className="flex items-center justify-center py-12">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="text-4xl">
                  ⚙️
                </motion.div>
              </div>
            )}

            {!loading && parts.length > 0 && (
              <div className={viewType === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {parts.map((part) => (
                  <motion.div
                    key={part.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="group bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden hover:border-amber-500/50 transition"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-slate-800 to-black overflow-hidden flex items-center justify-center">
                      <div className="text-5xl">⚙️</div>
                      {part.inStock && (
                        <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                          In Stock
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <p className="text-xs text-gray-500 mb-1 uppercase font-semibold">{part.code}</p>
                      <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2">{part.name}</h3>

                      <div className="flex items-center gap-1 mb-3">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-400">{part.rating?.toFixed(1) || 'N/A'}</span>
                        <span className="text-xs text-gray-600">({part.reviews || 0})</span>
                      </div>

                      <div className="mb-3">
                        <p className="text-2xl font-bold text-amber-400">KES {part.sellingPrice.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Margin: {part.margin}%</p>
                      </div>

                      <p className="text-xs text-gray-400 mb-3">{part.quantity} available</p>

                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => addToCart(part.id)}
                          disabled={!part.inStock}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex-1 px-3 py-2 font-semibold rounded-lg transition text-sm ${
                            part.inStock
                              ? 'bg-amber-500 text-black hover:bg-amber-400'
                              : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                          }`}
                        >
                          Add to Cart
                        </motion.button>
                        <button className="px-3 py-2 bg-slate-800 text-gray-400 rounded-lg hover:bg-slate-700 transition">
                          ♡
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && parts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg mb-4">No parts found</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setPriceRange([0, 100000]);
                  }}
                  className="px-6 py-2 bg-amber-500 text-black font-semibold rounded-lg"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
