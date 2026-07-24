import { reviewsRepository } from '@/lib/db/reviews';

export async function POST(request: Request) {
  try {
    const { reviewId } = await request.json();

    if (!reviewId) {
      return Response.json(
        { error: 'Review ID required' },
        { status: 400 }
      );
    }

    const review = await reviewsRepository.approve(reviewId);

    return Response.json({
      success: true,
      review
    });
  } catch (error: any) {
    console.error('Error approving review:', error);
    return Response.json(
      { error: error.message || 'Failed to approve review' },
      { status: 500 }
    );
  }
}
