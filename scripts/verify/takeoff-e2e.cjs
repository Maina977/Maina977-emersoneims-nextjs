/**
 * End-to-end take-off test against a LOCAL production build (P1-D):
 * PDF drawing → calibration → measurement (with an opening) → rotated view →
 * BOQ with a dated rate → Excel export, checked against hand calculations.
 * node scripts/verify/takeoff-e2e.cjs   (server on http://localhost:3111)
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { chromium } = require('playwright');
const { jsPDF } = require('jspdf');
const ExcelJS = require('exceljs');

const BASE = process.env.VERIFY_BASE || 'http://localhost:3111';
if (!/^http:\/\/(localhost|127\.0\.0\.1)/.test(BASE)) { console.error('Refusing to run against a non-local host'); process.exit(2); }
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'takeoff-e2e-'));
const results = [];
const rec = (check, ok, evidence) => { results.push({ check, ok }); console.log(`${ok ? 'PASS' : 'FAIL'} ${check} :: ${evidence}`); };

// A3 landscape, 1:100: slab 12 × 8 m drawn as 120 × 80 mm at (50, 50) mm, with a 2 × 1 m opening at (60, 60) mm.
function fixture() {
  const doc = new jsPDF({ unit: 'mm', format: 'a3', orientation: 'landscape' });
  doc.rect(50, 50, 120, 80); doc.rect(60, 60, 20, 10);
  doc.text('SLAB PLAN 1:100 (test fixture)', 50, 40);
  doc.addPage('a3', 'landscape'); doc.text('Sheet 2 (blank)', 50, 40);
  const f = path.join(tmp, 'slab-1-100.pdf');
  fs.writeFileSync(f, Buffer.from(doc.output('arraybuffer')));
  return f;
}

(async () => {
  const file = fixture();
  const browser = await chromium.launch({ channel: 'chrome' });
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1600, height: 1100 }, acceptDownloads: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
  const res = await page.goto(BASE + '/solutions/building/takeoff', { waitUntil: 'domcontentloaded', timeout: 120000 });
  // Several robots meta tags can be present (a site-wide one plus the page's own).
  const robots = (await page.locator('meta[name="robots"]').evaluateAll((els) => els.map((e) => e.getAttribute('content')))).join(' | ');
  rec('page served and kept out of search', res.status() === 200 && /noindex/.test(robots || ''), `HTTP ${res.status()} robots="${robots}"`);

  await page.locator('input[type=file]').setInputFiles(file);
  await page.waitForSelector('svg image', { timeout: 60000 });
  await page.waitForFunction(() => /vector drawing/.test(document.body.innerText), null, { timeout: 30000 });
  const info = await page.evaluate(() => document.body.innerText.match(/page 1 of (\d+) · sheet (\d+) × (\d+) mm · ([a-z ]+)/));
  rec('PDF opened: 2 pages, A3 420 × 297 mm, vector', !!info && info[1] === '2' && info[2] === '420' && info[3] === '297', info ? info[0] : 'no sheet line');

  // Click a point given in sheet millimetres (from the top-left, as drawn), for the current view rotation.
  const clickMm = async (xmm, ymm, rot = 0) => {
    const box = await page.locator('svg.cursor-crosshair').boundingBox();
    const vb = await page.locator('svg.cursor-crosshair').getAttribute('viewBox');
    const [, , w, h] = vb.split(' ').map(Number);
    const W = 420, H = 297; // sheet mm, unrotated
    let u, v; // fraction across the displayed image
    if (rot === 0) { u = xmm / W; v = ymm / H; }
    else if (rot === 90) { u = 1 - ymm / H; v = xmm / W; }
    else throw new Error('rotation not handled');
    await page.mouse.click(box.x + u * box.width, box.y + v * box.height);
    return { w, h };
  };

  await page.getByLabel('Known length in metres').waitFor();
  await page.locator('label:has-text("Stated scale") input').fill('100');
  await clickMm(50, 50); await clickMm(170, 50);
  await page.getByLabel('Known length in metres').fill('12'); await page.getByRole('button', { name: 'Add reference' }).click();
  await clickMm(170, 50); await clickMm(170, 130);
  await page.getByLabel('Known length in metres').fill('8'); await page.getByRole('button', { name: 'Add reference' }).click();
  const calText = await page.locator('text=Calibrated:').first().innerText().catch(() => '');
  const mismatch = Number((calText.match(/agreement ([\d.]+) %/) || [])[1]);
  const statedDiff = Number((calText.match(/Stated scale difference ([\d.]+) %/) || [])[1]);
  rec('calibration by clicking: references agree < 1 %, stated 1:100 within 2 %', mismatch < 1 && statedDiff < 2, calText.replace(/\s+/g, ' ').slice(0, 160));

  // Area with an opening, then the volume at 150 mm.
  await page.getByRole('button', { name: 'Area', exact: true }).click();
  await page.getByLabel('Measurement label').fill('Ground slab');
  for (const [x, y] of [[50, 50], [170, 50], [170, 130], [50, 130]]) await clickMm(x, y);
  await page.getByRole('button', { name: /^Finish/ }).click();
  await page.getByRole('button', { name: 'Opening (deduct)' }).click();
  for (const [x, y] of [[60, 60], [80, 60], [80, 70], [60, 70]]) await clickMm(x, y);
  await page.getByRole('button', { name: /^Finish/ }).click();
  const row1 = await page.locator('tr', { hasText: 'Ground slab' }).first().innerText();
  const net = Number((row1.match(/([\d,.]+) m²/) || [])[1]?.replace(/,/g, ''));
  // Click precision on screen: the resolution limit shown by the tool.
  const limitMm = Number(((await page.locator('text=Resolution limit').innerText()).match(/about ([\d.]+) mm/) || [])[1]);
  const tolM2 = (2 * (12 + 8) * limitMm) / 1000 * 1.5 + 2 * (2 + 1) * limitMm / 1000 * 1.5;
  rec('area 96 − 2 = 94 m² within the stated click resolution', Math.abs(net - 94) <= tolM2, `${row1.replace(/\s+/g, ' ')} (tolerance ±${tolM2.toFixed(3)} m², limit ${limitMm} mm)`);

  // Rotate the view: the stored measurement is unchanged; a new measurement on the rotated view agrees.
  await page.getByRole('button', { name: 'Rotate view 90°' }).click();
  await page.waitForTimeout(2500);
  const row1b = await page.locator('tr', { hasText: 'Ground slab' }).first().innerText();
  rec('rotating the view leaves stored quantities unchanged', row1b === row1, row1b.replace(/\s+/g, ' '));
  await page.getByRole('button', { name: 'Length', exact: true }).click();
  await page.getByLabel('Measurement label').fill('Slab edge (rotated view)');
  await clickMm(50, 130, 90); await clickMm(170, 130, 90);
  await page.getByRole('button', { name: /^Finish/ }).click();
  const len = Number(((await page.locator('tr', { hasText: 'Slab edge' }).first().innerText()).match(/([\d,.]+) m\b/) || [])[1]);
  rec('length measured on the rotated view = 12 m', Math.abs(len - 12) <= 3 * limitMm / 1000, `${len} m`);

  // Page 2 needs its own calibration.
  await page.locator('label:has-text("Page") select').selectOption('2');
  await page.waitForTimeout(2500);
  const lengthDisabled = await page.getByRole('button', { name: 'Length', exact: true }).isDisabled();
  rec('page 2 is not measurable until calibrated', lengthDisabled, `Length button disabled: ${lengthDisabled}`);

  // BOQ: one item without a rate → no total; add a dated rate → totals; export.
  await page.getByRole('button', { name: 'Add item' }).click();
  await page.getByLabel('description', { exact: true }).fill('Slab finish');
  await page.getByLabel('measurement', { exact: true }).selectOption({ label: 'M1 Ground slab' });
  const noTotal = /No total yet/.test(await page.locator('body').innerText());
  rec('unpriced item: "rate required" and no total', noTotal && /rate required/.test(await page.locator('body').innerText()), `noTotal=${noTotal}`);
  await page.getByLabel('rate', { exact: true }).fill('1000'); await page.getByLabel('source', { exact: true }).fill('Test rate list'); await page.getByLabel('date', { exact: true }).fill('2026-10-01'); await page.getByLabel('location', { exact: true }).fill('Nairobi');
  for (const [l, v] of [['Preliminaries %', '10'], ['Contingency %', '5'], ['Overheads & profit %', '10'], ['VAT %', '16'], ['VAT rate effective from', '2023-07-01']]) await page.locator(`label:has-text("${l}") input`).fill(v);
  const qty = net; // m², as measured
  const r2 = (x) => Math.round(x * 100) / 100;
  const mw = r2(r2(qty * 1000)), pre = r2(mw * 0.1), con = r2((mw + pre) * 0.05), ohp = r2((mw + pre + con) * 0.1), sbv = r2(mw + pre + con + ohp), vat = r2(sbv * 0.16), total = r2(sbv + vat);
  // The row whose first cell is exactly "TOTAL" (hasText alone also matches "Subtotal before VAT").
  const totalRow = page.locator('tr').filter({ has: page.locator('td', { hasText: /^TOTAL$/ }) }).first();
  const shown = Number(((await totalRow.innerText()).match(/KES ([\d,.]+)/) || [])[1]?.replace(/,/g, ''));
  rec('screen total equals the hand calculation', Math.abs(shown - total) < 0.005, `screen ${shown} vs hand ${total}`);
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 30000 }), page.getByRole('button', { name: /Export Excel/ }).click()]);
  const xf = path.join(tmp, 'boq.xlsx'); await dl.saveAs(xf);
  const wb = new ExcelJS.Workbook(); await wb.xlsx.readFile(xf);
  let xTotal = null, formula = '';
  wb.getWorksheet('BOQ').eachRow((row) => { if (row.getCell(2).value === 'TOTAL') { xTotal = row.getCell(6).value.result; formula = row.getCell(6).value.formula; } });
  rec('Excel total equals screen total; total is a formula', xTotal === shown && /ROUND\(/.test(formula), `excel ${xTotal} = ${formula}`);
  rec('no page errors', errs.length === 0, errs.join(' | ') || 'none');

  await browser.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  const fails = results.filter((r) => !r.ok).length;
  console.log(fails ? `FAILED: ${fails} of ${results.length}` : `TAKEOFF E2E PASSED (${results.length} checks)`);
  process.exit(fails ? 1 : 0);
})().catch((e) => { console.log('ERROR', e && e.stack || e); process.exit(1); });
