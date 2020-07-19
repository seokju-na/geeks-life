interface NativeEmoji {
  type: 'native';
  char: string;
}

interface CustomEmoji {
  type: 'custom';
  fileUrl: string;
}

export type Emoji = NativeEmoji | CustomEmoji;
