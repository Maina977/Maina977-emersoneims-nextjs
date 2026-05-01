'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone, MessageCircle, ChevronDown, ChevronUp,
  Shield, Truck, Clock, CheckCircle, Star, Filter
} from 'lucide-react';

/**
 * GENERATOR PRICE LIST - TRANSPARENT PRICING
 *
 * People search "generator price Kenya" - give them prices!
 * Transparency builds trust and captures leads
 */

interface GeneratorListing {
  brand: string;
  models: {
    kva: number;
    phase: '1-Phase' | '3-Phase';
    priceRange: { min: number; max: number };
    popular?: boolean;
  }[];
}

const GENERATOR_PRICES: GeneratorListing[] = [
  {
    brand: 'Cummins',
    models: [
      { kva: 10, phase: '1-Phase', priceRange: { min: 280000, max: 350000 } },
      { kva: 15, phase: '3-Phase', priceRange: { min: 380000, max: 450000 } },
      { kva: 20, phase: '3-Phase', priceRange: { min: 480000, max: 580000 } },
      { kva: 30, phase: '3-Phase', priceRange: { min: 650000, max: 780000 }, popular: true },
      { kva: 50, phase: '3-Phase', priceRange: { min: 950000, max: 1150000 } },
      { kva: 60, phase: '3-Phase', priceRange: { min: 1100000, max: 1350000 } },
      { kva: 80, phase: '3-Phase', priceRange: { min: 1400000, max: 1700000 } },
      { kva: 100, phase: '3-Phase', priceRange: { min: 1750000, max: 2100000 }, popular: true },
      { kva: 150, phase: '3-Phase', priceRange: { min: 2400000, max: 2900000 } },
      { kva: 200, phase: '3-Phase', priceRange: { min: 3200000, max: 3800000 } },
      { kva: 250, phase: '3-Phase', priceRange: { min: 4000000, max: 4800000 } },
      { kva: 300, phase: '3-Phase', priceRange: { min: 4800000, max: 5800000 } },
      { kva: 500, phase: '3-Phase', priceRange: { min: 7500000, max: 9000000 } },
    ],
  },
  {
    brand: 'Perkins',
    models: [
      { kva: 10, phase: '1-Phase', priceRange: { min: 250000, max: 320000 } },
      { kva: 15, phase: '3-Phase', priceRange: { min: 350000, max: 420000 } },
      { kva: 20, phase: '3-Phase', priceRange: { min: 450000, max: 550000 } },
      { kva: 30, phase: '3-Phase', priceRange: { min: 600000, max: 720000 }, popular: true },
      { kva: 45, phase: '3-Phase', priceRange: { min: 850000, max: 1000000 } },
      { kva: 60, phase: '3-Phase', priceRange: { min: 1050000, max: 1280000 }, popular: true },
      { kva: 80, phase: '3-Phase', priceRange: { min: 1350000, max: 1600000 } },
      { kva: 100, phase: '3-Phase', priceRange: { min: 1650000, max: 2000000 } },
      { kva: 150, phase: '3-Phase', priceRange: { min: 2300000, max: 2750000 } },
      { kva: 200, phase: '3-Phase', priceRange: { min: 3000000, max: 3600000 } },
      { kva: 300, phase: '3-Phase', priceRange: { min: 4500000, max: 5500000 } },
      { kva: 400, phase: '3-Phase', priceRange: { min: 6000000, max: 7200000 } },
    ],
  },
  {
    brand: 'FG Wilson',
    models: [
      { kva: 14, phase: '3-Phase', priceRange: { min: 400000, max: 480000 } },
      { kva: 22, phase: '3-Phase', priceRange: { min: 550000, max: 650000 } },
      { kva: 33, phase: '3-Phase', priceRange: { min: 700000, max: 850000 }, popular: true },
      { kva: 50, phase: '3-Phase', priceRange: { min: 1000000, max: 1200000 } },
      { kva: 65, phase: '3-Phase', priceRange: { min: 1200000, max: 1450000 } },
      { kva: 88, phase: '3-Phase', priceRange: { min: 1500000, max: 1800000 } },
      { kva: 110, phase: '3-Phase', priceRange: { min: 1900000, max: 2300000 }, popular: true },
      { kva: 150, phase: '3-Phase', priceRange: { min: 2500000, max: 3000000 } },
      { kva: 200, phase: '3-Phase', priceRange: { min: 3300000, max: 4000000 } },
      { kva: 275, phase: '3-Phase', priceRange: { min: 4500000, max: 5400000 } },
      { kva: 350, phase: '3-Phase', priceRange: { min: 5800000, max: 7000000 } },
      { kva: 500, phase: '3-Phase', priceRange: { min: 8000000, max: 9500000 } },
    ],
  },
];

