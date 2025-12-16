'use client';

import React, { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";

export default function VisitUs({ performanceTier }) {
  const root = useRef(null);
  const pulse = useMemo(() => 
    performanceTier === "low" ? 0.4 : performanceTier === "medium" ? 0.7 : 1,
    [performanceTier]
  );

  useEffect(() => {
    if (!root.current) return;
    const hub = root.current.querySelector(".nairobi-hub");
    const animation = gsap.to(hub, {
      boxShadow: `0 0 ${20 * pulse}px rgba(0,255,255,${pulse})`,
      scale: 1.05,
      repeat: -1,
      yoyo: true,
      duration: 1.8,
      ease: "sine.inOut",
    });

    return () => {
      animation.kill();
    };
  }, [pulse]);

  return (
    <section className="visit-us section-pad" aria-labelledby="visit-us-heading" ref={root}>
      <h2 id="visit-us-heading">Visit Us</h2>
      <address>
        P.O. Box 387-00521, Old North Airport Road, Nairobi
      </address>

      <div className="map-wrap" aria-label="Interactive map of Kenya">
        <div className="kenya-map neon-grid">
          <div className="nairobi-hub" aria-label="Nairobi hub" />
        </div>
      </div>
    </section>
  );
}













