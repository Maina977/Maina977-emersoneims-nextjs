/**
 * Generator Oracle independent audit, 2026-10-31: emergencies get a safety line
 * on every path, and alarms that can injure carry their warnings.
 */
import { describe, it, expect } from 'vitest';
import { diagnoseFromSymptoms, searchIndex, withSafety } from '@/lib/generator-oracle/server/faultIndex';

const safety = (s: string) => (diagnoseFromSymptoms({ symptoms: [s] }).safety ?? []).join(' ');

describe('emergency symptoms', () => {
  it('runaway engine', () => expect(safety('runaway engine')).toMatch(/RUNAWAY/));
  it('fire, and it does not list misfire', () => {
    const r = diagnoseFromSymptoms({ symptoms: ['fire in generator'] });
    expect((r.safety ?? []).join(' ')).toMatch(/FIRE/);
    expect(r.ranked.some((x) => /misfire/i.test(x.title))).toBe(false);
  });
  it('misfire alone is not treated as a fire', () => expect(safety('engine misfire')).not.toMatch(/FIRE:/));
  it('electric shock from the frame', () => expect(safety('electric shock from frame')).toMatch(/SHOCK/));
  it('carbon monoxide and exhaust leak', () => {
    expect(safety('carbon monoxide in generator room')).toMatch(/EXHAUST GAS IS DEADLY/);
    expect(safety('exhaust leak')).toMatch(/EXHAUST GAS IS DEADLY/);
  });
  it('the lookup box carries the warning too', () => {
    const r = searchIndex({ query: 'runaway engine', page: 1, pageSize: 10 }) as { notice?: string };
    expect(r.notice).toMatch(/^SAFETY FIRST/);
  });
});

describe('alarm safety', () => {
  const rows = (query: string) => searchIndex({ query, page: 1, pageSize: 50 }).results as Array<Record<string, any>>;
  // The audit's exact alarms, through the safety step every entry goes through.
  const entry = (title: string, code = 'E008') => withSafety({ id: 'x', code, title, subcategory: '', category: '', brand: 'ComAp', model: '', description: '', severity: 'warning', safetyWarnings: [], diagnosticSteps: [], resetPathways: [] } as any);
  it('fail to stop is critical, with a fuel shut-off instruction', () => {
    for (const title of ['Fail to Stop', 'Failed to Stop', 'Failure to stop']) {
      const r = entry(title);
      expect(r.severity).toBe('critical');
      expect(r.safetyWarnings.join(' ')).toMatch(/fuel supply/);
    }
  });
  it('fail to stop is found in search and rated critical', () => {
    const r = rows('fail to stop').filter((x) => /fail(ed|ure)?\s*to\s*stop/i.test(x.title));
    expect(r.length).toBeGreaterThan(0);
    for (const x of r) expect(x.severity).toBe('critical');
  });
  it('a ground fault carries the earth-fault warning', () => {
    expect(entry('Ground Fault Detected', 'B011').safetyWarnings.join(' ')).toMatch(/live/);
  });
  it('symptoms alarms do not answer point to the guide', () => {
    const r = searchIndex({ query: 'black smoke under load', page: 1, pageSize: 10 }) as { notice?: string };
    expect(r.notice).toMatch(/^GUIDE:/);
  });
  it('oil in coolant names the likely causes, not an unrelated alarm', () => {
    const r = diagnoseFromSymptoms({ symptoms: ['oil in coolant'] });
    expect(r.ranked.length).toBe(0);
    expect(r.notes.join(' ')).toMatch(/head gasket/);
  });
});

describe('first steps fit the fault', () => {
  const steps = (title: string) => withSafety({ id: 'x', code: 'E1', title, subcategory: '', category: '', brand: 'ComAp', model: '', description: '', severity: 'warning', safetyWarnings: [], diagnosticSteps: [{ step: 1, action: 'Review setpoint configuration', expectedResult: '' }], resetPathways: [] } as any).diagnosticSteps;
  it('a low-oil shutdown starts at the dipstick, and steps are renumbered', () => {
    const s = steps('Low Oil Pressure Shutdown');
    expect(s[0].action).toMatch(/dipstick/);
    expect(s.map((x: any) => x.step)).toEqual([1, 2, 3]);
  });
  it('an alarm with no specific rule is left as written', () => expect(steps('Maintenance Due').length).toBe(1));
});

describe('re-audit: no loose matching', () => {
  const full = (title: string, code = 'E1', severity = 'warning') => withSafety({ id: 'x', code, title, subcategory: '', category: '', brand: 'ComAp', model: '', description: '', severity, safetyWarnings: [], diagnosticSteps: [], resetPathways: [] } as any);
  const steps = (title: string, code = 'E1') => full(title, code).diagnosticSteps.map((s: any) => s.action).join(' ');
  const warn = (title: string, code = 'E1') => full(title, code).safetyWarnings.join(' ');
  it('crankcase is not cranking, turbocharger is not charging', () => {
    expect(steps('High Crankcase Pressure')).not.toMatch(/battery/i);
    expect(steps('Turbocharger Speed High')).not.toMatch(/battery/i);
    expect(warn('Turbocharger Speed High')).not.toMatch(/explosive gas/);
  });
  it('mains alarms do not send you to the alternator', () => {
    expect(steps('Mains Over Voltage')).not.toMatch(/alternator terminals/);
    expect(steps('Mains Under Frequency')).not.toMatch(/fuel filters/);
  });
  it('high fuel level is not told to refuel', () => expect(steps('High Fuel Level')).not.toMatch(/Refuel/));
  it('battery low voltage goes to the battery; a clock battery does not', () => {
    expect(steps('Battery Low Voltage')).toMatch(/Measure battery voltage/);
    expect(steps('Real Time Clock Battery')).not.toMatch(/charge alternator/);
  });
  it('J1939 rows: the failure mode does not pick the warning', () => {
    expect(warn('Engine Oil Pressure - Voltage Above Normal', 'SPN100-FMI3')).not.toMatch(/lethal/i);
    expect(warn('Injector 1 - Grounded Circuit', 'SPN651-FMI6')).not.toMatch(/exposed metalwork/);
    expect(warn('Injector 1 - Grounded Circuit', 'SPN651-FMI6')).toMatch(/penetrates skin/);
    expect(steps('Crankcase Pressure - Above Normal', 'SPN101-FMI0')).not.toMatch(/battery/i);
  });
  it('a critical J1939 row always says something', () => {
    expect(full('Some Component - Above Normal', 'SPN9999-FMI0', 'critical').safetyWarnings.length).toBeGreaterThan(0);
  });
});

describe('re-audit: real emergencies only', () => {
  const hazard = (s: string) => safety(s);
  it("everyday wording raises no alarm", () => {
    for (const s of ["cranks but won't fire", 'no fire', 'fire pump generator']) expect(hazard(s)).not.toMatch(/FIRE:/);
    for (const s of ['shock absorber broken', 'anti vibration mount shock']) expect(hazard(s)).not.toMatch(/SHOCK/);
  });
  it('real ones do, and list no fault rows', () => {
    expect(hazard('engine ran away')).toMatch(/RUNAWAY/);
    expect(diagnoseFromSymptoms({ symptoms: ['fire in generator'] }).ranked.length).toBe(0);
  });
  it('a fuel leak warns in the lookup too', () => {
    expect((searchIndex({ query: 'fuel leak', page: 1, pageSize: 10 }) as { notice?: string }).notice).toMatch(/^SAFETY FIRST/);
  });
});
