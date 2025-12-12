'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface SearchResult {
  title: string;
  url: string;
  description: string;
  category: string;
}

const searchData: SearchResult[] = [
  // Pages
  { title: "Home", url: "/", description: "Premium power engineering homepage", category: "Page" },
  { title: "Services", url: "/service", description: "Ten comprehensive service chapters", category: "Page" },
  { title: "Solutions", url: "/solution", description: "Engineering solutions and guides", category: "Page" },
  { title: "Generators", url: "/generators", description: "Cummins generators from 20kVA to 2000kVA", category: "Page" },
  { title: "Solar", url: "/solar", description: "Solar energy solutions and calculators", category: "Page" },
  { title: "Diagnostics", url: "/diagnostics", description: "Universal diagnostic machine and tools", category: "Page" },
  { title: "Contact", url: "/contact", description: "Get in touch with our team", category: "Page" },
  { title: "About Us", url: "/about-us", description: "Learn about EmersonEIMS", category: "Page" },
  
  // Services
  { title: "Diesel Generators", url: "/service#diesel", description: "Generator installation, maintenance, and repair", category: "Service" },
  { title: "Solar Energy", url: "/service#solar", description: "Solar panel installation and maintenance", category: "Service" },
  { title: "UPS Systems", url: "/service#ups", description: "Uninterruptible power supply systems", category: "Service" },
  { title: "High Voltage", url: "/service#hv", description: "High voltage infrastructure solutions", category: "Service" },
  { title: "Motor Rewinding", url: "/service#motor", description: "Motor repair and rewinding services", category: "Service" },
  { title: "Water Systems", url: "/service#water", description: "Borehole pumps and water systems", category: "Service" },
  { title: "HVAC Systems", url: "/service#hvac", description: "Air conditioning and ventilation", category: "Service" },
  { title: "Incinerators", url: "/service#incin", description: "Waste management and incineration", category: "Service" },
  
  // Solutions
  { title: "Generator Solutions", url: "/solutions/generators", description: "Generator troubleshooting and solutions", category: "Solution" },
  { title: "Solar Sizing", url: "/solutions/solar-sizing", description: "Calculate optimal solar system size", category: "Solution" },
  { title: "Power Interruptions", url: "/solutions/power-interruptions", description: "Solutions for power outages", category: "Solution" },
  { title: "AC Systems", url: "/solutions/ac", description: "Air conditioning solutions", category: "Solution" },
  { title: "UPS Solutions", url: "/solutions/ups", description: "UPS system solutions", category: "Solution" },
];

export default function SiteSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = searchData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.slice(0, 8));
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-all"
        aria-label="Search"
      >
        <span>🔍</span>
        <span className="text-sm">Search</span>
        <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold text-gray-500 bg-gray-800 border border-gray-700 rounded">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl mx-4 z-50"
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
            >
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="p-4 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔍</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search pages, services, solutions..."
                      className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
                    />
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label="Close search"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-y-auto">
                  {results.length > 0 ? (
                    <div className="p-2">
                      {results.map((result, index) => (
                        <Link
                          key={index}
                          href={result.url}
                          onClick={() => setIsOpen(false)}
                          className="block p-3 rounded-lg hover:bg-gray-800 transition-colors group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-white font-semibold group-hover:text-amber-400 transition-colors">
                                  {result.title}
                                </h3>
                                <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded border border-amber-500/30">
                                  {result.category}
                                </span>
                              </div>
                              <p className="text-sm text-gray-400">{result.description}</p>
                            </div>
                            <span className="text-gray-600 group-hover:text-amber-400 transition-colors">→</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : query.trim().length > 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      <p>No results found for "{query}"</p>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-400">
                      <p>Start typing to search...</p>
                      <p className="text-sm mt-2">Try: generators, solar, diagnostics</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-gray-800 bg-gray-900/50">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>↑↓ Navigate</span>
                      <span>↵ Select</span>
                      <span>Esc Close</span>
                    </div>
                    <span>{results.length} results</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

