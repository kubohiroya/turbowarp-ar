/**
 * Where the AR camera background sits relative to the TurboWarp stage.
 *
 * This is the whole vocabulary the extension understands, and it is the same one
 * `turbowarp-aframe` uses for its 3D scene host. The AR background always renders under a 3D scene
 * on the same layer, because the two hosts are given fixed, adjacent stacking positions; that
 * ordering is a property of the two extensions, not a layer name a caller can ask for.
 */
export type ARSceneLayer = 'above-stage' | 'below-stage';
export declare const AR_SCENE_LAYERS: readonly ARSceneLayer[];
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
export type TurboWarpARScenePlanCall = {
    extension: 'turbowarp-ar';
    opcode: 'createARScene';
    args: {
        CAMERA_ID: string;
        LAYER: string;
    };
} | {
    extension: 'turbowarp-ar';
    opcode: 'defineARTarget';
    args: {
        TARGET_ID: string;
    };
} | {
    extension: 'turbowarp-ar';
    opcode: 'attachSelectorToARTarget';
    args: {
        SELECTOR: string;
        TARGET_ID: string;
    };
};
/** Matches the `createARScene` block default, so a planned call and a hand-placed block agree. */
export declare const DEFAULT_AR_LAYER: ARSceneLayer;
export declare function normalizeARSceneControl(control: ARSceneControl): NormalizedARSceneControl;
export declare function createTurboWarpARScenePlan(control: ARSceneControl): TurboWarpARScenePlanCall[];
export declare function validateARSceneControl(value: unknown): asserts value is ARSceneControl;
//# sourceMappingURL=plan.d.ts.map