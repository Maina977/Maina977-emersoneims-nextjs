import { Metadata } from 'next';

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/generator-problems' },
  title: {
    template: '%s | Generator Troubleshooting - EmersonEIMS',
    default: 'Generator Problems & Solutions - EmersonEIMS Kenya',
  },
  description: 'Diagnose and fix common generator problems. Expert troubleshooting guides for generators that won\'t start, overheating, low oil pressure, black smoke, and more.',
};

export default function GeneratorProblemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
