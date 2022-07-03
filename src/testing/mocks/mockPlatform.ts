import { match } from 'ts-pattern';
import { Platform } from '../../hooks';
import { mockIPC } from './mockIPC';

export function mockPlatform(platform: Platform) {
  mockIPC('tauri', (args: any) => {
    if (args.__tauriModule === 'Os' && args.message.cmd === 'osType') {
      return match(platform)
        .with('macOS', () => 'Darwin')
        .with('linux', () => 'Linux')
        .with('windows', () => 'Windows_NT')
        .run();
    }
  });
}
