interface ColorPalette {
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
}

const gray: ColorPalette = {
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
};

const red: ColorPalette = {
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
};

const blue: ColorPalette = {
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
};

const green: ColorPalette = {
  50: '#E8F5E9',
  100: '#C8E6C9',
  200: '#A5D6A7',
  300: '#81c784',
  400: '#66bb6a',
  500: '#4caf50',
  600: '#43a047',
  700: '#388e3c',
  800: '#2e7d32',
  900: '#1b5e20',
  A100: '#b9f6ca',
  A200: '#69f0ae',
  A400: '#00e676',
  A700: '#00c853',
};

type Color = 'gray' | 'red' | 'blue' | 'green';
type ColorName = `${Color}${keyof ColorPalette}`;
type Colors = Record<ColorName, string>;

function makeColors(palettes: Record<Color, ColorPalette>): Colors {
  return Object.entries(palettes).reduce((acc, [name, palette]) => {
    Object.entries(palette).forEach(([scale, color]) => {
      const colorName = `${name}${scale}` as ColorName;
      acc[colorName] = color;
    });

    return acc;
  }, {} as Colors);
}

export const colors = makeColors({ gray, blue, red, green });
