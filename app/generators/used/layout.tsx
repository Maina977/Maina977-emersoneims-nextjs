import type { Metadata } from "next";

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/generators/used' },
  title: "Used Generators Kenya",
  description: "Used Cummins, Perkins, Caterpillar, Volvo Penta and other generators in Kenya, sold unit by unit: each set's stock number, engine hours, price and load-test report on request. 2-year warranty on every generator we sell.",
  keywords: "used generators Kenya, pre-owned generators, Cummins used, Perkins used, Caterpillar used, second hand generators, refurbished generators",
  openGraph: {
    title: "Used Generators Kenya — Unit-by-Unit Stock List on Request",
    description: "Each used set's stock number, engine hours, price, test report and warranty cover, on request. 2-year warranty on every generator we sell.",
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


