'use client';

export default function UPSSystems({ performanceTier = "high" }) {
  return (
    <section id="ups" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
          UPS Systems
        </h2>
        <p className="text-gray-300 text-lg">Uninterruptible power supply systems.</p>
      </div>
    </section>
  );
}
