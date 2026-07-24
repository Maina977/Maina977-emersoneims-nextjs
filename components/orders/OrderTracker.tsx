'use client';

/**
 * Order Status Tracker Component
 * Real-time tracking of order from payment to delivery
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Order } from '@/lib/orders/orderService';

interface OrderTrackerProps {
  orderId: string;
}

const STATUS_STAGES = [
  { status: 'pending', label: 'Awaiting Payment', icon: '⏳', color: 'yellow' },
  { status: 'confirmed', label: 'Confirmed', icon: '✓', color: 'blue' },
  { status: 'processing', label: 'Processing', icon: '⚙️', color: 'purple' },
  { status: 'shipped', label: 'In Transit', icon: '🚚', color: 'cyan' },
  { status: 'delivered', label: 'Delivered', icon: '✓✓', color: 'green' }
];

export default function OrderTracker({ orderId }: OrderTrackerProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchOrder();
    if (autoRefresh) {
      const interval = setInterval(fetchOrder, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [orderId, autoRefresh]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading order status...</div>;
  }

  if (!order) {
    return <div className="text-center text-red-400">Order not found</div>;
  }

  const currentStageIndex = STATUS_STAGES.findIndex(s => s.status === order.status);

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Order ID</p>
            <p className="text-white font-bold text-lg">{order.orderId}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Amount</p>
            <p className="text-amber-400 font-bold text-lg">KES {order.total.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Payment Status</p>
            <p className={`font-bold text-lg ${order.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
              {order.paymentStatus.toUpperCase()}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Ordered on</p>
            <p className="text-white font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Order Status</h3>

        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-6 top-8 bottom-0 w-1 bg-gradient-to-b from-amber-500 to-slate-700" />

          {/* Status Steps */}
          <div className="space-y-6">
            {STATUS_STAGES.map((stage, index) => {
              const isCompleted = index <= currentStageIndex;
              const isCurrent = index === currentStageIndex;

              return (
                <motion.div
                  key={stage.status}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="relative pl-24"
                >
                  {/* Status Icon */}
                  <div
                    className={`absolute left-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl border-4 ${
                      isCompleted
                        ? `bg-${stage.color}-500/20 border-${stage.color}-500`
                        : 'bg-slate-800 border-slate-700'
                    } ${isCurrent ? 'ring-4 ring-amber-500/50' : ''}`}
                  >
                    {stage.icon}
                  </div>

                  {/* Content */}
                  <div
                    className={`bg-slate-900/50 rounded-lg p-4 border ${
                      isCompleted ? `border-${stage.color}-500/50` : 'border-slate-800'
                    }`}
                  >
                    <h4 className={`font-bold ${isCompleted ? 'text-white' : 'text-gray-500'}`}>
                      {stage.label}
                    </h4>

                    {/* Timestamps */}
                    {stage.status === 'pending' && order.createdAt && (
                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(order.createdAt).toLocaleString('en-KE', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </p>
                    )}
                    {stage.status === 'confirmed' && order.paidAt && (
                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(order.paidAt).toLocaleString('en-KE', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </p>
                    )}
                    {stage.status === 'shipped' && order.shippedAt && (
                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(order.shippedAt).toLocaleString('en-KE', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </p>
                    )}
                    {stage.status === 'delivered' && order.deliveredAt && (
                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(order.deliveredAt).toLocaleString('en-KE', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </p>
                    )}

                    {/* Additional Info */}
                    {isCurrent && (
                      <div className="mt-2 text-sm text-amber-400 animate-pulse">
                        ◆ Current status
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Shipping Details */}
      {order.shipping && (
        <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-800">
          <h3 className="text-lg font-bold text-white mb-4">Shipping Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Delivery Method</p>
              <p className="text-white font-semibold capitalize">{order.shipping.method}</p>
            </div>
            {order.shipping.courierName && (
              <div>
                <p className="text-gray-500">Courier</p>
                <p className="text-white font-semibold">{order.shipping.courierName}</p>
              </div>
            )}
            {order.shipping.trackingNumber && (
              <div>
                <p className="text-gray-500">Tracking Number</p>
                <p className="text-white font-semibold">{order.shipping.trackingNumber}</p>
              </div>
            )}
            <div>
              <p className="text-gray-500">Delivery Location</p>
              <p className="text-white font-semibold">{order.shipping.location}</p>
            </div>
            {order.shipping.estimatedDelivery && (
              <div>
                <p className="text-gray-500">Est. Delivery</p>
                <p className="text-white font-semibold">
                  {new Date(order.shipping.estimatedDelivery).toLocaleDateString('en-KE')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-800">
        <h3 className="text-lg font-bold text-white mb-4">Order Items</h3>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between items-center pb-3 border-b border-slate-700 last:border-0">
              <div>
                <p className="text-white font-semibold">{item.partName}</p>
                <p className="text-xs text-gray-500">{item.partCode}</p>
              </div>
              <div className="text-right">
                <p className="text-amber-400 font-bold">
                  {item.quantity} × KES {item.unitPrice.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">KES {item.subtotal.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auto-Refresh Toggle */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`px-3 py-1 rounded transition ${
            autoRefresh
              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
              : 'bg-slate-800 text-gray-400 border border-slate-700'
          }`}
        >
          {autoRefresh ? '🔄 Auto-refresh ON' : '⏸ Auto-refresh OFF'}
        </button>
        <button
          onClick={fetchOrder}
          className="px-3 py-1 rounded bg-slate-800 text-gray-400 border border-slate-700 hover:border-slate-600 transition"
        >
          Refresh Now
        </button>
      </div>
    </div>
  );
}
