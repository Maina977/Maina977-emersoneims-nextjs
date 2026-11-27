'use client';
/**
 * CA-52 (2026-11-27, management): payment unlocking is not active in
 * production (the M-Pesa route has no Safaricom credentials and returns 503;
 * see the security sweep's M-Pesa customer-impact check). Where a report
 * unlock offers M-Pesa, the customer is told so plainly, with how to get the
 * report, instead of an error or a simulated payment.
 */
import React from 'react';
import { CONTACT } from '@/lib/constants/contact';

/** Payment unlocking stays off until server-side order validation is complete and management approves activation. */
export const PAYMENT_UNLOCK_AVAILABLE = false;

export const PAYMENT_UNAVAILABLE_TITLE = 'Payment unlocking is temporarily unavailable';
export const PAYMENT_UNAVAILABLE_TEXT =
  `Online payment (M-Pesa or card) cannot be taken at the moment, so no payment will be requested. To get this report, contact EmersonEIMS on ${CONTACT.PRIMARY_PHONE} (call or WhatsApp) or ${CONTACT.PRIMARY_EMAIL} and quote the report reference.`;

export function PaymentUnavailableNotice({ onClose, reference, freeAction }: {
  onClose: () => void;
  reference?: string;
  /** In free mode the report opens without payment. */
  freeAction?: () => void;
}) {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="payment-unavailable-title" data-testid="payment-unavailable"
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
      <div style={{ background: 'white', borderRadius: 12, maxWidth: 460, width: '100%', padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
        <h2 id="payment-unavailable-title" style={{ margin: '0 0 12px', fontSize: 18, color: '#1e293b' }}>{PAYMENT_UNAVAILABLE_TITLE}</h2>
        <p style={{ margin: '0 0 12px', fontSize: 14, color: '#334155', lineHeight: 1.5 }}>{PAYMENT_UNAVAILABLE_TEXT}</p>
        {reference && <p style={{ margin: '0 0 12px', fontSize: 13, color: '#475569' }}>Report reference: <strong>{reference}</strong></p>}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <a href={`https://wa.me/${CONTACT.PRIMARY_WHATSAPP}`} target="_blank" rel="noopener noreferrer"
            style={{ padding: '8px 14px', borderRadius: 8, background: '#16a34a', color: 'white', textDecoration: 'none', fontSize: 14 }}>WhatsApp EmersonEIMS</a>
          <a href={`mailto:${CONTACT.PRIMARY_EMAIL}${reference ? `?subject=${encodeURIComponent(`AquaScan report ${reference}`)}` : ''}`}
            style={{ padding: '8px 14px', borderRadius: 8, background: '#e2e8f0', color: '#1e293b', textDecoration: 'none', fontSize: 14 }}>Email us</a>
          {freeAction && (
            <button type="button" onClick={freeAction} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: '#3b82f6', color: 'white', fontSize: 14, cursor: 'pointer' }}>Open the report (free)</button>
          )}
          <button type="button" onClick={onClose} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #cbd5e1', background: 'white', fontSize: 14, cursor: 'pointer', marginLeft: 'auto' }}>Close</button>
        </div>
      </div>
    </div>
  );
}
