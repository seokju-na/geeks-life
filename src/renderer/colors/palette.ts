// Color palettes from the Material Design spec.
// See https://material.io/design/color/
//
// Contrast colors are hard-coded because it is too difficult (probably impossible) to
// calculate them. These contrast colors are pulled from the public Material Design spec swatches.
// While the contrast colors in the spec are not prescriptive, we use them for convenience.

// Source from
// https://github.com/angular/components/blob/master/src/material/core/theming/_palette.scss

export const commonColors = {
  white: '#ffffff',
  black: '#000000',
  darkPrimaryText: 'rgba(0,0,0, 0.87)',
  darkSecondaryText: 'rgba(0,0,0, 0.54)',
  darkDisabledText: 'rgba(0,0,0, 0.38)',
  darkDividers: 'rgba(0,0,0, 0.12)',
  darkFocused: 'rgba(0,0,0, 0.12)',
  lightPrimaryText: 'white',
  lightSecondaryText: 'rgba(255,255,255, 0.7)',
  lightDisabledText: 'rgba(255,255,255, 0.5)',
  lightDividers: 'rgba(255,255,255, 0.12)',
  lightFocused: 'rgba(255,255,255, 0.12)',
} as const;

export interface ColorPalette {
  readonly 50: string;
  readonly 100: string;
  readonly 200: string;
  readonly 300: string;
  readonly 400: string;
  readonly 500: string;
  readonly 600: string;
  readonly 700: string;
  readonly 800: string;
  readonly 900: string;
  readonly A100: string;
  readonly A200: string;
  readonly A400: string;
  readonly A700: string;
  readonly contrast: Omit<ColorPalette, 'contrast'>;
}

export const greyColorPalette: ColorPalette = {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#eeeeee',
  300: '#e0e0e0',
  400: '#bdbdbd',
  500: '#9e9e9e',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
  A100: '#ffffff',
  A200: '#eeeeee',
  A400: '#bdbdbd',
  A700: '#616161',
  contrast: {
    50: commonColors.darkPrimaryText,
    100: commonColors.darkPrimaryText,
    200: commonColors.darkPrimaryText,
    300: commonColors.darkPrimaryText,
    400: commonColors.darkPrimaryText,
    500: commonColors.darkPrimaryText,
    600: commonColors.lightPrimaryText,
    700: commonColors.lightPrimaryText,
    800: commonColors.lightPrimaryText,
    900: commonColors.lightPrimaryText,
    A100: commonColors.darkPrimaryText,
    A200: commonColors.darkPrimaryText,
    A400: commonColors.darkPrimaryText,
    A700: commonColors.lightPrimaryText,
  },
};

export const redColorPalette: ColorPalette = {
  50: '#ffebee',
  100: '#ffcdd2',
  200: '#ef9a9a',
  300: '#e57373',
  400: '#ef5350',
  500: '#f44336',
  600: '#e53935',
  700: '#d32f2f',
  800: '#c62828',
  900: '#b71c1c',
  A100: '#ff8a80',
  A200: '#ff5252',
  A400: '#ff1744',
  A700: '#d50000',
  contrast: {
    50: commonColors.darkPrimaryText,
    100: commonColors.darkPrimaryText,
    200: commonColors.darkPrimaryText,
    300: commonColors.darkPrimaryText,
    400: commonColors.darkPrimaryText,
    500: commonColors.lightPrimaryText,
    600: commonColors.lightPrimaryText,
    700: commonColors.lightPrimaryText,
    800: commonColors.lightPrimaryText,
    900: commonColors.lightPrimaryText,
    A100: commonColors.darkPrimaryText,
    A200: commonColors.lightPrimaryText,
    A400: commonColors.lightPrimaryText,
    A700: commonColors.lightPrimaryText,
  },
};

export const pinkColorPalette: ColorPalette = {
  50: '#fce4ec',
  100: '#f8bbd0',
  200: '#f48fb1',
  300: '#f06292',
  400: '#ec407a',
  500: '#e91e63',
  600: '#d81b60',
  700: '#c2185b',
  800: '#ad1457',
  900: '#880e4f',
  A100: '#ff80ab',
  A200: '#ff4081',
  A400: '#f50057',
  A700: '#c51162',
  contrast: {
    50: commonColors.darkPrimaryText,
    100: commonColors.darkPrimaryText,
    200: commonColors.darkPrimaryText,
    300: commonColors.darkPrimaryText,
    400: commonColors.darkPrimaryText,
    500: commonColors.lightPrimaryText,
    600: commonColors.lightPrimaryText,
    700: commonColors.lightPrimaryText,
    800: commonColors.lightPrimaryText,
    900: commonColors.lightPrimaryText,
    A100: commonColors.darkPrimaryText,
    A200: commonColors.lightPrimaryText,
    A400: commonColors.lightPrimaryText,
    A700: commonColors.lightPrimaryText,
  },
};

