/** Палитра общая с веб-клиентом. */
export const Colors = {
  light: {
    text: '#17291F',
    textSecondary: '#586A60',
    /** Фон экранов. */
    canvas: '#F6F8F4',
    /** Фон карточек и плавающих панелей. */
    background: '#FFFFFF',
    /** Вложенные плашки внутри карточек: поля, плитки КБЖУ. */
    surface: '#F1F5F0',
    border: '#DCE5DB',
    primary: '#176B44',
    onPrimary: '#FFFFFF',
    /** Мягкая подложка акцента: выбранные чипы, иконки, бейджи. */
    tint: '#E6F3E8',
    danger: '#B91C1C',
    dangerTint: '#FBEAEA',
    warning: '#92400E',
    warm: '#FFF6E6',
    star: '#E8A317',
  },
  dark: {
    text: '#EDF5EF',
    textSecondary: '#A8BAAE',
    canvas: '#101A14',
    background: '#18231D',
    surface: '#202E26',
    border: '#34493B',
    primary: '#86DBA3',
    onPrimary: '#112017',
    tint: '#233D2D',
    danger: '#F87171',
    dangerTint: '#3A1F1F',
    warning: '#FBBF24',
    warm: '#272113',
    star: '#F5C451',
  },
} as const;

export type ThemeColors = { [K in keyof typeof Colors.light]: string };
export type ThemeColor = keyof ThemeColors;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

/** Начертания Manrope; загружаются в AppProviders до скрытия сплэша. */
export const Fonts = {
  medium: 'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  extrabold: 'Manrope_800ExtraBold',
} as const;

/** Тень плавающих элементов поверх карты. */
export const Elevation = {
  shadowColor: '#193329',
  shadowOpacity: 0.14,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 6 },
  elevation: 5,
} as const;
