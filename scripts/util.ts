import { spawn } from 'child_process';

export interface SpawnOptions {
  cwd?: string;
  /** @default false */
  silent?: boolean;
  env?: {
    [key: string]: string;
  };
  /** @default false */
  failIfStderr?: boolean;
  stdin?: Buffer;
  /** @default process.write */
  stdout?: NodeJS.WriteStream;
  /** @default process.stderr */
  stderr?: NodeJS.WriteStream;
  /** @default 'utf8' */
  stdinEncoding?: BufferEncoding;
}

export function spawnAsync(command: string, args: ReadonlyArray<string>, options?: SpawnOptions) {
  const stdout = options?.stdout ?? process.stdout;
  const stderr = options?.stderr ?? process.stderr;

  return new Promise<void>((resolve, reject) => {
    let hasStderr = false;
    const task = spawn(command, args, {
      cwd: options?.cwd,
      env: options?.env,
    });

    if (options?.stdin != null) {
      task.stdin.write(options.stdin, options.stdinEncoding ?? 'utf8');
      task.stdin.end();
    }

    task.stdout.on('data', (data) => {
      if (!options?.silent) {
        stdout.write(data);
      }
    });

    task.stderr.on('data', (data) => {
      if (!options?.silent) {
        stderr.write(data);
      }
      hasStderr = true;
    });

    task.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Error code: ${code}`));
      } else if (hasStderr && options?.failIfStderr) {
        reject(new Error('Stderr exists.'));
      } else {
        resolve();
      }
    });
  });
}
