/**
 * AquaScan unsupported claims (P0 audit 2026-11-13; directive §5 "do not
 * generate unsupported success percentages or guaranteed drilling depths/yields").
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const src = (f: string) => readFileSync(join(__dirname, '..', '..', 'external', 'borehole-ai-engine', 'src', f), 'utf8');
const visible = (s: string) => s.split(/\r?\n/).filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');

describe('AquaScan claims', () => {
  it('R2: the evidence ladder carries no accuracy percentages', () => {
    const ui = src('index.tsx');
    expect(ui).not.toMatch(/Path to 95% Accuracy/);
    expect(ui).not.toMatch(/accuracy: '(65-75|72-80|78-85|82-90|88-93|92-96)%'/);
    expect(ui).toMatch(/Evidence in this report/);
  });

  it('no fixed "expected outcome" promised for every site', () => {
    expect(src('index.tsx')).not.toMatch(/yield ≈10±1 m³\/hr/);
  });

  it('success is a MODELLED score, never labelled a probability on screen or in the report', () => {
    for (const f of ['index.tsx', 'reportGenerator.ts']) {
      expect(visible(src(f))).not.toMatch(/success probability/i);
    }
    expect(src('reportGenerator.ts')).toMatch(/MODELLED, uncalibrated/);
    expect(src('index.tsx')).toMatch(/a score, not a probability/);
  });

  it('science tables and survey tiers state no unvalidated accuracy percentages', () => {
    expect(src('scienceData.ts')).not.toMatch(/accuracy:'\d+% ?(accuracy|precision)?'/);
    expect(visible(src('smartSurveyPlanner.ts'))).not.toMatch(/\d+(-\d+)?% accuracy/);
  });

  it('R5: no aquifer parameters from an invented thickness', () => {
    expect(src('fieldCalibrationEngine.ts')).not.toMatch(/pt\.drawdownM \* 2 \|\| 30/);
    expect(src('fieldCalibrationEngine.ts')).not.toMatch(/GOOD aquifer \(sustainable\)/);
  });
});
