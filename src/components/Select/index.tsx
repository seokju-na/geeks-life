import React, { ComponentProps, ReactNode } from 'react';
import * as Primitives from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { styled } from '../../styles';

type SelectProps = ComponentProps<typeof Primitives.Root> & {
  displayValue?: ReactNode;
};

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  ({ children, displayValue, ...props }, forwardedRef) => {
    return (
      <Primitives.Root {...props}>
        <Trigger ref={forwardedRef}>
          <TriggerValue children={displayValue} />
          <TriggerIconWrapper>
            <TriggerIcon />
          </TriggerIconWrapper>
        </Trigger>
        <Content>
          <Viewport>{children}</Viewport>
        </Content>
      </Primitives.Root>
    );
  }
);

const Trigger = styled(Primitives.Trigger, {
  all: 'unset',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$normal',
  border: `1px solid $divider`,
  paddingLeft: '$lg',
  fontSize: '$md',
  lineHeight: 1,
  height: 28,
  backgroundColor: '$background',
  color: '$text',
  transition: 'box-shadow 0.2s ease',
  $$shadowColor: '$colors$focusRing',
  '&:focus': { position: 'relative', boxShadow: '0 0 0 2px $$shadowColor' },
});

const TriggerValue = styled(Primitives.Value, {
  display: 'inline-flex',
  alignItems: 'center',
});

const TriggerIconWrapper = styled(Primitives.Icon, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 $md',
  height: '100%',
  marginLeft: '$lg',
  backgroundColor: '$backgroundHighlighted',
});

const TriggerIcon = styled(ChevronDownIcon, {
  color: '$icon',
});

const Content = styled(Primitives.Content, {
  overflow: 'hidden',
  backgroundColor: '$backgroundHighlighted',
  borderRadius: '$normal',
  border: '1px solid $divider',
});

const Viewport = styled(Primitives.Viewport, {
  padding: '$sm 0',
});

type SelectItemProps = ComponentProps<typeof Primitives.Item>;

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(({ children, ...props }, forwardedRef) => {
  return (
    <Item {...props} ref={forwardedRef}>
      <ItemIndicator>
        <ItemCheckIcon />
      </ItemIndicator>
      <Primitives.ItemText>{children}</Primitives.ItemText>
    </Item>
  );
});

const Item = styled(Primitives.Item, {
  all: 'unset',
  fontSize: '$md',
  lineHeight: 1,
  color: '$text',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: 28,
  padding: '0 34px 0 $lg',
  position: 'relative',
  userSelect: 'none',
  transition: 'background-color 0.15s ease-in-out 0s',
  '&:focus': {
    backgroundColor: '$divider',
  },
});

const ItemIndicator = styled(Primitives.ItemIndicator, {
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  right: 0,
  top: 0,
  bottom: 0,
  width: 28,
  height: 28,
});

const ItemCheckIcon = styled(CheckIcon, {
  color: '$icon',
  fontWeight: '$bold',
});
