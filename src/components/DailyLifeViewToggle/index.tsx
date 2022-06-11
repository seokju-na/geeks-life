import { useDailyLifeViewState } from '../../hooks';
import { DailyLifeView } from '../../models';
import { ButtonToggleItem, ButtonToggle } from '../ButtonToggle';

const options: Array<{ name: string; value: DailyLifeView }> = [
  { name: 'Weekly', value: 'week' },
  { name: 'Monthly', value: 'month' },
];

export function DailyLifeViewToggle() {
  const { value, setValue } = useDailyLifeViewState();

  return (
    <ButtonToggle type="single" value={value} onValueChange={val => setValue(val as DailyLifeView)}>
      {options.map(({ name, value }) => (
        <ButtonToggleItem key={value} value={value}>
          {name}
        </ButtonToggleItem>
      ))}
    </ButtonToggle>
  );
}
