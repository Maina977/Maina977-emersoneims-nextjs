import type { Metadata } from "next";

export const metadata: Metadata = {
  // See app/generators/cummins/layout.tsx — client page, inherited canonical.
  // This one is an informational guide, not a product page: it should rank for
  // "how a generator works" queries, not compete with /generators.
  alternates: { canonical: 'https://www.emersoneims.com/generators/systems' },
  title: "Generator Systems Guide: Every Component",
  description:
    "How each generator system works — engine, fuel, cooling, lubrication, electrical and control. Components, common faults and maintenance intervals.",
  openGraph: {
    title: "Generator Systems Guide — Components & Faults",
    description:
      "Complete guide to every generator system: components, common issues and maintenance schedules.",
    type: "article",
    locale: "en_KE",
  },
};

export default function GeneratorSystemsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
