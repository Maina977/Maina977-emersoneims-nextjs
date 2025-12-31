import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Used Generators for Sale Kenya | ALL BRANDS with Warranty | EmersonEIMS",
  description: "Certified used generators Kenya - Cummins, Perkins, CAT, Volvo, FG Wilson. 21-point inspection, load tested, 1-year warranty included. 10kVA-1000kVA available. Second hand generators Nairobi, Mombasa. Refurbished generators with same-day viewing.",
  keywords: "used generators for sale Kenya, second hand generators Kenya, refurbished generators Kenya, cheap generators Kenya, used generator price Kenya, used cummins generator Kenya, used perkins generator Kenya, used caterpillar generator Kenya, second hand generator Nairobi",
};

export default function UsedGeneratorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


