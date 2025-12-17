'use client';

/**
 * LIVE VISITOR COUNT
 * Shows real-time visitor count for social proof
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveVisitorCountProps {
  currentPage?: string;
}

export default function LiveVisitorCount({ currentPage }: LiveVisitorCountProps) {
  const [visitorCount, setVisitorCount] = useState(0);
  const [recentPurchases, setRecentPurchases] = useState<string[]>([]);

  useEffect(() => {
    // Simulate live visitor count (replace with real API)
    const interval = setInterval(() => {
      const count = Math.floor(Math.random() * 50) + 10;
      setVisitorCount(count);
    }, 5000);

    // Simulate recent purchases
    const purchaseInterval = setInterval(() => {
      const purchases = [
        'John from Nairobi just purchased a 100kVA Generator',
        'Sarah from Mombasa requested a Solar quote',
        'Mike from Kisumu booked a consultation',
      ];
      const randomPurchase = purchases[Math.floor(Math.random() * purchases.length)];
      setRecentPurchases((prev) => [randomPurchase, ...prev.slice(0, 2)]);
    }, 15000);

    return () => {
      clearInterval(interval);
      clearInterval(purchaseInterval);
    };
  }, []);

  return (
    <div className="fixed top-20 right-4 z-40 space-y-4">
      {/* Live Visitor Count */}
      <motion.div
        className="bg-black/90 backdrop-blur-sm border border-brand-gold/30 rounded-lg p-4 shadow-2xl"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-gray-400">Live Now</span>
        </div>
        <div className="text-2xl font-bold text-brand-gold">{visitorCount}</div>
        <div className="text-xs text-gray-400">people viewing</div>
      </motion.div>

      {/* Recent Purchases */}
      <AnimatePresence>
        {recentPurchases.map((purchase, index) => (
          <motion.div
            key={index}
            className="bg-black/90 backdrop-blur-sm border border-gray-800 rounded-lg p-3 shadow-2xl max-w-xs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <p className="text-sm text-white">{purchase}</p>
            </div>
            <div className="text-xs text-gray-400 mt-1">Just now</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}




