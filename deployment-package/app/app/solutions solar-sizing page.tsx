import SectionLead from "../components/generators/SectionLead";
import InfoCard from "@/components/InfoCard";
import CTAForm from "@/components/CTAForm";
import Link from "next/link";

export const metadata = {
  title: "Solar sizing guide — EmersonEIMS solutions",
  description: "Compute array size, battery autonomy, inverter capacity and surge headroom with proven formulas.",
  keywords: ["solar sizing", "battery autonomy", "inverter capacity", "panels", "EmersonEIMS"],
};

export default function SolarSizingPage() {
  return (
    <main>
      <SectionLead
        title="Solar sizing guide"
        subtitle="Compute array size, battery autonomy, inverter capacity and surge headroom with proven formulas."
      />
      <section className="mx-auto max-w-7xl px-6 pb-12 grid md:grid-cols-3 gap-6">
        <InfoCard title="Panels" items={[
          { label: "Array kW", detail: "daily kWh ÷ sun hours ÷ inverter efficiency" },
          { label: "Module count", detail: "Array kW × 1000 ÷ module W" },
          { label: "Tilt & azimuth", detail: "Latitude‑optimized tilt, true south alignment" },
          { label: "Losses", detail: "Soiling, mismatch, wiring — factor into design" },
        ]}/>
        <InfoCard title="Batteries" items={[
          { label: "Energy (kWh)", detail: "daily kWh × autonomy (hrs/24) ÷ DoD" },
          { label: "Chemistry", detail: "LFP for safety & cycles; thermal control for life" },
          { label: "BMS", detail: "Balancing, cutoff, comms integration, SOC accuracy" },
          { label: "Modules", detail: "Use modular blocks (e.g., 5kWh) for scalability" },
        ]}/>
        <InfoCard title="Inverters" items={[
          { label: "Capacity", detail: "peak kW × 1.2 headroom" },
          { label: "Surge", detail: "Check motor starts, compressors, medical loads" },
          { label: "MPPT", detail: "Align string voltage windows with MPPT range" },
          { label: "Efficiency", detail: "Select ≥96% and proven reliability models" },
        ]}/>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12 flex gap-4">
        <Link href="/calculator" prefetch className="sci-fi-button">Use master calculator</Link>
        <Link href="/comparison" prefetch className="sci-fi-outline">Compare ROI</Link>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12"><CTAForm /></section>
    </main>
  );
}
