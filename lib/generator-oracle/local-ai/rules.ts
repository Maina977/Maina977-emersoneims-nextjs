/**
 * GENERATOR ORACLE — Deterministic rule engine.
 *
 * Every diagnosis runs through these rules BEFORE the reasoning model is
 * called. They are intentionally not LLM-driven: the rule engine is the
 * load-bearing safety boundary. Anything that produces a `block` violation
 * causes the route to refuse with code RULE_BLOCK and never reach Ollama.
 *
 * Rules implemented (per blueprint section C):
 *   - asset card completeness
 *   - controller known
 *   - ECM compatibility
 *   - fault-code validity for controller
 *   - safety lockouts
 *   - firmware write without backup → block
 *   - protection-device bypass → block
 */

import { AssetCardSchema, type AssetCard } from './schemas';

export type Severity = 'block' | 'warn';

export interface RuleViolation {
  rule: string;
  severity: Severity;
  message: string;
  detail?: string;
}

// ─── KNOWN CONTROLLERS / ECM COMPAT ───────────────────────────────────────────

const KNOWN_CONTROLLERS: ReadonlyArray<string> = [
  'DSE',
  'Deep Sea',
  'Deep Sea Electronics',
  'ComAp',
  'Woodward',
  'SmartGen',
  'Datakom',
  'Lovato',
  'DEIF',
  'Sices',
  'Bernini',
  'PowerWizard',
  'EMCP',
  'PowerCommand',
  'Volvo Penta',
  'MTU',
  'Perkins ECM',
  'John Deere',
];

const FAULT_CODE_PATTERN: Record<string, RegExp> = {
  // DSE codes are usually a leading letter + 1-4 digits (E0015, A102), or
  // SPN/FMI strings. SmartGen and ComAp are similar. We keep this loose
  // because the deterministic check is "is this *plausibly* a code for
  // this controller", not "is this in the bundled DB".
  DSE: /^(?:E|A|W)\d{1,4}$|^SPN\s?\d+(?:\/FMI\s?\d+)?$/i,
  ComAp: /^(?:[A-Za-z]{1,3})?\d{1,4}$/,
  Woodward: /^(?:[A-Z]{0,3})\d{1,4}$/,
  SmartGen: /^\d{1,4}$/,
  Datakom: /^\d{1,4}$/,
  PowerCommand: /^(?:[A-Z]{0,3})\d{1,4}$/,
  EMCP: /^E\d{1,4}|SPN\s?\d+/i,
};

function controllerKey(controller: string): string | null {
  const c = controller.trim().toLowerCase();
  if (!c) return null;
  if (c.includes('deep sea') || c === 'dse') return 'DSE';
  if (c.includes('comap') || c.includes('inteligen') || c.includes('intelilite')) return 'ComAp';
  if (c.includes('woodward') || c.includes('easygen')) return 'Woodward';
  if (c.includes('smartgen') || c.startsWith('hgm')) return 'SmartGen';
  if (c.includes('datakom') || c.startsWith('dkg')) return 'Datakom';
  if (c.includes('powercommand') || c.includes('pcc')) return 'PowerCommand';
  if (c.includes('emcp') || c.includes('caterpillar')) return 'EMCP';
  return null;
}

// ─── ASSET CARD ──────────────────────────────────────────────────────────────

export function assertAssetCardComplete(
  card: unknown,
): RuleViolation[] {
  const result = AssetCardSchema.safeParse(card);
  if (result.success) return [];
  return result.error.issues.map((i) => ({
    rule: 'asset_card_complete',
    severity: 'block' as const,
    message: `Asset card incomplete: ${i.path.join('.') || 'card'} — ${i.message}`,
  }));
}

export function assertControllerKnown(controller: string): RuleViolation[] {
  if (!controller) {
    return [
      {
        rule: 'controller_known',
        severity: 'block',
        message: 'Controller is required',
      },
    ];
  }
  const key = controllerKey(controller);
  if (key) return [];
  const allowedAsFreeText = KNOWN_CONTROLLERS.some((k) =>
    controller.toLowerCase().includes(k.toLowerCase()),
  );
  if (allowedAsFreeText) return [];
  return [
    {
      rule: 'controller_known',
      severity: 'warn',
      message: `Controller "${controller}" is not in the known controller registry — diagnosis will be marked verification_required.`,
    },
  ];
}

// ─── ECM COMPATIBILITY ────────────────────────────────────────────────────────

