const path = require('path');
const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsConfigPathPlugin = require('tsconfig-paths-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const PROD = process.env.NODE_ENV === 'production';

module.exports = {
  mode: PROD ? 'production' : 'development',
  entry: {
    main: path.join(__dirname, 'src/renderer/index.tsx'),
    preload: path.join(__dirname, 'src/renderer/preload.ts'),
  },
  output: {
    path: path.join(__dirname, 'dist/web/'),
    filename: '[name].js',
    chunkFilename: '[name].[contenthash].js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
    plugins: [
      new TsConfigPathPlugin({
        configFile: path.join(__dirname, 'src/renderer/tsconfig.json'),
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        loader: 'babel-loader',
        include: [path.join(__dirname, 'src/renderer/'), path.join(__dirname, 'src/core/')],
        exclude: [/node_modules/, /dist/, /vendor/, path.join(__dirname, 'src/main/')],
      },
      {
        test: /\.scss$/,
        sideEffects: true,
        include: [path.join(__dirname, 'src/renderer')],
        loader: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  devtool: PROD ? undefined : 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/renderer/index.html',
      chunks: ['main'],
    }),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new CopyPlugin({
      patterns: [
        { from: path.join(__dirname, 'src/assets/'), to: path.join(__dirname, 'dist/assets/') },
      ],
    }),
  ],
  target: 'electron-renderer',
};
