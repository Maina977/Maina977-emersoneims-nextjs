import { reviewsRepository } from '@/lib/db/reviews';
import { isAdminRequest, adminNotFound } from '@/lib/auth/adminRequest';

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return adminNotFound();
  try {
    const reviews = await reviewsRepository.getPendingReviews();

    return Response.json({
      reviews: reviews.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    });
  } catch (error) {
    console.error('Error fetching pending reviews:', error);
    return Response.json(
      { error: 'Failed to fetch pending reviews' },
      { status: 500 }
    );
  }
}
