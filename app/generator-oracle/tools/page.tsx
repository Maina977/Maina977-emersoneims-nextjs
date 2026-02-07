'use client';

/**
 * Generator Oracle Tools - Redirect
 * This page has been merged into the main Generator Oracle page.
 * Redirects to /generator-oracle for backwards compatibility.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GeneratorOracleToolsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main Generator Oracle page with simulator tab
    router.replace('/generator-oracle');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-4xl mb-4">🔄</div>
        <h1 className="text-xl font-bold text-white mb-2">Redirecting...</h1>
        <p className="text-slate-400">
          The Tools page has been merged into Generator Oracle.
        </p>
        <p className="text-amber-400 mt-4">
          Taking you to the full diagnostic suite...
        </p>
      </div>
    </div>
  );
}
