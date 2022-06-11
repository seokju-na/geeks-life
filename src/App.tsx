import { emit } from '@tauri-apps/api/event';
import { format } from 'date-fns';
import { useSubscription } from 'observable-hooks';
import { useState } from 'react';
import { fromEvent, filter } from 'rxjs';
import { ButtonToggle, ButtonToggleItem, DailyLifeCalendar } from './components';
import { styled } from './styles';

export default function App() {
  useEscKeydown();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const title = format(new Date(selectedDate), "wo 'Week of' yyyy");

  return (
    <main>
      <Header data-tauri-drag-region>
        <Title css={{ flex: 1 }}>{title}</Title>
        <ButtonToggle type="single">
          <ButtonToggleItem value="weekly">Weekly</ButtonToggleItem>
          <ButtonToggleItem value="monthly">Monthly</ButtonToggleItem>
        </ButtonToggle>
      </Header>
      <DailyLifeCalendar
        view="week"
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        css={{ padding: '$sm $lg' }}
      />
    </main>
  );
}

const Header = styled('header', {
  display: 'flex',
  alignItems: 'center',
  padding: '$md $lg',
  userSelect: 'none',
  cursor: 'default',
  '&:active': {
    cursor: 'default',
  },
});

const Title = styled('h1', {
  margin: 0,
  fontSize: '$md',
  fontWeight: '$semibold',
  color: '$text',
  pointerEvents: 'none',
});

const keydown$ = fromEvent<KeyboardEvent>(document, 'keydown');

function useEscKeydown() {
  useSubscription(keydown$.pipe(filter(e => !e.defaultPrevented && e.key === 'Escape')), event => {
    const { activeElement } = document;

    // Hide window when focus lost.
    if (activeElement === null || activeElement === document.body) {
      event.preventDefault();
      emit('hide');
    } else {
      (activeElement as HTMLElement)?.blur();
    }
  });
}
