import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';





let config = {
    input: 'src/index.js',
        output: {
            format: 'umd',
            name: 'Ru',
    },
    plugins: [
        nodeResolve({
            jsnext: true,
            main: true
        }),

        commonjs({
            include: 'node_modules/**'
        }),
        babel({
            exclude: 'node_modules/**' // only transpile our source code
        }),
    ]
};


if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  );
}


module.exports = config;
