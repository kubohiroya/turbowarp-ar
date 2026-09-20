# TurboWarp-AR

**English** | [日本語](README.ja.md)

TurboWarp-AR puts a shared camera image behind the TurboWarp stage and keeps named target poses that scene nodes can follow. It uses `turbowarp-camera-source` for camera acquisition and writes to A-Frame nodes through `turbowarp-aframe`'s runtime capability when that extension is present.

**It does not track anything yet.** Target pose and visibility come from blocks a project sets by hand, not from marker detection or WebXR. The blocks exist so the API boundary is fixed before a real provider is written; until one is, treat this extension as a camera backdrop plus a named pose store.

## What it does

- Starts and stops a session by leasing a named shared camera, and mounts its frames as a background layer.
- Holds named target state — visibility, confidence, position, rotation — set by blocks, with no detection behind it.
- Emits found and lost hat events when a target's visibility changes.
- Reports target visibility, confidence, position, and rotation.
- Writes attached selectors to that target pose, through the A-Frame capability when A-Frame owns the nodes.

A future marker or WebXR provider can update the same target state these blocks set, which is why the state and its blocks exist before any provider does.

## Requirements and safety

- TurboWarp's **Run extension without sandbox** option.
- `turbowarp-camera-source` loaded in the same project before this extension.
- HTTPS or another browser secure context when using a real camera.
- Browser camera permission.

TurboWarp-AR does not upload camera frames or store images. Camera access is delegated to `turbowarp-camera-source`.

## Install

Load `turbowarp-camera-source` first, then load this extension as an unsandboxed custom extension.

```text
https://cdn.jsdelivr.net/npm/@kubohiroya/turbowarp-ar@0.3.0/dist/ar.js
```

For local development:

```bash
pnpm add @kubohiroya/turbowarp-ar@0.3.0
```

## Quick start

```text
create AR scene with camera [default] layer [above-stage]
define AR target [marker-1]
attach selector [#card] to AR target [marker-1]
set AR target [marker-1] visible [true] confidence [1]
set AR target [marker-1] position x [0] y [0] z [-1]
```

## A-Frame integration

A-Frame is optional. Attach a node by CSS selector and TurboWarp-AR keeps it on the target pose, writing `visible`, `position`, `rotation`, `data-ar-target`, and `data-ar-confidence`.

When `turbowarp-aframe` is loaded, those writes go through its runtime capability (`setPosition`, `setRotation`, `setAttribute`, `setData`) rather than the DOM, so the scene state that extension maintains stays in step with the attributes on the page. TurboWarp-AR asks the capability whether it owns the selector, and a selector it does not own — or a page with no A-Frame at all — is written with plain DOM attributes instead. TurboWarp-AR never reaches into a node A-Frame owns behind that extension's back.

### Layers

`create AR scene` takes `above-stage` or `below-stage`, the same two values `turbowarp-aframe` uses for its 3D scene host, and an unrecognized value falls back to `above-stage`. On `above-stage` the camera background is given a stacking position one step below the 3D scene host, so a 3D scene always renders over the camera image. That ordering is fixed by the two extensions; there is no layer value that asks for it.

## Plan API

Applications that generate TurboWarp setup scripts can import `@kubohiroya/turbowarp-ar/plan`. The plan API does not register the extension; it only validates AR scene control data and returns the low-level TurboWarp AR calls needed to create an AR scene and bind selectors to AR targets.

```ts
import {createTurboWarpARScenePlan} from '@kubohiroya/turbowarp-ar/plan';

const calls = createTurboWarpARScenePlan({
  cameraId: 'front',
  targets: [{targetId: 'marker-1', selector: '#card'}]
});
```

`layer` accepts only `above-stage` (the default) and `below-stage`, the same vocabulary the block and the runtime use; `validateARSceneControl` rejects anything else, so a generator cannot emit a layer the extension would silently discard.

## Block reference

<!-- BEGIN GENERATED BLOCKS -->

### `create AR scene with camera [CAMERA_ID] layer [LAYER]`

Starts an AR session by acquiring a shared camera-source camera lease.

| Property | Value |
|---|---|
| Type | Command |
| Opcode | `createARScene` |
| `CAMERA_ID` | String, default: `default` |
| `LAYER` | String, default: `above-stage` |

### `stop AR scene`

