/**
 * Where the AR camera background sits relative to the TurboWarp stage.
 *
 * This is the whole vocabulary the extension understands, and it is the same one
 * `turbowarp-aframe` uses for its 3D scene host. The AR background always renders under a 3D scene
 * on the same layer, because the two hosts are given fixed, adjacent stacking positions; that
 * ordering is a property of the two extensions, not a layer name a caller can ask for.
 */
export type ARSceneLayer = 'above-stage' | 'below-stage';

export const AR_SCENE_LAYERS: readonly ARSceneLayer[] = Object.freeze([
  'above-stage',
  'below-stage'
]);

export interface ARTargetBinding {
  targetId: string;
  selector: string;
}

export interface ARSceneControl {
  cameraId?: string;
  layer?: ARSceneLayer;
  targets?: ARTargetBinding[];
}

export interface NormalizedARSceneControl {
  cameraId: string;
  layer: ARSceneLayer;
  targets: ARTargetBinding[];
}

export type TurboWarpARScenePlanCall =
  | {
      extension: 'turbowarp-ar';
      opcode: 'createARScene';
      args: {CAMERA_ID: string; LAYER: string};
    }
  | {
      extension: 'turbowarp-ar';
      opcode: 'defineARTarget';
      args: {TARGET_ID: string};
    }
  | {
      extension: 'turbowarp-ar';
      opcode: 'attachSelectorToARTarget';
      args: {SELECTOR: string; TARGET_ID: string};
    };

/** Matches the `createARScene` block default, so a planned call and a hand-placed block agree. */
export const DEFAULT_AR_LAYER: ARSceneLayer = 'above-stage';

export function normalizeARSceneControl(control: ARSceneControl): NormalizedARSceneControl {
  validateARSceneControl(control);
  return {
    cameraId: normalizeId(control.cameraId ?? 'default') || 'default',
    layer: control.layer ?? DEFAULT_AR_LAYER,
    targets: [...(control.targets ?? [])]
  };
}

export function createTurboWarpARScenePlan(
  control: ARSceneControl
): TurboWarpARScenePlanCall[] {
  const normalized = normalizeARSceneControl(control);
  const calls: TurboWarpARScenePlanCall[] = [
    {
      extension: 'turbowarp-ar',
      opcode: 'createARScene',
      args: {
        CAMERA_ID: normalized.cameraId,
        LAYER: normalized.layer
      }
    }
  ];

  for (const target of normalized.targets) {
    calls.push({
      extension: 'turbowarp-ar',
      opcode: 'defineARTarget',
      args: {TARGET_ID: target.targetId}
    });
    calls.push({
      extension: 'turbowarp-ar',
      opcode: 'attachSelectorToARTarget',
      args: {SELECTOR: target.selector, TARGET_ID: target.targetId}
    });
  }

  return calls;
}

export function validateARSceneControl(value: unknown): asserts value is ARSceneControl {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new TypeError('TurboWarp AR scene control must be an object.');
  }
  const control = value as Record<string, unknown>;
  for (const key of Object.keys(control)) {
    if (key !== 'cameraId' && key !== 'layer' && key !== 'targets') {
      throw new TypeError(`TurboWarp AR scene control ${key} is not supported.`);
    }
  }
  validateOptionalString(control['cameraId'], 'ar.cameraId');
  validateLayer(control['layer']);
  const targets = control['targets'];
  if (targets === undefined) return;
  if (!Array.isArray(targets)) {
    throw new TypeError('TurboWarp AR scene control targets must be an array.');
  }
  targets.forEach((target, index) => {
    validateARTargetBinding(target, `ar.targets[${index}]`);
  });
}

function validateARTargetBinding(value: unknown, path: string): void {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new TypeError(`TurboWarp AR ${path} must be an object.`);
  }
  const target = value as Record<string, unknown>;
  for (const key of Object.keys(target)) {
    if (key !== 'targetId' && key !== 'selector') {
      throw new TypeError(`TurboWarp AR ${path}.${key} is not supported.`);
    }
  }
  if (typeof target['targetId'] !== 'string' || target['targetId'].trim().length === 0) {
    throw new TypeError(`TurboWarp AR ${path}.targetId must be a non-empty string.`);
  }
  if (typeof target['selector'] !== 'string' || target['selector'].trim().length === 0) {
    throw new TypeError(`TurboWarp AR ${path}.selector must be a non-empty string.`);
  }
}

function validateLayer(value: unknown): void {
  if (value === undefined) return;
  validateOptionalString(value, 'ar.layer');
  if (!AR_SCENE_LAYERS.includes(value as ARSceneLayer)) {
    throw new TypeError(
      `TurboWarp AR scene control ar.layer must be one of ${AR_SCENE_LAYERS.join(', ')}.`
    );
  }
}

function validateOptionalString(value: unknown, path: string): void {
  if (value === undefined || typeof value === 'string') return;
  throw new TypeError(`TurboWarp AR scene control ${path} must be a string.`);
}

function normalizeId(value: string): string {
  return value.trim().replace(/[^a-zA-Z0-9_-]/g, '-');
}
