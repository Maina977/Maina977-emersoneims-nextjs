import SectionLead from "../../components/generators/SectionLead";
import InfoCard from "@/components/InfoCard";
import CTAForm from "@/components/CTAForm";
import OptimizedImage from "@/components/media/OptimizedImage";

export const metadata = {
  title: "DeepSea & PowerWizard controls — EmersonEIMS solutions",
  description: "Configuration, alarm troubleshooting, load sharing, remote monitoring, and firmware updates.",
  keywords: ["DeepSea", "PowerWizard", "DSE", "generator controls", "EmersonEIMS"],
};

export default function ControlsPage() {
  return (
    <main>
      <SectionLead
        title="DeepSea & PowerWizard controls"
        subtitle="Configuration, alarm troubleshooting, load sharing, remote monitoring, and firmware updates."
      />
      
      {/* Hero Control Panel Image */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="relative h-96 rounded-xl overflow-hidden">
          <OptimizedImage
            src="/images/7320-1920x1080.png"
            alt="DeepSea Control Panel"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12 grid md:grid-cols-3 gap-6">
        <InfoCard title="DeepSea modules" items={[
          { label: "DSE73xx series", detail: "Auto mains failure, load management, sync paralleling" },
          { label: "Configuration", detail: "DSE Configuration Suite, parameter upload/download" },
          { label: "Alarms", detail: "Event log analysis, sensor calibration, I/O diagnostics" },
          { label: "Comms", detail: "Modbus RTU/TCP, CAN J1939, Ethernet connectivity" },
        ]}/>
        <InfoCard title="PowerWizard" items={[
          { label: "Models", detail: "1.0, 1.1, 2.0, 2.1 — feature matrix & compatibility" },
          { label: "Setup", detail: "ServiceRanger software, ladder logic, custom I/O" },
          { label: "Troubleshooting", detail: "Fault codes, sensor validation, wiring checks" },
          { label: "Upgrades", detail: "Firmware flashing, hardware retrofits, license activation" },
        ]}/>
        <InfoCard title="Integration" items={[
          { label: "Load sharing", detail: "Droop/isochronous, kW/kVar control, cross-current comp" },
          { label: "BMS/SCADA", detail: "SCADA polling, BACnet gateways, alarm forwarding" },
          { label: "Remote access", detail: "GSM/4G modems, VPN tunnels, cloud dashboards" },
          { label: "Redundancy", detail: "Dual controllers, hot-standby logic, failover testing" },
        ]}/>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-12"><CTAForm /></section>
    </main>
  );
}
