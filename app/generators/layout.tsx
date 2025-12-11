import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cummins Generators — Powering Kenya | EmersonEIMS",
  description: "From 20kVA to 2000kVA, verified specs, Hollywood‑grade visuals, and engineering mastery.",
};

export default function GeneratorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


