// components/diagnostics/FaultCodeLookup.tsx
// COMPREHENSIVE FAULT CODE LOOKUP - Integrates WordPress + New Database
'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassmorphicCard from '@/components/effects/GlassmorphicCard';

// Import all error code databases
import comprehensiveErrorCodes from '@/app/data/diagnostic/comprehensiveErrorCodes.json';
import { brandSpecificErrorCodes } from '@/app/data/diagnostic/brandSpecificErrorCodes';
import wordpressDetailedCodes from '@/app/data/diagnostic/wordpressDetailedFaultCodes.json';

interface FaultCodeResult {
  brand?: string;
  model?: string;
  code: string;
  service?: string;
  category?: string;
  issue: string;
  symptom?: string;
  severity: string;
  symptoms?: string[];
  causes: string[];
  solution: string;
  detailedFix?: string;
  parts: string[];
  tools: string[];
  downtime?: string;
  estimatedTime?: string;
  estimatedCost?: any;
  preventive?: string;
  preventiveMaintenance?: string;
  safetyWarnings?: string[];
  relatedCodes?: string[];
  expertTips?: string;
  videoGuide?: string;
  pdfManual?: string;
  emergencyContact?: string;
}

export default function FaultCodeLookup() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'code' | 'symptom' | 'brand'>('code');
  const [selectedBrand, setSelectedBrand] = useState<string>('All Brands');
  const [selectedResult, setSelectedResult] = useState<FaultCodeResult | null>(null);

  // Combine all databases
  const allCodes = useMemo(() => {
    const combined: FaultCodeResult[] = [];
    
    // Add comprehensive codes
    comprehensiveErrorCodes.forEach((error: any) => {
      combined.push({
        code: error.code,
        service: error.service,
        issue: error.issue,
        severity: error.severity,
        symptoms: error.symptoms || [],
        causes: error.causes || [],
        solution: error.solution,
        parts: error.parts || [],
        tools: error.tools || [],
        downtime: error.downtime,
        preventive: error.preventive
      });
    });

    // Add brand-specific codes
    brandSpecificErrorCodes.forEach((error: any) => {
      combined.push({
        brand: error.brand,
        model: error.model,
        code: error.code,
        service: error.service,
        category: error.category,
        issue: error.issue,
        severity: error.severity,
        symptoms: error.symptoms || [],
        causes: error.causes || [],
        solution: error.solution,
        parts: error.parts || [],
        tools: error.tools || [],
        downtime: error.downtime,
        preventive: error.preventive
      });
    });

    // Add WordPress detailed codes
    wordpressDetailedCodes.forEach((error: any) => {
      combined.push({
        brand: error.brand,
        model: error.model,
        code: error.code,
        category: error.category,
        issue: error.symptom,
        symptom: error.symptom,
        severity: error.severity,
        symptoms: [error.symptom],
        causes: error.causes || [],
        solution: error.detailedFix || error.fix,
        detailedFix: error.detailedFix,
        parts: error.parts || [],
        tools: error.tools || [],
        estimatedTime: error.estimatedTime,
        estimatedCost: error.estimatedCost,
        preventiveMaintenance: error.preventiveMaintenance,
        safetyWarnings: error.safetyWarnings,
        relatedCodes: error.relatedCodes,
        expertTips: error.expertTips,
        videoGuide: error.videoGuide,
        pdfManual: error.pdfManual,
        emergencyContact: error.emergencyContact
      });
    });

    return combined;
  }, []);

  // Get unique brands
  const brands = useMemo(() => {
    const brandSet = new Set<string>();
    brandSet.add('All Brands');
    allCodes.forEach(code => {
      if (code.brand) brandSet.add(code.brand);
    });
    return Array.from(brandSet);
  }, [allCodes]);

  // Search and filter
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase().trim();
    
    return allCodes.filter(code => {
      // Brand filter
      if (selectedBrand !== 'All Brands' && code.brand !== selectedBrand) {
        return false;
      }

      // Search type filter
      switch (searchType) {
        case 'code':
          return code.code.toLowerCase().includes(query);
        case 'symptom':
          const symptomMatch = 
            code.issue.toLowerCase().includes(query) ||
            (code.symptom && code.symptom.toLowerCase().includes(query)) ||
            (code.symptoms && code.symptoms.some(s => s.toLowerCase().includes(query)));
          return symptomMatch;
        case 'brand':
          return code.brand?.toLowerCase().includes(query) ||
                 code.model?.toLowerCase().includes(query);
        default:
          return false;
      }
    }).slice(0, 20); // Limit to 20 results
  }, [searchQuery, searchType, selectedBrand, allCodes]);

  const getSeverityColor = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'CRITICAL': return 'from-red-600 to-red-700';
      case 'HIGH': return 'from-orange-500 to-orange-600';
      case 'MED':
      case 'MEDIUM': return 'from-amber-500 to-amber-600';
      case 'LOW': return 'from-cyan-500 to-cyan-600';
      default: return 'from-green-500 to-green-600';
    }
  };

  const getSeverityBorder = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'CRITICAL': return 'border-red-500';
      case 'HIGH': return 'border-orange-500';
      case 'MED':
      case 'MEDIUM': return 'border-amber-500';
      case 'LOW': return 'border-cyan-500';
      default: return 'border-green-500';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Fault Code Lookup
          </h1>
          <p className="text-xl text-gray-400">
            Search 9,500+ error codes across all major generator brands
          </p>
          <div className="mt-4 flex justify-center gap-4 text-sm">
            <span className="px-4 py-2 bg-cyan-500/20 rounded-full text-cyan-300">
              {allCodes.length} Total Codes
            </span>
            <span className="px-4 py-2 bg-purple-500/20 rounded-full text-purple-300">
              {brands.length - 1} Brands
            </span>
            <span className="px-4 py-2 bg-amber-500/20 rounded-full text-amber-300">
              100% Verified Solutions
            </span>
          </div>
        </motion.div>

        {/* Search Controls */}
        <GlassmorphicCard intensity="medium" className="p-8 mb-8">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Search Type */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Search By</label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as any)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
              >
                <option value="code">Error Code</option>
                <option value="symptom">Symptom</option>
                <option value="brand">Brand/Model</option>
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Brand Filter</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
              >
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                {searchType === 'code' ? 'Enter Error Code' :
                 searchType === 'symptom' ? 'Describe Symptom' :
                 'Enter Brand/Model'}
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  searchType === 'code' ? 'e.g., 1234, P0216, E350' :
                  searchType === 'symptom' ? 'e.g., overheating, low pressure' :
                  'e.g., Cummins, Perkins'
                }
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* Quick Examples */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-500">Quick search:</span>
            {['1234', 'P0216', 'E350', 'overheating', 'low oil pressure'].map(example => (
              <button
                key={example}
                onClick={() => {
                  setSearchQuery(example);
                  setSearchType(example.match(/[a-z]/i) && !example.includes('oil') ? 'code' : 'symptom');
                }}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs text-gray-400 hover:text-white transition"
              >
                {example}
              </button>
            ))}
          </div>
        </GlassmorphicCard>

        {/* Results */}
        <AnimatePresence mode="wait">
          {searchQuery && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Results List */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">
                  {searchResults.length} Result{searchResults.length !== 1 ? 's' : ''} Found
                </h2>
                {searchResults.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedResult(result)}
                    className={`cursor-pointer bg-white/5 hover:bg-white/10 rounded-xl p-4 border-l-4 transition-all ${
                      selectedResult === result ? 'border-cyan-500 bg-white/10' : getSeverityBorder(result.severity)
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-mono text-lg font-bold text-cyan-400">
                          {result.brand && `${result.brand} `}
                          {result.code}
                        </div>
                        {result.model && (
                          <div className="text-xs text-gray-400">Model: {result.model}</div>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getSeverityColor(result.severity)} text-white`}>
                        {result.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">{result.issue}</p>
                  </motion.div>
                ))}
              </div>

              {/* Detailed View */}
              {selectedResult && (
                <motion.div
                  key={selectedResult.code}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="sticky top-6"
                >
                  <GlassmorphicCard intensity="heavy" className="p-6">
                    {/* Header */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-bold">
                          {selectedResult.brand && `${selectedResult.brand} `}
                          {selectedResult.code}
                        </h3>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${getSeverityColor(selectedResult.severity)} text-white`}>
                          {selectedResult.severity}
                        </span>
                      </div>
                      {selectedResult.model && (
                        <div className="text-sm text-gray-400 mb-2">Model: {selectedResult.model}</div>
                      )}
                      {selectedResult.category && (
                        <div className="text-sm text-cyan-400">Category: {selectedResult.category}</div>
                      )}
                    </div>

                    {/* Issue */}
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-red-400 mb-2">Issue:</h4>
                      <p className="text-gray-200">{selectedResult.issue}</p>
                    </div>

                    {/* Symptoms */}
                    {selectedResult.symptoms && selectedResult.symptoms.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-bold text-orange-400 mb-2">Symptoms:</h4>
                        <ul className="space-y-1">
                          {selectedResult.symptoms.map((symptom, i) => (
                            <li key={i} className="text-sm text-gray-300 flex items-start">
                              <span className="text-orange-500 mr-2">▸</span>
                              <span>{symptom}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Causes */}
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-yellow-400 mb-2">Causes:</h4>
                      <ul className="space-y-1">
                        {selectedResult.causes.map((cause, i) => (
                          <li key={i} className="text-sm text-gray-300 flex items-start">
                            <span className="text-yellow-500 mr-2">▸</span>
                            <span>{cause}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Solution */}
                    <div className="mb-6 bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                      <h4 className="text-lg font-bold text-green-400 mb-2">✓ Solution:</h4>
                      {selectedResult.detailedFix ? (
                        <pre className="text-sm text-gray-200 whitespace-pre-wrap font-sans">
                          {selectedResult.detailedFix}
                        </pre>
                      ) : (
                        <p className="text-sm text-gray-200">{selectedResult.solution}</p>
                      )}
                    </div>

                    {/* Parts Required */}
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-cyan-400 mb-2">Parts Required:</h4>
                      <ul className="space-y-1">
                        {selectedResult.parts.map((part, i) => (
                          <li key={i} className="text-sm text-gray-300 bg-white/5 rounded px-3 py-1">
                            {part}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tools Needed */}
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-purple-400 mb-2">Tools Needed:</h4>
                      <ul className="space-y-1">
                        {selectedResult.tools.map((tool, i) => (
                          <li key={i} className="text-sm text-gray-300 bg-white/5 rounded px-3 py-1">
                            {tool}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Safety Warnings */}
                    {selectedResult.safetyWarnings && selectedResult.safetyWarnings.length > 0 && (
                      <div className="mb-6 bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                        <h4 className="text-lg font-bold text-red-400 mb-2">⚠️ Safety Warnings:</h4>
                        <ul className="space-y-1">
                          {selectedResult.safetyWarnings.map((warning, i) => (
                            <li key={i} className="text-sm text-red-200 flex items-start">
                              <span className="text-red-500 mr-2">!</span>
                              <span>{warning}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Estimated Time & Cost */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {(selectedResult.downtime || selectedResult.estimatedTime) && (
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-xs text-gray-400">Estimated Time</div>
                          <div className="text-lg font-bold text-white">
                            {selectedResult.estimatedTime || selectedResult.downtime}
                          </div>
                        </div>
                      )}
                      {selectedResult.estimatedCost && (
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-xs text-gray-400">Estimated Cost</div>
                          <div className="text-sm font-bold text-white">
                            {typeof selectedResult.estimatedCost === 'object' 
                              ? selectedResult.estimatedCost.total 
                              : selectedResult.estimatedCost}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expert Tips */}
                    {selectedResult.expertTips && (
                      <div className="mb-6 bg-amber-500/10 rounded-lg p-4 border border-amber-500/30">
                        <h4 className="text-lg font-bold text-amber-400 mb-2">💡 Expert Tips:</h4>
                        <p className="text-sm text-gray-200">{selectedResult.expertTips}</p>
                      </div>
                    )}

                    {/* Related Codes */}
                    {selectedResult.relatedCodes && selectedResult.relatedCodes.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-bold text-gray-400 mb-2">Related Codes:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedResult.relatedCodes.map((code, i) => (
                            <span key={i} className="text-xs bg-white/10 px-3 py-1 rounded text-gray-300">
                              {code}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resources */}
                    <div className="flex gap-3">
                      {selectedResult.videoGuide && (
                        <a
                          href={selectedResult.videoGuide}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm font-semibold text-center transition"
                        >
                          📹 Video Guide
                        </a>
                      )}
                      {selectedResult.pdfManual && (
                        <a
                          href={selectedResult.pdfManual}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm font-semibold text-center transition"
                        >
                          📄 Manual
                        </a>
                      )}
                    </div>

                    {/* Emergency Contact */}
                    {selectedResult.emergencyContact && (
                      <div className="mt-6 pt-6 border-t border-white/10 text-center">
                        <div className="text-sm text-gray-400 mb-2">Need immediate help?</div>
                        <a 
                          href={`tel:${selectedResult.emergencyContact.replace(/\D/g, '')}`}
                          className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:scale-105 transition-transform"
                        >
                          📞 {selectedResult.emergencyContact}
                        </a>
                      </div>
                    )}
                  </GlassmorphicCard>
                </motion.div>
              )}
            </motion.div>
          )}

          {searchQuery && searchResults.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">No results found</h3>
              <p className="text-gray-400 mb-6">
                Try a different search term or contact our technical team
              </p>
              <a
                href="tel:+254768860665"
                className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:scale-105 transition-transform"
              >
                📞 Call Technical Support
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
