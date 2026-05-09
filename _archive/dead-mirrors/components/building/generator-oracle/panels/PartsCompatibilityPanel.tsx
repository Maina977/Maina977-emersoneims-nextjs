'use client';

/**
 * Parts Compatibility Panel
 * Cross-reference and search for generator parts
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getPartsCompatibilityService,
  PARTS_DATABASE,
  PART_CATEGORIES,
  PartCategory,
  GeneratorPart,
  formatPrice,
  getAvailabilityColor,
  getAvailabilityLabel,
} from '@/lib/generator-oracle/partsCompatibility';

type ViewMode = 'search' | 'browse' | 'detail';

export default function PartsCompatibilityPanel() {
  const [viewMode, setViewMode] = useState<ViewMode>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'part_number' | 'model' | 'symptom'>('part_number');
  const [selectedCategory, setSelectedCategory] = useState<PartCategory | 'all'>('all');
  const [selectedPart, setSelectedPart] = useState<GeneratorPart | null>(null);
  const [currency, setCurrency] = useState<'KES' | 'USD'>('KES');

  const partsService = getPartsCompatibilityService();

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    switch (searchType) {
      case 'part_number':
        return partsService.searchByPartNumber(searchQuery);
      case 'model':
        const [brand, model] = searchQuery.split(' ');
        return partsService.searchByModel(brand || '', model || searchQuery);
      case 'symptom':
        return partsService.searchBySymptom(searchQuery);
      default:
        return [];
    }
  }, [searchQuery, searchType]);

  // Category filtered parts
  const categoryParts = useMemo(() => {
    if (selectedCategory === 'all') return PARTS_DATABASE;
    return partsService.searchByCategory(selectedCategory);
  }, [selectedCategory]);

  const handlePartClick = (part: GeneratorPart) => {
    setSelectedPart(part);
    setViewMode('detail');
  };

  const handleBack = () => {
    setSelectedPart(null);
    setViewMode(searchQuery ? 'search' : 'browse');
  };

  // Part Detail View
  if (viewMode === 'detail' && selectedPart) {
    const relatedParts = partsService.getRelatedParts(selectedPart.id);
    const categoryInfo = PART_CATEGORIES[selectedPart.category];

    return (
      <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrency(currency === 'KES' ? 'USD' : 'KES')}
              className="px-3 py-1 bg-slate-800 rounded-lg text-sm text-slate-300"
            >
              {currency}
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Part Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-3xl">
              {categoryInfo.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{selectedPart.name}</h2>
              <p className="text-slate-400 text-sm mt-1">{selectedPart.description}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className={`text-sm font-medium ${getAvailabilityColor(selectedPart.availability)}`}>
                  {getAvailabilityLabel(selectedPart.availability)}
                </span>
                {selectedPart.criticalPart && (
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
                    Critical Part
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-cyan-400">
                {selectedPart.avgPriceKES ? formatPrice(selectedPart.avgPriceKES, currency) : 'Contact for price'}
              </p>
              <p className="text-sm text-slate-500">avg. price</p>
            </div>
          </div>

          {/* Part Numbers */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Part Numbers & Cross-Reference</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {selectedPart.partNumbers.map((pn, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${
                    pn.type === 'oem'
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-slate-800/50 border-slate-700'
                  }`}
                >
                  <p className="text-white font-mono text-sm">{pn.number}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-400 text-xs">{pn.brand}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      pn.type === 'oem'
                        ? 'bg-green-500/20 text-green-400'
                        : pn.type === 'aftermarket'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-slate-700 text-slate-400'
                    }`}>
                      {pn.type.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Specifications</h3>
            <div className="bg-slate-800/50 rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  {Object.entries(selectedPart.specifications).map(([key, value], idx) => (
                    <tr key={key} className={idx % 2 === 0 ? 'bg-slate-800/30' : ''}>
                      <td className="px-4 py-2 text-slate-400 text-sm">{key}</td>
                      <td className="px-4 py-2 text-white text-sm font-medium">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Compatible Models */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Compatible Models</h3>
            <div className="flex flex-wrap gap-2">
              {selectedPart.compatibleModels.map((cm, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-slate-800 rounded-lg text-sm text-slate-300"
                >
                  {cm.brand} {cm.model}
                  {cm.years && <span className="text-slate-500 ml-1">({cm.years})</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Installation Notes */}
          {selectedPart.installationNotes && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Installation Notes</h3>
              <ul className="space-y-2">
                {selectedPart.installationNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Kenya Suppliers */}
          {selectedPart.suppliers && selectedPart.suppliers.length > 0 ? (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Kenya Suppliers</h3>
              <div className="space-y-2">
                {selectedPart.suppliers.map((supplier: { name: string; location: string; priceKES: number; inStock: boolean; leadTimeDays: number; verified: boolean }, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{supplier.name}</p>
                        {supplier.verified && (
                          <span className="text-green-400 text-xs">✓ Verified</span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm">{supplier.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-cyan-400 font-semibold">
                        {formatPrice(supplier.priceKES, currency)}
                      </p>
                      <p className={`text-xs ${supplier.inStock ? 'text-green-400' : 'text-yellow-400'}`}>
                        {supplier.inStock ? 'In Stock' : `${supplier.leadTimeDays} days`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Get This Part</h3>
              <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <p className="text-slate-300 mb-2">Contact EmersonEIMS Parts Department for pricing and availability.</p>
                <a href="tel:+254768860665" className="text-cyan-400 font-semibold hover:text-cyan-300">
                  +254 768 860 665
                </a>
              </div>
            </div>
          )}

          {/* Failure Symptoms */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Failure Symptoms</h3>
            <div className="flex flex-wrap gap-2">
              {selectedPart.failureSymptoms.map((symptom, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>

          {/* Related Parts */}
          {relatedParts.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-3">Related Parts</h3>
              <div className="grid grid-cols-2 gap-2">
                {relatedParts.map(part => (
                  <button
                    key={part.id}
                    onClick={() => setSelectedPart(part)}
                    className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500/50 text-left transition-all"
                  >
                    <p className="text-white text-sm font-medium">{part.name}</p>
                    <p className="text-cyan-400 text-sm mt-1">
                      {part.avgPriceKES ? formatPrice(part.avgPriceKES, currency) : 'Contact for price'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Search & Browse View
  return (
    <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Parts Compatibility</h2>
            <p className="text-slate-400 text-sm">Search OEM & aftermarket parts</p>
          </div>
          <button
            onClick={() => setCurrency(currency === 'KES' ? 'USD' : 'KES')}
            className="px-3 py-1.5 bg-slate-800 rounded-lg text-sm text-slate-300 hover:bg-slate-700"
          >
            Show {currency === 'KES' ? 'USD' : 'KES'}
          </button>
        </div>

        {/* Search Box */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                searchType === 'part_number'
                  ? 'Enter part number (e.g., 2654407, LF3349)'
                  : searchType === 'model'
                  ? 'Enter brand model (e.g., Perkins 1104)'
                  : 'Enter symptom (e.g., low oil pressure)'
              }
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Search Type Toggle */}
        <div className="flex gap-2 mt-3">
          {[
            { type: 'part_number', label: 'Part Number' },
            { type: 'model', label: 'Generator Model' },
            { type: 'symptom', label: 'Symptom' }
          ].map(({ type, label }) => (
            <button
              key={type}
              onClick={() => setSearchType(type as typeof searchType)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                searchType === type
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter (when not searching) */}
      {!searchQuery && (
        <div className="p-3 border-b border-slate-700 overflow-x-auto">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All Categories
            </button>
            {(Object.entries(PART_CATEGORIES) as [PartCategory, typeof PART_CATEGORIES[PartCategory]][]).map(
              ([key, value]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
                    selectedCategory === key
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {value.icon} {value.name}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="p-4 max-h-[500px] overflow-y-auto">
        {searchQuery ? (
          // Search Results
          searchResults.length > 0 ? (
            <div className="space-y-2">
              <p className="text-slate-400 text-sm mb-3">
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              </p>
              {searchResults.map((result) => (
                <PartCard
                  key={result.part.id}
                  part={result.part}
                  matchReason={result.matchReason}
                  currency={currency}
                  onClick={() => handlePartClick(result.part)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400">No parts found matching "{searchQuery}"</p>
              <p className="text-slate-500 text-sm mt-2">
                Try a different search term or browse by category
              </p>
            </div>
          )
        ) : (
          // Browse by Category
          <div className="space-y-2">
            <p className="text-slate-400 text-sm mb-3">
              {categoryParts.length} part{categoryParts.length !== 1 ? 's' : ''} in{' '}
              {selectedCategory === 'all' ? 'database' : PART_CATEGORIES[selectedCategory].name}
            </p>
            {categoryParts.map((part) => (
              <PartCard
                key={part.id}
                part={part}
                currency={currency}
                onClick={() => handlePartClick(part)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-t border-slate-700 bg-slate-800/30">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-bold text-white">{PARTS_DATABASE.length}</p>
            <p className="text-xs text-slate-500">Parts Listed</p>
          </div>
          <div>
            <p className="text-xl font-bold text-green-400">
              {PARTS_DATABASE.filter(p => p.availability === 'in_stock').length}
            </p>
            <p className="text-xs text-slate-500">In Stock</p>
          </div>
          <div>
            <p className="text-xl font-bold text-cyan-400">
              {PARTS_DATABASE.filter(p => p.criticalPart).length}
            </p>
            <p className="text-xs text-slate-500">Critical Parts</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Part Card Component
function PartCard({
  part,
  matchReason,
  currency,
  onClick
}: {
  part: GeneratorPart;
  matchReason?: string;
  currency: 'KES' | 'USD';
  onClick: () => void;
}) {
  const categoryInfo = PART_CATEGORIES[part.category];

  return (
    <button
      onClick={onClick}
      className="w-full p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500/50 text-left transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-xl flex-shrink-0">
          {categoryInfo.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-white font-medium">{part.name}</h4>
              <p className="text-slate-400 text-sm truncate">{part.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-cyan-400 font-semibold">
                {part.avgPriceKES ? formatPrice(part.avgPriceKES, currency) : 'Contact'}
              </p>
              <p className={`text-xs ${getAvailabilityColor(part.availability)}`}>
                {getAvailabilityLabel(part.availability)}
              </p>
            </div>
          </div>

          {matchReason && (
            <p className="text-xs text-cyan-400 mt-1">{matchReason}</p>
          )}

          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded">
              {categoryInfo.name}
            </span>
            {part.criticalPart && (
              <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                Critical
              </span>
            )}
            <span className="text-xs text-slate-500">
              {part.partNumbers.length} cross-refs
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
