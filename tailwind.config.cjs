/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./projects/app/src/**/*.{html,ts,scss}'],
  theme: {
    extend: {
      gridTemplateRows: {
        'auto-1fr': 'auto 1fr',
      },
      gridTemplateColumns: {
        'auto-1fr': 'auto 1fr',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
};
