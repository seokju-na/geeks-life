import { Score } from '../../models';
import { Select, SelectItem } from '../Select';
import { Item } from './Item';

const NONE = '__NONE__' as const;
type Value = Score | typeof NONE;

interface Props {
  value?: Score;
  onChange?: (value: Score | undefined) => void;
}

export function ScoreSelect({ value: val, onChange }: Props) {
  const value = val ?? NONE;

  return (
    <Select
      value={value}
      onValueChange={(val: Value) => {
        onChange?.(val === NONE ? undefined : val);
      }}
      displayValue={value !== NONE ? <Item score={value} /> : <Item.None />}
    >
      <SelectItem value={NONE}>
        <Item.None />
      </SelectItem>
      {Object.entries(Score.enum).map(([, score]) => (
        <SelectItem key={score} value={score}>
          <Item score={score} />
        </SelectItem>
      ))}
    </Select>
  );
}
