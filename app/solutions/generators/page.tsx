import SectionLead from "../../components/generators/SectionLead";
import InfoCard from "@/components/InfoCard";
import CTAForm from "@/components/CTAForm";
import OptimizedImage from "@/components/media/OptimizedImage";

export const metadata = {
  title: "Diesel generator troubleshooting & maintenance — EmersonEIMS solutions",
  description: "Starting failures, control panel alarms, load capacity, governor hunting, fuel system issues, and preventive maintenance.",
  keywords: ["diesel generator", "troubleshooting", "maintenance", "DeepSea", "PowerWizard", "EmersonEIMS"],
};

export default function GeneratorsPage() {
  return (
    <main>
      <SectionLead
        title="Diesel generator troubleshooting & maintenance"
        subtitle="Starting failures, control panel alarms, load capacity, governor hunting, fuel system issues, and preventive maintenance."
      />
      
      {/* Hero Image */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="relative h-96 rounded-xl overflow-hidden">
          <OptimizedImage
            src="/images/GEN 2-1920x1080.png"
            alt="Diesel Generator Installation"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12 grid md:grid-cols-3 gap-6">
        <InfoCard title="Common issues" items={[
          { label: "No start", detail: "Crank/no fire: fuel pressure, glow plugs, air supply" },
          { label: "Governor hunt", detail: "Speed sensor gap, droop settings, load steps" },
          { label: "Overheating", detail: "Coolant flow, radiator blockage, fan belt tension" },
          { label: "Low oil pressure", detail: "Level, viscosity, filter restriction, pump wear" },
        ]}/>
        <InfoCard title="Control systems" items={[
          { label: "DeepSea", detail: "ECU health check, firmware updates, I/O configuration" },
          { label: "PowerWizard", detail: "Event logs, parameter tuning, comms troubleshooting" },
          { label: "Load sharing", detail: "Droop/isochronous mode, CT polarity, sync paralleling" },
          { label: "Remote monitoring", detail: "GSM/Ethernet gateways, alarm escalation, telemetry" },
        ]}/>
        <InfoCard title="Maintenance best practice" items={[
          { label: "Scheduled", detail: "Oil/filter/coolant changes per OEM intervals" },
          { label: "Load bank testing", detail: "Monthly 80% load run to clear carbon, wet stacking" },
          { label: "Fuel polishing", detail: "Remove water/bio growth, test quality regularly" },
          { label: "Spares inventory", detail: "Filters, belts, batteries, sensors, gaskets" },
        ]}/>
      </section>
      
      {/* Additional Equipment Images */}
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-lg overflow-hidden border border-white/10">
            <OptimizedImage
              src="/images/gen00011.jpg"
              alt="Generator Maintenance"
              width={800}
              height={600}
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden border border-white/10">
            <OptimizedImage
              src="/images/tnpl-diesal-generator-1000x1000.webp"
              alt="Industrial Generator"
              width={800}
              height={600}
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden border border-white/10">
            <OptimizedImage
              src="/images/ENGINE PARTS.png"
              alt="Generator Engine Parts"
              width={800}
              height={600}
              className="w-full h-48 object-cover"
            />
          </div>
        </div>
      </section>
      
      <section className="mx-auto max-w-7xl px-6 pb-12"><CTAForm /></section>
    </main>
  );
}
