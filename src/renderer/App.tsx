import DayLogsSection from 'components/DayLogsSection';
import { ThemeProvider } from 'emotion-theming';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Provider as ReakitProvider } from 'reakit';
import { ipcChannels } from '../core';
import { darkTheme, lightTheme, styled } from './colors/theming';
import DateNavigator from './components/DateNavigator';
import DayScoreSection from './components/DayScoreSection';
import FixedBottomToolbar from './components/FixedBottomToolbar';
import GlobalStyles from './components/GlobalStyles';
import { eventKeys } from './constants/event-keys';
import { sendIpcMessage } from './hooks/useIpcListener';
import useKeyboardCapture from './hooks/useKeyboardCapture';
import useResizeObserver from './hooks/useResizeObserver';

const isHTMLElement = (elem: Node): elem is HTMLElement => elem.nodeType === Node.ELEMENT_NODE;

export default function App() {
  const darkMode = useMemo(() => location.search.includes('?theme=dark'), []);

  const ref = useResizeObserver<HTMLDivElement>(() => {
    // console.log(entry);
  });

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

  return (
    <ReakitProvider>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <GlobalStyles />
        <Root ref={ref} tabIndex={0}>
          <DateNavigator />
          <DayScoreSection />
          <DayLogsSection />
          <FixedBottomToolbar />
        </Root>
      </ThemeProvider>
    </ReakitProvider>
  );
}

const Root = styled.div`
  outline: 0;
  overflow: visible;
  width: 100%;
`;
