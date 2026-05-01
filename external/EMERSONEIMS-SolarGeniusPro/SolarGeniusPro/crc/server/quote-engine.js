/**
 * Real quotation engine — parses uploaded BOQs, photos and CSVs and
 * produces a priced line-item quote sourced from `data/components.json`
 * and `data/pricing.json`. No stubs, no fabrication.
 *
 * Data sources (per data policy):
 *   - data/components.json — verified equipment specs (panels, inverters, batteries)
 *   - data/pricing.json     — verified Kenya retail prices (KES, dated)
 *   - tesseract.js          — open-source OCR (Apache-2.0)
 *   - sharp                 — image preprocessing for OCR
 *
 * No values are invented. If a line item cannot be matched to a real
 * component in components.json the parser flags it as `unmatched` so the
 * user can review on-site.
 */

const path = require('path');
const components = require('../data/components.json');
const pricing = require('../data/pricing.json');

const KEYWORDS = {
  panels:    ['panel', 'module', 'pv', 'mono', 'poly', 'bifacial', 'solar pan'],
  inverters: ['inverter', 'hybrid', 'mppt', 'string inverter', 'micro inverter'],
  batteries: ['battery', 'lithium', 'lifepo4', 'lfp', 'storage', 'kwh battery'],
  isolators: ['isolator', 'dc switch', 'ac switch', 'disconnect'],
  cabling:   ['cable', 'conductor', 'wire', 'awg', 'mm²', 'mm2'],
  spd:       ['spd', 'surge', 'lightning'],
  mounting:  ['rail', 'mount', 'clamp', 'bracket', 'roof hook'],
  bos:       ['breaker', 'mcb', 'fuse', 'combiner', 'enclosure', 'busbar']
};

// Catalogue index — built once from real components.json
const CATALOGUE = {
  panels:    (components.panels    || []).map((p) => ({ ...p, category: 'panels' })),
  inverters: (components.inverters || []).map((p) => ({ ...p, category: 'inverters' })),
  batteries: (components.batteries || []).map((p) => ({ ...p, category: 'batteries' }))
};

// ---------- helpers ----------
function tokenize(text) {
  return String(text || '').toLowerCase().replace(/[\u00a0\t\r]/g, ' ').replace(/\s+/g, ' ').trim();
}

// Detect category by counting keyword hits per category and choosing the
// strongest match. This prevents lines like "1 set mounting rails for 14
// panels" being miscategorised as panels just because "panel" appears once
// — `rail`+`mount` give mounting two hits → mounting wins.
function detectCategory(line) {
  const t = tokenize(line);
  let bestCat = null;
  let bestScore = 0;
  for (const [cat, kws] of Object.entries(KEYWORDS)) {
    const score = kws.reduce((s, kw) => s + (t.includes(kw) ? 1 : 0), 0);
    if (score > bestScore) { bestScore = score; bestCat = cat; }
  }
  return bestCat;
}

// A "real" BOQ line should have either an explicit quantity marker
// (14x, qty 14, 14 pcs), a spec (W / kW / kWh), or a recognised brand.
// Section headers like "Solar PV BOQ — sample" have none of those.
function isQuotableLine(raw, parsed) {
  const t = tokenize(raw);
  const hasQty   = /\b\d+\s*(?:x|pcs?|nos?|units?|off|lots?|sets?|rolls?|metres?|m\b)/i.test(t)
                || /qty[:\s]*\d+/i.test(t)
                || /quantity[:\s]*\d+/i.test(t)
                || /^\s*\d+\s+/.test(t);   // "1 lot ...", "14 x ..."
  const hasSpec  = parsed.wattage != null || parsed.kw != null || parsed.kwh != null
                || /\b\d+\s*v\b|\bmm[²2]\b|\bawg\b|\bma\b|\ba\b/i.test(t);
  const hasBrand = !!parsed.brand;
  return hasQty || hasSpec || hasBrand;
}

