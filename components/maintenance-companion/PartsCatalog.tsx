'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GeneratorPart,
  partsDatabase,
  searchParts,
  getPartsBySystem,
  availabilityColors,
  availabilityLabels,
  PartSystem
} from '@/lib/maintenance-companion/partsDatabase';

interface PartsCatalogProps {
  initialPartNumber?: string;
}

export default function PartsCatalog({ initialPartNumber }: PartsCatalogProps) {
  const [searchQuery, setSearchQuery] = useState(initialPartNumber || '');
  const [selectedSystem, setSelectedSystem] = useState<PartSystem | null>(null);
  const [selectedPart, setSelectedPart] = useState<GeneratorPart | null>(null);
  const [shoppingList, setShoppingList] = useState<string[]>([]);

  const systems: { id: PartSystem; name: string; icon: string }[] = [
    { id: 'engine', name: 'Engine', icon: '⚙️' },
    { id: 'fuel', name: 'Fuel', icon: '⛽' },
    { id: 'cooling', name: 'Cooling', icon: '❄️' },
    { id: 'electrical', name: 'Electrical', icon: '⚡' },
    { id: 'control', name: 'Control', icon: '🎛️' },
    { id: 'filters', name: 'Filters', icon: '🔧' },
    { id: 'consumables', name: 'Consumables', icon: '🛢️' }
  ];

  const filteredParts = searchQuery
    ? searchParts(searchQuery)
    : selectedSystem
      ? getPartsBySystem(selectedSystem)
      : partsDatabase;

  const toggleShoppingList = (partId: string) => {
    setShoppingList(prev =>
      prev.includes(partId)
        ? prev.filter(id => id !== partId)
        : [...prev, partId]
    );
  };

  // Part Detail Modal
  const PartDetailModal = ({ part, onClose }: { part: GeneratorPart; onClose: () => void }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{part.name}</h2>
            <p className="text-cyan-400 font-mono">{part.partNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <p className="text-slate-400">{part.description}</p>

          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <span className="text-slate-500 text-xs block mb-1">Price Range</span>
              <span className="text-white font-mono">
                KES {part.priceRange.min.toLocaleString()} - {part.priceRange.max.toLocaleString()}
              </span>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <span className="text-slate-500 text-xs block mb-1">Availability</span>
              <span
                className="font-medium"
                style={{ color: availabilityColors[part.availability] }}
              >
                {availabilityLabels[part.availability]}
              </span>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <span className="text-slate-500 text-xs block mb-1">Lead Time</span>
              <span className="text-white">{part.leadTime}</span>
            </div>
          </div>

          {/* Alternate Part Numbers */}
          {part.alternateNumbers.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-2">Cross-Reference Numbers</h3>
              <div className="flex flex-wrap gap-2">
                {part.alternateNumbers.map((num) => (
                  <span
                    key={num}
                    className="px-3 py-1 bg-slate-800 text-slate-300 rounded font-mono text-sm"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Specifications */}
          {Object.keys(part.specifications).length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-2">Specifications</h3>
              <div className="bg-slate-800/50 rounded-lg divide-y divide-slate-700">
                {Object.entries(part.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between px-4 py-2">
                    <span className="text-slate-400">{key}</span>
                    <span className="text-white font-mono text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compatible Models */}
          <div>
            <h3 className="text-white font-semibold mb-2">Compatible Models</h3>
            <div className="flex flex-wrap gap-2">
              {part.compatibleModels.map((model) => (
                <span
                  key={model}
                  className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded text-sm"
                >
                  {model}
                </span>
              ))}
            </div>
          </div>

          {/* Replacement Interval */}
          {part.replacementInterval && (
            <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/30">
              <span className="text-amber-400 text-sm font-medium block mb-1">
                Recommended Replacement Interval
              </span>
              <span className="text-white">{part.replacementInterval}</span>
            </div>
          )}

          {/* Failure Indicators */}
          {part.failureIndicators.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-2">Signs Replacement is Needed</h3>
              <ul className="space-y-1">
                {part.failureIndicators.map((indicator, index) => (
                  <li key={index} className="text-slate-400 text-sm flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    {indicator}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 p-4 flex gap-3">
          <button
            onClick={() => toggleShoppingList(part.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
              shoppingList.includes(part.id)
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {shoppingList.includes(part.id) ? (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Added to List
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add to Shopping List
              </>
            )}
          </button>
          <button className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-3 rounded-lg font-medium transition-colors">
            Request Quote
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Parts Catalog
        </h2>
        <p className="text-slate-400 mb-2">
          Find genuine and aftermarket parts with pricing and availability
        </p>
        <p className="text-cyan-400 text-sm">
          <span className="text-amber-400 font-bold">1,560+ parts</span> in database • Prices in Kenya Shillings (KES)
        </p>
        <a
          href="/generators/spare-parts"
          className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg text-sm transition-colors border border-cyan-500/30"
        >
          <span>Open Full Parts Catalog</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Popular Searches */}
      {!searchQuery && !selectedSystem && (
        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
          <p className="text-slate-400 text-sm mb-3">Popular searches:</p>
          <div className="flex flex-wrap gap-2">
            {['oil filter', 'fuel filter', 'water pump', 'starter motor', 'AVR', 'injector', 'thermostat', 'belts'].map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="px-3 py-1.5 bg-slate-700/50 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 rounded-lg text-sm transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Shopping List Summary */}
      {shoppingList.length > 0 && (
        <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-emerald-400 font-medium">
              {shoppingList.length} items in shopping list
            </span>
          </div>
          <button
            onClick={() => setShoppingList([])}
            className="text-slate-400 hover:text-white text-sm"
          >
            Clear List
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by part name, number, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
        />
      </div>

      {/* System Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedSystem(null)}
          className={`px-4 py-2 rounded-lg text-sm transition-all ${
            selectedSystem === null
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
          }`}
        >
          All Parts
        </button>
        {systems.map((sys) => (
          <button
            key={sys.id}
            onClick={() => setSelectedSystem(sys.id)}
            className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
              selectedSystem === sys.id
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
            }`}
          >
            <span>{sys.icon}</span>
            {sys.name}
          </button>
        ))}
      </div>

      {/* Parts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredParts.map((part) => (
            <motion.div
              key={part.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer group"
              onClick={() => setSelectedPart(part)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {part.name}
                  </h3>
                  <p className="text-cyan-400 font-mono text-sm">{part.partNumber}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleShoppingList(part.id);
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    shoppingList.includes(part.id)
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {shoppingList.includes(part.id) ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </button>
              </div>

              <p className="text-slate-400 text-sm line-clamp-2 mb-3">{part.description}</p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                <div>
                  <span className="text-slate-500 text-xs block">Price Range</span>
                  <span className="text-amber-400 font-mono text-sm">
                    KES {part.priceRange.min.toLocaleString()}+
                  </span>
                </div>
                <span
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: `${availabilityColors[part.availability]}20`,
                    color: availabilityColors[part.availability]
                  }}
                >
                  {availabilityLabels[part.availability]}
                </span>
              </div>

              {part.oem && (
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                  OEM
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredParts.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-slate-400 mb-4">No quick-search results for &quot;{searchQuery}&quot;</p>
          <p className="text-slate-500 text-sm mb-4">
            Try: oil filter, fuel filter, water pump, thermostat, starter, AVR, injector
          </p>
          <p className="text-amber-400 text-sm mb-4">
            Our full catalog has <span className="font-bold">1,560+ parts</span> - search there for more options!
          </p>
          <a
            href="/generators/spare-parts"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-cyan-500/20"
          >
            <span>Search Full 1,560+ Parts Catalog</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      )}

      {/* Link to Full Catalog */}
      {filteredParts.length > 0 && (
        <div className="text-center pt-6 border-t border-slate-700/50">
          <p className="text-slate-400 text-sm mb-3">
            Quick search showing {filteredParts.length} common parts • <span className="text-amber-400">Full catalog: 1,560+ parts</span>
          </p>
          <a
            href="/generators/spare-parts"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-cyan-500/20"
          >
            <span>Browse Complete 1,560+ Parts Catalog</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <p className="text-slate-500 text-xs mt-3">
            Or call for parts: <a href="tel:+254768860665" className="text-amber-400 hover:text-amber-300 font-medium">+254 768 860 665</a>
          </p>
        </div>
      )}

      {/* Part Detail Modal */}
      <AnimatePresence>
        {selectedPart && (
          <PartDetailModal
            part={selectedPart}
            onClose={() => setSelectedPart(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
