import fs from 'fs';
import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import replace from '@rollup/plugin-replace';
import eslint from '@rollup/plugin-eslint';
import _ from 'lodash';

import pkg from './package.json';

const isDev = process.env.npm_lifecycle_event === 'start';

if (isDev) {
  fs.rmdirSync(path.resolve('./node_modules/.cache'), { recursive: true });
}

const libVersion = pkg.version;

console.log(`Lib version: ${libVersion}, Build mode: ${isDev ? 'development' : 'production'}`);

const libConfigBase = {
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  watch: {
    include: ['src/**'],
  },
  plugins: [
    eslint({
      throwOnError: true,
      throwOnWarning: !isDev,
    }),
    replace({
      values: {
        'process.env.VERSION': JSON.stringify(libVersion),
      },
      preventAssignment: true,
    }),
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true, tsconfigOverride: { compilerOptions: { target: 'ES5' } } }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // babel({
    //   babelrc: false,
    //   extensions: ['.js', '.ts'],
    //   babelHelpers: 'runtime',
    //   presets: ['@babel/preset-env'],
    //   plugins: ['@babel/plugin-transform-runtime'],
    // }),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve({ browser: true, preferBuiltins: true, mainFields: ['browser'] }),

    // Resolve source maps to the original source
    sourceMaps(),
  ],
};

const libConfig = [
  {
    ...libConfigBase,
    input: `src/index.umd.ts`,
    output: {
      file: pkg.main,
      name: _.upperFirst(_.camelCase(pkg.name)),
      format: 'umd',
      sourcemap: true,
      sourcemapExcludeSources: true,
    },
    plugins: [...libConfigBase.plugins, uglify()],
  },
  {
    ...libConfigBase,
    input: `src/index.ts`,
    output: {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
      sourcemapExcludeSources: true,
    },
    plugins: [...libConfigBase.plugins],
  },
];

const config = async () => libConfig;

export default config;
