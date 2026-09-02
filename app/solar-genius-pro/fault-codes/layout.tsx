import type { Metadata } from "next";

export const metadata: Metadata = {
  /*
   * page.tsx is 'use client' and cannot export metadata, so this URL inherited
   * app/solar-genius-pro/layout.tsx wholesale — including its hard-coded
   * canonical. Verified live as Googlebot on 2026-09-02: this page served
   * <link rel="canonical" href=".../solar-genius-pro"> and the parent's title,
   * i.e. it asked Google to drop it. It carries its own crawlable article
   * (SolarGeniusContent variant="fault-codes"), so it is worth indexing on its
   * own. See scripts/check-canonical-inheritance.mjs.
   */
  alternates: { canonical: 'https://www.emersoneims.com/solar-genius-pro/fault-codes' },
  // Root layout appends " | EmersonEIMS Kenya" (20 chars) — keep this <= 45.
  title: "Solar Inverter Fault Codes Explained",
  description:
    "What solar inverter fault codes mean and what to do about them: fault families, first checks and when the inverter is telling you about the array, not itself.",
};

export default function SolarFaultCodesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
