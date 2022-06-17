import { emit } from '@tauri-apps/api/event';

interface Size {
  width: number;
  height: number;
}

export function resizeWindow(size: Size) {
  return emit('geeks-life://resize', size);
}
