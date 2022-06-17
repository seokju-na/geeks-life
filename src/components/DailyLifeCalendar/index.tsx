import { addDays, subDays } from 'date-fns';
import { KeyboardEvent, useEffect, useRef } from 'react';
import { useSelectedDateState, useDailyLifeViewState } from '../../hooks';
import { styled } from '../../styles';
import { Switch } from '../Switch';
import { Week } from './Week';

export function DailyLifeCalendar() {
  const ref = useRef<HTMLDivElement>(null);
  const { value: selectedDate, setValue: setSelectedDate } = useSelectedDateState();
  const { value: view } = useDailyLifeViewState();

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <Wrapper ref={ref} role="group" tabIndex={0} onKeyDown={useKeyboardHandler()}>
      <Switch
        value={view}
        caseBy={{
          week: <Week selectedDate={selectedDate} onSelectDate={setSelectedDate} />,
          month: <Todo />,
        }}
      />
    </Wrapper>
  );
}

function Todo() {
  return <>todo</>;
}

const Wrapper = styled('div', {
  padding: '$sm $lg',
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

function useKeyboardHandler() {
  const { value, setValue } = useSelectedDateState();

  return (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        setValue(subDays(value, 7));
        return;
      case 'ArrowRight':
        event.preventDefault();
        setValue(addDays(value, 1));
        return;
      case 'ArrowDown':
        event.preventDefault();
        setValue(addDays(value, 7));
        return;
      case 'ArrowLeft':
        event.preventDefault();
        setValue(subDays(value, 1));
        return;
    }
  };
}
