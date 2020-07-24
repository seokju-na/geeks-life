import { css } from '@emotion/core';
import React, { ComponentProps, forwardRef } from 'react';
import { Button as ReakitButton } from 'reakit';
import { Theme, useTheme } from '../colors/theming';

export type ButtonVariant = 'flat' | 'icon';
export type ButtonSize = 'tiny' | 'small' | 'default';
export type ButtonColor = 'primary' | 'default';

export const buttonSizes: Readonly<Record<ButtonSize, number>> = {
  tiny: 24,
  small: 28,
  default: 36,
};

export const buttonFontSizes: Readonly<Record<ButtonSize, string | number>> = {
  tiny: '0.75rem',
  small: '0.875rem',
  default: '1rem',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function match<T extends string | number | symbol, R = any>(matchCase: Record<T, R>) {
  return (value: T): R => matchCase[value];
}

const getButtonStyles = (
  theme: Theme,
  props: {
    size: ButtonSize;
    color: ButtonColor;
    variant: ButtonVariant;
  },
) => {
  const { size, variant, color } = props;

  switch (variant) {
    case 'flat':
      return match<ButtonColor>({
        primary: css`
          background-color: ${theme.primary['500']};
          color: ${theme.primary.contrast['500']};

          &:focus {
            box-shadow: ${theme.primary['200']} 0px 0px 0px 0.175rem;
          }
        `,
        default: css`
          background-color: ${theme.background.backgroundHighlighted};

          &:focus {
            box-shadow: ${theme.primary['300']} 0px 0px 0px 0.175rem;
          }
        `,
      })(color);
    case 'icon':
      return css`
        background-color: transparent;
        min-width: ${buttonSizes[size]}px;
        padding: 0;
        font-size: ${buttonSizes[size] - 4}px;

        &:focus {
          box-shadow: ${theme.primary['300']} 0px 0px 0px 0.175rem;
        }

        ${match<ButtonColor>({
          primary: css`
            color: ${theme.primary['500']};
          `,
          default: css`
            color: ${theme.foreground.icon};
          `,
        })(color)};
      `;
  }
};

export type ButtonProps = Omit<ComponentProps<typeof ReakitButton>, 'color'> & {
  /** @default flat */
  variant?: ButtonVariant;
  /** @default normal */
  color?: ButtonColor;
  /** @default regular */
  size?: ButtonSize;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'flat', color = 'default', size = 'default', children, ...props }, ref) => {
    const theme = useTheme();

    return (
      <ReakitButton
        ref={ref}
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
          will-change: box-shadow;
          transition: box-shadow 0.15s ease-in-out 0s;
          pointer-events: auto;

          & * {
            cursor: inherit;
          }

          &:focus {
            outline: 0;
          }

          ${getButtonStyles(theme, { color, variant, size })};

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
  },
);
