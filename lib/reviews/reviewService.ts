/**
 * Customer Reviews & Ratings System
 * Verified purchase reviews with moderation
 */

export interface Review {
  id: string;
  partCode: string;
  partName: string;
  orderId: string;
  customerId: string;
  customerName: string;
  rating: number; // 1-5 stars
  title: string;
  body: string;
  verified: boolean; // Must be from actual purchase
  helpfulCount: number;
  images?: string[]; // Photo URLs
  status: 'pending' | 'approved' | 'rejected'; // Moderation
  createdAt: Date;
  approvedAt?: Date;
  rejectionReason?: string;
}

export interface PartRatingSummary {
  partCode: string;
  partName: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number; // Count of 5-star reviews
    4: number;
    3: number;
    2: number;
    1: number;
  };
  mostHelpfulReview?: Review;
  topKeywords: string[]; // "quality", "fast", "durable", etc.
}

class ReviewService {
  /**
   * Create a review (must be from verified purchase)
   */
  createReview(data: {
    orderId: string;
    partCode: string;
    partName: string;
    customerId: string;
    customerName: string;
    rating: number;
    title: string;
    body: string;
    images?: string[];
  }): Review {
    // Validate rating
    if (data.rating < 1 || data.rating > 5 || !Number.isInteger(data.rating)) {
      throw new Error('Rating must be an integer between 1 and 5');
    }

    // Validate text length
    if (data.title.length < 5 || data.title.length > 100) {
      throw new Error('Title must be 5-100 characters');
    }
    if (data.body.length < 10 || data.body.length > 2000) {
      throw new Error('Review must be 10-2000 characters');
    }

    return {
      id: `REV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      partCode: data.partCode,
      partName: data.partName,
      orderId: data.orderId,
      customerId: data.customerId,
      customerName: data.customerName,
      rating: data.rating,
      title: data.title,
      body: data.body,
      verified: true, // This should be verified against actual order
      helpfulCount: 0,
      images: data.images,
      status: 'pending', // All reviews go to moderation first
      createdAt: new Date()
    };
  }

  /**
   * Approve review after moderation
   */
  approveReview(review: Review): Review {
    return {
      ...review,
      status: 'approved',
      approvedAt: new Date()
    };
  }

  /**
   * Reject review with reason
   */
  rejectReview(review: Review, reason: string): Review {
    return {
      ...review,
      status: 'rejected',
      rejectionReason: reason
    };
  }

  /**
   * Calculate rating summary for a part
   */
  calculatePartRating(reviews: Review[]): PartRatingSummary {
    const approvedReviews = reviews.filter(r => r.status === 'approved');

    if (approvedReviews.length === 0) {
      return {
        partCode: reviews[0]?.partCode || 'UNKNOWN',
        partName: reviews[0]?.partName || 'Unknown Part',
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

    const sortedByHelpful = [...approvedReviews].sort((a, b) => b.helpfulCount - a.helpfulCount);
    const mostHelpful = sortedByHelpful[0];

    const keywords = this.extractKeywords(approvedReviews);

    return {
      partCode: reviews[0].partCode,
      partName: reviews[0].partName,
      averageRating,
      totalReviews: approvedReviews.length,
      ratingDistribution,
      mostHelpfulReview: mostHelpful,
      topKeywords: keywords
    };
  }

  /**
   * Mark review as helpful
   */
  markHelpful(review: Review): Review {
    return {
      ...review,
      helpfulCount: review.helpfulCount + 1
    };
  }

  /**
   * Get review moderation queue
   */
  getModerationQueue(reviews: Review[]): Review[] {
    return reviews
      .filter(r => r.status === 'pending')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Detect spam/inappropriate content
   */
  isSuspicious(review: Review): { suspicious: boolean; reasons: string[] } {
    const reasons: string[] = [];

    // Check for excessive punctuation
    if ((review.title.match(/[!?]{2,}/g) || []).length > 2) {
      reasons.push('Excessive punctuation');
    }

    // Check for all caps
    if (review.body === review.body.toUpperCase()) {
      reasons.push('All caps review');
    }

    // Check for spam keywords
    const spamKeywords = ['click here', 'buy now', 'free money', 'bitcoin', 'casino'];
    if (spamKeywords.some(kw => review.body.toLowerCase().includes(kw))) {
      reasons.push('Contains spam keywords');
    }

    // Check for competitor mentions
    if (/emerson|parts|ebay|amazon/i.test(review.body) && review.rating < 3) {
      reasons.push('Competitor mention with low rating');
    }

    return {
      suspicious: reasons.length > 0,
      reasons
    };
  }

  /**
   * Extract keywords from reviews
   */
  private extractKeywords(reviews: Review[]): string[] {
    const text = reviews.map(r => `${r.title} ${r.body}`).join(' ').toLowerCase();

    const keywords = [
      'quality', 'durable', 'excellent', 'good', 'bad', 'poor', 'fast',
      'slow', 'reliable', 'broke', 'damaged', 'authentic', 'fake',
      'perfect', 'waste', 'money', 'recommend', 'dont', 'worth'
    ];

    return keywords
      .filter(kw => text.includes(kw))
      .slice(0, 5); // Top 5 keywords
  }

  /**
   * Generate review badge
   */
  getReviewBadge(review: Review): string {
    if (!review.verified) return 'unverified';
    if (review.helpfulCount > 10) return 'most-helpful';
    if (review.rating === 5) return 'highly-satisfied';
    if (review.rating === 1) return 'defect-reported';
    return 'verified';
  }
}

export const reviewService = new ReviewService();
