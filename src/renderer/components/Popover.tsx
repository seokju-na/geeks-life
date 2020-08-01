/* eslint-disable @typescript-eslint/no-explicit-any */
import { css, Interpolation } from '@emotion/core';
import React, { ComponentElement, ComponentProps, FunctionComponentElement } from 'react';
import { Popover as ReakitPopover, PopoverArrow, PopoverDisclosure, usePopoverState } from 'reakit';
import { useTheme } from '../colors/theming';

type PopoverState = ReturnType<typeof usePopoverState>;

export type PopoverProps = Omit<ComponentProps<typeof ReakitPopover>, 'as' | keyof PopoverState> & {
  css?: Interpolation;
  showArrow?: boolean;
  popover: PopoverState;
  disclosure?: FunctionComponentElement<any> | ComponentElement<any, any>;
};

export default function Popover({
  popover,
  disclosure,
  css: cssFormProp,
  children,
  showArrow = true,
  ...props
}: PopoverProps) {
  const theme = useTheme();

  return (
    <>
      {disclosure != null ? (
        <PopoverDisclosure {...popover} ref={disclosure.ref} {...disclosure.props}>
          {(disclosureProps) => React.cloneElement(disclosure, disclosureProps)}
        </PopoverDisclosure>
      ) : null}
      <ReakitPopover
        {...popover}
        css={css`
          background-color: ${theme.background.dialog};
          padding: 12px;
          border: 1px solid ${theme.foreground.divider};
          border-radius: 0.25rem;
          transition: opacity 225ms ease-in-out;
          opacity: 0;
          z-index: 998;

          &[data-enter] {
            opacity: 1;
          }

          &:focus {
            outline: 0;
            box-shadow: ${theme.primary['300']} 0px 0px 0px 0.175rem;
          }

          ${cssFormProp};
        `}
        {...props}
      >
        {showArrow ? (
          <PopoverArrow
            {...popover}
            css={css`
              svg {
                path.stroke {
                  fill: ${theme.foreground.divider};
                }

                path.fill {
                  fill: ${theme.background.dialog};
                }
              }
            `}
          />
        ) : null}
        {children}
      </ReakitPopover>
    </>
  );
}
