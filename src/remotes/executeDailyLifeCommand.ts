import { invoke } from '@tauri-apps/api/tauri';
import { DailyLifeCommand } from '../models';

export async function executeDailyLifeCommand(command: DailyLifeCommand) {
  await invoke('execute_daily_life_command', {
    command,
  });
}
