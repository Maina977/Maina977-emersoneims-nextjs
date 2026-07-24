import { reviewService } from '@/lib/reviews/reviewService';
import { reviewsRepository } from '@/lib/db/reviews';

export async function POST(request: Request) {
  try {
    const {
      orderId,
      partCode,
      partName,
      customerId,
      customerName,
      rating,
      title,
      body,
      images
    } = await request.json();

    // Validate inputs
    if (!orderId || !partCode || !partName || !customerId || !rating || !title || !body) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return Response.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (title.length < 5 || title.length > 100) {
      return Response.json(
        { error: 'Review title must be 5-100 characters' },
        { status: 400 }
      );
    }

    if (body.length < 10 || body.length > 2000) {
      return Response.json(
        { error: 'Review body must be 10-2000 characters' },
        { status: 400 }
      );
    }

    // Create review
    const review = await reviewService.createReview({
      orderId,
      partCode,
      partName,
      customerId,
      customerName,
      rating: parseInt(rating),
      title,
      body,
      images: images || []
    });

    // Save to database
    await reviewsRepository.create(review);

    return Response.json({
      success: true,
      review,
      message: 'Review submitted successfully and is pending moderation'
    });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return Response.json(
      { error: error.message || 'Failed to create review' },
      { status: 500 }
    );
  }
}
