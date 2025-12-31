import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solar Installation Kenya | Residential & Commercial Systems | EmersonEIMS",
  description: "Premium solar power systems in Kenya. 3kW-100kW+ complete installations. KPLC net metering approved. ROI in 3-5 years. Free site survey. Solar panels Kenya, solar energy Nairobi, Mombasa, Kisumu. Serving all 47 counties.",
  keywords: "solar installation Kenya, solar panels Kenya, solar system Kenya, solar power Kenya, solar company Kenya, solar power Nairobi, residential solar Kenya, commercial solar Kenya, solar battery backup Kenya, off grid solar Kenya, hybrid solar system Kenya, solar inverter Kenya, KPLC net metering",
};

export default function SolarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
