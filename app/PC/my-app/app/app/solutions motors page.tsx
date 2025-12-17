import SectionLead from "@/componets/generators/SectionLead";
import InfoCard from "@/components/InfoCard";
import CTAForm from "@/components/CTAForm";

export const metadata = {
  title: "Motors & rewinding — EmersonEIMS solutions",
  description: "Diagnostics, winding checks, insulation, bearings, alignment, and energy optimization for motors.",
  keywords: ["motor rewinding", "insulation", "diagnostics", "efficiency", "EmersonEIMS"],
};

export default function MotorsPage() {
  return (
    <main>
      <SectionLead
        title="Motors & rewinding"
        subtitle="Diagnostics, winding checks, insulation, bearings, alignment, and energy optimization."
      />
      <section className="mx-auto max-w-7xl px-6 pb-12 grid md:grid-cols-3 gap-6">
        <InfoCard title="Diagnostics" items={[
          { label: "Insulation", detail: "IR tests, PI ratio, surge tests" },
          { label: "Winding", detail: "Resistance balance, turn‑to‑turn checks" },
          { label: "Mechanical", detail: "Bearing condition, shaft alignment" },
          { label: "Vibration", detail: "Spectrum analysis to identify faults" },
        ]}/>
        <InfoCard title="Rewinding" items={[
          { label: "Spec", detail: "Wire gauge, slot geometry, varnish quality" },
          { label: "Quality", detail: "Bake cycles, impregnation, test protocols" },
          { label: "Efficiency", detail: "Core losses & winding optimization" },
          { label: "Documentation", detail: "As‑built diagrams & test results" },
        ]}/>
        <InfoCard title="Optimization" items={[
          { label: "Power factor", detail: "Cap correction for inductive loads" },
          { label: "Soft starts", detail: "Limit mechanical stress & inrush" },
          { label: "Monitoring", detail: "Temperature, vibration telemetry" },
          { label: "Maintenance", detail: "Lubrication schedules & alignment" },
        ]}/>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12"><CTAForm /></section>
    </main>
  );
}
