// Single-Line Diagram (SLD) generator — emits an IEC-60617-flavoured SVG.
//
// This is a deliberately small, dependency-free generator: enough to give a
// quoted customer a credible one-line, with every box labelled with the
// real selected component. For full IEC 60617 compliance use a CAD tool;
// this file is engineered for in-proposal preview.

'use strict';

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;'
  })[c]);
}

/**
 * @param {{
 *   panel:    { manufacturer:string, model:string, pStcW:number },
 *   panelCount: number,
 *   stringSeries: number,
 *   stringsParallel: number,
 *   inverter: { manufacturer:string, model:string, acRatedKw:number, acVoltageV:number, acPhases:1|3 },
 *   battery?: { manufacturer:string, model:string, usableKwh:number }|null,
 *   ocpd: {
 *     stringFuse:  { recommendedStdA:number },
 *     acBreaker?:  { recommendedStdA:number }|null
 *   },
 *   wiring: {
 *     dcCsaMm2: number,
 *     acCsaMm2: number
 *   }
 * }} sys
 */
function generateSLD(sys) {
  if (!sys || !sys.panel || !sys.inverter || !sys.ocpd || !sys.wiring) {
    throw new Error('generateSLD: incomplete system descriptor');
  }
  const W = 900;
  const H = sys.battery ? 720 : 560;
  const blocks = [];

  // helper to draw a labelled box
  function box(x, y, w, h, title, sub) {
    return `
      <g>
        <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="#0b3d91" stroke-width="2" rx="6"/>
        <text x="${x + w / 2}" y="${y + 22}" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#0b3d91">${esc(title)}</text>
        <text x="${x + w / 2}" y="${y + 42}" text-anchor="middle" font-family="Arial" font-size="11" fill="#333">${esc(sub)}</text>
      </g>`;
  }
  function wire(x1, y1, x2, y2, label) {
    const mid = (a, b) => (a + b) / 2;
    return `
      <g>
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#222" stroke-width="2"/>
        ${label ? `<text x="${mid(x1, x2) + 8}" y="${mid(y1, y2) - 4}" font-family="Arial" font-size="10" fill="#444">${esc(label)}</text>` : ''}
      </g>`;
  }
  function fuseSymbol(cx, cy, label) {
    return `
      <g>
        <rect x="${cx - 14}" y="${cy - 8}" width="28" height="16" fill="#ffeb99" stroke="#a07000" stroke-width="1.5"/>
        <text x="${cx}" y="${cy + 28}" text-anchor="middle" font-family="Arial" font-size="10" fill="#444">${esc(label)}</text>
      </g>`;
  }

  // --- Layout ---
  // PV array (top-left)
  const pvX = 40, pvY = 40, pvW = 260, pvH = 90;
  blocks.push(box(pvX, pvY, pvW, pvH,
    `PV Array — ${sys.panelCount} × ${sys.panel.model}`,
    `${sys.stringSeries}S × ${sys.stringsParallel}P  ·  ${(sys.panelCount * sys.panel.pStcW / 1000).toFixed(2)} kWp`));

  // DC Combiner / fuses
  const cbX = 360, cbY = 60, cbW = 160, cbH = 60;
  blocks.push(box(cbX, cbY, cbW, cbH, 'DC Combiner', `gPV fuses ${sys.ocpd.stringFuse.recommendedStdA} A · IEC 60269-6`));
  blocks.push(wire(pvX + pvW, pvY + pvH / 2, cbX, cbY + cbH / 2, `${sys.wiring.dcCsaMm2} mm² Cu DC`));
  blocks.push(fuseSymbol(cbX + cbW / 2, cbY - 14, ''));

  // DC isolator
  const isoX = 580, isoY = 60, isoW = 110, isoH = 60;
  blocks.push(box(isoX, isoY, isoW, isoH, 'DC Isolator', 'IEC 60947-3'));
  blocks.push(wire(cbX + cbW, cbY + cbH / 2, isoX, isoY + isoH / 2));

  // Inverter
  const invX = 360, invY = 200, invW = 330, invH = 90;
  blocks.push(box(invX, invY, invW, invH,
    `Inverter — ${sys.inverter.manufacturer} ${sys.inverter.model}`,
    `${sys.inverter.acRatedKw} kW · ${sys.inverter.acVoltageV} V · ${sys.inverter.acPhases}-phase`));
  blocks.push(wire(isoX + isoW / 2, isoY + isoH, invX + invW / 2, invY));

  // AC Isolator
  const acIsoX = 360, acIsoY = 340, acIsoW = 160, acIsoH = 60;
  blocks.push(box(acIsoX, acIsoY, acIsoW, acIsoH, 'AC Isolator',
    sys.ocpd.acBreaker ? `MCB ${sys.ocpd.acBreaker.recommendedStdA} A · IEC 60898` : 'IEC 60947-3'));
  blocks.push(wire(invX + invW / 2, invY + invH, acIsoX + acIsoW / 2, acIsoY,
    `${sys.wiring.acCsaMm2} mm² Cu AC`));

  // Meter & grid
  const metX = 580, metY = 340, metW = 110, metH = 60;
  blocks.push(box(metX, metY, metW, metH, 'kWh Meter', 'Bi-directional'));
  blocks.push(wire(acIsoX + acIsoW, acIsoY + acIsoH / 2, metX, metY + metH / 2));

  const grdX = 740, grdY = 340, grdW = 120, grdH = 60;
  blocks.push(box(grdX, grdY, grdW, grdH, 'Utility Grid', `${sys.inverter.acVoltageV} V`));
  blocks.push(wire(metX + metW, metY + metH / 2, grdX, grdY + grdH / 2));

  // Optional battery branch
  if (sys.battery) {
    const batX = 40, batY = 480, batW = 260, batH = 80;
    blocks.push(box(batX, batY, batW, batH,
      `Battery — ${sys.battery.manufacturer} ${sys.battery.model}`,
      `${sys.battery.usableKwh} kWh usable`));
    blocks.push(wire(invX + invW / 2, invY + invH, batX + batW / 2, batY,
      'DC link (hybrid)'));
  }

  // Title
  const title = `<text x="${W / 2}" y="22" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="#0b3d91">SolarGeniusPro — Single-Line Diagram</text>`;
  const footer = `<text x="${W / 2}" y="${H - 6}" text-anchor="middle" font-family="Arial" font-size="10" fill="#666">Symbols approximate IEC 60617. Conductors sized per IEC 60364-5-52. OCPD per NEC 690.9 / IEC 60269-6.</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="#f7f9fc"/>
    ${title}
    ${blocks.join('\n')}
    ${footer}
  </svg>`;
}

module.exports = { generateSLD };
