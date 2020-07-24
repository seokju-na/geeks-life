import { Emoji } from './domain';

export const ipcChannels = {
  closeCurrentWindow: 'close-current-window',
  windowFocused: 'window-focused',
  commitRequest: 'commit-request',
  commitResponse: 'commit-response',
  emojiRequest: 'emoji-request',
  emojiResponse: 'emoji-response',
} as const;

export interface CommitRequestPayload {
  message: string;
  messageDetail?: string;
}

export interface CommitResponsePayload {
  sha: string;
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
