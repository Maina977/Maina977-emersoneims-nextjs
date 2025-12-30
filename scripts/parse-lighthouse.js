const path = require('path');

function pick(obj, keys) {
  for (const key of keys) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, key)) return obj[key];
  }
  return undefined;
}

function fmtMs(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return 'n/a';
  return `${Math.round(n)}ms`;
}

function main() {
  const reportPath = process.argv[2] || path.join(process.cwd(), 'lighthouse.vercel.json');
  const report = require(reportPath);
  const audits = report.audits || {};

  const metrics = [
    'first-contentful-paint',
    'largest-contentful-paint',
    'speed-index',
    'total-blocking-time',
    'cumulative-layout-shift',
  ];

  console.log('METRICS');
  for (const id of metrics) {
    const audit = audits[id];
    if (!audit) continue;
    console.log(`${id}: ${pick(audit, ['displayValue', 'numericValue'])}`);
  }

  const opportunities = Object.entries(audits)
    .filter(([, v]) => v && v.details && v.details.type === 'opportunity')
    .map(([id, v]) => ({
      id,
      title: v.title,
      wastedMs: v.details.overallSavingsMs || 0,
      displayValue: v.displayValue || '',
    }))
    .filter((o) => o.wastedMs > 0)
    .sort((a, b) => b.wastedMs - a.wastedMs)
    .slice(0, 20);

  console.log('\nOPPORTUNITIES (Top)');
  for (const o of opportunities) {
    console.log(`- ${o.id}: ${o.title} | ~${fmtMs(o.wastedMs)} | ${o.displayValue}`);
  }

  const diagnostics = [
    'render-blocking-resources',
    'unused-javascript',
    'unused-css-rules',
    'third-party-summary',
    'bootup-time',
    'mainthread-work-breakdown',
    'largest-contentful-paint-element',
    'server-response-time',
  ];

  console.log('\nDIAGNOSTICS');
  for (const id of diagnostics) {
    const audit = audits[id];
    if (!audit) continue;
    const score = audit.score == null ? 'n/a' : audit.score;
    console.log(`- ${id}: score=${score} ${audit.displayValue || ''}`);
  }

  const bootup = audits['bootup-time'];
  if (bootup?.details?.items?.length) {
    console.log('\nBOOTUP-TIME (Top scripts)');
    const items = [...bootup.details.items]
      .filter((it) => typeof it.total === 'number')
      .sort((a, b) => b.total - a.total)
      .slice(0, 15);
    for (const it of items) {
      console.log(`- ${it.url}: ${fmtMs(it.total)}`);
    }
  }

  const mainThread = audits['mainthread-work-breakdown'];
  if (mainThread?.details?.items?.length) {
    console.log('\nMAIN-THREAD (Breakdown)');
    const items = [...mainThread.details.items]
      .filter((it) => typeof it.duration === 'number')
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 15);
    for (const it of items) {
      console.log(`- ${it.groupLabel || it.group}: ${fmtMs(it.duration)}`);
    }
  }

  const lcpEl = audits['largest-contentful-paint-element'];
  const lcpNode = lcpEl?.details?.items?.[0]?.node;
  if (lcpNode) {
    console.log('\nLCP-ELEMENT');
    if (lcpNode.snippet) console.log(lcpNode.snippet);
    if (lcpNode.selector) console.log(`selector: ${lcpNode.selector}`);
  }
}

main();
