type MotorRewindingProps = {
  performanceTier?: string;
};

export default function MotorRewinding({ performanceTier }: MotorRewindingProps) {
  return (
    <div className="p-6" data-performance-tier={performanceTier}>
      <h2 className="text-2xl font-bold mb-4">Motor Rewinding</h2>
      <p className="text-gray-600 mb-6">
        Professional motor rewinding and repair services.
      </p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>Motor repair, rewinding, and testing services.</p>
      </div>
    </div>
  );
}