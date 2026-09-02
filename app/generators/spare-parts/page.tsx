/**
 * UNIFIED SPARE PARTS MARKETPLACE - ENHANCED SEARCH
 *
 * Professional spare parts search with:
 * - Advanced search by name, part number, category, specs
 * - Smart filters (price range, stock, rating, service)
 * - Real-time search suggestions
 * - Highlighted search results
 * - Quick access filters
 *
 * Covers all EmersonEIMS services with real inventory
 */

'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { formatKES } from '@/lib/format/currency';
import Link from 'next/link';
import QuickInquiryForm from '@/components/forms/QuickInquiryForm';

interface Part {
  id?: string;
  code: string;
  name: string;
  category: string;
  subcategory?: string;
  sellingPrice?: number;
  price?: number;
  quantity: number;
  rating: number;
  inStock?: boolean;
  brand?: string;
  description?: string;
}

export default function SparePartsPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [filteredParts, setFilteredParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  // Advanced filters
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Search suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Service categories mapping
  const services = [
    { id: 'all', label: '🔧 All Services', icon: '🛠️' },
    { id: 'generators', label: '⚡ Generators', icon: '⚡' },
    { id: 'solar', label: '☀️ Solar Systems', icon: '☀️' },
    { id: 'ups', label: '🔋 UPS Systems', icon: '🔋' },
    { id: 'hvac', label: '❄️ HVAC & A/C', icon: '❄️' },
    { id: 'pumps', label: '💧 Water Pumps', icon: '💧' },
    { id: 'motors', label: '⚙️ Motors', icon: '⚙️' },
    { id: 'highvoltage', label: '⚠️ High Voltage', icon: '⚠️' },
    { id: 'fabrication', label: '🏗️ Steel Fabrication', icon: '🏗️' },
    { id: 'automation', label: '🤖 Automation', icon: '🤖' },
    { id: 'incinerators', label: '🔥 Incinerators', icon: '🔥' },
  ];

  useEffect(() => {
    loadParts();
    const saved = localStorage.getItem('recentSearches');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    filterAndSortParts();
  }, [parts, searchQuery, selectedService, sortBy, minPrice, maxPrice, minRating, inStockOnly]);

  const getPrice = (part: Part): number => {
    return part.sellingPrice || part.price || 0;
  };

  const isInStock = (part: Part): number => {
    return part.quantity || 0;
  };

  const loadParts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/parts/search?limit=10000');
      if (!response.ok) throw new Error('Failed to load parts');
      const data = await response.json();
      // Ensure all parts have required fields
      const normalizedParts = (data.parts || []).map((p: any) => ({
        ...p,
        price: p.sellingPrice || p.price || 0,
        quantity: p.quantity || 0,
        rating: p.rating || 0,
      }));
      setParts(normalizedParts);
    } catch (err) {
      setError(`Failed to load parts: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Parts loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchScoreMatch = (part: Part, query: string): number => {
    const q = query.toLowerCase();
    const name = part.name.toLowerCase();
    const code = part.code.toLowerCase();
    const cat = part.category.toLowerCase();

    // Exact matches score highest
    if (name === q || code === q) return 1000;
    if (name.startsWith(q)) return 500;
    if (code.startsWith(q)) return 400;

    // Partial matches
    const nameMatches = (name.match(new RegExp(q, 'g')) || []).length;
    const codeMatches = (code.match(new RegExp(q, 'g')) || []).length;
    const catMatches = (cat.match(new RegExp(q, 'g')) || []).length;

    return nameMatches * 10 + codeMatches * 50 + catMatches * 5;
  };

  const getSearchSuggestions = useCallback(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const matches = parts
      .filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map(p => ({ name: p.name, code: p.code, type: 'part' }));

    return matches;
  }, [parts, searchQuery]);

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part)
        ? `<mark key=${i} class="bg-yellow-500/30 font-bold">${part}</mark>`
        : part
    ).join('');
  };

  const filterAndSortParts = () => {
    let filtered = [...parts];

    // Advanced search: name, code, category
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered
        .map(p => ({
          part: p,
          score: searchScoreMatch(p, searchQuery)
        }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ part }) => part);

      // Save to recent searches
      if (filtered.length > 0) {
        const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
      }
    }

    // Filter by price range
    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // Filter by rating
    filtered = filtered.filter(p => (p.rating || 0) >= minRating);

    // Filter by stock
    if (inStockOnly) {
      filtered = filtered.filter(p => p.quantity > 0);
    }

    // Filter by service
    if (selectedService !== 'all') {
      filtered = filtered.filter(p => {
        const name = p.name.toLowerCase();
        const cat = p.category.toLowerCase();
        switch (selectedService) {
          case 'generators':
            return name.includes('generator') || name.includes('engine') || name.includes('diesel') || cat.includes('generator');
          case 'solar':
            return name.includes('solar') || name.includes('panel') || name.includes('inverter') || cat.includes('solar');
          case 'ups':
            return name.includes('ups') || name.includes('battery') || name.includes('backup') || cat.includes('ups');
          case 'hvac':
            return name.includes('ac') || name.includes('hvac') || name.includes('air') || cat.includes('a/c') || cat.includes('hvac');
          case 'pumps':
            return name.includes('pump') || name.includes('borehole') || name.includes('water') || cat.includes('pump');
          case 'motors':
            return name.includes('motor') || name.includes('electric') || cat.includes('motor');
          case 'highvoltage':
            return name.includes('high voltage') || name.includes('transformer') || cat.includes('hv');
          case 'fabrication':
            return name.includes('steel') || name.includes('pipe') || name.includes('welding') || cat.includes('steel');
          case 'automation':
            return name.includes('control') || name.includes('automation') || name.includes('plc') || cat.includes('automation');
          case 'incinerators':
            return name.includes('incinerator') || name.includes('furnace') || cat.includes('incinerator');
          default:
            return true;
        }
      });
    }

    // Sort
    if (searchQuery.trim() && sortBy === 'relevance') {
      // Already sorted by relevance above
    } else {
      switch (sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'stock':
          filtered.sort((a, b) => b.quantity - a.quantity);
          break;
        default:
          filtered.sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    setFilteredParts(filtered);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-black border-b border-amber-500/30 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-white mb-4">Genuine Spare Parts</h1>
          <p className="text-xl text-gray-300 mb-2">For all EmersonEIMS services & equipment</p>
          <p className="text-amber-400 text-lg font-semibold">15,452+ parts • Real inventory • Same-day Nairobi delivery</p>
        </div>
      </section>

      {/* Search Bar with Advanced Features */}
      <section className="bg-slate-900/50 border-b border-slate-800 sticky top-0 z-30 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-3">
            {/* Main Search */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by part name, code, or category... (e.g., 'Cummins alternator', '6BT5.9', 'generator bearing')"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full px-4 py-3 bg-black border-2 border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none transition"
                />

                {/* Search Suggestions Dropdown */}
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-lg z-40 max-h-80 overflow-y-auto">
                    {searchQuery.trim() && getSearchSuggestions().length > 0 && (
                      <div className="border-b border-slate-700">
                        <p className="px-4 py-2 text-xs text-gray-500 font-semibold">MATCHING PARTS</p>
                        {getSearchSuggestions().map((item, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setSearchQuery(item.name);
                              setShowSuggestions(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-slate-800 transition border-b border-slate-800/30 last:border-b-0"
                          >
                            <div className="text-white font-medium text-sm line-clamp-1">{item.name}</div>
                            <div className="text-amber-400 text-xs">Code: {item.code}</div>
                          </button>
                        ))}
                      </div>
                    )}

                    {!searchQuery.trim() && recentSearches.length > 0 && (
                      <div>
                        <p className="px-4 py-2 text-xs text-gray-500 font-semibold">RECENT SEARCHES</p>
                        {recentSearches.map((search, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setSearchQuery(search);
                              setShowSuggestions(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-slate-800 transition text-gray-300 text-sm border-b border-slate-800/30 last:border-b-0"
                          >
                            🕐 {search}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-black border-2 border-slate-700 rounded-lg text-white focus:border-amber-500 focus:outline-none min-w-max"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="name">Sort: A-Z</option>
                <option value="price-low">Sort: Price (Low→High)</option>
                <option value="price-high">Sort: Price (High→Low)</option>
                <option value="rating">Sort: Best Rated</option>
                <option value="stock">Sort: In Stock First</option>
              </select>

              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`px-4 py-3 rounded-lg font-bold transition ${
                  showAdvancedFilters
                    ? 'bg-amber-500 text-black'
                    : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
              >
                🔍 Filters
              </button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  inStockOnly
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                }`}
              >
                ✓ In Stock Only
              </button>
              <button
                onClick={() => {
                  setMinRating(4);
                  setMaxPrice(500000);
                }}
                className="px-3 py-2 bg-slate-800 text-gray-300 hover:bg-slate-700 rounded-lg text-sm font-medium transition"
              >
                ⭐ 4+ Stars
              </button>
              <button
                onClick={() => {
                  setMinPrice(0);
                  setMaxPrice(50000);
                }}
                className="px-3 py-2 bg-slate-800 text-gray-300 hover:bg-slate-700 rounded-lg text-sm font-medium transition"
              >
                💰 Budget (&lt;50K)
              </button>
              <button
                onClick={() => {
                  setMinPrice(50000);
                  setMaxPrice(500000);
                }}
                className="px-3 py-2 bg-slate-800 text-gray-300 hover:bg-slate-700 rounded-lg text-sm font-medium transition"
              >
                💎 Premium
              </button>
            </div>

            {/* Advanced Filters Panel */}
            {showAdvancedFilters && (
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Price Range (KES)</label>
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    placeholder="Min"
                    className="w-full px-3 py-2 bg-black border border-slate-700 rounded text-white text-sm mb-2 focus:border-amber-500"
                  />
                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    placeholder="Max"
                    className="w-full px-3 py-2 bg-black border border-slate-700 rounded text-white text-sm focus:border-amber-500"
                  />
                </div>

                {/* Min Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Minimum Rating</label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-black border border-slate-700 rounded text-white text-sm focus:border-amber-500"
                  >
                    <option value="0">All Ratings</option>
                    <option value="2">2+ Stars ⭐⭐</option>
                    <option value="3">3+ Stars ⭐⭐⭐</option>
                    <option value="4">4+ Stars ⭐⭐⭐⭐</option>
                    <option value="5">5 Stars ⭐⭐⭐⭐⭐</option>
                  </select>
                </div>

                {/* Stock Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Stock Status</label>
                  <label className="flex items-center text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="mr-2 w-4 h-4 accent-amber-500"
                    />
                    <span className="text-sm">In Stock Only</span>
                  </label>
                </div>

                {/* Reset Filters */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setMinPrice(0);
                      setMaxPrice(1000000);
                      setMinRating(0);
                      setInStockOnly(false);
                    }}
                    className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded text-sm font-medium transition"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Service Filter Tabs */}
      <section className="bg-slate-950 border-b border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-2">
            {services.map(service => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedService === service.id
                    ? 'bg-amber-500 text-black'
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {service.icon} {service.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400 text-lg">Loading 15,000+ spare parts...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-600 rounded-lg p-6 text-red-100 mb-8">
            <p className="font-bold">⚠️ Error Loading Parts</p>
            <p>{error}</p>
            <p className="text-sm mt-2">Please try refreshing the page or contact support at <a href="tel:+254768860665" className="underline font-bold">+254 768 860665</a></p>
          </div>
        )}

        {!loading && !error && filteredParts.length === 0 && (
          <div className="text-center py-20 bg-slate-900/30 rounded-lg border border-slate-800">
            <p className="text-gray-300 text-xl mb-3">❌ No parts found matching your criteria</p>
            <p className="text-gray-400 text-sm mb-6">
              {searchQuery ? `"${searchQuery}" didn't match any parts.` : 'Adjust your filters and try again.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setMinPrice(0);
                  setMaxPrice(1000000);
                  setMinRating(0);
                  setInStockOnly(false);
                  setSelectedService('all');
                }}
                className="px-6 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition"
              >
                Clear Filters
              </button>
              <a
                href="tel:+254768860665"
                className="px-6 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition"
              >
                📞 Call for Help
              </a>
            </div>
          </div>
        )}

        {!loading && filteredParts.length > 0 && (
          <>
            {/* Results Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    🔍 Found <span className="text-amber-400">{formatKES(filteredParts.length)}</span> spare parts
                  </h2>
                  {searchQuery && (
                    <p className="text-gray-400">
                      Matching: <span className="text-amber-300 font-semibold">"{searchQuery}"</span>
                      {selectedService !== 'all' && <span className="ml-2 text-gray-500">in {services.find(s => s.id === selectedService)?.label}</span>}
                    </p>
                  )}
                </div>
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition whitespace-nowrap"
                >
                  📞 Request Quote
                </Link>
              </div>

              {/* Active Filters Display */}
              {(minPrice > 0 || maxPrice < 1000000 || minRating > 0 || inStockOnly || searchQuery) && (
                <div className="flex flex-wrap gap-2 mb-4 text-xs">
                  {searchQuery && (
                    <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full">
                      Search: "{searchQuery}" ✕
                    </span>
                  )}
                  {inStockOnly && (
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                      In Stock Only ✕
                    </span>
                  )}
                  {minPrice > 0 && (
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">
                      Price ≥ KES {formatKES(minPrice)} ✕
                    </span>
                  )}
                  {maxPrice < 1000000 && (
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">
                      Price ≤ KES {formatKES(maxPrice)} ✕
                    </span>
                  )}
                  {minRating > 0 && (
                    <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">
                      Rating ≥ {minRating}★ ✕
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredParts.map(part => {
                const matchesSearch = searchQuery.trim() && (
                  part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  part.code.toLowerCase().includes(searchQuery.toLowerCase())
                );

                return (
                  <div
                    key={part.code}
                    className={`bg-slate-900/50 border rounded-lg p-4 hover:border-amber-500 transition group cursor-pointer ${
                      matchesSearch ? 'border-amber-500/50 shadow-lg shadow-amber-500/10' : 'border-slate-800'
                    }`}
                  >
                    {/* Stock Badge */}
                    <div className="mb-3 flex justify-between items-start">
                      <span className="text-xs font-bold bg-amber-500/20 text-amber-400 px-2 py-1 rounded truncate max-w-[60%]">
                        {part.category.substring(0, 25)}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${
                        part.quantity > 0
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {part.quantity > 0 ? `✓ ${part.quantity}` : 'Out'}
                      </span>
                    </div>

                    {/* Product Info */}
                    <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-amber-400 transition text-sm">
                      {part.name}
                    </h3>

                    {/* Part Code - Highlighted */}
                    <p className={`text-xs mb-3 font-mono ${
                      searchQuery && part.code.toLowerCase().includes(searchQuery.toLowerCase())
                        ? 'text-amber-300 font-bold bg-amber-500/10 px-2 py-1 rounded'
                        : 'text-gray-400'
                    }`}>
                      #{part.code}
                    </p>

                    {/* Price & Rating */}
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="text-xl font-bold text-amber-400">
                          KES {formatKES(part.price || 0)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-400 text-lg">{'⭐'.repeat(Math.floor(Math.min(5, part.rating || 3)))}</p>
                        <p className="text-xs text-gray-500">{part.rating || 3}/5</p>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      disabled={!part.quantity}
                      className={`w-full py-2 rounded font-bold transition text-sm ${
                        part.quantity
                          ? 'bg-amber-500 text-black hover:bg-amber-400'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {part.quantity ? '🛒 Get It' : 'Out of Stock'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Load More Indicator */}
            <div className="text-center mt-12 pt-8 border-t border-slate-800">
              <p className="text-gray-400 text-sm mb-4">
                Showing all {filteredParts.length} matching parts from {formatKES(parts.length)} in inventory
              </p>
              <p className="text-amber-400 text-sm font-semibold">
                🚚 Same-day delivery available in Nairobi | 📦 Nationwide shipping
              </p>
            </div>
          </>
        )}
      </div>

      {/* Contact CTA */}
      <section className="bg-slate-900 border-t border-slate-800 py-12 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Can't find what you need?</h2>
          <p className="text-gray-300 mb-6">Call us or WhatsApp for custom parts, bulk orders, or technical support</p>

          {/*
            Parts enquiry form, added 2026-08-25.
            This page carried 15,000+ parts and three outbound buttons but no
            way to ask from the page itself — a visitor who did not want to
            phone had to navigate to /contact and retype what they were looking
            at. Every step between wanting to ask and asking loses people. The
            three buttons below are untouched; this adds the fourth option.
          */}
          <div className="max-w-xl mx-auto mb-10 text-left">
            <QuickInquiryForm
              service="Generator Spare Parts"
              ctaLabel="Ask about this part"
              source="spare-parts"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+254768860665"
              className="px-8 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition"
            >
              📞 +254 768 860665
            </a>
            <a
              href="https://wa.me/254768860665?text=Hello%20EmersonEIMS%2C%20I%20would%20like%20to%20ask%20about%20generators."
              className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
            >
              💬 WhatsApp
            </a>
            <Link
              href="/contact"
              className="px-8 py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition"
            >
              📧 Send Inquiry
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
