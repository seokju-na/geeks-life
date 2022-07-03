import { DailyLife, getScoreColor } from '../../models';
import { styled } from '../../styles';

interface Props {
  selected: boolean;
  item?: DailyLife;
  onClick: () => void;
}

export function Day({ selected, item, onClick }: Props) {
  return (
    <Wrapper
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      css={{ backgroundColor: item != null ? getBackgroundColor(item) : undefined }}
    />
  );
}

const Wrapper = styled('div', {
  height: 36,
  border: `1px solid $divider`,
  borderRadius: '$normal',
  transition: 'background-color 0.15s ease-in-out 0s',
  $$selectedColor: '$colors$blue400',
  "&[aria-checked='true']": {
    position: 'relative',
    boxShadow: '0 0 0 1px $$selectedColor',
  },
});

function getBackgroundColor(item: DailyLife) {
  if (item.score == null) {
    return '$backgroundHighlighted';
  }

  return getScoreColor(item.score);
}
