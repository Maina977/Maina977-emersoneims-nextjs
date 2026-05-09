'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Calculator, Shield, Truck, Clock, Users,
  TrendingUp, Award, Phone, MessageCircle, ChevronRight,
  AlertTriangle, CheckCircle, Star, Package
} from 'lucide-react';

/**
 * GENERATOR SALES BOOSTER - MAXIMIZE GENERATOR SALES
 *
 * Research-backed tactics to increase generator sales conversion:
 * 1. Urgency (limited stock, price increase warnings)
 * 2. Social proof (recent purchases, reviews)
 * 3. Risk reversal (3-year warranty, money-back guarantee)
 * 4. Financing options (make it affordable)
 * 5. Free value-adds (delivery, installation, training)
 */

interface GeneratorDeal {
  id: string;
  brand: string;
  model: string;
  kva: number;
  originalPrice: number;
  salePrice: number;
  stock: number;
  image?: string;
  features: string[];
  warranty: string;
}

// Hot deals that rotate
const HOT_DEALS: GeneratorDeal[] = [
  {
    id: 'cummins-30',
    brand: 'Cummins',
    model: 'C30D5',
    kva: 30,
    originalPrice: 850000,
    salePrice: 725000,
    stock: 3,
    warranty: '3 Years',
    features: ['Silent Canopy', 'Auto Start', 'DeepSea Controller', 'Free Delivery']
  },
  {
    id: 'perkins-60',
    brand: 'Perkins',
    model: '60KVA',
    kva: 60,
    originalPrice: 1450000,
    salePrice: 1250000,
    stock: 2,
    warranty: '3 Years',
    features: ['Industrial Grade', 'ATS Included', 'Remote Monitoring', 'Free Installation']
  },
  {
    id: 'fgwilson-100',
    brand: 'FG Wilson',
    model: 'P100-3',
    kva: 100,
    originalPrice: 2200000,
    salePrice: 1890000,
    stock: 4,
    warranty: '3 Years',
    features: ['Prime Power', 'Sound Attenuated', 'Digital Controller', 'Fuel Tank 500L']
  },
];

// Recent purchases for social proof
const RECENT_PURCHASES = [
  { name: 'Safari Park Hotel', location: 'Nairobi', generator: '150KVA Cummins', time: '2 hours ago' },
  { name: 'Kenyatta Hospital', location: 'Nairobi', generator: '500KVA Perkins', time: '5 hours ago' },
  { name: 'Greenspan Mall', location: 'Donholm', generator: '250KVA FG Wilson', time: 'Yesterday' },
  { name: 'Strathmore University', location: 'Madaraka', generator: '200KVA Cummins', time: 'Yesterday' },
  { name: 'Serena Hotel', location: 'Mombasa', generator: '300KVA Perkins', time: '2 days ago' },
];

