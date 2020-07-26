import { Nullable, ValueOf } from '../../core';

export function isEmptyValue(value: Nullable<string>, trim = true) {
  if (value == null) {
    return true;
  }

  value = trim ? value.trim() : value;

  return value.length === 0;
}

export type ValidationError = { [errorCode: string]: true };
export type ValidationFn<T = string, Options = never> = (
  value: Nullable<T>,
  options?: Options,
) => ValidationError | null;

export const commonValidationErrorCodes = {
  invalidEmail: 'invalid-email',
} as const;

export type CommonValidationErrorCode = ValueOf<typeof commonValidationErrorCodes>;

/**
 * https://github.com/angular/angular.js/commit/f3f5cf72e
 */
const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const validateEmail: ValidationFn = (value) => {
  if (value == null || isEmptyValue(value)) {
    return null;
  }

  return !EMAIL_REGEXP.test(value)
    ? {
        [commonValidationErrorCodes.invalidEmail]: true,
      }
    : null;
};
