import { useDailyLifeViewState } from '../../hooks';
import { DailyLifeView } from '../../models';
import { ButtonToggleItem, ButtonToggle } from '../ButtonToggle';

export function DailyLifeViewToggle() {
  const { value, setValue } = useDailyLifeViewState();
  const handleValueChange = (val: string) => {
    try {
      setValue(DailyLifeView.parse(val));
    } catch (error: unknown) {
      //
    }
  };

  return (
    <ButtonToggle type="single" value={value} onValueChange={handleValueChange}>
      {Object.entries(DailyLifeView.enum).map(([name, value]) => (
        <ButtonToggleItem key={value} value={value}>
          {name}
        </ButtonToggleItem>
      ))}
    </ButtonToggle>
  );
}
