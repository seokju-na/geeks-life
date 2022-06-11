import { emit } from '@tauri-apps/api/event';
import { useSubscription } from 'observable-hooks';
import { useState } from 'react';
import { fromEvent, filter } from 'rxjs';
import { ButtonToggle, ButtonToggleItem, DailyLifeCalendar } from './components';

export default function App() {
  useEscKeydown();

  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <main>
      <div style={{ padding: 24 }}>
        <ButtonToggle type="single">
          <ButtonToggleItem value="weekly">Weekly</ButtonToggleItem>
          <ButtonToggleItem value="monthly">Monthly</ButtonToggleItem>
        </ButtonToggle>
      </div>
      <div style={{ padding: 24 }}>
        <DailyLifeCalendar view="week" selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </div>
    </main>
  );
}

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
