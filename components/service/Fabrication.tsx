type FabricationProps = {
  performanceTier?: string;
};

export default function Fabrication({ performanceTier }: FabricationProps) {
  return (
    <div className="p-6" data-performance-tier={performanceTier}>
      <h2 className="text-2xl font-bold mb-4">Fabrication Services</h2>
      <p className="text-gray-600 mb-6">
        Custom metal fabrication and manufacturing services.
      </p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>Custom fabrication, welding, and assembly services.</p>
      </div>
    </div>
  );
}