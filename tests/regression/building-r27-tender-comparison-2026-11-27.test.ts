/**
 * Register R-27 (P1-D §5, RS20): tender comparison side by side.
 * Rates are TEST tenderers' rates, not prices.
 */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { compareTenders, parseTenderCsv, TenderError, type BillLine } from '@/lib/qs/tenders';
import TenderComparison from '@/components/qs/TenderComparison';

const BILL: BillLine[] = [
  { code: '1', description: 'TEST blockwork', unit: 'm²', quantity: 56.22 },
  { code: '2', description: 'TEST concrete', unit: 'm³', quantity: 11.244 },
];

describe('R-27 tender comparison', () => {
  it('hand-worked: A = 56.22 × 1,250 + 11.244 × 15,000 = 70,275 + 168,660 = 238,935; B = 56.22 × 1,180 + 11.244 × 16,200 = 66,339.60 + 182,152.80 = 248,492.40 (+4 %)', () => {
    const A = parseTenderCsv('TEST A', 'code,rate,amount\n1,1250,70275\n2,15000,168660');
    const B = parseTenderCsv('TEST B', 'code,rate\n1,1180\n2,16200');
    const c = compareTenders(BILL, [A, B]);
    expect(c.rows.map((r) => r.cells.map((x) => x.amount))).toEqual([[70275, 66339.6], [168660, 182152.8]]);
    expect(c.rows.map((r) => r.lowest)).toEqual([['TEST B'], ['TEST A']]);
    expect(c.tenders.map((t) => [t.name, t.total, t.rank, t.overLowestPct])).toEqual([['TEST A', 238935, 1, 0], ['TEST B', 248492.4, 2, 4]]);
    // (248,492.40 − 238,935) / 238,935 = 4.0000 % → 4.
  });
  it('arithmetic errors are flagged (corrected amount used), unpriced items make a tender incomplete and unranked', () => {
    const A = parseTenderCsv('TEST A', 'code,rate,amount\n1,1250,72000\n2,15000,168660'); // 56.22 × 1,250 = 70,275, not 72,000
    const C = parseTenderCsv('TEST C', 'code,rate\n1,900\n9,5'); // item 2 not priced; item 9 not in the bill
    const B = parseTenderCsv('TEST B', 'code,rate\n1,1180\n2,16200');
    const c = compareTenders(BILL, [A, B, C]);
    expect(c.tenders[0].arithmeticErrors).toEqual(['1']);
    expect(c.tenders[0].total).toBe(238935);
    expect(c.tenders[2]).toMatchObject({ complete: false, rank: null, notPriced: ['2'], extraItems: ['9'] });
    expect(c.rows[0].cells[2].amount).toBe(50598); // 56.22 × 900
  });
  it('bad CSVs are refused with the reason', () => {
    expect(() => parseTenderCsv('X', 'code,price\n1,5')).toThrow(/"code" and "rate"/);
    // Review T1: an unquoted "1,250" is 3 fields against a 2-field header: refused, never read as rate 1.
    expect(() => parseTenderCsv('X', 'code,rate\n1,1,250')).toThrow(/row 2: 3 field\(s\), the header has 2/);
    expect(() => parseTenderCsv('X', 'code,rate\n1,abc')).toThrow(/must be a number/);
    expect(() => parseTenderCsv('X', 'code,rate\n1,5\n1,6')).toThrow(/priced twice/);
    expect(() => compareTenders(BILL, [parseTenderCsv('X', 'code,rate\n1,5')])).toThrow(TenderError);
  });
  it('the workbench panel loads two tenders and shows the ranking', async () => {
    render(createElement(TenderComparison, { lines: BILL }));
    const upload = async (name: string, csv: string) => {
      fireEvent.change(screen.getByLabelText('Tenderer name'), { target: { value: name } });
      fireEvent.change(screen.getByLabelText('Tenderer priced bill CSV'), { target: { files: [new File([csv], `${name}.csv`, { type: 'text/csv' })] } });
      await waitFor(() => expect(screen.getByRole('status').textContent).toMatch(new RegExp(`for ${name}`)));
    };
    await upload('TEST A', 'code,rate\n1,1250\n2,15000');
    await upload('TEST B', 'code,rate\n1,1180\n2,16200');
    expect(screen.getByText(/TEST B: rank 2, 4 % above the lowest/)).toBeTruthy();
  });
});
