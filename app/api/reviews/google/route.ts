import { NextResponse } from 'next/server';

/**
 * The real Google reviews for EmersonEIMS, read from the Google Business
 * Profile via the Places API.
 *
 * WHY THIS EXISTS. components/reviews/GoogleReviewsWidget.tsx was written to
 * show Google reviews and shipped with a hardcoded SAMPLE_REVIEWS array — its
 * own comment said "In production, these would come from Google Places API".
 * That wiring was never done, so the only reviews the codebase could render
 * were invented names. Separately, five contradictory AggregateRating blocks
 * (reviewCount 500 / 350 / 280 / 150 / 87 for one business) were removed from
 * the site's schema on 2026-08-03.
 *
 * The owner's reviews are real. They live on the Google Business Profile, which
 * is the only place that can prove them, so that is where this reads them from.
 * Nothing here can invent a review: if the API is not configured or returns
 * nothing, the route says so and the widget renders nothing at all.
 *
 * CONFIGURE WITH ONE ENVIRONMENT VARIABLE:
 *   GOOGLE_PLACES_API_KEY  — a Places API (New) key, restricted to this server.
 *                            GOOGLE_MAPS_API_KEY is accepted too, so an existing
 *                            Maps key already on the project just works.
 *
 * The Place ID is NOT a second thing to go and find. If GOOGLE_PLACE_ID is set
 * it is used, and otherwise this route resolves it by searching the Places API
 * for the business by name and address, then reuses it. One value to configure,
 * not two — the key is the only part that genuinely requires the owner's own
 * Google Cloud account, because it is billed to it.
 *
 * BILLING NOTE, so it is not a surprise: `rating`, `userRatingCount` and
 * `reviews` are Enterprise-tier fields on the Places API. This route caches for
 * an hour to keep the call count low — roughly 24 calls a day, not one per
 * visitor.
 *
 * ATTRIBUTION: Google requires that reviews shown from Places carry the
 * reviewer's name and a link back to the review on Google. The widget renders
 * both; do not strip them.
 */

export const revalidate = 3600;

const PLACES_ENDPOINT = 'https://places.googleapis.com/v1/places';
const SEARCH_ENDPOINT = 'https://places.googleapis.com/v1/places:searchText';
const FIELD_MASK = 'displayName,rating,userRatingCount,googleMapsUri,reviews';

/**
 * How the business is described to Places when resolving its own listing.
 * Kept in step with the NAP in app/layout.tsx — same name, same street, same
 * city. If the listing is ever renamed on Google, change it here.
 */
const BUSINESS_QUERY = 'EmersonEIMS, Airport North Road, Embakasi, Nairobi, Kenya';

/** Place IDs may be stored indefinitely under the Places terms, so cache it. */
let resolvedPlaceId: string | null = null;

/**
 * Find the Business Profile without anyone having to look up a Place ID.
 *
 * Returns null rather than guessing. A wrong Place ID would put another
 * company's reviews on this site, which is a worse failure than showing none.
 */
async function resolvePlaceId(key: string): Promise<string | null> {
  if (process.env.GOOGLE_PLACE_ID) return process.env.GOOGLE_PLACE_ID;
  if (resolvedPlaceId) return resolvedPlaceId;

  const res = await fetch(SEARCH_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': 'places.id,places.displayName',
    },
    body: JSON.stringify({ textQuery: BUSINESS_QUERY, maxResultCount: 1 }),
    next: { revalidate: 86400 },
  });

  if (!res.ok) return null;
  const data = await res.json();
  const id = data?.places?.[0]?.id;
  if (typeof id !== 'string' || !id) return null;

  resolvedPlaceId = id;
  return id;
}

export interface PublicReview {
  author: string;
  authorPhoto?: string;
  authorUri?: string;
  rating: number;
  text: string;
  relativeTime: string;
  publishTime: string;
}

export interface ReviewsPayload {
  configured: boolean;
  rating: number | null;
  total: number | null;
  profileUrl: string | null;
  reviews: PublicReview[];
  /** Present only when something went wrong, so the widget can stay silent. */
  error?: string;
}

const EMPTY: ReviewsPayload = {
  configured: false,
  rating: null,
  total: null,
  profileUrl: null,
  reviews: [],
};

export async function GET(): Promise<NextResponse<ReviewsPayload>> {
  // An existing Maps key works — no need for a second key just for this.
  const key = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

  if (!key) {
    // Not an error state. The site simply has nothing verified to show yet.
    return NextResponse.json(
      { ...EMPTY, error: 'Set GOOGLE_PLACES_API_KEY (or GOOGLE_MAPS_API_KEY) to display Google reviews.' },
      { status: 200 },
    );
  }

  try {
    const placeId = await resolvePlaceId(key);
    if (!placeId) {
      return NextResponse.json(
        { ...EMPTY, configured: true, error: 'Could not resolve the Business Profile from the Places API.' },
        { status: 200 },
      );
    }

    const res = await fetch(`${PLACES_ENDPOINT}/${encodeURIComponent(placeId)}`, {
      headers: {
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': FIELD_MASK,
      },
      next: { revalidate },
    });

    if (!res.ok) {
      // Never fall back to invented reviews. Silence is the correct failure.
      return NextResponse.json(
        { ...EMPTY, configured: true, error: `Places API returned ${res.status}` },
        { status: 200 },
      );
    }

    const data = await res.json();

    const reviews: PublicReview[] = Array.isArray(data.reviews)
      ? data.reviews
          .map((r: Record<string, any>) => ({
            author: r.authorAttribution?.displayName ?? '',
            authorPhoto: r.authorAttribution?.photoUri ?? undefined,
            authorUri: r.authorAttribution?.uri ?? undefined,
            rating: typeof r.rating === 'number' ? r.rating : 0,
            text: r.originalText?.text ?? r.text?.text ?? '',
            relativeTime: r.relativePublishTimeDescription ?? '',
            publishTime: r.publishTime ?? '',
          }))
          // A review with no author or no words is not worth showing, and
          // showing it would misrepresent what the customer actually said.
          .filter((r: PublicReview) => r.author && r.text)
      : [];

    return NextResponse.json({
      configured: true,
      rating: typeof data.rating === 'number' ? data.rating : null,
      total: typeof data.userRatingCount === 'number' ? data.userRatingCount : null,
      profileUrl: data.googleMapsUri ?? null,
      reviews,
    });
  } catch (err) {
    return NextResponse.json(
      { ...EMPTY, configured: true, error: err instanceof Error ? err.message : 'unknown error' },
      { status: 200 },
    );
  }
}
