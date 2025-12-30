import Link from 'next/link';
import './HeroVideo.css';

export default function HeroVideo() {
  return (
    <>
      <section className="hero">
        <div className="video-container">
          <video 
            id="heroVideo" 
            autoPlay 
            muted 
            loop 
            playsInline
            preload="none"
            poster="/og-image.jpg"
            className="hero-video"
          >
            <source 
              src="/videos/FOR%20TRIALS%20IN%20KADENCE.mp4" 
              type="video/mp4" 
            />
          </video>
          <div className="video-overlay"></div>

          {/* Cinematic overlays (defined in HeroVideo.css) */}
          <div className="cinematic-effects" aria-hidden="true">
            <div className="noise" />
            <div className="scanlines" />
          </div>
        </div>

        <div className="hero-content-wrapper">
          <div className="hero-content">
            <div className="badge-container">
              <span className="badge">PREMIUM ENERGY SOLUTIONS</span>
            </div>

            <h1 className="hero-title">
              <span className="block text-white">RELIABLE POWER</span>
              <span className="block text-gradient">WITHOUT LIMITS</span>
            </h1>

            <p className="hero-description">
              Engineering excellence for East Africa's most critical infrastructure.
              <br className="hidden md:block" />
              From industrial generators to advanced solar grids.
            </p>

            <div className="cta-group">
              <Link href="/contact#assessment" className="btn-primary group">
                <span className="relative z-10">REQUEST SITE ASSESSMENT</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              </Link>
              <Link href="/contact#technical" className="btn-secondary group">
                <span className="relative z-10">SPEAK TO TECHNICAL TEAM</span>
                <span className="arrow group-hover:translate-x-1 transition-transform inline-block ml-2">→</span>
              </Link>
            </div>

            <div>
              <Link href="/brands" className="inline-flex items-center text-xs tracking-[0.24em] text-white/70 hover:text-white transition uppercase">
                Explore Brands
              </Link>
            </div>
          </div>
        </div>

        <div 
          className="scroll-indicator"
        >
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <span>SCROLL</span>
        </div>
      </section>
    </>
  );
}
