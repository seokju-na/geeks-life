import { css } from '@emotion/core';
import React, { ComponentProps } from 'react';
import { Button as ReakitButton } from 'reakit';
import { Theme, useTheme } from '../colors/theming';

export type ButtonSize = 'small' | 'regular';
export type ButtonColor = 'primary' | 'normal';

export const buttonSizes: Readonly<Record<ButtonSize, number>> = {
  small: 28,
  regular: 36,
};

export const buttonFontSizes: Readonly<Record<ButtonSize, string | number>> = {
  small: '0.875rem',
  regular: '1rem',
};

const getButtonStyles = (color: ButtonColor, theme: Theme) => {
  switch (color) {
    case 'normal':
      return css`
        background-color: ${theme.background.backgroundHighlighted};

        &:focus {
          box-shadow: ${theme.primary['300']} 0px 0px 0px 0.2em;
        }
      `;
    case 'primary':
      return css`
        background-color: ${theme.primary['500']};
        color: ${theme.primary.contrast['500']};

        &:focus {
          box-shadow: ${theme.primary['200']} 0px 0px 0px 0.2em;
        }
      `;
  }
};

export type ButtonProps = ComponentProps<typeof ReakitButton> & {
  /** @default normal */
  color?: ButtonColor;
  /** @default regular */
  size?: ButtonSize;
};

export function Button({ color = 'normal', size = 'regular', children, ...props }: ButtonProps) {
  const theme = useTheme();

  return (
    <ReakitButton
      css={css`
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: ${buttonFontSizes[size]};
        font-weight: 500;
        user-select: none;
        line-height: ${buttonSizes[size]}px;
        cursor: pointer;
        //noinspection CssUnknownProperty
        -webkit-app-region: no-drag;
        white-space: nowrap;
        padding: 0 0.75em;
        border-radius: 0.25rem;
        height: ${buttonSizes[size]}px;
        transition: box-shadow 0.15s ease-in-out 0s;

        & * {
          cursor: inherit;
        }

        ${getButtonStyles(color, theme)};

        &:focus {
          outline: 0;
        }

        &:disabled {
          cursor: default;
          background-color: ${theme.background.disabledButton};
          color: ${theme.foreground.disabledButton};
        }
      `}
      {...props}
    >
      {children}
    </ReakitButton>
  );
}
