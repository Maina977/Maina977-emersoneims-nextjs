'use client';

import React, { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";

export default function CallUs({ performanceTier }) {
  const root = useRef(null);
  const rippleScale = useMemo(() => 
    performanceTier === "low" ? 1 : performanceTier === "medium" ? 1.3 : 1.6,
    [performanceTier]
  );

  useEffect(() => {
    if (!root.current) return;
    const orbs = root.current.querySelectorAll(".orb");
    const animations = Array.from(orbs).map((orb, i) => 
      gsap.fromTo(
        orb,
        { scale: 0.9, opacity: 0.7 },
        { scale: 1, opacity: 1, duration: 0.8 + i * 0.2, ease: "power3.out" }
      )
    );

    return () => {
      animations.forEach(anim => anim.kill());
    };
  }, [performanceTier]);

  return (
    <section id="call-us" className="call-us section-pad" aria-labelledby="call-us-heading" ref={root}>
      <h2 id="call-us-heading">Call Us</h2>
      <div className="orb-buttons" role="group" aria-label="Phone numbers">
        <button
          className="orb"
          aria-label="Call 0768 860 655"
          onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: rippleScale, duration: 0.3 })}
          onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
          onClick={() => (window.location.href = "tel:+254768860665")}
        >
          0768 860 655
        </button>
        <button
          className="orb"
          aria-label="Call 0782914717"
          onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: rippleScale, duration: 0.3 })}
          onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
          onClick={() => (window.location.href = "tel:+254782914717")}
        >
          0782914717
        </button>
      </div>
    </section>
  );
}

