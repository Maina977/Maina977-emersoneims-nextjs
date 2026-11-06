/**
 * Generator quotation form (master brief §10): validates, posts the structured
 * answers to /api/contact, shows the enquiry reference, and never claims
 * success when the server refuses.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GeneratorQuoteForm from '@/components/forms/GeneratorQuoteForm';

afterEach(() => vi.unstubAllGlobals());

function fill(name: string, phone: string) {
  fireEvent.change(screen.getByLabelText(/Your name/), { target: { value: name } });
  fireEvent.change(screen.getByLabelText(/Phone \/ WhatsApp/), { target: { value: phone } });
}

describe('GeneratorQuoteForm', () => {
  it('pre-fills the size and has a label for every field', () => {
    render(<GeneratorQuoteForm defaultKva={250} source="test" />);
    expect((screen.getByLabelText(/Size needed/) as HTMLInputElement).value).toBe('250');
    for (const l of [/New or used/, /How it will run/, /Supply/, /Hours running/, /Automatic changeover/, /Where it will stand/, /Delivery to site/, /Budget/]) {
      expect(screen.getByLabelText(l)).toBeTruthy();
    }
  });

  it('refuses to send without a phone number or consent', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    render(<GeneratorQuoteForm source="test" />);
    fill('Jane Doe', '12');
    fireEvent.click(screen.getByRole('button', { name: /Request my quotation/ }));
    expect((await screen.findByRole('alert')).textContent).toMatch(/phone number/);
    fill('Jane Doe', '0712345678');
    fireEvent.click(screen.getByRole('button', { name: /Request my quotation/ }));
    expect((await screen.findByRole('alert')).textContent).toMatch(/contact you/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('posts the structured answers and shows the reference', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, leadId: 41, reference: 'EIMS-000041' }),
    });
    vi.stubGlobal('fetch', fetchMock);
    render(<GeneratorQuoteForm defaultKva={100} source="generator-size-100-kva" />);
    fill('Jane Doe', '0712345678');
    fireEvent.change(screen.getByLabelText(/New or used/), { target: { value: 'used' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /Request my quotation/ }));
    await waitFor(() => expect(screen.getByText('EIMS-000041')).toBeTruthy());
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(fetchMock.mock.calls[0][0]).toBe('/api/contact');
    expect(body.service).toBe('generators');
    expect(body.source).toBe('generator-size-100-kva');
    expect(body.message).toMatch(/Required size: 100 kVA/);
    expect(body.message).toMatch(/New or used: Used \/ refurbished/);
    expect(body.email).toBe('quote-form@emersoneims.com');
  });

  it('shows the WhatsApp fallback when the server refuses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 429, json: async () => ({}) }));
    render(<GeneratorQuoteForm source="test" />);
    fill('Jane Doe', '0712345678');
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /Request my quotation/ }));
    expect((await screen.findByRole('alert')).textContent).toMatch(/couldn.t send/);
    expect(screen.queryByText(/request received/)).toBeNull();
  });
});
