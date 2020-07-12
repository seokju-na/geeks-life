import { css } from '@emotion/core';
import React, { ComponentProps, createContext, HTMLProps, useCallback, useContext } from 'react';
import { Group, useRadioState } from 'reakit';
import { selectBackground, selectForeground, styled, useTheme } from '../colors/theming';
import { Button, buttonFontSizes, ButtonSize } from './Button';

type RadioState = ReturnType<typeof useRadioState>;

type ButtonGroupContextValue = RadioState & {
  size: ButtonSize;
  name: string;
};

const ButtonGroupContext = createContext<ButtonGroupContextValue | undefined>(undefined);

export type ButtonToggleGroupProps = Omit<ComponentProps<typeof Group>, 'tabIndex'> & {
  name: string;
  ['aria-label']: string;
  value?: string;
  size?: ButtonSize;
};

export function ButtonToggleGroup({
  name,
  value,
  size = 'regular',
  children,
  ...props
}: ButtonToggleGroupProps) {
  const theme = useTheme();
  const radio = useRadioState({ state: value });

  return (
    <ButtonGroupContext.Provider
      value={{
        name,
        size,
        ...radio,
      }}
    >
      <Group
        css={css`
          position: relative;
          display: inline-flex;
          flex-direction: row;
          white-space: nowrap;
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
          border-radius: 0.25rem;
          font-size: ${buttonFontSizes[size]};
          border: 1px solid ${theme.foreground.divider};
        `}
        tabIndex={-1}
        {...props}
      >
        {children}
      </Group>
    </ButtonGroupContext.Provider>
  );
}

export type ButtonToggleProps = Omit<HTMLProps<HTMLDivElement>, 'tabIndex' | 'onClick'> & {
  value: string;
};

export function ButtonToggle({ children, value, ...props }: ButtonToggleProps) {
  const context = useContext(ButtonGroupContext);
  const handleClick = useCallback(() => {
    context?.setState(value);
  }, [value, context]);

  return (
    <ButtonToggleWrapper pressed={context?.state === value} tabIndex={-1} {...props}>
      <Button
        size={context?.size ?? 'regular'}
        name={context?.name}
        tabIndex={0}
        type="button"
        aria-pressed={context?.state === value}
        onClick={handleClick}
      >
        {children}
      </Button>
    </ButtonToggleWrapper>
  );
}

const ButtonToggleWrapper = styled.div<{ pressed: boolean }>`
  & + & {
    border-left: 1px solid ${selectForeground('divider')};
  }

  > button {
    border: 0;
    margin: 0;
    font: inherit;
    color: ${selectForeground('text')};
    outline: none;
    cursor: pointer;
    border-radius: 0;
    transition: background-color 0.15s ease-in-out 0s;
    background-color: ${selectBackground('raisedButton')};

    &[aria-pressed='true'] {
      background-color: ${selectBackground('selectedButton')};
    }

    &:focus {
      box-shadow: none;
    }

    &:not([aria-pressed='true']):focus {
      background-color: ${selectBackground('focusedButton')};
    }
  }
`;