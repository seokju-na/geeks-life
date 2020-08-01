export interface DailyLogCategory {
  id: string;
  emojiKey?: string;
  title: string;
}

export enum DailyScore {
  None,
  Low,
  Medium,
  High,
  Excellent,
}

export interface DailyLog {
  id: string;
  categoryId: string;
  content: string;
}

export interface DailyLife {
  id: string;
  date: string;
  score?: DailyScore;
  logs?: DailyLog[];
}

export const defaultDailyLogCategories: DailyLogCategory[] = [
  {
    id: 'love-category',
    emojiKey: 'heart', // ❤️
    title: `Today's love`,
  },
  {
    id: 'working-category',
    emojiKey: 'fire', // 🔥
    title: `Today's working`,
  },
  {
    id: 'coding-category',
    emojiKey: 'computer', // 💻
    title: `Today's coding`,
  },
  {
    id: 'beer-category',
    emojiKey: 'beer', // 🍺
    title: `Today's best beer`,
  },
];
