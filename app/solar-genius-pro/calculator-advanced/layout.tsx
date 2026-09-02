import type { Metadata } from "next";

export const metadata: Metadata = {
  /*
   * APP SCREEN, NOT A LANDING PAGE.
   * page.tsx mounts a dynamic() component with ssr:false, so a crawler sees no
   * calculator at all — every word in this URL's HTML comes from the
   * ToolSeoContent block that app/solar-genius-pro/layout.tsx renders for the
   * section. That is the parent's content, duplicated here.
   *
   * Before 2026-09-02 this URL inherited the parent's canonical, which pointed
   * at /solar-genius-pro. That is the one combination never to ship: a page
   * that also carries noindex must NOT canonicalise to another URL, because
   * Google can carry the noindex across to the target. So: noindex to keep a
   * duplicate app screen out of the index, follow so the links still count,
   * and a SELF-referential canonical that cannot poison the parent.
   */
  alternates: { canonical: 'https://www.emersoneims.com/solar-genius-pro/calculator-advanced' },
  title: "Advanced Solar Calculator",
  robots: { index: false, follow: true },
};

export default function SolarCalculatorAdvancedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
