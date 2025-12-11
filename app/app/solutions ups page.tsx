import SectionLead from "../componets/generators/SectionLead";
import InfoCard from "@/components/InfoCard";
import CTAForm from "@/components/CTAForm";

export const metadata = {
  title: "UPS systems — EmersonEIMS solutions",
  description: "Topology selection, battery health, runtime, transfer characteristics, and integration.",
  keywords: ["UPS", "double-conversion", "runtime", "battery health", "EmersonEIMS"],
};

export default function UPSSolutionsPage() {
  return (
    <main>
      <SectionLead
        title="UPS systems"
        subtitle="Topology selection, battery health, runtime, transfer characteristics and integration."
      />
      <section className="mx-auto max-w-7xl px-6 pb-12 grid md:grid-cols-3 gap-6">
        <InfoCard title="Topologies" items={[
          { label: "Offline/Standby", detail: "Basic protection, short transfer time" },
          { label: "Line‑interactive", detail: "Voltage regulation, moderate transfer" },
          { label: "Online double‑conversion", detail: "Best protection, zero transfer" },
          { label: "Modular", detail: "Scalable, hot‑swap capability" },
        ]}/>
        <InfoCard title="Battery health" items={[
          { label: "Chemistry", detail: "VRLA vs LFP; temperature control extends life" },
          { label: "Testing", detail: "Impedance, capacity tests, telemetry" },
          { label: "Runtime", detail: "Load profiling to match autonomy" },
          { label: "Replacement", detail: "Cycle/log-based proactive replacement" },
        ]}/>
        <InfoCard title="Integration" items={[
          { label: "Bypass", detail: "Maintenance & static bypass planning" },
          { label: "Coordination", detail: "Generator/inverter sync and sequencing" },
          { label: "Monitoring", detail: "SNMP/Modbus, alarm thresholds, logging" },
          { label: "Harmonics", detail: "Filters for THD management in critical loads" },
        ]}/>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12"><CTAForm /></section>
    </main>
  );
}