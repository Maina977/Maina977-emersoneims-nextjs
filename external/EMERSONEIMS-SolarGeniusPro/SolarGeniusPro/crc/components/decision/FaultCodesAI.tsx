// MODULE 13: FAULT CODES AI
// Database of 1,200+ inverter error codes with semantic search
// Supports Deye, Solis, Growatt, etc.

import React, { useState, useCallback, useMemo } from 'react';
import faultCodesData from '../../data/fault-codes.json';

// Unwrap {faults:[...]} JSON shape — some catalogues use the wrapper, some are bare arrays.
const FAULT_CODES: FaultCode[] = Array.isArray(faultCodesData)
  ? (faultCodesData as unknown as FaultCode[])
  : (((faultCodesData as any)?.faults) as FaultCode[]) || [];

export interface FaultCode {
  code: string;
  brand: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical' | 'error';
  cause: string[];
  solution: string[];
  relatedCodes: string[];
  tags: string[];
}

interface SemanticSearchIndex {
  codeTokens: Map<string, Set<string>>;
  tagIndex: Map<string, Set<string>>;
  brandIndex: Map<string, Set<string>>;
}

class FaultCodeSearchEngine {
  private faultCodes: FaultCode[] = [];
  private searchIndex: SemanticSearchIndex;

  constructor(data: FaultCode[]) {
    // Normalise sparse entries — many real-world catalogues omit optional
    // fields (title/cause/relatedCodes/tags). Fill safe defaults so the
    // engine never crashes on `for (const t of fault.tags)`.
    this.faultCodes = (data || []).map((f) => ({
      code: f.code,
      brand: f.brand || 'Unknown',
      title: f.title || f.code,
      description: f.description || '',
      severity: f.severity || 'info',
      cause: Array.isArray(f.cause) ? f.cause : (f.cause ? [String(f.cause)] : []),
      solution: Array.isArray(f.solution) ? f.solution : (f.solution ? [String(f.solution)] : []),
      relatedCodes: Array.isArray(f.relatedCodes) ? f.relatedCodes : [],
      tags: Array.isArray(f.tags) ? f.tags : [],
    }));
    this.searchIndex = this.buildSearchIndex();
  }

  /**
   * Build semantic search index for fast lookups
   */
  private buildSearchIndex(): SemanticSearchIndex {
    const codeTokens = new Map<string, Set<string>>();
    const tagIndex = new Map<string, Set<string>>();
    const brandIndex = new Map<string, Set<string>>();

    for (const fault of this.faultCodes) {
      // Tokenize description and title for fuzzy matching
      const tokens = this.tokenize(`${fault.code} ${fault.title} ${fault.description}`);
      codeTokens.set(fault.code, new Set(tokens));

      // Index by tags
      for (const tag of fault.tags) {
        if (!tagIndex.has(tag)) tagIndex.set(tag, new Set());
        tagIndex.get(tag)!.add(fault.code);
      }

      // Index by brand
      if (!brandIndex.has(fault.brand)) brandIndex.set(fault.brand, new Set());
      brandIndex.get(fault.brand)!.add(fault.code);
    }

    return { codeTokens, tagIndex, brandIndex };
  }

  /**
   * Tokenize text for semantic search
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .split(/[\s\-_]+/)
      .filter(t => t.length > 2);
  }

  /**
   * Calculate Levenshtein distance for fuzzy matching
   */
  private levenshteinDistance(a: string, b: string): number {
    const m = a.length;
    const n = b.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }

    return dp[m][n];
  }

  /**
   * Semantic search for fault codes
   */
  search(query: string, brand?: string): FaultCode[] {
    const queryTokens = this.tokenize(query);
    const results: Array<{ fault: FaultCode; score: number }> = [];

    for (const fault of this.faultCodes) {
      // Filter by brand if specified
      if (brand && fault.brand.toLowerCase() !== brand.toLowerCase()) continue;

      let score = 0;

      // Exact code match (highest priority)
      if (fault.code.toLowerCase() === query.toLowerCase()) {
        score += 100;
      }

      // Fuzzy code match
      const codeDist = this.levenshteinDistance(fault.code.toLowerCase(), query.toLowerCase());
      if (codeDist <= 2) score += 80 - codeDist * 10;

      // Token matching in title
      for (const token of queryTokens) {
        if (fault.title.toLowerCase().includes(token)) score += 15;
      }

      // Token matching in description
      for (const token of queryTokens) {
        if (fault.description.toLowerCase().includes(token)) score += 5;
      }

      // Tag matching
      for (const tag of fault.tags) {
        if (queryTokens.some(t => tag.includes(t))) score += 10;
      }

      if (score > 0) {
        results.push({ fault, score });
      }
    }

    // Sort by relevance score descending
    return results.sort((a, b) => b.score - a.score).map(r => r.fault);
  }

  /**
   * Get all fault codes for a specific brand
   */
  getFaultsByBrand(brand: string): FaultCode[] {
    return this.faultCodes.filter(f => f.brand.toLowerCase() === brand.toLowerCase());
  }

  /**
   * Get related codes
   */
  getRelatedCodes(code: string): FaultCode[] {
    const fault = this.faultCodes.find(f => f.code === code);
    if (!fault) return [];

    return fault.relatedCodes
      .map(relatedCode => this.faultCodes.find(f => f.code === relatedCode))
      .filter(Boolean) as unknown as FaultCode[];
  }

  /**
   * Get all unique brands
   */
  getBrands(): string[] {
    return [...new Set(this.faultCodes.map(f => f.brand))].sort();
  }

  /**
   * Get all unique tags
   */
  getAllTags(): string[] {
    const tags = new Set<string>();
    for (const fault of this.faultCodes) {
      fault.tags.forEach(tag => tags.add(tag));
    }
    return Array.from(tags).sort();
  }
}

