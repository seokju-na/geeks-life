const esbuild = require('esbuild-wasm');
const { externals } = require('../package.json');

esbuild.buildSync({
  bundle: true,
  entryPoints: ['src/main/index.ts'],
  tsconfig: 'src/main/tsconfig.json',
  outdir: 'dist/',
  external: [...externals, 'electron'],
  target: 'node12',
  platform: 'node',
  minify: process.env.NODE_ENV === 'production',
});
