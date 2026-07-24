/**
 * PostgreSQL Review Repository Implementation
 * Persistent storage for customer reviews and moderation queue
 */

import { query, transaction } from './postgres';
import type { Review, PartRatingSummary, ReviewRepository } from '@/lib/reviews/reviewService';

export class PostgresReviewDb implements ReviewRepository {
  async create(review: Review): Promise<Review> {
    const result = await query(
      `INSERT INTO reviews (
        id, orderId, partCode, partName, customerId, customerName,
        rating, title, body, images, status, isSuspicious, createdAt
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        review.id,
        review.orderId,
        review.partCode,
        review.partName,
        review.customerId,
        review.customerName,
        review.rating,
        review.title,
        review.body,
        JSON.stringify(review.images || []),
        review.status,
        review.isSuspicious,
        review.createdAt,
      ]
    );

    return {
      ...result.rows[0],
      images: JSON.parse(result.rows[0].images),
    };
  }

  async findById(reviewId: string): Promise<Review | null> {
    const result = await query('SELECT * FROM reviews WHERE id = $1', [reviewId]);

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      ...row,
      images: JSON.parse(row.images || '[]'),
    };
  }

  async findByPart(partCode: string): Promise<Review[]> {
    const result = await query(
      'SELECT * FROM reviews WHERE partCode = $1 ORDER BY createdAt DESC',
      [partCode]
    );

    return result.rows.map(row => ({
      ...row,
      images: JSON.parse(row.images || '[]'),
    }));
  }

  async findByOrder(orderId: string): Promise<Review | null> {
    const result = await query('SELECT * FROM reviews WHERE orderId = $1', [orderId]);

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      ...row,
      images: JSON.parse(row.images || '[]'),
    };
  }

  async update(reviewId: string, updates: Partial<Review>): Promise<Review> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.status) {
      fields.push(`status = $${paramIndex++}`);
      values.push(updates.status);
    }
    if (updates.body) {
      fields.push(`body = $${paramIndex++}`);
      values.push(updates.body);
    }
    if (updates.rating !== undefined) {
      fields.push(`rating = $${paramIndex++}`);
      values.push(updates.rating);
    }

    values.push(reviewId);

    const result = await query(
      `UPDATE reviews SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new Error(`Review ${reviewId} not found`);
    }

    const row = result.rows[0];
    return {
      ...row,
      images: JSON.parse(row.images || '[]'),
    };
  }

  async approve(reviewId: string): Promise<Review> {
    const result = await query(
      'UPDATE reviews SET status = $1, approvedAt = $2 WHERE id = $3 RETURNING *',
      ['approved', new Date(), reviewId]
    );

    if (result.rows.length === 0) {
      throw new Error(`Review ${reviewId} not found`);
    }

    const row = result.rows[0];
    return {
      ...row,
      images: JSON.parse(row.images || '[]'),
    };
  }

  async reject(reviewId: string, reason: string): Promise<Review> {
    const result = await query(
      'UPDATE reviews SET status = $1, rejectionReason = $2 WHERE id = $3 RETURNING *',
      ['rejected', reason, reviewId]
    );

    if (result.rows.length === 0) {
      throw new Error(`Review ${reviewId} not found`);
    }

    const row = result.rows[0];
    return {
      ...row,
      images: JSON.parse(row.images || '[]'),
    };
  }

  async getPendingReviews(): Promise<Review[]> {
    const result = await query(
      'SELECT * FROM reviews WHERE status = $1 ORDER BY createdAt ASC',
      ['pending']
    );

    return result.rows.map(row => ({
      ...row,
      images: JSON.parse(row.images || '[]'),
    }));
  }

  async getPartRating(partCode: string): Promise<PartRatingSummary> {
    const result = await query(
      `SELECT
        partCode,
        partName,
        AVG(rating) as averageRating,
        COUNT(*) as totalReviews,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
      FROM reviews
      WHERE partCode = $1 AND status = 'approved'
      GROUP BY partCode, partName`,
      [partCode]
    );

    if (result.rows.length === 0) {
      return {
        partCode,
        partName: 'Unknown',
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const row = result.rows[0];
    return {
      partCode: row.partcode,
      partName: row.partname,
      averageRating: parseFloat(row.averagerating) || 0,
      totalReviews: parseInt(row.totalreviews) || 0,
      ratingDistribution: {
        5: parseInt(row.five_star) || 0,
        4: parseInt(row.four_star) || 0,
        3: parseInt(row.three_star) || 0,
        2: parseInt(row.two_star) || 0,
        1: parseInt(row.one_star) || 0,
      },
    };
  }

  async delete(reviewId: string): Promise<boolean> {
    const result = await query('DELETE FROM reviews WHERE id = $1', [reviewId]);
    return result.rowCount! > 0;
  }
}
