import { context } from 'esbuild';
import { copyFile } from 'fs/promises';

const WATCH = process.argv.includes('--watch');

const createMainContext = async () => await context({
  entryPoints: [
    "src/main/main.ts",
    "src/main/preload.ts",
  ],
  outdir: "./build",
  outbase: "./src/main",
  format: 'iife',
  platform: "node",
  logLevel: 'info'
})

/** @type import("esbuild").Plugin */
const copyHtmlPlugin = {
  name: "HTMLPlugin",
  setup(pluginBuild) {
    pluginBuild.onEnd(async () => {
      try {
        copyFile('src/render/index.html', `${pluginBuild.initialOptions.outdir}/index.html`);
      } catch (e) { console.log(e); };
    });
  }
}

const createRenderContext = async () => await context({
  entryPoints: [
    "src/render/**/*.tsx"
  ],
  plugins: [copyHtmlPlugin],
  outbase: "./src/render",
  outdir: "./build",
  bundle: true,
  format: 'esm',
  splitting: true,
  platform: 'browser',
  alias: {
    "react": "preact/compat",
    "react-dom": "preact/compat",
  },
  minify: !WATCH,
  logLevel: 'info'
});

let renderCtx = await createRenderContext();
let mainCtx = await createMainContext();

if (WATCH) {
  
  renderCtx.watch();
  mainCtx.watch();

} else {

  await renderCtx.rebuild();
  renderCtx.dispose();
  
  await mainCtx.rebuild();
  mainCtx.dispose();

}

