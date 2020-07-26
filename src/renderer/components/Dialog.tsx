/* eslint-disable @typescript-eslint/no-explicit-any */
import { css } from '@emotion/core';
import React, {
  Children,
  cloneElement,
  ComponentElement,
  ComponentProps,
  createContext,
  FunctionComponentElement,
  HTMLProps,
  useMemo,
} from 'react';
import {
  Box,
  Dialog as BaseDialog,
  DialogBackdrop,
  DialogDisclosure,
  unstable_useId as useId,
  useDialogState,
  VisuallyHidden,
} from 'reakit';
import { useTheme } from '../colors/theming';

interface DialogContextValue {
  titleId?: string;
}

const DialogContext = createContext<DialogContextValue>({});

export type DialogProps = Omit<HTMLProps<HTMLDivElement>, 'as'> & {
  role?: 'alertdialog' | 'dialog';
  dialog: ReturnType<typeof useDialogState>;
  disclosure?: FunctionComponentElement<any> | ComponentElement<any, any>;
};

export default function Dialog({
  disclosure,
  dialog,
  children,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  ...props
}: DialogProps) {
  const theme = useTheme();
  const { id: titleId } = useId({ baseId: 'dialog-title' });

  return (
    <DialogContext.Provider value={{ titleId }}>
      {disclosure != null ? (
        <DialogDisclosure {...dialog} ref={disclosure.ref} {...disclosure.props}>
          {(disclosureProps) => cloneElement(disclosure, disclosureProps)}
        </DialogDisclosure>
      ) : null}
      <DialogBackdrop
        css={css`
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          perspective: 800px;
          transition: opacity 225ms ease-in-out;
          opacity: 0;
          background: rgba(0, 0, 0, 0.52);

          &[data-enter] {
            opacity: 1;
          }
        `}
        {...dialog}
      >
        <BaseDialog
          css={css`
            background-color: ${theme.background.dialog};
            transition: opacity 225ms ease-in-out, transform 225ms ease-in-out;
            opacity: 0;
            transform-origin: top center;
            transform: translate3d(0, 23%, 0) scale(0.9);
            min-width: 200px;
            min-height: 88px;
            border-radius: 0.25rem;

            &[data-enter] {
              opacity: 1;
              transform: translate3d(0, 0, 0) scale(1);
            }

            &:focus {
              outline: 0;
              box-shadow: ${theme.primary['300']} 0px 0px 0px 0.175rem;
            }
          `}
          {...dialog}
          {...props}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabel == null ? titleId : undefined}
        >
          {children}
        </BaseDialog>
      </DialogBackdrop>
    </DialogContext.Provider>
  );
}

export type DialogTitleProps = Omit<ComponentProps<typeof Box>, 'as'> & {
  /** @default h1 */
  as?: keyof JSX.IntrinsicElements;
  hidden?: boolean;
};

export function DialogTitle({ as = 'h1', children, hidden, ...props }: DialogTitleProps) {
  const Elem = hidden ? VisuallyHidden : Box;

  return (
    <Elem
      as={as}
      css={css`
        margin: 0;
        font-size: 1rem;
        line-height: 1.25;
        font-weight: 700;
      `}
      {...props}
    >
      {children}
    </Elem>
  );
}

export type DialogHeadProps = ComponentProps<typeof Box>;

export function DialogHead({ children, ...props }: DialogHeadProps) {
  return (
    <Box
      css={css`
        padding: 12px 12px 8px 12px;
        display: flex;
        align-items: center;
      `}
      {...props}
    >
      {children}
    </Box>
  );
}

export type DialogContentProps = ComponentProps<typeof Box>;

export function DialogContent({ children, ...props }: DialogContentProps) {
  return (
    <Box
      css={css`
        padding: 8px 12px;
      `}
      {...props}
    >
      {children}
    </Box>
  );
}

export type DialogActionsProps = Omit<ComponentProps<typeof Box>, 'align'> & {
  align?: 'left' | 'right' | 'full';
};

export function DialogActions({ align = 'full', children, ...props }: DialogActionsProps) {
  const childrenCount = useMemo(() => (align === 'full' ? Children.count(children) : undefined), [
    align,
    children,
  ]);

  return (
    <Box
      css={css`
        display: flex;
        align-items: center;
        ${align === 'left'
          ? 'justify-content: flex-start'
          : align === 'right'
          ? 'justify-content: flex-end'
          : ''};
        padding: 8px 12px 12px 12px;

        & > * + * {
          margin-left: 8px;
        }

        ${align === 'full' && childrenCount != null
          ? css`
              & > * {
                flex: 1 1 ${100 / childrenCount}%;
              }
            `
          : ''};
      `}
      {...props}
    >
      {children}
    </Box>
  );
}
