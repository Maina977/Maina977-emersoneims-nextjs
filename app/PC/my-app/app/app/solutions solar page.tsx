import SectionLead from "@/componets/generators/SectionLead";
import InfoCard from "@/components/InfoCard";
import CTAForm from "@/components/CTAForm";

export const metadata = {
  title: "Solar energy technical issues — EmersonEIMS solutions",
  description: "Shading, thermal derating, wiring losses, inverter clipping, instrumentation, and maintenance.",
  keywords: ["solar issues", "shading", "wiring", "clipping", "IV curve", "EmersonEIMS"],
};

export default function SolarIssuesPage() {
  return (
    <main>
      <SectionLead
        title="Solar energy technical issues"
        subtitle="Irradiance variance, shading, thermal derating, wiring losses, inverter clipping, and monitoring."
      />
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