Stops the AR session and releases the shared camera lease.

| Property | Value |
|---|---|
| Type | Command |
| Opcode | `stopARScene` |

### `AR status`

Returns the AR session status.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `arStatus` |

### `AR scene is running?`

Reports whether the AR session is running.

| Property | Value |
|---|---|
| Type | Boolean |
| Opcode | `isARSceneRunning` |

### `define AR target [TARGET_ID]`

Creates or resets a named AR target state.

| Property | Value |
|---|---|
| Type | Command |
| Opcode | `defineARTarget` |
| `TARGET_ID` | String, default: `marker-1` |

### `set AR target [TARGET_ID] visible [VISIBLE] confidence [CONFIDENCE]`

Updates a target's visibility and confidence using the manual MVP backend.

| Property | Value |
|---|---|
| Type | Command |
| Opcode | `setARTargetVisible` |
| `TARGET_ID` | String, default: `marker-1` |
| `VISIBLE` | Boolean, default: `true` |
| `CONFIDENCE` | Number, default: `1` |

### `set AR target [TARGET_ID] position x [X] y [Y] z [Z]`

Updates a target's position in AR scene coordinates.

| Property | Value |
|---|---|
| Type | Command |
| Opcode | `setARTargetPosition` |
| `TARGET_ID` | String, default: `marker-1` |
| `X` | Number, default: `0` |
| `Y` | Number, default: `0` |
| `Z` | Number, default: `-1` |

### `set AR target [TARGET_ID] rotation x [X] y [Y] z [Z]`

Updates a target's Euler rotation in degrees.

| Property | Value |
|---|---|
| Type | Command |
| Opcode | `setARTargetRotation` |
| `TARGET_ID` | String, default: `marker-1` |
| `X` | Number, default: `0` |
| `Y` | Number, default: `0` |
| `Z` | Number, default: `0` |

### `AR target [TARGET_ID] is visible?`

Reports whether the target is currently visible.

| Property | Value |
|---|---|
| Type | Boolean |
| Opcode | `isARTargetVisible` |
| `TARGET_ID` | String, default: `marker-1` |

### `AR target [TARGET_ID] confidence`

Returns the target confidence from 0 to 1.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `arTargetConfidence` |
| `TARGET_ID` | String, default: `marker-1` |

### `AR target [TARGET_ID] position [AXIS]`

Returns one axis of the target position.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `arTargetPosition` |
| `TARGET_ID` | String, default: `marker-1` |
| `AXIS` | String, default: `x` |

### `AR target [TARGET_ID] rotation [AXIS]`

Returns one axis of the target rotation.

| Property | Value |
|---|---|
| Type | Reporter |
| Opcode | `arTargetRotation` |
| `TARGET_ID` | String, default: `marker-1` |
| `AXIS` | String, default: `y` |

### `when AR target [TARGET_ID] found`

Fires once when a target transitions from hidden to visible.

| Property | Value |
|---|---|
| Type | Hat |
| Opcode | `whenARTargetFound` |
| `TARGET_ID` | String, default: `marker-1` |

### `when AR target [TARGET_ID] lost`

Fires once when a target transitions from visible to hidden.

| Property | Value |
|---|---|
| Type | Hat |
| Opcode | `whenARTargetLost` |
| `TARGET_ID` | String, default: `marker-1` |

### `attach selector [SELECTOR] to AR target [TARGET_ID]`

Synchronizes matching DOM or A-Frame nodes to an AR target pose.

| Property | Value |
|---|---|
| Type | Command |
| Opcode | `attachSelectorToARTarget` |
| `SELECTOR` | String, default: `#card` |
| `TARGET_ID` | String, default: `marker-1` |

### `detach selector [SELECTOR] from AR target`

Stops synchronizing a selector to any AR target.

| Property | Value |
|---|---|
| Type | Command |
| Opcode | `detachSelectorFromARTarget` |
| `SELECTOR` | String, default: `#card` |

<!-- END GENERATED BLOCKS -->

## Compatibility

The extension ID is `kubohiroyaar`. Changing the extension ID or opcode names requires an SB3 migration plan.

## Development

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm run check
```

The generated extension bundle is `dist/ar.js`; the deterministic API manifest is `dist/extension-manifest.json`.

## License

MPL-2.0. See [LICENSE](LICENSE).
