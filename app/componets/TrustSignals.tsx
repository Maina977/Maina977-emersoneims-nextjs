'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Case {
  name: string;
}

export default function TrustSignals() {
  const cases: Case[] = []; // Add your cases data here

  return (
    <div>
      {cases.map((c, i) => (
        <motion.article
          key={c.name}
          initial={{ opacity: 0, y: 24 }}
          // Add your animation props here
        >
          {/* Your content */}
        </motion.article>
      ))}
    </div>
  );
}
