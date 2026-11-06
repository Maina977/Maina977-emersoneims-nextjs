/**
 * Re-audit 6 Nov 2026, "lead conversion tracking not verified".
 * An enquiry the server accepts fires GA4 `generate_lead` exactly once, with
 * the service and source only: no name, phone, email or message.
 * A rejected submission and an unrelated request fire nothing.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('next/navigation', () => ({ usePathname: () => '/contact' }));

import AnalyticsTracker from '@/components/AnalyticsTracker';

type W = Window & { gtag?: (...a: unknown[]) => void; __eimsLeadHook?: boolean };

describe('lead conversion tracking', () => {
  const gtag = vi.fn();
  let status = 200;

  beforeEach(() => {
    const w = window as W;
    delete w.__eimsLeadHook;
    gtag.mockReset();
    w.gtag = gtag;
    status = 200;
    window.fetch = vi.fn(async () => new Response('{}', { status })) as unknown as typeof fetch;
    render(<AnalyticsTracker />);
  });

  const leadCalls = () => gtag.mock.calls.filter((c) => c[0] === 'event' && c[1] === 'generate_lead');

  it('fires generate_lead once for an accepted enquiry, without personal data', async () => {
    await window.fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        service: 'generators', source: 'generator_quote',
        name: 'Jane Doe', phone: '+254700000000', email: 'jane@example.com', message: 'secret',
      }),
    });
    const calls = leadCalls();
    expect(calls).toHaveLength(1);
    expect(calls[0][2]).toEqual({ lead_service: 'generators', lead_source: 'generator_quote', page_path: '/' });
    const sent = JSON.stringify(gtag.mock.calls);
    for (const pii of ['Jane', '+2547', 'jane@example.com', 'secret']) expect(sent).not.toContain(pii);
  });

  it('fires nothing when the server rejects the enquiry', async () => {
    status = 400;
    await window.fetch('/api/contact', { method: 'POST', body: '{}' });
    expect(leadCalls()).toHaveLength(0);
  });

  it('fires nothing for other requests', async () => {
    await window.fetch('/api/contact');
    await window.fetch('/api/other', { method: 'POST', body: '{}' });
    expect(leadCalls()).toHaveLength(0);
  });
});
