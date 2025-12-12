'use client';

// ✅ Explicit imports only — no global `React`
import { useState } from 'react';

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq-section">
      {/* your JSX */}
    </div>
  );
};

export default FAQs; // ✅ default export matches `import FAQs from ...`

