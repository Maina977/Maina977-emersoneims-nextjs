type WaterSystemsProps = {
  performanceTier?: string;
};

export default function WaterSystems({ performanceTier }: WaterSystemsProps) {
  return (
    <div className="p-6" data-performance-tier={performanceTier}>
      <h2 className="text-2xl font-bold mb-4">Water Systems</h2>
      <p className="text-gray-600 mb-6">
        Water treatment and purification system services.
      </p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>Water system installation, maintenance, and repair services.</p>
      </div>
    </div>
  );
}