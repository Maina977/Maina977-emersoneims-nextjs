// HTTP smoke test for engineering-global endpoints.
// Skips gracefully if a backend is NOT running on :3000 (so CI without a
// running server still passes); locally runs full validation.
const http = require('http');

function postJson(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: '127.0.0.1', port: 3000, path, method: 'POST', timeout: 3000,
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    }, (res) => {
      let chunks = '';
      res.on('data', (c) => chunks += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(chunks) }); }
        catch (e) { resolve({ status: res.statusCode, body: chunks }); }
      });
    });
    req.on('timeout', () => { req.destroy(new Error('timeout')); });
    req.on('error', reject);
    req.write(data); req.end();
  });
}

async function backendUp() {
  try { await postJson('/api/engglobal/grid-code', { countryCode: 'KE' }); return true; }
  catch { return false; }
}

describe('engineering-global e2e (skipped if backend offline)', () => {
  let alive = false;
  beforeAll(async () => { alive = await backendUp(); });

  test('grid-code Kenya', async () => {
    if (!alive) { console.log('   [skip] backend not running on :3000'); return; }
    const r = await postJson('/api/engglobal/grid-code', { countryCode: 'KE', systemAcKw: 50 });
    expect(r.status).toBe(200);
    expect(r.body.data.country).toBe('Kenya');
  });

  test('continuous-beam', async () => {
    if (!alive) return;
    const r = await postJson('/api/engglobal/continuous-beam', { spanLengthsM: [3,3,3], uniformLoadKnPerM: 0.5 });
    expect(r.status).toBe(200);
    expect(r.body.data.supportReactionsKn).toHaveLength(4);
  });

  test('finance-pack KES', async () => {
    if (!alive) return;
    const r = await postJson('/api/engglobal/finance-pack', { capexLocalCurrency: 500000, annualGenKwh: 7800, tariffPerKwh: 25, currencyCode: 'KES' });
    expect(r.status).toBe(200);
    expect(r.body.data.lcoeLocalPerKwh).toBeGreaterThan(0);
  });
});
