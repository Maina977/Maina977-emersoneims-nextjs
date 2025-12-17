'use client';

export default function FinalCTA() {
  return (
    <section className="py-24 bg-black text-center px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Ready to specify EmersonEIMS power?</h2>
        <p className="text-gray-300 mb-8">We’ll validate sizing with site profiles, harmonics, altitude, and duty cycle — then deliver and commission.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a data-magnet href="/contact" className="relative px-8 py-4 font-bold rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-black shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
            Request Proposal
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 ease-out" />
          </a>
          <a data-magnet href="/solutions" className="px-8 py-4 font-bold rounded-full border border-amber-500 text-amber-400 hover:bg-amber-500/10 focus:outline-none focus:ring-2 focus:ring-amber-500">
            Explore Solutions
          </a>
        </div>
      </div>
    </section>
  );
}
