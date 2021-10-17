/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Arch,
  build as buildElectron,
  CliOptions,
  Configuration,
  Platform,
} from 'electron-builder';
import execa from 'execa';
import { writeFile } from 'fs-extra';
import path from 'path';
import semver from 'semver';

const ROOT_DIR = path.resolve(__dirname, '../');
const MAIN_BRANCH = 'main';

const log = (...args: Parameters<typeof console.log>) => console.log(...args);

const pkg = require('../package.json') as {
  name: string;
  version: string;
  description: string;
  repository: {
    type: string;
    url: string;
  };
  externals: string[];
  dependencies: Record<string, string>;
};

const getPackageVersion = (pkg: string): string => {
  return require(`${pkg}/package.json`).version;
};

async function dist() {
  log('📦 npm run build');
  await execa('pnpm', ['run', 'build'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
    },
  });

  log('📦 src/renderer/out -> dist/renderer');
  await execa('cp', ['-r', './src/renderer/out', './dist/renderer']);

  log('📦 create dist/package.json');
  const pkgForApp = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    main: './index.js',
    scripts: {
      postinstall: 'electron-builder install-app-deps',
    },
    repository: pkg.repository,
    dependencies: pkg.externals.reduce((dep, pkgName) => {
      dep[pkgName] = getPackageVersion(pkgName);
      return dep;
    }, {} as Record<string, string>),
    devDependencies: {
      electron: getPackageVersion('electron'),
    },
  };
  await writeFile('dist/package.json', JSON.stringify(pkgForApp, null, 2), 'utf8');

  log('📦 pnpm install from dist/');
  await execa('pnpm', ['install'], {
    cwd: 'dist/',
  });
}

async function getCurrentGitBranch() {
  const { GITHUB_REF } = process.env;

  if (GITHUB_REF !== undefined) {
    return GITHUB_REF.replace(/^refs\/heads\//, '');
  }

  const { stdout: gitBranch } = await execa('git', ['branch', '--show-current'], {
    shell: true,
    cwd: ROOT_DIR,
    stripFinalNewline: true,
  });

  return gitBranch;
}

function parsePublishInfoFromGitBranch(gitBranch: string) {
  if (gitBranch === MAIN_BRANCH) {
    return {
      version: pkg.version,
      channel: 'unknown',
    };
  }

  const result = gitBranch.match(/release\/(.+)/) ?? [];
  const version = semver.valid(result?.[1]);

  if (version == null) {
    throw new Error(`Invalid branch name. "${gitBranch}"`);
  }

  if (pkg.version !== version) {
    throw new Error(
      `Branch version(${version}) doesn't match with package version(${pkg.version}).`,
    );
  }

  const prerelease = semver.prerelease(version);
  const channel = prerelease != null ? (prerelease[0] as string) : 'latest';

  return {
    version,
    channel,
  } as const;
}

type ArchString = 'x64' | 'arm64';
const archMap: Record<ArchString, Arch> = {
  x64: Arch.x64,
  arm64: Arch.arm64,
};

function getPackArch(): 'arm64' | 'x64' {
  const { npm_config_arch } = process.env;

  if (npm_config_arch === 'arm64' || npm_config_arch === 'x64') {
    return npm_config_arch;
  }

  if (process.arch === 'arm64') {
    return 'arm64';
  }

  return 'x64';
}

function getPackTargets() {
  const arch = getPackArch();

  if (process.platform === 'darwin') {
    return Platform.MAC.createTarget('dmg', archMap[arch]);
  }

  if (process.platform === 'win32') {
    return Platform.WINDOWS.createTarget('nsis', archMap[arch]);
  }

  throw new Error(`Unsupported platform : ${process.platform}`);
}

async function pack({
  publish,
  version,
  channel = 'latest',
}: {
  publish: boolean;
  version: string;
  channel?: string;
}) {
  const options: CliOptions = {
    config: {
      appId: 'me.seokju.geeksLife',
      productName: 'Geeks Life',
      buildVersion: version,
      npmRebuild: false,
      directories: {
        app: 'dist/',
        output: 'build/',
      },
    },
    publish: null,
  };

  if (publish) {
    (options.config as Configuration).publish = {
      provider: 's3',
      bucket: 'geeks-life.releases',
      region: 'ap-northeast-2',
      acl: 'public-read',
      channel,
    };
  }

  log('📦 electron build');
  const targets = getPackTargets();

  await buildElectron({
    ...options,
    targets,
  });
}

async function release() {
  const gitBranch = await getCurrentGitBranch();
  const { version, channel } = parsePublishInfoFromGitBranch(gitBranch);

  await dist();
  await pack({
    publish: gitBranch !== MAIN_BRANCH,
    version,
    channel,
  });
}

release().catch((error) => {
  console.error(error);
  process.exit(1);
});
