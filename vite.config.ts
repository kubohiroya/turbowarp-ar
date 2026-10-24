import {defineConfig} from 'vite';
import {extensionManifestPlugin} from '@kubohiroya/turbowarp-extension-manifest';
import {turboWarpExtension} from '@kubohiroya/vite-plugin-turbowarp-extension';
import definitions from './src/block-definitions.json' with { type: 'json' };
import {extensionConfig} from './src/config.js';

export default defineConfig({
  plugins: [
    turboWarpExtension({
      id: extensionConfig.id,
      name: extensionConfig.name,
      description: extensionConfig.description,
      author: extensionConfig.author,
      license: extensionConfig.license,
      fileName: `${extensionConfig.slug}.js`
    }),
    extensionManifestPlugin({
      id: extensionConfig.id,
      definitions
    }),
    {
      name: 'editor-runtime-boundary',
      generateBundle(_options, bundle) {
        for (const output of Object.values(bundle)) {
          if (output.type !== 'chunk') continue;
          // Only the canonical pure number parser is needed by fixed input metadata.
          const editorEngine = Object.keys(output.modules).find(id =>
            /\/node_modules\/(?:.*\/)?(?:ajv|ajv-formats|fast-uri|react|react-dom|@rjsf\/[^/]+)(?:\/|$)/u.test(id) ||
            /\/turbowarp-extension-data-editor\/dist\/(?:schema-engine|schema-compose|schema-view|source-editor|fixed-input-editor)\.js$/u.test(id));
          if (editorEngine) this.error(`AR runtime includes an editor engine: ${editorEngine}`);
          // Dependency paths vary between package stores and checkout locations.
          output.code = output.code.replace(/^[ \t]*\/\/#(?:end)?region\b[^\r\n]*(?:\r?\n|$)/gmu, '');
        }
      }
    }
  ]
});
