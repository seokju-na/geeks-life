import { addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import { KeyboardEvent, useEffect, useRef } from 'react';
import { match } from 'ts-pattern';
import { useSelectedDateState, useDailyLifeViewState, useDailyLifes } from '../../hooks';
import { getDailyLifeId } from '../../models';
import { styled } from '../../styles';
import { getDaysOfWeekInCalendar, getDaysOfMonthInCalendar } from '../../utils/calendar';
import { Day } from './Day';

export function DailyLifeCalendar() {
  const ref = useRef<HTMLDivElement>(null);
  const { value: selectedDate, setValue: setSelectedDate } = useSelectedDateState();
  const { value: view } = useDailyLifeViewState();

  const params = match(view)
    .with('week', () => ({
      start: startOfWeek(selectedDate),
      end: endOfWeek(selectedDate),
    }))
    .with('month', () => ({
      start: startOfWeek(startOfMonth(selectedDate)),
      end: endOfWeek(endOfMonth(selectedDate)),
    }))
    .run();
  const { data: items = [] } = useDailyLifes(params);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const dates = match(view)
    .with('week', () => getDaysOfWeekInCalendar(selectedDate))
    .with('month', () => getDaysOfMonthInCalendar(selectedDate))
    .run();

  return (
    <Wrapper ref={ref} role="group" tabIndex={0} onKeyDown={useKeyboardHandler()}>
      <Grid>
        {dates.map(date => {
          const id = getDailyLifeId(date);
          const item = items.find(x => x.id === id);
          const selected = isSameDay(date, selectedDate);
          const handleClick = () => setSelectedDate(date);

          return <Day key={id} item={item} selected={selected} onClick={handleClick} />;
        })}
      </Grid>
    </Wrapper>
  );
}

const Wrapper = styled('div', {
  padding: '$md $lg',
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

const Grid = styled('div', {
  display: 'grid',
  gridGap: '6px',
  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
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
