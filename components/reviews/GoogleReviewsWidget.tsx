'use client';

import { useEffect, useState } from 'react';
import type { ReviewsPayload } from '@/app/api/reviews/google/route';

/**
 * Real Google reviews, read from the Business Profile through
 * /api/reviews/google.
 *
 * THE SAMPLE_REVIEWS ARRAY THAT USED TO LIVE HERE IS GONE, PERMANENTLY.
 * This component shipped with four hardcoded reviewers — "John Kamau",
 * "Mary Wanjiku", "Ahmed Hassan" — under a comment admitting they were
 * placeholders for a Places API integration that was never built. Nothing
 * rendered them, so nothing false reached a visitor, but the array was one
 * import away from doing so.
 *
 * The rule this file now enforces: every review shown here was written by a
 * real customer on Google, or nothing is shown. There is no fallback content
 * and no default state that invents a rating. If the API is unconfigured, this
 * renders null and the page simply does not have a reviews section.
 *
 * Google's terms require the reviewer's name and a route back to the review on
 * Google. Both are rendered below — do not remove them.
 */
export default function GoogleReviewsWidget({
  heading = 'What our customers say',
  limit = 5,
}: {
  heading?: string;
  limit?: number;
}) {
  const [data, setData] = useState<ReviewsPayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/reviews/google')
      .then((r) => r.json())
      .then((d: ReviewsPayload) => {
        if (!cancelled) setData(d);
      })
      .catch(() => {
        // Silence, not placeholders.
        if (!cancelled) setData(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data || !data.reviews.length) return null;

  const shown = data.reviews.slice(0, limit);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16" aria-labelledby="google-reviews">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 id="google-reviews" className="text-2xl font-bold text-white">
          {heading}
        </h2>
        {data.rating !== null && data.total !== null ? (
          <p className="text-slate-300">
            <Stars value={data.rating} />{' '}
            <span className="font-semibold text-white">{data.rating.toFixed(1)}</span>{' '}
            from {data.total.toLocaleString('en-KE')} Google review
            {data.total === 1 ? '' : 's'}
          </p>
        ) : null}
      </div>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2">
        {shown.map((review) => (
          <li
            key={`${review.author}-${review.publishTime}`}
            className="rounded-lg border border-white/10 bg-white/5 p-5"
          >
            <div className="flex items-center gap-3">
              {review.authorPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element -- Google-hosted avatar, not a local asset
                <img
                  src={review.authorPhoto}
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full"
                  loading="lazy"
                />
              ) : null}
              <div>
                <p className="font-semibold text-white">{review.author}</p>
                <p className="text-xs text-slate-400">{review.relativeTime}</p>
              </div>
            </div>
            <p className="mt-3 text-sm" aria-label={`${review.rating} out of 5`}>
              <Stars value={review.rating} />
            </p>
            <p className="mt-2 leading-relaxed text-slate-300">{review.text}</p>
          </li>
        ))}
      </ul>

      {data.profileUrl ? (
        <p className="mt-6 text-sm text-slate-400">
          Reviews from{' '}
          <a
            href={data.profileUrl}
            className="font-semibold text-cyan-400 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            our Google Business Profile
          </a>
          . Worked with us? Leaving a review there is what puts the rating in
          front of the next person searching.
        </p>
      ) : null}
    </section>
  );
}

/** Filled stars to the nearest half, as text so it survives with no CSS. */
function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span className="text-amber-400" aria-hidden="true">
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(Math.max(0, 5 - full - (half ? 1 : 0)))}
    </span>
  );
}
