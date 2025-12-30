'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Page not found</p>
        <Link href="/" className="px-6 py-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-600 transition-all">
          Go Home
        </Link>
      </div>
    </div>
  );
}

