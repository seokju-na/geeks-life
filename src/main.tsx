import { StrictMode } from 'react';
import { render } from 'react-dom';
import App from './App';
import './global.css';
import { injectTheme } from './styles';

injectTheme();

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
);
