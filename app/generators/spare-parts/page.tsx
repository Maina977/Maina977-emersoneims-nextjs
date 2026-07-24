/**
 * UNIFIED SPARE PARTS MARKETPLACE
 *
 * Shows spare parts for ALL EmersonEIMS services:
 * - Generators (Cummins, Caterpillar, Perkins, Volvo Penta)
 * - Solar Systems
 * - UPS Systems
 * - HVAC & Air Conditioning
 * - Borehole & Water Pumps
 * - Motors & Motor Rewinding
 * - High Voltage Infrastructure
 * - Steel Fabrication
 * - Controls & Automation
 * - Incinerators
 *
 * Real-time inventory with real prices & stock levels
 */

'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Part {
  code: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  rating: number;
}

export default function SparePartsPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [filteredParts, setFilteredParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('all');
  const [sortBy, setSortBy] = useState('name');

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
  }, []);

  useEffect(() => {
    filterAndSortParts();
  }, [parts, searchQuery, selectedService, sortBy]);

  const loadParts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/parts/search?limit=10000');
      if (!response.ok) throw new Error('Failed to load parts');
      const data = await response.json();
      setParts(data.parts || []);
    } catch (err) {
      setError(`Failed to load parts: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Parts loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortParts = () => {
    let filtered = [...parts];

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by service (rough mapping based on category/name keywords)
    if (selectedService !== 'all') {
      filtered = filtered.filter(p => {
        const name = p.name.toLowerCase();
        const cat = p.category.toLowerCase();

        switch (selectedService) {
          case 'generators':
            return name.includes('generator') || name.includes('engine') || name.includes('diesel');
          case 'solar':
            return name.includes('solar') || name.includes('panel') || name.includes('inverter');
          case 'ups':
            return name.includes('ups') || name.includes('battery') || name.includes('backup');
          case 'hvac':
            return name.includes('ac') || name.includes('hvac') || name.includes('air') || cat.includes('a/c');
          case 'pumps':
            return name.includes('pump') || name.includes('borehole') || name.includes('water');
          case 'motors':
            return name.includes('motor') || name.includes('electric');
          case 'highvoltage':
            return name.includes('high voltage') || name.includes('transformer');
          case 'fabrication':
            return name.includes('steel') || name.includes('pipe') || name.includes('welding');
          case 'automation':
            return name.includes('control') || name.includes('automation') || name.includes('plc');
          case 'incinerators':
            return name.includes('incinerator') || name.includes('furnace');
          default:
            return true;
        }
      });
    }

    // Sort
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
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredParts(filtered);
  };

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-black border-b border-amber-500/30 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-white mb-4">Genuine Spare Parts</h1>
          <p className="text-xl text-gray-300 mb-2">For all EmersonEIMS services & equipment</p>
          <p className="text-amber-400 text-lg font-semibold">15,452+ parts • Real inventory • Same-day Nairobi delivery</p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="bg-slate-900/50 border-b border-slate-800 sticky top-0 z-30 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search by part name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 bg-black border-2 border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none transition"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-black border-2 border-slate-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="name">Sort: A-Z</option>
              <option value="price-low">Price: Low→High</option>
              <option value="price-high">Price: High→Low</option>
              <option value="rating">Best Rated</option>
            </select>
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
            <p className="text-gray-400 text-lg">Loading inventory...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-600 rounded-lg p-6 text-red-100 mb-8">
            <p className="font-bold">Error Loading Parts</p>
            <p>{error}</p>
            <p className="text-sm mt-2">Please try refreshing the page or contact support at <a href="tel:+254768860665" className="underline">+254 768 860665</a></p>
          </div>
        )}

        {!loading && !error && filteredParts.length === 0 && (
          <div className="text-center py-20 bg-slate-900/30 rounded-lg">
            <p className="text-gray-400 text-lg">No parts found matching your search.</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search terms.</p>
          </div>
        )}

        {!loading && filteredParts.length > 0 && (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                Showing <span className="text-amber-400">{filteredParts.length}</span> spare parts
              </h2>
              <Link
                href="/contact"
                className="px-6 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition"
              >
                📞 Request Quote
              </Link>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredParts.map(part => (
                <div
                  key={part.code}
                  className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-amber-500/50 transition group cursor-pointer"
                >
                  {/* Stock Badge */}
                  <div className="mb-3 flex justify-between items-start">
                    <span className="text-xs font-bold bg-amber-500/20 text-amber-400 px-2 py-1 rounded">
                      {part.category.substring(0, 20)}
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      part.quantity > 0
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {part.quantity > 0 ? `✓ Stock: ${part.quantity}` : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Product Info */}
                  <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-amber-400 transition">
                    {part.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">Code: {part.code}</p>

                  {/* Price & Rating */}
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-2xl font-bold text-amber-400">
                        KES {part.price?.toLocaleString() || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-400">{'⭐'.repeat(Math.floor(Math.min(5, part.rating || 3)))}</p>
                      <p className="text-xs text-gray-500">{part.rating || 3}/5</p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    disabled={!part.quantity}
                    className={`w-full py-2 rounded font-bold transition ${
                      part.quantity
                        ? 'bg-amber-500 text-black hover:bg-amber-400'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {part.quantity ? '🛒 Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Contact CTA */}
      <section className="bg-slate-900 border-t border-slate-800 py-12 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Can't find what you need?</h2>
          <p className="text-gray-300 mb-6">Call us or WhatsApp for custom parts, bulk orders, or technical support</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+254768860665"
              className="px-8 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition"
            >
              📞 +254 768 860665
            </a>
            <a
              href="https://wa.me/254768860665"
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
    </main>
  );
}
