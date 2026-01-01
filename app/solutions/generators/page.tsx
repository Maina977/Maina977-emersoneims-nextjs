import SectionLead from "../../components/generators/SectionLead";
import InfoCard from "@/components/InfoCard";
import CTAForm from "@/components/CTAForm";
import OptimizedImage from "@/components/media/OptimizedImage";
import { ServiceSchema } from "@/components/seo/StructuredData";

export const metadata = {
  title: "Diesel generator troubleshooting & maintenance — EmersonEIMS solutions",
  description: "Starting failures, control panel alarms, load capacity, governor hunting, fuel system issues, and preventive maintenance.",
  keywords: ["diesel generator", "troubleshooting", "maintenance", "DeepSea", "PowerWizard", "EmersonEIMS"],
};

export default function GeneratorsPage() {
  return (
    <main className="bg-black min-h-screen">
      <ServiceSchema 
        service="Diesel Generator Troubleshooting & Maintenance"
      />
      
      <SectionLead
        title="Diesel generator troubleshooting & maintenance"
        subtitle="Starting failures, control panel alarms, load capacity, governor hunting, fuel system issues, and preventive maintenance."
      />
      
      {/* Hero Image - Premium Style */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="relative h-[400px] sm:h-[500px] rounded-2xl overflow-hidden group shadow-2xl">
          <OptimizedImage
            src="/images/GEN 2-1920x1080.png"
            alt="Diesel Generator Installation"
            width={1920}
            height={1080}
            className="w-full h-full"
            priority
            enableHover={true}
            shadowIntensity="strong"
            hoverEffect="lift"
            borderStyle="accent"
            rounded="2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
          
          {/* Floating badge */}
          <div className="absolute bottom-6 left-6 flex items-center gap-3 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">20kVA - 2000kVA Available</span>
          </div>
        </div>
      </section>
      
      {/* Info Cards - Premium Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-12 grid md:grid-cols-3 gap-6">
        <InfoCard 
          title="Common issues" 
          variant="premium"
          items={[
            { label: "No start", detail: "Crank/no fire: fuel pressure, glow plugs, air supply" },
            { label: "Governor hunt", detail: "Speed sensor gap, droop settings, load steps" },
            { label: "Overheating", detail: "Coolant flow, radiator blockage, fan belt tension" },
            { label: "Low oil pressure", detail: "Level, viscosity, filter restriction, pump wear" },
          ]}
        />
        <InfoCard 
          title="Control systems" 
          variant="glow"
          items={[
            { label: "DeepSea", detail: "ECU health check, firmware updates, I/O configuration" },
            { label: "PowerWizard", detail: "Event logs, parameter tuning, comms troubleshooting" },
            { label: "Load sharing", detail: "Droop/isochronous mode, CT polarity, sync paralleling" },
            { label: "Remote monitoring", detail: "GSM/Ethernet gateways, alarm escalation, telemetry" },
          ]}
        />
        <InfoCard 
          title="Maintenance best practice" 
          variant="premium"
          items={[
            { label: "Scheduled", detail: "Oil/filter/coolant changes per OEM intervals" },
            { label: "Load bank testing", detail: "Monthly 80% load run to clear carbon, wet stacking" },
            { label: "Fuel polishing", detail: "Remove water/bio growth, test quality regularly" },
            { label: "Spares inventory", detail: "Filters, belts, batteries, sensors, gaskets" },
          ]}
        />
      </section>
      
      {/* Additional Equipment Images - Premium Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="w-8 h-[2px] bg-amber-500" />
          Equipment Gallery
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="group">
            <OptimizedImage
              src="/images/gen00011.jpg"
              alt="Generator Maintenance"
              width={800}
              height={600}
              className="w-full h-56"
              enableHover={true}
              shadowIntensity="medium"
              hoverEffect="lift"
              borderStyle="subtle"
              rounded="xl"
            />
            <p className="mt-3 text-gray-400 text-sm group-hover:text-amber-400 transition-colors">Professional Maintenance</p>
          </div>
          <div className="group">
            <OptimizedImage
              src="/images/tnpl-diesal-generator-1000x1000.webp"
              alt="Industrial Generator"
              width={800}
              height={600}
              className="w-full h-56"
              enableHover={true}
              shadowIntensity="medium"
              hoverEffect="scale"
              borderStyle="subtle"
              rounded="xl"
            />
            <p className="mt-3 text-gray-400 text-sm group-hover:text-amber-400 transition-colors">Industrial Grade Systems</p>
          </div>
          <div className="group">
            <OptimizedImage
              src="/images/ENGINE PARTS.png"
              alt="Generator Engine Parts"
              width={800}
              height={600}
              className="w-full h-56"
              enableHover={true}
              shadowIntensity="medium"
              hoverEffect="glow"
              borderStyle="subtle"
              rounded="xl"
            />
            <p className="mt-3 text-gray-400 text-sm group-hover:text-amber-400 transition-colors">Genuine Spare Parts</p>
          </div>
        </div>
      </section>
      
      <section className="mx-auto max-w-7xl px-6 pb-12"><CTAForm /></section>
    </main>
  );
}
