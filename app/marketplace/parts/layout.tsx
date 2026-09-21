import { Metadata } from 'next';

/*
 * This route renders a client component, which cannot export metadata. Without
 * this layout the page inherited the site-wide default from app/layout.tsx and
 * published the homepage's title and description as its own.
 */
export const metadata: Metadata = {
  alternates: { canonical: 'https://www.emersoneims.com/marketplace/parts' },
  title: 'Generator Spare Parts Marketplace',
  description:
    'Browse generator spare parts by engine, brand and part number: filters, alternators, starters, injectors, turbochargers and controllers, with Kenyan pricing.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
