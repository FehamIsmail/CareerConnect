/** @type {import('tailwindcss').Config}
 *  @type {import('tailwindcss/colors')}
 * */
const defaultColors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
      './src/**/*.{html,js,ts,tsx}',
      './src/components/**/*.{html,js,ts,tsx}',
      './src/pages/*.{html,js,ts,tsx}',
      './public/index.html',
  ],
  theme: {
    colors: {
      ...defaultColors,
      primary: "#2563eb",
      primary_dark: "#294bdd",
      secondary: "#00f6ff",
      dimWhite: "rgba(255, 255, 255, 0.7)",
      dimBlue: "rgba(9, 151, 124, 0.1)",
    },
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        '8xl': '96rem',
        '9xl': '128rem',
        '4.5': '0.9375rem',
        '13': '3.3rem',
        '2.5': '0.625rem'
      },
      dropShadow: {
        'default': [
            '0px 1px 3px rgba(0, 0, 0, 0.06)',
            '0px 1px 2px rgba(0, 0, 0, 0.22)'
          ],
      },
      boxShadow: {
        'bottom': '0px 4px 4px -4px rgba(0, 0, 0, 0.40)',
        'default': [
          '0px 1px 3px rgba(0, 0, 0, 0.08)',
          '0px 1px 2px rgba(0, 0, 0, 0.24)'
        ],
        'light': [
          '0px 1px 3px rgba(0, 0, 0, 0.03)',
          '0px 1px 2px rgba(0, 0, 0, 0.08)'
        ],
      },
      animation: {
        'type': 'typing 3s steps(40, end) infinite alternate forwards, blink 0.7s step-end infinite',
      },
      keyframes: {
        'typing': {
          'from': {
            width: 0
          },
          'to': {
            width: '100%'
          }
        },
        'blink': {
          'from, to': {
            'border-color': 'transparent'
          },
          '50%': {
            'border-color': 'white'
          }
        }
      }
    },
    backgroundImage: {
      'banner-bg': "url('/src/assets/banner_bg.png')"
    },
    screens: {
      'xs': "480px",
      'ss': "620px",
      'sm': "768px",
      'md': "1060px",
      'lg': "1200px",
      '1600': "1600px",
      'xl': "1700px",
    },

  },
  plugins: [require("tailwind-scrollbar"),
            require("@tailwindcss/forms")],
}

