module.exports = {
  presets: [
    require('@babel/preset-typescript'),
    [
      require('@babel/preset-env'),
      {
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
    require('@babel/preset-react'),
    require('@emotion/babel-preset-css-prop'),
  ],
  plugins: [
    [require('@babel/plugin-proposal-class-properties'), { loose: true }],
    require('@babel/plugin-proposal-optional-chaining'),
    require('@babel/plugin-proposal-nullish-coalescing-operator'),
    require('@babel/plugin-proposal-numeric-separator'),
    require('babel-plugin-emotion'),
  ],
};
