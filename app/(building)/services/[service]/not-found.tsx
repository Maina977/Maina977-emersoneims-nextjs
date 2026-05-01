/**
 * Service Not Found Page
 * Shown when a service slug doesn't match any service
 */

import Link from 'next/link';

export default function ServiceNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <div className="text-8xl mb-6">&#128533;</div>
        <h1 className="text-4xl font-bold text-white mb-4">Service Not Found</h1>
        <p className="text-slate-400 text-lg mb-8">
          The service you're looking for doesn't exist or may have been moved.
          Please check our available services below.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/services"
            className="px-6 py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-400 transition-all"
          >
            View All Services
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border-2 border-slate-600 text-white font-semibold rounded-lg hover:border-cyan-500 transition-all"
          >
            Go Home
          </Link>
        </div>

        {/* Quick Contact */}
        <div className="mt-12 p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
          <p className="text-slate-400 mb-4">Need help finding what you're looking for?</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="tel:+254768860665"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Call: +254 768 860 665
            </a>
            <span className="hidden sm:inline text-slate-600">|</span>
            <a
              href="https://wa.me/254768860665"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