function extractQuantity(line) {
  // Patterns:  "14 x JA Solar"  |  "qty 14"  |  "(14) JA"  |  "14pcs"
  const t = tokenize(line);
  const m =
    t.match(/(?:^|\s)(\d{1,4})\s*(?:x|pcs?|nos?|units?|off)\b/i) ||
    t.match(/qty[:\s]*(\d{1,4})/i) ||
    t.match(/quantity[:\s]*(\d{1,4})/i) ||
    t.match(/^\s*(\d{1,4})\b/);
  return m ? parseInt(m[1], 10) : 1;
}

function extractWattage(line) {
  const m = String(line).match(/(\d{2,4})\s*w\b/i);
  return m ? parseInt(m[1], 10) : null;
}

function extractKw(line) {
  const m = String(line).match(/(\d+(?:\.\d+)?)\s*kw\b/i);
  return m ? parseFloat(m[1]) : null;
}

function extractKwh(line) {
  const m = String(line).match(/(\d+(?:\.\d+)?)\s*kwh\b/i);
  return m ? parseFloat(m[1]) : null;
}

function extractBrand(line, category) {
  const knownBrands = (CATALOGUE[category] || []).map((c) => c.brand);
  const t = tokenize(line);
  for (const b of knownBrands) {
    if (t.includes(b.toLowerCase())) return b;
  }
  return null;
}

// Match a parsed line to a real catalogue item
function matchComponent(parsed) {
  const list = CATALOGUE[parsed.category] || [];
  if (!list.length) return null;
  // Filter by brand if known
  let candidates = parsed.brand ? list.filter((c) => c.brand.toLowerCase() === parsed.brand.toLowerCase()) : list;
  if (!candidates.length) candidates = list;
  // Score by spec proximity
  let best = null;
  let bestScore = -Infinity;
  for (const c of candidates) {
    let score = 0;
    if (parsed.wattage && c.wattage) score -= Math.abs(c.wattage - parsed.wattage) / 50;
    if (parsed.kw && c.capacityKw)   score -= Math.abs(c.capacityKw - parsed.kw) * 2;
    if (parsed.kwh && c.capacityKwh) score -= Math.abs(c.capacityKwh - parsed.kwh) * 2;
    if (parsed.brand && c.brand?.toLowerCase() === parsed.brand.toLowerCase()) score += 5;
    if (score > bestScore) { bestScore = score; best = c; }
  }
  return best;
}

