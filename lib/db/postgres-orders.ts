/**
 * PostgreSQL Order Repository Implementation
 * Replaces in-memory storage with persistent database
 */

import { query, transaction, getConnection } from './postgres';
import type { Order, OrderRepository, OrderItem } from '@/lib/orders/orderService';

export class PostgresOrderDb implements OrderRepository {
  async create(order: Order): Promise<Order> {
    return transaction(async (client) => {
      // Insert order
      const orderResult = await client.query(
        `INSERT INTO orders (
          orderId, customerId, customerPhone, customerEmail, customerName,
          subtotal, tax, shippingCost, total, paymentMethod, paymentStatus,
          status, createdAt
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *`,
        [
          order.orderId,
          order.customerId,
          order.customerPhone,
          order.customerEmail,
          order.customerName,
          order.subtotal,
          order.tax,
          order.shippingCost,
          order.total,
          order.paymentMethod,
          order.paymentStatus,
          order.status,
          order.createdAt,
        ]
      );

      // Insert order items
      for (const item of order.items) {
        await client.query(
          `INSERT INTO order_items (
            orderId, partCode, partName, quantity, unitPrice, subtotal
          ) VALUES ($1, $2, $3, $4, $5, $6)`,
          [order.orderId, item.partCode, item.partName, item.quantity, item.unitPrice, item.subtotal]
        );
      }

      return {
        ...orderResult.rows[0],
        items: order.items,
      };
    });
  }

  async findById(orderId: string): Promise<Order | null> {
    const orderResult = await query(
      'SELECT * FROM orders WHERE orderId = $1',
      [orderId]
    );

    if (orderResult.rows.length === 0) return null;

    const order = orderResult.rows[0];
    const itemsResult = await query(
      'SELECT * FROM order_items WHERE orderId = $1',
      [orderId]
    );

    return {
      ...order,
      items: itemsResult.rows,
    };
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    const result = await query(
      `SELECT o.*, array_agg(json_build_object(
        'partCode', oi.partCode,
        'partName', oi.partName,
        'quantity', oi.quantity,
        'unitPrice', oi.unitPrice,
        'subtotal', oi.subtotal
      )) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.orderId = oi.orderId
      WHERE o.customerId = $1
      GROUP BY o.orderId
      ORDER BY o.createdAt DESC`,
      [customerId]
    );

    return result.rows.map(row => ({
      ...row,
      items: row.items.filter((item: any) => item.partCode !== null),
    }));
  }

  async update(orderId: string, updates: Partial<Order>): Promise<Order> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.paymentStatus) {
      fields.push(`paymentStatus = $${paramIndex++}`);
      values.push(updates.paymentStatus);
    }
    if (updates.status) {
      fields.push(`status = $${paramIndex++}`);
      values.push(updates.status);
    }
    if (updates.paidAt) {
      fields.push(`paidAt = $${paramIndex++}`);
      values.push(updates.paidAt);
    }
    if (updates.shippedAt) {
      fields.push(`shippedAt = $${paramIndex++}`);
      values.push(updates.shippedAt);
    }
    if (updates.deliveredAt) {
      fields.push(`deliveredAt = $${paramIndex++}`);
      values.push(updates.deliveredAt);
    }
    if (updates.mpesaTransactionId) {
      fields.push(`mpesaTransactionId = $${paramIndex++}`);
      values.push(updates.mpesaTransactionId);
    }

    values.push(orderId);

    const result = await query(
      `UPDATE orders SET ${fields.join(', ')} WHERE orderId = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new Error(`Order ${orderId} not found`);
    }

    return await this.findById(orderId) as Order;
  }

  async findByStatus(status: Order['status']): Promise<Order[]> {
    const result = await query(
      `SELECT o.*, array_agg(json_build_object(
        'partCode', oi.partCode,
        'partName', oi.partName,
        'quantity', oi.quantity,
        'unitPrice', oi.unitPrice,
        'subtotal', oi.subtotal
      )) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.orderId = oi.orderId
      WHERE o.status = $1
      GROUP BY o.orderId
      ORDER BY o.createdAt DESC`,
      [status]
    );

    return result.rows.map(row => ({
      ...row,
      items: row.items.filter((item: any) => item.partCode !== null),
    }));
  }

  async findByPaymentStatus(status: string): Promise<Order[]> {
    const result = await query(
      `SELECT o.*, array_agg(json_build_object(
        'partCode', oi.partCode,
        'partName', oi.partName,
        'quantity', oi.quantity,
        'unitPrice', oi.unitPrice,
        'subtotal', oi.subtotal
      )) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.orderId = oi.orderId
      WHERE o.paymentStatus = $1
      GROUP BY o.orderId
      ORDER BY o.createdAt DESC`,
      [status]
    );

    return result.rows.map(row => ({
      ...row,
      items: row.items.filter((item: any) => item.partCode !== null),
    }));
  }

  async delete(orderId: string): Promise<boolean> {
    return transaction(async (client) => {
      await client.query('DELETE FROM order_items WHERE orderId = $1', [orderId]);
      const result = await client.query('DELETE FROM orders WHERE orderId = $1', [orderId]);
      return result.rowCount! > 0;
    });
  }

  async getAllOrders(): Promise<Order[]> {
    const result = await query(
      `SELECT o.*, array_agg(json_build_object(
        'partCode', oi.partCode,
        'partName', oi.partName,
        'quantity', oi.quantity,
        'unitPrice', oi.unitPrice,
        'subtotal', oi.subtotal
      )) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.orderId = oi.orderId
      GROUP BY o.orderId
      ORDER BY o.createdAt DESC`
    );

    return result.rows.map(row => ({
      ...row,
      items: row.items.filter((item: any) => item.partCode !== null),
    }));
  }
}
