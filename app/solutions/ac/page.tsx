import SectionLead from "../../components/generators/SectionLead";
import InfoCard from "@/components/InfoCard";
import CTAForm from "@/components/CTAForm";
import OptimizedImage from "@/components/media/OptimizedImage";

export const metadata = {
  title: "Air conditioning troubleshooting & efficiency — EmersonEIMS solutions",
  description: "Refrigerant leaks, compressor failures, airflow issues, controls, and energy optimization.",
  keywords: ["air conditioning", "AC troubleshooting", "HVAC", "refrigeration", "EmersonEIMS"],
};

export default function ACPage() {
  return (
    <main>
      <SectionLead
        title="Air conditioning troubleshooting & efficiency"
        subtitle="Refrigerant leaks, compressor failures, airflow issues, controls, and energy optimization."
      />
      
      {/* HVAC Equipment Images */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-lg overflow-hidden border border-white/10">
            <OptimizedImage
              src="/images/909.png"
              alt="HVAC System 1"
              width={800}
              height={600}
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden border border-white/10">
            <OptimizedImage
              src="/images/910.png"
              alt="HVAC System 2"
              width={800}
              height={600}
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden border border-white/10">
            <OptimizedImage
              src="/images/911.png"
              alt="HVAC System 3"
              width={800}
              height={600}
              className="w-full h-48 object-cover"
            />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12 grid md:grid-cols-3 gap-6">
        <InfoCard title="Common failures" items={[
          { label: "Refrigerant leaks", detail: "Leak detection, recovery, vacuum, recharge, pressure test" },
          { label: "Compressor", detail: "Overheating, seized, electrical faults, oil contamination" },
          { label: "Airflow", detail: "Blocked filters, fan failures, duct leakage, low CFM" },
          { label: "Controls", detail: "Thermostat faults, sensor drift, sequencing logic errors" },
        ]}/>
        <InfoCard title="Diagnostics" items={[
          { label: "Pressures", detail: "Subcooling/superheat analysis, TEV adjustment" },
          { label: "Electrical", detail: "Compressor/fan motor current, capacitor testing" },
          { label: "Temperature", detail: "Split differential, evaporator/condenser deltas" },
          { label: "Tools", detail: "Manifold gauges, multimeter, clamp meter, leak detectors" },
        ]}/>
        <InfoCard title="Optimization" items={[
          { label: "Energy", detail: "VFD on fans/compressors, economizer cycles, setpoint tuning" },
          { label: "Maintenance", detail: "Filter changes, coil cleaning, belt inspection, refrigerant check" },
          { label: "Upgrades", detail: "High-SEER units, inverter tech, smart controls, zoning" },
          { label: "Monitoring", detail: "BMS integration, real-time alarms, trend analysis" },
        ]}/>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12"><CTAForm /></section>
    </main>
  );
}
