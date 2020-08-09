import { css } from '@emotion/core';
import React, { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDialogState } from 'reakit';
import { CommitDailyLifeErrorCode } from '../../core';
import { selectColor, styled } from '../colors/theming';
import { Button } from '../components/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogHead,
  DialogTitle,
} from '../components/Dialog';
import { FormField, FormFieldError, FormFieldInput, FormFieldLabel } from '../components/Form';
import { actions } from '../store/actions';
import { selectors } from '../store/selectors';
import {
  commonValidationErrorCodes,
  isEmptyValue,
  validateEmail,
  ValidationError,
} from '../utils/validation';

export default function GitUserSettingDialog() {
  const dispatch = useDispatch();
  const commitErrorCode = useSelector(selectors.commitErrorCode);
  const dialog = useDialogState({ animated: true });

  const nameInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const handleNameInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }, []);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<ValidationError | null>(null);
  const handleEmailInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setEmail(value);
    setEmailError(validateEmail(value));
  }, []);

  const [firstSubmit, setFirstSubmit] = useState(true);
  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setFirstSubmit(true);

      if (isEmptyValue(name) || isEmptyValue(email) || emailError !== null) {
        return;
      }

      dispatch(actions.gitUserConfigSetting.request({ name, email }));
    },
    [name, email, emailError, dispatch],
  );

  useEffect(() => {
    if (dialog.visible) {
      nameInputRef.current?.focus();
    }
  }, [dialog.visible]);

  useEffect(() => {
    if (!dialog.visible) {
      dispatch(actions.gitUserConfigSetting.dismiss());
    }
  }, [dialog.visible, dispatch]);

  useEffect(() => {
    if (commitErrorCode === CommitDailyLifeErrorCode.MissingNameError) {
      dialog.show();
    } else {
      dialog.hide();
    }
  }, [commitErrorCode, dialog]);

  return (
    <Dialog
      dialog={dialog}
      hideOnClickOutside={false}
      css={css`
        width: 85vw;
        max-width: 320px;
      `}
    >
      <DialogHead>
        <DialogTitle>Git User Config</DialogTitle>
      </DialogHead>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <ErrorContent>User config must be set before committing.</ErrorContent>
          <FormField>
            <FormFieldLabel>Name</FormFieldLabel>
            <FormFieldInput
              ref={nameInputRef}
              value={name}
              onChange={handleNameInput}
              autoComplete="name"
              placeholder="Git user name"
              maxLength={100}
            />
          </FormField>
          <FormField>
            <FormFieldLabel>Email</FormFieldLabel>
            <FormFieldInput
              autoComplete="email"
              type="email"
              value={email}
              onChange={handleEmailInput}
              placeholder="Git user email"
              maxLength={100}
            />
            <FormFieldError
              show={!firstSubmit && emailError?.[commonValidationErrorCodes.invalidEmail]}
            >
              Invalid email
            </FormFieldError>
          </FormField>
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={dialog.hide}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="small"
            color="primary"
            disabled={
              isEmptyValue(name) || isEmptyValue(email) || (!firstSubmit && emailError !== null)
            }
          >
            Confirm
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

const ErrorContent = styled.p`
  margin: 0 0 8px 0;
  font-size: 0.85rem;
  font-weight: 400;
  line-height: 1.5;
  color: ${selectColor('warn')};
`;
