'use client'

import { Suspense, lazy } from 'react';

// Import the Ultimate Diagnostic Module
const UltimateDiagnosticModule = lazy(() => import('@/components/diagnostics/UltimateDiagnosticModule'));

/**
 * Generator Diagnostic BIBLE
 * The World's Most Comprehensive Generator Troubleshooting System
 *
 * Features:
 * - 13,500+ Error Codes across all major brands
 * - Works 100% OFFLINE
 * - Step-by-step solutions for engineers AND laymen
 * - Tool recommendations with pricing
 * - Scheduled maintenance calculator
 * - Direct WhatsApp & phone support
 * - Accessible design
 */
export default function DiagnosticSuitePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white">Loading Diagnostic System...</h2>
          <p className="text-gray-400 mt-2">13,500+ error codes loading...</p>
        </div>
      </div>
    }>
      <UltimateDiagnosticModule />
    </Suspense>
  );
}

