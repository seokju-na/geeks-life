import fs from 'fs';
import git from 'isomorphic-git';
import path from 'path';

export class GitService {
  async initializeRepository(dir: string) {
    await git.init({
      fs,
      dir,
    });
  }

  async add(dir: string, filepath: string) {
    if (path.isAbsolute(filepath)) {
      filepath = path.relative(dir, filepath);
    }

    await git.add({
      fs,
      dir,
      filepath,
    });
  }

  async commit(dir: string, message: string) {
    return await git.commit({
      fs,
      dir,
      message,
    });
  }

  async getStatus(dir: string, filepath: string) {
    if (path.isAbsolute(filepath)) {
      filepath = path.relative(dir, filepath);
    }

    return await git.status({
      fs,
      dir,
      filepath,
    });
  }

  async setUserConfig(dir: string, name: string, email: string) {
    await git.setConfig({
      fs,
      dir,
      path: 'user.name',
      value: name,
    });

    await git.setConfig({
      fs,
      dir,
      path: 'user.email',
      value: email,
    });
  }
}
