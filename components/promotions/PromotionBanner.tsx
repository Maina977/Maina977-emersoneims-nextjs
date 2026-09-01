/*
 * PROMOTION BANNER — renders a promotion, or nothing at all.
 *
 * A server component on purpose. The two fake countdowns this replaces were
 * both client-side, and that is exactly what let them lie: each recomputed its
 * deadline from the visitor's own clock on mount, so the offer restarted for
 * every person who loaded the page. Deciding on the server, from fixed
 * calendar dates in the data, means an expired promotion is expired for
 * everyone — the page simply stops rendering it.
 *
 * There is no countdown here by design. A ticking timer adds pressure, not
 * information; the closing DATE is the honest form of the same fact, and it is
 * shown as a date. If a countdown is ever wanted back, it must read `endsAt`
 * from the data and must be allowed to reach zero and stay there.
 */
import Link from 'next/link';
import { activePromotion } from '@/lib/promotions/promotions';

export default function PromotionBanner() {
  const promo = activePromotion();

  // The normal case. No promotion is approved and live, so nothing is claimed.
  if (!promo) return null;

  const closes = new Date(promo.endsAt).toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <aside
      aria-label="Current offer"
      className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 text-white py-3 px-4"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 text-center">
        <span className="font-bold text-lg">{promo.headline}</span>

        <span className="text-sm text-white/90">
          Closes {closes}
        </span>

        {promo.href && (
          <Link
            href={promo.href}
            className="bg-white text-orange-600 px-4 py-2 rounded-full font-bold hover:bg-amber-100 transition-all"
          >
            {promo.ctaLabel || 'See the offer'}
          </Link>
        )}
      </div>

      {/*
        Terms and eligible products are rendered, not hidden behind an asterisk.
        A promotion that cannot state what it applies to should not have passed
        isPublishable() in the first place.
      */}
      <div className="max-w-7xl mx-auto mt-2 text-center text-xs text-white/80">
        <span>Applies to: {promo.eligibleProducts.join(', ')}. </span>
        <span>{promo.terms.join(' ')}</span>
      </div>
    </aside>
  );
}
