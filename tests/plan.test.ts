import {describe, expect, it} from 'vitest';
import {
  createTurboWarpARScenePlan,
  normalizeARSceneControl,
  validateARSceneControl
} from '../src/plan.js';

describe('TurboWarp AR scene plans', () => {
  it('normalizes camera defaults, layers, and target bindings', () => {
    expect(
      normalizeARSceneControl({
        targets: [{targetId: 'marker-1', selector: '#scene-box-1'}]
      })
    ).toEqual({
      cameraId: 'default',
      layer: 'camera-under-3d',
      targets: [{targetId: 'marker-1', selector: '#scene-box-1'}]
    });
  });

  it('normalizes camera identifiers for TurboWarp block arguments', () => {
    expect(normalizeARSceneControl({cameraId: ' front camera '})).toMatchObject({
      cameraId: 'front-camera'
    });
    expect(normalizeARSceneControl({cameraId: ' / '})).toMatchObject({
      cameraId: '-'
    });
  });

  it('plans low-level TurboWarp AR calls', () => {
    expect(
      createTurboWarpARScenePlan({
        cameraId: 'front',
        targets: [{targetId: 'marker-1', selector: '#card'}]
      })
    ).toEqual([
      {
        extension: 'turbowarp-ar',
        opcode: 'createARScene',
        args: {CAMERA_ID: 'front', LAYER: 'camera-under-3d'}
      },
      {
        extension: 'turbowarp-ar',
        opcode: 'defineARTarget',
        args: {TARGET_ID: 'marker-1'}
      },
      {
        extension: 'turbowarp-ar',
        opcode: 'attachSelectorToARTarget',
        args: {SELECTOR: '#card', TARGET_ID: 'marker-1'}
      }
    ]);
  });

  it('rejects unsupported AR scene control shapes', () => {
    expect(() => validateARSceneControl(null)).toThrow(
      'TurboWarp AR scene control must be an object.'
    );
    expect(() => validateARSceneControl({extra: true})).toThrow(
      'TurboWarp AR scene control extra is not supported.'
    );
    expect(() => validateARSceneControl({targets: 'marker-1'})).toThrow(
      'TurboWarp AR scene control targets must be an array.'
    );
    expect(() => validateARSceneControl({targets: [{targetId: '', selector: '#card'}]})).toThrow(
      'TurboWarp AR ar.targets[0].targetId must be a non-empty string.'
    );
  });
});
