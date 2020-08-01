import React, { HTMLProps, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DailyScore } from '../../core/domain';
import { selectForeground, styled } from '../colors/theming';
import ScoreMenuButton from '../components/ScoreMenuButton';
import { actions } from '../store/actions';
import { selectors } from '../store/selectors';

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
      <ScoreMenuButton
        score={dailyLife?.score ?? DailyScore.None}
        onScoreChange={handleDailyLifeScoreChange}
      />
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
