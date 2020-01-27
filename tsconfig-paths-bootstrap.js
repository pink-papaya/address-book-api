/* eslint-disable @typescript-eslint/no-var-requires */
const tsConfigPaths = require('tsconfig-paths');
const tsConfig = require('./tsconfig.release.json');

tsConfigPaths.register({
  baseUrl: './dist',
  paths: tsConfig.compilerOptions.paths,
});
