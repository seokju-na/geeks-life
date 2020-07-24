import { Emoji } from './emoji';

export interface DailyLogCategory {
  id: string;
  emoji?: Emoji;
  title: string;
}

export interface DailyLog {
  id: string;
  category: DailyLogCategory;
  content: string;
}

export const defaultDailyLogCategories: DailyLogCategory[] = [
  {
    id: 'love-category',
    emoji: {
      key: 'heart',
      type: 'native',
      char: '❤️',
    },
    title: `Today's love`,
  },
  {
    id: 'working-category',
    emoji: {
      key: 'fire',
      type: 'native',
      char: '🔥',
    },
    title: `Today's working`,
  },
  {
    id: 'coding-category',
    emoji: {
      key: 'computer',
      type: 'native',
      char: '💻',
    },
    title: `Today's coding`,
  },
  {
    id: 'beer-category',
    emoji: {
      key: 'beer',
      type: 'native',
      char: '🍺',
    },
    title: `Today's best beer`,
  },
];
