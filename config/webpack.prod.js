const nodeExternals = require('webpack-node-externals');
const commonConfig = require('./webpack.common');

const prodConfig = Object.assign(
  {
    mode: 'production',
    externals: [
      nodeExternals({
        modulesFromFile: {
          includeInBundle: ['dependencies']
        }
      })
    ]
  },
  commonConfig
)

module.exports = prodConfig;