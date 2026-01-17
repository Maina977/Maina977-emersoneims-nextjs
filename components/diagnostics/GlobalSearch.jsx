'use client';

import { useState } from 'react';
import comprehensiveErrorCodes from '@/app/data/diagnostic/comprehensiveErrorCodes.json';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const results = comprehensiveErrorCodes.filter(
    e =>
      e.code.toLowerCase().includes(query.toLowerCase()) ||
      e.issue.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search error codes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-gray-200"
      />
      {query && (
        <ul className="mt-2 space-y-1">
          {results.map((e, idx) => (
            <li key={idx} className="text-sm text-gray-300">
              {e.code} — {e.issue} ({e.severity})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
