import babel from 'rollup-plugin-babel';
import {readdirSync} from 'fs';

export default readdirSync('./packages').map(pkg => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const {name, version, description, author, license} = require(`./packages/${pkg}/package.json`);
  return {
    input: `./packages/${pkg}/lib/index.js`,
    output: {
      file: `./packages/${pkg}/dist/index.js`,
      format: 'cjs',
      sourcemap: true,
      banner: `/*!
${name} v${version}

${description}

Copyright (c) 2019-present, ${author}

This source code is licensed under the ${license} license found in the root of this package.
 */`.replace(/\n(?!\s\*\/)/g, '\n * '),
    },
    plugins: [
      babel({
        exclude: 'node_modules/**',
        presets: [['@babel/preset-env', {
          modules: false,
          targets: ['node 4'],
          shippedProposals: true,
        }]],
        plugins: [
          '@babel/plugin-proposal-object-rest-spread',
        ],
      }),
    ],
  };
});