export default function GeneratorPriceList() {
  const [expandedBrand, setExpandedBrand] = useState<string | null>('Cummins');
  const [filterKVA, setFilterKVA] = useState<'all' | 'small' | 'medium' | 'large'>('all');

  const COMPANY_PHONE = '+254768860665';
  const COMPANY_WHATSAPP = '254768860665';

  const filterModels = (models: GeneratorListing['models']) => {
    switch (filterKVA) {
      case 'small': return models.filter(m => m.kva <= 30);
      case 'medium': return models.filter(m => m.kva > 30 && m.kva <= 100);
      case 'large': return models.filter(m => m.kva > 100);
      default: return models;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-amber-500/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4">
        <h3 className="text-xl font-bold text-white">Generator Price List Kenya 2026</h3>
        <p className="text-amber-100 text-sm">All prices in KES - Updated March 2026</p>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400 mr-2">Size:</span>
          {[
            { id: 'all', label: 'All Sizes' },
            { id: 'small', label: '≤30 KVA' },
            { id: 'medium', label: '31-100 KVA' },
            { id: 'large', label: '>100 KVA' },
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setFilterKVA(filter.id as any)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filterKVA === filter.id
                  ? 'bg-amber-500 text-black font-medium'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Lists */}
      <div className="divide-y divide-gray-700">
        {GENERATOR_PRICES.map(brand => {
          const filteredModels = filterModels(brand.models);
          const isExpanded = expandedBrand === brand.brand;

          return (
            <div key={brand.brand}>
              {/* Brand Header */}
              <button
                onClick={() => setExpandedBrand(isExpanded ? null : brand.brand)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-white">{brand.brand}</span>
                  <span className="text-sm text-gray-400">
                    {filteredModels.length} models
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Models */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="bg-gray-800/30"
                >
                  <div className="grid gap-2 p-4">
                    {filteredModels.map(model => (
                      <div
                        key={`${brand.brand}-${model.kva}`}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          model.popular ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-gray-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{model.kva} KVA</span>
                              {model.popular && (
                                <span className="flex items-center gap-1 text-xs bg-amber-500 text-black px-2 py-0.5 rounded-full font-medium">
                                  <Star className="w-3 h-3" /> Popular
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-400">{model.phase}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-white font-medium">
                              KES {model.priceRange.min.toLocaleString()} - {model.priceRange.max.toLocaleString()}
                            </div>
                          </div>
                          <a
                            href={`https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(`Hi! I'm interested in a ${model.kva}KVA ${brand.brand} generator. What's the exact price and availability?`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-2 bg-[#25D366] text-white text-sm font-medium rounded-lg hover:bg-[#22c55e]"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Quote
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="p-4 bg-gray-800/50 border-t border-gray-700">
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`tel:${COMPANY_PHONE}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500"
          >
            <Phone className="w-5 h-5" />
            Call for Best Price
          </a>
          <a
            href={`https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent("Hi! I'd like to get a quote for generators. Can you share your current prices?")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#22c55e]"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp for Quote
          </a>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-green-500" /> 3-Year Warranty
          </span>
          <span className="flex items-center gap-1">
            <Truck className="w-3 h-3 text-blue-500" /> Free Delivery
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-500" /> 24/7 Support
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-purple-500" /> Genuine Parts
          </span>
        </div>
      </div>
    </div>
  );
}
