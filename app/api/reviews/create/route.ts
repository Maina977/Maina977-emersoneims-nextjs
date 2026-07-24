/**
 * POST /api/reviews/create
 * Submits a product review (from verified purchase)
 */

import { reviewService } from '@/lib/reviews/reviewService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, partCode, partName, customerId, customerName, rating, title, body, images } = body;

    // Create review
    const review = reviewService.createReview({
      orderId,
      partCode,
      partName,
      customerId,
      customerName,
      rating: parseInt(rating),
      title,
      body,
      images
    });

    // Check for suspicious content
    const suspicionCheck = reviewService.isSuspicious(review);
    if (suspicionCheck.suspicious) {
      console.warn('Suspicious review detected:', suspicionCheck.reasons);
    }

    // In production:
    // 1. Save to database
    // 2. Queue for moderation (auto-approve if no issues, else manual review)
    // 3. Send confirmation email to customer

    return Response.json({
      success: true,
      reviewId: review.id,
      status: review.status,
      message: 'Thank you for your review! It will appear after moderation.'
    });
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
