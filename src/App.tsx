import { emit } from '@tauri-apps/api/event';
import { useSubscription } from 'observable-hooks';
import { useEffect } from 'react';
import { fromEvent, filter } from 'rxjs';
import { DailyLifeCalendar } from './components';
import { Titlebar } from './components/Titlebar';
import { useDailyLifeViewState } from './hooks';
import { resizeWindow } from './remotes';

export default function App() {
  useEscKeydown();
  useWindowResize();

  return (
    <main>
      <Titlebar />
      <DailyLifeCalendar />
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

function useWindowResize() {
  const { value } = useDailyLifeViewState();

  useEffect(() => {
    switch (value) {
      case 'week':
        resizeWindow({ width: 320, height: 480 });
        break;
      case 'month':
        resizeWindow({ width: 320, height: 600 });
        break;
    }
  }, [value]);
}
