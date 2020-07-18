import fs from 'fs';
import fse from 'fs-extra';
import { add, commit, init } from 'isomorphic-git';
import { EOL } from 'os';

export interface GitAddFileOptions {
  filepath: string;
}

export interface GitCommitOptions {
  message: {
    head: string;
    body?: string;
  };
  author?: {
    name?: string;
    email?: string;
  };
}

export class Git {
  private directory: string;

  constructor(directory: string) {
    this.directory = directory;
  }

  setDirectory(directory: string) {
    this.directory = directory;

    return this;
  }

  async init() {
    if (!(await fse.pathExists(this.directory))) {
      await fse.ensureDir(this.directory);
    }

    await init({
      fs,
      dir: this.directory,
    });
  }

  async addFile({ filepath }: GitAddFileOptions) {
    await add({
      fs,
      dir: this.directory,
      filepath,
    });
  }

  async commit(options: GitCommitOptions) {
    let message = `${options.message.head}`;

    if (options.message.body != null) {
      message += `${EOL}${EOL}${options.message.body}`;
    }

    return await commit({
      fs,
      dir: this.directory,
      author: options.author,
      message,
    });
  }
}
