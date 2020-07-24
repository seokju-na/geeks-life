import { css, Interpolation } from '@emotion/core';
import React, { ComponentProps, forwardRef, useMemo } from 'react';
import { Input as ReakitInput } from 'reakit';
import { useTheme } from '../colors/theming';

export type InputProps = Omit<ComponentProps<typeof ReakitInput>, 'ref' | 'children'> & {
  css?: Interpolation;
  /** Internal prop */
  _noStyle?: boolean;
  children?: never;
};

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { _noStyle = false, css: cssFromProp, ...otherProps } = props;

  const theme = useTheme();
  const style = useMemo(
    () => css`
      min-width: auto;
      border-radius: 0.25rem;
      border: 1px solid ${theme.foreground.divider};
      background-color: rgba(255, 255, 255, ${theme.isDark ? '0.1' : '0.04'});
      padding: 0.25em 0.5em;
      font-size: 1em;
      font-weight: 500;
      line-height: 1.5;
      transition: box-shadow 0.15s ease-in-out 0s;

      &:focus {
        outline: 0;
        box-shadow: ${theme.primary['300']} 0px 0px 0px 0.15rem;
      }

      &::placeholder {
        color: ${theme.foreground.disabledText};
      }

      ${cssFromProp};
    `,
    [theme, cssFromProp],
  );

  return <ReakitInput ref={ref} css={_noStyle ? undefined : style} {...otherProps} />;
});

export default Input;
