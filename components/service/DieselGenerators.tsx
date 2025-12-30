type DieselGeneratorsProps = {
  performanceTier?: string;
};

export default function DieselGenerators({ performanceTier }: DieselGeneratorsProps) {
  return (
    <div className="p-6" data-performance-tier={performanceTier}>
      <h2 className="text-2xl font-bold mb-4">Diesel Generators</h2>
      <p className="text-gray-600 mb-6">
        Professional diesel generator installation, maintenance, and repair services.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3">Installation Services</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Complete system installation</li>
            <li>• Fuel system setup</li>
            <li>• Electrical integration</li>
            <li>• Testing and commissioning</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3">Maintenance Services</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Regular inspections</li>
            <li>• Oil and filter changes</li>
            <li>• Performance testing</li>
            <li>• Emergency repairs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}