/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg:        '#15101A',
        surface:   '#1E1822',
        surfaceHi: '#2A2230',
        text:      '#F5E6D3',
        textMid:   '#C9B8A8',
        textDim:   '#9A8A85',
        rose:      '#E8B4B8',
        roseDeep:  '#C97B82',
        gold:      '#D4AF8F',
        success:   '#9BB89A',
      },
      fontFamily: {
        serif: ['CormorantGaramond_500Medium'],
        'serif-italic': ['CormorantGaramond_500Medium_Italic'],
        sans: ['Inter_400Regular'],
        'sans-medium': ['Inter_500Medium'],
        'sans-bold': ['Inter_600SemiBold'],
      },
    },
  },
  plugins: [],
};
