/* eslint-disable @typescript-eslint/no-explicit-any */
import { css, Interpolation } from '@emotion/core';
import React, {
  Children,
  cloneElement,
  ComponentProps,
  FocusEvent,
  forwardRef,
  HTMLProps,
  ReactElement,
  ReactNode,
  useState,
} from 'react';
import { Box, unstable_useId as useId } from 'reakit';
import { styled, useTheme } from '../colors/theming';
import useResizeObserver from '../hooks/useResizeObserver';
import { coerceCssPixelValue } from '../utils/coercion';
import Input, { InputProps } from './Input';

export type FormFieldInputProps = Omit<InputProps, '_noStyle'>;

export const FormFieldInput = forwardRef<HTMLInputElement, FormFieldInputProps>((props, ref) => {
  const { id: idFromProp, ...otherProps } = props;
  const { id } = useId({ baseId: 'form-field-input-standalone' });

  return <Input ref={ref} id={idFromProp ?? id} {...otherProps} />;
});

export type FormFieldLabelProps = HTMLProps<HTMLLabelElement>;

export function FormFieldLabel({ children, ...props }: FormFieldLabelProps) {
  return (
    <label
      css={css`
        padding: 0 2px;
        margin-bottom: 8px;
        font-size: 0.875em;
        font-weight: 500;
        line-height: 1.25;
        display: block;
      `}
      {...props}
    >
      {children}
    </label>
  );
}

export type FormFieldErrorProps = Omit<ComponentProps<typeof Box>, 'as'> & {
  show?: boolean;
};

export function FormFieldError({ show = false, children, ...props }: FormFieldErrorProps) {
  const theme = useTheme();

  return (
    <Box
      css={css`
        display: ${show ? 'block' : 'none'};
        padding: 0 2px;
        margin-top: 4px;
        font-size: 0.85em;
        font-weight: 500;
        line-height: 1.25;
        color: ${theme.warn['500']};
      `}
      {...props}
    >
      {children}
    </Box>
  );
}

export type FormFieldProps = Omit<HTMLProps<HTMLDivElement>, 'as'> & {
  left?: ReactNode;
  right?: ReactNode;
};

const getTypeOf = (node: ReactNode) => (node as any)?.type;
const isFormFieldInput = (node: ReactNode): node is ReactElement<InputProps> =>
  getTypeOf(node) === FormFieldInput;
const isFormFieldLabel = (node: ReactNode): node is ReactElement<FormFieldLabelProps> =>
  getTypeOf(node) === FormFieldLabel;

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>((props, ref) => {
  const { left, right, children, onFocus, onBlur, ...otherProps } = props;

  const childrenArr = Children.toArray(children);
  const [leftSize, setLeftSize] = useState(0);
  const [rightSize, setRightSize] = useState(0);
  const leftRef = useResizeObserver<HTMLDivElement>((entry) => {
    setLeftSize(entry.contentRect.left + entry.contentRect.right);
  });
  const rightRef = useResizeObserver<HTMLDivElement>((entry) => {
    setRightSize(entry.contentRect.left + entry.contentRect.right);
  });

  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const { id: inputId } = useId({ baseId: 'form-field-input' });

  const childrenCounts = childrenArr.reduce<{ input: number; label: number }>(
    (counts, child) => {
      if (isFormFieldInput(child)) {
        counts.input += 1;
      }
      if (isFormFieldLabel(child)) {
        counts.label += 1;
      }

      return counts;
    },
    { input: 0, label: 0 },
  );

  if (childrenCounts.input !== 1) {
    throw new Error('"FormField" should take only one of "FormFieldInput" in children.');
  }

  if (childrenCounts.label > 1) {
    throw new Error('"FormField" should take 0 or 1 "FormFieldLabel" in children.');
  }

  return (
    <Box
      ref={ref}
      css={css`
        display: block;
        width: 100%;
        font-size: 1rem;

        & + & {
          margin-top: 12px;
        }
      `}
      {...otherProps}
    >
      {Children.map(children, (child) => {
        const labelExists = childrenCounts.label > 0;

        if (isFormFieldInput(child)) {
          return (
            <FormFieldInputWrapper
              css={css`
                border-radius: 0.25rem;
                border: 1px solid ${theme.foreground.divider};
                background-color: rgba(255, 255, 255, ${theme.isDark ? '0.1' : '0.04'});
                padding: 0.25em 0.5em;
                font-size: 0.875em;
                font-weight: 500;
                transition: box-shadow 0.15s ease-in-out 0s;
                box-shadow: ${focused ? `${theme.primary['300']} 0px 0px 0px 0.15rem` : 'none'};
              `}
              style={{
                paddingLeft: coerceCssPixelValue(leftSize),
                paddingRight: coerceCssPixelValue(rightSize),
              }}
            >
              {left != null ? (
                <FormFieldAddon ref={leftRef} type="left">
                  {left}
                </FormFieldAddon>
              ) : null}
              {cloneElement(child, {
                id: child.props.id != null ? child.props.id : labelExists ? inputId : undefined,
                onFocus(event: FocusEvent<HTMLInputElement>) {
                  setFocused(true);
                  onFocus?.(event);
                  child.props.onFocus?.(event);
                },
                onBlur(event: FocusEvent<HTMLInputElement>) {
                  setFocused(false);
                  onBlur?.(event);
                  child.props.onBlur?.(event);
                },
                css: css`
                  flex: 1 1 auto;
                  border-radius: 0;
                  border: 0;
                  background: transparent;
                  padding-top: 0;
                  padding-bottom: 0;
                  ${left != null ? 'padding-left: 0.25em' : ''};
                  ${right != null ? 'padding-right: 0.25em' : ''};
                  font-size: 1em;
                  transition: none;

                  &:focus {
                    outline: 0;
                    box-shadow: none;
                  }

                  ${child.props.css as Interpolation};
                `,
              })}
              {right != null ? (
                <FormFieldAddon ref={rightRef} type="right">
                  {right}
                </FormFieldAddon>
              ) : null}
            </FormFieldInputWrapper>
          );
        }

        if (isFormFieldLabel(child)) {
          return cloneElement(child, {
            htmlFor: child.props.htmlFor ?? inputId,
          });
        }

        return child;
      })}
    </Box>
  );
});

const FormFieldAddon = styled.div<{ type: 'left' | 'right' }>`
  position: absolute;
  ${({ type }) => type}: 0;
  top: 0;
  bottom: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.5em;
  pointer-events: none;
`;

const FormFieldInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: baseline;
`;
