import { Metadata } from 'next';

/*
 * This route renders a client component, which cannot export metadata. Without
 * this layout the page inherited the site-wide default from app/layout.tsx and
 * published the homepage's title and description as its own.
 */
export const metadata: Metadata = {
  alternates: { canonical: 'https://www.emersoneims.com/innovations' },
  title: 'Engineering Innovations',
  description:
    'The diagnostic and design tools EmersonEIMS builds in-house for generator, solar and borehole engineering in Kenya, and the thinking behind each one.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
