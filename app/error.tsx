'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Send to Sentry
    Sentry.captureException(error, {
      tags: { errorType: 'page-error' },
    });
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        {/* Error Animation */}
        <div className="w-20 h-20 mx-auto mb-8 relative">
          <div className="absolute inset-0 border-4 border-orange-500/30 rounded-full animate-ping" />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">⚠️</span>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-4">
          Oops! <span className="text-orange-500">Error</span>
        </h2>
        
        <p className="text-gray-400 mb-8">
          Something unexpected happened. Please try again or contact us if the problem persists.
        </p>

        {/* Dev-only error details */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-left">
            <p className="text-red-400 text-sm font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg font-semibold hover:opacity-90 transition"
          >
            🔄 Try Again
          </button>
          
          <Link
            href="/"
            className="px-6 py-3 bg-gray-800 rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            🏠 Go Home
          </Link>
        </div>

        {/* Quick Contact */}
        <p className="mt-8 text-gray-500 text-sm">
          Need help? Call{' '}
          <a href="tel:+254768860665" className="text-orange-500 hover:underline">
            +254 768 860 665
          </a>
        </p>
      </div>
    </div>
  );
}
