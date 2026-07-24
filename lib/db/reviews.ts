/**
 * Reviews Database Service
 */

import type { Review, PartRatingSummary } from '@/lib/reviews/reviewService';

const reviewsDb: Map<string, Review> = new Map();
const partReviewsIndex: Map<string, string[]> = new Map();
const pendingReviewsQueue: string[] = [];

export interface ReviewRepository {
  create(review: Review): Promise<Review>;
  findById(reviewId: string): Promise<Review | null>;
  findByPart(partCode: string): Promise<Review[]>;
  findByOrder(orderId: string): Promise<Review | null>;
  update(reviewId: string, updates: Partial<Review>): Promise<Review>;
  approve(reviewId: string): Promise<Review>;
  reject(reviewId: string, reason: string): Promise<Review>;
  getPendingReviews(): Promise<Review[]>;
  getPartRating(partCode: string): Promise<PartRatingSummary>;
  delete(reviewId: string): Promise<boolean>;
}

class InMemoryReviewDb implements ReviewRepository {
  async create(review: Review): Promise<Review> {
    reviewsDb.set(review.id, review);

    if (!partReviewsIndex.has(review.partCode)) {
      partReviewsIndex.set(review.partCode, []);
    }
    partReviewsIndex.get(review.partCode)!.push(review.id);

    if (review.status === 'pending') {
      pendingReviewsQueue.push(review.id);
    }

    return review;
  }

  async findById(reviewId: string): Promise<Review | null> {
    return reviewsDb.get(reviewId) || null;
  }

  async findByPart(partCode: string): Promise<Review[]> {
    const reviewIds = partReviewsIndex.get(partCode) || [];
    return reviewIds
      .map(id => reviewsDb.get(id))
      .filter((review): review is Review => review !== undefined);
  }

  async findByOrder(orderId: string): Promise<Review | null> {
    for (const review of reviewsDb.values()) {
      if (review.orderId === orderId) return review;
    }
    return null;
  }

  async update(reviewId: string, updates: Partial<Review>): Promise<Review> {
    const review = reviewsDb.get(reviewId);
    if (!review) throw new Error(`Review ${reviewId} not found`);

    const updated = { ...review, ...updates };
    reviewsDb.set(reviewId, updated);
    return updated;
  }

  async approve(reviewId: string): Promise<Review> {
    const review = reviewsDb.get(reviewId);
    if (!review) throw new Error(`Review ${reviewId} not found`);

    const approved = { ...review, status: 'approved' as const, approvedAt: new Date() };
    reviewsDb.set(reviewId, approved);

    const index = pendingReviewsQueue.indexOf(reviewId);
    if (index > -1) pendingReviewsQueue.splice(index, 1);

    return approved;
  }

  async reject(reviewId: string, reason: string): Promise<Review> {
    const review = reviewsDb.get(reviewId);
    if (!review) throw new Error(`Review ${reviewId} not found`);

    const rejected = { ...review, status: 'rejected' as const, rejectionReason: reason };
    reviewsDb.set(reviewId, rejected);

    const index = pendingReviewsQueue.indexOf(reviewId);
    if (index > -1) pendingReviewsQueue.splice(index, 1);

    return rejected;
  }

  async getPendingReviews(): Promise<Review[]> {
    return pendingReviewsQueue
      .map(id => reviewsDb.get(id))
      .filter((review): review is Review => review !== undefined);
  }

  async getPartRating(partCode: string): Promise<PartRatingSummary> {
    const reviews = await this.findByPart(partCode);
    const approvedReviews = reviews.filter(r => r.status === 'approved');

    if (approvedReviews.length === 0) {
      return {
        partCode,
        partName: 'Unknown',
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const totalRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = Number((totalRating / approvedReviews.length).toFixed(1));

    const ratingDistribution = {
      5: approvedReviews.filter(r => r.rating === 5).length,
      4: approvedReviews.filter(r => r.rating === 4).length,
      3: approvedReviews.filter(r => r.rating === 3).length,
      2: approvedReviews.filter(r => r.rating === 2).length,
      1: approvedReviews.filter(r => r.rating === 1).length
    };

    return {
      partCode,
      partName: approvedReviews[0].partName,
      averageRating,
      totalReviews: approvedReviews.length,
      ratingDistribution
    };
  }

  async delete(reviewId: string): Promise<boolean> {
    const review = reviewsDb.get(reviewId);
    if (!review) return false;

    reviewsDb.delete(reviewId);
    const partReviews = partReviewsIndex.get(review.partCode);
    if (partReviews) {
      const index = partReviews.indexOf(reviewId);
      if (index > -1) partReviews.splice(index, 1);
    }

    const queueIndex = pendingReviewsQueue.indexOf(reviewId);
    if (queueIndex > -1) pendingReviewsQueue.splice(queueIndex, 1);

    return true;
  }
}

export const reviewsRepository = new InMemoryReviewDb();
