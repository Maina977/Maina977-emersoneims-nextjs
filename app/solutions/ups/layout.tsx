import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UPS Systems Kenya | Sale, Installation & Maintenance | EmersonEIMS",
  description: "Uninterruptible Power Supply (UPS) systems in Kenya. Online UPS, line-interactive, data center UPS. Battery backup solutions. Installation, maintenance, battery replacement. UPS Kenya, UPS Nairobi, industrial UPS, commercial UPS. All 47 counties covered.",
  keywords: "UPS Kenya, uninterruptible power supply Kenya, UPS installation Kenya, online UPS Kenya, UPS Nairobi, data center UPS Kenya, industrial UPS Kenya, UPS battery Kenya, UPS maintenance Kenya, UPS repair Kenya, line interactive UPS Kenya, double conversion UPS Kenya",
};

export default function UPSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
