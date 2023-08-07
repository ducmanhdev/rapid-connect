/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    container: {
      center: true,
      padding: '20px',
      screens: {
        sm: '100%',
        md: '100%',
        lg: '100%',
        xl: '100%',
        '2xl': '100%',
      },
    },
    extend: {
      aspectRatio: {
        auto: 'auto',
        square: '1 / 1',
        video: '16 / 9',
      },
      fontSize: {
        tiny: '.625rem',
      },
      colors: {
        primary: 'var(--color-primary)',
        'primary-lighter': 'var(--color-primary-lighter)',
        secondary: 'var(--color-secondary)',
        error: 'var(--color-error)',
        CF0: 'var(--color-CF0)',
        CEF: 'var(--color-CEF)',
        CD1: 'var(--color-CD1)',
        C87: 'var(--color-C87)',
        C82: 'var(--color-C82)',
        CEC: 'var(--color-CEC)',
        CFFE: 'var(--color-CFFE)',
        C27: 'var(--color-C27)',
        C1F: 'var(--color-C1F)',
        CE9: 'var(--color-CE9)',
        CEFF: 'var(--color-CEFF)',
        CD9: 'var(--color-CD9)',
        C279: 'var(--color-C279)',
        CF5: 'var(--color-CF5)',
      },
      borderColor: {
        DEFAULT: 'var(--color-CD1)',
        primary: 'var(--color-primary)',
        error: 'var(--color-error)',
        C82: 'var(--color-C82)',
      },
      divideColor: {
        CE6: 'var(--color-CE6)',
        C82: 'var(--color-C82)',
      },
      boxShadow: {
        DEFAULT: 'var(--base-box-shadow)',
        lg: 'var(--lg-box-shadow)',
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
    function ({addVariant}) {
      addVariant('child', '& > *');
      addVariant('child-hover', '& > *:hover');
      addVariant('child-focus', '& > *:focus');
      addVariant('child-active', '& > *:active');
    },
  ],
};
