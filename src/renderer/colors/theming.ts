import _styled, { CreateStyled } from '@emotion/styled';
import { useTheme as useEmotionTheme } from 'emotion-theming';
import {
  BackgroundPalette,
  backgroundPalettes,
  ColorPalette,
  colorPalettes,
  ForegroundPalette,
  foregroundPalettes,
} from './palette';

export interface Theme {
  readonly primary: ColorPalette;
  readonly warn: ColorPalette;
  readonly isDark: boolean;
  readonly foreground: ForegroundPalette;
  readonly background: BackgroundPalette;
}

export const styled = _styled as CreateStyled<Theme>;

export function useTheme() {
  return useEmotionTheme<Theme>();
}

export type PropsWithTheme<T = Record<string, unknown>> = T & { theme: Theme };

export function selectColor<T = Record<string, unknown>>(
  key: Extract<keyof Theme, 'primary' | 'warn'>,
  hue: Exclude<keyof ColorPalette, 'contrast'> = 500,
  isContrast: boolean = false,
) {
  return (props: PropsWithTheme<T>) =>
    isContrast ? props.theme[key].contrast[hue] : props.theme[key][hue];
}

export function selectPrimary<T = Record<string, unknown>>(
  hue: Exclude<keyof ColorPalette, 'contrast'> = 500,
  isContrast: boolean = false,
) {
  return selectColor<T>('primary', hue, isContrast);
}

export function selectBackground<T = Record<string, unknown>>(type: keyof BackgroundPalette) {
  return (props: PropsWithTheme<T>) => props.theme.background[type];
}

export function selectForeground<T = Record<string, unknown>>(type: keyof ForegroundPalette) {
  return (props: PropsWithTheme<T>) => props.theme.foreground[type];
}

export const lightTheme: Theme = {
  primary: colorPalettes.blue,
  warn: colorPalettes.red,
  isDark: false,
  foreground: foregroundPalettes.light,
  background: backgroundPalettes.light,
};

export const darkTheme: Theme = {
  primary: colorPalettes.blue,
  warn: colorPalettes.red,
  isDark: true,
  foreground: foregroundPalettes.dark,
  background: backgroundPalettes.dark,
};
