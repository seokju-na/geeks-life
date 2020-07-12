const path = require('path');
const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsConfigPathPlugin = require('tsconfig-paths-webpack-plugin');

const PROD = process.env.NODE_ENV === 'production';

module.exports = {
  mode: PROD ? 'production' : 'development',
  entry: {
    main: path.join(__dirname, 'src/renderer/index.tsx'),
  },
  output: {
    path: path.resolve(__dirname, 'dist/web/'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
    plugins: [
      new TsConfigPathPlugin({
        configFile: path.resolve(__dirname, 'src/renderer/tsconfig.json'),
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, 'src/renderer/')],
        exclude: [/node_modules/, /dist/, /vendor/, path.join(__dirname, 'src/main/')],
      },
      {
        test: /\.scss$/,
        sideEffects: true,
        include: [path.resolve(__dirname, 'src/renderer')],
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
  ],
};
