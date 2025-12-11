import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Used Generators — EmersonEIMS",
  description: "Fully serviced used generators from Cummins, Perkins, Caterpillar, Volvo Penta with 1-year warranty.",
};

export default function UsedGeneratorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


