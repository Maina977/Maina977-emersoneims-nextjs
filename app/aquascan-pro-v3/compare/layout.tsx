import type { Metadata } from "next";

export const metadata: Metadata = {
  // App screen: dynamic() with ssr:false, so its only crawlable text is the
  // ToolSeoContent block the section layout renders for every child. See
  // app/solar-genius-pro/calculator-advanced/layout.tsx for the full reasoning
  // behind noindex + follow + SELF-canonical (never a cross-canonical).
  alternates: { canonical: 'https://www.emersoneims.com/aquascan-pro-v3/compare' },
  title: "Compare Borehole Sites",
  robots: { index: false, follow: true },
};

export default function AquaScanCompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
