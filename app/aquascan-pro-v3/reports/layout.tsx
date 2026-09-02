import type { Metadata } from "next";

export const metadata: Metadata = {
  // App screen — see app/aquascan-pro-v3/compare/layout.tsx.
  alternates: { canonical: 'https://www.emersoneims.com/aquascan-pro-v3/reports' },
  title: "Borehole Survey Reports",
  robots: { index: false, follow: true },
};

export default function AquaScanReportsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
