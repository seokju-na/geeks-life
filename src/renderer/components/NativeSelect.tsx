import { css } from '@emotion/core';
import React, { ComponentProps, ReactNode, useCallback, useRef, useState } from 'react';
import { unstable_useId as useId } from 'reakit';
import { selectBackground, styled, useTheme } from '../colors/theming';
import { getElectronFeatures } from '../electron-features';
import { Button } from './Button';
import { Icon } from './Icon';

const { Menu, MenuItem } = getElectronFeatures();

export interface SelectOption<T extends string | number> {
  value: T;
  displayValue: string;
}

export type NativeSelectProps<T extends string | number> = Omit<
  ComponentProps<typeof Button>,
  'children' | 'onChange'
> & {
  options: SelectOption<T>[];
  value?: T;
  onChange?(value: T): void;
  children: (value: T | undefined) => ReactNode;
};

export default function NativeSelect<T extends string | number>(props: NativeSelectProps<T>) {
  const { options, value, onChange, children, ...otherProps } = props;

  const theme = useTheme();
  const { id: contentId } = useId({
    baseId: 'native-select-content',
  });

  const ref = useRef<HTMLButtonElement>(null);
  const [opened, setOpened] = useState(false);
  const openMenu = useCallback(() => {
    const button = ref.current;

    if (button == null) {
      return;
    }

    const menu = new Menu();
    const selectedIndex = options.findIndex((option) => option.value === value);

    options.forEach((option, index) => {
      menu.append(
        new MenuItem({
          type: 'checkbox',
          click() {
            onChange?.(option.value);
          },
          checked: selectedIndex === index,
          label: option.displayValue,
        }),
      );
    });

    const rect = button.getBoundingClientRect();

    setOpened(true);
    menu.popup({
      x: Math.floor(rect.x),
      y: Math.floor(rect.y),
      positioningItem: selectedIndex > -1 ? selectedIndex : undefined,
      callback() {
        setOpened(false);
      },
    });
  }, [options, value, onChange]);

  return (
    <Button
      ref={ref}
      aria-labelledby={contentId}
      size="small"
      css={css`
        background-color: ${theme.background.background};
        border: 1px solid ${theme.foreground.divider};
        overflow: hidden;
        padding: 0;
      `}
      aria-haspopup={true}
      aria-expanded={opened}
      onClick={openMenu}
      {...otherProps}
    >
      <Content id={contentId}>{children(value)}</Content>
      <Right>
        <Icon name="direction" size="1.5em" aria-hidden={true} />
      </Right>
    </Button>
  );
}

const Content = styled.span`
  flex: 1 1 auto;
  padding: 0 0.75em;
  display: inline-flex;
  align-items: center;
`;

const Right = styled.span`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  background-color: ${selectBackground('backgroundHighlighted')};
  height: 100%;
`;
