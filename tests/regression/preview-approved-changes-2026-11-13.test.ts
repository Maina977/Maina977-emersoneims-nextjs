/**
 * Management authorisation 2026-11-13 (protected preview), item 10: regression
 * tests for the newly approved pricing and demonstration-content changes, and
 * for the licence security fix found while preparing the preview.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '..', '..');
const src = (f: string) => readFileSync(join(root, f), 'utf8');

describe('item 6: no unverified service price ranges', () => {
  it('borehole survey, diagnostic visit and AMC answers carry no price range, but explain the pricing factors', () => {
    const seo = src('components/seo/ToolSeoContent.tsx');
    expect(seo).not.toMatch(/40,000.110,000|5,000.15,000|60k.250k/);
    expect(seo).toMatch(/hydrogeological survey depends on site access[^']*Request a quotation/);
    expect(seo).toMatch(/depends on the equipment, the distance[^']*Request a quotation/);
    expect(seo).toMatch(/AMC is priced on the generator size[^']*Request a quotation/);
  });
  it('the borehole maintenance hub no longer quotes the survey range', () => {
    expect(src('app/maintenance-hub/borehole/page.tsx')).not.toMatch(/Hydrogeological survey: KES 40,000-110,000/);
  });
});

describe('item 5: demonstration content is labelled and isolated', () => {
  const pro = src('components/solar-modules/crc/src/pages/ProToolsPage.tsx');
  it('every sample price is labelled illustrative and the document says DEMONSTRATION', () => {
    expect(pro).toMatch(/label: 'illustrative price, not an EmersonEIMS offer'/);
    expect(pro).toMatch(/ILLUSTRATIVE\.bom\.map\(\(\[item, qty, unit, total\]\) => \[`\$\{item\} \(\$\{ILLUSTRATIVE\.label\}\)`/);
    expect(pro).toMatch(/tagline: ILLUSTRATIVE\.banner/);
    expect(pro).toMatch(/DEMONSTRATION-proposal-/);
    expect(pro).toMatch(/BOM \(illustrative prices\)/);
  });
  it('the demonstration never touches the project store or the live default tariff', () => {
    expect(pro).not.toMatch(/DEFAULT_TARIFF_KES_PER_KWH/);
    const block = pro.slice(pro.indexOf('const ProposalPdfTool'), pro.indexOf('const XlsxTool'));
    expect(block).not.toMatch(/useSolarStore|updateFinancial|updateDesign|updateMetrics|saveProject/);
  });
  it('the cash-flow tools start blank instead of with sample figures', () => {
    expect(pro).not.toMatch(/useState\('-1247500/);
  });
});

describe('security: the built-in demo licence never works on production', () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

  async function activate(env: string) {
    vi.stubEnv('VERCEL_ENV', env);
    vi.resetModules();
    vi.doMock('@/lib/generator-oracle/db', () => ({
      initOracleTables: async () => true,
      getLicenseByKey: async () => null, // not in the database
      activateLicense: async () => ({ success: false }),
      logActivationAttempt: async () => undefined,
      checkRateLimit: async () => true,
    }));
    const { NextRequest } = await import('next/server');
    const { POST } = await import('@/app/api/generator-oracle/activate/route');
    return POST(new NextRequest('http://localhost/api/generator-oracle/activate', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ key: 'EIMS-TEST-0001-DEMO', deviceId: `device-${env}` }),
    }));
  }

  it('production: the demo key is refused like any unknown key', async () => {
    const res = await activate('production');
    const j = await res.json();
    expect(j.success).toBe(false);
  });
  it('preview/local: the demo key still works for testing', async () => {
    const res = await activate('preview');
    expect((await res.json()).success).toBe(true);
  });
});
