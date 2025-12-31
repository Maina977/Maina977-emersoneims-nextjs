import SectionLead from "../../components/generators/SectionLead";
import InfoCard from "@/components/InfoCard";
import CTAForm from "@/components/CTAForm";
import OptimizedImage from "@/components/media/OptimizedImage";

export const metadata = {
  title: "UPS systems troubleshooting & maintenance — EmersonEIMS solutions",
  description: "Battery failures, bypass issues, alarms, load capacity, and preventive maintenance.",
  keywords: ["UPS", "uninterruptible power supply", "battery", "bypass", "EmersonEIMS"],
};

export default function UPSPage() {
  return (
    <main>
      <SectionLead
        title="UPS systems troubleshooting & maintenance"
        subtitle="Battery failures, bypass issues, alarms, load capacity, and preventive maintenance."
      />
      
      {/* UPS Systems Images */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-lg overflow-hidden border border-white/10">
            <OptimizedImage
              src="/images/912.png"
              alt="UPS Power System 1"
              width={800}
              height={600}
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden border border-white/10">
            <OptimizedImage
              src="/images/913.png"
              alt="UPS Power System 2"
              width={800}
              height={600}
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden border border-white/10">
            <OptimizedImage
              src="/images/914.png"
              alt="UPS Power System 3"
              width={800}
              height={600}
              className="w-full h-48 object-cover"
            />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12 grid md:grid-cols-3 gap-6">
        <InfoCard title="UPS topologies" items={[
          { label: "Standby/offline", detail: "Basic protection, switching time ~10ms, low cost" },
          { label: "Line-interactive", detail: "AVR, battery backup, mid-range applications" },
          { label: "Online/double-conversion", detail: "Zero transfer time, full isolation, critical loads" },
          { label: "Modular/scalable", detail: "N+1 redundancy, hot-swap modules, high availability" },
        ]}/>
        <InfoCard title="Common issues" items={[
          { label: "Battery failure", detail: "Aging, thermal runaway, sulfation, capacity loss" },
          { label: "Bypass mode", detail: "Stuck in bypass, overload, inverter fault, manual transfer" },
          { label: "Alarms", detail: "Overload, battery low, overtemp, input/output faults" },
          { label: "Load capacity", detail: "Insufficient sizing, inrush current, power factor" },
        ]}/>
        <InfoCard title="Maintenance" items={[
          { label: "Battery testing", detail: "Discharge test, impedance measurement, replacement schedule" },
          { label: "Calibration", detail: "Runtime verification, load bank testing, self-test cycles" },
          { label: "Monitoring", detail: "SNMP cards, cloud dashboards, predictive analytics" },
          { label: "Spares", detail: "Batteries, fans, capacitors, control boards, firmware backups" },
        ]}/>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12"><CTAForm /></section>
    </main>
  );
}
