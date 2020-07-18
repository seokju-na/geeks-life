import React, { HTMLProps } from 'react';
import { selectBackground, selectForeground, styled } from '../colors/theming';

type DayLogListProps = HTMLProps<HTMLUListElement> & {
  children?: never;
};

export default function DayLogsList(props: DayLogListProps) {
  return (
    <List {...props}>
      <Item>123</Item>
      <Item>123</Item>
      <Item>123</Item>
      <Item>123</Item>
      <Item>123</Item>
    </List>
  );
}

const List = styled.ul`
  display: block;
  overflow: hidden;
  border-radius: 0.25rem;
  background-color: ${selectBackground('backgroundHighlighted')};
  border: 1px solid ${selectForeground('divider')};
`;

const Item = styled.li`
  list-style: none;
  padding: 8px 12px;
  display: flex;
  align-items: flex-start;

  & + & {
    border-top: 1px solid ${selectForeground('divider')};
  }
`;
