# TurboWarp-AR

[English](README.md) | **日本語**

TurboWarp-AR は、共有カメラの映像を TurboWarp ステージの背面に敷き、scene node が追従できる名前付きの target pose を保持する拡張です。カメラ取得は `turbowarp-camera-source` に委譲し、A-Frame node への書き込みは `turbowarp-aframe` が読み込まれていればその runtime capability を通して行います。

**まだ何も追跡していません。** target の pose と visibility は、マーカー検出や WebXR ではなく、作品がブロックで手入力した値です。実 provider を書く前に API 境界を固定するためにブロックだけが先にあります。provider が入るまでは、この拡張は「カメラ背景＋名前付き pose ストア」だと考えてください。

## できること

- 名前付き shared camera を lease してセッションを開始・停止し、その映像を背景レイヤとして設置します。
- 名前付き target の状態（visible、confidence、position、rotation）をブロックからの入力で保持します。背後に検出処理はありません。
- target の visible 変化から found/lost ハットイベントを発火します。
- target の visible、confidence、position、rotation を reporter で返します。
- attach された selector を target pose へ追従させます。A-Frame が node を所有していれば capability 経由で書きます。

将来のマーカー検出や WebXR provider は、これらのブロックが設定するのと同じ target 状態を更新できます。provider より先に状態とブロックがあるのはそのためです。

## 要件と安全性

- TurboWarp の **Run extension without sandbox**。
- 同じ作品で `turbowarp-camera-source` を先に読み込むこと。
- 実カメラ利用時は HTTPS または localhost などの secure context。
- ブラウザのカメラ許可。

TurboWarp-AR はカメラフレームをアップロードせず、画像も保存しません。カメラ取得は `turbowarp-camera-source` に委譲します。

## インストール

`turbowarp-camera-source` を先に読み込み、その後この拡張を unsandboxed custom extension として読み込みます。

```text
https://cdn.jsdelivr.net/npm/@kubohiroya/turbowarp-ar@0.3.0/dist/ar.js
```

ローカル開発では次を使います。

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

## A-Frame 連携

A-Frame は任意です。CSS selector で node を attach すると、TurboWarp-AR はそれを target pose へ追従させ、`visible`、`position`、`rotation`、`data-ar-target`、`data-ar-confidence` を書きます。

`turbowarp-aframe` が読み込まれている場合、これらの書き込みは DOM ではなくその runtime capability（`setPosition`、`setRotation`、`setAttribute`、`setData`）を通ります。そうすることで、A-Frame 拡張が保持する scene state とページ上の属性が食い違いません。TurboWarp-AR は selector を A-Frame が所有しているかを capability に問い合わせ、所有していない selector や、そもそも A-Frame が無いページでは、素の DOM 属性で書きます。A-Frame が所有する node を、その拡張の背後で直接触ることはありません。

### レイヤ

`create AR scene` が受け取るのは `above-stage` と `below-stage` の2つだけで、これは `turbowarp-aframe` が 3D scene host に使うのと同じ語彙です。認識できない値は `above-stage` に丸めます。`above-stage` のとき、カメラ背景は 3D scene host の1つ下の重なり位置に置かれるため、3D scene は常にカメラ映像の上に描かれます。この順序は2つの拡張が固定しているもので、それを要求する layer 値は存在しません。

## Plan API

TurboWarp の setup script を生成する app は、`@kubohiroya/turbowarp-ar/plan` を import できます。Plan API は機能拡張を登録せず、AR scene control data を検証し、AR scene の作成と AR target への selector bind に必要な低レベル TurboWarp AR call を返します。

```ts
import {createTurboWarpARScenePlan} from '@kubohiroya/turbowarp-ar/plan';

const calls = createTurboWarpARScenePlan({
  cameraId: 'front',
  targets: [{targetId: 'marker-1', selector: '#card'}]
});
```

`layer` が受け付けるのは `above-stage`（既定）と `below-stage` だけで、ブロックと実行時が使う語彙と同一です。それ以外は `validateARSceneControl` が弾くため、拡張が黙って捨てる layer を生成器が出力することはありません。

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
