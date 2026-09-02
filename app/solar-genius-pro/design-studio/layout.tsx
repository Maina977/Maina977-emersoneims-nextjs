import type { Metadata } from "next";

export const metadata: Metadata = {
  // See app/solar-genius-pro/fault-codes/layout.tsx — client page, inherited
  // canonical. This one carries SolarGeniusContent variant="design-studio".
  alternates: { canonical: 'https://www.emersoneims.com/solar-genius-pro/design-studio' },
  title: "Solar PV System Design Principles",
  description:
    "The design sequence behind a solar PV system that performs: load profile, array sizing, inverter matching, string layout and the losses that decide real output.",
};

export default function SolarDesignStudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
