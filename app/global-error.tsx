'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Send error to Sentry for production monitoring
    Sentry.captureException(error, {
      tags: {
        errorType: 'global-error',
        digest: error.digest || 'unknown',
      },
      extra: {
        componentStack: error.stack,
      },
    });
    
    // Also log to console for development
    console.error('Application error:', error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-black text-white">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-lg text-center">
            {/* Error Icon */}
            <div className="w-24 h-24 mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-600 rounded-full animate-pulse opacity-30" />
              <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
                <svg 
                  className="w-12 h-12 text-red-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-4xl font-bold mb-4">
              Something Went <span className="text-red-500">Wrong</span>
            </h1>
            
            <p className="text-gray-400 mb-8">
              We apologize for the inconvenience. Our team has been notified and 
              is working to fix this issue.
            </p>

            {/* Error Details (Dev only) */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mb-8 text-left bg-gray-900/50 rounded-lg p-4">
                <summary className="cursor-pointer text-orange-500 font-semibold">
                  Technical Details
                </summary>
                <pre className="mt-4 text-xs text-gray-400 overflow-auto">
                  {error.message}
                  {error.digest && `\nDigest: ${error.digest}`}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={reset}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
              
              <Link
                href="/"
                className="px-8 py-3 bg-gray-800 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Go to Homepage
              </Link>
            </div>

            {/* Contact Support */}
            <div className="mt-12 pt-8 border-t border-gray-800">
              <p className="text-gray-500 mb-4">Need immediate assistance?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                <a 
                  href="tel:0768860655" 
                  className="text-orange-500 hover:text-orange-400"
                >
                  📞 0768 860 655
                </a>
                <span className="hidden sm:inline text-gray-700">|</span>
                <a 
                  href="tel:0782914717" 
                  className="text-orange-500 hover:text-orange-400"
                >
                  📞 0782914717
                </a>
                <span className="hidden sm:inline text-gray-700">|</span>
                <a 
                  href="https://wa.me/254768860655" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:text-green-400"
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
