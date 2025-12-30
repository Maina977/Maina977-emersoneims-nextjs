import Image from 'next/image';

const PROJECTS = [
  {
    title: 'Industrial Generator Maintenance',
    detail: 'Preventive maintenance + load testing',
    tag: 'Generators',
    imageSrc: '/images/GEN%202-1920x1080.png',
  },
  {
    title: 'Hybrid Solar + Backup Power',
    detail: 'Solar integration with resilient backup',
    tag: 'Solar',
    imageSrc: '/images/solar%20power%20farms.png',
  },
  {
    title: 'Power Quality Diagnostics',
    detail: 'Root-cause analysis + corrective plan',
    tag: 'Diagnostics',
    imageSrc: '/images/Multimeter.png',
  },
  {
    title: 'Critical Site Commissioning',
    detail: 'Handover-ready documentation + training',
    tag: 'Commissioning',
    imageSrc: '/images/PERKINS-ENGINE-PARTS.jpg',
  },
  {
    title: 'Fuel Management Optimization',
    detail: 'Monitoring + controls to reduce loss',
    tag: 'Operations',
    imageSrc: '/images/solar%20changeover%20control.png',
  },
  {
    title: 'UPS & Power Backup Systems',
    detail: 'Sizing, install, and lifecycle support',
    tag: 'UPS',
    imageSrc: '/images/7320-1920x1080.png',
  },
] as const;

export default function ProjectGallery() {
  return (
    <section className="eims-section">
      <div className="eims-shell">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="eims-kicker">Project gallery</p>
            <h2 className="eims-title">
              A fast look at what we deliver
            </h2>
          </div>
          <p className="text-sm text-white/60 max-w-xl">
            Static, lightweight cards designed for speed—optimized images, no heavy sliders.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((p) => (
            <article
              key={p.title}
              className="group eims-card eims-card-hover overflow-hidden hover:bg-white/[0.04]"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={p.imageSrc}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 text-[0.65rem] tracking-[0.2em] uppercase text-white/80">
                  {p.tag}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-base font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">{p.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
