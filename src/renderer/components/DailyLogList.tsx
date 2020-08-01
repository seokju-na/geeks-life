import React, { HTMLProps, memo } from 'react';
import { DailyLog, DailyLogCategory, Emoji as EmojiModel } from '../../core/domain';
import { selectBackground, selectForeground, styled } from '../colors/theming';
import { Emoji } from './Emoji';

type DailyLogListItemProps = HTMLProps<HTMLLIElement> & {
  log: DailyLog;
  category: DailyLogCategory;
  emoji?: EmojiModel;
  children?: never;
};

function DailyLogListItem({ log, category, emoji, ...props }: DailyLogListItemProps) {
  return (
    <ListItem {...props}>
      {emoji != null ? (
        <ListItemLeft>
          <Emoji emoji={emoji} title={category.title} />
        </ListItemLeft>
      ) : null}
      <ListItemContent showLeftBorder={emoji != null}>{log.content}</ListItemContent>
    </ListItem>
  );
}

const ListItem = styled.li`
  list-style: none;
  display: flex;
  align-items: center;
  padding: 8px 0;

  & + & {
    border-top: 1px solid ${selectForeground('divider')};
  }
`;

const ListItemLeft = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  cursor: default;
`;

const ListItemContent = styled.p<{ showLeftBorder: boolean }>`
  margin: 0;
  padding: 0 12px;
  flex: 1 1 auto;
  font-size: 0.875rem;
  ${({ showLeftBorder, theme }) =>
    showLeftBorder ? `border-left: 1px solid ${theme.foreground.divider}` : ''};
`;

type DailyLifeLogListProps = HTMLProps<HTMLUListElement> & {
  logs: DailyLog[];
  categories: DailyLogCategory[];
  emojis: EmojiModel[];
  children?: never;
};

function DailyLogList({ logs, categories, emojis, ...props }: DailyLifeLogListProps) {
  return (
    <List {...props}>
      {logs.map((log) => {
        const category = categories.find((category) => category.id === log.categoryId);
        const emoji = emojis.find((emoji) => emoji.key === category?.emojiKey);

        if (category == null) {
          return null;
        }

        return <DailyLogListItem key={log.id} log={log} category={category} emoji={emoji} />;
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
