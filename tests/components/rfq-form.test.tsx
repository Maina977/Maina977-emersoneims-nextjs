/**
 * Category enquiry forms (master brief §10, external audit §4).
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import RfqForm from '@/components/forms/RfqForm';
import { RFQ_CONFIGS } from '@/lib/forms/rfqConfigs';
import { departmentRecipients } from '@/lib/leads/routing';

afterEach(() => vi.unstubAllGlobals());

function contact(name = 'Jane Doe', phone = '0712345678') {
  fireEvent.change(screen.getByLabelText(/Your name/), { target: { value: name } });
  fireEvent.change(screen.getByLabelText(/Phone \/ WhatsApp/), { target: { value: phone } });
  fireEvent.click(screen.getByRole('checkbox'));
}

describe('RfqForm', () => {
  it('every config renders a labelled field for each question', () => {
    for (const cfg of Object.values(RFQ_CONFIGS)) {
      const { unmount } = render(<RfqForm kind={cfg.id} source="test" />);
      for (const fd of cfg.fields) expect(screen.getByLabelText(new RegExp(fd.label.replace(/[()]/g, '.'))), `${cfg.id}:${fd.id}`).toBeTruthy();
      unmount();
    }
  });

  it('refuses to send a service request without the fault', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    render(<RfqForm kind="service-request" source="test" />);
    contact();
    fireEvent.click(screen.getByRole('button', { name: 'Request a technician' }));
    expect((await screen.findByRole('alert')).textContent).toMatch(/What is the fault/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('posts labelled answers for a spare part and shows the reference', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, reference: 'EIMS-000052' }) });
    vi.stubGlobal('fetch', fetchMock);
    render(<RfqForm kind="spare-parts" source="spare-parts" />);
    contact();
    fireEvent.change(screen.getByLabelText(/Part number/), { target: { value: 'LF9009' } });
    fireEvent.change(screen.getByLabelText(/Equipment brand/), { target: { value: 'Cummins' } });
    fireEvent.click(screen.getByRole('button', { name: 'Check availability' }));
    await waitFor(() => expect(screen.getByText('EIMS-000052')).toBeTruthy());
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.service).toBe('Generator spare parts');
    expect(body.message).toMatch(/Part number \(if known\): LF9009/);
    expect(body.message).toMatch(/Equipment brand: Cummins/);
    expect(screen.getByRole('link', { name: 'Open WhatsApp' })).toBeTruthy();
  });

  it('never claims success when the server refuses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }));
    render(<RfqForm kind="ups-sizing" source="test" />);
    contact();
    fireEvent.change(screen.getByLabelText(/Load to protect/), { target: { value: '6 kW' } });
    fireEvent.click(screen.getByRole('button', { name: 'Size my UPS' }));
    expect((await screen.findByRole('alert')).textContent).toMatch(/couldn.t send/);
    expect(screen.queryByText(/request received/)).toBeNull();
  });

  it('spare-parts leads reach the generator desk; the borehole form makes no yield promise', () => {
    expect(departmentRecipients({ service: RFQ_CONFIGS['spare-parts'].service })).toEqual(['generators@emersoneims.com']);
    expect(RFQ_CONFIGS['borehole-assessment'].intro).toMatch(/preliminary/);
  });

  it('is placed on the repair, UPS, borehole and spare-parts pages', () => {
    const root = join(__dirname, '..', '..');
    const svc = readFileSync(join(root, 'app/services/[service]/page.tsx'), 'utf8');
    expect(svc).toMatch(/'generator-repairs': 'service-request'/);
    expect(svc).toMatch(/'ups-systems': 'ups-sizing'/);
    expect(svc).not.toMatch(/held in stock|same working day/);
    expect(readFileSync(join(root, 'app/generators/spare-parts/page.tsx'), 'utf8')).toMatch(/<RfqForm kind="spare-parts"/);
    const bore = readFileSync(join(root, 'app/services/borehole-drilling/page.tsx'), 'utf8');
    expect(bore).toMatch(/<RfqForm kind="borehole-assessment"/);
    expect(bore).not.toMatch(/No dry holes|500\+ boreholes|predicts yield before drilling/);
  });
});
