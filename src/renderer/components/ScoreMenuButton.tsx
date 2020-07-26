import { css } from '@emotion/core';
import React, { useCallback, useRef, useState } from 'react';
import { unstable_useId as useId } from 'reakit';
import { createEnumKeyFind } from '../../core';
import { DailyScore } from '../../core/domain';
import { dailyScoreColorMap } from '../colors/daily-score-colors';
import { selectBackground, styled, useTheme } from '../colors/theming';
import { getElectronFeatures } from '../electron-features';
import { Button } from './Button';
import { Icon } from './Icon';

interface Props {
  score: DailyScore;
  onScoreChange?(score: DailyScore): void;
}

const { Menu, MenuItem } = getElectronFeatures();
const scores = [DailyScore.Low, DailyScore.Medium, DailyScore.High, DailyScore.Excellent];
const getScoreKey = createEnumKeyFind(DailyScore);

export default function ScoreMenuButton({ score, onScoreChange }: Props) {
  const { id } = useId({
    baseId: 'gl-score-menu-button-text',
  });
  const ref = useRef<HTMLButtonElement>(null);
  const theme = useTheme();
  const [opened, setOpened] = useState(false);
  const openMenu = useCallback(() => {
    const button = ref.current;
    if (button == null) {
      return;
    }

    const menu = new Menu();

    scores.forEach((value) => {
      menu.append(
        new MenuItem({
          type: 'checkbox',
          click: () => onScoreChange?.(value),
          checked: score === value,
          label: getScoreKey(value),
        }),
      );
    });

    const rect = button.getBoundingClientRect();

    setOpened(true);
    menu.popup({
      x: Math.floor(rect.x),
      y: Math.floor(rect.y),
      positioningItem: score > 0 ? score - 1 : undefined,
      callback() {
        setOpened(false);
      },
    });
  }, [score, onScoreChange]);

  return (
    <Button
      ref={ref}
      aria-labelledby={id}
      size="small"
      css={css`
        border: 1px solid ${theme.background.backgroundHighlighted};
        background-color: transparent;
        overflow: hidden;
        padding: 0;
      `}
      aria-haspopup={true}
      aria-expanded={opened}
      onClick={openMenu}
    >
      <Text id={id}>
        {score !== DailyScore.None ? (
          <ColorBox backgroundColor={dailyScoreColorMap[score]} />
        ) : null}
        {score === DailyScore.None ? `Not Selected` : getScoreKey(score)}
      </Text>
      <Right>
        <Icon name="direction" size="1.5em" aria-hidden={true} />
      </Right>
    </Button>
  );
}

const Text = styled.span`
  flex: 1 1 auto;
  padding: 0 0.75em;
  display: inline-flex;
  align-items: center;
`;

const ColorBox = styled.div<{ backgroundColor?: string }>`
  width: 1.5em;
  height: 1em;
  background-color: ${(p) => p.backgroundColor};
  margin-right: 6px;
  border-radius: 0.15em;
`;

const Right = styled.span`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  background-color: ${selectBackground('backgroundHighlighted')};
  height: 100%;
`;
