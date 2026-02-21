'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { allControllerErrorCodes } from '@/app/data/diagnostic/allControllerErrorCodes';

interface FaultCode {
  code: string;
  model: string;
  service: string;
  category: string;
  issue: string;
  symptoms: string;
  causes: string[];
  solution: string;
  severity: string;
}

export default function AerospaceFaultCodeLookup() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<'all' | 'PowerWizard' | 'DeepSea'>('all');
  const [results, setResults] = useState<FaultCode[]>([]);
  const [selectedFault, setSelectedFault] = useState<FaultCode | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const brands = ['all', 'PowerWizard', 'DeepSea'];

  const handleSearch = () => {
    setIsScanning(true);
    
    setTimeout(() => {
      const filtered = allControllerErrorCodes.filter((code) => {
        const matchesBrand = selectedBrand === 'all' || code.model.includes(selectedBrand);
        const matchesQuery = searchQuery === '' || 
          code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          code.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
          code.symptoms.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesBrand && matchesQuery;
      });

      setResults(filtered.slice(0, 50) as FaultCode[]); // Limit to 50 results
      setIsScanning(false);
    }, 800);
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      handleSearch();
    } else {
      setResults([]);
    }
  }, [searchQuery, selectedBrand]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'HIGH': return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      case 'MED': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'LOW': return 'text-green-400 bg-green-500/20 border-green-500/50';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <div className="border-b border-cyan-500/30 bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-2 border-cyan-500 bg-cyan-500/10 flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-widest text-cyan-400">
                FAULT CODE DATABASE
              </h1>
              <p className="text-sm text-gray-400">
                SEARCH 4,000+ MANUFACTURER-SPECIFIC CODES
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-12 gap-6">
          
          {/* Search Panel */}
          <div className="col-span-4">
            <div className="border border-cyan-500/30 bg-black/50 backdrop-blur-sm sticky top-8">
              <div className="bg-cyan-500/10 border-b border-cyan-500/30 px-4 py-3">
                <h2 className="text-sm font-bold tracking-wider text-cyan-400">SEARCH PARAMETERS</h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Brand Selection */}
                <div>
                  <label className="text-xs text-gray-400 mb-3 block">CONTROLLER BRAND</label>
                  <div className="grid grid-cols-3 gap-2">
                    {brands.map(brand => (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand as any)}
                        className={`py-2 px-3 text-xs font-bold border transition-all ${
                          selectedBrand === brand
                            ? 'bg-cyan-500/30 border-cyan-500 text-cyan-400'
                            : 'bg-gray-900/50 border-gray-700 text-gray-400 hover:border-cyan-500/50'
                        }`}
                      >
                        {brand.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Input */}
                <div>
                  <label className="text-xs text-gray-400 mb-3 block">FAULT CODE OR SYMPTOM</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter code (e.g., PW10-100) or symptom..."
                      className="w-full bg-gray-900/50 border border-cyan-500/30 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-all"
                    />
                    {isScanning && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Database Stats */}
                <div className="border border-purple-500/30 bg-purple-500/5 p-4">
                  <div className="text-xs text-purple-400 mb-3 font-bold">DATABASE STATUS</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">PowerWizard:</span>
                      <span className="text-cyan-400 font-bold">2,000 codes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">DeepSea:</span>
                      <span className="text-green-400 font-bold">2,000 codes</span>
                    </div>
                    <div className="border-t border-purple-500/30 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Results Found:</span>
                        <span className="text-yellow-400 font-bold">{results.length}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Severity Legend */}
                <div className="border border-orange-500/30 bg-orange-500/5 p-4">
                  <div className="text-xs text-orange-400 mb-3 font-bold">SEVERITY LEVELS</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="text-xs text-gray-400">CRITICAL - Immediate action required</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full" />
                      <span className="text-xs text-gray-400">HIGH - Urgent attention needed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span className="text-xs text-gray-400">MEDIUM - Monitor closely</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-xs text-gray-400">LOW - Routine maintenance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="col-span-8">
            {results.length === 0 && searchQuery.length === 0 ? (
              <div className="border border-cyan-500/30 bg-black/50 backdrop-blur-sm p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl text-cyan-400 font-bold mb-2">READY FOR DIAGNOSTIC SCAN</h3>
                <p className="text-gray-400 text-sm">
                  Enter a fault code or symptom to search 230,000+ error codes
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="border border-cyan-500/30 bg-cyan-500/5 p-4">
                    <div className="text-2xl font-bold text-cyan-400">2,000</div>
                    <div className="text-xs text-gray-400">PowerWizard Codes</div>
                  </div>
                  <div className="border border-green-500/30 bg-green-500/5 p-4">
                    <div className="text-2xl font-bold text-green-400">2,000</div>
                    <div className="text-xs text-gray-400">DeepSea Codes</div>
                  </div>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="border border-red-500/30 bg-black/50 backdrop-blur-sm p-12 text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl text-red-400 font-bold mb-2">NO FAULTS DETECTED</h3>
                <p className="text-gray-400 text-sm">
                  No matching codes found. Try different search terms or select a different brand.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border border-green-500/30 bg-green-500/10 px-4 py-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-green-400">
                    {results.length} FAULT{results.length !== 1 ? 'S' : ''} DETECTED
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-green-400">SCAN COMPLETE</span>
                  </div>
                </div>

                {results.map((fault, index) => (
                  <motion.div
                    key={`${fault.code}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-cyan-500/30 bg-black/50 backdrop-blur-sm overflow-hidden cursor-pointer hover:border-cyan-500 transition-all"
                    onClick={() => setSelectedFault(fault)}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`px-3 py-1 border text-xs font-bold ${getSeverityColor(fault.severity)}`}>
                            {fault.severity}
                          </div>
                          <div>
                            <div className="text-lg font-bold text-cyan-400">{fault.code}</div>
                            <div className="text-xs text-gray-400">{fault.model}</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">{fault.category}</div>
                      </div>

                      <div className="text-sm text-white font-bold mb-2">{fault.issue}</div>
                      <div className="text-xs text-gray-400 line-clamp-2">{fault.symptoms}</div>

                      <button className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2">
                        VIEW FULL DIAGNOSTIC →
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedFault && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={() => setSelectedFault(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 border-2 border-cyan-500 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-cyan-500/20 border-b-2 border-cyan-500 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h2 className="text-3xl font-bold text-cyan-400">{selectedFault.code}</h2>
                      <div className={`px-3 py-1 border text-xs font-bold ${getSeverityColor(selectedFault.severity)}`}>
                        {selectedFault.severity}
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">{selectedFault.model} • {selectedFault.category}</div>
                  </div>
                  <button
                    onClick={() => setSelectedFault(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm text-orange-400 font-bold mb-2">ISSUE DESCRIPTION</h3>
                  <p className="text-white">{selectedFault.issue}</p>
                </div>

                <div>
                  <h3 className="text-sm text-yellow-400 font-bold mb-2">SYMPTOMS</h3>
                  <p className="text-gray-300 text-sm">{selectedFault.symptoms}</p>
                </div>

                <div>
                  <h3 className="text-sm text-red-400 font-bold mb-2">POSSIBLE CAUSES</h3>
                  <ul className="space-y-2">
                    {selectedFault.causes.map((cause, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-red-400 mt-1">•</span>
                        <span className="text-gray-300 text-sm">{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm text-green-400 font-bold mb-2">RECOMMENDED SOLUTION</h3>
                  <div className="text-gray-300 text-sm whitespace-pre-line bg-black/50 border border-green-500/30 p-4">
                    {selectedFault.solution}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500 py-3 text-cyan-400 font-bold transition-all">
                    DISPATCH TECHNICIAN
                  </button>
                  <button className="flex-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500 py-3 text-green-400 font-bold transition-all">
                    ORDER PARTS
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD Corners */}
      <div className="fixed top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-500/30 pointer-events-none" />
      <div className="fixed top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-500/30 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan-500/30 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-500/30 pointer-events-none" />
    </div>
  );
}
