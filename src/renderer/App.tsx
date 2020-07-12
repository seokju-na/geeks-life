import { ThemeProvider } from 'emotion-theming';
import React, { useEffect } from 'react';
import { Provider as ReakitProvider } from 'reakit';
import { darkTheme, styled } from './colors/theming';
import { Button } from './components/Button';
import { ButtonToggle, ButtonToggleGroup } from './components/ButtonToggle';
import GlobalStyles from './components/GlobalStyles';
import { eventKeys } from './constants/event-keys';
import useKeyboardCapture from './hooks/useKeyboardCapture';
import useResizeObserver from './hooks/useResizeObserver';

export default function App() {
  const ref = useResizeObserver<HTMLDivElement>((entry) => {
    console.log(entry);
  });

  useKeyboardCapture(eventKeys.ESC, (event) => {
    const { activeElement } = document;
    console.log(activeElement);

    if (
      activeElement === null ||
      activeElement === ref.current ||
      activeElement === document.body
    ) {
      event.preventDefault();
      window.electronFeatures?.ipcRenderer.send('close-current-window');
    }
  });

  useEffect(() => {
    ref.current?.focus();
  }, [ref]);

  return (
    <ReakitProvider>
      <ThemeProvider theme={darkTheme}>
        <GlobalStyles />
        <Root ref={ref} tabIndex={-1}>
          <Header>
            <div>1st Week July, 2020</div>
            <ButtonToggleGroup name="보기" aria-label="보기" size="small" value="week">
              <ButtonToggle value="week">Week</ButtonToggle>
              <ButtonToggle value="month">Month</ButtonToggle>
            </ButtonToggleGroup>
          </Header>
          <Content>
            <div>
              <Button color="primary">Button</Button>
            </div>
          </Content>
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

const Header = styled.header`
  width: 100%;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Content = styled.main`
  padding: 12px 16px;
`;
