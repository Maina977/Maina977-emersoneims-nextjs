import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cummins & Voltka Generators 10-2000KVA Kenya | 1 Year Free Service | EmersonEIMS",
  description: "Buy NEW Cummins & Voltka diesel generators in Kenya. 10kVA to 2000kVA with complete warranty + 1 year FREE maintenance. Same-day quotes. Delivery to Nairobi, Mombasa, Kisumu & all 47 counties. Generator sales Kenya.",
  keywords: "cummins generators Kenya, voltka generators Kenya, generator for sale Kenya, diesel generator price Kenya, generator sales Kenya, cummins generator dealer Nairobi, industrial generator Kenya, generator supplier Kenya, 100kva generator Kenya, 500kva generator Kenya",
};

export default function GeneratorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