export function assertECMCompatible(
  card: AssetCard,
): RuleViolation[] {
  // Cross-make/controller checks. The list is conservative and exists to
  // refuse obviously-impossible combinations rather than to enforce an
  // exhaustive compatibility matrix (that lives in the retrieval corpus).
  const make = card.make.toLowerCase();
  const controller = card.controller.toLowerCase();

  const obviouslyMismatched =
    (make.includes('cummins') && controller.includes('emcp')) ||
    (make.includes('caterpillar') && controller.includes('powercommand'));

  if (obviouslyMismatched) {
    return [
      {
        rule: 'ecm_compatibility',
        severity: 'warn',
        message: `Unusual pairing: ${card.make} engine with ${card.controller} controller. Confirm wiring + protocol before applying any diagnosis output.`,
      },
    ];
  }
  return [];
}

// ─── FAULT CODE FORMAT ────────────────────────────────────────────────────────

export function assertFaultCodeValid(
  controller: string,
  faultCode: string | undefined | null,
): RuleViolation[] {
  if (!faultCode) return [];
  const key = controllerKey(controller);
  if (!key) return []; // can't validate format we don't know
  const re = FAULT_CODE_PATTERN[key];
  if (!re) return [];
  if (re.test(faultCode.trim())) return [];
  return [
    {
      rule: 'fault_code_format',
      severity: 'warn',
      message: `Fault code "${faultCode}" does not match the typical ${key} format. Verify the code as displayed before relying on the diagnosis.`,
    },
  ];
}

// ─── SAFETY LOCKOUTS ──────────────────────────────────────────────────────────

const HIGH_RISK_PHRASES: ReadonlyArray<RegExp> = [
  /\bbypass\b.*\b(emergency stop|e-?stop|shutdown|protection|interlock|safety)\b/i,
  /\bdisable\b.*\b(over[\s-]?speed|over[\s-]?temperature|low[\s-]?oil|protection|alarm|shutdown)\b/i,
  /\bjumper\b.*\b(safety|interlock|shutdown|sensor)\b/i,
  /\bremove\b.*\b(safety guard|shroud|fan guard|protection cover)\b/i,
];

export function assertNoProtectionBypass(
  freeText: string | undefined | null,
): RuleViolation[] {
  if (!freeText) return [];
  for (const re of HIGH_RISK_PHRASES) {
    if (re.test(freeText)) {
      return [
        {
          rule: 'protection_bypass',
          severity: 'block',
          message:
            'Refused: this request asks the assistant to bypass or disable a protective device. Generator Oracle does not provide protection-bypass procedures.',
          detail: freeText.slice(0, 200),
        },
      ];
    }
  }
  return [];
}

// ─── FIRMWARE WRITE WITHOUT BACKUP ────────────────────────────────────────────

const FIRMWARE_WRITE_PHRASES: ReadonlyArray<RegExp> = [
  /\b(flash|reflash|reprogram|update|upload|write)\b.*\b(firmware|ecu|ecm|calibration)\b/i,
  /\b(insite|cat\s*et|vodia|est|technicstation)\b.*\b(write|program|flash)\b/i,
];

export function assertNoFirmwareWriteWithoutBackup(opts: {
  freeText?: string | null;
  backupConfirmed?: boolean;
}): RuleViolation[] {
  if (!opts.freeText) return [];
  const wantsWrite = FIRMWARE_WRITE_PHRASES.some((re) => re.test(opts.freeText!));
  if (!wantsWrite) return [];
  if (opts.backupConfirmed) return [];
  return [
    {
      rule: 'firmware_write_requires_backup',
      severity: 'block',
      message:
        'Refused: firmware / calibration write procedures are blocked unless the technician has confirmed an existing calibration backup. Set backupConfirmed=true on the request only after the backup is captured.',
    },
  ];
}

// ─── PRE-FLIGHT BUNDLE ────────────────────────────────────────────────────────

export interface PreflightInput {
  card: unknown; // validated inside
  faultCode?: string | null;
  freeText?: string | null;
  backupConfirmed?: boolean;
}

export function runAllPreflightRules(
  input: PreflightInput,
): { ok: boolean; violations: RuleViolation[]; card: AssetCard | null } {
  const violations: RuleViolation[] = [];
  const cardErrors = assertAssetCardComplete(input.card);
  violations.push(...cardErrors);
  if (cardErrors.length) {
    return { ok: false, violations, card: null };
  }
  const card = input.card as AssetCard;
  violations.push(...assertControllerKnown(card.controller));
  violations.push(...assertECMCompatible(card));
  violations.push(...assertFaultCodeValid(card.controller, input.faultCode));
  violations.push(...assertNoProtectionBypass(input.freeText));
  violations.push(
    ...assertNoFirmwareWriteWithoutBackup({
      freeText: input.freeText,
      backupConfirmed: input.backupConfirmed,
    }),
  );
  const blocked = violations.some((v) => v.severity === 'block');
  return { ok: !blocked, violations, card };
}
