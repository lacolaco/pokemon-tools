/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./projects/app/src/**/*.{html,ts,scss}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradation-sv': 'linear-gradient(45deg, #552277, #9f2a22)',
      },
      gridTemplateRows: {
        'auto-1fr': 'auto 1fr',
        layout: 'auto 1fr auto',
      },
      gridTemplateColumns: {
        'auto-1fr': 'auto 1fr',
      },
    },
  },
  plugins: [],
};
