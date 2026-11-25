// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// Management decision P3 (2026-11-25): the Technician Assistant is withdrawn until its
// safety corrections pass independent review. Its module must not be imported by any
// shipped source file (so it is not in the build), and the tab shows the notice.
const ROOTS = ['app', 'components', 'lib'];
function files(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? files(p) : /\.(tsx?|jsx?|mjs)$/.test(e.name) ? [p] : [];
  });
}

describe('Technician Assistant withdrawn (P3)', () => {
  it('no shipped source file imports the Technician Assistant panel', () => {
    const importers = ROOTS.flatMap((r) => files(path.resolve(r)))
      .filter((f) => !f.endsWith(path.join('panels', 'TechnicianAssistantPanel.tsx')))
      .filter((f) => /panels\/TechnicianAssistantPanel['"]/.test(fs.readFileSync(f, 'utf8')));
    expect(importers).toEqual([]);
  });

  it('the Assistant tab renders the management notice', async () => {
    const src = fs.readFileSync(path.resolve('components/generator-oracle/GeneratorOracleModule.tsx'), 'utf8');
    expect(src).toContain("Technician Assistant is temporarily unavailable while safety checks are being updated. Please consult the applicable OEM service manual and a qualified technician.");
    expect(src).toMatch(/toolsSubTab === 'assistant' && <TechnicianAssistantPanel \/>/);
    expect(src).toMatch(/function TechnicianAssistantPanel\(\)/);
  });
});
