import { CSS } from '@stitches/react';
import { addDays, subDays } from 'date-fns';
import { KeyboardEvent, useCallback, useEffect, useRef } from 'react';
import { styled } from '../../styles';
import { Switch } from '../Switch';
import { Week } from './Week';

interface Props {
  view: 'week' | 'month';
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  css?: CSS;
}

export function DailyLifeCalendar({ view, css, ...props }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { handleKeyboard } = useSelectionController(props);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <Wrapper ref={ref} role="group" tabIndex={0} onKeyDown={handleKeyboard} css={css}>
      <Switch
        value={view}
        caseBy={{
          week: <Week {...props} />,
          month: <Todo />,
        }}
      />
    </Wrapper>
  );
}

function Todo() {
  throw new Error('TODO');
  return <></>;
}

const Wrapper = styled('div', {
  '&:focus': {
    border: 'none',
    outline: 0,
    "& [role=radio][aria-checked='true']": {
      $$focusedColor: '$colors$blue500',
      position: 'relative',
      boxShadow: '0 0 0 2px $$focusedColor',
    },
  },
});

function useSelectionController({ selectedDate, onSelectDate }: Pick<Props, 'selectedDate' | 'onSelectDate'>) {
  const handleKeyboard = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          onSelectDate(subDays(selectedDate, 7));
          event.preventDefault();
          return;
        case 'ArrowRight':
          onSelectDate(addDays(selectedDate, 1));
          event.preventDefault();
          return;
        case 'ArrowDown':
          onSelectDate(addDays(selectedDate, 7));
          event.preventDefault();
          return;
        case 'ArrowLeft':
          onSelectDate(subDays(selectedDate, 1));
          event.preventDefault();
          return;
      }
    },
    [selectedDate, onSelectDate]
  );

  return { handleKeyboard };
}
