import { css } from '@emotion/core';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Toolbar, ToolbarItem, unstable_useId as useId, useToolbarState } from 'reakit';
import { ipcChannels, LoadDailyLifeModifiedFlagResponse, Nullable } from '../../core';
import { selectForeground, styled, useTheme } from '../colors/theming';
import { Button } from '../components/Button';
import useIpcListener from '../hooks/useIpcListener';
import { actions } from '../store/actions';
import { selectors } from '../store/selectors';

export default function FixedBottomToolbar() {
  const dispatch = useDispatch();
  const modified = useSelector(selectors.modifiedAtDate);
  const committing = useSelector(selectors.committing);
  const { id } = useId({
    baseId: 'gl-select-day-toolbar',
  });
  const date = useSelector(selectors.date);
  const theme = useTheme();
  const toolbar = useToolbarState({ loop: true });

  const title = useMemo(() => {
    const dateStr = format(new Date(date), 'd MMM, yyyy');

    return modified === true
      ? `Changes at ${dateStr}`
      : modified === false
      ? `No Changes at ${dateStr}`
      : dateStr;
  }, [date, modified]);

  const handleDailyLifeModifiedFlagResponse = useCallback(
    (payload: Nullable<LoadDailyLifeModifiedFlagResponse>) => {
      if (payload != null) {
        dispatch(actions.updateDailyLifeModifiedFlag(payload));
      }
    },
    [dispatch],
  );

  useIpcListener<LoadDailyLifeModifiedFlagResponse>(
    ipcChannels.loadDailyLifeModifiedFlagResponse,
    handleDailyLifeModifiedFlagResponse,
  );

  const handleDailyLifeSaveResponse = useCallback(() => {
    dispatch(actions.requestDailyLifeModifiedFlag());
  }, [dispatch]);

  useIpcListener(ipcChannels.saveDailyLifeResponse, handleDailyLifeSaveResponse);

  useEffect(() => {
    dispatch(actions.requestDailyLifeModifiedFlag());
  }, [dispatch]);

  const handleCommitButtonClick = useCallback(() => {
    dispatch(actions.commitDailyLife.request());
  }, [dispatch]);

  return (
    <Toolbar
      {...toolbar}
      aria-labelledby={id}
      css={css`
        ${toolbarCss};
        background-color: ${theme.background.backgroundHighlighted};
      `}
    >
      <Title id={id}>{title}</Title>
      <ToolbarItem
        {...toolbar}
        as={Button}
        size="tiny"
        color="primary"
        disabled={modified !== true || committing}
        onClick={handleCommitButtonClick}
      >
        Commit (⌘+S)
      </ToolbarItem>
    </Toolbar>
  );
}

const toolbarCss = css`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 4px 4px 4px 12px;
  justify-content: space-between;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${selectForeground('text')};
`;
