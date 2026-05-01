'use client';

// ✅ Explicit imports only — no global `React`

const SEOOverview = () => {
  return (
    <section aria-labelledby="overview-heading" className="py-24 px-4 bg-black">
      <div className="max-w-5xl mx-auto">
        <h2 id="overview-heading" className="text-3xl md:text-4xl font-black tracking-tight text-white mb-6">
          {/* Add your content here */}
        </h2>
      </div>
    </section>
  );
};

export default SEOOverview;

