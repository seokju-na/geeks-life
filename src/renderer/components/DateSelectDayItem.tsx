import React, { ComponentProps } from 'react';
import { CompositeItem, CompositeStateReturn } from 'reakit';
import { DailyScore } from '../../core/domain';
import { dailyScoreColorMap } from '../colors/daily-score-colors';
import { selectBackground, selectForeground, selectPrimary, styled } from '../colors/theming';
import { Button } from './Button';

type Props = Omit<ComponentProps<typeof Button>, 'size' | 'variant' | 'color'> &
  CompositeStateReturn & {
    'aria-label': string;
    scoreLevel?: DailyScore;
    selected?: boolean;
  };

export default function DateSelectDayItem({ scoreLevel, onClick, selected, ...props }: Props) {
  return (
    <CompositeItem
      as={Item}
      style={{ backgroundColor: dailyScoreColorMap[scoreLevel ?? DailyScore.None] }}
      aria-current={selected}
      onClick={onClick}
      {...props}
    />
  );
}

const Item = styled(Button)`
  border: 1px solid ${selectForeground('divider')};
  background-color: ${selectBackground('backgroundHighlighted')};
  padding: 0;

  &:disabled {
    background-color: transparent;
  }

  &:not(:disabled)[aria-current='true'] {
    box-shadow: ${selectPrimary()} 0px 0px 0px 0.175em;

    &:focus {
      box-shadow: ${selectPrimary()} 0px 0px 0px 0.2em;
    }
  }
`;
