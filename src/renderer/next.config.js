const { NODE_ENV } = process.env;

module.exports = {
  env: {
    ENV: NODE_ENV === 'production' ? 'production' : 'development',
  },
  webpack: (config) => {
    config.plugins = config.plugins.filter((plugin) => {
      return plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin';
    });

    delete config.resolve.alias['object-assign$'];

    config.resolve.fallback = {
      ...config.resolve.fallback,
      events: false,
      fs: false,
      tls: false,
      net: false,
      path: false,
      zlib: false,
      http: false,
      https: false,
      stream: false,
      crypto: false,
      'crypto-browserify': false,
    };

    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
