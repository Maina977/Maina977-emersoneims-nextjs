import SectionLead from "../../components/generators/SectionLead";
import InfoCard from "@/components/InfoCard";
import CTAForm from "@/components/CTAForm";

export const metadata = {
  title: "Motors & rewinding services — EmersonEIMS solutions",
  description: "AC/DC motors, rewinding, VFD compatibility, bearing failures, and insulation testing.",
  keywords: ["electric motors", "rewinding", "VFD", "bearing failure", "EmersonEIMS"],
};

export default function MotorsPage() {
  return (
    <main>
      <SectionLead
        title="Motors & rewinding services"
        subtitle="AC/DC motors, rewinding, VFD compatibility, bearing failures, and insulation testing."
      />
      <section className="mx-auto max-w-7xl px-6 pb-12 grid md:grid-cols-3 gap-6">
        <InfoCard title="Motor types" items={[
          { label: "Induction", detail: "Squirrel cage, wound rotor, single/three-phase" },
          { label: "Synchronous", detail: "PM, reluctance, excitation systems, power factor control" },
          { label: "DC", detail: "Shunt, series, compound, brush/brushless, armature/field" },
          { label: "Specialty", detail: "Servo, stepper, linear, torque motors, high-speed spindles" },
        ]}/>
        <InfoCard title="Common failures" items={[
          { label: "Bearings", detail: "Overheating, vibration, lubrication, shaft misalignment" },
          { label: "Windings", detail: "Insulation breakdown, overheating, phase imbalance, shorts" },
          { label: "Mechanical", detail: "Shaft wear, coupling damage, rotor bar cracks" },
          { label: "Electrical", detail: "Terminal connections, cable sizing, starter/contactor issues" },
        ]}/>
        <InfoCard title="Rewinding & testing" items={[
          { label: "Assessment", detail: "Insulation resistance, core loss, winding resistance" },
          { label: "Rewinding", detail: "Strip, insulate, wind, impregnate, bake, reassemble" },
          { label: "VFD-rated", detail: "Inverter-duty insulation, bearing currents, dv/dt protection" },
          { label: "Load testing", detail: "No-load/full-load tests, efficiency, temperature rise" },
        ]}/>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12"><CTAForm /></section>
    </main>
  );
}
