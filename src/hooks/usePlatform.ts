import { type } from '@tauri-apps/api/os';
import { useQuery } from 'react-query';
import { match } from 'ts-pattern';

const queryKey = ['platform'];

export type Platform = 'macOS' | 'linux' | 'windows';

export function usePlatform() {
  const { data } = useQuery(queryKey, type);

  return match(data)
    .with('Darwin', () => 'macOS')
    .with('Linux', () => 'linux')
    .with('Windows_NT', () => 'windows')
    .run() as Platform;
}

usePlatform.queryKey = queryKey;
