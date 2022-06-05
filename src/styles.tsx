import { createStitches } from '@stitches/react';
import { detectDarkMode } from './utils/detectDarkMode';
import { colors } from './colors';

const { styled, createTheme } = createStitches({
  theme: {
    colors: {
      ...colors,
      background: '#f3f3f3',
      backgroundHighlighted: 'white',
      hover: 'rgba(0,0,0, 0.04)',
      divider: 'rgba(0,0,0, 0.12)',
      icon: 'rgba(0,0,0, 0.54)',
      text: 'rgba(0,0,0, 0.87)',
      raisedButton: 'white',
      selectedButton: colors.gray300,
      selectedDisabledButton: colors.gray400,
      focusRing: colors.blue500,
    },
    space: {
      xs: '2px',
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
    },
    fontSizes: {
      xs: '11px',
      sm: '12px',
      md: '14px',
      lg: '16px',
      xl: '20px',
    },
    lineHeights: {
      condensed: 1.2,
      normal: 1.4,
    },
    fontWeights: {
      light: 300,
      regular: 400,
      semibold: 500,
      bold: 700,
    },
    radii: {
      normal: '0.25rem',
    },
  },
});

export { styled };
export const darkTheme = createTheme('dark-theme', {
  colors: {
    background: '#303030',
    backgroundHighlighted: colors.gray800,
    hover: 'rgba(255,255,255, 0.04)',
    divider: 'rgba(255,255,255, 0.12)',
    icon: 'white',
    text: 'white',
    raisedButton: colors.gray800,
    selectedButton: colors.gray900,
    selectedDisabledButton: colors.gray800,
  },
});

/** Injects theme css class to document. */
export function injectTheme() {
  const bodyEl = document.body;

  const detects = detectDarkMode();
  if (detects.isDarkMode) {
    bodyEl.classList.add(darkTheme);
  }

  detects.listen(isDarkMode => {
    if (isDarkMode) {
      addCssClass(bodyEl, darkTheme);
    } else {
      removeCssClass(bodyEl, darkTheme);
    }
  });
}

function addCssClass(el: HTMLElement, cssClass: string) {
  if (!el.classList.contains(cssClass)) {
    el.classList.add(cssClass);
  }
}

function removeCssClass(el: HTMLElement, cssClass: string) {
  if (el.classList.contains(cssClass)) {
    el.classList.remove(cssClass);
  }
}
