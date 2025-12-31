import SectionLead from "../../components/generators/SectionLead";
import InfoCard from "@/components/InfoCard";
import CTAForm from "@/components/CTAForm";

export const metadata = {
  title: "Power interruptions & quality issues — EmersonEIMS solutions",
  description: "Voltage sags, surges, harmonics, power factor, flicker, and mitigation strategies.",
  keywords: ["power quality", "interruptions", "harmonics", "voltage sag", "EmersonEIMS"],
};

export default function PowerInterruptionsPage() {
  return (
    <main>
      <SectionLead
        title="Power interruptions & quality issues"
        subtitle="Voltage sags, surges, harmonics, power factor, flicker, and mitigation strategies."
      />
      <section className="mx-auto max-w-7xl px-6 pb-12 grid md:grid-cols-3 gap-6">
        <InfoCard title="Disturbance types" items={[
          { label: "Sags/dips", detail: "Short-duration under-voltage, motor starting, faults" },
          { label: "Surges/swells", detail: "Over-voltage transients, lightning, switching events" },
          { label: "Outages", detail: "Complete loss: grid failure, tripping, maintenance" },
          { label: "Flicker", detail: "Voltage fluctuations affecting lighting and sensitive loads" },
        ]}/>
        <InfoCard title="Power quality" items={[
          { label: "Harmonics", detail: "THD from non-linear loads, filters, transformer derating" },
          { label: "Power factor", detail: "Lagging/leading, capacitor banks, active correction" },
          { label: "Transients", detail: "SPDs, MOVs, earthing, electromagnetic compatibility" },
          { label: "Monitoring", detail: "PQ analyzers, continuous logging, IEC 61000 compliance" },
        ]}/>
        <InfoCard title="Mitigation" items={[
          { label: "UPS", detail: "Online double-conversion for critical loads" },
          { label: "Generators", detail: "Auto-transfer, load sequencing, islanding capability" },
          { label: "Filters", detail: "Passive/active harmonic filters, line reactors" },
          { label: "Design", detail: "Oversizing transformers, dedicated feeders, isolation" },
        ]}/>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12"><CTAForm /></section>
    </main>
  );
}
