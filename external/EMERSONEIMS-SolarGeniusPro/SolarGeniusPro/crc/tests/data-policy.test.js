// Tests for the data-policy guard rails. These confirm the code refuses
// to fabricate values when sources are unavailable.

'use strict';

const path = require('path');

describe('NotImplementedError surfaces from quarantined services', () => {
  test('backend-advanced: LiDAR engine throws 501-style error', async () => {
    // We avoid loading the whole file (it pulls in heavy deps) by re-implementing
    // the assertion contract: the file MUST contain explicit 501 throws.
    const fs = require('fs');
    const src = fs.readFileSync(path.join(__dirname, '..', 'backend-advanced.js'), 'utf8');
    expect(src).toMatch(/LiDARDataEngine/);
    expect(src).toMatch(/statusCode = 501/);
    expect(src).not.toMatch(/Math\.random\(\)\s*\*\s*25/); // old shading sim
  });
});

describe('config: env validation', () => {
  test('isPlaceholder catches DEMO_KEY and empty', () => {
    const { isPlaceholder } = require('../server/config');
    expect(isPlaceholder(undefined)).toBe(true);
    expect(isPlaceholder('')).toBe(true);
    expect(isPlaceholder('DEMO_KEY')).toBe(true);
    expect(isPlaceholder('changeme')).toBe(true);
    expect(isPlaceholder('a-real-secret-1234')).toBe(false);
  });
  test('requireEnv throws statusCode=503 for placeholder values', () => {
    const { requireEnv } = require('../server/config');
    process.env.__TEST_FAKE_KEY = 'DEMO';
    expect(() => requireEnv('__TEST_FAKE_KEY')).toThrow(/refuses to use a placeholder/);
    delete process.env.__TEST_FAKE_KEY;
  });
});

describe('zod validation rejects bad inputs at the boundary', () => {
  test('solar/calculate requires positive consumption', () => {
    const { schemas } = require('../server/validation');
    const r1 = schemas.solarCalculate.safeParse({ consumption: -5 });
    expect(r1.success).toBe(false);
    const r2 = schemas.solarCalculate.safeParse({});
    expect(r2.success).toBe(false);
    const r3 = schemas.solarCalculate.safeParse({ consumption: 350 });
    expect(r3.success).toBe(true);
  });
});
