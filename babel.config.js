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
  ],
  plugins: [
    [require('@babel/plugin-proposal-class-properties'), { loose: true }],
    require('@babel/plugin-proposal-optional-chaining'),
    require('@babel/plugin-proposal-nullish-coalescing-operator'),
    require('@babel/plugin-proposal-numeric-separator'),
  ],
};
