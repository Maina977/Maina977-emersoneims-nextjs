'use client';

/**
 * Customer Order History & Tracking Page
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import OrderTracker from '@/components/orders/OrderTracker';
import type { Order } from '@/lib/orders/orderService';

export default function OrdersPage() {
  const [customerId, setCustomerId] = useState('');
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, get customerId from auth context
    const stored = localStorage.getItem('customerId');
    if (stored) {
      setCustomerId(stored);
      fetchOrders(stored);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchOrders = async (id: string) => {
    try {
      const response = await fetch(`/api/customers/${id}/orders`);
      if (response.ok) {
        const data = await response.json();
        setCustomerOrders(data.orders.sort((a: Order, b: Order) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-lg">Loading orders...</p>
      </div>
    );
  }

  if (!customerId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">📦</p>
          <h1 className="text-2xl font-bold text-white mb-2">Order History</h1>
          <p className="text-gray-400">Please log in to view your orders</p>
          <button className="mt-6 px-6 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (customerOrders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">📭</p>
          <h1 className="text-2xl font-bold text-white mb-2">No Orders Yet</h1>
          <p className="text-gray-400">Start shopping to see your order history here</p>
          <a href="/marketplace/parts" className="inline-block mt-6 px-6 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition">
            Browse Parts
          </a>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-b border-amber-500/20 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-white">My Orders</h1>
          <p className="text-gray-400 mt-1">Track and manage your purchases</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-1">
            <div className="space-y-3">
              {customerOrders.map((order) => (
                <motion.button
                  key={order.orderId}
                  onClick={() => setSelectedOrder(order.orderId)}
                  whileHover={{ scale: 1.02 }}
                  className={`w-full text-left p-4 rounded-lg border transition ${
                    selectedOrder === order.orderId
                      ? 'bg-amber-500/20 border-amber-500'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-white">{order.orderId}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      order.paymentStatus === 'paid'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{order.items.length} item(s)</p>
                  <p className="text-amber-400 font-bold mt-2">KES {order.total.toLocaleString()}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(order.createdAt).toLocaleDateString('en-KE')}
                  </p>

                  {/* Status Indicator */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-500' :
                      order.status === 'shipped' ? 'bg-blue-500' :
                      order.status === 'processing' ? 'bg-purple-500' :
                      order.status === 'confirmed' ? 'bg-cyan-500' :
                      'bg-yellow-500'
                    }`} />
                    <span className="text-xs text-gray-400 capitalize">{order.status}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-2">
            {selectedOrder ? (
              <motion.div
                key={selectedOrder}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <OrderTracker orderId={selectedOrder} />
              </motion.div>
            ) : (
              <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-8 text-center">
                <p className="text-4xl mb-4">👈</p>
                <p className="text-gray-400">Select an order to view details and tracking</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
