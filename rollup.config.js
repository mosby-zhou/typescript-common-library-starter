import resolve from '@rollup/plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy';

import pkg from './package.json';

export default [
  {
    input: `src/index.ts`,
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        exports: 'auto',
        sourcemap: false,
      },
    ],
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: ['ejs', 'lodash'],
    watch: {
      include: 'src/**',
    },
    plugins: [
      // Compile TypeScript files
      typescript({
        useTsconfigDeclarationDir: true,
        tsconfigOverride: { compilerOptions: { module: 'ESNext' } },
      }),
      // Allow node_modules resolution, so you can use 'external' to control
      // which external modules to include in the bundle
      // https://github.com/rollup/rollup-plugin-node-resolve#usage
      resolve({ preferBuiltins: true }),

      // Resolve source maps to the original source
      sourceMaps(),

      copy({
        targets: [{ src: 'templates', dest: 'dist' }],
      }),
    ],
  },
  {
    input: `src/bin/index.ts`,
    output: [
      {
        file: 'dist/bin/index.js',
        format: 'cjs',
        exports: 'auto',
        sourcemap: false,
      },
    ],
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: ['inquirer', 'shelljs', 'chalk', 'yargs', 'yargs/helpers', 'ejs', 'lodash', '../index'],
    watch: {
      include: 'src/**',
    },
    plugins: [
      // Compile TypeScript files
      typescript({
        useTsconfigDeclarationDir: true,
        tsconfigOverride: { compilerOptions: { module: 'ESNext' } },
      }),
      // Allow node_modules resolution, so you can use 'external' to control
      // which external modules to include in the bundle
      // https://github.com/rollup/rollup-plugin-node-resolve#usage
      resolve({ preferBuiltins: true }),

      // Resolve source maps to the original source
      sourceMaps(),

      copy({
        targets: [{ src: 'templates', dest: 'dist' }],
      }),
    ],
  },
];
