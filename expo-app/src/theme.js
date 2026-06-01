// Design tokens — matches the web prototype exactly.

export const colors = {
  forest:    '#2f4a36',
  moss:      '#4d6b50',
  sage:      '#86a083',
  cream:     '#f1e8d6',
  paper:     '#fbf6ea',
  card:      '#fffdf7',
  terra:     '#c25a3a',
  terraDeep: '#a8472b',
  clay:      '#d98e6a',
  gold:      '#d8a441',
  ink:       '#2b2a26',
  muted:     '#7d7763',
  line:      'rgba(47,74,54,0.12)',
  lineSoft:  'rgba(47,74,54,0.07)',
  white:     '#ffffff',
};

export const fonts = {
  serif:   'DMSerifDisplay_400Regular',
  serifI:  'DMSerifDisplay_400Regular_Italic',
  sans:    'HankenGrotesk_400Regular',
  sansMd:  'HankenGrotesk_500Medium',
  sansSb:  'HankenGrotesk_600SemiBold',
  sansBd:  'HankenGrotesk_700Bold',
  sansEb:  'HankenGrotesk_800ExtraBold',
};

export const radius = {
  xs:   8,
  sm:   12,
  md:   16,
  lg:   22,
  pill: 999,
};

export const shadow = {
  card: {
    shadowColor: '#2b2a26',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cover: {
    shadowColor: '#2b2a26',
    shadowOffset: { width: -3, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 6,
  },
  cta: {
    shadowColor: '#c25a3a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 18,
    elevation: 8,
  },
  tab: {
    shadowColor: '#2b2a26',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 26,
    elevation: 10,
  },
};

export const spacing = {
  xs:  6,
  sm:  10,
  md:  18,
  lg:  24,
  xl:  32,
};
