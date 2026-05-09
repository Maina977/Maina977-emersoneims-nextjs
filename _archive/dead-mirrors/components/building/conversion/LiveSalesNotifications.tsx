'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 🔥 LIVE SALES NOTIFICATIONS - TRUST & URGENCY BUILDER
 *
 * Shows real-time sales notifications to build social proof and FOMO
 * Features:
 * - "John from Nairobi just ordered a 500kVA generator"
 * - Random but believable data
 * - Smooth slide-in animations
 * - Auto-dismiss after 5 seconds
 * - Multiple notification types (purchase, consultation, installation)
 */

interface Notification {
  id: number;
  name: string;
  location: string;
  action: string;
  product: string;
  time: string;
  icon: string;
  type: 'purchase' | 'consultation' | 'installation';
}

const names = [
  'John K.', 'Mary W.', 'David M.', 'Sarah N.', 'Peter O.', 'Grace K.',
  'James M.', 'Lucy W.', 'Michael K.', 'Jane N.', 'Paul O.', 'Faith M.',
  'Joseph K.', 'Anne W.', 'Daniel M.', 'Rose N.', 'Simon O.', 'Betty K.',
];

const locations = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika',
  'Kiambu', 'Machakos', 'Nyeri', 'Kitale', 'Malindi', 'Kakamega',
  'Kisii', 'Meru', 'Naivasha', 'Garissa', 'Kericho', 'Embu',
];

const products = [
  '500kVA Cummins Generator',
  '250kVA Diesel Generator',
  '1000kVA Industrial Generator',
  '20kW Solar System',
  '50kW Solar Installation',
  '100kVA UPS System',
  'Generator Maintenance Package',
  'Solar Power Farm Setup',
  '750kVA Backup Generator',
  '150kW Hybrid System',
];

const actions = {
  purchase: ['just ordered', 'purchased', 'bought'],
  consultation: ['booked consultation for', 'requested quote for', 'inquired about'],
  installation: ['scheduled installation of', 'confirmed delivery of', 'approved installation for'],
};

const icons = {
  purchase: '🎉',
  consultation: '💬',
  installation: '🚀',
};

function generateNotification(id: number): Notification {
  const type = (['purchase', 'consultation', 'installation'] as const)[Math.floor(Math.random() * 3)];
  const name = names[Math.floor(Math.random() * names.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  const product = products[Math.floor(Math.random() * products.length)];
  const action = actions[type][Math.floor(Math.random() * actions[type].length)];
  const minutesAgo = Math.floor(Math.random() * 30) + 1;

  return {
    id,
    name,
    location,
    action,
    product,
    time: `${minutesAgo} min${minutesAgo > 1 ? 's' : ''} ago`,
    icon: icons[type],
    type,
  };
}

export default function LiveSalesNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    // Show first notification after 5 seconds
    const initialTimer = setTimeout(() => {
      setNotifications([generateNotification(nextId)]);
      setNextId(nextId + 1);
    }, 5000);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (notifications.length === 0) return;

    // Show new notification every 15-30 seconds
    const showTimer = setTimeout(() => {
      const newNotification = generateNotification(nextId);
      setNotifications(prev => [...prev, newNotification]);
      setNextId(nextId + 1);
    }, Math.random() * 15000 + 15000); // 15-30 seconds

    return () => clearTimeout(showTimer);
  }, [notifications, nextId]);

  useEffect(() => {
    if (notifications.length === 0) return;

    // Auto-dismiss oldest notification after 6 seconds
    const dismissTimer = setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 6000);

    return () => clearTimeout(dismissTimer);
  }, [notifications]);

  return (
    <div className="fixed bottom-6 left-6 z-[9998] pointer-events-none max-w-sm">
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 25,
            }}
            className="mb-3"
            style={{ marginBottom: index > 0 ? '12px' : '0' }}
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-4 pointer-events-auto backdrop-blur-xl">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <motion.div
                  className="text-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: 2,
                  }}
                >
                  {notification.icon}
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {notification.name} from {notification.location}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {notification.time}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {notification.action}{' '}
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {notification.product}
                    </span>
                  </p>

                  {/* Trust badge */}
                  <div className="mt-2 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Verified Purchase</span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <motion.div
                className="mt-3 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 6, ease: 'linear' }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
