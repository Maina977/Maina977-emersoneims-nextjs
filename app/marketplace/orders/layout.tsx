import { Metadata } from 'next';

/*
 * NOINDEX. This page shows one visitor their own order state. It has no h1
 * and nothing on it is the same twice, so there is nothing here for a search
 * result to be about.
 */
/*
 * This route renders a client component, which cannot export metadata. Without
 * this layout the page inherited the site-wide default from app/layout.tsx and
 * published the homepage's title and description as its own.
 */
export const metadata: Metadata = {
  alternates: { canonical: 'https://www.emersoneims.com/marketplace/orders' },
  title: 'Your Orders',
  description:
    'Track and review spare-part orders placed with EmersonEIMS.',
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
