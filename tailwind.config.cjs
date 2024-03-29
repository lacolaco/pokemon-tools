const createPlugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./projects/app/src/**/*.{html,ts}'],
  theme: {
    extend: {
      height: {
        'main-fill': 'calc(100dvh - 64px)',
      },
      backgroundImage: {
        'gradation-sv': 'linear-gradient(45deg, #552277, #9f2a22)',
      },
      gridTemplateRows: {
        'auto-1fr': 'auto 1fr',
        'header-main': '64px minmax(calc(100dvh - 64px), 1fr)',
      },
      gridTemplateColumns: {
        'auto-1fr': 'auto 1fr',
      },
    },
  },
  plugins: [createPlugin(({}) => {})],
};
