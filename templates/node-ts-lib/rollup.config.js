import resolve from '@rollup/plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import strip from '@rollup/plugin-strip';

import pkg from './package.json';

export default {
  input: `src/index.ts`,
  output: [{ file: pkg.main, format: 'cjs', exports: 'auto', sourcemap: true }],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: ['events'],
  watch: {
    include: 'src/**',
  },
  plugins: [
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    strip({
      include: ['**/*.ts'],
      // // set this to `false` if you don't want to
      // // remove debugger statements
      debugger: true,

      // // defaults to `[ 'console.*', 'assert.*' ]`
      functions: ['console.log', 'assert.*', 'debug', 'alert'],

      // // set this to `false` if you're not using sourcemaps –
      // // defaults to `true`
      sourceMap: true,
    }),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve({ preferBuiltins: true }),

    // Resolve source maps to the original source
    sourceMaps(),
  ],
};
