# Architecture

[日本語](architecture.ja.md)

## Responsibility boundary

This extension owns three things and deliberately owns nothing else.

1. **The camera background.** It leases a named camera from `turbowarp-camera-source` and mounts
   its frames as a page-level background layer. It never opens a camera itself and never keeps a
   frame.
2. **Named target state.** Visibility, confidence, position, and rotation per target id, plus the
   found and lost edges derived from visibility changes. Nothing writes this state except the
   blocks; there is no detector behind it yet, so "AR target" here names the slot a future marker
   or WebXR provider will fill, not a thing currently being tracked.
3. **Attachment.** A selector attached to a target is kept on that target's pose.

It does not own the 3D scene. `turbowarp-aframe` does, and attachment writes go through that
extension's runtime capability whenever it owns the matching nodes, so its scene state and the
attributes on the page cannot drift apart. The capability's methods are feature-detected rather
than version-gated, matching how that capability is documented to grow. A selector A-Frame does not
own, a disposed capability, and a page with no A-Frame all fall back to plain DOM attributes.

Both the blocks and `turbowarpARCapability` reach these through the same handlers, so an extension
that builds an AR scene from a description gets the behavior the blocks have. That port covers scene
construction and lifecycle only; pose stays with the blocks until a tracking provider exists.

It does not own scene planning either. `@kubohiroya/turbowarp-ar/plan` is a build-time module, not
part of `dist/ar.js`; it validates AR scene control data and emits the low-level calls that set an
AR scene up, for generators that build TurboWarp projects.

### The layer vocabulary

`above-stage` and `below-stage` are the whole vocabulary, shared with `turbowarp-aframe`'s 3D scene
host. `plan.ts` defines it once and both the plan API and the runtime use that definition, so the
three cannot drift. The plan API rejects anything outside it; the blocks, which take whatever
string a project hands them, fall back to `above-stage` instead of stopping a script.

Relative order is structural, not nameable: on `above-stage` the camera background is given a
stacking position one step below the 3D scene host, so a 3D scene renders over the camera image.
Either extension changing its host stacking has to keep the other in step.

## Build outputs

The project keeps runtime behavior and compatibility metadata separate while generating both from
the same checked-in source definitions.

```text
src/index.ts + src/extension.ts
  -> vite-plugin-turbowarp-extension
  -> dist/<extension>.js

src/config.ts + src/block-definitions.json
  -> extension-api-manifest Vite plugin
  -> dist/extension-manifest.json
```

The manifest plugin runs in Vite's post-build phase. This preserves the JavaScript plugin's
single-output validation and adds the manifest only after the TurboWarp bundle is complete.

## Extension API manifest v1

`schemas/extension-manifest.schema.json` is the normative JSON Schema. `formatVersion` is `1` and
must change when an incompatible manifest shape is introduced.

The v1 contract contains:

- the TurboWarp extension ID;
- each block opcode and block type;
- each argument ID, argument type, and optional menu reference;
- each menu ID and whether it accepts reporter blocks.

Blocks, arguments, and menus are sorted by their identifiers before serialization. Text,
descriptions, default values, and static menu items are intentionally excluded because they do not
identify saved-project API references. A compatibility checker can therefore distinguish API
changes from documentation or localization changes.

## Drift detection

`dist/` is committed as a release artifact. `npm run check:dist` rebuilds both files and fails when
Git reports any modified, deleted, or untracked file below `dist/`. This catches manifest and bundle
drift in local checks and CI.
