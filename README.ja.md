# TurboWarp-AR

[English](README.md) | **日本語**

TurboWarp-AR は、`turbowarp-camera-source` をカメラ入力として使う AR セッションと AR target 状態の TurboWarp 拡張です。A-Frame は表示先の1つとして任意連携に留めています。

## できること

- 名前付き shared camera を lease して AR セッションを開始・停止します。
- MVP の manual backend で AR target の状態を決定的に更新できます。
- target の visible 変化から found/lost ハットイベントを発火します。
- target の visible、confidence、position、rotation を reporter で返します。
- selector を attach した DOM / A-Frame 要素へ target の pose を同期します。

初期実装では実マーカー検出や WebXR hit-test は含めず、provider を後から差し替えるための API 境界を先に固定します。

## 要件と安全性

- TurboWarp の **Run extension without sandbox**。
- 同じ作品で `turbowarp-camera-source` を先に読み込むこと。
- 実カメラ利用時は HTTPS または localhost などの secure context。
- ブラウザのカメラ許可。

TurboWarp-AR はカメラフレームをアップロードせず、画像も保存しません。カメラ取得は `turbowarp-camera-source` に委譲します。

## インストール

`turbowarp-camera-source` を先に読み込み、その後この拡張を unsandboxed custom extension として読み込みます。

```text
https://cdn.jsdelivr.net/npm/@kubohiroya/turbowarp-ar@0.1.0/dist/ar.js
```

ローカル開発では次を使います。

```bash
pnpm add @kubohiroya/turbowarp-ar@0.1.0
```

## Quick start

```text
create AR scene with camera [default] layer [above-stage]
define AR target [marker-1]
attach selector [#card] to AR target [marker-1]
set AR target [marker-1] visible [true] confidence [1]
set AR target [marker-1] position x [0] y [0] z [-1]
```

## A-Frame 連携

A-Frame は任意です。ページ内に A-Frame node が存在する場合、CSS selector で attach できます。TurboWarp-AR は一致した要素へ `visible`、`position`、`rotation`、`data-ar-target`、`data-ar-confidence` 属性を書き込みます。

## ブロック一覧

- `create AR scene with camera [CAMERA_ID] layer [LAYER]`
- `stop AR scene`
- `AR status`
- `AR scene is running?`
- `define AR target [TARGET_ID]`
- `set AR target [TARGET_ID] visible [VISIBLE] confidence [CONFIDENCE]`
- `set AR target [TARGET_ID] position x [X] y [Y] z [Z]`
- `set AR target [TARGET_ID] rotation x [X] y [Y] z [Z]`
- `AR target [TARGET_ID] is visible?`
- `AR target [TARGET_ID] confidence`
- `AR target [TARGET_ID] position [AXIS]`
- `AR target [TARGET_ID] rotation [AXIS]`
- `when AR target [TARGET_ID] found`
- `when AR target [TARGET_ID] lost`
- `attach selector [SELECTOR] to AR target [TARGET_ID]`
- `detach selector [SELECTOR] from AR target`

## 互換性

Extension ID は `kubohiroyaar` です。Extension ID や opcode を変更する場合は SB3 migration plan が必要です。

## 開発

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm run check
```

生成される拡張 bundle は `dist/ar.js`、決定的 API manifest は `dist/extension-manifest.json` です。

## ライセンス

MPL-2.0。詳細は [LICENSE](LICENSE) を参照してください。
