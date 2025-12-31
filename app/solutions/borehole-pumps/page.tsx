import SectionLead from "../../components/generators/SectionLead";
import InfoCard from "@/components/InfoCard";
import CTAForm from "@/components/CTAForm";

export const metadata = {
  title: "Borehole pump systems & troubleshooting — EmersonEIMS solutions",
  description: "Submersible pumps, VFD controls, water level sensing, well yield, and motor failures.",
  keywords: ["borehole pump", "submersible", "VFD", "water well", "EmersonEIMS"],
};

export default function BoreholePumpsPage() {
  return (
    <main>
      <SectionLead
        title="Borehole pump systems & troubleshooting"
        subtitle="Submersible pumps, VFD controls, water level sensing, well yield, and motor failures."
      />
      <section className="mx-auto max-w-7xl px-6 pb-12 grid md:grid-cols-3 gap-6">
        <InfoCard title="Pump selection" items={[
          { label: "Flow rate", detail: "Demand calculation, peak usage, diversity factors" },
          { label: "Head", detail: "Static + dynamic lift, friction losses, system curve" },
          { label: "Motor", detail: "Rewindable vs Franklin/Grundfos sealed, cable sizing" },
          { label: "Stages", detail: "Multi-stage impeller design for high head applications" },
        ]}/>
        <InfoCard title="Common failures" items={[
          { label: "Motor burnout", detail: "Dry running, sand ingress, lightning, phase imbalance" },
          { label: "Cable damage", detail: "Insulation failure, splices, submergence rating" },
          { label: "Low yield", detail: "Drawdown exceeds recharge, well siltation, screen blockage" },
          { label: "Controls", detail: "Pressure switch, level sensor, VFD faults, contactor wear" },
        ]}/>
        <InfoCard title="VFD & automation" items={[
          { label: "Soft start", detail: "Reduce inrush, extend motor life, ramp profiles" },
          { label: "Pressure control", detail: "Closed-loop PID for constant pressure, energy savings" },
          { label: "Dry-run protection", detail: "Current monitoring, timer delays, auto restart logic" },
          { label: "Telemetry", detail: "GSM/SCADA for remote monitoring, alerts, data logging" },
        ]}/>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12"><CTAForm /></section>
    </main>
  );
}
