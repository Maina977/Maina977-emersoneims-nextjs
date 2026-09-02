import type { Metadata } from "next";

export const metadata: Metadata = {
  // See app/generators/cummins/layout.tsx — client page, inherited canonical.
  // Leasing is its own commercial intent ("generator hire/lease Kenya") and was
  // canonicalising into the sales page, so it could never rank for it.
  alternates: { canonical: 'https://www.emersoneims.com/generators/leasing' },
  title: "Generator Leasing Kenya | From 3 Months",
  description:
    "Generator leasing in Kenya without the capital outlay: terms from 3 months to lease-to-own, maintenance included. Plans and available fleet from EmersonEIMS.",
  openGraph: {
    title: "Generator Leasing Kenya — Maintenance Included",
    description:
      "Power your business without the capital investment. Flexible terms from 3 months to lease-to-own.",
    type: "website",
    locale: "en_KE",
  },
};

export default function GeneratorLeasingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
