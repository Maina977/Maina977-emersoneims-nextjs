import { readFileSync, writeFileSync } from 'node:fs';
const src = readFileSync('scripts/audit.mjs','utf8');
// Extract the tests array literal
const start = src.indexOf('const tests = [');
const end = src.indexOf('\n];', start);
const arrText = src.slice(start + 'const tests = '.length, end + 2);
const tests = eval(arrText);
const apiTests = tests.filter(t => t[1].startsWith('/api/'));
const base = 'http://localhost:3000';

function classify(code, body, err) {
  if (err) return ['BROKEN', `fetch error: ${err}`];
  if (code === 501) {
    let msg = '';
    try { msg = JSON.parse(body)?.message || JSON.parse(body)?.error || ''; } catch {}
    return ['STUB_501', msg || 'research stub'];
  }
  if (code === 503) {
    let msg = '';
    try { const j = JSON.parse(body); msg = j?.message || j?.error || j?.reason || ''; } catch {}
    return ['DISABLED', msg || 'service unavailable'];
  }
  if (code >= 400) {
    return ['BROKEN', `HTTP ${code}: ${body.slice(0,120)}`];
  }
  if (code >= 200 && code < 400) {
    let j = null;
    try { j = JSON.parse(body); } catch { 
      // non-JSON 200 (e.g., PDF/XLSX/CSV). If body has length, treat as OK
      if (body.length > 0) return ['OK', `non-json body ${body.length}b`];
      return ['DEGRADED', 'empty body'];
    }
    const s = JSON.stringify(j).toLowerCase();
    if (j && j.success === false) return ['DEGRADED', `success:false ${j.error||j.message||''}`.slice(0,120)];
    if (Array.isArray(j?.requires) && j.requires.length) return ['DEGRADED', `requires: ${j.requires.join(',')}`];
    if (j?.requires) return ['DEGRADED', `requires: ${JSON.stringify(j.requires)}`];
    if (s.includes('invalid authorization key')) return ['DEGRADED', 'invalid authorization key'];
    if (s.includes('upstream') && (s.includes('fail')||s.includes('unavailable')||s.includes('error'))) return ['DEGRADED', 'upstream failure'];
    if (s.includes('source unavailable')) return ['DEGRADED', 'source unavailable'];
    if (s.includes('placeholder')) return ['DEGRADED', 'placeholder'];
    if (j === null) return ['DEGRADED', 'null body'];
    if (Array.isArray(j) && j.length === 0) return ['DEGRADED', 'empty array'];
    if (typeof j === 'object' && Object.keys(j).length === 0) return ['DEGRADED', 'empty object'];
    // Detect data:null / empty data
    if (j && 'data' in j && (j.data === null || (Array.isArray(j.data) && j.data.length===0))) return ['DEGRADED', 'data null/empty'];
    if (j && j.degraded === true) return ['DEGRADED', j.reason||'flagged degraded'];
    return ['OK', `keys: ${Object.keys(j).slice(0,5).join(',')}`];
  }
  return ['BROKEN', `unexpected code ${code}`];
}

const results = [];
const sleep = ms => new Promise(r => setTimeout(r, ms));
for (const [method, path, body, label] of apiTests) {
  await sleep(80);
  const url = base + path;
  const opts = { method, headers: {}, signal: AbortSignal.timeout(25000) };
  if (body) { opts.headers['Content-Type']='application/json'; opts.body = JSON.stringify(body); }
  let code=0, text='', err='';
  try { const r = await fetch(url, opts); code = r.status; text = await r.text(); }
  catch(e){ err = e.message; }
  const [status, reason] = classify(code, text, err);
  results.push({ status, method, path, code, reason, label });
  console.log(`${status.padEnd(9)} ${method.padEnd(5)} ${path.padEnd(50)} ${reason}`);
}

const counts = {};
for (const r of results) counts[r.status] = (counts[r.status]||0)+1;
console.log('\n=== COUNTS ===');
for (const k of Object.keys(counts).sort()) console.log(`  ${k}: ${counts[k]}`);

for (const cat of ['DEGRADED','DISABLED','BROKEN','STUB_501']) {
  const list = results.filter(r => r.status === cat);
  console.log(`\n=== ${cat} (${list.length}) ===`);
  for (const r of list) console.log(`  ${r.method} ${r.path}  HTTP ${r.code}  -> ${r.reason}`);
}

const ts = new Date().toISOString().replace(/[-:T]/g,'').slice(0,13).replace(/(\d{8})(\d{4})/,'$1_$2');
const file = `crc/deep_audit_${ts}.log`;
let out = `Deep audit ${new Date().toISOString()}\nBase: ${base}\n\n`;
for (const r of results) out += `${r.status}\t${r.method}\t${r.path}\tHTTP ${r.code}\t${r.reason}\n`;
out += '\nCOUNTS:\n';
for (const k of Object.keys(counts).sort()) out += `  ${k}: ${counts[k]}\n`;
writeFileSync(file, out);
console.log(`\nSaved: ${file}`);
