import type { Metadata } from "next";

export const metadata: Metadata = {
  /*
   * page.tsx is a 'use client' component and cannot export metadata, so this
   * URL inherited app/ai-tools/layout.tsx wholesale — same title AND
   * canonical ".../ai-tools" as the index. Verified live as Googlebot on
   * 2026-09-02: two URLs, one title, one canonical, 1,086 words of unique
   * content on this page voting to be ignored. A child layout's metadata
   * overrides the parent's.
   */
  alternates: { canonical: 'https://www.emersoneims.com/ai-tools/capabilities' },
  title: "What Each Engineering Tool Can Do",
  description:
    "Capability tables for the four EmersonEIMS engineering tools: what each one calculates, the data it draws on and what it covers. Free in-browser, no signup.",
  openGraph: {
    title: "Engineering Tool Capabilities — EmersonEIMS",
    description:
      "A complete breakdown of what each free EmersonEIMS engineering tool can and cannot do.",
    type: "website",
    locale: "en_KE",
  },
};

export default function ToolCapabilitiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
