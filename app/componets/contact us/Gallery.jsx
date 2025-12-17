import React, { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";

export default function Gallery({ performanceTier }) {
  const root = useRef(null);
  const depth = useMemo(() => 
    performanceTier === "low" ? 8 : performanceTier === "medium" ? 16 : 24,
    [performanceTier]
  );

  useEffect(() => {
    if (!root.current) return;
    const panels = root.current.querySelectorAll(".panel");
    
    const initialAnim = gsap.fromTo(
      panels,
      { opacity: 0, y: 30, rotateY: -15 },
      { opacity: 1, y: 0, rotateY: 0, duration: 1.1, ease: "power2.out", stagger: 0.2 }
    );

    const hoverAnimations = Array.from(panels).map((panel, i) => 
      gsap.to(panel, {
        rotateY: 10,
        y: -10,
        duration: 3 + i,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      })
    );

    return () => {
      initialAnim.kill();
      hoverAnimations.forEach(anim => anim.kill());
    };
  }, [performanceTier, depth]);

  return (
    <section className="gallery section-pad" aria-labelledby="gallery-heading" ref={root}>
      <h2 id="gallery-heading">Visual Identity</h2>
      <div className="holographic-gallery">
        <figure className="panel" aria-label="Cummins generator image">
          <img
            src="https://www.emersoneims.com/wp-content/uploads/2025/11/50-kva-single-phase-cummins-diesel-generator-500x500-1920x1080-1.webp"
            alt="50kVA single-phase Cummins diesel generator"
            loading="lazy"
          />
          <figcaption>50kVA Cummins Generator</figcaption>
        </figure>
        <figure className="panel" aria-label="Brand SVG design 2">
          <img
            src="https://www.emersoneims.com/wp-content/uploads/2025/10/Untitled-design-2.svg"
            alt="Brand design vector 2"
            loading="lazy"
          />
          <figcaption>Futuristic Vector 2</figcaption>
        </figure>
        <figure className="panel" aria-label="Brand SVG design 7">
          <img
            src="https://www.emersoneims.com/wp-content/uploads/2025/10/Untitled-design-7.svg"
            alt="Brand design vector 7"
            loading="lazy"
          />
          <figcaption>Futuristic Vector 7</figcaption>
        </figure>
      </div>
    </section>
  );
}