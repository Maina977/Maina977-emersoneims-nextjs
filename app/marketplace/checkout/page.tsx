'use client';

/**
 * Checkout Page
 * Cart → Shipping Address → Review Order → Place Order
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Part } from '@/lib/parts/partsInventoryParser';

interface CartItem {
  part: Part;
  quantity: number;
}

const SHIPPING_RATES: { [key: string]: number } = {
  'Nairobi': 500,
  'Mombasa': 1500,
  'Kisumu': 1200,
  'Nakuru': 800,
  'Eldoret': 1000,
  'Naivasha': 700,
};

export default function CheckoutPage() {
  const [step, setStep] = useState<'cart' | 'shipping' | 'review' | 'confirm'>('cart');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Shipping form
  const [shippingLocation, setShippingLocation] = useState('Nairobi');
  const [shippingAddress, setShippingAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  // Order confirmation
  const [orderCreated, setOrderCreated] = useState<{
    orderId: string;
    total: number;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCart(parsed);
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    }
    setLoading(false);
  }, []);

  const shippingCost = SHIPPING_RATES[shippingLocation] || 2000;
  const subtotal = cart.reduce((sum, item) => sum + (item.part.sellingPrice * item.quantity), 0);
  const tax = Math.round(subtotal * 0.16);
  const total = subtotal + tax + shippingCost;

  const removeFromCart = (partId: string) => {
    const updated = cart.filter(item => item.part.id !== partId);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const updateQuantity = (partId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(partId);
      return;
    }
    const updated = cart.map(item =>
      item.part.id === partId ? { ...item, quantity } : item
    );
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: `CUST-${Date.now()}`, // Generate temp ID
          customerPhone: phone,
          customerEmail: email,
          customerName: name,
          items: cart.map(item => ({
            partCode: item.part.code,
            partName: item.part.name,
            quantity: item.quantity,
            unitPrice: item.part.sellingPrice,
            subtotal: item.part.sellingPrice * item.quantity,
          })),
          shippingLocation,
          paymentMethod: 'mpesa',
        }),
      });

      const data = await response.json();
      if (data.orderId) {
        setOrderCreated({
          orderId: data.orderId,
          total: data.total,
        });
        setStep('confirm');
        localStorage.removeItem('cart'); // Clear cart
        setCart([]);
      }
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-lg">Loading cart...</p>
      </div>
    );
  }

  if (cart.length === 0 && step !== 'confirm') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🛒</p>
          <h1 className="text-2xl font-bold text-white mb-2">Your Cart is Empty</h1>
          <p className="text-gray-400 mb-6">Add some parts to get started</p>
          <Link
            href="/marketplace/parts"
            className="inline-block px-6 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-black border-b border-amber-500/20 py-6">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-white mb-2">Checkout</h1>
          <p className="text-gray-400">
            Step {step === 'cart' ? '1' : step === 'shipping' ? '2' : step === 'review' ? '3' : '4'} of 4
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* STEP 1: Cart */}
            {step === 'cart' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="space-y-4 mb-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Your Items ({cart.length})</h2>

                  {cart.map((item) => (
                    <div
                      key={item.part.id}
                      className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex items-start justify-between"
                    >
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{item.part.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{item.part.code}</p>
                        <p className="text-amber-400 font-bold mt-2">
                          KES {item.part.sellingPrice.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-2">
                          <button
                            onClick={() => updateQuantity(item.part.id, item.quantity - 1)}
                            className="px-2 py-1 text-gray-400 hover:text-white"
                          >
                            −
                          </button>
                          <span className="px-2 text-white font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.part.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-white font-bold">
                            KES {(item.part.sellingPrice * item.quantity).toLocaleString()}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.part.id)}
                            className="text-xs text-red-400 hover:text-red-300 mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setStep('shipping')}
                  className="w-full py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition"
                >
                  Continue to Shipping →
                </motion.button>
              </motion.div>
            )}

            {/* STEP 2: Shipping */}
            {step === 'shipping' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Shipping Address</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0712345678"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Delivery Location *</label>
                    <select
                      value={shippingLocation}
                      onChange={(e) => setShippingLocation(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    >
                      {Object.keys(SHIPPING_RATES).map(loc => (
                        <option key={loc} value={loc}>{loc} - KES {SHIPPING_RATES[loc].toLocaleString()}</option>
                      ))}
                      <option value="other">Other Location - KES 2,000</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Street Address</label>
                    <textarea
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="e.g., P.O. Box 12345 or street address"
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep('cart')}
                    className="flex-1 py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition"
                  >
                    ← Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      if (!name || !email || !phone) {
                        alert('Please fill in all required fields');
                        return;
                      }
                      setStep('review');
                    }}
                    className="flex-1 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition"
                  >
                    Review Order →
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Review */}
            {step === 'review' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Order Review</h2>

                <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 space-y-4">
                  <div className="pb-4 border-b border-slate-700">
                    <p className="text-gray-400 text-sm">Shipping To:</p>
                    <p className="text-white font-semibold">{name}</p>
                    <p className="text-gray-400">{shippingLocation}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-2">Contact:</p>
                    <p className="text-white">{email}</p>
                    <p className="text-white">{phone}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep('shipping')}
                    className="flex-1 py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition"
                  >
                    ← Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handlePlaceOrder}
                    disabled={submitting}
                    className="flex-1 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition disabled:opacity-50"
                  >
                    {submitting ? 'Creating Order...' : 'Place Order & Pay →'}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Confirmation */}
            {step === 'confirm' && orderCreated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-3xl font-bold text-green-400 mb-2">Order Created Successfully!</h2>
                <p className="text-gray-400 mb-4">Your order is ready for payment</p>

                <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 my-8">
                  <p className="text-gray-400 text-sm mb-2">Order ID</p>
                  <p className="text-white font-bold text-2xl mb-4">{orderCreated.orderId}</p>
                  <p className="text-gray-400 text-sm mb-2">Total Amount Due</p>
                  <p className="text-amber-400 font-bold text-3xl">KES {orderCreated.total.toLocaleString()}</p>
                </div>

                <div className="space-y-2 mb-8">
                  <p className="text-gray-400">Redirecting to M-Pesa payment...</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-8 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition"
                  >
                    Complete Payment with M-Pesa
                  </motion.button>
                </div>

                <Link
                  href="/marketplace/orders"
                  className="text-amber-400 hover:text-amber-300 transition"
                >
                  View My Orders
                </Link>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-slate-700">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax (16% VAT)</span>
                  <span>KES {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping ({shippingLocation})</span>
                  <span>KES {shippingCost.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-white font-bold text-lg">Total</span>
                <span className="text-amber-400 font-bold text-2xl">KES {total.toLocaleString()}</span>
              </div>

              <div className="text-xs text-gray-500 text-center">
                30-day money-back guarantee on all parts
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
