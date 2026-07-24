import { reviewsRepository } from '@/lib/db/reviews';

export async function POST(request: Request) {
  try {
    const { reviewId, reason } = await request.json();

    if (!reviewId || !reason) {
      return Response.json(
        { error: 'Review ID and reason required' },
        { status: 400 }
      );
    }

    const review = await reviewsRepository.reject(reviewId, reason);

    return Response.json({
      success: true,
      review
    });
  } catch (error: any) {
    console.error('Error rejecting review:', error);
    return Response.json(
      { error: error.message || 'Failed to reject review' },
      { status: 500 }
    );
  }
}
