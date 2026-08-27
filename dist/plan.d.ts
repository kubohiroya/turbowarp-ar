export interface ARTargetBinding {
    targetId: string;
    selector: string;
}
export interface ARSceneControl {
    cameraId?: string;
    layer?: string;
    targets?: ARTargetBinding[];
}
export interface NormalizedARSceneControl {
    cameraId: string;
    layer: string;
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
export declare const DEFAULT_AR_LAYER = "camera-under-3d";
export declare function normalizeARSceneControl(control: ARSceneControl): NormalizedARSceneControl;
export declare function createTurboWarpARScenePlan(control: ARSceneControl): TurboWarpARScenePlanCall[];
export declare function validateARSceneControl(value: unknown): asserts value is ARSceneControl;
//# sourceMappingURL=plan.d.ts.map