import React, { HTMLProps, memo } from 'react';
import { DailyLog, DailyLogCategory, Emoji } from '../../core/domain';
import { selectBackground, selectForeground, styled } from '../colors/theming';

type DailyLogListItemProps = HTMLProps<HTMLLIElement> & {
  log: DailyLog;
  emoji?: Emoji;
  children?: never;
};

function DailyLogListItem({ log, emoji, ...props }: DailyLogListItemProps) {
  return (
    <ListItem {...props}>
      {emoji != null ? (
        // TODO: Custom emoji
        <ListItemEmoji>{emoji.type === 'native' ? emoji.char : ''}</ListItemEmoji>
      ) : null}
      {log.content}
    </ListItem>
  );
}

const ListItem = styled.li`
  list-style: none;
  padding: 8px 12px;
  display: flex;
  align-items: flex-start;

  & + & {
    border-top: 1px solid ${selectForeground('divider')};
  }
`;

const ListItemEmoji = styled.div`
  padding: 0 4px;
  font-size: 1rem;
`;

type DailyLifeLogListProps = HTMLProps<HTMLUListElement> & {
  logs: DailyLog[];
  categories: DailyLogCategory[];
  emojis: Emoji[];
  children?: never;
};

function DailyLogList({ logs, categories, emojis, ...props }: DailyLifeLogListProps) {
  return (
    <List {...props}>
      {logs.map((log) => {
        const category = categories.find((category) => category.id === log.categoryId);
        const emoji = emojis.find((emoji) => emoji.key === category?.emojiKey);

        return <DailyLogListItem key={log.id} log={log} emoji={emoji} />;
      })}
    </List>
  );
}

export default memo(DailyLogList);

const List = styled.ul`
  display: block;
  overflow: hidden;
  border-radius: 0.25rem;
  background-color: ${selectBackground('backgroundHighlighted')};
  border: 1px solid ${selectForeground('divider')};
`;
