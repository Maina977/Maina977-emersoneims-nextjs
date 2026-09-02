import type { Metadata } from "next";

export const metadata: Metadata = {
  /*
   * WHY THIS FILE EXISTS AT ALL.
   * page.tsx is a 'use client' component, and a client page cannot export
   * metadata. Without this server layout the page silently inherited
   * app/generators/layout.tsx — including its canonical — so this URL served
   * <link rel="canonical" href=".../generators">, telling Google to drop it
   * and count it as a duplicate of the section root. Verified live as
   * Googlebot on 2026-09-02: title AND canonical were both /generators'.
   * Six commercial pages were doing this. A child layout's metadata overrides
   * the parent's, which is the only fix that keeps the parent canonical
   * (needed so /generators does not depend on the root layout reading
   * headers(), which forces the whole site to render dynamically).
   */
  alternates: { canonical: 'https://www.emersoneims.com/generators/cummins' },
  // Root layout appends " | EmersonEIMS Kenya" (20 chars) — keep this <= 45.
  title: "Cummins Generators: Range & Specifications",
  description:
    "Cummins diesel generators from 10 kVA to 2000 kVA: product range, technical specifications and installation. Supplied and serviced by EmersonEIMS Kenya.",
  openGraph: {
    title: "Cummins Power Solutions — 10 kVA to 2000 kVA",
    description:
      "Cummins diesel generators engineered for reliability and efficiency, with specialist installation and 24/7 support.",
    type: "website",
    locale: "en_KE",
  },
};

export default function CumminsGeneratorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
