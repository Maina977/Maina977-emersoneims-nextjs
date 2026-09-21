import { Metadata } from 'next';

/*
 * This route renders a client component, which cannot export metadata. Without
 * this layout the page inherited the site-wide default from app/layout.tsx and
 * published the homepage's title and description as its own.
 */
export const metadata: Metadata = {
  alternates: { canonical: 'https://www.emersoneims.com/warranty' },
  title: 'Warranty Coverage',
  description:
    'What the EmersonEIMS warranty covers on generators, solar installations and workshop repairs in Kenya: terms, duration, what is included and how to claim.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
