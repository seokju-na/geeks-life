/* eslint-disable @typescript-eslint/no-explicit-any */
import { css } from '@emotion/core';
import React, {
  cloneElement,
  ComponentElement,
  FunctionComponentElement,
  HTMLProps,
  useEffect,
} from 'react';
import { Dialog as BaseDialog, DialogBackdrop, DialogDisclosure, useDialogState } from 'reakit';
import { useTheme } from '../colors/theming';

export type DialogProps = Omit<HTMLProps<HTMLDivElement>, 'as'> & {
  role?: 'alertdialog' | 'dialog';
  disclosure: FunctionComponentElement<any> | ComponentElement<any, any>;
  onVisible?(): void;
};

export default function Dialog({ disclosure, children, onVisible, ...props }: DialogProps) {
  const dialog = useDialogState({ animated: true });
  const theme = useTheme();

  useEffect(() => {
    if (dialog.visible) {
      onVisible?.();
    }
  }, [dialog.visible, onVisible]);

  return (
    <>
      <DialogDisclosure {...dialog} ref={disclosure.ref} {...disclosure.props}>
        {(disclosureProps) => cloneElement(disclosure, disclosureProps)}
      </DialogDisclosure>
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
        >
          {children}
        </BaseDialog>
      </DialogBackdrop>
    </>
  );
}
