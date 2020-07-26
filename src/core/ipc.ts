import { DailyLife, Emoji } from './domain';

export const ipcChannels = {
  closeCurrentWindow: 'close-current-window',
  windowFocused: 'window-focused',
  emojiRequest: 'emoji-request',
  emojiResponse: 'emoji-response',
  loadDailyLifeRequest: 'load-daily-life-request',
  loadDailyLifeResponse: 'load-daily-life-response',
  loadDailyLifeModifiedFlagRequest: 'load-daily-life-modified-flag-request',
  loadDailyLifeModifiedFlagResponse: 'load-daily-life-modified-flag-response',
  saveDailyLifeRequest: 'save-daily-life-request',
  saveDailyLifeResponse: 'save-daily-life-response',
  commitDailyLifeRequest: 'commit-daily-life-request',
  commitDailyLifeResponse: 'commit-daily-life-response',
  gitUserConfigSetRequest: 'git-user-config-set-request',
  gitUserConfigSetResponse: 'git-user-config-set-response',
} as const;

type DailyLifeRequestType = 'week' | 'month';
type DailyLivesResponseByDay = DailyLife | null;

export interface LoadDailyLifeRequest {
  type: DailyLifeRequestType;
  date: string;
}

interface LoadDailyLifeResponseByWeek {
  type: Extract<DailyLifeRequestType, 'week'>;
  dailyLives: DailyLivesResponseByDay[];
}

interface LoadDailyLogResponseByMonth {
  type: Extract<DailyLifeRequestType, 'month'>;
  dailyLives: DailyLivesResponseByDay[][];
}

export type LoadDailyLifeResponse = LoadDailyLifeResponseByWeek | LoadDailyLogResponseByMonth;

export interface LoadDailyLifeModifiedFlagRequest {
  date: string;
}

export interface LoadDailyLifeModifiedFlagResponse {
  modified: boolean;
}

export interface SaveDailyLifeRequest {
  date: string;
  dailyLife: DailyLife;
}

export interface CommitDailyLifeRequest {
  date: string;
}

export enum CommitDailyLifeErrorCode {
  MissingNameError = 'MissingNameError',
}

export interface CommitDailyLifeResponse {
  date: string;
  sha?: string;
  errorCode?: CommitDailyLifeErrorCode;
}

export interface GitUserConfigSetRequest {
  name: string;
  email: string;
}

export interface GitUserConfigSetResponse {
  errorCode?: string; // TODO
}

export interface EmojiResponse {
  emojis: Emoji[];
}

export function serializePayload<T>(payload: T) {
  return JSON.stringify(payload);
}

export function parsePayload<T>(payloadAsStr: string | undefined | null) {
  if (payloadAsStr == null) {
    return null;
  }

  return JSON.parse(payloadAsStr) as T;
}
