import { css } from '@emotion/core';
import React, { forwardRef, HTMLProps } from 'react';
import { Emoji as EmojiModel } from '../../core/domain';
import { coerceCssPixelValue } from '../utils/coercion';

export interface EmojiProps extends Omit<HTMLProps<HTMLElement>, 'size' | 'children'> {
  emoji: EmojiModel;
  size?: number | string;
  children?: never;
}

export const Emoji = forwardRef<HTMLElement, EmojiProps>((props, ref) => {
  const { emoji, size = '1.25em', ...otherProps } = props;
  const sizeCss = coerceCssPixelValue(size);

  return (
    <i
      ref={ref}
      aria-label={emoji.key}
      css={css`
        display: inline-flex;
        width: 1em;
        height: 1em;
        font: inherit;
        font-size: ${sizeCss};
        line-height: 1;

        ${emoji.type === 'custom'
          ? css`
              background-size: contain;
              background-repeat: no-repeat;
              background-position: center;
              background-image: url(${emoji.fileUrl});
            `
          : ''}
      `}
      {...otherProps}
    >
      {emoji.type === 'native' ? emoji.char : null}
    </i>
  );
});