export const FaultCodesAI: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [results, setResults] = useState<FaultCode[]>([]);
  const [selectedFault, setSelectedFault] = useState<FaultCode | null>(null);

  const searchEngine = useMemo(() => {
    return new FaultCodeSearchEngine(FAULT_CODES);
  }, []);

  const brands = useMemo(() => searchEngine.getBrands(), [searchEngine]);
  const allTags = useMemo(() => searchEngine.getAllTags(), [searchEngine]);

  const handleSearch = useCallback(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchResults = searchEngine.search(query, selectedBrand || undefined);
    setResults(searchResults.slice(0, 20)); // Limit to 20 results
  }, [query, selectedBrand, searchEngine]);

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    const searchResults = searchEngine.search(tag, selectedBrand || undefined);
    setResults(searchResults.slice(0, 20));
  };

  // Auto-search as user types
  React.useEffect(() => {
    const timer = setTimeout(handleSearch, 300);
    return () => clearTimeout(timer);
  }, [query, selectedBrand, handleSearch]);

  return (
    <div className="fault-codes-container">
      <div className="fault-header">
        <h2>🔧 Fault Codes AI</h2>
        <p>Search 1,200+ error codes from all brands</p>
      </div>

      <div className="search-section">
        <div className="search-controls">
          <input
            type="text"
            placeholder="Enter fault code (e.g., F01) or symptom (e.g., overload)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="brand-filter"
          >
            <option value="">All Brands</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Tag Cloud for quick search */}
        <div className="tag-cloud">
          <span className="tag-label">Popular issues:</span>
          {['Overvoltage', 'Low voltage', 'Overload', 'Temperature', 'Communication'].map(tag => (
            <button
              key={tag}
              className="tag-btn"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="results-layout">
        {/* Search Results */}
        <div className="results-panel">
          <h3>Results ({results.length})</h3>
          {results.length > 0 ? (
            <div className="result-list">
              {results.map(fault => (
                <div
                  key={fault.code}
                  className={`result-item ${selectedFault?.code === fault.code ? 'active' : ''} severity-${fault.severity}`}
                  onClick={() => setSelectedFault(fault)}
                >
                  <div className="result-code">{fault.code}</div>
                  <div className="result-brand">{fault.brand}</div>
                  <div className="result-title">{fault.title}</div>
                  <div className="result-severity">
                    <span className={`severity-badge ${fault.severity}`}>
                      {fault.severity.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="empty-state">
              <p>No fault codes found for "{query}"</p>
              <p className="hint">Try different keywords or browse by brand</p>
            </div>
          ) : (
            <div className="empty-state">
              <p>Enter a fault code or symptom to search</p>
            </div>
          )}
        </div>

        {/* Detailed View */}
        {selectedFault && (
          <div className="detail-panel">
            <div className="detail-header">
              <h2>{selectedFault.code}</h2>
              <span className={`severity-badge ${selectedFault.severity}`}>
                {selectedFault.severity.toUpperCase()}
              </span>
            </div>

            <div className="detail-section">
              <h3>Brand</h3>
              <p className="brand-name">{selectedFault.brand}</p>
            </div>

            <div className="detail-section">
              <h3>Error Description</h3>
              <p>{selectedFault.description}</p>
            </div>

            <div className="detail-section">
              <h3>⚠️ Possible Causes</h3>
              <ul className="causes-list">
                {selectedFault.cause.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="detail-section">
              <h3>✅ Solutions & Troubleshooting</h3>
              <ol className="solutions-list">
                {selectedFault.solution.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>

            {selectedFault.tags.length > 0 && (
              <div className="detail-section">
                <h3>Tags</h3>
                <div className="tag-list">
                  {selectedFault.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Codes */}
            {selectedFault.relatedCodes.length > 0 && (
              <div className="detail-section">
                <h3>Related Codes</h3>
                <div className="related-codes">
                  {selectedFault.relatedCodes.map(code => (
                    <button
                      key={code}
                      className="related-code-btn"
                      onClick={() => {
                        setQuery(code);
                        setSelectedFault(
                          FAULT_CODES.find(f => f.code === code) || null
                        );
                      }}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="detail-actions">
              <button className="btn-download">📥 Download Repair Guide</button>
              <button className="btn-contact">📞 Contact Support</button>
            </div>
          </div>
        )}
      </div>

      <div className="fault-stats">
        <div className="stat">
          <div className="stat-number">{FAULT_CODES.length}</div>
          <div className="stat-label">Total Fault Codes</div>
        </div>
        <div className="stat">
          <div className="stat-number">{brands.length}</div>
          <div className="stat-label">Supported Brands</div>
        </div>
        <div className="stat">
          <div className="stat-number">{allTags.length}</div>
          <div className="stat-label">Unique Issues</div>
        </div>
      </div>
    </div>
  );
};

export default FaultCodesAI;
export { FaultCodeSearchEngine };
