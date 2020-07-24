interface EmojiBase {
  key: string;
}

export interface NativeEmoji extends EmojiBase {
  type: 'native';
  char: string;
}

export interface CustomEmoji extends EmojiBase {
  type: 'custom';
  fileUrl: string;
}

export type Emoji = NativeEmoji | CustomEmoji;
