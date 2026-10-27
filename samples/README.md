# 最小デモ

`manual-ar-target.sb3` は `manual-ar-target/project.json` とSVGから決定的に生成します。

```bash
node scripts/build-samples.mjs
node scripts/build-samples.mjs --check
node --test scripts/verify-samples.mjs
node scripts/prepare-pages.mjs
```

公式Editorで同梱拡張のunsandboxed実行を許可し、緑の旗→立方体1個、Space→移動して非表示、C→立方体削除（Cubes=0）、緑の旗→初期化を確認します。WebGLとjsDelivr接続が必要です。停止ボタンやCのあともGPU canvas描画は残ります（シーン終了ブロックはありません）。次の緑旗で旧シーンを置換します。ブラウザのタブを閉じると描画資源が解放されます。本体の既定OFFフラグは変更しません。
ARは手動targetのみ、カメラ/マーカー検出は使いません。
依存A-Frame拡張の同梱元は `dependencies/revision.txt`。upstream LICENSE/THIRD_PARTY_NOTICESも保持し、manifestのSHA256とIDをbuild時検査します。更新時は実物bundleとSHA256を同期し公式Editorで再確認してください。
