import { DailyLife, DailyLogCategory, Emoji } from './domain';

// LONG LIVE TODO: Cleanup ipc channels
export const ipcChannels = {
  closeCurrentWindow: 'close-current-window',
  windowFocused: 'window-focused',
  windowSizeChanged: 'window-size-changed',
  restoreWindowSize: 'restore-window-size',
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
  loadDailyLogCategoriesRequest: 'load-daily-log-categories-request',
  loadDailyLogCategoriesResponse: 'load-daily-log-categories-response',
  menu: 'menu',
  menuOnMonthlyView: 'menu-on-monthly-view',
  menuOnWeeklyView: 'menu-on-weekly-view',
  menuOnFocusLog: 'menu-on-focus-log',
  menuOnBlurLog: 'menu-on-blur-log',
  menuOnCommitChangesFlagChange: 'menu-on-commit-changes-flag-change',
} as const;

export interface WindowSizeChangedPayload {
  height: number;
}

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

export interface EmojisResponse {
  emojis: Emoji[];
}

export interface LoadDailyLogCategoriesResponse {
  categories: DailyLogCategory[];
}

export enum MenuMessage {
  ShowAbout = 'showAbout',
  NewDailyLifeLog = 'newDailyLifeLog',
  EditDailyLifeLog = 'editDailyLifeLog',
  DeleteDailyLifeLog = 'deleteDailyLifeLog',
  CommitDailyLifeChanges = 'commitDailyLifeChanges',
  WeeklyView = 'weeklyView',
  MonthlyView = 'monthlyView',
}

export interface MenuMessagePayload {
  message: MenuMessage;
}

export interface MenuOnCommitChangesFlagChangePayload {
  enabled: boolean;
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
