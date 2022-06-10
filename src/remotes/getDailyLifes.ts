import { format } from 'date-fns';
import { invoke } from '@tauri-apps/api/tauri';
import { DailyLife } from '../models';

export interface GetDailyLifesParams {
  start?: Date;
  end?: Date;
}

const pattern = `yyyy-MM-dd'T'00:00:00'Z'`;

export function getDailyLifes({ start, end }: GetDailyLifesParams = {}) {
  const params = {
    start: start != null ? format(start, pattern) : undefined,
    end: end != null ? format(end, pattern) : undefined,
  };

  return invoke<DailyLife[]>('get_daily_lifes', { params });
}
