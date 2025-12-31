import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generator Parts Kenya | Filters, Controls, Engine Spares | Same Day Nairobi",
  description: "Genuine generator spare parts for ALL brands in Kenya. Filters, electrical parts, controls, engine components. OEM & aftermarket available. Same-day delivery Nairobi. Serving all 47 counties. Cummins, Perkins, CAT, FG Wilson parts in stock.",
  keywords: "generator parts Kenya, generator spare parts Kenya, cummins parts Kenya, perkins parts Kenya, generator filters Kenya, generator oil filters Kenya, generator fuel filters Kenya, generator electrical parts Kenya, generator control panel Kenya, engine parts Kenya, AVR generator Kenya, governor parts Kenya, alternator parts Kenya, generator controller Kenya, generator starter motor Kenya",
};

export default function GeneratorPartsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
