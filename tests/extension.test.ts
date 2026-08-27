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
            mirrored: false,
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

  it('syncs attached selectors to DOM or A-Frame attributes', () => {
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
});
