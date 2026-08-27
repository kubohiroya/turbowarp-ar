export const DEFAULT_AR_LAYER = 'camera-under-3d';
export function normalizeARSceneControl(control) {
    validateARSceneControl(control);
    return {
        cameraId: normalizeId(control.cameraId ?? 'default') || 'default',
        layer: control.layer ?? DEFAULT_AR_LAYER,
        targets: [...(control.targets ?? [])]
    };
}
export function createTurboWarpARScenePlan(control) {
    const normalized = normalizeARSceneControl(control);
    const calls = [
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
            args: { TARGET_ID: target.targetId }
        });
        calls.push({
            extension: 'turbowarp-ar',
            opcode: 'attachSelectorToARTarget',
            args: { SELECTOR: target.selector, TARGET_ID: target.targetId }
        });
    }
    return calls;
}
export function validateARSceneControl(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new TypeError('TurboWarp AR scene control must be an object.');
    }
    const control = value;
    for (const key of Object.keys(control)) {
        if (key !== 'cameraId' && key !== 'layer' && key !== 'targets') {
            throw new TypeError(`TurboWarp AR scene control ${key} is not supported.`);
        }
    }
    validateOptionalString(control['cameraId'], 'ar.cameraId');
    validateOptionalString(control['layer'], 'ar.layer');
    const targets = control['targets'];
    if (targets === undefined)
        return;
    if (!Array.isArray(targets)) {
        throw new TypeError('TurboWarp AR scene control targets must be an array.');
    }
    targets.forEach((target, index) => {
        validateARTargetBinding(target, `ar.targets[${index}]`);
    });
}
function validateARTargetBinding(value, path) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new TypeError(`TurboWarp AR ${path} must be an object.`);
    }
    const target = value;
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
function validateOptionalString(value, path) {
    if (value === undefined || typeof value === 'string')
        return;
    throw new TypeError(`TurboWarp AR scene control ${path} must be a string.`);
}
function normalizeId(value) {
    return value.trim().replace(/[^a-zA-Z0-9_-]/g, '-');
}
//# sourceMappingURL=plan.js.map