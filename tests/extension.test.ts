import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {TurboWarpARExtension} from '../src/extension.js';

function stubScratch(runtime: Record<string, unknown> = {}) {
  vi.stubGlobal('Scratch', {
    vm: {runtime},
    BlockType: {
      COMMAND: 'command',
      REPORTER: 'reporter',
      BOOLEAN: 'boolean',
      HAT: 'hat'
    },
    ArgumentType: {
      STRING: 'string',
      NUMBER: 'number',
      BOOLEAN: 'boolean'
    },
    Cast: {
      toString: (value: unknown) => String(value),
      toNumber: (value: unknown) => Number(value),
      toBoolean: (value: unknown) => value === true || value === 'true'
    },
    translate: (
      message: string | {default: string},
      placeholders: Record<string, string | number> = {}
    ) => {
      const text = typeof message === 'string' ? message : message.default;
      return Object.entries(placeholders).reduce(
        (result, [name, value]) => result.replace(`{${name}}`, String(value)),
        text
      );
    }
  });
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });
  return {promise, resolve, reject};
}

beforeEach(() => {
  stubScratch();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('TurboWarpARExtension', () => {
  it('publishes AR metadata and blocks', () => {
    const info = new TurboWarpARExtension().getInfo() as {
      id: string;
      name: string;
      docsURI: string;
      blocks: Array<{opcode: string; text: string}>;
    };

    expect(info.id).toBe('kubohiroyaar');
    expect(info.name).toBe('TurboWarp-AR');
    expect(info.docsURI).toBe('https://kubohiroya.github.io/turbowarp-ar/');
    expect(info.blocks.map((block) => block.opcode)).toContain('createARScene');
    expect(info.blocks.map((block) => block.opcode)).toContain('whenARTargetFound');
  });

  it('reports no-camera-source without throwing when camera-source is missing', async () => {
    const extension = new TurboWarpARExtension();

    await extension.createARScene({CAMERA_ID: 'default', LAYER: 'above-stage'});

    expect(extension.arStatus()).toBe('no-camera-source');
    expect(extension.isARSceneRunning()).toBe(false);
  });

  it('starts and stops a camera-source backed session', async () => {
    const release = vi.fn(async () => {});
    stubScratch({
      ext_kubohiroyacamerasource: {
        acquireCamera: vi.fn(async () => ({
          getFrameSource: () => ({
            kind: 'video',
            element: {srcObject: null} as HTMLVideoElement,
            width: 640,
            height: 480,
            previewFlip: 'none',
            deviceId: 'device-1'
          }),
          release
        }))
      }
    });
    const extension = new TurboWarpARExtension();

    await extension.createARScene({CAMERA_ID: 'pose', LAYER: 'above-stage'});

    expect(extension.arStatus()).toBe('running');
    expect(extension.isARSceneRunning()).toBe(true);

    await extension.stopARScene();

    expect(release).toHaveBeenCalledOnce();
    expect(extension.arStatus()).toBe('idle');
  });

  it('releases the camera lease when frame source setup fails', async () => {
    const release = vi.fn(async () => {});
    stubScratch({
      ext_kubohiroyacamerasource: {
        acquireCamera: vi.fn(async () => ({
          getFrameSource: () => {
            throw new Error('missing frame');
          },
          release
        }))
      }
    });
    const extension = new TurboWarpARExtension();

    await extension.createARScene({CAMERA_ID: 'pose', LAYER: 'above-stage'});

    expect(release).toHaveBeenCalledOnce();
    expect(extension.arStatus()).toBe('camera-error');
    expect(extension.isARSceneRunning()).toBe(false);
  });

  it('keeps the latest AR scene when starts resolve out of order', async () => {
    const first = deferred<{
      getFrameSource: () => HTMLVideoElement;
      release: () => Promise<void>;
    }>();
    const second = deferred<{
      getFrameSource: () => HTMLVideoElement;
      release: () => Promise<void>;
    }>();
    const firstRelease = vi.fn(async () => {});
    const secondRelease = vi.fn(async () => {});
    const acquireCamera = vi
      .fn()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);
    stubScratch({ext_kubohiroyacamerasource: {acquireCamera}});
    const extension = new TurboWarpARExtension();

    const firstStart = extension.createARScene({CAMERA_ID: 'first', LAYER: 'above-stage'});
    const secondStart = extension.createARScene({CAMERA_ID: 'second', LAYER: 'above-stage'});
    await Promise.resolve();
    await Promise.resolve();

    second.resolve({
      getFrameSource: () =>
        ({
          kind: 'video',
          element: {srcObject: null} as HTMLVideoElement,
          width: 640,
          height: 480,
          previewFlip: 'none',
          deviceId: 'device-2'
        }) as unknown as HTMLVideoElement,
      release: secondRelease
    });
    await secondStart;

    first.resolve({
      getFrameSource: () =>
        ({
          kind: 'video',
          element: {srcObject: null} as HTMLVideoElement,
          width: 640,
          height: 480,
          previewFlip: 'none',
          deviceId: 'device-1'
        }) as unknown as HTMLVideoElement,
      release: firstRelease
    });
    await firstStart;

    expect(firstRelease).toHaveBeenCalledOnce();
    expect(secondRelease).not.toHaveBeenCalled();
    expect(extension.arStatus()).toBe('running');
    expect(extension.snapshot()).toMatchObject({session: {cameraId: 'second'}});
  });

  it('settles to idle even if camera lease release rejects', async () => {
    const release = vi.fn(async () => {
      throw new Error('release failed');
    });
    stubScratch({
      ext_kubohiroyacamerasource: {
        acquireCamera: vi.fn(async () => ({
          getFrameSource: () => ({
            kind: 'video',
            element: {srcObject: null} as HTMLVideoElement,
            width: 640,
            height: 480,
            previewFlip: 'none',
            deviceId: 'device-1'
          }),
          release
        }))
      }
    });
    const extension = new TurboWarpARExtension();
    await extension.createARScene({CAMERA_ID: 'pose', LAYER: 'above-stage'});

    await extension.stopARScene();

    expect(release).toHaveBeenCalledOnce();
    expect(extension.arStatus()).toBe('idle');
    expect(extension.isARSceneRunning()).toBe(false);
  });

  it('updates manual target state and emits found and lost transitions once', () => {
    const extension = new TurboWarpARExtension();
    extension.defineARTarget({TARGET_ID: 'marker-1'});

    extension.setARTargetPosition({TARGET_ID: 'marker-1', X: 1, Y: 2, Z: 3});
    extension.setARTargetRotation({TARGET_ID: 'marker-1', X: 10, Y: 20, Z: 30});
    extension.setARTargetVisible({TARGET_ID: 'marker-1', VISIBLE: true, CONFIDENCE: 0.75});

    expect(extension.isARTargetVisible({TARGET_ID: 'marker-1'})).toBe(true);
    expect(extension.arTargetConfidence({TARGET_ID: 'marker-1'})).toBe(0.75);
    expect(extension.arTargetPosition({TARGET_ID: 'marker-1', AXIS: 'y'})).toBe(2);
    expect(extension.arTargetRotation({TARGET_ID: 'marker-1', AXIS: 'z'})).toBe(30);
    expect(extension.whenARTargetFound({TARGET_ID: 'marker-1'})).toBe(true);
    expect(extension.whenARTargetFound({TARGET_ID: 'marker-1'})).toBe(false);

    extension.setARTargetVisible({TARGET_ID: 'marker-1', VISIBLE: false, CONFIDENCE: 0});

    expect(extension.whenARTargetLost({TARGET_ID: 'marker-1'})).toBe(true);
    expect(extension.whenARTargetLost({TARGET_ID: 'marker-1'})).toBe(false);
  });

  it('falls back to plain DOM attributes when no A-Frame capability is present', () => {
    const attributes = new Map<string, string>();
    const element = {
      setAttribute: vi.fn((name: string, value: string) => attributes.set(name, value))
    } as unknown as Element;
    vi.stubGlobal('document', {
      querySelectorAll: vi.fn((selector: string) => (selector === '#card' ? [element] : []))
    });
    const extension = new TurboWarpARExtension();

    extension.attachSelectorToARTarget({SELECTOR: '#card', TARGET_ID: 'marker-1'});
    extension.setARTargetPosition({TARGET_ID: 'marker-1', X: 1, Y: 2, Z: 3});
    extension.setARTargetRotation({TARGET_ID: 'marker-1', X: 10, Y: 20, Z: 30});
    extension.setARTargetVisible({TARGET_ID: 'marker-1', VISIBLE: true, CONFIDENCE: 0.5});

    expect(attributes.get('visible')).toBe('true');
    expect(attributes.get('position')).toBe('1 2 3');
    expect(attributes.get('rotation')).toBe('10 20 30');
    expect(attributes.get('data-ar-target')).toBe('marker-1');
    expect(attributes.get('data-ar-confidence')).toBe('0.5');
  });

  it('writes attached pose through the A-Frame capability for nodes A-Frame owns', () => {
    const port = {
      setPosition: vi.fn(),
      setRotation: vi.fn(),
      setAttribute: vi.fn(),
      setData: vi.fn(),
      countSelector: vi.fn((selector: string) => (selector === '#card' ? 1 : 0))
    };
    stubScratch({turbowarpAFrameCapability: port});
    const element = {setAttribute: vi.fn()} as unknown as Element;
    vi.stubGlobal('document', {querySelectorAll: vi.fn(() => [element])});
    const extension = new TurboWarpARExtension();

    extension.attachSelectorToARTarget({SELECTOR: '#card', TARGET_ID: 'marker-1'});
    extension.setARTargetPosition({TARGET_ID: 'marker-1', X: 1, Y: 2, Z: 3});
    extension.setARTargetRotation({TARGET_ID: 'marker-1', X: 10, Y: 20, Z: 30});
    extension.setARTargetVisible({TARGET_ID: 'marker-1', VISIBLE: true, CONFIDENCE: 0.5});

    expect(port.setPosition).toHaveBeenLastCalledWith('#card', 1, 2, 3);
    expect(port.setRotation).toHaveBeenLastCalledWith('#card', 10, 20, 30);
    expect(port.setAttribute).toHaveBeenLastCalledWith('#card', 'visible', 'true');
    expect(port.setData).toHaveBeenCalledWith('#card', 'ar-target', 'marker-1');
    expect(port.setData).toHaveBeenCalledWith('#card', 'ar-confidence', '0.5');
    expect(element.setAttribute).not.toHaveBeenCalled();
  });

  it('uses the DOM for selectors A-Frame does not own, and for a disposed capability', () => {
    const unowned = {
      setPosition: vi.fn(),
      setRotation: vi.fn(),
      setAttribute: vi.fn(),
      setData: vi.fn(),
      countSelector: vi.fn(() => 0)
    };
    const disposed = {
      setPosition: vi.fn(),
      setRotation: vi.fn(),
      setAttribute: vi.fn(),
      setData: vi.fn(),
      countSelector: vi.fn(() => {
        throw new Error('A-Frame runtime capability is disposed.');
      })
    };

    for (const port of [unowned, disposed]) {
      stubScratch({turbowarpAFrameCapability: port});
      const attributes = new Map<string, string>();
      vi.stubGlobal('document', {
        querySelectorAll: vi.fn(() => [
          {setAttribute: (name: string, value: string) => attributes.set(name, value)}
        ])
      });
      const extension = new TurboWarpARExtension();

      extension.attachSelectorToARTarget({SELECTOR: '#plain', TARGET_ID: 'marker-1'});
      extension.setARTargetPosition({TARGET_ID: 'marker-1', X: 1, Y: 2, Z: 3});

      expect(attributes.get('position')).toBe('1 2 3');
      expect(port.setPosition).not.toHaveBeenCalled();
    }
  });

  it('keeps a block layer inside the vocabulary the background understands', async () => {
    stubScratch({
      ext_kubohiroyacamerasource: {
        acquireCamera: vi.fn(async () => ({
          getFrameSource: () => ({
            kind: 'video',
            element: {srcObject: null} as HTMLVideoElement,
            width: 640,
            height: 480,
            previewFlip: 'none',
            deviceId: 'device-1'
          }),
          release: vi.fn(async () => {})
        }))
      }
    });

    const unknownLayer = new TurboWarpARExtension();
    await unknownLayer.createARScene({CAMERA_ID: 'pose', LAYER: 'camera-under-3d'});
    expect(unknownLayer.snapshot()).toMatchObject({session: {layer: 'above-stage'}});

    const belowStage = new TurboWarpARExtension();
    await belowStage.createARScene({CAMERA_ID: 'pose', LAYER: 'below-stage'});
    expect(belowStage.snapshot()).toMatchObject({session: {layer: 'below-stage'}});
  });
});
