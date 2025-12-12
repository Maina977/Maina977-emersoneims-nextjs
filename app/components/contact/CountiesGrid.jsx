'use client';

import React, { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";

const counties = [
  "Mombasa","Kwale","Kilifi","Tana River","Lamu","Taita Taveta","Garissa","Wajir","Mandera","Marsabit",
  "Isiolo","Meru","Tharaka Nithi","Embu","Kitui","Machakos","Makueni","Nyandarua","Nyeri","Kirinyaga",
  "Murang'a","Kiambu","Turkana","West Pokot","Samburu","Trans Nzoia","Uasin Gishu","Elgeyo Marakwet","Nandi","Baringo",
  "Laikipia","Nakuru","Narok","Kajiado","Kericho","Bomet","Kakamega","Vihiga","Bungoma","Busia",
  "Siaya","Kisumu","Homa Bay","Migori","Kisii","Nyamira","Nairobi"
];

export default function CountiesGrid({ performanceTier }) {
  const root = useRef(null);
  const stagger = useMemo(() => 
    performanceTier === "low" ? 0.04 : performanceTier === "medium" ? 0.03 : 0.02,
    [performanceTier]
  );

  useEffect(() => {
    if (!root.current) return;
    const tiles = root.current.querySelectorAll(".county-tile");
    const animation = gsap.fromTo(
      tiles,
      { opacity: 0.4, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out", stagger }
    );

    return () => {
      animation.kill();
    };
  }, [performanceTier, stagger]);

  return (
    <section className="counties-grid section-pad" aria-labelledby="counties-heading" ref={root}>
      <h2 id="counties-heading">Our Reach Across Kenya</h2>
      <div className="grid" role="grid" aria-label="Kenya counties">
        {counties.map((county) => (
          <div
            key={county}
            role="gridcell"
            className="county-tile"
            tabIndex={0}
            aria-label={`${county} county service availability`}
          >
            <h3>{county}</h3>
            <p>Service Available</p>
          </div>
        ))}
      </div>
    </section>
  );
}


