import React, { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";

export default function HeroSection({ performanceTier }) {
  const root = useRef(null);

  const { glow, blur } = useMemo(() => {
    const glow = performanceTier === "low" ? 0.25 : performanceTier === "medium" ? 0.6 : 1;
    const blur = performanceTier === "low" ? 2 : performanceTier === "medium" ? 6 : 12;
    return { glow, blur };
  }, [performanceTier]);

  useEffect(() => {
    if (!root.current) return;
    const title = root.current.querySelector("h1");
    const cta = root.current.querySelector(".cta-glow");

    const tl = gsap.timeline();
    tl.fromTo(
      title,
      { opacity: 0, y: 30, filter: `blur(${blur / 2}px)` },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", filter: "blur(0px)" }
    );

    gsap.to(cta, {
      boxShadow: `0 0 ${12 * blur}px rgba(0,255,255,${glow})`,
      filter: `drop-shadow(0 0 ${blur}px rgba(0,255,255,${glow}))`,
      repeat: -1,
      yoyo: true,
      duration: 2.6,
      ease: "sine.inOut",
    });

    return () => {
      tl.kill();
      gsap.killTweensOf(cta);
    };
  }, [performanceTier, glow, blur]);

  return (
    <section className="hero hero--contact" role="banner" ref={root}>
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        aria-label="Nairobi skyline transforming into a neon digital grid"
      >
        <source src="https://www.emersoneims.com/wp-content/uploads/2025/10/Solution1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="hero-content">
        <h1>Connection is Power. Reach Us Anywhere.</h1>
        <button 
          className="cta-glow" 
          aria-label="Scroll to contact details" 
          onClick={() => {
            const el = document.getElementById("call-us");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        >
          contact
        </button>
      </div>
    </section>
  );
}
