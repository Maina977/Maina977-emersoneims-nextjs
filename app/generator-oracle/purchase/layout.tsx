import type { Metadata } from "next";

export const metadata: Metadata = {
  /*
   * A checkout screen, and right now not even that: with AI_TOOLS_FREE set it
   * renders "It's Free!" and points people back at the tool. Nothing here is a
   * search result, and every indexable word on it belongs to the section's
   * ToolSeoContent block. It inherited the parent canonical until 2026-09-02.
   * noindex + follow, with a SELF-canonical so the noindex cannot travel to
   * /generator-oracle — see app/solar-genius-pro/calculator-advanced/layout.tsx.
   */
  alternates: { canonical: 'https://www.emersoneims.com/generator-oracle/purchase' },
  title: "Generator Oracle Licence",
  robots: { index: false, follow: true },
};

export default function GeneratorOraclePurchaseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
