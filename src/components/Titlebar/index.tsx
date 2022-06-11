import { format } from 'date-fns';
import { match } from 'ts-pattern';
import { useSelectedDateState, useDailyLifeViewState } from '../../hooks';
import { styled } from '../../styles';
import { DailyLifeViewToggle } from '../DailyLifeViewToggle';

export function Titlebar() {
  const { value: selectedDate } = useSelectedDateState();
  const { value: view } = useDailyLifeViewState();

  const title = match(view)
    .with('week', () => format(selectedDate, `wo 'Week of' yyyy`))
    .with('month', () => format(selectedDate, 'MMM yyyy'))
    .run();

  return (
    <Header data-tauri-drag-region>
      <Title css={{ flex: 1 }}>{title}</Title>
      <DailyLifeViewToggle />
    </Header>
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
