import { isSameDay, format, startOfWeek, endOfWeek } from 'date-fns';
import { useDailyLifes } from '../../hooks';
import { styled } from '../../styles';
import { getWeek } from '../../utils/calendar';
import { Day } from './Day';

interface Props {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function Week({ selectedDate, onSelectDate }: Props) {
  const { data: items = [] } = useDailyLifes({
    start: startOfWeek(selectedDate),
    end: endOfWeek(selectedDate),
  });

  return (
    <Wrapper>
      {getWeek(selectedDate).map(date => {
        const id = format(date, 'yyyy-MM-dd');
        const item = items.find(x => x.id === id);
        const selected = isSameDay(date, selectedDate);
        const handleClick = () => onSelectDate(date);

        return <Day key={id} item={item} selected={selected} onClick={handleClick} />;
      })}
    </Wrapper>
  );
}

const Wrapper = styled('div', {
  display: 'grid',
  gridGap: '$sm',
  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
});
