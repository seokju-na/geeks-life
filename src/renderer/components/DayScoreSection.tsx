import React, { useState } from 'react';
import { selectForeground, styled } from '../colors/theming';
import ScoreMenuButton from './ScoreMenuButton';

export default function DayScoreSection() {
  const [score, setScore] = useState<number | undefined>(undefined);

  return (
    <Section>
      <Title>Today{"'"}s Score</Title>
      <ScoreMenuButton score={score} onScoreChange={setScore} />
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
