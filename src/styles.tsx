import { createStitches } from '@stitches/react';
import { blue, blueDark, grass, grassDark, gray, grayDark, red, redDark } from '@radix-ui/colors';
import { detectDarkMode } from './utils/detectDarkMode';

const { styled, createTheme } = createStitches({
  theme: {
    colors: {
      ...gray,
      ...blue,
      ...red,
      ...grass,
    },
    space: {
      xs: 2,
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
    },
  },
});

export { styled };
export const darkTheme = createTheme('dark-theme', {
  colors: {
    ...grayDark,
    ...blueDark,
    ...redDark,
    ...grassDark,
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
