# Third-party notices

`dist/turbowarp-aframe.js` bundles `@pixiv/three-vrm` 3.5.5 to load VRM avatars. It includes
`@pixiv/three-vrm-core`, `@pixiv/three-vrm-materials-mtoon`,
`@pixiv/three-vrm-materials-hdr-emissive-multiplier`, `@pixiv/three-vrm-materials-v0compat`,
`@pixiv/three-vrm-node-constraint`, and `@pixiv/three-vrm-springbone` of the same version.
Copyright (c) 2019-2026 pixiv Inc. They are distributed under the MIT License, and their license
banners are kept in the bundle:

- <https://github.com/pixiv/three-vrm>
- <https://github.com/pixiv/three-vrm/blob/release/LICENSE>

A-Frame 1.8.0 is not bundled. The extension loads it at runtime from jsDelivr, pinned by version
and subresource integrity, unless the page already has it. A-Frame is distributed under the MIT
License:

- <https://github.com/aframevr/aframe>
