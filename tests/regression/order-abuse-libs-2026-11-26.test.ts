/** Order-abuse hotfix 2026-11-26: unit checks of the new price book and guard modules. */
import { describe, expect, it } from 'vitest';
import { buildPriceBook, loadPriceBook, priceLines } from '@/lib/orders/trustedPrices';
import { looksAutomated, MIN_FILL_MS } from '@/lib/orders/orderAbuseGuard';

const HEAD = 'Code,Name,Category,Subcategory,Brand,UOM,Qty,Reorder,Cost,Price,Location';

describe('price book', () => {
  it('keeps a code only with one consistent positive whole price', () => {
    const book = buildPriceBook([
      HEAD,
      'A-1,"Disc 4.5"" x 1.6",Cat,Sub,,pcs,1,1,10,100,Store',
      'A-1,"Disc 4.5"" x 1.6",Cat,Sub,,pcs,1,1,10,100,Store', // duplicate, same price: kept
      'B-2,Belt,Cat,Sub,,pcs,1,1,10,200,Store',
      'B-2,Belt,Cat,Sub,,pcs,1,1,10,250,Store', // conflicting price: dropped
      'C-3,Free,Cat,Sub,,pcs,1,1,0,0,Store', // zero: dropped
      'D-4,Odd,Cat,Sub,,pcs,1,1,0,abc,Store', // not a number: dropped
    ].join('\r\n'));
    expect([...book.keys()]).toEqual(['A-1']);
    expect(book.get('A-1')).toEqual({ code: 'A-1', name: 'Disc 4.5" x 1.6', unitPrice: 100 });
  });
  it('the real stock file loads (7,793 priced codes) and prices lines by code only', () => {
    const book = loadPriceBook();
    expect(book).not.toBeNull();
    expect(book!.size).toBe(7793);
    expect(priceLines([{ partCode: 'ABR-1', quantity: 3 }], book)).toEqual([{ partCode: 'ABR-1', partName: expect.any(String), quantity: 3, unitPrice: 1153, subtotal: 3459 }]);
    expect(priceLines([{ partCode: 'ABR-1', quantity: 1 }, { partCode: 'NOPE', quantity: 1 }], book)).toBeNull();
    expect(priceLines([{ partCode: 'ABR-1', quantity: 1 }], null)).toBeNull();
  });
});

describe('automation check', () => {
  const now = 1_800_000_000_000;
  it('honeypot, missing / too-recent / future / ancient timestamps are automated; a normal fill is not', () => {
    expect(looksAutomated({ website: 'x', formStartedAt: now - 60_000 }, now)).toBe(true);
    expect(looksAutomated({}, now)).toBe(true);
    expect(looksAutomated({ formStartedAt: now - MIN_FILL_MS + 1 }, now)).toBe(true);
    expect(looksAutomated({ formStartedAt: now + 1000 }, now)).toBe(true);
    expect(looksAutomated({ formStartedAt: now - 2 * 24 * 3600e3 }, now)).toBe(true);
    expect(looksAutomated({ formStartedAt: '123' }, now)).toBe(true);
    expect(looksAutomated({ website: '', formStartedAt: now - 60_000 }, now)).toBe(false);
  });
});
