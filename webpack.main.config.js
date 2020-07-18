const { DefinePlugin } = require('webpack');
const TsConfigPathPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');

const PROD = process.env.NODE_ENV === 'production';

module.exports = {
  name: 'main-process',
  mode: PROD ? 'production' : 'development',
  devtool: 'source-map',
  entry: {
    main: path.resolve(__dirname, 'src/main/index.ts'),
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    plugins: [
      new TsConfigPathPlugin({
        configFile: path.resolve(__dirname, 'src/main/tsconfig.json'),
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        include: [path.join(__dirname, 'src/main/'), path.join(__dirname, 'src/core/')],
        exclude: [/node_modules/, /dist/, /vendor/, path.join(__dirname, 'src/renderer/')],
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],
  node: {
    __dirname: false,
    __filename: false,
  },
  target: 'electron-main',
};
