import SectionLead from "@/componets/generators/SectionLead";
import InfoCard from "@/components/InfoCard";
import CTAForm from "@/components/CTAForm";

export const metadata = {
  title: "Diesel generators — EmersonEIMS solutions",
  description: "Root-cause diagnostics, mechanical issues, preventive maintenance, and performance tuning for diesel generators.",
  keywords: ["diesel generator", "maintenance", "AVR", "governor", "fuel system", "EmersonEIMS"],
};

export default function GeneratorsSolutionsPage() {
  return (
    <main>
      <SectionLead
        title="Diesel generators"
        subtitle="Diagnostics, mechanical issues, preventive maintenance, and performance tuning."
      />

      <section className="mx-auto max-w-7xl px-6 pb-12 grid md:grid-cols-3 gap-6">
        <InfoCard
          title="Common issues"
          items={[
            { label: "Hard start", detail: "Air in fuel, weak batteries, injector fouling, low compression" },
            { label: "Hunting RPM", detail: "Governor tuning, fuel rail pressure fluctuation, load steps" },
            { label: "Overheating", detail: "Radiator fouling, coolant restriction, fan belt slip, airflow" },
            { label: "Excess smoke", detail: "Timing deviation, injector leak, turbo underperformance" },
          ]}
        />
        <InfoCard
          title="Mechanical solutions"
          items={[
            { label: "Fuel system", detail: "Bleed lines, replace filters, calibrate injectors, check lift pump" },
            { label: "Cooling", detail: "Radiator flush, thermostat check, shroud integrity, airflow path" },
            { label: "Lubrication", detail: "Oil analysis, correct viscosity, pressure relief check" },
            { label: "Vibration", detail: "Balance, mount condition, alignment, resonance mitigation" },
          ]}
        />
        <InfoCard
          title="Maintenance protocols"
          items={[
            { label: "Daily", detail: "Visual checks, fluid levels, leaks, battery terminals" },
            { label: "Monthly", detail: "Oil analysis, belts, hoses, control logs" },
            { label: "Quarterly", detail: "Load bank test, AVR check, governor tune" },
            { label: "Annually", detail: "Overhaul inspection, coolant service, fuel polishing" },
          ]}
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <CTAForm />
      </section>
    </main>
  );
}
