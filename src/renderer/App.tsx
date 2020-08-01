import { css } from '@emotion/core';
import DailyLogsSection from 'containers/DailyLogsSection';
import { ThemeProvider } from 'emotion-theming';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider as ReakitProvider } from 'reakit';
import {
  ipcChannels,
  LoadDailyLifeModifiedFlagResponse,
  LoadDailyLifeResponse,
  Nullable,
  WindowSizeChangedPayload,
} from '../core';
import { darkTheme, lightTheme, styled } from './colors/theming';
import GlobalStyles from './components/GlobalStyles';
import { eventKeys } from './constants/event-keys';
import DateSelect from './containers/DateSelect';
import DayScoreSection from './containers/DayScoreSection';
import FixedBottomToolbar from './containers/FixedBottomToolbar';
import GitUserSettingDialog from './containers/GitUserSettingDialog';
import useIpcListener, { sendIpcMessage } from './hooks/useIpcListener';
import useKeyboardCapture from './hooks/useKeyboardCapture';
import useResizeObserver from './hooks/useResizeObserver';
import { actions } from './store/actions';
import { withStore } from './store/connection';
import { selectors } from './store/selectors';
import { DateDisplayType } from './store/state';

const isHTMLElement = (elem: Node): elem is HTMLElement => elem.nodeType === Node.ELEMENT_NODE;

function App() {
  const dispatch = useDispatch();
  const dateDisplayType = useSelector(selectors.dateDisplayType);
  const darkMode = useMemo(() => location.search.includes('?theme=dark'), []);
  const handleResize = useCallback(
    (entry: ResizeObserverEntry) => {
      const { height } = entry.target.getBoundingClientRect();

      if (dateDisplayType === DateDisplayType.Monthly) {
        sendIpcMessage<WindowSizeChangedPayload>(ipcChannels.windowSizeChanged, {
          height,
        });
      }
    },
    [dateDisplayType],
  );

  const ref = useResizeObserver<HTMLDivElement>(handleResize);

  useEffect(() => {
    if (ref.current !== null && dateDisplayType === DateDisplayType.Weekly) {
      // FIXME LATER
      sendIpcMessage<WindowSizeChangedPayload>(ipcChannels.windowSizeChanged, {
        height: 480,
      });
    }
  }, [ref, dateDisplayType]);

  const handleESCKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const { activeElement } = document;

      // Close current window when focus lost.
      if (
        activeElement === null ||
        activeElement === ref.current ||
        activeElement === document.body
      ) {
        event.preventDefault();
        sendIpcMessage(ipcChannels.closeCurrentWindow);
      } else if (activeElement != null && isHTMLElement(activeElement)) {
        event.preventDefault();
        activeElement.blur();
      }
    },
    [ref],
  );

  useKeyboardCapture(eventKeys.ESC, handleESCKeyPress);

  useEffect(() => {
    ref.current?.focus();
  }, [ref]);

  useEffect(() => {
    dispatch(actions.emojis.request());
    dispatch(actions.dailyLogCategories.request());
    dispatch(actions.requestDailyLife());
    dispatch(actions.requestDailyLifeModifiedFlag());
  }, [dispatch]);

  const handleDailyLogResponse = useCallback(
    (payload: Nullable<LoadDailyLifeResponse>) => {
      if (payload != null) {
        dispatch(actions.updateDailyLife({ payload }));
      }
    },
    [dispatch],
  );

  const handleDailyLifeModifiedFlagResponse = useCallback(
    (payload: Nullable<LoadDailyLifeModifiedFlagResponse>) => {
      if (payload != null) {
        dispatch(actions.updateDailyLifeModifiedFlag(payload));
      }
    },
    [dispatch],
  );

  const handleDailyLifeSaveResponse = useCallback(() => {
    dispatch(actions.requestDailyLifeModifiedFlag());
  }, [dispatch]);

  useIpcListener<LoadDailyLifeResponse>(ipcChannels.loadDailyLifeResponse, handleDailyLogResponse);
  useIpcListener<LoadDailyLifeModifiedFlagResponse>(
    ipcChannels.loadDailyLifeModifiedFlagResponse,
    handleDailyLifeModifiedFlagResponse,
  );
  useIpcListener(ipcChannels.saveDailyLifeResponse, handleDailyLifeSaveResponse);

  const showOnlyDateSelect = dateDisplayType !== DateDisplayType.Monthly;

  return (
    <ReakitProvider>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <GlobalStyles />
        <Main ref={ref} tabIndex={0} fitWindowSize={showOnlyDateSelect}>
          <DateSelect css={flexNone} showBorder={!showOnlyDateSelect} />
          {showOnlyDateSelect ? (
            <>
              <DayScoreSection css={flexNone} />
              <DailyLogsSection css={flexFull} />
              <FixedBottomToolbar />
            </>
          ) : null}
        </Main>
        <GitUserSettingDialog />
      </ThemeProvider>
    </ReakitProvider>
  );
}

export default withStore(App);

const Main = styled.div<{ fitWindowSize: boolean }>`
  outline: 0;
  overflow: visible;
  width: 100%;
  ${({ fitWindowSize }) => (fitWindowSize ? `height: 100%` : '')};
  display: flex;
  flex-direction: column;
`;

const flexNone = css`
  flex: none;
`;

const flexFull = css`
  flex: 1 1 auto;
`;
