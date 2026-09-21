import { Metadata } from 'next';

/*
 * This route renders a client component, which cannot export metadata. Without
 * this layout the page inherited the site-wide default from app/layout.tsx and
 * published the homepage's title and description as its own.
 */
export const metadata: Metadata = {
  alternates: { canonical: 'https://www.emersoneims.com/marketplace/returns' },
  title: 'Returns and Refunds',
  description:
    'How to return a spare part bought from EmersonEIMS: the return window, condition requirements, refund method and who pays return carriage.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
