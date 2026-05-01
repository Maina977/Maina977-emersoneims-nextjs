'use client';

import React from 'react';

interface ContactFormProps {
  performanceTier?: string;
}

export default function ContactForm({ performanceTier }: ContactFormProps) {
  return (
    <form className="contact-form">
      <h3>Send us a message</h3>
      <input type="text" placeholder="Name" />
      <input type="email" placeholder="Email" />
      <textarea placeholder="Message"></textarea>
      <button type="submit">Send</button>
    </form>
  );
}
