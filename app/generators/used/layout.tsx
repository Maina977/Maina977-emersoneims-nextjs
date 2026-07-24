import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Used Generators Kenya | Cummins, Perkins, Caterpillar | Verified Running Hours | Pre-Owned | 1-Year Warranty",
  description: "Pre-owned generators (50-2000 kVA) with verified running hours: Cummins (2,000-8,500 hrs), Perkins (1,500-6,000 hrs), Caterpillar (3,000-12,000 hrs), Volvo Penta (2,500-7,500 hrs). 21-point inspection, load tested, 1-year warranty. Nationwide delivery 47 counties.",
  keywords: "used generators Kenya, pre-owned generators, low hour generators, Cummins used, Perkins used, Caterpillar used, generator running hours, certified pre-owned, second hand generators, refurbished generators",
  openGraph: {
    title: "Quality Pre-Owned Generators — Fully Tested, Verified Running Hours",
    description: "Certified used generators from leading brands with documented running hours and comprehensive load test reports",
    type: "website",
    locale: "en_KE",
  },
};

export default function UsedGeneratorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


