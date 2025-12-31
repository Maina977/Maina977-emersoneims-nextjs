import SectionLead from "../../components/generators/SectionLead";
import InfoCard from "@/components/InfoCard";
import CTAForm from "@/components/CTAForm";
import OptimizedImage from "@/components/media/OptimizedImage";
import { ServiceSchema } from "@/components/seo/StructuredData";

export const metadata = {
  title: "Solar energy technical issues — EmersonEIMS solutions",
  description: "Shading, thermal derating, wiring losses, inverter clipping, instrumentation, and maintenance.",
  keywords: ["solar issues", "shading", "wiring", "clipping", "IV curve", "EmersonEIMS"],
};

export default function SolarIssuesPage() {
  return (
    <main>
      <ServiceSchema 
        service="Solar Power System Diagnostics & Optimization"
      />
      
      <SectionLead
        title="Solar energy technical issues"
        subtitle="Irradiance variance, shading, thermal derating, wiring losses, inverter clipping, and monitoring."
      />
      
      {/* Solar Farm Images */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative h-80 rounded-xl overflow-hidden">
            <OptimizedImage
              src="/solar power farms.png"
              alt="Solar Power Farm Installation"
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div className="relative h-80 rounded-xl overflow-hidden">
            <OptimizedImage
              src="/solar power for farms.png"
              alt="Solar Power for Agricultural Farms"
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12 grid md:grid-cols-3 gap-6">
        <InfoCard title="Root causes" items={[
          { label: "Shading", detail: "String design, bypass diodes, MLPE for partial shade" },
          { label: "Heat", detail: "Temp coefficient, airflow under arrays, module selection" },
          { label: "Wiring", detail: "Cross‑section sizing, run length, terminations, torque" },
          { label: "Clipping", detail: "DC:AC ratio alignment with site irradiance" },
        ]}/>
        <InfoCard title="Instrumentation" items={[
          { label: "Monitoring", detail: "Per‑string metering, inverter telemetry, alerts" },
          { label: "Verification", detail: "IV curve tracing, thermography, insulation testing" },
          { label: "Benchmark", detail: "Performance ratio, yield comparisons, baselining" },
          { label: "Maintenance", detail: "Cleaning regimes adjusted to environment" },
        ]}/>
        <InfoCard title="Design fixes" items={[
          { label: "Module choice", detail: "Efficiency vs temp coef, glass quality, warranty" },
          { label: "Stringing", detail: "Voltage windows, MPPT range, balanced strings" },
          { label: "Layout", detail: "Row spacing, tilt vs latitude, shading analysis" },
          { label: "Protection", detail: "DC fuses, SPD, earthing, combiner design" },
        ]}/>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12"><CTAForm /></section>
    </main>
  );
}
