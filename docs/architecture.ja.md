# アーキテクチャ

[English](architecture.md)

## 責務境界

この拡張が持つのは次の3つだけで、それ以外は意図的に持ちません。

1. **カメラ背景。** `turbowarp-camera-source` から名前付きカメラを lease し、その映像をページ全体の背景レイヤとして設置します。自分でカメラを開くことはなく、フレームを保持することもありません。
2. **名前付き target 状態。** target id ごとの visible、confidence、position、rotation と、visible の変化から導かれる found／lost のエッジです。この状態を書くのはブロックだけで、背後に検出器はまだありません。ここでの「AR target」は、将来のマーカー検出や WebXR provider が埋めるスロットの名前であって、いま追跡されている何かではありません。
3. **attachment。** target に attach された selector を、その target の pose へ追従させます。

3D scene は持ちません。それは `turbowarp-aframe` の責務であり、attachment の書き込みは、A-Frame が一致する node を所有している限りその拡張の runtime capability を通ります。そうすることで、A-Frame 側の scene state とページ上の属性が乖離しません。capability の method は version で門番するのではなく存在検査で使います。これはその capability が成長すると文書化されている方式に合わせたものです。A-Frame が所有しない selector、dispose 済みの capability、A-Frame の無いページは、いずれも素の DOM 属性へフォールバックします。

ブロックと `turbowarpARCapability` は同じハンドラを経由するため、記述から AR scene を組み立てる機能拡張はブロックと同じ挙動を得ます。この port が覆うのは scene の構築とライフサイクルだけで、pose はトラッキング provider ができるまでブロックの側に残します。

scene の計画も持ちません。`@kubohiroya/turbowarp-ar/plan` は build 時の module であり `dist/ar.js` には含まれません。TurboWarp 作品を生成する側のために、AR scene control データを検証し、AR scene を立ち上げる低レベル call を返します。

### layer 語彙

語彙は `above-stage` と `below-stage` の2つだけで、`turbowarp-aframe` の 3D scene host と共有しています。`plan.ts` が一度だけ定義し、plan API と実行時の両方がその定義を使うため、3者が食い違うことはありません。plan API は語彙外の値を拒否します。作品から任意の文字列を受け取るブロックの側は、script を止めずに `above-stage` へフォールバックします。

相対的な前後関係は構造であって、名前で指定できるものではありません。`above-stage` のとき、カメラ背景は 3D scene host の1つ下の重なり位置に置かれ、3D scene がカメラ映像の上に描かれます。どちらかの拡張が host の重なりを変えるときは、もう一方も合わせる必要があります。

## ビルド出力

このプロジェクトは実行時の動作と互換性メタデータを分離し、リポジトリに保存された同じソース定義から両方を生成します。

```text
src/index.ts + src/extension.ts
  -> vite-plugin-turbowarp-extension
  -> dist/<extension>.js

src/config.ts + src/block-definitions.json
  -> extension-api-manifest Viteプラグイン
  -> dist/extension-manifest.json
```

manifestプラグインはViteのビルド後フェーズで実行されます。これにより、JavaScriptプラグインの単一出力検証を維持しながら、TurboWarpバンドルの完成後にだけmanifestを追加します。

## 拡張機能API manifest v1

`schemas/extension-manifest.schema.json`が規範となるJSON Schemaです。`formatVersion`は`1`で、互換性のないmanifest形式を導入するときに変更する必要があります。

v1契約は次の情報を含みます。

- TurboWarp拡張機能のID
- 各ブロックのopcodeとブロック種類
- 各引数のID、引数種類、任意のメニュー参照
- 各メニューのIDとReporterブロックを受け付けるかどうか

ブロック、引数、メニューは、シリアライズ前に識別子で並べ替えられます。テキスト、説明、既定値、静的メニュー項目は、保存済みプロジェクトのAPI参照を識別しないため、意図的に除外しています。そのため互換性チェッカーは、API変更とドキュメントまたはローカライズの変更を区別できます。

## 差分の検出

`dist/`はリリース成果物としてコミットされます。`npm run check:dist`は両方のファイルを再ビルドし、`dist/`配下に変更、削除、未追跡ファイルがある場合に失敗します。これにより、ローカル検証とCIの両方でmanifestとバンドルの差分を検出できます。
