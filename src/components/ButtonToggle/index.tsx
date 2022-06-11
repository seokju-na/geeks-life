import { Root, Item } from '@radix-ui/react-toggle-group';
import { styled } from '../../styles';

export const ButtonToggle = styled(Root, {
  display: 'inline-flex',
  borderRadius: '$normal',
  border: `1px solid $divider`,
});

export const ButtonToggleItem = styled(Item, {
  all: 'unset',
  backgroundColor: '$raisedButton',
  color: '$text',
  height: 28,
  display: 'flex',
  fontSize: '$sm',
  padding: '0 $md',
  lineHeight: 1,
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.15s ease-in-out 0s, box-shadow 0.2s ease',
  '&:first-child': { borderTopLeftRadius: '$normal', borderBottomLeftRadius: '$normal' },
  '&:last-child': { borderTopRightRadius: '$normal', borderBottomRightRadius: '$normal' },
  '& + &': { borderLeft: '1px solid $divider' },
  '&[data-state=on]': { backgroundColor: '$selectedButton' },
  $$shadowColor: '$colors$focusRing',
  '&:focus': { position: 'relative', boxShadow: '0 0 0 2px $$shadowColor' },
});
