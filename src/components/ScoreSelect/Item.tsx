import { Score, getScoreColor } from '../../models';
import { styled } from '../../styles';

interface Props {
  score: Score;
}

export function Item({ score }: Props) {
  const name = Object.entries(Score.enum).find(([, value]) => score === value)?.[0];

  return (
    <Wrapper>
      <Box css={{ backgroundColor: getScoreColor(score) }} />
      <Text>{name}</Text>
    </Wrapper>
  );
}

Item.None = function NoneItem() {
  return (
    <Wrapper>
      <Text>None</Text>
    </Wrapper>
  );
};

const Wrapper = styled('div', {
  display: 'inline-flex',
  alignItems: 'center',
  height: 20,
});

const Box = styled('div', {
  width: 22,
  height: 14,
  borderRadius: 2,
  marginRight: '$sm',
});

const Text = styled('div', {
  fontSize: '$md',
  color: '$text',
});
