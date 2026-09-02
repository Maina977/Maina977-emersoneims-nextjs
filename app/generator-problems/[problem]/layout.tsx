import { Metadata } from 'next';
import { getProblemSeo } from '@/lib/seo/generatorProblems';

/*
 * The metadata itself lives in lib/seo/generatorProblems.ts — the page needs
 * the same slugs, and a second copy would drift.
 *
 * `params` IS A PROMISE and must be awaited. The previous version of this file
 * read `params.problem` directly, so the lookup was always undefined and all
 * five problem pages fell through to the "Generator Problem" fallback below.
 * Verified live as Googlebot on 2026-09-02: /generator-problems/low-oil-pressure
 * served the title "Generator Problem | Generator Troubleshooting - EmersonEIMS"
 * while rendering its own H1 and 525 words. The descriptions were written and
 * correct; they simply never reached a crawler. This is invisible in dev and in
 * the build — only the rendered HTML shows it.
 */
export async function generateMetadata(
  { params }: { params: Promise<{ problem: string }> },
): Promise<Metadata> {
  const { problem } = await params;
  const seo = getProblemSeo(problem);

  if (!seo) {
    // Unknown slugs are 404'd before they get here. If one ever does, do not
    // invent a page for it.
    return {
      title: 'Generator Problem',
      description: 'Diagnose and fix common generator problems.',
      robots: { index: false, follow: true },
    };
  }

  return {
    /*
     * Self-referential canonical. Without it these five pages inherit the one
     * hard-coded in app/generator-problems/layout.tsx and each declares
     * <link rel="canonical" href=".../generator-problems">, asking Google to
     * drop it. See scripts/check-canonical-inheritance.mjs.
     */
    alternates: { canonical: `https://www.emersoneims.com/generator-problems/${problem}` },
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: 'article',
      images: ['/images/generator-diagnostics.webp'],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
  };
}

export default function ProblemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
