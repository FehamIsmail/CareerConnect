/** @type {import('tailwindcss').Config}
 *  @type {import('tailwindcss/colors')}
 * */
const defaultColors = require('tailwindcss/colors');

module.exports = {
  content: [
      './src/**/*.{html,js,ts,tsx}',
      './src/components/**/*.{html,js,ts,tsx}',
      './public/index.html',
  ],
  theme: {
    colors: {
      ...defaultColors,
      primary: "#00040f",
      secondary: "#00f6ff",
      dimWhite: "rgba(255, 255, 255, 0.7)",
      dimBlue: "rgba(9, 151, 124, 0.1)",
    },
    extend: {
      spacing: {
        '8xl': '96rem',
        '9xl': '128rem',
        '8': '1.75rem'
      },
    },
    screens: {
      'xs': "480px",
      'ss': "620px",
      'sm': "768px",
      'md': "1060px",
      'lg': "1200px",
      'xl': "1700px",
    },
  },
  plugins: [],
}
