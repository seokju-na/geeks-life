import { css, Global } from '@emotion/core';
import React from 'react';
import { useTheme } from '../colors/theming';

export default function GlobalStyles() {
  const theme = useTheme();

  return (
    <Global
      styles={css`
        body {
          color: ${theme.foreground.text};
        }
      `}
    />
  );
}
