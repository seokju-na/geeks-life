import { css, Interpolation } from '@emotion/core';
import React, {
  Children,
  cloneElement,
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
  const { id } = useId({ baseId: 'form-field-input' });

  return <Input ref={ref} id={idFromProp ?? id} {...otherProps} />;
});

export type FormFieldProps = Omit<HTMLProps<HTMLDivElement>, 'as'> & {
  left?: ReactNode;
  right?: ReactNode;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTypeOf = (node: ReactNode): symbol => (node as any)?.type?.$$typeof;
const isFormFieldInput = (node: ReactNode): node is ReactElement<InputProps> =>
  getTypeOf(node) === FormFieldInput.$$typeof;

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

  if (childrenArr.filter((child) => getTypeOf(child) === FormFieldInput.$$typeof).length !== 1) {
    throw new Error('"FormField" should take only one of "Input" or "FormFieldInput" in children.');
  }

  return (
    <Box
      ref={ref}
      css={css`
        display: block;
        width: 100%;
        font-size: 1rem;
      `}
      {...otherProps}
    >
      {Children.map(children, (child) =>
        isFormFieldInput(child) ? (
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
              // _noStyle: true,
              css: css`
                border-radius: 0;
                border: 0;
                background: transparent;
                padding: 0.25em;
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
        ) : (
          child
        ),
      )}
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
