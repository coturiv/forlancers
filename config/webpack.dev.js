const path = require('path');
const nodeExternals = require('webpack-node-externals');
const ElectronReloadPlugin = require('webpack-electron-reload')({
  path: path.join(__dirname, '../build/main.js'),
});
const commonConfig = require('./webpack.common');

const devConfig = Object.assign(
  {
    mode: 'development',
    watch: true,
    devtool: 'inline-source-map',
    externals: [
      nodeExternals()
    ],
    plugins: [
      ElectronReloadPlugin()
    ]
  },
  commonConfig
)

module.exports = devConfig;