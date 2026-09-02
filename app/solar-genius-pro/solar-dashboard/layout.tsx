import type { Metadata } from "next";

export const metadata: Metadata = {
  // See app/solar-genius-pro/fault-codes/layout.tsx — client page, inherited
  // canonical. This one carries SolarGeniusContent variant="solar-dashboard".
  alternates: { canonical: 'https://www.emersoneims.com/solar-genius-pro/solar-dashboard' },
  title: "Solar Monitoring: The Numbers That Matter",
  description:
    "Which solar monitoring numbers actually tell you a system is working — yield, performance ratio, string balance — and which ones look alarming but are not.",
};

export default function SolarDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