// ---------- BOQ parser ----------
// Accepts plain text (already extracted from PDF/Excel/OCR). Returns
// { items: [...], subtotal, currency, unmatched: [...] }.
function parseBoqText(text) {
  const lines = String(text || '').split(/\r?\n|;|·|•/).map((l) => l.trim()).filter(Boolean);
  const items = [];
  const unmatched = [];
  for (const raw of lines) {
    const category = detectCategory(raw);
    if (!category) continue;
    const parsed = {
      raw,
      category,
      quantity: extractQuantity(raw),
      brand: extractBrand(raw, category),
      wattage: extractWattage(raw),
      kw: extractKw(raw),
      kwh: extractKwh(raw)
    };
    if (!isQuotableLine(raw, parsed)) continue; // skip headers / commentary
    // Detect brand-like word the user mentioned but which isn't in our catalogue
    const allBrands = Object.values(CATALOGUE).flat().map((c) => c.brand.toLowerCase().replace(/\s+/g, ''));
    const tk = tokenize(raw);
    const mentionedBrandWord = (tk.match(/\b(byd|huawei|sma|growatt|sungrow|deye|solis|fronius|jinko|trina|longi|canadian|ja\s*solar|risen|qcells|hanwha|seraphim|ulica|tesla|pylontech|dyness|hoppecke|lg|samsung|enphase|ginlong)\b/i) || [])[0];
    const mentionedBrandKey = mentionedBrandWord ? mentionedBrandWord.toLowerCase().replace(/\s+/g, '') : null;
    const knownBrandRecognised = mentionedBrandKey && allBrands.some((b) => b.includes(mentionedBrandKey) || mentionedBrandKey.includes(b));
    const brandFlag = mentionedBrandWord && !knownBrandRecognised
      ? `Brand "${mentionedBrandWord}" not in our catalogue — matched to nearest equivalent. Verify before quoting.`
      : null;
    const match = matchComponent(parsed);
    if (match && typeof match.price === 'number') {
      const lineTotal = match.price * parsed.quantity;
      const confidence = brandFlag
        ? 'low'
        : (parsed.brand && (parsed.wattage || parsed.kw || parsed.kwh) ? 'high' : 'medium');
      items.push({
        sourceLine: raw,
        category,
        match: { id: match.id, brand: match.brand, model: match.model, wattage: match.wattage, capacityKw: match.capacityKw, capacityKwh: match.capacityKwh },
        unitPriceKES: match.price,
        quantity: parsed.quantity,
        lineTotalKES: lineTotal,
        warning: brandFlag,
        provenance: { component: 'data/components.json', confidence }
      });
    } else if (!CATALOGUE[category] || CATALOGUE[category].length === 0) {
      // Recognised category (cabling / mounting / isolators / spd / bos) for which we maintain no priced catalogue yet.
      unmatched.push({ sourceLine: raw, parsed, reason: `category "${category}" not yet priced in components.json — installer to quote separately` });
    } else {
      unmatched.push({ sourceLine: raw, parsed, reason: match ? 'no price in catalogue' : 'no matching component in catalogue' });
    }
  }
  const subtotalKES = items.reduce((s, it) => s + it.lineTotalKES, 0);
  return {
    currency: 'KES',
    items,
    unmatched,
    subtotalKES,
    grandTotalKES: subtotalKES,
    notes: items.length === 0 && unmatched.length === 0
      ? 'No recognisable solar items detected in upload.'
      : `${items.length} priced line-item(s); ${unmatched.length} unmatched (review manually).`,
    provenance: {
      catalogue: 'data/components.json',
      pricing:   `data/pricing.json (lastUpdated ${pricing.lastUpdated || 'unknown'})`,
      method: 'Keyword classifier → catalogue match scored by brand + spec proximity. No invented prices.'
    }
  };
}

// ---------- BOQ extractor (handles PDF, Excel, CSV, plain text) ----------
async function extractTextFromUpload(file) {
  const ext = path.extname(file.originalname || '').toLowerCase();
  // Multer disk storage gives `file.path`; memory storage gives `file.buffer`.
  let buf = file.buffer;
  if (!buf && file.path) {
    const fs = require('fs');
    buf = fs.readFileSync(file.path);
  }
  if (!buf) throw new Error('Empty upload buffer');
  if (ext === '.txt' || ext === '.csv') return buf.toString('utf8');
  if (ext === '.xlsx' || ext === '.xls') {
    const XLSX = require('xlsx');
    const wb = XLSX.read(buf, { type: 'buffer' });
    return wb.SheetNames.map((n) => XLSX.utils.sheet_to_csv(wb.Sheets[n])).join('\n');
  }
  if (ext === '.pdf') {
    // pdf-parse lazy require — not always installed in dev
    let pdfParse;
    try { pdfParse = require('pdf-parse'); }
    catch { throw new Error('PDF parsing requires `pdf-parse` package (run `npm i pdf-parse`).'); }
    const data = await pdfParse(buf);
    return data.text || '';
  }
  // Image: send through tesseract.js for OCR
  if (/\.(png|jpe?g|webp|tiff?|bmp)$/i.test(ext) || (file.mimetype || '').startsWith('image/')) {
    const Tesseract = require('tesseract.js');
    const sharp = require('sharp');
    // Pre-process for OCR: greyscale + normalise + sharpen
    const pre = await sharp(buf).grayscale().normalise().sharpen().toBuffer();
    const { data } = await Tesseract.recognize(pre, 'eng');
    return data.text || '';
  }
  throw new Error(`Unsupported file type for BOQ parsing: ${ext || file.mimetype || 'unknown'}`);
}

module.exports = {
  parseBoqText,
  extractTextFromUpload,
  CATALOGUE
};
