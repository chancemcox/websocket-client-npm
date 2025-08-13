import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';

export default [
  // CommonJS build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/websocket-client.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    external: ['reconnecting-websocket'],
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
      }),
      terser()
    ]
  },
  
  // ES Module build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/websocket-client.esm.js',
      format: 'esm',
      sourcemap: true,
      exports: 'named'
    },
    external: ['reconnecting-websocket'],
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
      }),
      terser()
    ]
  },
  
  // UMD build for browser
  {
    input: 'src/index.js',
    output: {
      file: 'dist/websocket-client.umd.js',
      format: 'umd',
      name: 'WebSocketClient',
      sourcemap: true,
      globals: {
        'reconnecting-websocket': 'ReconnectingWebSocket'
      }
    },
    external: ['reconnecting-websocket'],
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
      }),
      terser()
    ]
  }
];
