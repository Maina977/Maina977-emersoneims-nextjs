import SectionLead from "../components/generators/SectionLead";
import InfoCard from "@/components/InfoCard";
import CTAForm from "@/components/CTAForm";

export const metadata = {
  title: "Diesel tank & reservoir automation — EmersonEIMS solutions",
  description: "Level sensing, transfer pumps, leak detection, controls, and compliance.",
  keywords: ["diesel tank", "reservoir", "automation", "leak detection", "EmersonEIMS"],
};

export default function DieselAutomationPage() {
  return (
    <main>
      <SectionLead
        title="Diesel tank & reservoir automation"
        subtitle="Level sensing, transfer pumps, leak detection, controls, and compliance."
      />
      <section className="mx-auto max-w-7xl px-6 pb-12 grid md:grid-cols-3 gap-6">
        <InfoCard title="Sensing" items={[
          { label: "Level", detail: "Ultrasonic/magnetic float/pressure transducers" },
          { label: "Leak", detail: "Bund sensors, pipeline pressure monitoring" },
          { label: "Temperature", detail: "Viscosity considerations, seasonal calibration" },
          { label: "Alarms", detail: "High/low thresholds, fail‑safe logic" },
        ]}/>
        <InfoCard title="Control logic" items={[
          { label: "Transfer", detail: "Duty/standby pumps, interlocks, timers" },
          { label: "Fail‑safe", detail: "Default safe states, latching alarms" },
          { label: "Comms", detail: "Modbus/CAN integration with EMS/BMS" },
          { label: "Compliance", detail: "Spill plans, fire codes, venting" },
        ]}/>
        <InfoCard title="Maintenance" items={[
          { label: "Polishing", detail: "Periodic fuel polishing for stability" },
          { label: "Filters", detail: "Micron ratings and change intervals" },
          { label: "Testing", detail: "Hydrostatic tests, sensor calibration" },
          { label: "Records", detail: "Service logs to ensure traceability" },
        ]}/>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12"><CTAForm /></section>
    </main>
  );
}
