/**
 * Order Database Service
 * Abstraction layer for order persistence (PostgreSQL/Firebase/etc)
 */

import type { Order } from '@/lib/orders/orderService';

// In-memory storage for MVP (replace with real database)
const ordersDb: Map<string, Order> = new Map();
const customerOrdersIndex: Map<string, string[]> = new Map();

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findById(orderId: string): Promise<Order | null>;
  findByCustomerId(customerId: string): Promise<Order[]>;
  update(orderId: string, updates: Partial<Order>): Promise<Order>;
  findByStatus(status: Order['status']): Promise<Order[]>;
  findByPaymentStatus(status: string): Promise<Order[]>;
  delete(orderId: string): Promise<boolean>;
  getAllOrders(): Promise<Order[]>;
}

class InMemoryOrderDb implements OrderRepository {
  async create(order: Order): Promise<Order> {
    ordersDb.set(order.orderId, order);

    if (!customerOrdersIndex.has(order.customerId)) {
      customerOrdersIndex.set(order.customerId, []);
    }
    customerOrdersIndex.get(order.customerId)!.push(order.orderId);

    return order;
  }

  async findById(orderId: string): Promise<Order | null> {
    return ordersDb.get(orderId) || null;
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    const orderIds = customerOrdersIndex.get(customerId) || [];
    return orderIds
      .map(id => ordersDb.get(id))
      .filter((order): order is Order => order !== undefined);
  }

  async update(orderId: string, updates: Partial<Order>): Promise<Order> {
    const order = ordersDb.get(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);

    const updated = { ...order, ...updates };
    ordersDb.set(orderId, updated);
    return updated;
  }

  async findByStatus(status: Order['status']): Promise<Order[]> {
    return Array.from(ordersDb.values()).filter(o => o.status === status);
  }

  async findByPaymentStatus(status: string): Promise<Order[]> {
    return Array.from(ordersDb.values()).filter(o => o.paymentStatus === status);
  }

  async delete(orderId: string): Promise<boolean> {
    const order = ordersDb.get(orderId);
    if (!order) return false;

    ordersDb.delete(orderId);
    const customerOrders = customerOrdersIndex.get(order.customerId);
    if (customerOrders) {
      const index = customerOrders.indexOf(orderId);
      if (index > -1) customerOrders.splice(index, 1);
    }
    return true;
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(ordersDb.values());
  }
}

// Export singleton instance
export const ordersRepository = new InMemoryOrderDb();

/**
 * TODO: Replace with PostgreSQL
 *
 * import { Pool } from 'pg';
 *
 * const pool = new Pool({
 *   connectionString: process.env.DATABASE_URL
 * });
 *
 * class PostgresOrderDb implements OrderRepository {
 *   async create(order: Order): Promise<Order> {
 *     const result = await pool.query(
 *       'INSERT INTO orders (orderId, customerId, ...) VALUES ($1, $2, ...) RETURNING *',
 *       [order.orderId, order.customerId, ...]
 *     );
 *     return result.rows[0];
 *   }
 *   // ... implement other methods
 * }
 */
