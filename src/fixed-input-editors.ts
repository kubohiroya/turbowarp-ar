import {parseFixedNumberInput} from '@kubohiroya/turbowarp-extension-data-editor';
import type {FixedInputBinding, FixedInputEditorOptions, FixedBlockSnapshot, JsonValue, LiteralValue} from '@kubohiroya/turbowarp-extension-data-editor';
import {fixedInputBundle} from './fixed-input-schema.js';

const invalid = () => [{message: 'Invalid fixed input.'}];
function number(value: JsonValue | LiteralValue): number {
  if ((typeof value !== 'number' && typeof value !== 'string') ||
      (typeof value === 'string' && value.trim() === '')) throw new TypeError('Unrepresentable numeric literal.');
  const result = Number(value);
  if (!Number.isFinite(result)) throw new TypeError('Nonfinite numeric literal.');
  return result;
}
function numericBinding(opcode: string, argument: string): FixedInputBinding {
  return {argument, schemaBundle: fixedInputBundle(opcode, argument), control: {label: argument, kind: 'number'}, read: number,
    encode(value) {
      const parsed = parseFixedNumberInput(value);
      if (parsed.kind !== 'valid') throw new TypeError('Invalid numeric token.');
      return parsed.token;
    },
    validateCandidate(candidate, _context, finalSnapshot) {
      try { number(candidate); return ownerCheck(opcode, argument, candidate, finalSnapshot) ? [] : invalid(); }
      catch { return invalid(); }
    }};
}
function enumBinding(opcode: string, argument: string, choices: readonly string[], normalization: 'none'|'trim'|'trim-lower'): FixedInputBinding {
  const project = (value: JsonValue|LiteralValue) => {
    if (typeof value !== 'string') return value;
    const normalized = normalization === 'none' ? value : normalization === 'trim' ? value.trim() : value.trim().toLowerCase();
    return choices.includes(normalized) ? normalized : value;
  };
  return {argument, schemaBundle: fixedInputBundle(opcode, argument), control: {label: argument, kind: 'enum', choices: choices.map(value=>({value}))},
    read: project,
    encode(value) { if(typeof value !== 'string' || !choices.includes(value)) throw new TypeError('Choose a known value.'); return value; },
    validateCandidate(candidate, _context, finalSnapshot) {
      try {return typeof candidate === 'string' && choices.includes(candidate) && ownerCheck(opcode, argument, candidate, finalSnapshot) ? [] : invalid();}
      catch {return invalid();}
    }};
}
// Per-field schema constraints are checked by the common prepared engine against the exact candidate.
// Clamp/fallback and device/session prerequisites remain runtime behavior, never editor providers.
function ownerCheck(_opcode: string, _argument: string, _candidate: LiteralValue, _snapshot: FixedBlockSnapshot): boolean { void [_opcode, _argument, _candidate, _snapshot]; return true; }

const extensionId = 'kubohiroyaar';
const validationContext = () => ({consumerId:'turbowarp-ar', nowMs:0, settings:null});
export const fixedInputEditors: readonly FixedInputEditorOptions[] = [
  {apiVersion: 1, extensionId, editorId: 'createARScene-fixed', opcodes: [`${extensionId}_createARScene`],
    contractId: 'turbowarp-ar/createARScene', contractRevision: '1', validationContext,
    readOnlyArguments: [],
    bindings: [
    enumBinding('createARScene', 'LAYER', ["above-stage", "below-stage"], 'trim')
    ]
  },
  {apiVersion: 1, extensionId, editorId: 'setARTargetVisible-fixed', opcodes: [`${extensionId}_setARTargetVisible`],
    contractId: 'turbowarp-ar/setARTargetVisible', contractRevision: '1', validationContext,
    readOnlyArguments: ["VISIBLE"],
    bindings: [
    numericBinding('setARTargetVisible', 'CONFIDENCE')
    ]
  },
  {apiVersion: 1, extensionId, editorId: 'setARTargetPosition-fixed', opcodes: [`${extensionId}_setARTargetPosition`],
    contractId: 'turbowarp-ar/setARTargetPosition', contractRevision: '1', validationContext,
    readOnlyArguments: [],
    bindings: [
    numericBinding('setARTargetPosition', 'X'),
    numericBinding('setARTargetPosition', 'Y'),
    numericBinding('setARTargetPosition', 'Z')
    ]
  },
  {apiVersion: 1, extensionId, editorId: 'setARTargetRotation-fixed', opcodes: [`${extensionId}_setARTargetRotation`],
    contractId: 'turbowarp-ar/setARTargetRotation', contractRevision: '1', validationContext,
    readOnlyArguments: [],
    bindings: [
    numericBinding('setARTargetRotation', 'X'),
    numericBinding('setARTargetRotation', 'Y'),
    numericBinding('setARTargetRotation', 'Z')
    ]
  },
  {apiVersion: 1, extensionId, editorId: 'arTargetPosition-fixed', opcodes: [`${extensionId}_arTargetPosition`],
    contractId: 'turbowarp-ar/arTargetPosition', contractRevision: '1', validationContext,
    readOnlyArguments: [],
    bindings: [
    enumBinding('arTargetPosition', 'AXIS', ["x", "y", "z"], 'trim-lower')
    ]
  },
  {apiVersion: 1, extensionId, editorId: 'arTargetRotation-fixed', opcodes: [`${extensionId}_arTargetRotation`],
    contractId: 'turbowarp-ar/arTargetRotation', contractRevision: '1', validationContext,
    readOnlyArguments: [],
    bindings: [
    enumBinding('arTargetRotation', 'AXIS', ["x", "y", "z"], 'trim-lower')
    ]
  }
];

interface RuntimeLifetime {
  on?: (event: string, listener: () => void) => void;
  off?: (event: string, listener: () => void) => void;
}

/** Register metadata only; the GUI startup capability owns editor activation. */
export function registerFixedInputEditors(
  scratch: unknown, definitions: readonly FixedInputEditorOptions[], runtimeOverride?: RuntimeLifetime
): () => void {
  const host = scratch as {gui?: {blockEditors?: {apiVersion?: number;
    registerFixedInputEditor?: (options: FixedInputEditorOptions) => () => void}};
    vm?: {runtime?: RuntimeLifetime}};
  const api = host.gui?.blockEditors;
  if (!definitions.length || api?.apiVersion !== 1 || typeof api.registerFixedInputEditor !== 'function') return () => {};
  const runtime = runtimeOverride ?? host.vm?.runtime;
  const removers: (() => void)[] = [];
  let active = true;
  const dispose = () => {
    if (!active) return;
    active = false;
    runtime?.off?.('RUNTIME_DISPOSED', dispose);
    for (const remove of removers.splice(0).reverse()) remove();
  };
  try {
    for (const definition of definitions) {
      const remove = api.registerFixedInputEditor.call(api, definition);
      if (typeof remove !== 'function') throw new TypeError('Invalid fixed input registration disposer.');
      removers.push(remove);
    }
    runtime?.on?.('RUNTIME_DISPOSED', dispose);
  } catch (error) {dispose(); throw error;}
  return dispose;
}
