import type {ARSceneLayer} from './plan.js';

/** The only capability version this build provides; any other requested version is refused. */
export const runtimeCapabilityVersion = 1 as const;
export const runtimeCapabilityKey = 'turbowarpARCapability';

/**
 * AR scene construction and lifecycle, for an extension that builds an AR scene from a description
 * rather than from blocks.
 *
 * It deliberately stops at construction. Target pose is set by the blocks today, and by a tracking
 * provider later; neither belongs behind this port until that provider's boundary is designed.
 */
export interface ARScenePort {
  /** Starts a session by leasing the named camera and mounting its frames as the background. */
  createARScene(cameraId: string, layer: ARSceneLayer): Promise<void>;
  /** Stops the session and releases the camera lease. */
  stopARScene(): Promise<void>;
  /** Creates or resets a named target. */
  defineARTarget(targetId: string): void;
  attachSelectorToARTarget(selector: string, targetId: string): void;
  detachSelectorFromARTarget(selector: string): void;
  /** One of idle, starting, running, no-camera-source, camera-error. */
  arStatus(): string;
}

export interface ARRuntimeCapabilityV1 extends ARScenePort {
  readonly version: typeof runtimeCapabilityVersion;
  requireVersion(version: number): ARRuntimeCapabilityV1;
}

export function createRuntimeCapability(scene: ARScenePort): ARRuntimeCapabilityV1 {
  const port: ARScenePort = {
    async createARScene(cameraId, layer) {
      await scene.createARScene(cameraId, layer);
    },
    async stopARScene() {
      await scene.stopARScene();
    },
    defineARTarget(targetId) {
      scene.defineARTarget(targetId);
    },
    attachSelectorToARTarget(selector, targetId) {
      scene.attachSelectorToARTarget(selector, targetId);
    },
    detachSelectorFromARTarget(selector) {
      scene.detachSelectorFromARTarget(selector);
    },
    arStatus() {
      return scene.arStatus();
    }
  };

  const capability: ARRuntimeCapabilityV1 = Object.freeze({
    version: runtimeCapabilityVersion,
    requireVersion(version: number) {
      if (version !== runtimeCapabilityVersion) {
        throw new Error(
          `Unsupported TurboWarp AR runtime capability version: ${version}; supported version is ${runtimeCapabilityVersion}.`
        );
      }
      return capability;
    },
    ...port
  });
  return capability;
}
