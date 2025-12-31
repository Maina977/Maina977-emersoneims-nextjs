import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generator Fabrication Kenya | Canopies, Exhaust, Fuel Tanks | EmersonEIMS",
  description: "Custom generator fabrication services in Kenya. Soundproof canopies, weatherproof enclosures, exhaust systems, fuel reserve tanks, automation systems. NEMA compliant. Generator canopy Kenya, generator housing Nairobi, fuel tank fabrication, stainless steel tanks.",
  keywords: "generator canopy Kenya, generator enclosure Kenya, fuel tank fabrication Kenya, generator housing Kenya, soundproof canopy Kenya, exhaust silencer Kenya, custom fuel tanks Kenya, stainless steel tanks Kenya, generator accessories Kenya, canopy fabrication Nairobi, weatherproof generator Kenya",
};

export default function FabricationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
