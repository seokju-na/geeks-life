import { css } from '@emotion/core';
import React, { ComponentProps, createContext, useCallback, useContext, useEffect } from 'react';
import { Group, useRadioState } from 'reakit';
import { useTheme } from '../colors/theming';
import { Button, buttonFontSizes, ButtonProps, ButtonSize } from './Button';

type RadioState = ReturnType<typeof useRadioState>;

type ButtonGroupContextValue = RadioState & {
  size: ButtonSize;
  name: string;
  onChange(value: string): void;
};

const ButtonGroupContext = createContext<ButtonGroupContextValue | undefined>(undefined);

export type ButtonToggleGroupProps = Omit<ComponentProps<typeof Group>, 'tabIndex' | 'onChange'> & {
  name: string;
  ['aria-label']: string;
  value?: string;
  size?: ButtonSize;
  onChange?(value: string): void;
};

export function ButtonToggleGroup({
  name,
  value,
  size = 'default',
  children,
  onChange,
  ...props
}: ButtonToggleGroupProps) {
  const theme = useTheme();
  const radio = useRadioState({ state: value });
  const handleChange = useCallback(
    (value: string) => {
      radio.setState(value);
      onChange?.(value);
    },
    [radio, onChange],
  );

  useEffect(() => {
    radio.setState(value);
  }, [radio, value]);

  return (
    <ButtonGroupContext.Provider
      value={{
        name,
        size,
        ...radio,
        onChange: handleChange,
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
        {...props}
      >
        {children}
      </Group>
    </ButtonGroupContext.Provider>
  );
}

export type ButtonToggleProps = Omit<ButtonProps, 'ref' | 'size' | 'variant' | 'color'> & {
  value: string;
};

export function ButtonToggle({ children, value, ...props }: ButtonToggleProps) {
  const theme = useTheme();
  const context = useContext(ButtonGroupContext);
  const handleClick = useCallback(() => {
    context?.onChange(value);
  }, [value, context]);

  return (
    <Button
      size={context?.size}
      name={context?.name}
      aria-pressed={context?.state === value}
      onClick={handleClick}
      // TODO: enhance focus style
      css={css`
        & + & {
          border-left: 1px solid ${theme.foreground.divider};
        }

        border: 0;
        margin: 0;
        font: inherit;
        color: ${theme.foreground.text};
        outline: none;
        cursor: pointer;
        border-radius: 0;
        transition: background-color 0.15s ease-in-out 0s;
        background-color: ${theme.background.raisedButton};

        &[aria-pressed='true'] {
          background-color: ${theme.background.selectedButton};
        }

        &:focus {
          box-shadow: none;
        }

        &:not([aria-pressed='true']):focus {
          background-color: ${theme.background.focusedButton};
        }
      `}
      {...props}
    >
      {children}
    </Button>
  );
}