export default function GeneratorSalesBooster() {
  const [currentDeal, setCurrentDeal] = useState(0);
  const [showPurchaseNotification, setShowPurchaseNotification] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 30 });

  const COMPANY_PHONE = '+254768860665';
  const COMPANY_WHATSAPP = '254768860665';

  // Countdown timer for urgency
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 }; // Reset
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Rotate deals
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDeal(prev => (prev + 1) % HOT_DEALS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Show purchase notifications (social proof)
  useEffect(() => {
    const showNotification = () => {
      setShowPurchaseNotification(true);
      setTimeout(() => {
        setShowPurchaseNotification(false);
        setCurrentPurchase(prev => (prev + 1) % RECENT_PURCHASES.length);
      }, 5000);
    };

    // Show first notification after 10 seconds
    const initialTimer = setTimeout(showNotification, 10000);

    // Then every 30 seconds
    const interval = setInterval(showNotification, 30000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const deal = HOT_DEALS[currentDeal];
  const purchase = RECENT_PURCHASES[currentPurchase];
  const discount = Math.round((1 - deal.salePrice / deal.originalPrice) * 100);

  return (
    <>
      {/* MAIN SALES SECTION */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-amber-500/30 overflow-hidden">
        {/* Urgency Header */}
        <div className="bg-gradient-to-r from-red-600 to-amber-600 p-3 text-center">
          <div className="flex items-center justify-center gap-2 text-white font-bold">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <span>FLASH SALE - Prices Increase In:</span>
            <div className="flex gap-1 font-mono">
              <span className="bg-black/30 px-2 py-1 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>:
              <span className="bg-black/30 px-2 py-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>:
              <span className="bg-black/30 px-2 py-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* Deal Card */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              {/* Brand & Model */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-amber-500 text-sm font-medium">{deal.brand}</span>
                  <h3 className="text-2xl font-bold text-white">{deal.kva}KVA Generator</h3>
                  <p className="text-gray-400">{deal.model}</p>
                </div>
                <div className="text-right">
                  <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    SAVE {discount}%
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-end gap-3 mb-4">
                <span className="text-4xl font-bold text-white">
                  KES {deal.salePrice.toLocaleString()}
                </span>
                <span className="text-xl text-gray-500 line-through mb-1">
                  KES {deal.originalPrice.toLocaleString()}
                </span>
              </div>

              {/* Stock Warning */}
              <div className="flex items-center gap-2 mb-4 text-red-400">
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Only {deal.stock} units left in stock!
                </span>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {deal.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature}
                  </div>
                ))}
              </div>

              {/* Warranty Badge */}
              <div className="flex items-center gap-2 mb-6 p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                <Shield className="w-6 h-6 text-green-500" />
                <div>
                  <span className="text-green-400 font-bold">{deal.warranty} WARRANTY</span>
                  <p className="text-xs text-gray-400">Full parts & labor coverage</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${COMPANY_PHONE}`}
                  className="flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl hover:from-green-500 hover:to-green-400"
                >
                  <Phone className="w-5 h-5" />
                  Call to Order
                </a>
                <a
                  href={`https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(`Hi! I'm interested in the ${deal.kva}KVA ${deal.brand} generator at KES ${deal.salePrice.toLocaleString()}. Is it still available?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold rounded-xl hover:from-[#22c55e] hover:to-[#16a34a]"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Deal Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {HOT_DEALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentDeal(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentDeal ? 'bg-amber-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Trust Signals */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-800/50 border-t border-gray-700">
          <div className="text-center">
            <Truck className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <span className="text-xs text-gray-400">Free Delivery</span>
          </div>
          <div className="text-center">
            <Shield className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <span className="text-xs text-gray-400">3-Year Warranty</span>
          </div>
          <div className="text-center">
            <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <span className="text-xs text-gray-400">24/7 Support</span>
          </div>
          <div className="text-center">
            <Award className="w-5 h-5 text-purple-500 mx-auto mb-1" />
            <span className="text-xs text-gray-400">Certified</span>
          </div>
        </div>
      </div>

      {/* FINANCING SECTION */}
      <div className="mt-6 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-2xl border border-blue-500/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Calculator className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Can't Pay Full Amount?</h3>
            <p className="text-sm text-gray-400">Flexible financing available!</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-800/50 rounded-xl">
            <span className="text-2xl font-bold text-white">30%</span>
            <p className="text-xs text-gray-400">Deposit</p>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-xl">
            <span className="text-2xl font-bold text-white">12</span>
            <p className="text-xs text-gray-400">Months</p>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-xl">
            <span className="text-2xl font-bold text-white">0%</span>
            <p className="text-xs text-gray-400">Interest*</p>
          </div>
        </div>

        <a
          href={`https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent("Hi! I'm interested in generator financing options. Can you share the details?")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500"
        >
          Get Financing Quote
          <ChevronRight className="w-4 h-4" />
        </a>

        <p className="text-xs text-gray-500 mt-2 text-center">*Terms & conditions apply</p>
      </div>

      {/* PURCHASE NOTIFICATION - Social Proof */}
      <AnimatePresence>
        {showPurchaseNotification && (
          <motion.div
            initial={{ opacity: 0, x: -100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed bottom-24 left-6 z-[9990] bg-white rounded-xl shadow-2xl p-4 max-w-sm"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-gray-900 font-medium text-sm">
                  <span className="font-bold">{purchase.name}</span> in {purchase.location}
                </p>
                <p className="text-gray-600 text-sm">
                  Just purchased a <span className="font-semibold">{purchase.generator}</span>
                </p>
                <p className="text-gray-400 text-xs mt-1">{purchase.time}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
