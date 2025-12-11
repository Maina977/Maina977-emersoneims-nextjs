import SectionLead from "../componets/generators/SectionLead";
import InfoCard from "@/components/InfoCard";
import CTAForm from "@/components/CTAForm";

export const metadata = {
  title: "Incinerators control — EmersonEIMS solutions",
  description: "Combustion control, temperature monitoring, air flow management, and safety interlocks.",
  keywords: ["incinerator", "combustion control", "PID", "opacity", "EmersonEIMS"],
};

export default function IncineratorsPage() {
  return (
    <main>
      <SectionLead
        title="Incinerators control"
        subtitle="Combustion control, temperature monitoring, air flow management, and safety interlocks."
      />
      <section className="mx-auto max-w-7xl px-6 pb-12 grid md:grid-cols-3 gap-6">
        <InfoCard title="Combustion" items={[
          { label: "Primary/secondary air", detail: "Stoichiometry & emissions control" },
          { label: "Fuel feed", detail: "Rate control, consistency, moisture effects" },
          { label: "Temperature", detail: "PID loops, multi‑zone monitoring" },
          { label: "Safety", detail: "Door interlocks, emergency shutdown logic" },
        ]}/>
        <InfoCard title="Instrumentation" items={[
          { label: "Thermocouples", detail: "Calibration, positioning, shielding" },
          { label: "Pressure", detail: "Draft measurement for stable combustion" },
          { label: "Opacity", detail: "Stack monitoring and compliance" },
          { label: "Logging", detail: "Event & trend logs for audits" },
        ]}/>
        <InfoCard title="Maintenance" items={[
          { label: "Refractory", detail: "Inspection and timely relining" },
          { label: "Fans", detail: "Bearings, balance, belt inspection" },
          { label: "Seals", detail: "Door seals & leak checks to maintain draft" },
          { label: "Cleanup", detail: "Ash handling procedures & PPE" },
        ]}/>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12"><CTAForm /></section>
    </main>
  );
}