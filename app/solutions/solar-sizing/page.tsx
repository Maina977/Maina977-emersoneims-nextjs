import SectionLead from "../../components/generators/SectionLead";
import InfoCard from "@/components/InfoCard";
import CTAForm from "@/components/CTAForm";
import Link from "next/link";

export const metadata = {
  title: "Solar sizing calculator & design — EmersonEIMS solutions",
  description: "Load analysis, panel selection, inverter sizing, battery storage, and system optimization.",
  keywords: ["solar sizing", "calculator", "PV design", "battery storage", "EmersonEIMS"],
};

export default function SolarSizingPage() {
  return (
    <main>
      <SectionLead
        title="Solar sizing calculator & design"
        subtitle="Load analysis, panel selection, inverter sizing, battery storage, and system optimization."
      />
      <section className="mx-auto max-w-7xl px-6 pb-12 grid md:grid-cols-3 gap-6">
        <InfoCard title="Load analysis" items={[
          { label: "Energy audit", detail: "Daily kWh, peak kW, power factor, diversity" },
          { label: "Profiles", detail: "Time-of-use patterns, seasonal variation, future growth" },
          { label: "Criticality", detail: "Essential vs non-essential loads, backup duration" },
          { label: "Efficiency", detail: "Identify savings before sizing to reduce capital cost" },
        ]}/>
        <InfoCard title="System design" items={[
          { label: "Array sizing", detail: "Peak sun hours, derating factors, shading losses" },
          { label: "Inverter", detail: "DC:AC ratio, MPPT count, voltage window, surge capacity" },
          { label: "Battery", detail: "Depth of discharge, cycle life, autonomy days, C-rating" },
          { label: "Balance of system", detail: "Racking, wiring, protection, monitoring, earthing" },
        ]}/>
        <InfoCard title="Tools & validation" items={[
          { label: "Calculator", detail: "Use our solar sizing tool for quick estimates" },
          { label: "Software", detail: "PVsyst, Helioscope, SAM for detailed modeling" },
          { label: "ROI analysis", detail: "Payback period, NPV, LCOE, avoided emissions" },
          { label: "Compliance", detail: "Grid codes, electrical standards, safety approvals" },
        ]}/>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">Use our solar calculator</h3>
          <p className="text-white/70 mb-4">
            Get instant sizing estimates for your solar PV system based on your location, load, and budget.
          </p>
          <Link href="/calculator" className="sci-fi-button inline-block">
            Open solar calculator
          </Link>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12"><CTAForm /></section>
    </main>
  );
}
