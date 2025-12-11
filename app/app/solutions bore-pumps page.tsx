import SectionLead from "../componets/generators/SectionLead";
import InfoCard from "@/components/InfoCard";
import CTAForm from "@/components/CTAForm";

export const metadata = {
  title: "Borehole pumps — EmersonEIMS solutions",
  description: "Hydraulic sizing, motor protection, VFDs, power quality, and maintenance regimes.",
  keywords: ["borehole pump", "hydraulic sizing", "NPSH", "VFD", "EmersonEIMS"],
};

export default function BoreholePumpsPage() {
  return (
    <main>
      <SectionLead
        title="Borehole pumps"
        subtitle="Hydraulic sizing, motor protection, VFDs, power quality, and maintenance regimes."
      />
      <section className="mx-auto max-w-7xl px-6 pb-12 grid md:grid-cols-3 gap-6">
        <InfoCard title="Hydraulics" items={[
          { label: "Head & flow", detail: "Static head, friction losses, pump curves" },
          { label: "NPSH", detail: "Avoid cavitation; suction design & strainers" },
          { label: "Pipe sizing", detail: "Velocity control and friction balancing" },
          { label: "Valves", detail: "Check valves & pressure relief placements" },
        ]}/>
        <InfoCard title="Electrical" items={[
          { label: "Motor starts", detail: "Soft‑starter/VFD to limit inrush" },
          { label: "Protection", detail: "Overload, under‑voltage, phase loss" },
          { label: "Cabling", detail: "Insulation, submersible ratings, splices" },
          { label: "Earthing", detail: "Bonding & SPD for surge environments" },
        ]}/>
        <InfoCard title="Maintenance" items={[
          { label: "Screens", detail: "Well screen inspection & cleaning" },
          { label: "Seals", detail: "Mechanical seal checks & replacements" },
          { label: "Bearings", detail: "Vibration analysis for predictive maintenance" },
          { label: "Water quality", detail: "Sediment & mineral management" },
        ]}/>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12"><CTAForm /></section>
    </main>
  );
}