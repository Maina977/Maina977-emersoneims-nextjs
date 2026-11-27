// @vitest-environment jsdom
/**
 * CA-52 (2026-11-27, management: customer trust; security sweep SW-13).
 * /aquascan-pro-v3/reports showed a hard-coded "report history" (Nairobi, Kisumu,
 * Mombasa analyses with probabilities and 2024 dates) as if it were the visitor's own.
 * Now: only reports this visitor downloaded (recorded in this browser) are listed,
 * labelled "Saved in this browser only"; with none, "You have no saved reports yet.";
 * no demonstration record is shown. Where a report unlock offered M-Pesa (not
 * configured in production: the route returns 503), the customer is told plainly that
 * payment unlocking is unavailable and how to get the report.
 * TEST values only.
 */
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup, act, fireEvent } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import ReportsHub from '@/components/aquascan-modules/reports/ReportsHub';
import { NO_REPORTS_TEXT, LOCAL_REPORTS_LABEL } from '@/components/aquascan-modules/reports/ReportHistory';
import { PaymentModal as AquaScanPaymentModal } from '@/components/aquascan-modules/payment/PaymentModal';
import { PaymentModal as GatePaymentModal } from '@/components/payment/PaymentGate';
import { PAYMENT_UNAVAILABLE_TITLE, PAYMENT_UNAVAILABLE_TEXT, PAYMENT_UNLOCK_AVAILABLE } from '@/components/payment/PaymentUnavailableNotice';

afterEach(cleanup);
beforeEach(() => { localStorage.clear(); });

const FABRICATED = /Nairobi Site Analysis|Kisumu Site Analysis|Mombasa Site Analysis|2024-01-1[05]|2024-01-05|\b(78|65|82)%/;
const record = (o: Record<string, unknown> = {}) => ({
  id: 7, timestamp: '2026-11-20T09:30:00.000Z', customerName: 'TEST Customer', customerEmail: 'test@example.invalid', customerOrg: '',
  country: 'Kenya', countryCode: 'KE', region: 'TEST County', city: 'TEST Town', coordinates: '-1.00000, 37.00000',
  format: 'PDF', tier: 'basic', probability: 0.61, recommendedDepth: 120, estimatedYield: 2, riskLevel: 'Moderate',
  auditScore: 90, auditPassed: true, isSuccessStory: false, ...o,
});
const mount = async () => { await act(async () => { render(<ReportsHub />); }); };

describe('CA-52: report history shows only the visitor\'s own saved reports', () => {
  it('no saved reports: "You have no saved reports yet." and no fabricated names, dates or probabilities', async () => {
    await mount();
    expect(screen.getByText(NO_REPORTS_TEXT)).toBeTruthy();
    expect(NO_REPORTS_TEXT).toBe('You have no saved reports yet.');
    expect(document.body.textContent).not.toMatch(FABRICATED);
    expect(document.body.textContent).not.toMatch(/example|demo|sample/i);
  });

  it('reports downloaded in this browser are listed and labelled "Saved in this browser only"', async () => {
    localStorage.setItem('aquascan_report_history', JSON.stringify([record(), record({ id: 8, timestamp: '2026-11-21T10:00:00.000Z', format: 'Excel', city: '', region: '', country: '' })]));
    await mount();
    const t = document.body.textContent ?? '';
    expect(t).toContain(LOCAL_REPORTS_LABEL);
    expect(LOCAL_REPORTS_LABEL).toBe('Saved in this browser only');
    expect(t).toContain('TEST Town, TEST County, Kenya');
    expect(t).toContain('-1.00000, 37.00000'); // no place name: the coordinates
    expect(t).toMatch(/PDF/);
    expect(t).toMatch(/Excel/);
    expect(t).not.toMatch(FABRICATED);
    // Modelled figures and personal details are not repeated in the list.
    expect(t).not.toMatch(/61%|0\.61|120\s?m|TEST Customer|test@example/);
    expect(screen.queryByText(NO_REPORTS_TEXT)).toBeNull();
  });

  it('a corrupt or foreign value in browser storage gives the empty state, never invented rows', async () => {
    localStorage.setItem('aquascan_report_history', '{"not":"an array"}');
    await mount();
    expect(screen.getByText(NO_REPORTS_TEXT)).toBeTruthy();
  });

  it('the fabricated records are no longer in the displayed code (kept in git history only); no unlabelled example data', () => {
    const src = fs.readFileSync(path.resolve('components/aquascan-modules/reports/ReportHistory.tsx'), 'utf8');
    expect(src).not.toMatch(/title: 'Nairobi Site Analysis'|title: 'Kisumu Site Analysis'|title: 'Mombasa Site Analysis'/);
    expect(src).not.toMatch(/setReports\(\[\s*\{/);
  });
});

describe('CA-52: report unlock says plainly that payment is unavailable', () => {
  it('payment unlocking is switched off until server-side order validation and approval', () => {
    expect(PAYMENT_UNLOCK_AVAILABLE).toBe(false);
    expect(PAYMENT_UNAVAILABLE_TITLE).toBe('Payment unlocking is temporarily unavailable');
    expect(PAYMENT_UNAVAILABLE_TEXT).toMatch(/contact EmersonEIMS on 0768860665 \(call or WhatsApp\) or info@emersoneims\.com/);
  });

  it('AquaScan payment modal: the notice instead of M-Pesa, no payment request', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const onSuccess = vi.fn();
    render(<AquaScanPaymentModal isOpen onClose={vi.fn()} onSuccess={onSuccess} amount={1000} currency="KES" reportId="AQ-TEST-1" analysisId="A1" customerEmail="x@example.invalid" />);
    expect(screen.getByText(PAYMENT_UNAVAILABLE_TITLE)).toBeTruthy();
    expect(screen.getByText(/AQ-TEST-1/)).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/Pay with M-Pesa|STK|Enter your M-Pesa/i);
    expect(fetchSpy).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('the older payment gate: the notice, never a simulated "payment successful"', async () => {
    vi.useFakeTimers();
    const onPaymentSuccess = vi.fn();
    render(<GatePaymentModal isOpen onClose={vi.fn()} onPaymentSuccess={onPaymentSuccess} productName="AquaScan report" price={1000} reportId="AQ-TEST-2" />);
    expect(screen.getByText(PAYMENT_UNAVAILABLE_TITLE)).toBeTruthy();
    expect(screen.queryByText(/^M-Pesa$/)).toBeNull();
    fireEvent.click(screen.getByText('Close'));
    await act(async () => { vi.advanceTimersByTime(10000); });
    expect(onPaymentSuccess).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});
