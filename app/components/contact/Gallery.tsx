'use client';

import React from 'react';

interface GalleryProps {
  performanceTier?: string;
}

export default function Gallery({ performanceTier }: GalleryProps) {
  return (
    <section className="gallery">
      <h3>Gallery</h3>
    </section>
  );
}
