import resolve from '@rollup/plugin-node-resolve';
import {babel} from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

const extensions = ['.ts'];

export default {
    input: 'src/index.ts',
    output: {
        name: 'msgio',
        file: 'dist/msgio.min.js',
        format: 'umd',
        sourcemap: true,
    },
    plugins: [
        resolve({
            extensions,
            browser: true,
        }),
        babel({
            extensions,
            babelHelpers: 'bundled',
        }),
        terser(),
    ],
};
