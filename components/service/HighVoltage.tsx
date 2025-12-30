type HighVoltageProps = {
  performanceTier?: string;
};

export default function HighVoltage({ performanceTier }: HighVoltageProps) {
  return (
    <div className="p-6" data-performance-tier={performanceTier}>
      <h2 className="text-2xl font-bold mb-4">High Voltage Systems</h2>
      <p className="text-gray-600 mb-6">
        Specialized high voltage electrical system services and maintenance.
      </p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>High voltage system installation and safety compliance services.</p>
      </div>
    </div>
  );
}