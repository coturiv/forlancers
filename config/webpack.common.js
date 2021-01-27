const path = require('path');

const commonConfig = {
  target: 'electron-main',
  node: {
    __dirname: false
  },
  entry: { 
    main: path.resolve(__dirname, '..', 'src', 'main-process', 'main.ts')
  },
  output: {
    path: path.resolve(__dirname, '..', 'build'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.json']
  }
}

module.exports = commonConfig;
