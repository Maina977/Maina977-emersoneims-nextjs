/**
 * Order Management System
 * Tracks orders from creation → payment → shipment → delivery
 */

export interface OrderItem {
  partCode: string;
  partName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderShipping {
  method: 'pickup' | 'courier' | 'mpesa-direct'; // How customer gets parts
  courierName?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  location: string; // Nairobi, Mombasa, etc.
}

export interface Order {
  orderId: string; // ORD-2026-001234
  customerId: string;
  customerPhone: string;
  customerEmail: string;
  customerName: string;

  // Items & Pricing
  items: OrderItem[];
  subtotal: number;
  tax: number; // 16% VAT
  shippingCost: number;
  total: number;

  // Payment
  paymentMethod: 'mpesa' | 'bank-transfer' | 'cash-on-delivery';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  mpesaTransactionId?: string;
  checkoutRequestId?: string;

  // Fulfillment
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  shipping?: OrderShipping;

  // Dates
  createdAt: Date;
  paidAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;

  // Additional
  notes?: string;
  invoiceUrl?: string;
  refundReason?: string;
  refundAmount?: number;
  refundedAt?: Date;
}

class OrderService {
  /**
   * Create a new order from cart
   */
  createOrder(data: {
    customerId: string;
    customerPhone: string;
    customerEmail: string;
    customerName: string;
    items: OrderItem[];
    shippingLocation: string;
    paymentMethod: string;
  }): Order {
    const subtotal = data.items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = Math.round(subtotal * 0.16); // 16% VAT
    const shippingCost = this.calculateShippingCost(data.shippingLocation, subtotal);
    const total = subtotal + tax + shippingCost;

    const orderId = this.generateOrderId();

    return {
      orderId,
      customerId: data.customerId,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      items: data.items,
      subtotal,
      tax,
      shippingCost,
      total,
      paymentMethod: data.paymentMethod as any,
      paymentStatus: 'pending',
      status: 'pending',
      createdAt: new Date()
    };
  }

  /**
   * Update payment status after M-Pesa callback
   */
  updatePaymentStatus(
    order: Order,
    status: 'paid' | 'failed',
    mpesaTransactionId?: string,
    checkoutRequestId?: string
  ): Order {
    return {
      ...order,
      paymentStatus: status,
      status: status === 'paid' ? 'confirmed' : 'pending',
      mpesaTransactionId,
      checkoutRequestId,
      paidAt: status === 'paid' ? new Date() : undefined
    };
  }

  /**
   * Update order status as it progresses
   */
  updateStatus(
    order: Order,
    status: Order['status'],
    additionalData?: Partial<Order>
  ): Order {
    return {
      ...order,
      status,
      ...additionalData,
      shippedAt: status === 'shipped' ? new Date() : order.shippedAt,
      deliveredAt: status === 'delivered' ? new Date() : order.deliveredAt
    };
  }

  /**
   * Initiate return/refund
   */
  initiateReturn(order: Order, reason: string, refundAmount: number = order.total): Order {
    return {
      ...order,
      status: 'returned',
      refundReason: reason,
      refundAmount,
      refundedAt: new Date()
    };
  }

  /**
   * Generate unique order ID
   */
  private generateOrderId(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${year}${month}${day}-${random}`;
  }

  /**
   * Calculate shipping cost based on location
   */
  private calculateShippingCost(location: string, orderValue: number): number {
    const shippingRates: { [key: string]: number } = {
      'Nairobi': 500,
      'Mombasa': 1500,
      'Kisumu': 1200,
      'Nakuru': 800,
      'Eldoret': 1000,
      'Naivasha': 700
    };

    const baseCost = shippingRates[location] || 2000; // Default for other areas

    // Free shipping for orders above KES 50,000
    if (orderValue > 50000) return 0;

    return baseCost;
  }

  /**
   * Generate invoice (PDF ready)
   */
  generateInvoiceData(order: Order): {
    invoiceNumber: string;
    date: string;
    dueDate: string;
    items: any[];
    subtotal: string;
    tax: string;
    shipping: string;
    total: string;
    paymentStatus: string;
  } {
    const dueDate = new Date(order.createdAt);
    dueDate.setDate(dueDate.getDate() + 7);

    return {
      invoiceNumber: order.orderId,
      date: order.createdAt.toLocaleDateString('en-KE'),
      dueDate: dueDate.toLocaleDateString('en-KE'),
      items: order.items.map(item => ({
        description: item.partName,
        quantity: item.quantity,
        unitPrice: `KES ${item.unitPrice.toLocaleString()}`,
        amount: `KES ${item.subtotal.toLocaleString()}`
      })),
      subtotal: `KES ${order.subtotal.toLocaleString()}`,
      tax: `KES ${order.tax.toLocaleString()} (16% VAT)`,
      shipping: `KES ${order.shippingCost.toLocaleString()}`,
      total: `KES ${order.total.toLocaleString()}`,
      paymentStatus: order.paymentStatus.toUpperCase()
    };
  }

  /**
   * Get order status badge
   */
  getStatusBadge(status: Order['status']): { color: string; label: string; icon: string } {
    const badges: { [key in Order['status']]: { color: string; label: string; icon: string } } = {
      'pending': { color: 'yellow', label: 'Awaiting Payment', icon: '⏳' },
      'confirmed': { color: 'blue', label: 'Confirmed', icon: '✓' },
      'processing': { color: 'purple', label: 'Processing', icon: '⚙️' },
      'shipped': { color: 'cyan', label: 'In Transit', icon: '🚚' },
      'delivered': { color: 'green', label: 'Delivered', icon: '✓✓' },
      'cancelled': { color: 'red', label: 'Cancelled', icon: '✗' },
      'returned': { color: 'orange', label: 'Returned', icon: '↩️' }
    };
    return badges[status];
  }
}

export const orderService = new OrderService();
