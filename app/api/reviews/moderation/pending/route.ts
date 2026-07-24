import { reviewsRepository } from '@/lib/db/reviews';

export async function GET(request: Request) {
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
