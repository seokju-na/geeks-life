import { invoke } from '@tauri-apps/api/tauri';
import { DailyLife } from '../models';

export function getDailyLife(id: string) {
  return invoke<DailyLife | null>('get_daily_life', { id });
}
