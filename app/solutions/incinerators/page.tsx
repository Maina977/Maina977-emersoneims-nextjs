import SectionLead from "../../components/generators/SectionLead";
import InfoCard from "@/components/InfoCard";
import CTAForm from "@/components/CTAForm";
import OptimizedImage from "@/components/media/OptimizedImage";

export const metadata = {
  title: "Incinerator controls & troubleshooting — EmersonEIMS solutions",
  description: "Burner controls, flue gas monitoring, temperature regulation, and compliance.",
  keywords: ["incinerator", "burner controls", "flue gas", "emissions", "EmersonEIMS"],
};

export default function IncineratorsPage() {
  return (
    <main>
      <SectionLead
        title="Incinerator controls & troubleshooting"
        subtitle="Burner controls, flue gas monitoring, temperature regulation, and compliance."
      />
      
      {/* Industrial Systems Images */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-lg overflow-hidden border border-white/10">
            <OptimizedImage
              src="/images/918.png"
              alt="Industrial Incinerator System 1"
              width={800}
              height={600}
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden border border-white/10">
            <OptimizedImage
              src="/images/919.png"
              alt="Industrial Incinerator System 2"
              width={800}
              height={600}
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden border border-white/10">
            <OptimizedImage
              src="/images/920.png"
              alt="Industrial Incinerator System 3"
              width={800}
              height={600}
              className="w-full h-48 object-cover"
            />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12 grid md:grid-cols-3 gap-6">
        <InfoCard title="Burner systems" items={[
          { label: "Ignition", detail: "Pilot/main flame detection, UV/IR sensors, safety lockout" },
          { label: "Fuel control", detail: "Air/fuel ratio, modulating valves, pressure regulation" },
          { label: "Temperature", detail: "Primary/secondary chambers, refractory limits, TC placement" },
          { label: "Sequencing", detail: "Pre-purge, ignition, run, post-purge, safety interlocks" },
        ]}/>
        <InfoCard title="Emissions & compliance" items={[
          { label: "Flue gas", detail: "O₂, CO, NOₓ, SOₓ, particulate monitoring, opacity" },
          { label: "Regulations", detail: "EPA/local standards, stack testing, record keeping" },
          { label: "Scrubbers", detail: "Wet/dry systems, neutralization, wastewater treatment" },
          { label: "Stack design", detail: "Height, diameter, draft, plume dispersion modeling" },
        ]}/>
        <InfoCard title="Maintenance & safety" items={[
          { label: "Refractory", detail: "Inspection cycles, patching, cure schedules, thermal shock" },
          { label: "Burner service", detail: "Nozzle cleaning, electrode gap, flame rod polishing" },
          { label: "Controls", detail: "PLC logic review, sensor calibration, alarm testing" },
          { label: "Emergency stop", detail: "E-stop circuits, fuel shut-off valves, fail-safe logic" },
        ]}/>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12"><CTAForm /></section>
    </main>
  );
}
