import { Metadata } from 'next';

export const metadata: Metadata = {
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
