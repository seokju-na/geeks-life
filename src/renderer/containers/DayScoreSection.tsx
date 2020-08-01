import React, { HTMLProps, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createEnumKeyFind } from '../../core';
import { DailyScore } from '../../core/domain';
import { dailyScoreColorMap } from '../colors/daily-score-colors';
import { selectForeground, styled } from '../colors/theming';
import NativeSelect from '../components/NativeSelect';
import { actions } from '../store/actions';
import { selectors } from '../store/selectors';

const scores = [DailyScore.Low, DailyScore.Medium, DailyScore.High, DailyScore.Excellent];
const getScoreKey = createEnumKeyFind(DailyScore);

const scoreOptions = scores.map((score) => ({
  value: score,
  displayValue: getScoreKey(score),
}));

export default function DayScoreSection(props: HTMLProps<HTMLDivElement>) {
  const isDateToday = useSelector(selectors.isDateToday);
  const dispatch = useDispatch();
  const dailyLife = useSelector(selectors.currentDailyLife);

  const title = useMemo(() => {
    if (isDateToday) {
      return `Today's Score`;
    }

    return 'Score';
  }, [isDateToday]);

  const handleDailyLifeScoreChange = useCallback(
    (score: DailyScore) => {
      dispatch(actions.changeDailyLifeScore({ score }));
    },
    [dispatch],
  );

  return (
    <Section {...props}>
      <Title>{title}</Title>
      <NativeSelect<DailyScore>
        value={dailyLife?.score ?? DailyScore.None}
        options={scoreOptions}
        onChange={handleDailyLifeScoreChange}
      >
        {(value) =>
          value != null ? (
            <>
              {value !== DailyScore.None ? (
                <ColorBox backgroundColor={dailyScoreColorMap[value]} />
              ) : null}
              {value === DailyScore.None ? `Not Selected` : getScoreKey(value)}
            </>
          ) : null
        }
      </NativeSelect>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  justify-content: space-between;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${selectForeground('text')};
`;

const ColorBox = styled.div<{ backgroundColor?: string }>`
  width: 1.5em;
  height: 1em;
  background-color: ${(p) => p.backgroundColor};
  margin-right: 6px;
  border-radius: 0.15em;
`;
