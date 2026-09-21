import { Metadata } from 'next';

/*
 * NOINDEX. A checkout step is part of a transaction, not a destination. It
 * has no h1 and no standalone content, and indexing a checkout is how carts
 * end up in search results.
 */
/*
 * This route renders a client component, which cannot export metadata. Without
 * this layout the page inherited the site-wide default from app/layout.tsx and
 * published the homepage's title and description as its own.
 */
export const metadata: Metadata = {
  alternates: { canonical: 'https://www.emersoneims.com/marketplace/checkout' },
  title: 'Checkout',
  description:
    'Complete a spare-part order with EmersonEIMS.',
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
