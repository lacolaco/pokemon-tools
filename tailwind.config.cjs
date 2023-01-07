/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./projects/app/src/**/*.{html,ts,scss}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
};
