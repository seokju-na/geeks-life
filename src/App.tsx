import { emit } from '@tauri-apps/api/event';
import { useSubscription } from 'observable-hooks';
import { fromEvent, filter } from 'rxjs';
import { DailyLifeCalendar } from './components';
import { Titlebar } from './components/Titlebar';

export default function App() {
  useEscKeydown();

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
