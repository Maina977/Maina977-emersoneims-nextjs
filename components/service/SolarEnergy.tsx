type SolarEnergyProps = {
  performanceTier?: string;
};

export default function SolarEnergy({ performanceTier }: SolarEnergyProps) {
  return (
    <div className="p-6" data-performance-tier={performanceTier}>
      <h2 className="text-2xl font-bold mb-4">Solar Energy Systems</h2>
      <p className="text-gray-600 mb-6">
        Complete solar energy solutions for residential and commercial applications.
      </p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>Solar panel installation and maintenance services.</p>
      </div>
    </div>
  );
}