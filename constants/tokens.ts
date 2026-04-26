// constants/tokens.ts — design system extracted from prototype

export const colors = {
  bg:        '#15101A',
  surface:   '#1E1822',
  surfaceHi: '#2A2230',
  line:      'rgba(245,230,211,0.08)',
  lineStrong:'rgba(245,230,211,0.16)',

  text:      '#F5E6D3',
  textMid:   '#C9B8A8',
  textDim:   '#9A8A85',
  textFaint: '#5E5359',

  rose:      '#E8B4B8',
  roseDeep:  '#C97B82',
  roseSoft:  'rgba(232,180,184,0.14)',
  gold:      '#D4AF8F',
  goldSoft:  'rgba(212,175,143,0.18)',

  success:   '#9BB89A',
  ink:       '#1A1418',  // on-rose / on-gold
} as const;

export const fonts = {
  serif:        'CormorantGaramond_500Medium',
  serifItalic:  'CormorantGaramond_500Medium_Italic',
  sans:         'Inter_400Regular',
  sansMedium:   'Inter_500Medium',
  sansBold:     'Inter_600SemiBold',
} as const;

export const radii = {
  sm: 8, md: 14, lg: 20, xl: 28, pill: 999,
} as const;

export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 22, xxl: 32,
} as const;

export type Color = keyof typeof colors;
