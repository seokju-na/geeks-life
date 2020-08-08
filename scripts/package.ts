#!/usr/bin/env ts-node-script

/* eslint-disable @typescript-eslint/no-var-requires */
import { build } from 'electron-builder';
import fs from 'fs-extra';
import path from 'path';
import { spawnAsync } from './util';

const { PUBLISH } = process.env;
const env = {
  publish: PUBLISH?.toLowerCase() === 'true',
} as const;

const ROOT_PATH = path.resolve(__dirname, '../');
const paths = {
  root: ROOT_PATH,
  src: path.join(ROOT_PATH, 'src/'),
  dist: path.join(ROOT_PATH, 'dist/'),
  out: path.join(ROOT_PATH, 'out/'),
} as const;

interface PackageInfo {
  name: string;
  productName: string;
  appId: string;
  version: string;
  description: string;
  repository: {
    url: string;
  };
  author: {
    name: string;
    email: string;
  };
  license: string;
}

const pkg = require('../src/package.json') as PackageInfo;
const deps: {
  electron: string;
} = require('../package.json').dependencies;

async function packageProduct() {
  await spawnAsync('yarn', ['clean'], {
    cwd: paths.root,
  });

  // Build
  await spawnAsync('yarn', ['build'], {
    cwd: paths.root,
  });

  // Copy 'package.json' to 'dist/' and install deps.
  await fs.copy(path.join(paths.src, 'package.json'), path.join(paths.dist, 'package.json'), {
    overwrite: true,
  });
  await spawnAsync('yarn', ['install'], {
    cwd: paths.dist,
  });
  await fs.remove(path.join(paths.dist, 'yarn.lock'));
  await spawnAsync('npm', ['prune', '--production'], { cwd: paths.dist });

  // Package product
  // TODO: icon
  // TODO: win32, linux
  await build({
    config: {
      appId: pkg.appId,
      productName: pkg.productName,
      buildVersion: pkg.version,
      asar: true,
      npmRebuild: false,
      electronVersion: deps.electron,
      directories: {
        app: paths.dist,
        output: paths.out,
      },
      mac: {
        category: 'public.app-category.developer-tools',
        darkModeSupport: true,
        extendInfo: {
          // Run application at background
          LSUIElement: 1,
        },
      },
      publish: {
        provider: 'github',
      },
    },
    mac: ['dmg'],
    publish: env.publish ? 'onTagOrDraft' : 'never',
  });
}

packageProduct().catch((error) => {
  console.error(error);
  process.exit(1);
});
