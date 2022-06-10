import { StrictMode } from 'react';
import { render } from 'react-dom';
import { QueryClientProvider } from 'react-query';
import App from './App';
import './global.css';
import { queryClient } from './queryClient';
import { injectTheme } from './styles';

injectTheme();

render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
  document.getElementById('root')
);
