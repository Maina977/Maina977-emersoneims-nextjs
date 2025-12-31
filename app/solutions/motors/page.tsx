import SectionLead from "../../components/generators/SectionLead";
import InfoCard from "@/components/InfoCard";
import CTAForm from "@/components/CTAForm";
import OptimizedImage from "@/components/media/OptimizedImage";

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
      
      {/* Motor & Engine Parts Images */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-lg overflow-hidden border border-white/10">
            <OptimizedImage
              src="/images/Perkins-4000-Parts.webp"
              alt="Perkins Engine Parts"
              width={800}
              height={600}
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden border border-white/10">
            <OptimizedImage
              src="/images/PERKINS-ENGINE-PARTS.jpg"
              alt="Perkins Engine Components"
              width={800}
              height={600}
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden border border-white/10">
            <OptimizedImage
              src="/images/prima__91388__28242__47940.1692695563.1280.1280_512x444.webp"
              alt="Motor Parts and Components"
              width={800}
              height={600}
              className="w-full h-48 object-cover"
            />
          </div>
        </div>
      </section>
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
