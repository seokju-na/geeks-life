// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json') as { name: string; productName: string; version: string };

export const env = {
  name: pkg.name,
  productName: pkg.productName,
  version: pkg.version,
  prod: process.env.NODE_ENV === 'production',
  platform: {
    darwin: process.platform === 'darwin',
    win32: process.platform === 'win32',
    linux: process.platform === 'linux',
  },
} as const;