export const purpleColorPalette: ColorPalette = {
  50: '#f3e5f5',
  100: '#e1bee7',
  200: '#ce93d8',
  300: '#ba68c8',
  400: '#ab47bc',
  500: '#9c27b0',
  600: '#8e24aa',
  700: '#7b1fa2',
  800: '#6a1b9a',
  900: '#4a148c',
  A100: '#ea80fc',
  A200: '#e040fb',
  A400: '#d500f9',
  A700: '#aa00ff',
  contrast: {
    50: commonColors.darkPrimaryText,
    100: commonColors.darkPrimaryText,
    200: commonColors.darkPrimaryText,
    300: commonColors.lightPrimaryText,
    400: commonColors.lightPrimaryText,
    500: commonColors.lightPrimaryText,
    600: commonColors.lightPrimaryText,
    700: commonColors.lightPrimaryText,
    800: commonColors.lightPrimaryText,
    900: commonColors.lightPrimaryText,
    A100: commonColors.darkPrimaryText,
    A200: commonColors.lightPrimaryText,
    A400: commonColors.lightPrimaryText,
    A700: commonColors.lightPrimaryText,
  },
};

export const blueColorPalette: ColorPalette = {
  50: '#e3f2fd',
  100: '#bbdefb',
  200: '#90caf9',
  300: '#64b5f6',
  400: '#42a5f5',
  500: '#2196f3',
  600: '#1e88e5',
  700: '#1976d2',
  800: '#1565c0',
  900: '#0d47a1',
  A100: '#82b1ff',
  A200: '#448aff',
  A400: '#2979ff',
  A700: '#2962ff',
  contrast: {
    50: commonColors.darkPrimaryText,
    100: commonColors.darkPrimaryText,
    200: commonColors.darkPrimaryText,
    300: commonColors.darkPrimaryText,
    400: commonColors.darkPrimaryText,
    500: commonColors.lightPrimaryText,
    600: commonColors.lightPrimaryText,
    700: commonColors.lightPrimaryText,
    800: commonColors.lightPrimaryText,
    900: commonColors.lightPrimaryText,
    A100: commonColors.darkPrimaryText,
    A200: commonColors.lightPrimaryText,
    A400: commonColors.lightPrimaryText,
    A700: commonColors.lightPrimaryText,
  },
};

export const colorPalettes = {
  grey: greyColorPalette,
  red: redColorPalette,
  pink: pinkColorPalette,
  purple: purpleColorPalette,
  blue: blueColorPalette,
} as const;

export interface BackgroundPalette {
  readonly statusBar: string;
  readonly appBar: string;
  readonly background: string;
  readonly backgroundHighlighted: string;
  readonly hover: string;
  readonly card: string;
  readonly dialog: string;
  readonly disabledButton: string;
  readonly raisedButton: string;
  readonly focusedButton: string;
  readonly selectedButton: string;
  readonly selectedDisabledButton: string;
  readonly disabledButtonToggle: string;
  readonly unselectedChip: string;
  readonly disabledListOption: string;
}

export const lightBackgroundPalette: BackgroundPalette = {
  statusBar: greyColorPalette[300],
  appBar: greyColorPalette[100],
  background: '#f3f3f3',
  backgroundHighlighted: 'white',
  hover: 'rgba(0,0,0, 0.04)',
  card: 'white',
  dialog: 'white',
  disabledButton: 'rgba(0,0,0, 0.12)',
  raisedButton: 'white',
  focusedButton: commonColors.darkFocused,
  selectedButton: greyColorPalette[300],
  selectedDisabledButton: greyColorPalette[400],
  disabledButtonToggle: greyColorPalette[200],
  unselectedChip: greyColorPalette[300],
  disabledListOption: greyColorPalette[200],
};

export const darkBackgroundPalette: BackgroundPalette = {
  statusBar: 'black',
  appBar: greyColorPalette[900],
  background: '#303030',
  backgroundHighlighted: greyColorPalette[800],
  hover: 'rgba(255,255,255, 0.04)',
  card: greyColorPalette[800],
  dialog: greyColorPalette[800],
  disabledButton: 'rgba(255,255,255, 0.12)',
  raisedButton: greyColorPalette[800],
  focusedButton: commonColors.lightFocused,
  selectedButton: greyColorPalette[900],
  selectedDisabledButton: greyColorPalette[800],
  disabledButtonToggle: 'black',
  unselectedChip: greyColorPalette[700],
  disabledListOption: 'black',
};

export const backgroundPalettes = {
  light: lightBackgroundPalette,
  dark: darkBackgroundPalette,
} as const;

export interface ForegroundPalette {
  readonly base: string;
  readonly divider: string;
  readonly disabled: string;
  readonly disabledButton: string;
  readonly disabledText: string;
  readonly hintText: string;
  readonly secondaryText: string;
  readonly icon: string;
  readonly text: string;
}

export const lightForegroundPalette: ForegroundPalette = {
  base: 'black',
  divider: commonColors.darkDividers,
  disabled: commonColors.darkDisabledText,
  disabledButton: 'rgba(0,0,0, 0.26)',
  disabledText: commonColors.darkDisabledText,
  hintText: commonColors.darkDisabledText,
  secondaryText: commonColors.darkSecondaryText,
  icon: 'rgba(0,0,0, 0.54)',
  text: 'rgba(0,0,0, 0.87)',
};

export const darkForegroundPalette: ForegroundPalette = {
  base: 'white',
  divider: commonColors.lightDividers,
  disabled: commonColors.lightDisabledText,
  disabledButton: 'rgba(255,255,255, 0.3)',
  disabledText: commonColors.lightDisabledText,
  hintText: commonColors.lightDisabledText,
  secondaryText: commonColors.lightSecondaryText,
  icon: 'white',
  text: 'white',
};

export const foregroundPalettes = {
  light: lightForegroundPalette,
  dark: darkForegroundPalette,
} as const;
