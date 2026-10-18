import { reviewsRepository } from '@/lib/db/reviews';
import { isAdminRequest, adminNotFound } from '@/lib/auth/adminRequest';

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return adminNotFound();
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
