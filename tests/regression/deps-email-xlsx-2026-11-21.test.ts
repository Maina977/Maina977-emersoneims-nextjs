import { describe, it, expect } from 'vitest';
import nodemailer from 'nodemailer';
import * as XLSX from 'xlsx';

// Security dependency change (2026-11-21): nodemailer 8 -> 10.6.1, xlsx 0.18.5 -> 0.20.3
// (SheetJS official build). These checks run fully offline: nodemailer's jsonTransport
// builds the message without any network or SMTP, so nothing is ever sent.
describe('nodemailer 10: message building without sending (email isolation)', () => {
  it('jsonTransport builds a text + HTML message with reply-to; no network', async () => {
    const t = nodemailer.createTransport({ jsonTransport: true });
    const info = await t.sendMail({ from: 'Website <noreply@example.com>', to: 'sales@example.com', replyTo: 'visitor@example.com', subject: 'TEST enquiry', text: 'TEST body', html: '<p>TEST body</p>' });
    const msg = JSON.parse(String(info.message));
    expect(msg.subject).toBe('TEST enquiry');
    expect(msg.text).toBe('TEST body');
    expect(msg.html).toBe('<p>TEST body</p>');
    expect(info.envelope.to).toEqual(['sales@example.com']);
  });
  it('the file/URL access guards are honoured for attachments (the advisory class)', async () => {
    const t = nodemailer.createTransport({ streamTransport: true, buffer: true, disableFileAccess: true, disableUrlAccess: true });
    await expect(t.sendMail({ from: 'a@example.com', to: 'b@example.com', subject: 's', text: 't', attachments: [{ path: 'C:/Windows/win.ini' }] })).rejects.toThrow();
  });
});

describe('xlsx 0.20.3: workbook writing used by the Solar reports', () => {
  it('writes and reads back a sheet (round trip)', () => {
    const ws = XLSX.utils.aoa_to_sheet([['Item', 'Qty'], ['TEST module', 32]]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Summary');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
    expect(buf.subarray(0, 2).toString('latin1')).toBe('PK');
    const back = XLSX.read(buf, { type: 'buffer' });
    expect(XLSX.utils.sheet_to_json(back.Sheets.Summary, { header: 1 })).toEqual([['Item', 'Qty'], ['TEST module', 32]]);
  });
});
